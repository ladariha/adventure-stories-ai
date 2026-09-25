#!/usr/bin/env bash

BASE_BRANCH="origin/main"

TARGET="$1"

# If argument is a commit
if [ -n "$TARGET" ] && git cat-file -e "$TARGET^{commit}" 2>/dev/null; then
  echo "FILES:"
  git diff-tree --no-commit-id --name-only -r "$TARGET"
  echo ""
  echo "DIFF:"
  git show "$TARGET"
# Otherwise assume branch comparison
else
  echo "FILES:"
  git diff --name-only $BASE_BRANCH...HEAD
  echo ""
  echo "DIFF:"
  git diff $BASE_BRANCH...HEAD
fi
