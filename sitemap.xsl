<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
    xmlns:html="http://www.w3.org/TR/REC-html40"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title>XML Sitemap</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <style type="text/css">
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        padding: 2rem;
                    }
                    
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                        overflow: hidden;
                    }
                    
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 2rem;
                    }
                    
                    .header h1 {
                        font-size: 2rem;
                        margin-bottom: 0.5rem;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }
                    
                    .header p {
                        opacity: 0.9;
                        font-size: 1rem;
                    }
                    
                    .content {
                        padding: 2rem;
                    }
                    
                    .info-box {
                        background: #f8f9fa;
                        border-left: 4px solid #667eea;
                        padding: 1rem;
                        margin-bottom: 2rem;
                        border-radius: 4px;
                    }
                    
                    .info-box p {
                        color: #495057;
                        line-height: 1.6;
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    
                    thead {
                        background: #f8f9fa;
                    }
                    
                    th {
                        text-align: left;
                        padding: 1rem;
                        font-weight: 600;
                        color: #495057;
                        border-bottom: 2px solid #dee2e6;
                    }
                    
                    td {
                        padding: 1rem;
                        border-bottom: 1px solid #dee2e6;
                        color: #212529;
                    }
                    
                    tr:hover {
                        background: #f8f9fa;
                    }
                    
                    .url-cell a {
                        color: #667eea;
                        text-decoration: none;
                        word-break: break-all;
                    }
                    
                    .url-cell a:hover {
                        text-decoration: underline;
                    }
                    
                    .priority-high {
                        color: #28a745;
                        font-weight: 600;
                    }
                    
                    .priority-medium {
                        color: #ffc107;
                        font-weight: 600;
                    }
                    
                    .priority-low {
                        color: #6c757d;
                        font-weight: 600;
                    }
                    
                    .footer {
                        text-align: center;
                        padding: 1.5rem;
                        background: #f8f9fa;
                        color: #6c757d;
                        font-size: 0.9rem;
                    }
                    
                    @media (max-width: 768px) {
                        body {
                            padding: 1rem;
                        }
                        
                        .header h1 {
                            font-size: 1.5rem;
                        }
                        
                        .content {
                            padding: 1rem;
                        }
                        
                        table {
                            font-size: 0.9rem;
                        }
                        
                        th, td {
                            padding: 0.5rem;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>
                            <span>📄</span> XML Sitemap
                        </h1>
                        <p>This sitemap helps search engines discover and index the pages on this website.</p>
                    </div>
                    
                    <div class="content">
                        <div class="info-box">
                            <p>
                                <strong>What is a sitemap?</strong><br/>
                                A sitemap is a file that lists all the important pages of a website to help search engines like Google crawl and index them more efficiently.
                                This sitemap contains <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> URLs.
                            </p>
                        </div>
                        
                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 50%">URL</th>
                                    <th style="width: 20%">Last Modified</th>
                                    <th style="width: 15%">Change Freq</th>
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
                                        <td>
                                            <xsl:value-of select="sitemap:changefreq"/>
                                        </td>
                                        <td>
                                            <xsl:choose>
                                                <xsl:when test="sitemap:priority &gt;= 0.8">
                                                    <span class="priority-high">
                                                        <xsl:value-of select="sitemap:priority"/>
                                                    </span>
                                                </xsl:when>
                                                <xsl:when test="sitemap:priority &gt;= 0.6">
                                                    <span class="priority-medium">
                                                        <xsl:value-of select="sitemap:priority"/>
                                                    </span>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <span class="priority-low">
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
                    
                    <div class="footer">
                        Generated by aidanlenahan.com sitemap
                    </div>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
