"""Writes the Content-Security-Policy <meta> tag into every HTML page.

GitHub Pages can't send custom headers, so the policy lives in a <meta> tag.
Inline <script> blocks are allowed by hash, which means the policy must be
regenerated whenever an inline script changes (including whitespace):

    python scripts/update-csp.py          # rewrite pages
    python scripts/update-csp.py --check  # exit 1 if any page is out of date

One site-wide policy is used: the union of every page's inline-script hashes.
"""

import base64
import hashlib
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKIP_DIRS = {'.git', '.github', 'node_modules', 'scripts'}

INLINE_SCRIPT = re.compile(r'<script>(.*?)</script>', re.S)
CSP_META = re.compile(r'[ \t]*<meta http-equiv="Content-Security-Policy"[^>]*>\r?\n')
CHARSET_META = re.compile(r'[ \t]*<meta charset="[^"]*">\r?\n', re.I)
HEAD_OPEN = re.compile(r'<head>\r?\n')

POLICY = [
    "default-src 'self'",
    "script-src 'self' {hashes} https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
    "font-src 'self' https://cdnjs.cloudflare.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
    "frame-src https://www.googletagmanager.com",
    "manifest-src 'self'",
    "worker-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
]


def pages():
    for path in sorted(ROOT.rglob('*.html')):
        if not SKIP_DIRS.intersection(path.relative_to(ROOT).parts):
            yield path


def script_hash(body):
    # Browsers hash the parsed text, and the HTML parser turns CRLF into LF.
    data = body.replace('\r\n', '\n').encode('utf-8')
    return "'sha256-" + base64.b64encode(hashlib.sha256(data).digest()).decode() + "'"


def build_policy(paths):
    hashes = set()
    for path in paths:
        text = path.read_text(encoding='utf-8')
        hashes.update(script_hash(body) for body in INLINE_SCRIPT.findall(text))
    return '; '.join(POLICY).format(hashes=' '.join(sorted(hashes)))


def with_policy(text, policy):
    """Returns the page with charset first in <head>, then the CSP meta."""
    newline = '\r\n' if '\r\n' in text else '\n'
    text = CSP_META.sub('', text)
    head = HEAD_OPEN.search(text)
    if not head:
        raise ValueError('no <head>')

    charset = CHARSET_META.search(text)
    charset_line = charset.group(0).strip() if charset else '<meta charset="UTF-8">'
    if charset:
        text = text[:charset.start()] + text[charset.end():]

    first = re.match(r'[ \t]*', text[head.end():]).group(0) or '    '
    insert = (f'{first}{charset_line}{newline}'
              f'{first}<meta http-equiv="Content-Security-Policy" content="{policy}">{newline}')
    return text[:head.end()] + insert + text[head.end():]


def main():
    check = '--check' in sys.argv
    paths = list(pages())
    policy = build_policy(paths)
    stale = []
    for path in paths:
        raw = path.read_bytes().decode('utf-8')
        updated = with_policy(raw, policy)
        if updated != raw:
            stale.append(path.relative_to(ROOT).as_posix())
            if not check:
                path.write_bytes(updated.encode('utf-8'))
    verb = 'out of date' if check else 'updated'
    print(f'{len(stale)} page(s) {verb}' + (': ' + ', '.join(stale) if stale else ''))
    return 1 if check and stale else 0


if __name__ == '__main__':
    sys.exit(main())
