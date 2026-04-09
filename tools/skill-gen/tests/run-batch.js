#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { generateSkillMarkdown } = require('../skillgen-core');

const ROOT = path.resolve(__dirname, '../../..');
const OUT = '/tmp/skill-gen-batch';
const EXCLUDE = new Set([
  'mci',
  'MCI',
  'testing',
  'gitlab-api-test-python-generator-cli',
  'Template',
  'ApiRequestDemo',
  'CodingPractice'
]);

const REQUIRED = [
  '## Feature Summary',
  '## Integration Steps',
  '## DOM/Style/Behavior Contract',
  '## Dependency Notes',
  '## Test Checklist'
];

function readText(p) {
  return fs.readFileSync(p, 'utf8');
}

function isEligibleDir(name) {
  if (name.startsWith('.')) return false;
  if (EXCLUDE.has(name)) return false;
  const base = path.join(ROOT, name);
  if (!fs.statSync(base).isDirectory()) return false;
  const files = new Set(fs.readdirSync(base));
  return files.has('index.html') && files.has('style.css') && files.has('script.js');
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const all = fs.readdirSync(ROOT).filter(isEligibleDir).sort();
  let generated = 0;
  let warnFetch = 0;
  let warnStorage = 0;

  for (const name of all) {
    const base = path.join(ROOT, name);
    const result = generateSkillMarkdown({
      sourceName: name,
      mode: 'preserve',
      indexHtml: readText(path.join(base, 'index.html')),
      styleCss: readText(path.join(base, 'style.css')),
      scriptJs: readText(path.join(base, 'script.js'))
    });

    REQUIRED.forEach((h) => {
      if (!result.markdown.includes(h)) {
        throw new Error(`${name}: missing section ${h}`);
      }
    });

    if (result.facts.js.usesFetch) warnFetch += 1;
    if (result.facts.js.usesLocalStorage || result.facts.js.usesSessionStorage) warnStorage += 1;

    fs.writeFileSync(path.join(OUT, `${name}.SKILL.md`), result.markdown, 'utf8');
    generated += 1;
  }

  console.log(`Batch generated: ${generated}`);
  console.log(`Fetch-warning features: ${warnFetch}`);
  console.log(`Storage-warning features: ${warnStorage}`);
  console.log(`Output: ${OUT}`);
}

main();
