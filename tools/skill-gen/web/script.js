(function () {
  var fileInput = document.getElementById('fileInput');
  var folderInput = document.getElementById('folderInput');
  var featureNameEl = document.getElementById('featureName');
  var modeEl = document.getElementById('mode');
  var folderPathEl = document.getElementById('folderPath');
  var cliHintEl = document.getElementById('cliHint');
  var statusTextEl = document.getElementById('statusText');

  var indexEl = document.getElementById('indexHtml');
  var styleEl = document.getElementById('styleCss');
  var scriptEl = document.getElementById('scriptJs');
  var outputEl = document.getElementById('output');

  var generateBtn = document.getElementById('generateBtn');
  var downloadBtn = document.getElementById('downloadBtn');
  var copyBtn = document.getElementById('copyBtn');

  function setStatus(text, type) {
    statusTextEl.textContent = text;
    statusTextEl.classList.remove('success', 'error');
    if (type) {
      statusTextEl.classList.add(type);
    }
  }

  function readFile(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result || ''); };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  function updateCliHint() {
    var p = folderPathEl.value.trim();
    cliHintEl.textContent = p
      ? 'node tools/skill-gen/cli.js --dir "' + p + '" --out SKILL.md'
      : 'Tip: enter a folder path to generate a CLI command.';
  }

  function fileMapFromList(fileList) {
    var map = {};
    Array.from(fileList).forEach(function (f) {
      var name = f.name.toLowerCase();
      if (name === 'index.html' || name === 'style.css' || name === 'script.js') {
        map[name] = f;
      }
    });
    return map;
  }

  async function hydrateFromFiles(fileList, sourceLabel) {
    var map = fileMapFromList(fileList);
    if (map['index.html']) indexEl.value = await readFile(map['index.html']);
    if (map['style.css']) styleEl.value = await readFile(map['style.css']);
    if (map['script.js']) scriptEl.value = await readFile(map['script.js']);

    var found = Object.keys(map).length;
    if (found > 0) {
      setStatus('Loaded ' + found + '/3 expected files from ' + sourceLabel + '.', found === 3 ? 'success' : null);
    }
  }

  fileInput.addEventListener('change', function () {
    hydrateFromFiles(fileInput.files, 'upload').catch(function (err) {
      setStatus('Failed to read uploaded files: ' + err.message, 'error');
      alert('Failed to read files: ' + err.message);
    });
  });

  folderInput.addEventListener('change', function () {
    hydrateFromFiles(folderInput.files, 'folder input').catch(function (err) {
      setStatus('Failed to read folder files: ' + err.message, 'error');
      alert('Failed to read folder files: ' + err.message);
    });
  });

  folderPathEl.addEventListener('input', updateCliHint);
  updateCliHint();

  generateBtn.addEventListener('click', function () {
    var indexHtml = indexEl.value.trim();
    var styleCss = styleEl.value.trim();
    var scriptJs = scriptEl.value.trim();

    if (!indexHtml || !styleCss || !scriptJs) {
      setStatus('Provide all 3 files before generating.', 'error');
      alert('Please provide index.html, style.css, and script.js.');
      return;
    }

    var sourceName = (featureNameEl.value || 'Mini Feature').trim();
    var mode = modeEl.value;
    var result = SkillGen.generateSkillMarkdown({
      sourceName: sourceName,
      mode: mode,
      indexHtml: indexHtml,
      styleCss: styleCss,
      scriptJs: scriptJs
    });

    outputEl.value = result.markdown;
    downloadBtn.disabled = false;
    copyBtn.disabled = false;
    setStatus('Generated SKILL.md for ' + sourceName + '.', 'success');
  });

  downloadBtn.addEventListener('click', function () {
    var blob = new Blob([outputEl.value], { type: 'text/markdown;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'SKILL.md';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('Downloaded SKILL.md.', 'success');
  });

  copyBtn.addEventListener('click', function () {
    if (!outputEl.value.trim()) {
      setStatus('No output available to copy.', 'error');
      return;
    }

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      setStatus('Clipboard API unavailable. Copy manually from output.', 'error');
      return;
    }

    navigator.clipboard.writeText(outputEl.value).then(function () {
      setStatus('Copied SKILL.md content to clipboard.', 'success');
    }).catch(function () {
      setStatus('Clipboard blocked by browser. Copy manually from output.', 'error');
    });
  });
})();
