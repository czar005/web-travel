#!/bin/bash
echo "🔍 Inspecting footer structure in index.html..."
grep -A 10 -B 2 "footer-section" index.html
