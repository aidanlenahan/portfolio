<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
    xmlns:html="http://www.w3.org/TR/REC-html40"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title>Sitemap | Aidan Lenahan</title>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="css/style.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                <style type="text/css">
                    .sitemap-container {
                        max-width: var(--container-width);
                        margin: 0 auto;
                        padding: var(--spacing-xl) var(--spacing-lg);
                    }
                    
                    .sitemap-header {
                        text-align: center;
                        margin-bottom: var(--spacing-xl);
                    }
                    
                    .sitemap-title {
                        font-size: 2.5rem;
                        font-weight: 700;
                        color: var(--text-primary);
                        margin-bottom: var(--spacing-sm);
                    }
                    
                    .sitemap-subtitle {
                        font-size: 1.1rem;
                        color: var(--text-secondary);
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    
                    .sitemap-info {
                        background: var(--bg-secondary);
                        border-left: 4px solid var(--accent-primary);
                        padding: var(--spacing-md);
                        margin-bottom: var(--spacing-xl);
                        border-radius: var(--border-radius-md);
                    }
                    
                    .sitemap-info p {
                        color: var(--text-secondary);
                        line-height: 1.6;
                        margin: 0;
                    }
                    
                    .sitemap-table {
                        width: 100%;
                        border-collapse: collapse;
                        background: var(--card-bg);
                        border-radius: var(--border-radius-lg);
                        overflow: hidden;
                        box-shadow: var(--shadow-md);
                    }
                    
                    .sitemap-table thead {
                        background: var(--bg-secondary);
                    }
                    
                    .sitemap-table th {
                        text-align: left;
                        padding: var(--spacing-md);
                        font-weight: 600;
                        color: var(--text-primary);
                        border-bottom: 2px solid var(--border-color);
                    }
                    
                    .sitemap-table td {
                        padding: var(--spacing-md);
                        border-bottom: 1px solid var(--border-color);
                        color: var(--text-primary);
                    }
                    
                    .sitemap-table tbody tr:hover {
                        background: var(--bg-secondary);
                    }
                    
                    .sitemap-table tbody tr:last-child td {
                        border-bottom: none;
                    }
                    
                    .url-cell a {
                        color: var(--accent-primary);
                        text-decoration: none;
                        word-break: break-all;
                        transition: color var(--transition-fast);
                    }
                    
                    .url-cell a:hover {
                        color: var(--accent-hover);
                        text-decoration: underline;
                    }
                    
                    .priority-badge {
                        display: inline-block;
                        padding: 0.25rem 0.75rem;
                        border-radius: var(--border-radius-sm);
                        font-size: 0.875rem;
                        font-weight: 600;
                    }
                    
                    .priority-high {
                        background: #d1fae5;
                        color: #065f46;
                    }
                    
                    [data-theme="dark"] .priority-high {
                        background: #064e3b;
                        color: #a7f3d0;
                    }
                    
                    .priority-medium {
                        background: #fef3c7;
                        color: #92400e;
                    }
                    
                    [data-theme="dark"] .priority-medium {
                        background: #78350f;
                        color: #fde68a;
                    }
                    
                    .priority-low {
                        background: var(--bg-secondary);
                        color: var(--text-secondary);
                    }
                    
                    @media (max-width: 768px) {
                        .sitemap-container {
                            padding: var(--spacing-lg) var(--spacing-md);
                        }
                        
                        .sitemap-title {
                            font-size: 2rem;
                        }
                        
                        .sitemap-table {
                            font-size: 0.875rem;
                        }
                        
                        .sitemap-table th,
                        .sitemap-table td {
                            padding: var(--spacing-sm);
                        }
                    }
                </style>
            </head>
            <body>
                <!-- Navigation -->
                <nav class="navbar" id="navbar">
                    <div class="container">
                        <div class="nav-wrapper">
                            <a href="./" class="logo">
                                <i class="fas fa-code"></i>
                                <span>AL</span>
                            </a>
                            
                            <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                            
                            <ul class="nav-menu" id="navMenu">
                                <li><a href="./" class="nav-link">Home</a></li>
                                <li><a href="about" class="nav-link">About</a></li>
                                <li><a href="projects" class="nav-link">Projects</a></li>
                                <li><a href="blog" class="nav-link">Blog</a></li>
                                <li><a href="techhelp" class="nav-link">Tech Help</a></li>
                                <li><a href="contact" class="nav-link">Contact</a></li>
                                <li>
                                    <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
                                        <i class="fas fa-moon"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div class="sitemap-container">
                    <div class="sitemap-header">
                        <h1 class="sitemap-title">
                            <i class="fas fa-sitemap"></i> Sitemap
                        </h1>
                        <p class="sitemap-subtitle">
                            A complete list of all pages on this website for search engines and visitors.
                        </p>
                    </div>
                    
                    <div class="sitemap-info">
                        <p>
                            <strong>About this sitemap:</strong> This file helps search engines like Google discover and index all pages on this website.
                            It contains <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs</strong> that are updated regularly.
                        </p>
                    </div>
                    
                    <table class="sitemap-table">
                        <thead>
                            <tr>
                                <th style="width: 50%">URL</th>
                                <th style="width: 20%">Last Modified</th>
                                <th style="width: 15%">Update Frequency</th>
                                <th style="width: 15%">Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="sitemap:urlset/sitemap:url">
                                <tr>
                                    <td class="url-cell">
                                        <a href="{sitemap:loc}">
                                            <xsl:value-of select="sitemap:loc"/>
                                        </a>
                                    </td>
                                    <td>
                                        <xsl:value-of select="sitemap:lastmod"/>
                                    </td>
                                    <td style="text-transform: capitalize;">
                                        <xsl:value-of select="sitemap:changefreq"/>
                                    </td>
                                    <td>
                                        <xsl:choose>
                                            <xsl:when test="sitemap:priority &gt;= 0.8">
                                                <span class="priority-badge priority-high">
                                                    <xsl:value-of select="sitemap:priority"/>
                                                </span>
                                            </xsl:when>
                                            <xsl:when test="sitemap:priority &gt;= 0.6">
                                                <span class="priority-badge priority-medium">
                                                    <xsl:value-of select="sitemap:priority"/>
                                                </span>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <span class="priority-badge priority-low">
                                                    <xsl:value-of select="sitemap:priority"/>
                                                </span>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </div>

                <!-- Footer -->
                <footer class="footer">
                    <div class="container">
                        <div class="footer-content">
                            <div class="footer-section">
                                <h3 class="footer-title">
                                    <i class="fas fa-code"></i> Aidan Lenahan
                                </h3>
                                <p class="footer-text">
                                    Cybersecurity enthusiast and technology professional.
                                </p>
                            </div>
                            
                            <div class="footer-section">
                                <h4 class="footer-heading">Navigation</h4>
                                <ul class="footer-links">
                                    <li><a href="./">Home</a></li>
                                    <li><a href="about">About</a></li>
                                    <li><a href="projects">Projects</a></li>
                                    <li><a href="blog">Blog</a></li>
                                    <li><a href="techhelp">Tech Help</a></li>
                                    <li><a href="contact">Contact</a></li>
                                </ul>
                            </div>
                            
                            <div class="footer-section">
                                <h4 class="footer-heading">Other Projects</h4>
                                <ul class="footer-links">
                                    <li><a href="https://dogs.aidanlenahan.com" target="_blank" rel="noopener noreferrer">Dog Walking Services</a></li>
                                </ul>
                            </div>
                            
                            <div class="footer-section">
                                <h4 class="footer-heading">Connect</h4>
                                <div class="social-links">
                                    <a href="https://github.com/aidanlenahan" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="social-link">
                                        <i class="fab fa-github"></i>
                                    </a>
                                    <a href="https://linkedin.com/in/aidanlenahan" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-link">
                                        <i class="fab fa-linkedin"></i>
                                    </a>
                                    <a href="mailto:aidan@aidanlenahan.com" aria-label="Email" class="social-link">
                                        <i class="fas fa-envelope"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <div class="footer-bottom">
                            <p>&copy; 2026 Aidan Lenahan. All rights reserved. · <a href="sitemap.xml" style="color: var(--text-tertiary); text-decoration: none;">Sitemap</a></p>
                        </div>
                    </div>
                </footer>

                <script src="js/main.js"></script>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
