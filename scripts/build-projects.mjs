// Regenerates the project cards in projects.html from projectroot's projects.json.
// Usage: node scripts/build-projects.mjs <path/to/projects.json> [projects.html]
//
// Only projects with a "portfolio" block are rendered. Everything between the
// <!-- projects:start --> and <!-- projects:end --> markers is replaced.

import { readFileSync, writeFileSync } from 'node:fs';

const [jsonPath, htmlPath = 'projects.html'] = process.argv.slice(2);
if (!jsonPath) {
    console.error('usage: build-projects.mjs <projects.json> [projects.html]');
    process.exit(1);
}

// Relative image paths in projects.json live on project.alenahan.net.
const IMAGE_BASE = process.env.PROJECTS_BASE_URL || 'https://project.alenahan.net/';
const START = '<!-- projects:start -->';
const END = '<!-- projects:end -->';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

function normalizeImages(images, title) {
    return (images || []).map((img, i) => {
        const { src, alt } = typeof img === 'string' ? { src: img } : img;
        return { src: new URL(src, IMAGE_BASE).href, alt: alt || `${title} screenshot ${i + 1}` };
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
        link: p.link,
        linkLabel: pf.linkLabel || 'Visit Site',
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

function renderCard(c) {
    const linkIcon = /github\.com/.test(c.link || '') ? 'fab fa-github' : 'fas fa-external-link-alt';
    const tags = c.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('\n                            ');
    const link = c.link ? `
                        <div class="project-links">
                            <a href="${esc(c.link)}" target="_blank" rel="noopener noreferrer" class="link">
                                <i class="${linkIcon}"></i> ${esc(c.linkLabel)}
                            </a>
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

const { projects } = JSON.parse(readFileSync(jsonPath, 'utf8'));
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
