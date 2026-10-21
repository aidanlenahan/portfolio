// Blog functionality for main website

// Resolve the index against this script (js/blog.js -> blog/articles/index.json),
// so it doesn't depend on the depth of the page that loads it.
const ARTICLES_INDEX_URL = document.currentScript
    ? new URL('../blog/articles/index.json', document.currentScript.src).href
    : 'articles/index.json';

// Escape text for safe insertion into innerHTML
function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

// Escape regex metacharacters so a search term is matched literally
function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Parse YYYY-MM-DD as a local date (new Date('YYYY-MM-DD') is UTC midnight,
// which shows the previous day west of UTC)
function parseDate(dateString) {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString)
        ? new Date(dateString + 'T00:00:00')
        : new Date(dateString);
}

// Load articles from blog directory
async function loadArticles() {
    try {
        const response = await fetch(ARTICLES_INDEX_URL);
        if (!response.ok) {
            throw new Error('Failed to load articles');
        }
        const articlesData = await response.json();
        return articlesData.articles || [];
    } catch (error) {
        console.error('Error loading articles:', error);
        return [];
    }
}

// Format date to readable string
function formatDate(dateString) {
    const date = parseDate(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Highlight matching text in search results. Returns HTML: every piece of the
// text is escaped, and only the matches are wrapped in the highlight span.
function highlightText(text, searchTerm) {
    const value = String(text ?? '');
    if (!searchTerm) return escapeHtml(value);
    // With a capturing group, split() puts the matches at the odd indexes.
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    return value.split(regex)
        .map((part, i) => i % 2 ? `<span class="search-highlight">${escapeHtml(part)}</span>` : escapeHtml(part))
        .join('');
}

// Create article card HTML using site theme
function createArticleCard(article, searchTerm = '') {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const title = highlightText(article.title, searchTerm);
    const excerpt = highlightText(article.excerpt, searchTerm);
    const author = highlightText(article.author, searchTerm);
    const slug = escapeHtml(String(article.file ?? '').replace(/\.html$/, ''));
    const previewMedia = article.file === 'pantry-lighting.html'
        ? `
            <div class="themed-preview-image">
                <img src="assets/pantry-schematic-light.webp" alt="Pantry lighting circuit schematic" class="preview-light" loading="lazy">
                <img src="assets/pantry-schematic-dark.webp" alt="Pantry lighting circuit schematic" class="preview-dark" loading="lazy">
            </div>
        `
        : article.file === 'secdiagdrop.html'
            ? `
                <div class="themed-preview-image">
                    <img src="assets/secdiagdrop-emailnotify.png" width="946" height="543" alt="Email notification asking for approval to upload a diagnostic report" class="preview-light" loading="lazy">
                    <img src="assets/secdiagdrop-emailnotify.png" width="946" height="543" alt="Email notification asking for approval to upload a diagnostic report" class="preview-dark" loading="lazy">
                </div>
            `
            : '<i class="fas fa-file-alt fa-3x" aria-hidden="true"></i>';
    
    card.innerHTML = `
        <div class="project-image">
            ${previewMedia}
        </div>
        <div class="project-content">
            <h3 class="project-title">${title}</h3>
            <div class="project-tags" style="margin-bottom: 0.5rem;">
                <span class="tag"><i class="far fa-calendar" aria-hidden="true"></i> ${escapeHtml(formatDate(article.date))}</span>
                ${article.author ? `<span class="tag"><i class="fas fa-user" aria-hidden="true"></i> ${author}</span>` : ''}
            </div>
            <p class="project-description">${excerpt}</p>
            <div class="project-links">
                <a href="articles/${slug}" class="link">
                    <i class="fas fa-book-open" aria-hidden="true"></i> Read Article
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// Display articles on the page
function displayArticles(articles, searchTerm = '') {
    const articleList = document.getElementById('article-list');
    
    if (articles.length === 0) {
        articleList.innerHTML = '<div class="container"><p class="no-articles" style="text-align: center; color: var(--text-secondary);">No articles found.</p></div>';
        updateSearchCount(0, searchTerm);
        return;
    }

    // Sort articles by date (newest first)
    const sortedArticles = articles.sort((a, b) =>
        parseDate(b.date) - parseDate(a.date)
    );
    
    // Clear loading message
    articleList.innerHTML = '';
    
    // Create and append article cards
    sortedArticles.forEach(article => {
        const card = createArticleCard(article, searchTerm);
        articleList.appendChild(card);
    });
    
    // Update search results count
    updateSearchCount(articles.length, searchTerm);
}

// Update search results count
function updateSearchCount(count, searchTerm) {
    const countElement = document.getElementById('search-results-count');
    if (searchTerm && countElement) {
        countElement.textContent = `Found ${count} article${count !== 1 ? 's' : ''}`;
        countElement.style.display = 'block';
    } else if (countElement) {
        countElement.style.display = 'none';
    }
}

// Search articles by title or excerpt
function searchArticles(articles, searchTerm) {
    if (!searchTerm.trim()) {
        return articles;
    }
    
    const term = searchTerm.toLowerCase();
    return articles.filter(article => 
        article.title.toLowerCase().includes(term) ||
        article.excerpt.toLowerCase().includes(term) ||
        (article.author && article.author.toLowerCase().includes(term))
    );
}

// Store all articles globally
let allArticles = [];

// Initialize blog page
async function initBlog() {
    // Only the blog index has an article list
    const articleList = document.getElementById('article-list');
    if (!articleList) return;

    // Load articles
    allArticles = await loadArticles();
    displayArticles(allArticles);
    
    // Setup search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            const filteredArticles = searchArticles(allArticles, searchTerm);
            displayArticles(filteredArticles, searchTerm);
        });
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlog);
} else {
    initBlog();
}
