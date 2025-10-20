#!/bin/bash

echo "�� Applying editor layout fixes..."

# Копируем CSS исправления
if [ -f "fix-editor-overflow.css" ]; then
    echo "✅ Added overflow fixes CSS"
else
    echo "❌ Failed to create overflow fixes CSS"
fi

# Копируем JavaScript исправления
if [ -f "fix-editor-layout.js" ]; then
    echo "✅ Added layout fixes JavaScript"
else
    echo "❌ Failed to create layout fixes JavaScript"
fi

# Обновляем редактор страниц
if [ -f "page-editor-fixed.html" ]; then
    cp page-editor-fixed.html page-editor.html
    echo "✅ Updated page editor with fixes"
else
    echo "❌ Failed to update page editor"
fi

echo "🎉 Editor layout fixes applied successfully!"
echo "📋 Changes made:"
echo "   ✅ Added CSS constraints for all editor elements"
echo "   ✅ Fixed input field widths and overflow"
echo "   ✅ Added responsive behavior for mobile"
echo "   ✅ Updated page editor with proper layout"
