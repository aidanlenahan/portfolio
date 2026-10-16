// Regenerates the project cards in projects.html from projectroot's projects.json.
// Usage: node scripts/build-projects.mjs <path/to/projects.json> [projects.html]
//
// Only projects with a "portfolio" block are rendered. Everything between the
// <!-- projects:start --> and <!-- projects:end --> markers is replaced.
//
// Descriptions longer than TRUNCATE_AT characters are cut short on the card
// with a "Read more" button that opens a modal ("portfolio": { "modal": true |
// false } overrides that). The full text, plus the same images, tags and links
// projectroot's modal uses, goes into a JSON block that js/projects.js reads
// to fill the modal.
//
// projects.json and every image it references are also copied into
// projects-data/, so the portfolio keeps working from its own copy even when
// alenahan.net or the projectroot repo is unreachable.

import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { posix } from 'node:path';

const { dirname, join, normalize } = posix;

const [jsonPath, htmlPath = 'projects.html'] = process.argv.slice(2);
if (!jsonPath) {
    console.error('usage: build-projects.mjs <projects.json> [projects.html]');
    process.exit(1);
}

const SNAPSHOT_DIR = 'projects-data';
const START = '<!-- projects:start -->';
const END = '<!-- projects:end -->';
const TRUNCATE_AT = 180;

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const sourceRoot = dirname(jsonPath);

// Link hrefs come from another repo, so only http:, https:, mailto: and
// relative / root-relative paths get through. An unsafe href fails the build
// (non-zero exit), so the workflow commits nothing and the last good
// projects.html stays live, rather than silently publishing a card with a bad
// or missing link.
function safeHref(href, title) {
    const raw = String(href ?? '');
    // Browsers ignore leading/trailing whitespace and control characters and
    // drop tabs/newlines anywhere in a URL, so strip them before reading the scheme.
    const cleaned = raw.replace(/[\u0000- \u007f-\u009f]+/g, '');
    const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(cleaned);
    const ok = cleaned !== ''
        && !/^(javascript|data|vbscript):/i.test(cleaned)
        && (!scheme || ['http', 'https', 'mailto'].includes(scheme[1].toLowerCase()));
    if (!ok) {
        throw new Error(`unsafe link href ${JSON.stringify(raw)} in project "${title}"`);
    }
    return raw.trim();
}

// Copies a projectroot-relative image into the snapshot and returns the path
// the portfolio serves it from. Absolute URLs are left as they are.
function localImage(src) {
    if (/^[a-z]+:|^\/\//i.test(src)) return src;
    const rel = normalize(src).replace(/^\/+/, '');
    if (rel.startsWith('..')) throw new Error(`image path escapes projectroot: ${src}`);
    const from = join(sourceRoot, rel);
    if (!existsSync(from)) throw new Error(`missing image: ${src}`);
    const to = join(SNAPSHOT_DIR, rel);
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(from, to);
    return `${SNAPSHOT_DIR}/${rel}`;
}

function normalizeImages(images, title) {
    return (images || []).map((img, i) => {
        const { src, alt } = typeof img === 'string' ? { src: img } : img;
        return { src: localImage(src), alt: alt || `${title} screenshot ${i + 1}` };
    });
}

// Resolves which fields the portfolio shows; omitted fields fall back to the
// project's own values.
function toPortfolio(p) {
    const pf = p.portfolio;
    const from = pf.descriptionFrom || 'custom';
    const description =
        from === 'summary' ? p.summary :
        from === 'modal' ? p.modal?.description :
        pf.description;
    const title = pf.title || p.title;
    return {
        id: p.id,
        title,
        description,
        images: normalizeImages(pf.images || p.modal?.images, title),
        // The modal shows projectroot's modal images, falling back to the card's.
        modalImages: normalizeImages(p.modal?.images || pf.images, title),
        tags: pf.tags || p.tags || [],
        icon: pf.icon || 'fas fa-code',
        featured: !!pf.featured,
        // portfolio.modal: true/false forces the desktop modal on or off;
        // omitted, it's on when the description is longer than TRUNCATE_AT.
        modal: typeof pf.modal === 'boolean' ? pf.modal : String(description ?? '').trim().length > TRUNCATE_AT,
        // portfolio.links ([{ href, label, icon }]) replaces the single p.link button.
        links: (pf.links || (p.link ? [{ href: p.link, label: pf.linkLabel, icon: pf.linkIcon }] : []))
            .map(l => ({ ...l, href: safeHref(l.href, title), icon: linkIcon(l) })),
    };
}

function renderMedia(c) {
    if (c.images.length === 0) {
        return `<i class="${esc(c.icon)} fa-3x" aria-hidden="true"></i>`;
    }
    // Each image sits in a frame over a blurred copy of itself, so any space
    // left beside it takes on the image's own edge colors (see .project-shot).
    const imgs = c.images
        .map(img => `<div class="project-shot">
                            <img class="project-shot-backdrop" src="${esc(img.src)}" alt="" aria-hidden="true" loading="lazy">
                            <img src="${esc(img.src)}" alt="${esc(img.alt)}" loading="lazy">
                        </div>`)
        .join('\n                        ');
    // Multiple images become a swipeable strip (see .project-gallery in style.css).
    return c.images.length === 1
        ? imgs
        : `<div class="project-gallery">\n                        ${imgs}\n                    </div>`;
}

function linkIcon(l) {
    return l.icon || (/github\.com/.test(l.href) ? 'fab fa-github' : 'fas fa-external-link-alt');
}

// Cuts at the last word boundary before the limit; null when no cut is needed.
function truncate(text, limit) {
    const s = String(text ?? '').trim();
    if (s.length <= limit) return null;
    const cut = s.slice(0, limit + 1);
    const space = cut.lastIndexOf(' ');
    return (space > limit / 2 ? cut.slice(0, space) : s.slice(0, limit)).replace(/[\s.,;:!?-]+$/, '') + '…';
}

function renderLink(l) {
    return `
                            <a href="${esc(l.href)}" target="_blank" rel="noopener noreferrer" class="link">
                                <i class="${esc(l.icon)}" aria-hidden="true"></i> ${esc(l.label || 'Visit Site')}<span class="sr-only"> (opens in new tab)</span>
                            </a>`;
}

function renderCard(c) {
    const tags = c.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('\n                            ');
    const link = c.links.length ? `
                        <div class="project-links">${c.links.map(renderLink).join('')}
                        </div>` : '';
    // Clicking the card opens the modal, or the first link when there's no
    // modal on desktop. On mobile every card opens the modal, which holds the
    // tags and links the card hides there, so non-modal cards get a
    // mobile-only "Details" button as the keyboard/screen reader target.
    const open = c.modal ? 'modal' : c.links.length ? 'link' : '';
    const more = c.modal
        ? `<button type="button" class="project-more" data-project="${esc(c.id)}" aria-haspopup="dialog">Read more<span class="sr-only"> about ${esc(c.title)}</span></button>`
        : `<button type="button" class="project-more project-more-mobile" data-project="${esc(c.id)}" aria-haspopup="dialog">Details<span class="sr-only"> about ${esc(c.title)}</span></button>`;
    return `
                <div class="project-card${c.featured ? ' featured-project' : ''}" data-project="${esc(c.id)}"${open ? ` data-open="${open}"` : ''}>
                    <div class="project-image${c.images.length ? ' has-media' : ''}">
                        ${renderMedia(c)}
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${esc(c.title)}</h3>
                        <p class="project-description">
                            ${esc(c.short || c.description)}
                            ${more}
                        </p>
                        <div class="project-tags">
                            ${tags}
                        </div>${link}
                    </div>
                </div>`;
}

const raw = readFileSync(jsonPath, 'utf8');
const { projects } = JSON.parse(raw);
if (!Array.isArray(projects)) {
    console.error(`${jsonPath} has no "projects" array; leaving projects.html untouched`);
    process.exit(1);
}

// Rebuilt from scratch each run so removed images don't linger.
rmSync(SNAPSHOT_DIR, { recursive: true, force: true });
mkdirSync(SNAPSHOT_DIR, { recursive: true });
writeFileSync(join(SNAPSHOT_DIR, 'projects.json'), raw);

const cards = projects
    .filter(p => p.portfolio)
    .map(toPortfolio)
    .map(c => ({ ...c, short: c.modal ? truncate(c.description, TRUNCATE_AT) : null }))
    .sort((a, b) => b.featured - a.featured);

// Every card needs data, since every card opens the modal on mobile.
const modalData = Object.fromEntries(cards.map(c => [c.id, {
    title: c.title,
    description: c.description,
    images: c.modalImages,
    tags: c.tags,
    links: c.links.map(({ href, label, icon }) => ({ href, label: label || 'Visit Site', icon })),
}]));
// Escaping "<" keeps a stray "</script>" in the data from closing the block.
const modalJson = JSON.stringify(modalData, null, 2).replace(/</g, '\\u003c');

const html = readFileSync(htmlPath, 'utf8');
const start = html.indexOf(START);
const end = html.indexOf(END);
if (start === -1 || end === -1 || end < start) {
    console.error(`${htmlPath} is missing the ${START} / ${END} markers`);
    process.exit(1);
}

const generated = `${START}
                <!-- Generated from aidanlenahan/projectroot projects.json — edit there, not here. -->${cards.map(renderCard).join('\n')}
                <script type="application/json" id="project-modal-data">
${modalJson}
                </script>
                ${END}`;
writeFileSync(htmlPath, html.slice(0, start) + generated + html.slice(end + END.length));
console.log(`Rendered ${cards.length} project card(s) into ${htmlPath}`);
