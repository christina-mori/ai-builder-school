# -*- coding: utf-8 -*-
"""Build small UI fonts from the existing OFL fonts. Requires fonttools[woff].
Custom student text can use system fallback glyphs. Run again when UI copy changes.
"""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
text = "".join(p.read_text() for p in DIST.rglob("*") if p.suffix in {".js", ".css", ".html"})
text += "".join(chr(c) for c in range(32, 127))
for name, source in [("wenkai-ui", "wenkai-regular.ttf"), ("fusion-pixel-ui", "fusion-pixel.woff2")]:
    options = subset.Options()
    options.flavor = "woff2"
    options.name_IDs = ["*"]
    options.name_legacy = True
    options.name_languages = ["*"]
    font = TTFont(DIST / "assets/fonts" / source)
    sub = subset.Subsetter(options=options)
    sub.populate(text=text)
    sub.subset(font)
    font.flavor = "woff2"
    destination = DIST / "assets/fonts" / (name + ".woff2")
    font.save(destination)
    print(name, destination.stat().st_size, "bytes")
