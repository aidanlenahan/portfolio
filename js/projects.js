/**
 * Project detail modal for projects.html, a port of projectroot's modal.
 * Data comes from the #project-modal-data block written by
 * scripts/build-projects.mjs. Clicking a card opens its modal (or its first
 * link, for cards without one on desktop); on mobile every card opens the
 * modal. projects#<id> opens that project directly.
 */

(function() {
    'use strict';

    const modal = document.getElementById('projectModal');
    const dataEl = document.getElementById('project-modal-data');
    if (!modal || !dataEl || typeof modal.showModal !== 'function') return;

    let projects;
    try {
        projects = JSON.parse(dataEl.textContent);
    } catch (e) {
        return;
    }

    const body = modal.querySelector('.project-modal-body');
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    // Same frame as the cards: the image fills the height over a blurred copy of itself.
    function buildShot(img) {
        const shot = el('div', 'project-shot');
        const backdrop = el('img', 'project-shot-backdrop');
        backdrop.src = img.src;
        backdrop.alt = '';
        backdrop.setAttribute('aria-hidden', 'true');
        const image = el('img');
        image.src = img.src;
        image.alt = img.alt || '';
        shot.append(backdrop, image);
        return shot;
    }

    function buildCarousel(images) {
        const wrap = el('div', 'project-carousel');
        const track = el('div', 'project-carousel-track');
        images.forEach(function(img) {
            const slide = el('div', 'project-carousel-slide');
            slide.append(buildShot(img));
            track.append(slide);
        });
        wrap.append(track);
        if (images.length < 2) return wrap;

        wrap.setAttribute('role', 'region');
        wrap.setAttribute('aria-roledescription', 'carousel');
        wrap.setAttribute('aria-label', 'Screenshots');

        const prev = el('button', 'project-carousel-nav prev');
        const next = el('button', 'project-carousel-nav next');
        prev.type = next.type = 'button';
        prev.innerHTML = '<i class="fas fa-chevron-left" aria-hidden="true"></i>';
        next.innerHTML = '<i class="fas fa-chevron-right" aria-hidden="true"></i>';
        prev.setAttribute('aria-label', 'Previous image');
        next.setAttribute('aria-label', 'Next image');

        const dots = el('div', 'project-carousel-dots');
        const dotEls = images.map(function(_, i) {
            const d = el('button');
            d.type = 'button';
            d.setAttribute('aria-label', 'Image ' + (i + 1));
            d.addEventListener('click', function() { go(i); });
            dots.append(d);
            return d;
        });

        let index = 0;
        function go(i) {
            index = (i + images.length) % images.length;
            track.scrollTo({ left: track.clientWidth * index, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
        function sync() {
            index = Math.round(track.scrollLeft / track.clientWidth) || 0;
            dotEls.forEach(function(d, i) {
                d.classList.toggle('active', i === index);
                d.setAttribute('aria-current', i === index ? 'true' : 'false');
            });
        }
        prev.addEventListener('click', function() { go(index - 1); });
        next.addEventListener('click', function() { go(index + 1); });
        track.addEventListener('scroll', sync, { passive: true });
        wrap.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') go(index - 1);
            if (e.key === 'ArrowRight') go(index + 1);
        });
        requestAnimationFrame(sync);

        wrap.append(prev, next, dots);
        return wrap;
    }

    function openModal(id) {
        const p = projects[id];
        if (!p) return false;
        const parts = [];

        if (p.images && p.images.length) parts.push(buildCarousel(p.images));

        const text = el('div', 'project-modal-text');
        const heading = el('h2', 'project-title', p.title);
        heading.id = 'projectModalTitle';
        text.append(heading, el('p', 'project-description', p.description));

        if (p.tags && p.tags.length) {
            const tags = el('div', 'project-tags');
            p.tags.forEach(function(t) { tags.append(el('span', 'tag', t)); });
            text.append(tags);
        }

        if (p.links && p.links.length) {
            const links = el('div', 'project-links');
            p.links.forEach(function(l) {
                const a = el('a', 'link');
                a.href = l.href;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                const icon = el('i', l.icon);
                icon.setAttribute('aria-hidden', 'true');
                a.append(icon, ' ' + l.label, el('span', 'sr-only', ' (opens in new tab)'));
                links.append(a);
            });
            text.append(links);
        }
        parts.push(text);

        body.replaceChildren.apply(body, parts);
        body.scrollTop = 0;
        history.replaceState(null, '', '#' + encodeURIComponent(id));
        modal.showModal();
        return true;
    }

    // Matches the breakpoint where style.css hides card tags and links.
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    document.addEventListener('click', function(e) {
        const button = e.target.closest('.project-more');
        if (button) {
            openModal(button.dataset.project);
            return;
        }

        // Anywhere else on a card: real links keep their own behavior, and a
        // click that ends a text selection shouldn't navigate.
        const card = e.target.closest('.project-card[data-project]');
        if (!card || e.target.closest('a, button')) return;
        const selection = window.getSelection && window.getSelection();
        if (selection && !selection.isCollapsed && card.contains(selection.anchorNode)) return;

        if (mobileQuery.matches || card.dataset.open === 'modal') {
            openModal(card.dataset.project);
        } else if (card.dataset.open === 'link') {
            const link = card.querySelector('.project-links a');
            if (link) window.open(link.href, '_blank', 'noopener');
        }
    });

    modal.querySelector('.project-modal-close').addEventListener('click', function() { modal.close(); });
    // Clicks on the backdrop land on the <dialog> itself, not its content.
    modal.addEventListener('click', function(e) { if (e.target === modal) modal.close(); });
    modal.addEventListener('close', function() {
        history.replaceState(null, '', location.pathname + location.search);
    });

    if (location.hash) {
        try { openModal(decodeURIComponent(location.hash.slice(1))); } catch (e) { /* bad hash */ }
    }
})();
