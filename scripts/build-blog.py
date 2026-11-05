"""Writes the article cards from blog/articles/index.json into blog/index.html.

The cards are also rendered by js/blog.js (which handles search), but having
them in the HTML gives search engines plain links to every article without
running JavaScript. Run this whenever index.json changes:

    python scripts/build-blog.py          # rewrite blog/index.html
    python scripts/build-blog.py --check  # exit 1 if blog/index.html is out of date

Keep the card markup in sync with createArticleCard() in js/blog.js.
"""

import datetime
import html
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
INDEX_JSON = ROOT / 'blog' / 'articles' / 'index.json'
BLOG_PAGE = ROOT / 'blog' / 'index.html'
REGION = re.compile(r'(<!-- articles:start -->\n)(.*?)([ \t]*<!-- articles:end -->)', re.S)
INDENT = ' ' * 16


def esc(value):
    return html.escape(str(value if value is not None else ''), quote=True)


def format_date(value):
    d = datetime.date.fromisoformat(value)
    return f'{d:%B} {d.day}, {d.year}'


def preview(image):
    if not image or not image.get('src'):
        return '<i class="fas fa-file-alt fa-3x" aria-hidden="true"></i>'
    size = ''
    if image.get('width') and image.get('height'):
        size = f' width="{esc(image["width"])}" height="{esc(image["height"])}"'
    alt = esc(image.get('alt'))
    light = esc(image['src'])
    dark = esc(image.get('srcDark') or image['src'])
    return (
        '<div class="themed-preview-image">\n'
        f'{INDENT}            <img src="assets/{light}"{size} alt="{alt}" class="preview-light" loading="lazy">\n'
        f'{INDENT}            <img src="assets/{dark}"{size} alt="{alt}" class="preview-dark" loading="lazy">\n'
        f'{INDENT}        </div>'
    )


def card(article):
    slug = esc(re.sub(r'\.html$', '', article.get('file', '')))
    author = ''
    if article.get('author'):
        author = f'\n{INDENT}            <span class="tag"><i class="fas fa-user" aria-hidden="true"></i> {esc(article["author"])}</span>'
    return f'''{INDENT}<div class="project-card">
{INDENT}    <div class="project-image">
{INDENT}        {preview(article.get("image"))}
{INDENT}    </div>
{INDENT}    <div class="project-content">
{INDENT}        <h3 class="project-title">{esc(article.get("title"))}</h3>
{INDENT}        <div class="project-tags" style="margin-bottom: 0.5rem;">
{INDENT}            <span class="tag"><i class="far fa-calendar" aria-hidden="true"></i> {esc(format_date(article["date"]))}</span>{author}
{INDENT}        </div>
{INDENT}        <p class="project-description">{esc(article.get("excerpt"))}</p>
{INDENT}        <div class="project-links">
{INDENT}            <a href="articles/{slug}" class="link">
{INDENT}                <i class="fas fa-book-open" aria-hidden="true"></i> Read Article
{INDENT}            </a>
{INDENT}        </div>
{INDENT}    </div>
{INDENT}</div>
'''


def main():
    articles = json.loads(INDEX_JSON.read_text(encoding='utf-8'))['articles']
    articles.sort(key=lambda a: a['date'], reverse=True)
    cards = ''.join(card(a) for a in articles)

    raw = BLOG_PAGE.read_bytes().decode('utf-8')
    crlf = '\r\n' in raw
    page = raw.replace('\r\n', '\n')
    if not REGION.search(page):
        sys.exit('blog/index.html is missing the <!-- articles:start --> / <!-- articles:end --> markers')
    updated = REGION.sub(lambda m: m.group(1) + cards + m.group(3), page, count=1)

    if '--check' in sys.argv:
        if updated != page:
            print('blog/index.html is out of date, run: python scripts/build-blog.py')
            sys.exit(1)
        print('blog/index.html is up to date')
        return

    if updated != page:
        BLOG_PAGE.write_bytes((updated.replace('\n', '\r\n') if crlf else updated).encode('utf-8'))
        print(f'wrote {len(articles)} article(s) into blog/index.html')
    else:
        print('blog/index.html already up to date')


if __name__ == '__main__':
    main()
