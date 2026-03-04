// Blog functionality for main website

// Load articles from blog directory
async function loadArticles() {
    try {
        const response = await fetch('blog/articles/index.json');
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Highlight matching text in search results
function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Create article card HTML using site theme
function createArticleCard(article, searchTerm = '') {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const title = searchTerm ? highlightText(article.title, searchTerm) : article.title;
    const excerpt = searchTerm ? highlightText(article.excerpt, searchTerm) : article.excerpt;
    
    card.innerHTML = `
        <div class="project-image">
            <i class="fas fa-file-alt fa-3x"></i>
        </div>
        <div class="project-content">
            <h3 class="project-title">${title}</h3>
            <div class="project-tags" style="margin-bottom: 0.5rem;">
                <span class="tag"><i class="far fa-calendar"></i> ${formatDate(article.date)}</span>
                ${article.author ? `<span class="tag"><i class="fas fa-user"></i> ${article.author}</span>` : ''}
            </div>
            <p class="project-description">${excerpt}</p>
            <div class="project-links">
                <a href="blog/articles/${article.file}" class="link">
                    <i class="fas fa-book-open"></i> Read Article
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
        return;
    }
    
    // Sort articles by date (newest first)
    const sortedArticles = articles.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
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
