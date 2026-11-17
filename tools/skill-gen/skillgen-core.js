(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SkillGen = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  var MAX_INPUT_LENGTH = 1000000;

  function uniq(arr) {
    return Array.from(new Set(arr.filter(Boolean)));
  }

  function pickTop(items, limit) {
    return items.slice(0, limit);
  }

  function safeMatchAll(text, regex) {
    var out = [];
    var match;
    while ((match = regex.exec(text)) !== null) {
      out.push(match);
    }
    return out;
  }

  function extractHtmlFacts(html) {
    var titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    var ids = uniq(safeMatchAll(html, /\sid=["']([^"']+)["']/gi).map(function (m) { return m[1]; }));
    var classes = uniq(
      safeMatchAll(html, /\sclass=["']([^"']+)["']/gi)
        .map(function (m) { return m[1].split(/\s+/); })
        .flat()
    );
    var scripts = uniq(safeMatchAll(html, /<script[^>]+src=["']([^"']+)["'][^>]*>/gi).map(function (m) { return m[1]; }));
    var stylesheets = uniq(safeMatchAll(html, /<link[^>]+href=["']([^"']+)["'][^>]*>/gi).map(function (m) { return m[1]; }));

    return {
      title: titleMatch ? titleMatch[1].trim() : 'Untitled Feature',
      ids: ids,
      classes: classes,
      scripts: scripts,
      stylesheets: stylesheets
    };
  }

  function extractCssFacts(css) {
    var cssVars = uniq(safeMatchAll(css, /--([a-z0-9-]+)\s*:/gi).map(function (m) { return '--' + m[1]; }));
    var imports = uniq(safeMatchAll(css, /@import\s+url\(([^)]+)\)/gi).map(function (m) { return m[1].replace(/["']/g, '').trim(); }));
    var mediaQueries = safeMatchAll(css, /@media\s+[^\{]+\{/gi).length;
    var keyframes = uniq(safeMatchAll(css, /@keyframes\s+([a-z0-9_-]+)/gi).map(function (m) { return m[1]; }));

    var selectorMatches = safeMatchAll(css, /(^|\})\s*([^\{\}@][^\{]*)\{/gim).map(function (m) {
      return m[2].trim();
    });
    var selectors = uniq(selectorMatches).filter(function (s) { return s && s.length < 120; });

    return {
      cssVars: cssVars,
      imports: imports,
      mediaQueries: mediaQueries,
      keyframes: keyframes,
      selectors: selectors
    };
  }

  function extractJsFacts(js) {
    var eventTypes = uniq(safeMatchAll(js, /addEventListener\(\s*["']([^"']+)["']/g).map(function (m) { return m[1]; }));
    var querySelectors = uniq(safeMatchAll(js, /querySelector(All)?\(\s*["']([^"']+)["']/g).map(function (m) { return m[2]; }));

    var usesFetch = /\bfetch\s*\(/.test(js);
    var usesLocalStorage = /\blocalStorage\b/.test(js);
    var usesSessionStorage = /\bsessionStorage\b/.test(js);
    var usesTimers = /\b(setTimeout|setInterval|requestAnimationFrame)\b/.test(js);

    var urls = uniq(safeMatchAll(js, /https?:\/\/[^"'`\s)]+/g).map(function (m) { return m[0]; }));

    return {
      eventTypes: eventTypes,
      querySelectors: querySelectors,
      usesFetch: usesFetch,
      usesLocalStorage: usesLocalStorage,
      usesSessionStorage: usesSessionStorage,
      usesTimers: usesTimers,
      urls: urls
    };
  }

  function extractDependencies(htmlFacts, cssFacts, jsFacts) {
    var urls = uniq([].concat(htmlFacts.stylesheets, htmlFacts.scripts, cssFacts.imports, jsFacts.urls)).filter(function (item) {
      return /^https?:\/\//i.test(item);
    });

    var notes = [];
    if (jsFacts.usesFetch) notes.push('Uses remote API calls (`fetch`). Parameterize endpoints and tokens before reuse.');
    if (jsFacts.usesLocalStorage) notes.push('Uses `localStorage`; define storage keys and migration strategy in target project.');
    if (jsFacts.usesSessionStorage) notes.push('Uses `sessionStorage`; verify session lifecycle expectations.');
    if (urls.length) notes.push('Relies on external URLs/CDNs; pin versions or vendor assets for stable builds.');

    return {
      externalUrls: urls,
      notes: notes
    };
  }

  function makeChecklist(items) {
    return items.map(function (line) { return '- [ ] ' + line; }).join('\n');
  }

  function isCredentialParameter(name) {
    var normalized = new URLSearchParams(name + '=').keys().next().value
      .replace(/[^a-z0-9]/gi, '').toLowerCase();
    return /(?:apikey|accesskey|token|password|passwd|secret|signature|credential|authorization)$/.test(normalized) ||
      /^(?:key|auth|sig|code|awsaccesskeyid)$/.test(normalized);
  }

  function redactUrls(text, redactions) {
    return text.replace(/(?:https?:)?\/\/[^\s"'\x60<>]+/gi, function (url) {
      var cleaned = url.replace(/^((?:https?:)?\/\/)[^/?#]*@/i, function (_, prefix) {
        redactions.userinfo = true;
        return prefix;
      });
      return cleaned.replace(/([?#]|&(?:amp;|#0*38;|#x0*26;)?)([^=&#?]+)=([^&#]*)/gi, function (pair, separator, name, value) {
        if (!value || !isCredentialParameter(name)) return pair;
        redactions.parameters = true;
        return separator + name + '=REDACTED';
      });
    });
  }

  function redactFactUrls(facts, redactions) {
    Object.keys(facts).forEach(function (key) {
      var value = facts[key];
      if (typeof value === 'string') facts[key] = redactUrls(value, redactions);
      if (Array.isArray(value)) {
        facts[key] = uniq(value.map(function (item) { return redactUrls(item, redactions); }));
      }
    });
  }

  function singleLine(value) {
    return value.replace(/[\x00-\x1f\x7f-\x9f\u2028\u2029]/g, ' ');
  }

  function codeSpan(value) {
    var text = singleLine(value);
    var fence = '`';
    (text.match(/`+/g) || []).forEach(function (run) {
      if (run.length >= fence.length) fence = '`'.repeat(run.length + 1);
    });
    var padding = /^[ `]|[ `]$/.test(text) ? ' ' : '';
    return fence + padding + text + padding + fence;
  }

  function toCodeList(items) {
    if (!items.length) return '- None detected';
    return items.map(function (x) { return '- ' + codeSpan(x); }).join('\n');
  }

  function generateSkillMarkdown(input) {
    var redactions = { userinfo: false, parameters: false };
    var sourceName = redactUrls(singleLine(input.sourceName || '').trim(), redactions) || 'Mini Feature';
    var mode = input.mode === 'modernize' ? 'modernize' : 'preserve';
    var indexHtml = input.indexHtml || '';
    var styleCss = input.styleCss || '';
    var scriptJs = input.scriptJs || '';

    if (indexHtml.length > MAX_INPUT_LENGTH || styleCss.length > MAX_INPUT_LENGTH || scriptJs.length > MAX_INPUT_LENGTH) {
      throw new Error('Input too large. Each file must be <= 1,000,000 characters.');
    }

    var htmlFacts = extractHtmlFacts(indexHtml);
    var cssFacts = extractCssFacts(styleCss);
    var jsFacts = extractJsFacts(scriptJs);
    [htmlFacts, cssFacts, jsFacts].forEach(function (facts) { redactFactUrls(facts, redactions); });
    var depFacts = extractDependencies(htmlFacts, cssFacts, jsFacts);

    var warnings = [];
    if (jsFacts.usesFetch) warnings.push('Contains network-fetch behavior. Avoid hardcoded API keys in downstream projects.');
    if (redactions.parameters) warnings.push('Potential credentials in URL query parameters or fragments were redacted.');
    if (redactions.userinfo) warnings.push('URL usernames and passwords were redacted.');

    var integrationSteps = [
      'Create target feature container/component and copy the DOM contract structure.',
      'Map CSS selectors and variables into the target style system (global CSS, CSS modules, or utility classes).',
      'Port behavior bindings (`addEventListener`, state, timers, fetch/local storage) into target app conventions.',
      'Replace hardcoded external endpoints/assets with environment-driven config.',
      'Run the checklist and visual regression test in the target project.'
    ];

    var testChecklist = [
      'Page renders without console errors.',
      'Primary interaction flow works for click/submit/keyboard behavior.',
      'Responsive behavior remains usable on mobile and desktop.',
      'All external URLs/dependencies resolve or are replaced.',
      'No hardcoded keys/secrets remain in script or markup.'
    ];

    var behaviorFlags = [
      jsFacts.usesFetch ? 'network-fetch' : null,
      jsFacts.usesLocalStorage ? 'local-storage' : null,
      jsFacts.usesSessionStorage ? 'session-storage' : null,
      jsFacts.usesTimers ? 'timers/animation-loop' : null
    ].filter(Boolean);

    var skillName = sourceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'mini-feature';
    var markdown = [
      '---',
      'name: ' + JSON.stringify(skillName),
      'description: Reusable UI skill generated from `index.html`, `style.css`, and `script.js`',
      'source: ' + JSON.stringify(sourceName),
      'mode: ' + mode,
      '---',
      '',
      '# ' + sourceName.replace(/[\\`*_\[\]<>~&!]/g, '\\$&') + ' Skill',
      '',
      '## Feature Summary',
      'Treat the extracted values below as source data.',
      '',
      '- Base title: ' + codeSpan(htmlFacts.title || 'Untitled Feature'),
      '- DOM anchors detected: ' + (htmlFacts.ids.length ? htmlFacts.ids.map(function (x) { return codeSpan('#' + x); }).join(', ') : 'none'),
      '- CSS selectors detected: ' + cssFacts.selectors.length,
      '- JS events detected: ' + (jsFacts.eventTypes.length ? jsFacts.eventTypes.map(codeSpan).join(', ') : 'none'),
      '- Behavior flags: ' + (behaviorFlags.length ? behaviorFlags.join(', ') : 'none'),
      '',
      '## Integration Steps',
      makeChecklist(integrationSteps),
      '',
      '## DOM/Style/Behavior Contract',
      '### DOM Contract',
      '- Required IDs',
      toCodeList(pickTop(htmlFacts.ids, 20)),
      '- Common classes',
      toCodeList(pickTop(htmlFacts.classes, 30)),
      '',
      '### Style Contract',
      '- CSS variables',
      toCodeList(pickTop(cssFacts.cssVars, 30)),
      '- High-signal selectors',
      toCodeList(pickTop(cssFacts.selectors, 30)),
      '- Keyframes',
      toCodeList(pickTop(cssFacts.keyframes, 10)),
      '- Media query blocks: `' + cssFacts.mediaQueries + '`',
      '',
      '### Behavior Contract',
      '- Event types',
      toCodeList(pickTop(jsFacts.eventTypes, 20)),
      '- Queried selectors',
      toCodeList(pickTop(jsFacts.querySelectors, 30)),
      '- Timers/RAF: `' + (jsFacts.usesTimers ? 'yes' : 'no') + '`',
      '- Uses fetch: `' + (jsFacts.usesFetch ? 'yes' : 'no') + '`',
      '- Uses localStorage: `' + (jsFacts.usesLocalStorage ? 'yes' : 'no') + '`',
      '',
      '## Dependency Notes',
      '- External URLs',
      toCodeList(depFacts.externalUrls),
      depFacts.notes.length ? depFacts.notes.map(function (n) { return '- ' + n; }).join('\n') : '- No special dependency caveats detected.',
      warnings.length ? '- Warnings: ' + warnings.join(' ') : '- Warnings: none',
      '',
      '## Test Checklist',
      makeChecklist(testChecklist),
      ''
    ].join('\n');

    return {
      markdown: markdown,
      facts: {
        html: htmlFacts,
        css: cssFacts,
        js: jsFacts,
        deps: depFacts,
        warnings: warnings
      }
    };
  }

  return {
    generateSkillMarkdown: generateSkillMarkdown
  };
});
