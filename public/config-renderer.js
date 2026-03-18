(function () {
  'use strict';

  var _data, _defaults, _key, _editMode = false;

  window.renderConfig = function (defaults, storageKey) {
    _defaults = defaults;
    _key = storageKey;
    _data = load();
    injectStyles();
    createToolbar();
    render();
  };

  function load() {
    try { var s = localStorage.getItem(_key); if (s) return JSON.parse(s); } catch (e) { /* ignore */ }
    return clone(_defaults);
  }

  function save() { localStorage.setItem(_key, JSON.stringify(_data)); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

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

  // --- HTML helpers ---

  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function sp(cls, raw) {
    return '<span class="' + cls + '">' + raw + '</span>';
  }

  function ev(cls, display, path) {
    return '<span class="' + cls + ' editable" data-path="' + path.join('.') + '">' + esc(display) + '</span>';
  }

  // --- Value rendering ---

  function renderVal(val, path) {
    if (typeof val === 'string') return ev('str', '"' + val + '"', path);
    if (typeof val === 'boolean') return ev(val ? 'bool-true' : 'bool-false', '' + val, path);
    if (typeof val === 'number') return ev('num', '' + val, path);
    return esc('' + val);
  }

  function renderArr(arr, path) {
    var h = sp('bracket', '[');
    for (var i = 0; i < arr.length; i++) {
      if (i) h += sp('punct', ',') + ' ';
      h += renderVal(arr[i], path.concat([i]));
      h += '<span class="eb rm" data-rm="' + path.concat([i]).join('.') + '">\u00d7</span>';
    }
    h += sp('bracket', ']');
    h += '<span class="eb add" data-add="' + path.join('.') + '">+</span>';
    return h;
  }

  function renderObj(obj, path) {
    var ks = Object.keys(obj), h = sp('bracket', '{') + ' ';
    for (var i = 0; i < ks.length; i++) {
      if (i) h += sp('punct', ',') + ' ';
      h += sp('key', esc('"' + ks[i] + '"')) + sp('punct', ':') + ' ' + renderVal(obj[ks[i]], path.concat([ks[i]]));
    }
    return h + ' ' + sp('bracket', '}');
  }

  function renderDetailLine(indent, key, val, path) {
    var h = '<div class="line indent-' + indent + '">' +
      sp('key', esc('"' + key + '"')) + sp('punct', ':') + ' ';
    if (Array.isArray(val)) h += renderArr(val, path);
    else if (val && typeof val === 'object') h += renderObj(val, path);
    else h += renderVal(val, path);
    return h + '</div>';
  }

  // --- Entry header ---

  function renderEntryHeader(entry, path, hasDetails) {
    var h = sp('bracket', '{') + ' ';
    h += sp('key', '"NameID"') + sp('punct', ':') + ' ' + renderVal(entry.nameId, path.concat(['nameId'])) + sp('punct', ',') + ' ';
    h += sp('key', '"Display"') + sp('punct', ':') + ' ' + renderVal(entry.display, path.concat(['display']));
    if (entry.sort != null)
      h += sp('punct', ',') + ' ' + sp('key', '"Sort"') + sp('punct', ':') + ' ' + renderVal(entry.sort, path.concat(['sort']));
    if (!hasDetails && entry.actions)
      h += sp('punct', ',') + ' ' + sp('key', '"actions"') + sp('punct', ':') + ' ' + renderArr(entry.actions, path.concat(['actions']));
    if (!hasDetails) h += ' ' + sp('bracket', '}');
    return h;
  }

  // --- Main render ---

  function render() {
    var h = '';

    _data.comments.forEach(function (c, i) {
      h += '<div class="line comment">// ' + ev('ct', c, ['comments', i]) + '</div>';
    });
    h += '<div class="line">\u00a0</div>';

    h += '<div class="line collapsible">' +
      sp('bracket', '{') + ' ' +
      ev('key', '"' + _data.name + '"', ['name']) +
      sp('punct', ':') + ' ' + sp('bracket', '{') +
      '</div>';
    h += '<div class="collapsible-content">';

    _data.sections.forEach(function (sec, si) {
      if (si) h += '<div class="line indent-1">\u00a0</div>';
      h += renderSection(sec, si);
    });

    h += '</div>';
    h += '<div class="line">' + sp('bracket', '}') + '</div>';

    document.getElementById('config-content').innerHTML = h;
    applyCollapse();
  }

  function renderSection(sec, si) {
    var h = '', sp_ = ['sections', si];
    var meta = [['WF_Type', 'wfType'], ['Client_ID', 'clientId'], ['BC', 'bc'], ['BackgroundImage', 'backgroundImage']];

    meta.forEach(function (m) {
      h += '<div class="line indent-1">' +
        sp('key', esc('"' + m[0] + '"')) + sp('punct', ':') + ' ' +
        renderVal(sec[m[1]], sp_.concat([m[1]])) + sp('punct', ',') +
        '</div>';
    });

    h += '<div class="line indent-1 collapsible">' +
      ev('key', '"' + sec.moduleName + '"', sp_.concat(['moduleName'])) +
      sp('punct', ':') + ' ' + sp('bracket', '[') +
      '</div>';
    h += '<div class="collapsible-content">';

    sec.entries.forEach(function (ent, ei) {
      var ep = sp_.concat(['entries', ei]);
      var hasD = ent.details && Object.keys(ent.details).length > 0;
      var comma = ei < sec.entries.length - 1 ? sp('punct', ',') : '';

      if (hasD) {
        h += '<div class="line indent-2 collapsible">' + renderEntryHeader(ent, ep, true) + '</div>';
        h += '<div class="collapsible-content">';
        Object.keys(ent.details).forEach(function (dk) {
          h += renderDetailLine(3, dk, ent.details[dk], ep.concat(['details', dk]));
        });
        h += '<div class="line indent-2">' + sp('bracket', '}') + comma + '</div>';
        h += '</div>';
      } else {
        h += '<div class="line indent-2">' + renderEntryHeader(ent, ep, false) + comma + '</div>';
      }
    });

    h += '<div class="line indent-1">' + sp('bracket', ']') +
      (si < _data.sections.length - 1 ? sp('punct', ',') : '') + '</div>';
    h += '</div>';
    return h;
  }

  // --- Collapse ---

  function applyCollapse() {
    document.querySelectorAll('.indent-2.collapsible, .indent-3.collapsible, .indent-4.collapsible').forEach(function (el) {
      var c = el.nextElementSibling;
      if (c && c.classList.contains('collapsible-content')) {
        el.classList.add('collapsed');
        c.classList.add('hidden');
      }
    });
  }

  // --- Click handling ---

  document.addEventListener('click', function (e) {
    if (_editMode) {
      var rm = e.target.closest('.rm');
      if (rm) {
        var p = parsePath(rm.dataset.rm), idx = p.pop();
        getPath(p).splice(idx, 1);
        save(); render(); return;
      }
      var add = e.target.closest('.add');
      if (add) {
        getPath(parsePath(add.dataset.add)).push('New Item');
        save(); render(); return;
      }
      var ed = e.target.closest('.editable');
      if (ed) { startEdit(ed); return; }
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
      render();
    });

    btn('Export', function () {
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
        try { _data = JSON.parse(ev.target.result); save(); render(); }
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
      '.eb{display:none}' +
      '.edit-mode .eb{display:inline}' +
      '.edit-mode .editable{cursor:text;border-bottom:1px dashed rgba(255,255,255,.25);transition:background .1s}' +
      '.edit-mode .editable:hover{background:rgba(255,255,255,.06)}' +
      '.edit-mode .bool-true.editable,.edit-mode .bool-false.editable{cursor:pointer}' +
      '.rm{color:#f44747;cursor:pointer;margin-left:2px;font-size:11px}' +
      '.rm:hover{color:#ff6b6b}' +
      '.add{color:#4ec9b0;cursor:pointer;margin-left:4px;font-size:13px;font-weight:bold}' +
      '.add:hover{color:#6ee7c0}' +
      '.inline-edit{background:#1e1e1e;color:inherit;border:1px solid #0e639c;' +
        'font-family:inherit;font-size:inherit;padding:0 4px;outline:none;border-radius:2px;max-width:90vw}' +
      '.ct{color:inherit}';
    document.head.appendChild(s);
  }

})();
