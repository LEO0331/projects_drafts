# Testing

## Setup curated mini-features

```bash
bash tools/skill-gen/tests/setup-mini-features.sh
```

## Run smoke + full batch

```bash
bash tools/skill-gen/tests/run-all.sh
```

## Single sample regeneration

```bash
node tools/skill-gen/cli.js \
  --dir tools/skill-gen/samples/sticky-notes \
  --out tools/skill-gen/samples/sticky-notes/skills.md
```

## Done criteria

- Smoke test passes.
- Full batch generation passes.
- Sample skills.md regenerated without errors.
