#!/usr/bin/bash

git diff --name-only HEAD HEAD~1 | xargs -n1 markdown-tistory write ; git push