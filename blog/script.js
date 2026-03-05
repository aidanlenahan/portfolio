// List of articles - each article should have metadata
const articles = [
    // Articles will be automatically loaded from the articles directory
    // Format: { title, date, author, excerpt, file }
];

// Fetch articles from the articles directory
async function loadArticles() {
    try {
        // Fetch the articles index file
        const response = await fetch('articles/index.json');
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

// Create article card HTML
function createArticleCard(article, searchTerm = '') {
    const card = document.createElement('a');
    card.href = `articles/${article.file}`;
    card.className = 'article-card';
    
    const title = searchTerm ? highlightText(article.title, searchTerm) : article.title;
    const excerpt = searchTerm ? highlightText(article.excerpt, searchTerm) : article.excerpt;
    
    card.innerHTML = `
        <h3>${title}</h3>
        <div class="article-meta">
            <span>📅 ${formatDate(article.date)}</span>
            ${article.author ? `<span>✍️ ${article.author}</span>` : ''}
        </div>
        <p class="article-excerpt">${excerpt}</p>
    `;
    
    return card;
}

// Display articles on the page
function displayArticles(articles) {
    const articleList = document.getElementById('article-list');
    
    if (articles.length === 0) {
        articleList.innerHTML = '<p class="no-articles">No articles yet. Check back soon!</p>';
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
        const card = createArticleCard(article);
        articleList.appendChild(card);
    });
}

// Store all articles globally for search
let allArticles = [];

// Highlight matching text in search results
function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Search articles by title or excerpt
function searchArticles(articles, searchTerm) {
    if (!searchTerm.trim()) {
        return articles;
    }
    
    const term = searchTerm.toLowerCase();
    return articles.filter(article => 
        article.title.toLowerCase().includes(term) ||
        article.excerpt.toLowerCase().includes(term)
    );
}

// Update search results count
function updateSearchCount(count, total, searchTerm) {
    const countElement = document.getElementById('search-results-count');
    if (searchTerm.trim()) {
        countElement.textContent = `Found ${count} of ${total} article${total !== 1 ? 's' : ''}`;
    } else {
        countElement.textContent = '';
    }
}

// Handle search input
function handleSearch(event) {
    const searchTerm = event.target.value;
    const filteredArticles = searchArticles(allArticles, searchTerm);
    
    // Clear and re-display articles with highlighting
    const articleList = document.getElementById('article-list');
    articleList.innerHTML = '';
    
    if (filteredArticles.length === 0) {
        articleList.innerHTML = '<p class="no-articles">No articles found matching your search.</p>';
        updateSearchCount(0, allArticles.length, searchTerm);
        return;
    }
    
    filteredArticles.forEach(article => {
        const card = createArticleCard(article, searchTerm);
        articleList.appendChild(card);
    });
    
    updateSearchCount(filteredArticles.length, allArticles.length, searchTerm);
}

// Initialize the blog
async function init() {
    allArticles = await loadArticles();
    displayArticles(allArticles);
    
    // Set up search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Load articles when page loads
document.addEventListener('DOMContentLoaded', init);
