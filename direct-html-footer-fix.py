import re

# Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the exact footer section with empty paragraph
# We're looking for: <div class="footer-section">...<p> </p>...
pattern = r'(<div class="footer-section">\s*<h3>[^<]*</h3>\s*)<p>[^<]*</p>'

replacement = r'\1<p>Ваш надежный партнер в мире путешествий.</p>'

new_content = re.sub(pattern, replacement, content)

if new_content != content:
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("✅ Directly replaced empty footer paragraph in HTML")
else:
    print("❌ Could not find the pattern to replace")
