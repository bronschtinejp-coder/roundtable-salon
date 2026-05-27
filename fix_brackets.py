import json, re, sys

sys.stdout.reconfigure(encoding='utf-8')

path = r'D:\CMproject\roundtable\roundtable-data.json'
with open(path, 'r', encoding='utf-8') as f:
    raw = f.read()

# Fix pattern: 」X」 should be 「X」 when it's an opening+closing pair
# The heuristic error: some opening brackets were set to 」 instead of 「
# Fix: after certain characters (space, newline, comma, colon, punctuation, CJK),
# a 」 followed by text then another 」 means the first should be 「

# Simpler: find all 」...」 that don't have 「 before them and fix the first one
# Pattern: not preceded by 「, then 」text」
fixed = re.sub(r'(?<![「])」([^「」\n]{1,30})」', r'「\1」', raw)

with open(path, 'w', encoding='utf-8') as f:
    f.write(fixed)

data = json.load(open(path, 'r', encoding='utf-8'))
print(f'Validation passed! topics: {len(data["topics"])}, cases: {len(data["cases"])}')

# Check for any remaining mismatched brackets
for c in data['cases'][-2:]:
    for qa in c['conversations']:
        text = qa['answer'] + qa['question']
        opens = text.count('「')
        closes = text.count('」')
        if opens != closes:
            print(f'  WARNING: {c["id"]} Q={qa["question"][:30]} has {opens}「 vs {closes}」')
