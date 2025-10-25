import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Удаляем ВСЕ предыдущие скрипты футера
content = re.sub(r'<script src="[^"]*footer[^"]*"></script>\s*', '', content)
content = re.sub(r'<script src="[^"]*fix[^"]*"></script>\s*', '', content)

# Добавляем ПРОСТОЙ тестовый скрипт
content = content.replace('</body>', '<script src="simple-test.js"></script>\\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Добавили простой тестовый скрипт")
