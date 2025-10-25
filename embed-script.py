import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove any existing footer fix scripts
content = re.sub(r'<script src="[^"]*footer[^"]*"><\/script>\n?', '', content)
content = re.sub(r'<script>[\\s\\S]*?footer[\\s\\S]*?<\/script>\n?', '', content)

# Add the guaranteed script directly before </body>
footer_script = '''<script>
// GUARANTEED FOOTER FIX
(function() {
    console.log('🎯 GUARANTEED FOOTER FIX EXECUTING');
    const footerSection = document.querySelector('.footer-section');
    if (footerSection) {
        const p = footerSection.querySelector('p');
        if (p) {
            p.textContent = 'Ваш надежный партнер в мире путешествий.';
            console.log('✅ Footer paragraph updated');
        }
    }
})();
</script>'''

content = content.replace('</body>', footer_script + '\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Embedded guaranteed footer fix directly into HTML")
