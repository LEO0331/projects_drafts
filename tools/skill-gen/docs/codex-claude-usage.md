# Codex / Claude Code Usage

Use this bundle to reproduce or extend the same feature in other repositories.

## Codex prompt (copy-paste)

```md
Implement a 3-file-to-skill generator using these rules:
- Input: index.html, style.css, script.js
- Output: skills.md (or SKILL.md) with sections:
  1) Feature Summary
  2) Integration Steps
  3) DOM/Style/Behavior Contract
  4) Dependency Notes
  5) Test Checklist
- Include warnings for fetch/localStorage/external dependency risks.
- Provide both web UI and optional CLI using shared generation logic.
Reference style: tools/skill-gen/docs/skills.md
Requirements: tools/skill-gen/docs/prd.md
```

## Claude Code prompt (copy-paste)

```md
Build or adapt a local project that turns index.html/style.css/script.js into skills.md.
Use the PRD in tools/skill-gen/docs/prd.md and output style in tools/skill-gen/docs/skills.md.
Deliver:
- shared parser/generator module
- web UI (upload + folder + paste)
- optional CLI
- tests and sample artifacts
```

## Handoff checklist

- Share `docs/prd.md` and `docs/skills.md` first.
- If the target repo has existing style conventions, preserve them.
- Re-run tests after any formatting/simplification pass.
