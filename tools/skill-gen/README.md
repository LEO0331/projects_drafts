# skill-gen

![status](https://img.shields.io/badge/status-active-2ea44f)
![node](https://img.shields.io/badge/node-%3E%3D18-339933)
![output](https://img.shields.io/badge/output-SKILL.md%20%7C%20skills.md-1f6feb)

Generate `SKILL.md` from `index.html`, `style.css`, and `script.js`.

GitHub repo placeholder: `https://github.com/<your-org>/<your-repo>`

## Docs bundle

Use [docs/README.md](docs/README.md) as the handoff package for Codex/Claude Code.

- [prd.md](docs/prd.md)
- [skills.md](docs/skills.md)
- [codex-claude-usage.md](docs/codex-claude-usage.md)
- [testing.md](docs/testing.md)

## CLI

```bash
node tools/skill-gen/cli.js --dir LoginForm --out /tmp/LoginForm.SKILL.md
```

Or explicit files:

```bash
node tools/skill-gen/cli.js \
  --index LoginForm/index.html \
  --style LoginForm/style.css \
  --script LoginForm/script.js \
  --out /tmp/LoginForm.SKILL.md
```

## Web UI

Open `tools/skill-gen/web/index.html` in a browser.

- Supports file upload.
- Supports folder picker (`webkitdirectory`).
- Supports manual paste.
- Provides CLI hint for local folder path handoff.

### Language navigation

- English: `index.html`
- Traditional Chinese: `index.zh-TW.html`

GitHub Pages links (replace placeholders):

- English: `https://<your-org>.github.io/<your-repo>/index.html`
- Traditional Chinese: `https://<your-org>.github.io/<your-repo>/index.zh-TW.html`

## Output sections

- Feature Summary
- Integration Steps
- DOM/Style/Behavior Contract
- Dependency Notes
- Test Checklist

## Sample artifact

Example sample folder with 3 input files and generated result:

- [sample index.html](samples/sticky-notes/index.html)
- [sample style.css](samples/sticky-notes/style.css)
- [sample script.js](samples/sticky-notes/script.js)
- [generated skills.md](samples/sticky-notes/skills.md)

Generate this sample output again:

```bash
node tools/skill-gen/cli.js \
  --dir tools/skill-gen/samples/sticky-notes \
  --out tools/skill-gen/samples/sticky-notes/skills.md
```
