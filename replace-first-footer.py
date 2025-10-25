import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Находим ПЕРВЫЙ footer-section
pattern = r'(<div class="footer-section">\s*<h3><i class="fas fa-globe-americas"></i> WorldTravel</h3>\s*<p>[^<]*</p>\s*</div>)'

new_footer = '''<div class="footer-section">
                    <h3><i class="fas fa-globe-americas"></i> WorldTravel</h3>
                    <p>Ваш надежный партнер в мире путешествий.</p>
                </div>'''

# Заменяем
new_content = re.sub(pattern, new_footer, content, count=1)

if new_content != content:
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("✅ ТОЧНО заменили первый footer-section")
else:
    print("❌ Не нашли шаблон для замены")
    # Попробуем другой подход
    lines = content.split('\n')
    in_footer = False
    footer_start = -1
    
    for i, line in enumerate(lines):
        if 'footer-section' in line and footer_start == -1:
            footer_start = i
            in_footer = True
            print(f"Нашли footer-section на строке {i+1}")
        elif in_footer and '</div>' in line:
            # Нашли конец footer-section
            print(f"Закрывающий div на строке {i+1}")
            # Ищем параграф между этими строками
            for j in range(footer_start, i+1):
                if '<p>' in lines[j] and '</p>' in lines[j]:
                    print(f"Нашли параграф на строке {j+1}: {lines[j]}")
                    lines[j] = '                    <p>Ваш надежный партнер в мире путешествий.</p>'
                    break
            break
    
    # Сохраняем обратно
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print("✅ Заменили параграф вручную")
