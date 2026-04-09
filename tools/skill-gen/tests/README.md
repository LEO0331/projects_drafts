# Tests

## 1) Prepare curated mini-features corpus

```bash
bash tools/skill-gen/tests/setup-mini-features.sh
```

## 2) Run smoke + batch checks

```bash
bash tools/skill-gen/tests/run-all.sh
```

- Smoke uses curated symlink set in `mini-features/`.
- Batch scans all eligible top-level feature folders except excluded folders.
