#!/usr/bin/env python3
"""Check static entry points, local asset references and source syntax; no deps."""
import ast
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
import subprocess
import sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
errors = []
reference_count = 0


def check_reference(source, value):
    global reference_count
    value = value.strip()
    url = urlsplit(value)
    if not value or value.startswith('#') or url.scheme or url.netloc:
        return
    name = unquote(url.path)
    if not name:
        return
    target = (DIST / name.lstrip('/') if name.startswith('/') else source.parent / name).resolve()
    reference_count += 1
    if not target.is_relative_to(DIST.resolve()):
        errors.append(f'{source.relative_to(ROOT)}: reference outside dist: {value}')
    elif not target.exists():
        errors.append(f'{source.relative_to(ROOT)}: missing local resource: {value}')


class References(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.source = source

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        keys = ['src'] if tag in {'script', 'img', 'source', 'video', 'audio', 'iframe'} else []
        if tag in {'link', 'a'}:
            keys.append('href')
        if tag == 'video':
            keys.append('poster')
        for key in keys:
            if key in attrs:
                check_reference(self.source, attrs[key])


for entry in ['index.html', 'bright/index.html', 'admin/index.html']:
    if not (DIST / entry).is_file():
        errors.append(f'Missing entry point: {entry}')

html_files = sorted(DIST.rglob('*.html'))
for source in html_files:
    References(source).feed(source.read_text(encoding='utf-8'))
for source in sorted(DIST.rglob('*.css')):
    for value in re.findall(r'url\(\s*([^)]*?)\s*\)', source.read_text(encoding='utf-8')):
        check_reference(source, value.strip('\'"'))

node = shutil.which('node')
scripts = sorted(p for directory in [DIST, ROOT / 'scripts'] for p in directory.rglob('*')
                 if p.suffix in {'.js', '.cjs'})
if not node:
    errors.append('Node.js is required for JavaScript syntax checks.')
else:
    for source in scripts:
        result = subprocess.run([node, '--check', str(source)], capture_output=True, text=True)
        if result.returncode:
            errors.append(f'{source.relative_to(ROOT)}: {result.stderr.strip()}')
for source in sorted((ROOT / 'scripts').glob('*.py')):
    try:
        ast.parse(source.read_text(encoding='utf-8'), filename=str(source))
    except SyntaxError as error:
        errors.append(str(error))

if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print(f'PASS: 3 entry points, {len(html_files)} HTML files, {reference_count} local references, '
      f'{len(scripts)} JavaScript files and Python syntax.')
