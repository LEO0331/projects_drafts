#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { generateSkillMarkdown } = require('../skillgen-core');

const ROOT = path.resolve(__dirname, '../../..');
const MINI = path.join(ROOT, 'mini-features');
const OUT = '/tmp/skill-gen-smoke';
const REQUIRED = [
  '## Feature Summary',
  '## Integration Steps',
  '## DOM/Style/Behavior Contract',
  '## Dependency Notes',
  '## Test Checklist'
];

const CASES = [
  'LoginForm',
  'TodoList',
  'MovieApp',
  'NoteApp',
  'AgencyWebPage',
  'SoundEffectBoard'
];

function readText(p) {
  return fs.readFileSync(p, 'utf8');
}

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  let passed = 0;

  for (const name of CASES) {
    const base = path.join(MINI, name);
    const indexPath = path.join(base, 'index.html');
    const stylePath = path.join(base, 'style.css');
    const scriptPath = path.join(base, 'script.js');

    assert(fs.existsSync(indexPath), `Missing ${indexPath}`);
    assert(fs.existsSync(stylePath), `Missing ${stylePath}`);
    assert(fs.existsSync(scriptPath), `Missing ${scriptPath}`);

    const result = generateSkillMarkdown({
      sourceName: name,
      mode: 'preserve',
      indexHtml: readText(indexPath),
      styleCss: readText(stylePath),
      scriptJs: readText(scriptPath)
    });

    REQUIRED.forEach((h) => assert(result.markdown.includes(h), `${name}: missing section ${h}`));

    fs.writeFileSync(path.join(OUT, `${name}.SKILL.md`), result.markdown, 'utf8');
    passed += 1;
  }

  console.log(`Smoke passed: ${passed}/${CASES.length}`);
  console.log(`Output: ${OUT}`);
}

main();
