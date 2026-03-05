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
                    body {
                        padding: var(--spacing-xl) var(--spacing-lg);
                        min-height: 100vh;
                    }
                    
                    .sitemap-container {
                        max-width: var(--container-width);
                        margin: 0 auto;
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
                        body {
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
                <div class="sitemap-container">
                    <div class="sitemap-header">
                        <h1 class="sitemap-title">
                            Sitemap
                        </h1>
                        <p class="sitemap-subtitle">
                            All pages on aidanlenahan.com
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

                <script src="js/main.js"></script>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
