// Regenerates the project cards in projects.html from projectroot's projects.json.
// Usage: node scripts/build-projects.mjs <path/to/projects.json> [projects.html]
//
// Only projects with a "portfolio" block are rendered. Everything between the
// <!-- projects:start --> and <!-- projects:end --> markers is replaced.
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

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const sourceRoot = dirname(jsonPath);

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
    return {
        title: pf.title || p.title,
        description,
        images: normalizeImages(pf.images || p.modal?.images, pf.title || p.title),
        tags: pf.tags || p.tags || [],
        icon: pf.icon || 'fas fa-code',
        featured: !!pf.featured,
        // portfolio.links ([{ href, label, icon }]) replaces the single p.link button.
        links: pf.links || (p.link ? [{ href: p.link, label: pf.linkLabel, icon: pf.linkIcon }] : []),
    };
}

function renderMedia(c) {
    if (c.images.length === 0) {
        return `<i class="${esc(c.icon)} fa-3x"></i>`;
    }
    const imgs = c.images
        .map(img => `<img src="${esc(img.src)}" alt="${esc(img.alt)}" loading="lazy">`)
        .join('\n                        ');
    // Multiple images become a swipeable strip (see .project-gallery in style.css).
    return c.images.length === 1
        ? imgs
        : `<div class="project-gallery">\n                        ${imgs}\n                    </div>`;
}

function renderLink(l) {
    const icon = l.icon || (/github\.com/.test(l.href) ? 'fab fa-github' : 'fas fa-external-link-alt');
    return `
                            <a href="${esc(l.href)}" target="_blank" rel="noopener noreferrer" class="link">
                                <i class="${esc(icon)}"></i> ${esc(l.label || 'Visit Site')}
                            </a>`;
}

function renderCard(c) {
    const tags = c.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('\n                            ');
    const link = c.links.length ? `
                        <div class="project-links">${c.links.map(renderLink).join('')}
                        </div>` : '';
    return `
                <div class="project-card${c.featured ? ' featured-project' : ''}">
                    <div class="project-image${c.images.length ? ' has-media' : ''}">
                        ${renderMedia(c)}
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${esc(c.title)}</h3>
                        <p class="project-description">
                            ${esc(c.description)}
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
    .sort((a, b) => b.featured - a.featured);

const html = readFileSync(htmlPath, 'utf8');
const start = html.indexOf(START);
const end = html.indexOf(END);
if (start === -1 || end === -1 || end < start) {
    console.error(`${htmlPath} is missing the ${START} / ${END} markers`);
    process.exit(1);
}

const generated = `${START}
                <!-- Generated from aidanlenahan/projectroot projects.json — edit there, not here. -->${cards.map(renderCard).join('\n')}
                ${END}`;
writeFileSync(htmlPath, html.slice(0, start) + generated + html.slice(end + END.length));
console.log(`Rendered ${cards.length} project card(s) into ${htmlPath}`);
