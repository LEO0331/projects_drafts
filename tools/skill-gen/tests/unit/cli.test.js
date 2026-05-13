const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { parseArgs, resolveInputs } = require('../../cli');

test('parseArgs captures expected flags', () => {
  const args = parseArgs([
    'node',
    'cli.js',
    '--dir',
    'FeatureA',
    '--mode',
    'modernize',
    '--print'
  ]);

  assert.equal(args.dir, 'FeatureA');
  assert.equal(args.mode, 'modernize');
  assert.equal(args.print, true);
});

test('parseArgs rejects missing option values and unknown flags', () => {
  assert.throws(
    () => parseArgs(['node', 'cli.js', '--dir']),
    /Missing value for --dir/
  );

  assert.throws(
    () => parseArgs(['node', 'cli.js', '--bogus']),
    /Unknown argument: --bogus/
  );
});

test('resolveInputs rejects invalid mode before reading files', () => {
  assert.throws(
    () => resolveInputs({
      dir: path.resolve(__dirname, '../../samples/sticky-notes'),
      mode: 'legacy'
    }),
    /Invalid --mode "legacy"/
  );
});
