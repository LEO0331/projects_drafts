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

## 3) Run unit tests + coverage threshold

```bash
npm run test:coverage --prefix tools/skill-gen
```

Coverage gate thresholds:
- line coverage >= 85%
- function coverage >= 85%
- branch coverage >= 85%

## 4) Run end-to-end web UI tests

```bash
npm run test:e2e --prefix tools/skill-gen
```

This spins up a local static server and runs Playwright tests against `web/index.html`.
