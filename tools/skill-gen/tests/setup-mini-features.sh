#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
MINI="$ROOT/mini-features"
mkdir -p "$MINI"

features=(
  LoginForm
  TodoList
  MovieApp
  NoteApp
  AgencyWebPage
  SoundEffectBoard
)

for f in "${features[@]}"; do
  target="$ROOT/$f"
  link="$MINI/$f"
  if [[ -L "$link" || -e "$link" ]]; then
    rm -rf "$link"
  fi
  ln -s "$target" "$link"
  echo "linked $link -> $target"
done
