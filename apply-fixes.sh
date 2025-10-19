#!/bin/bash

echo "🔧 Applying fixes to page editor..."

# Создаем backup оригинальных файлов
cp page-editor.html page-editor.html.backup
cp update-content.js update-content.js.backup

# Добавляем исправления в page-editor.html
sed -i '/class StablePageEditor {/r fix_editor_bugs.js' page-editor.html

# Добавляем исправления в update-content.js  
sed -i '/class ContentUpdater {/r update-content-fixes.js' update-content.js

echo "✅ Fixes applied successfully!"
echo "🔄 Please refresh the page to see changes"
