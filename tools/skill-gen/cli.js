#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { generateSkillMarkdown } = require('./skillgen-core');

function parseArgs(argv) {
  const out = { mode: 'preserve' };
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const val = argv[i + 1];
    if (key === '--dir') { out.dir = val; i += 1; continue; }
    if (key === '--index') { out.index = val; i += 1; continue; }
    if (key === '--style') { out.style = val; i += 1; continue; }
    if (key === '--script') { out.script = val; i += 1; continue; }
    if (key === '--out') { out.out = val; i += 1; continue; }
    if (key === '--name') { out.name = val; i += 1; continue; }
    if (key === '--mode') { out.mode = val; i += 1; continue; }
    if (key === '--print') { out.print = true; continue; }
    if (key === '--help' || key === '-h') { out.help = true; continue; }
  }
  return out;
}

function usage() {
  console.log([
    'Usage:',
    '  node tools/skill-gen/cli.js --dir <feature-folder> [--out <SKILL.md>] [--name <name>] [--mode preserve|modernize]',
    '  node tools/skill-gen/cli.js --index <index.html> --style <style.css> --script <script.js> [--out <SKILL.md>] [--name <name>] [--mode preserve|modernize]',
    '  add --print to emit markdown to stdout'
  ].join('\n'));
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function resolveInputs(args) {
  if (args.dir) {
    const base = path.resolve(args.dir);
    return {
      sourceName: args.name || path.basename(base),
      indexHtml: readText(path.join(base, 'index.html')),
      styleCss: readText(path.join(base, 'style.css')),
      scriptJs: readText(path.join(base, 'script.js'))
    };
  }

  if (args.index && args.style && args.script) {
    return {
      sourceName: args.name || path.basename(path.dirname(path.resolve(args.index))),
      indexHtml: readText(path.resolve(args.index)),
      styleCss: readText(path.resolve(args.style)),
      scriptJs: readText(path.resolve(args.script))
    };
  }

  throw new Error('Provide either --dir or the trio --index/--style/--script');
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    usage();
    process.exit(0);
  }

  try {
    const input = resolveInputs(args);
    const { markdown } = generateSkillMarkdown({ ...input, mode: args.mode });
    const outPath = path.resolve(args.out || 'SKILL.md');
    fs.writeFileSync(outPath, markdown, 'utf8');

    if (args.print) {
      console.log(markdown);
    }

    console.log(`Generated ${outPath}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    usage();
    process.exit(1);
  }
}

main();
