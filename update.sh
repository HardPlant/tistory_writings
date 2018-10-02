#!/usr/bin/env bash

git diff --name-only HEAD HEAD~1 | grep \\.md | xargs -n1 markdown-tistory write ; git push