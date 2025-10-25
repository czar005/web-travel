import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove ALL existing footer scripts
content = re.sub(r'<script src="[^"]*footer[^"]*"></script>\s*', '', content)
content = re.sub(r'<script src="[^"]*fix-footer[^"]*"></script>\s*', '', content)

# Add ultimate script
content = content.replace('</body>', '<script src="ultimate-footer.js"></script>\\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Added ultimate footer script")
