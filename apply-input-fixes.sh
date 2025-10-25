#!/bin/bash
echo "🔧 Applying input overflow fixes..."

# Add the fix script to index.html
if grep -q "fix-inputs-overflow.js" index.html; then
    echo "✅ fix-inputs-overflow.js already added to index.html"
else
    sed -i '' 's|</body>|    <script src="fix-inputs-overflow.js"></script>\n</body>|' index.html
    echo "✅ Added fix-inputs-overflow.js to index.html"
fi

# Add the fix script to page-editor.html  
if grep -q "fix-inputs-overflow.js" page-editor.html; then
    echo "✅ fix-inputs-overflow.js already added to page-editor.html"
else
    sed -i '' 's|</body>|    <script src="fix-inputs-overflow.js"></script>\n</body>|' page-editor.html
    echo "✅ Added fix-inputs-overflow.js to page-editor.html"
fi

echo "🎉 Input overflow fixes applied successfully!"
echo "📝 Changes made:"
echo "   - Created fix-inputs-overflow.js with CSS fixes"
echo "   - Added script to index.html and page-editor.html"
echo "   - Fixed input width and overflow issues in editors"
