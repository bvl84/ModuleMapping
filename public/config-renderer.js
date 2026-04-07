(function () {
  'use strict';

  var _data, _defaults, _key, _editMode = false;
  var INDENT = '    ';

  window.renderConfig = function (defaults, storageKey) {
    _defaults = defaults;
    _key = storageKey;
    _data = load();
    injectStyles();
    createToolbar();
    render();
  };

  function load() {
    try {
      var s = localStorage.getItem(_key);
      if (s) {
        var data = JSON.parse(s);
        if (stripJobStatusComponentsForFutureState(data)) {
          localStorage.setItem(_key, JSON.stringify(data));
        }
        if (normalizeFutureStateSections(data)) {
          localStorage.setItem(_key, JSON.stringify(data));
        }
        return data;
      }
    } catch (e) {}
    var data = clone(_defaults);
    normalizeFutureStateSections(data);
    return data;
  }

  function mergedDetailsLabel() {
    return _key === 'config-future-state' ? 'configuration' : 'components';
  }

  /** Future State: nested config rows use `name` (unique within the module), not nameId. */
  function countFsConfigItems(arr) {
    if (!Array.isArray(arr)) return 0;
    var n = 0;
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (item && typeof item === 'object') {
        n += 1;
        if (item.options && item.options.length) {
          n += countFsConfigItems(item.options);
        }
        if (item.configuration && item.configuration.length) {
          n += countFsConfigItems(item.configuration);
        }
      }
    }
    return n;
  }

  function renderFsConfigItem(item, itemPath, depth) {
    var h = '';
    if (!item || typeof item !== 'object') return h;
    if (item.name !== undefined) {
      h += line(depth, sp('key', 'name') + sp('punct', ':') + ' ' + renderValue(item.name, itemPath.concat(['name'])));
    }
    if (item.field !== undefined) {
      h += line(depth, sp('key', 'field') + sp('punct', ':') + ' ' + renderValue(item.field, itemPath.concat(['field'])));
    }
    if (item.display !== undefined) {
      h += line(depth, sp('key', 'display') + sp('punct', ':') + ' ' + renderValue(item.display, itemPath.concat(['display'])));
    }
    if (item.configValue !== undefined) {
      h += line(depth, sp('key', 'configValue') + sp('punct', ':') + ' ' + renderValue(item.configValue, itemPath.concat(['configValue'])));
    }
    if (item.reference3Label !== undefined) {
      h += line(depth, sp('key', 'reference3Label') + sp('punct', ':') + ' ' + renderValue(item.reference3Label, itemPath.concat(['reference3Label'])));
    }
    if (item.reference4Label !== undefined) {
      h += line(depth, sp('key', 'reference4Label') + sp('punct', ':') + ' ' + renderValue(item.reference4Label, itemPath.concat(['reference4Label'])));
    }
    if (item.reference5Label !== undefined) {
      h += line(depth, sp('key', 'reference5Label') + sp('punct', ':') + ' ' + renderValue(item.reference5Label, itemPath.concat(['reference5Label'])));
    }
    if (item.alternativeImage1 !== undefined) {
      h += line(depth, sp('key', 'alternativeImage1') + sp('punct', ':') + ' ' + renderValue(item.alternativeImage1, itemPath.concat(['alternativeImage1'])));
    }
    if (item.alternativeImage2 !== undefined) {
      h += line(depth, sp('key', 'alternativeImage2') + sp('punct', ':') + ' ' + renderValue(item.alternativeImage2, itemPath.concat(['alternativeImage2'])));
    }
    if (item.alternativeImage3 !== undefined) {
      h += line(depth, sp('key', 'alternativeImage3') + sp('punct', ':') + ' ' + renderValue(item.alternativeImage3, itemPath.concat(['alternativeImage3'])));
    }
    if (item.optionCount !== undefined) {
      h += line(depth, sp('key', 'option count') + sp('punct', ':') + ' ' + renderValue(item.optionCount, itemPath.concat(['optionCount'])));
    }
    if (item.options && item.options.length > 0) {
      h += line(depth, sp('key', 'options') + sp('punct', ':') + '');
      for (var oi = 0; oi < item.options.length; oi++) {
        h += renderFsConfigItem(item.options[oi], itemPath.concat(['options', oi]), depth + 1);
      }
    }
    if (item.summary !== undefined) {
      h += line(depth, sp('key', 'summary') + sp('punct', ':') + ' ' + renderValue(item.summary, itemPath.concat(['summary'])));
    }
    if (item.configuration && item.configuration.length > 0) {
      h += line(depth, sp('key', 'sub configuration') + sp('punct', ':') + '');
      for (var j = 0; j < item.configuration.length; j++) {
        h += renderFsConfigItem(item.configuration[j], itemPath.concat(['configuration', j]), depth + 1);
      }
    }
    return h;
  }

  function renderFutureStateConfigurationSection(configArr, detPath, depth) {
    var count = countFsConfigItems(configArr);
    var h = '';
    h += '<div class="line collapsible collapsed">' + pad(depth + 1) +
      sp('key', mergedDetailsLabel()) + sp('punct', ':') + ' ' +
      sp('punct', '(' + count + ' items)') +
      '</div>';
    h += '<div class="collapsible-content hidden">';
    for (var i = 0; i < configArr.length; i++) {
      if (i > 0) h += '<div class="line">\u00a0</div>';
      h += renderFsConfigItem(configArr[i], detPath.concat(['configuration', i]), depth + 2);
    }
    h += '</div>';
    return h;
  }

  /** Future State: Job Status is a leaf module (no configuration/components collapsible). */
  function stripJobStatusComponentsForFutureState(data) {
    if (_key !== 'config-future-state' || !data || !data.sections) return false;
    var changed = false;
    data.sections.forEach(function (sec) {
      if (!sec.entries) return;
      sec.entries.forEach(function (ent) {
        if (ent.nameId !== 'Job Status') return;
        if (ent.details !== undefined) {
          delete ent.details;
          changed = true;
        }
        if (ent.subModules !== undefined) {
          delete ent.subModules;
          changed = true;
        }
      });
    });
    return changed;
  }

  function save() { localStorage.setItem(_key, JSON.stringify(_data)); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /** Future State: wfType is only Direct or Indirect (migrates legacy WF, etc.). */
  function normalizeFutureStateSections(data) {
    if (_key !== 'config-future-state' || !data || !Array.isArray(data.sections)) return false;
    var changed = false;
    data.sections.forEach(function (sec) {
      var next = sec.wfType === 'Indirect' ? 'Indirect' : 'Direct';
      if (sec.wfType !== next) {
        sec.wfType = next;
        changed = true;
      }
    });
    return changed;
  }

  function normalizeFutureStateWfType(v) {
    return v === 'Indirect' ? 'Indirect' : 'Direct';
  }

  function getPath(path) {
    return path.reduce(function (o, k) { return o[k]; }, _data);
  }

  function setPath(path, val) {
    var o = _data;
    for (var i = 0; i < path.length - 1; i++) o = o[path[i]];
    o[path[path.length - 1]] = val;
    save();
  }

  function parsePath(s) {
    return s.split('.').map(function (k) { return isNaN(k) ? k : +k; });
  }

  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function sp(cls, text) {
    return '<span class="' + cls + '">' + text + '</span>';
  }

  function ed(cls, display, path) {
    return '<span class="' + cls + ' editable" data-path="' + path.join('.') + '">' + esc(display) + '</span>';
  }

  function pad(depth) {
    var s = '';
    for (var i = 0; i < depth; i++) s += INDENT;
    return s;
  }

  function line(depth, content) {
    return '<div class="line">' + pad(depth) + content + '</div>';
  }

  function renderValue(val, path) {
    if (val === null) return ed('num', 'null', path);
    if (typeof val === 'boolean') return ed(val ? 'bool-true' : 'bool-false', '' + val, path);
    if (typeof val === 'number') return ed('num', '' + val, path);
    if (typeof val === 'string') return ed('str', val, path);
    return esc('' + val);
  }

  var HIDDEN_KEYS = { Options: 1, Config: 1, actions: 1 };
  var MERGE_KEYS = { Functions: 1, Fields: 1, Ext_Fields: 1 };
  var FLATTEN_KEYS = { entries: 1, details: 1 };

  var WF_TYPE_LABELS = { WF: 'Direct/Indirect', WO: 'Work Order', QO: 'Quote', SJ: 'Search Jobs' };

  /**
   * Cinch-style profiles use wfType "WF" for the primary flow; WO/QO/SJ sections render as compact Backend Systems rows.
   * Future State uses "Direct" / "Indirect" (not "WF") but must still render the full section (wfName, entries, configuration).
   */
  function sectionIsBackendOnly(sec) {
    if (_key === 'config-future-state') return false;
    return !!(sec.wfType && sec.wfType !== 'WF');
  }

  function backendFlowLabel(sec) {
    var typeLabel = WF_TYPE_LABELS[sec.wfType] || sec.wfType;
    var modName = sec.moduleName || '';
    var suffix = modName.replace(/^Module_?/, '');
    if (suffix) return typeLabel + ' - ' + suffix;
    return typeLabel;
  }

  function renderBackendSection(sec, path, depth) {
    var h = '';
    var label = backendFlowLabel(sec);

    if (sec.entries) {
      var names = sec.entries.map(function (ent, ei) {
        return ed('str', ent.nameId, path.concat(['entries', ei, 'nameId']));
      });
      h += line(depth, sp('key', esc(label)) + sp('punct', ':') + ' ' + names.join(sp('punct', ' \u2192 ')));
    }

    return h;
  }

  function renderFutureStateWfTypeLine(sec, path, depth) {
    var n = normalizeFutureStateWfType(sec.wfType);
    var wfPath = path.concat(['wfType']);
    var pathStr = wfPath.join('.');
    var dCls = 'wf-type-pill' + (n === 'Direct' ? ' wf-type-pill-on' : ' wf-type-pill-off');
    var iCls = 'wf-type-pill' + (n === 'Indirect' ? ' wf-type-pill-on' : ' wf-type-pill-off');
    if (_editMode) {
      dCls += ' editable';
      iCls += ' editable';
    }
    return line(depth, sp('key', 'wfType') + sp('punct', ':') + ' ' +
      '<span class="' + dCls + '" data-path="' + pathStr + '" data-wf-type-val="Direct">Direct</span>' +
      sp('punct', '  ·  ') +
      '<span class="' + iCls + '" data-path="' + pathStr + '" data-wf-type-val="Indirect">Indirect</span>');
  }

  function renderSection(sec, path, depth) {
    var h = '';

    if (sec.wfName != null) {
      h += line(depth, sp('key', 'wfName') + sp('punct', ':') + ' ' + ed('str', sec.wfName, path.concat(['wfName'])));
    }

    if (_key === 'config-future-state') {
      h += renderFutureStateWfTypeLine(sec, path, depth);
    } else {
      var wfLabel = WF_TYPE_LABELS[sec.wfType] || sec.wfType;
      h += line(depth, sp('key', 'wfType') + sp('punct', ':') + ' ' + ed('str', wfLabel, path.concat(['wfType'])));
    }

    h += line(depth, sp('key', 'clientId') + sp('punct', ':') + ' ' + ed('str', sec.clientId, path.concat(['clientId'])));

    var metaDepth = depth + 1;
    var bcBgDepth = _key === 'config-future-state' ? depth : depth + 1;

    h += line(metaDepth, sp('key', 'meta title') + sp('punct', ':') + ' ' + ed('str', _data['meta title'] || '', ['meta title']));
    h += line(metaDepth, sp('key', 'meta description') + sp('punct', ':') + ' ' + ed('str', _data['meta description'] || '', ['meta description']));

    h += line(bcBgDepth, sp('key', 'BC') + sp('punct', ':') + ' ' + ed('str', sec.bc, path.concat(['bc'])));
    h += line(bcBgDepth, sp('key', 'backgroundImage') + sp('punct', ':') + ' ' + ed('str', sec.backgroundImage, path.concat(['backgroundImage'])));
    if (_key === 'config-future-state' && sec.font !== undefined && sec.font !== null) {
      h += line(bcBgDepth, sp('key', 'font') + sp('punct', ':') + ' ' + ed('str', sec.font, path.concat(['font'])));
    }
    if (_key === 'config-future-state' && sec.header !== undefined) {
      h += line(bcBgDepth, sp('key', 'header') + sp('punct', ':') + ' ' + renderValue(sec.header, path.concat(['header'])));
    }
    if (_key === 'config-future-state' && sec.footer !== undefined) {
      h += line(bcBgDepth, sp('key', 'footer') + sp('punct', ':') + ' ' + renderValue(sec.footer, path.concat(['footer'])));
    }
    h += '<div class="line">\u00a0</div>';

    var modLabel = sec.moduleName || 'Module';
    h += line(depth, sp('key', esc(modLabel)) + sp('punct', ':'));

    if (sec.entries) {
      for (var i = 0; i < sec.entries.length; i++) {
        if (i > 0) h += '<div class="line">\u00a0</div>';
        h += renderEntry(sec.entries[i], path.concat(['entries', i]), depth + 1);
      }
    }

    return h;
  }

  function renderEntry(entry, path, depth) {
    var h = '';
    var ks = Object.keys(entry);
    for (var i = 0; i < ks.length; i++) {
      var k = ks[i];
      if (k === 'details' || k === 'actions' || k === 'subModules') continue;
      h += renderNode(k, entry[k], path.concat([k]), depth);
    }

    if (entry.details) {
      var detPath = path.concat(['details']);
      var fsConfigArr = (_key === 'config-future-state' && Array.isArray(entry.details.configuration))
        ? entry.details.configuration
        : null;
      var hasFsConfig = fsConfigArr && fsConfigArr.length > 0;

      var merged = [];
      var mergeKeys = Object.keys(entry.details).filter(function (dk) { return MERGE_KEYS[dk]; });
      if (hasFsConfig) {
        mergeKeys = [];
      }
      mergeKeys.forEach(function (dk) {
        var arr = entry.details[dk];
        if (Array.isArray(arr)) {
          arr.forEach(function (v, vi) {
            merged.push({ val: v, path: detPath.concat([dk, vi]) });
          });
        }
      });
      var subMods = entry.subModules || [];
      var totalCount = merged.length + subMods.length;

      if (hasFsConfig) {
        h += renderFutureStateConfigurationSection(fsConfigArr, detPath, depth);
      }

      if (totalCount > 0) {
        var items = merged.map(function (m) { return renderValue(m.val, m.path); });
        h += '<div class="line collapsible collapsed">' + pad(depth + 1) +
          sp('key', mergedDetailsLabel()) + sp('punct', ':') + ' ' +
          sp('punct', '(' + totalCount + ' items)') +
          '</div>';
        h += '<div class="collapsible-content hidden">';
        for (var mi = 0; mi < items.length; mi++) {
          h += line(depth + 2, items[mi]);
        }
        for (var si = 0; si < subMods.length; si++) {
          h += line(depth + 2, ed('str', subMods[si], path.concat(['subModules', si])));
        }
        h += '</div>';
      }

      var otherKeys = Object.keys(entry.details).filter(function (dk) {
        return !MERGE_KEYS[dk] && !HIDDEN_KEYS[dk];
      });
      if (hasFsConfig) {
        otherKeys = otherKeys.filter(function (dk) { return dk !== 'configuration'; });
      }
      otherKeys.forEach(function (dk) {
        h += renderNode(dk, entry.details[dk], detPath.concat([dk]), depth + 1);
      });
    } else if (entry.subModules && entry.subModules.length > 0) {
      h += '<div class="line collapsible collapsed">' + pad(depth + 1) +
        sp('key', mergedDetailsLabel()) + sp('punct', ':') + ' ' +
        sp('punct', '(' + entry.subModules.length + ' items)') +
        '</div>';
      h += '<div class="collapsible-content hidden">';
      for (var si = 0; si < entry.subModules.length; si++) {
        h += line(depth + 2, ed('str', entry.subModules[si], path.concat(['subModules', si])));
      }
      h += '</div>';
    }

    return h;
  }

  function renderNode(key, val, path, depth) {
    var h = '';
    var keyHtml = key !== null ? sp('key', esc(key)) + sp('punct', ':') + ' ' : '';

    if (HIDDEN_KEYS[key]) return '';

    if (val === null || typeof val === 'boolean' || typeof val === 'number' || typeof val === 'string') {
      h += line(depth, keyHtml + renderValue(val, path));
    } else if (Array.isArray(val)) {
      var allPrimitive = val.every(function (v) {
        return v === null || typeof v !== 'object';
      });

      if (allPrimitive && val.length > 0) {
        var items = val.map(function (v, i) {
          return renderValue(v, path.concat([i]));
        });
        h += line(depth, keyHtml + items.join(sp('punct', ', ')));
      } else if (val.length === 0) {
        h += line(depth, keyHtml + sp('punct', '(empty)'));
      } else {
        var isFlat = (key === 'entries' || key === 'sections');
        if (!isFlat && key !== null) h += line(depth, keyHtml);
        var childDepth = isFlat ? depth : depth + 1;
        for (var i = 0; i < val.length; i++) {
          if (isFlat && typeof val[i] === 'object' && val[i] !== null) {
            if (key === 'entries') {
              if (i > 0) h += '<div class="line">\u00a0</div>';
              h += renderEntry(val[i], path.concat([i]), childDepth);
            } else if (key === 'sections') {
              var secObj = val[i];
              if (sectionIsBackendOnly(secObj)) {
                // skip here; backend sections rendered as a group after the loop
              } else {
                h += renderSection(secObj, path.concat([i]), childDepth);
              }
            } else {
              var oKeys = Object.keys(val[i]);
              for (var j = 0; j < oKeys.length; j++) {
                h += renderNode(oKeys[j], val[i][oKeys[j]], path.concat([i, oKeys[j]]), childDepth);
              }
            }
          } else {
            h += renderNode(null, val[i], path.concat([i]), childDepth);
            if (i < val.length - 1 && typeof val[i] === 'object' && val[i] !== null) {
              h += '<div class="line">\u00a0</div>';
            }
          }
        }
      }
    } else if (typeof val === 'object') {
      if (key !== null) h += line(depth, keyHtml);
      var ks = Object.keys(val);
      for (var i = 0; i < ks.length; i++) {
        h += renderNode(ks[i], val[ks[i]], path.concat([ks[i]]), depth + 1);
      }
    }

    return h;
  }

  // --- Main render ---

  var SKIP_TOP_LEVEL = { 'meta title': 1, 'meta description': 1, sections: 1 };

  function render() {
    var h = '';
    var ks = Object.keys(_data);
    for (var i = 0; i < ks.length; i++) {
      if (SKIP_TOP_LEVEL[ks[i]]) continue;
      h += renderNode(ks[i], _data[ks[i]], [ks[i]], 0);
    }
    h += renderNode('sections', _data.sections, ['sections'], 0);

    var backends = [];
    if (_data.sections) {
      _data.sections.forEach(function (sec, si) {
        if (sectionIsBackendOnly(sec)) {
          backends.push({ sec: sec, idx: si });
        }
      });
    }
    if (backends.length > 0) {
      h += '<div class="line">\u00a0</div>';
      h += line(0, sp('key', 'Backend Systems') + sp('punct', ':'));
      backends.forEach(function (b) {
        h += renderBackendSection(b.sec, ['sections', b.idx], 1);
      });
    }

    document.getElementById('config-content').innerHTML = h;
  }

  // --- Click handling ---

  document.addEventListener('click', function (e) {
    if (_editMode) {
      var wft = e.target.closest('[data-wf-type-val]');
      if (wft) {
        var p = parsePath(wft.getAttribute('data-path') || '');
        var pick = wft.getAttribute('data-wf-type-val');
        if (p.length && pick) {
          setPath(p, pick);
          render();
        }
        return;
      }
      var edEl = e.target.closest('.editable');
      if (edEl) { startEdit(edEl); return; }
    }

    var cl = e.target.closest('.collapsible');
    if (cl) {
      var cn = cl.nextElementSibling;
      if (cn && cn.classList.contains('collapsible-content')) {
        cl.classList.toggle('collapsed');
        cn.classList.toggle('hidden');
      }
    }
  });

  function startEdit(span) {
    var path = parsePath(span.dataset.path), val = getPath(path);

    if (typeof val === 'boolean') { setPath(path, !val); render(); return; }

    var isNum = typeof val === 'number';
    var dv = '' + val;
    var inp = document.createElement('input');
    inp.type = isNum ? 'number' : 'text';
    inp.value = dv;
    inp.className = 'inline-edit';
    inp.style.width = Math.max(dv.length * 8 + 20, 60) + 'px';

    span.textContent = '';
    span.appendChild(inp);
    inp.focus();
    inp.select();

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      setPath(path, isNum ? +inp.value : inp.value);
      render();
    }

    inp.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') { ev.preventDefault(); finish(); }
      if (ev.key === 'Escape') { ev.preventDefault(); render(); }
    });
    inp.addEventListener('blur', finish);
  }

  // --- Toolbar ---

  function createToolbar() {
    var bar = document.createElement('div');
    bar.id = 'config-toolbar';

    function btn(label, fn) {
      var b = document.createElement('button');
      b.textContent = label;
      b.onclick = fn;
      bar.appendChild(b);
      return b;
    }

    var editBtn = btn('Edit', function () {
      _editMode = !_editMode;
      document.body.classList.toggle('edit-mode', _editMode);
      editBtn.textContent = _editMode ? 'View' : 'Edit';
      editBtn.classList.toggle('active', _editMode);
    });

    btn('Reset', function () {
      if (!confirm('Reset to defaults? All edits will be lost.')) return;
      localStorage.removeItem(_key);
      _data = clone(_defaults);
      normalizeFutureStateSections(_data);
      render();
    });

    btn('Export JSON', function () {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(_data, null, 2)], { type: 'application/json' }));
      a.download = _key + '.json';
      a.click();
    });

    var fi = document.createElement('input');
    fi.type = 'file'; fi.accept = '.json'; fi.style.display = 'none';
    fi.onchange = function (e) {
      var f = e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function (ev) {
        try {
          _data = JSON.parse(ev.target.result);
          stripJobStatusComponentsForFutureState(_data);
          normalizeFutureStateSections(_data);
          save();
          render();
        }
        catch (x) { alert('Invalid JSON file'); }
      };
      r.readAsText(f);
      fi.value = '';
    };
    btn('Import', function () { fi.click(); });
    bar.appendChild(fi);

    document.body.appendChild(bar);
  }

  // --- Injected CSS ---

  function injectStyles() {
    var s = document.createElement('style');
    s.textContent =
      '#config-toolbar{position:fixed;top:10px;right:10px;z-index:1000;display:flex;gap:6px}' +
      '#config-toolbar button{background:#2d2d2d;color:#d4d4d4;border:1px solid #444;padding:5px 14px;' +
        'font-family:inherit;font-size:12px;cursor:pointer;border-radius:3px;transition:background .15s}' +
      '#config-toolbar button:hover{background:#3a3a3a}' +
      '#config-toolbar button.active{background:#0e639c;border-color:#1177bb;color:#fff}' +
      '.collapsible{cursor:pointer;user-select:none}' +
      '.collapsible:hover{background:#2a2d2e}' +
      '.collapsible::before{content:"\\25BC ";font-size:10px;color:#858585}' +
      '.collapsible.collapsed::before{content:"\\25B6 "}' +
      '.collapsible-content{overflow:hidden}' +
      '.collapsible-content.hidden{display:none}' +
      '.edit-mode .editable{cursor:text;border-bottom:1px dashed rgba(255,255,255,.25);transition:background .1s}' +
      '.edit-mode .editable:hover{background:rgba(255,255,255,.06)}' +
      '.edit-mode .bool-true.editable,.edit-mode .bool-false.editable{cursor:pointer}' +
      '.wf-type-pill{font-weight:500}' +
      '.wf-type-pill-on{color:#ce9178}' +
      '.wf-type-pill-off{color:#858585;opacity:.75}' +
      '.edit-mode .wf-type-pill.editable{cursor:pointer;border-bottom:1px dashed rgba(255,255,255,.25);' +
        'transition:background .1s}' +
      '.edit-mode .wf-type-pill.editable:hover{background:rgba(255,255,255,.06)}' +
      '.inline-edit{background:#1e1e1e;color:inherit;border:1px solid #0e639c;' +
        'font-family:inherit;font-size:inherit;padding:0 4px;outline:none;border-radius:2px;max-width:90vw}';
    document.head.appendChild(s);
  }

})();
