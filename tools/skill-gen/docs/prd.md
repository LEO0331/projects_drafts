# PRD: 3-File to SKILL.md Generator

## Goal
Build a local tool that converts `index.html`, `style.css`, and `script.js` into an AI-ready `SKILL.md`/`skills.md` artifact.

## Target users
- Developers with existing mini frontend features.
- Teams migrating static UI snippets into reusable AI prompts/skills.

## Functional requirements
1. Web interface supports file upload, folder picker, and manual paste.
2. Optional CLI supports folder mode and explicit-file mode.
3. Output markdown contains:
   - Feature Summary
   - Integration Steps
   - DOM/Style/Behavior Contract
   - Dependency Notes
   - Test Checklist
4. Dependency and portability risks are surfaced (external URLs, fetch usage, storage usage, possible key/token query params).

## Non-functional requirements
- No new runtime dependencies required.
- Runs locally with Node.
- Mobile + desktop web usability.
- Maintainable shared generation logic for both web and CLI.

## Acceptance criteria
- Generator produces valid markdown with all required sections for eligible feature folders.
- `tools/skill-gen/tests/run-all.sh` passes.
- Sample folder includes three source files and generated `skills.md`.
- Documentation enables another developer to reproduce output in Codex or Claude Code.

## Out of scope
- Framework-specific code migration.
- One-click deployment.
- Remote SaaS hosting.
