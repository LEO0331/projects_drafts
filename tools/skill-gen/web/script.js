(function () {
  var fileInput = document.getElementById('fileInput');
  var folderInput = document.getElementById('folderInput');
  var featureNameEl = document.getElementById('featureName');
  var modeEl = document.getElementById('mode');
  var folderPathEl = document.getElementById('folderPath');
  var cliHintEl = document.getElementById('cliHint');
  var statusTextEl = document.getElementById('statusText');
  var helpBtn = document.getElementById('helpBtn');
  var closeHelpBtn = document.getElementById('closeHelpBtn');
  var helpModal = document.getElementById('helpModal');
  var langToggleBtn = document.getElementById('langToggleBtn');

  var indexEl = document.getElementById('indexHtml');
  var styleEl = document.getElementById('styleCss');
  var scriptEl = document.getElementById('scriptJs');
  var outputEl = document.getElementById('output');

  var generateBtn = document.getElementById('generateBtn');
  var downloadBtn = document.getElementById('downloadBtn');
  var copyBtn = document.getElementById('copyBtn');

  var isZh = (document.documentElement.lang || '').toLowerCase().indexOf('zh') === 0;
  var i18n = {
    en: {
      cliHintEmpty: 'Tip: enter a folder path to generate a CLI command.',
      loaded: 'Loaded {count}/3 expected files from {source}.',
      uploadErr: 'Failed to read uploaded files: ',
      folderErr: 'Failed to read folder files: ',
      missing: 'Provide all 3 files before generating.',
      missingAlert: 'Please provide index.html, style.css, and script.js.',
      generated: 'Generated SKILL.md for {name}.',
      downloaded: 'Downloaded SKILL.md.',
      noOutput: 'No output available to copy.',
      noClipboard: 'Clipboard API unavailable. Copy manually from output.',
      copied: 'Copied SKILL.md content to clipboard.',
      clipboardBlocked: 'Clipboard blocked by browser. Copy manually from output.'
    },
    zh: {
      cliHintEmpty: '提示：輸入資料夾路徑可自動產生 CLI 指令。',
      loaded: '已從 {source} 載入 {count}/3 個必要檔案。',
      uploadErr: '讀取上傳檔案失敗：',
      folderErr: '讀取資料夾檔案失敗：',
      missing: '請先提供 3 個必要檔案再產生。',
      missingAlert: '請提供 index.html、style.css 與 script.js。',
      generated: '已為 {name} 產生 SKILL.md。',
      downloaded: '已下載 SKILL.md。',
      noOutput: '目前沒有可複製的輸出。',
      noClipboard: '瀏覽器不支援剪貼簿 API，請手動複製。',
      copied: '已將 SKILL.md 內容複製到剪貼簿。',
      clipboardBlocked: '瀏覽器阻擋剪貼簿權限，請手動複製。'
    }
  };

  function t(key) {
    return (isZh ? i18n.zh : i18n.en)[key];
  }

  function fmt(msg, vars) {
    return msg.replace(/\{([^}]+)\}/g, function (_, k) {
      return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : _;
    });
  }

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
      : t('cliHintEmpty');
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
      setStatus(fmt(t('loaded'), { count: found, source: sourceLabel }), found === 3 ? 'success' : null);
    }
  }

  function openHelp() {
    if (!helpModal) return;
    helpModal.hidden = false;
    helpModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeHelp() {
    if (!helpModal) return;
    helpModal.hidden = true;
    helpModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  fileInput.addEventListener('change', function () {
    hydrateFromFiles(fileInput.files, isZh ? '上傳檔案' : 'upload').catch(function (err) {
      setStatus(t('uploadErr') + err.message, 'error');
      alert(t('uploadErr') + err.message);
    });
  });

  folderInput.addEventListener('change', function () {
    hydrateFromFiles(folderInput.files, isZh ? '資料夾輸入' : 'folder input').catch(function (err) {
      setStatus(t('folderErr') + err.message, 'error');
      alert(t('folderErr') + err.message);
    });
  });

  folderPathEl.addEventListener('input', updateCliHint);
  updateCliHint();

  if (helpBtn) {
    helpBtn.addEventListener('click', openHelp);
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      window.location.href = isZh ? './index.html' : './index.zh-TW.html';
    });
  }
  if (closeHelpBtn) {
    closeHelpBtn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      closeHelp();
    });
  }
  if (helpModal) {
    helpModal.addEventListener('click', function (event) {
      if (event.target === helpModal) {
        closeHelp();
      }
    });
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && helpModal && !helpModal.hidden) {
      closeHelp();
    }
  });

  generateBtn.addEventListener('click', function () {
    var indexHtml = indexEl.value.trim();
    var styleCss = styleEl.value.trim();
    var scriptJs = scriptEl.value.trim();

    if (!indexHtml || !styleCss || !scriptJs) {
      setStatus(t('missing'), 'error');
      alert(t('missingAlert'));
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
    setStatus(fmt(t('generated'), { name: sourceName }), 'success');
  });

  downloadBtn.addEventListener('click', function () {
    var blob = new Blob([outputEl.value], { type: 'text/markdown;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'SKILL.md';
    a.click();
    URL.revokeObjectURL(url);
    setStatus(t('downloaded'), 'success');
  });

  copyBtn.addEventListener('click', function () {
    if (!outputEl.value.trim()) {
      setStatus(t('noOutput'), 'error');
      return;
    }

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      setStatus(t('noClipboard'), 'error');
      return;
    }

    navigator.clipboard.writeText(outputEl.value).then(function () {
      setStatus(t('copied'), 'success');
    }).catch(function () {
      setStatus(t('clipboardBlocked'), 'error');
    });
  });
})();
