#!/usr/bin/env python3
import sys

with open('index.html', 'r') as f:
    lines = f.readlines()

in_script = False
for i, line in enumerate(lines, 1):
    if '<script' in line and '</script>' not in line:
        in_script = True
        print(f"Opening script tag at line {i}")
    if '</script>' in line:
        in_script = False
    if in_script and i > 890 and i < 910:
        print(f"Line {i}: {line.strip()}")

if in_script:
    print("WARNING: Unclosed script tag!")
