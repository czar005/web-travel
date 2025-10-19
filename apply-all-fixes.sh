#!/bin/bash

echo "🔧 Применение всех исправлений..."

# 1. Копируем файл исправлений
cp fix_issues.js ./fix-issues-applied.js

# 2. Обновляем page-editor.html
if [ -f "page-editor.html" ]; then
    echo "📝 Обновление page-editor.html..."
    # Добавляем ссылку на скрипт исправлений
    if ! grep -q "fix-issues-applied.js" page-editor.html; then
        sed -i '/<\/body>/i <script src="fix-issues-applied.js"></script>' page-editor.html
    fi
fi

# 3. Обновляем index.html
if [ -f "index.html" ]; then
    echo "📝 Обновление index.html..."
    # Добавляем ссылку на скрипт исправлений
    if ! grep -q "fix-issues-applied.js" index.html; then
        sed -i '/<\/body>/i <script src="fix-issues-applied.js"></script>' index.html
    fi
fi

# 4. Обновляем admin.html
if [ -f "admin.html" ]; then
    echo "📝 Обновление admin.html..."
    if ! grep -q "fix-issues-applied.js" admin.html; then
        sed -i '/<\/body>/i <script src="fix-issues-applied.js"></script>' admin.html
    fi
fi

echo "✅ Все исправления применены!"
echo "📋 Что было исправлено:"
echo "   ✅ Синхронизированы заголовки в навигации и футере"
echo "   ✅ Добавлены редакторы изображений для всех секций"
echo "   ✅ Исправлена контактная информация (телефон, email, адрес)"
echo "   ✅ Убраны дубликаты в футере"
echo "   ✅ Объединены дублирующиеся редакторы в секциях"
