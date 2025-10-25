import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove any existing footer scripts
content = re.sub(r'<script src="[^"]*footer[^"]*"></script>\s*', '', content)

# Add our simple script at the end
simple_script = '<script src="simple-footer-update.js"></script>'
content = content.replace('</body>', f'{simple_script}\\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Added simple footer update script to HTML")
