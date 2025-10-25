#!/bin/bash
echo "🔍 EXACT FOOTER STRUCTURE:"
grep -n -A 10 -B 2 "footer-section" index.html

echo ""
echo "📝 ALL FOOTER PARAGRAPHS:"
grep -n "footer-section" index.html | while read line; do
    line_num=$(echo $line | cut -d: -f1)
    echo "=== Line $line_num ==="
    sed -n "${line_num},$((line_num+10))p" index.html | grep -E "(p>|footer-section)" | head -5
done
