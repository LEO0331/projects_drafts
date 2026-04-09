# Ralph Context Snapshot

- task statement: Implement webpage + optional CLI to convert index.html/style.css/script.js into SKILL.md using template sections.
- desired outcome: User can input 3 files and get SKILL.md; CLI supports folder/files; tests run on mini-features in this repo.
- known facts/evidence:
  - Workspace has many small feature folders.
  - Exclusions: mci, testing, gitlab-api-test-python-generator-cli, Template, ApiRequestDemo, CodingPractice.
  - Node v22.22.1 is available.
- constraints:
  - No destructive git operations.
  - Keep implementation simple and dependency-light.
  - Maintain required sections: feature summary, integration steps, DOM/style/behavior contract, dependency notes, test checklist.
- unknowns/open questions:
  - None blocking; use deterministic heuristics for extraction.
- likely codebase touchpoints:
  - tools/skill-gen/*
  - mini-features/*
