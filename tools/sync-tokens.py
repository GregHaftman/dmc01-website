#!/usr/bin/env python3
"""Stamp shared/brand-tokens.css into every section embed (and webflow/*.css).

Each Webflow Code Embed must be self-contained, so every section file
carries a copy of the token block between these markers:

    /* @dmc01-tokens:start */
    ...
    /* @dmc01-tokens:end */

This script replaces each copy with the block from shared/brand-tokens.css,
so the copies can never drift from the source.

    python3 tools/sync-tokens.py          # rewrite the copies
    python3 tools/sync-tokens.py --check  # exit 1 if any copy is stale
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "shared" / "brand-tokens.css"
START, END = "/* @dmc01-tokens:start */", "/* @dmc01-tokens:end */"
BLOCK = re.compile(r"^([ \t]*)" + re.escape(START) + r".*?" + re.escape(END), re.S | re.M)


def source_block() -> str:
    m = BLOCK.search(SOURCE.read_text())
    if not m:
        sys.exit(f"No token markers in {SOURCE}")
    return m.group(0)


def stamp(text: str, block: str) -> str:
    def indent(m):
        pad = m.group(1)
        return "\n".join(pad + line if line else line for line in block.splitlines())
    return BLOCK.sub(indent, text)


def main() -> int:
    check = "--check" in sys.argv
    block = source_block()
    stale = []
    targets = sorted((ROOT / "sections").glob("*.html")) + sorted((ROOT / "webflow").glob("*.css"))
    for path in targets:
        text = path.read_text()
        if START not in text:
            continue
        new = stamp(text, block)
        if new != text:
            stale.append(path.name)
            if not check:
                path.write_text(new)
    verb = "stale" if check else "updated"
    print(f"{len(stale)} {verb}: {', '.join(stale) or '-'}")
    return 1 if (check and stale) else 0


if __name__ == "__main__":
    sys.exit(main())
