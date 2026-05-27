path = r'D:\CMproject\roundtable\roundtable-data.json'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find line 363, show chars around position 54
lines = content.split('\n')
line = lines[362]  # 0-indexed
print(f'Line 363 length: {len(line)}')
print(f'Chars 50-60: {repr(line[50:60])}')

# Find ALL occurrences of quote-like chars that aren't ASCII " 
for i, ch in enumerate(line):
    if ch == '"' or ord(ch) in [0x201c, 0x201d, 0x2018, 0x2019, 0x300c, 0x300d]:
        print(f'  pos {i}: {repr(ch)} (U+{ord(ch):04X})')
