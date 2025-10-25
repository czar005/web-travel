import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("🔍 Searching for footer sections...")

# Find ALL footer sections
footer_sections = re.findall(r'<div class="footer-section">.*?</div>', content, re.DOTALL)

print(f"📋 Found {len(footer_sections)} footer sections")

for i, section in enumerate(footer_sections):
    print(f"\n--- Footer Section {i+1} ---")
    print(section)
    
    # Check if it has empty paragraph
    if '<p> </p>' in section or '<p></p>' in section or '<p>&nbsp;</p>' in section:
        print(f"❌ Section {i+1} has empty paragraph!")
        
        # Replace empty paragraph with default text
        new_section = re.sub(r'<p>[^<]*</p>', '<p>Ваш надежный партнер в мире путешествий.</p>', section)
        content = content.replace(section, new_section)
        print(f"✅ Fixed section {i+1}")

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n🎉 Footer fix completed!")
