import re

# Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the footer section
old_footer = re.search(r'<div class="footer-section">[\\s\\S]*?<\\/div>', content)

if old_footer:
    old_html = old_footer.group(0)
    new_html = '''<div class="footer-section">
                    <h3><i class="fas fa-globe-americas"></i> WorldTravel</h3>
                    <p>Ваш надежный партнер в мире путешествий.</p>
                </div>'''
    
    content = content.replace(old_html, new_html)
    print("✅ Replaced footer section with fixed version")
    
    # Write back
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
else:
    print("❌ Could not find footer section to replace")
