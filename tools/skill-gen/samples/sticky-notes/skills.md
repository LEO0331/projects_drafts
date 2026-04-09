---
name: sticky-notes
description: Reusable UI skill generated from `index.html`, `style.css`, and `script.js`
source: sticky-notes
mode: preserve
---

# sticky-notes Skill

## Feature Summary
- Base title: `Sticky Notes`
- DOM anchors detected: `#noteForm`, `#noteInput`, `#noteList`
- CSS selectors detected: 9
- JS events detected: `submit`
- Behavior flags: local-storage

## Integration Steps
- [ ] Create target feature container/component and copy the DOM contract structure.
- [ ] Map CSS selectors and variables into the target style system (global CSS, CSS modules, or utility classes).
- [ ] Port behavior bindings (`addEventListener`, state, timers, fetch/local storage) into target app conventions.
- [ ] Replace hardcoded external endpoints/assets with environment-driven config.
- [ ] Run the checklist and visual regression test in the target project.

## DOM/Style/Behavior Contract
### DOM Contract
- Required IDs
- `noteForm`
- `noteInput`
- `noteList`
- Common classes
- `app`
- `note-form`
- `note-list`

### Style Contract
- CSS variables
- `--bg`
- `--ink`
- `--note`
- `--accent`
- High-signal selectors
- `:root`
- `--bg: #f6f3ea;
  --ink: #2f2618;
  --note: #fff7b2;
  --accent: #715c2a;
}

*`
- `box-sizing: border-box;
}

body`
- `margin: 0;
  font-family: "Trebuchet MS", sans-serif;
  background: var(--bg);
  color: var(--ink);
}

.app`
- `max-width: 680px;
  margin: 2rem auto;
  padding: 1rem;
}

.note-form`
- `display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.note-form input`
- `flex: 1;
  padding: 0.6rem;
}

.note-form button`
- `padding: 0.6rem 0.9rem;
  background: var(--accent);
  color: white;
  border: none;
  cursor: pointer;
}

.note-list`
- `list-style: none;
  padding: 0;
  display: grid;
  gap: 0.7rem;
}

.note-list li`
- Keyframes
- None detected
- Media query blocks: `0`

### Behavior Contract
- Event types
- `submit`
- Queried selectors
- None detected
- Timers/RAF: `no`
- Uses fetch: `no`
- Uses localStorage: `yes`

## Dependency Notes
- External URLs
- None detected
- Uses `localStorage`; define storage keys and migration strategy in target project.
- Warnings: none

## Test Checklist
- [ ] Page renders without console errors.
- [ ] Primary interaction flow works for click/submit/keyboard behavior.
- [ ] Responsive behavior remains usable on mobile and desktop.
- [ ] All external URLs/dependencies resolve or are replaced.
- [ ] No hardcoded keys/secrets remain in script or markup.
