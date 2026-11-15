"""Re-import Michaela's Excel into src/data/vestibu-inhalte.json.

Usage:  pip install openpyxl
        python scripts/import-vestibu.py path/to/Vestibu_90_Tage_Texte.xlsx

Sheet 1 columns (matched by header text): Tag, Phase, Tägliche Begrüßung,
Deine Affirmation, Bonus-Minuten Impuls, and the bonus-exercise column
(header containing "Übung"/"Bonus-Übung"; value = Nr or Titel from sheet 2).
Sheet 2 (Zusatzübungen Audio): Nr, Kategorie, Titel, Audioanleitung.
"""
import json, re, sys
from pathlib import Path
from openpyxl import load_workbook

OUT = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'vestibu-inhalte.json'

def slug(s):
    s = s.lower().replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue').replace('ß', 'ss')
    return re.sub('[^a-z0-9]+', '-', s).strip('-')

def rows(ws):
    it = ws.iter_rows(values_only=True)
    head = [str(h or '').strip() for h in next(it)]
    for r in it:
        if any(v not in (None, '') for v in r):
            yield {head[i]: ('' if v is None else str(v).strip()) for i, v in enumerate(r) if i < len(head)}

def col(row, *keys):
    for k, v in row.items():
        if any(x.lower() in k.lower() for x in keys):
            return v
    return ''

wb = load_workbook(sys.argv[1], data_only=True)
s1, s2 = wb.worksheets[0], wb.worksheets[1]
bonus = []
for r in rows(s2):
    title = col(r, 'Titel')
    if title:
        bonus.append({'id': slug(title), 'nr': col(r, 'Nr'), 'kategorie': col(r, 'Kategorie'), 'titel': title, 'anleitung': col(r, 'Anleitung')})
by = {b['nr']: b['id'] for b in bonus} | {b['titel'].lower(): b['id'] for b in bonus}
days = []
for r in rows(s1):
    tag = col(r, 'Tag')
    if not tag.split('.')[0].isdigit():
        continue
    pick = next((v for k, v in r.items() if 'übung' in k.lower() and 'impuls' not in k.lower()), '')
    days.append({'tag': int(float(tag)), 'phase': col(r, 'Phase'), 'begruessung': col(r, 'Begrüßung'),
                 'affirmation': col(r, 'Affirmation'), 'bonusImpuls': col(r, 'Impuls'),
                 'bonusUebung': by.get(pick) or by.get(pick.lower()) or None})
assert len(days) == 90, f'expected 90 days, got {len(days)}'
OUT.write_text(json.dumps({'quelle': Path(sys.argv[1]).name, 'tage': days, 'bonusUebungen': bonus}, ensure_ascii=False, indent=1), encoding='utf8')
print(f'wrote {OUT} ({len(days)} days, {len(bonus)} bonus exercises)')
