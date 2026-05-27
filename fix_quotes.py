import json

path = r'D:\CMproject\roundtable\roundtable-data.json'
with open(path, 'r', encoding='utf-8') as f:
    raw = f.read()

# Nuclear option: find all " that are inside JSON string content
# and replace them with full-width double quotes
# Strategy: iterate char by char, track JSON string state

result = []
in_string = False
prev_char = ''
i = 0
while i < len(raw):
    ch = raw[i]
    
    if not in_string:
        if ch == '"':
            in_string = True
            result.append(ch)
        else:
            result.append(ch)
    else:
        # We're inside a JSON string
        if ch == '\\':
            # Escape sequence - copy both chars
            result.append(ch)
            if i + 1 < len(raw):
                i += 1
                result.append(raw[i])
        elif ch == '"':
            # This could be end-of-string or an unescaped internal quote
            # Look ahead: if next non-whitespace is : , ] } or is end-of-content
            # then it's a real string terminator
            j = i + 1
            while j < len(raw) and raw[j] in ' \t\r\n':
                j += 1
            if j < len(raw) and raw[j] in ':,]}':
                # Real string end
                in_string = False
                result.append(ch)
            elif j >= len(raw):
                in_string = False
                result.append(ch)
            else:
                # Internal quote - replace with corner bracket
                # Determine if it's opening or closing
                # Simple heuristic: if preceded by CJK or punctuation, it's closing
                if len(result) > 0 and result[-1] not in '(\u3001\u3002\uff0c\uff1a\u2014\n ':
                    result.append('\u300d')  # closing 」
                else:
                    result.append('\u300c')  # opening 「
        else:
            result.append(ch)
    
    i += 1

fixed = ''.join(result)

with open(path, 'w', encoding='utf-8') as f:
    f.write(fixed)

# Validate
data = json.load(open(path, 'r', encoding='utf-8'))
print(f'SUCCESS! topics: {len(data["topics"])}, cases: {len(data["cases"])}')
for c in data['cases']:
    print(f'  {c["id"]}: {c["title"][:50]}... (topicId={c["topicId"]})')
