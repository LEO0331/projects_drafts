const test = require('node:test');
const assert = require('node:assert/strict');
const { generateSkillMarkdown } = require('../../skillgen-core');

const richInput = {
  sourceName: 'My Feature++',
  mode: 'modernize',
  indexHtml: `<!doctype html>
  <html>
    <head>
      <title>My Test Title</title>
      <link rel="stylesheet" href="https://cdn.example.com/style.css" />
      <script src="https://cdn.example.com/lib.js"></script>
    </head>
    <body>
      <form id="signup" class="panel form-block"></form>
      <div id="output" class="panel output"></div>
    </body>
  </html>`,
  styleCss: `
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap");
    :root { --primary: #0a0; --space-2: 8px; }
    .panel { padding: 8px; }
    .output { color: #111; }
    @media (min-width: 600px) { .panel { padding: 16px; } }
    @keyframes pulse { from {opacity:.3} to {opacity:1} }
  `,
  scriptJs: `
    const node = document.querySelector('#output');
    document.querySelectorAll('.panel').forEach((el) => {
      el.addEventListener('click', () => {
        setTimeout(() => {
          fetch('https://api.example.com/data?api_key=abc123');
          localStorage.setItem('k','v');
          sessionStorage.setItem('s','v');
          requestAnimationFrame(() => node.textContent = 'done');
        }, 10);
      });
    });
  `
};

test('generates full markdown and extracted facts for rich input', () => {
  const result = generateSkillMarkdown(richInput);

  assert.ok(result.markdown.includes('## Feature Summary'));
  assert.ok(result.markdown.includes('## Integration Steps'));
  assert.ok(result.markdown.includes('## DOM/Style/Behavior Contract'));
  assert.ok(result.markdown.includes('## Dependency Notes'));
  assert.ok(result.markdown.includes('## Test Checklist'));

  assert.equal(result.facts.html.title, 'My Test Title');
  assert.ok(result.facts.html.ids.includes('signup'));
  assert.ok(result.facts.html.classes.includes('panel'));

  assert.ok(result.facts.css.cssVars.includes('--primary'));
  assert.equal(result.facts.css.mediaQueries, 1);
  assert.ok(result.facts.css.keyframes.includes('pulse'));

  assert.ok(result.facts.js.usesFetch);
  assert.ok(result.facts.js.usesLocalStorage);
  assert.ok(result.facts.js.usesSessionStorage);
  assert.ok(result.facts.js.usesTimers);
  assert.ok(result.facts.js.eventTypes.includes('click'));
  assert.ok(result.facts.js.querySelectors.includes('#output'));

  assert.ok(result.facts.deps.externalUrls.some((u) => u.includes('api.example.com')));
  assert.ok(result.facts.warnings.some((w) => w.includes('network-fetch')));
  assert.ok(result.facts.warnings.some((w) => w.includes('query parameters')));

  assert.ok(result.markdown.includes('name: my-feature'));
  assert.ok(result.markdown.includes('mode: modernize'));
  assert.ok(result.markdown.includes('- Behavior flags: network-fetch, local-storage, session-storage, timers/animation-loop'));
});

test('handles empty/basic inputs and fallback branches', () => {
  const result = generateSkillMarkdown({
    sourceName: 'Plain',
    indexHtml: '<html><body><div>hello</div></body></html>',
    styleCss: 'body { margin: 0; }',
    scriptJs: 'const x = 1;'
  });

  assert.equal(result.facts.html.title, 'Untitled Feature');
  assert.equal(result.facts.deps.externalUrls.length, 0);
  assert.equal(result.facts.deps.notes.length, 0);
  assert.equal(result.facts.warnings.length, 0);

  assert.ok(result.markdown.includes('- Behavior flags: none'));
  assert.ok(result.markdown.includes('- None detected'));
  assert.ok(result.markdown.includes('- No special dependency caveats detected.'));
  assert.ok(result.markdown.includes('- Warnings: none'));
});

test('throws for oversized content', () => {
  const tooBig = 'a'.repeat(1000001);
  assert.throws(
    () => generateSkillMarkdown({ indexHtml: tooBig, styleCss: '', scriptJs: '' }),
    /Input too large/
  );
});
