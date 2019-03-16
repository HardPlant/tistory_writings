#!/usr/bin/env bash
git add .
git commit -m "Last Update"
git diff --name-only HEAD HEAD~1 | grep \\.md | xargs -n1 markdown-tistory write ; git push