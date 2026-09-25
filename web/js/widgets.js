/* ============================================================
   Types de questions : rendu + correction
   qcm, multi, text, fields, order, match, grid (Excel), pt (labo),
   term (terminal scénarisé), rest (client API REST)
   ============================================================ */
(function () {
  'use strict';
  var N = window.NET;
  var W = {};

  /* ---------------------------------------------------------- */
  /* Outils                                                      */
  /* ---------------------------------------------------------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function shuffle(a, seed) {
    a = a.slice();
    var s = seed || 7;
    for (var i = a.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      var j = Math.floor(s / 233280 * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function seedOf(str) { var h = 0; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100000; return h + 1; }
  function deacc(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  W.el = el; W.esc = esc;

  /* Normalisation / comparaison d'une valeur selon son type */
  var KINDS = {
    text: function (v, a) { return deacc(String(v).trim().toLowerCase().replace(/\s+/g, ' ')) === deacc(String(a).trim().toLowerCase().replace(/\s+/g, ' ')); },
    word: function (v, a) { return deacc(String(v).trim().toLowerCase().replace(/[\s\-_'’.]+/g, '')) === deacc(String(a).trim().toLowerCase().replace(/[\s\-_'’.]+/g, '')); },
    int: function (v, a) { v = String(v).trim().replace(/\s/g, ''); return /^-?\d+$/.test(v) && +v === +a; },
    num: function (v, a) { v = String(v).trim().replace(',', '.').replace(/\s/g, ''); return v !== '' && !isNaN(+v) && Math.abs(+v - +a) < 1e-9; },
    ip: function (v, a) { v = String(v).trim(); return /^\d{1,3}(\.\d{1,3}){3}$/.test(v) && !/(^|\.)0\d/.test(v) && N.ip2int(v) !== null && N.ip2int(v) === N.ip2int(String(a)); },
    mask: function (v, a) {
      v = String(v).trim();
      var l1 = /^\/?\d{1,2}$/.test(v) ? N.parseMask(v) : (!/(^|\.)0\d/.test(v) ? N.maskLen(v) : -1);
      var l2 = N.parseMask(String(a));
      return l1 >= 0 && l1 === l2;
    },
    maskdot: function (v, a) { v = String(v).trim(); return /^\d{1,3}(\.\d{1,3}){3}$/.test(v) && !/(^|\.)0\d/.test(v) && N.maskLen(v) >= 0 && N.maskLen(v) === N.parseMask(String(a)); },
    cidr: function (v, a) {
      var x = N.parseCIDR(String(v).replace(/\s+/g, '')), y = N.parseCIDR(String(a));
      return !!x && !!y && x.ip === y.ip && x.len === y.len;
    },
    ip6: function (v, a) { return N.eq6(String(v).trim(), String(a)); },
    /* forme IPv6 simplifiée au maximum (règles du cours) */
    ip6s: function (v, a) {
      v = String(v).trim().toLowerCase();
      if (!N.eq6(v, String(a))) return false;
      var w = N.parse6(v);
      var groups = v.split('::');
      var written = groups.join(':').split(':').filter(function (g) { return g !== ''; });
      if (written.some(function (g) { return g.length > 1 && g[0] === '0'; })) return false;
      /* plus longue suite de 0 */
      var best = 0, cur = 0;
      w.forEach(function (x) { if (x === 0) { cur++; best = Math.max(best, cur); } else cur = 0; });
      if (best >= 2) return v.indexOf('::') >= 0 && written.length === 8 - best;
      return true;
    },
    ip6full: function (v, a) {
      v = String(v).trim().toLowerCase();
      return /^([0-9a-f]{4}:){7}[0-9a-f]{4}$/.test(v) && N.eq6(v, String(a));
    },
    pfx6: function (v, a) {
      var x = N.parsePrefix6(String(v).replace(/\s+/g, '')), y = N.parsePrefix6(String(a));
      return !!x && !!y && x.len === y.len && N.sameNet6(x.w, y.w, 128);
    },
    mac: function (v, a) { return N.macHex(v).length === 12 && N.macHex(v) === N.macHex(a); },
    iface: function (v, a) {
      var c1 = window.PTEngine.canonIf(String(v).replace(/\s+/g, '')), c2 = window.PTEngine.canonIf(String(a));
      return !!c1 && c1 === c2;
    },
    bin: function (v, a) { return String(v).replace(/[\s.]/g, '') === String(a).replace(/[\s.]/g, ''); }
  };
  W.KINDS = KINDS;
  W.match = function (kind, v, a) {
    if (Array.isArray(a)) return a.some(function (x) { return W.match(kind, v, x); });
    if (a instanceof RegExp) return a.test(String(v).trim());
    if (typeof a === 'function') return !!a(v);
    var f = KINDS[kind || 'text'] || KINDS.text;
    return f(v, a);
  };

  /* ---------------------------------------------------------- */
  /* QCM (une réponse) / multi (plusieurs)                       */
  /* ---------------------------------------------------------- */
  function renderQcm(q, o) {
    var multi = q.type === 'multi';
    var box = el('div', 'choices');
    var order = q.noShuffle ? q.choices.map(function (c, i) { return i; }) : shuffle(q.choices.map(function (c, i) { return i; }), seedOf(q.id));
    var sel = {}, buttons = [];
    var goods = multi ? q.good : [q.good];
    order.forEach(function (i) {
      var b = el('button', 'choice' + (multi ? ' multi' : ''), '<span class="ck"></span><span>' + q.choices[i] + '</span>');
      b.type = 'button';
      b.dataset.i = i;
      b.onclick = function () {
        if (o.solved) return;
        if (multi) { sel[i] = !sel[i]; b.classList.toggle('sel', !!sel[i]); b.classList.remove('bad'); }
        else {
          if (b.classList.contains('bad')) return;
          buttons.forEach(function (x) { x.classList.remove('sel'); });
          sel = {}; sel[i] = true; b.classList.add('sel');
          if (o.autoCheck) o.autoCheck();
        }
      };
      buttons.push(b); box.appendChild(b);
    });
    function mark(showGood) {
      buttons.forEach(function (b) {
        var i = +b.dataset.i;
        if (goods.indexOf(i) >= 0 && showGood) b.classList.add('good');
      });
    }
    return {
      el: box,
      check: function () {
        var chosen = Object.keys(sel).filter(function (k) { return sel[k]; }).map(Number);
        if (!chosen.length) return { empty: true, msg: multi ? 'Coche au moins une réponse.' : 'Choisis une réponse.' };
        if (!multi) {
          var i = chosen[0];
          if (i === q.good) { mark(true); return { ok: true }; }
          buttons.forEach(function (b) { if (+b.dataset.i === i) { b.classList.add('bad'); b.classList.remove('sel'); } });
          sel = {};
          return { ok: false, msg: (q.why && q.why[i]) || 'Ce n’est pas ça.' };
        }
        var ok = chosen.length === goods.length && chosen.every(function (x) { return goods.indexOf(x) >= 0; });
        if (ok) { mark(true); return { ok: true }; }
        var missing = goods.filter(function (g) { return chosen.indexOf(g) < 0; }).length;
        var wrong = chosen.filter(function (c) { return goods.indexOf(c) < 0; }).length;
        return { ok: false, msg: 'Pas tout à fait : ' + (wrong ? wrong + ' case(s) cochée(s) en trop' : '') + (wrong && missing ? ' et ' : '') + (missing ? missing + ' bonne(s) réponse(s) oubliée(s)' : '') + '.' };
      },
      reveal: function () {
        buttons.forEach(function (b) { b.classList.remove('bad', 'sel'); b.disabled = true; });
        mark(true);
      },
      lock: function () { buttons.forEach(function (b) { b.disabled = true; }); }
    };
  }

  /* ---------------------------------------------------------- */
  /* Réponse courte (un ou plusieurs champs)                      */
  /* ---------------------------------------------------------- */
  function renderText(q, o) {
    var fields = q.fields || [{ label: null, kind: q.kind, answer: q.accept, ph: q.ph }];
    var box = el('div', fields.length > 1 || fields[0].label ? 'multi-fields' : 'ans-line');
    var inputs = [];
    fields.forEach(function (f, k) {
      var inp = el('input', 'ans-input');
      inp.type = 'text'; inp.spellcheck = false; inp.autocomplete = 'off';
      inp.placeholder = f.ph || q.ph || 'Ta réponse…';
      if (o.saved && o.saved.v && o.saved.v[k] != null) inp.value = o.saved.v[k];
      inp.oninput = function () { inp.classList.remove('bad', 'good'); o.save({ v: inputs.map(function (x) { return x.value; }) }); };
      inp.onkeydown = function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (k < inputs.length - 1) inputs[k + 1].focus(); else if (o.submit) o.submit();
        }
      };
      inputs.push(inp);
      if (f.label) {
        var lab = el('label', null, '<span>' + f.label + '</span>');
        lab.appendChild(inp);
        box.appendChild(lab);
      } else box.appendChild(inp);
    });
    return {
      el: box,
      focus: function () { var f = inputs.filter(function (i) { return !i.value; })[0] || inputs[0]; if (f) f.focus(); },
      check: function () {
        if (inputs.every(function (i) { return !i.value.trim(); })) return { empty: true, msg: 'Écris ta réponse.' };
        var bad = 0, firstMsg = null;
        fields.forEach(function (f, k) {
          var v = inputs[k].value;
          var ok = W.match(f.kind || q.kind, v, f.answer);
          inputs[k].classList.toggle('good', ok);
          inputs[k].classList.toggle('bad', !ok);
          if (!ok) {
            bad++;
            if (!firstMsg && f.why) {
              for (var i = 0; i < f.why.length; i++) if (W.match(f.why[i][2] || f.kind || q.kind, v, f.why[i][0])) { firstMsg = f.why[i][1]; break; }
            }
          }
        });
        if (!bad) return { ok: true };
        if (!firstMsg && q.why) {
          var v0 = inputs[0].value;
          for (var j = 0; j < q.why.length; j++) if (W.match(q.why[j][2] || fields[0].kind || q.kind, v0, q.why[j][0])) { firstMsg = q.why[j][1]; break; }
        }
        return { ok: false, msg: firstMsg || (fields.length > 1 ? bad + ' champ(s) faux (en rouge).' : 'Ce n’est pas la bonne réponse.') };
      },
      reveal: function () {
        fields.forEach(function (f, k) {
          var a = Array.isArray(f.answer) ? f.answer[0] : f.answer;
          if (typeof a === 'string' || typeof a === 'number') inputs[k].value = a;
          inputs[k].classList.remove('bad'); inputs[k].classList.add('good'); inputs[k].disabled = true;
        });
      },
      lock: function () { inputs.forEach(function (i) { i.disabled = true; }); }
    };
  }

  /* ---------------------------------------------------------- */
  /* Remettre dans l'ordre                                        */
  /* ---------------------------------------------------------- */
  function renderOrder(q, o) {
    var list = el('ol', 'order-list');
    var cur = (o.saved && o.saved.order) || shuffle(q.items.map(function (x, i) { return i; }), seedOf(q.id));
    if (cur.every(function (x, i) { return x === i; }) && q.items.length > 1) cur = cur.slice(1).concat([cur[0]]);
    var dragIdx = null;
    function draw() {
      list.innerHTML = '';
      cur.forEach(function (itemIdx, pos) {
        var li = el('li', 'order-item', '<span class="oi-n">' + (pos + 1) + '</span><span class="oi-txt">' + q.items[itemIdx] + '</span><span class="oi-btns"><button type="button" title="Monter">▲</button><button type="button" title="Descendre">▼</button></span>');
        li.draggable = !o.solved;
        var bs = li.querySelectorAll('button');
        bs[0].onclick = function () { move(pos, pos - 1); };
        bs[1].onclick = function () { move(pos, pos + 1); };
        li.ondragstart = function () { dragIdx = pos; li.classList.add('dragging'); };
        li.ondragend = function () { li.classList.remove('dragging'); };
        li.ondragover = function (e) { e.preventDefault(); };
        li.ondrop = function (e) { e.preventDefault(); if (dragIdx != null) move(dragIdx, pos); dragIdx = null; };
        list.appendChild(li);
      });
    }
    function move(a, b) {
      if (o.solved || b < 0 || b >= cur.length || a === b) return;
      var x = cur.splice(a, 1)[0];
      cur.splice(b, 0, x);
      o.save({ order: cur });
      draw();
    }
    draw();
    return {
      el: list,
      check: function () {
        var ok = cur.every(function (x, i) { return x === i; });
        var lis = list.querySelectorAll('.order-item');
        var nbOk = 0;
        cur.forEach(function (x, i) { lis[i].classList.toggle('good', x === i); lis[i].classList.toggle('bad', x !== i); if (x === i) nbOk++; });
        return ok ? { ok: true } : { ok: false, msg: nbOk + ' élément(s) bien placé(s) sur ' + cur.length + ' (en vert).' };
      },
      reveal: function () { cur = q.items.map(function (x, i) { return i; }); o.solved = true; draw(); list.querySelectorAll('.order-item').forEach(function (l) { l.classList.add('good'); }); },
      lock: function () { o.solved = true; draw(); }
    };
  }

  /* ---------------------------------------------------------- */
  /* Associer                                                    */
  /* ---------------------------------------------------------- */
  function renderMatch(q, o) {
    var box = el('div', 'match-table');
    var rights = shuffle(q.pairs.map(function (p) { return p[1]; }).concat(q.extra || []), seedOf(q.id) + 3);
    rights = rights.filter(function (r, i) { return rights.indexOf(r) === i; });
    var sels = [];
    q.pairs.forEach(function (p, k) {
      var row = el('div', 'match-row', '<div>' + p[0] + '</div>');
      var s = el('select');
      s.innerHTML = '<option value="">— choisir —</option>' + rights.map(function (r) { return '<option>' + esc(r) + '</option>'; }).join('');
      if (o.saved && o.saved.m && o.saved.m[k]) s.value = o.saved.m[k];
      s.onchange = function () { row.classList.remove('good', 'bad'); o.save({ m: sels.map(function (x) { return x.value; }) }); };
      row.appendChild(s);
      sels.push(s); box.appendChild(row);
    });
    return {
      el: box,
      check: function () {
        if (sels.some(function (s) { return !s.value; })) return { empty: true, msg: 'Complète toutes les lignes.' };
        var bad = 0;
        q.pairs.forEach(function (p, k) {
          var ok = sels[k].value === p[1];
          sels[k].parentNode.classList.toggle('good', ok);
          sels[k].parentNode.classList.toggle('bad', !ok);
          if (!ok) bad++;
        });
        return bad ? { ok: false, msg: bad + ' association(s) fausse(s) (en rouge).' } : { ok: true };
      },
      reveal: function () { q.pairs.forEach(function (p, k) { sels[k].value = p[1]; sels[k].disabled = true; sels[k].parentNode.classList.remove('bad'); sels[k].parentNode.classList.add('good'); }); },
      lock: function () { sels.forEach(function (s) { s.disabled = true; }); }
    };
  }

  /* ---------------------------------------------------------- */
  /* Grille façon Excel                                           */
  /* q.cols = [{h, kind, w}], q.rows = [[cell|null...]] où cell =  */
  /* "texte fixe" ou {a: réponse} (à remplir)                     */
  /* q.unordered : les lignes {a} peuvent être dans n'importe quel */
  /* ordre (tables de routage)                                    */
  /* ---------------------------------------------------------- */
  function colName(i) { var s = ''; i++; while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
  function renderGrid(q, o) {
    var off = q.colOffset || 1; /* décalage façon feuille (colonne A vide) */
    var rowOff = q.rowOffset || 1;
    var wrap = el('div', 'xl');
    wrap.innerHTML = '<div class="xl-ribbon"><b>Excel</b><span>' + esc(q.file || 'adressage-routage.xlsx') + '</span><span style="margin-left:auto">Accueil · Insertion · Formules · Données</span></div>' +
      '<div class="xl-fbar"><div class="xl-name">A1</div><div class="xl-fx">fx</div><div class="xl-fval"></div></div><div class="xl-scroll"></div>' +
      '<div class="xl-sheets"><span class="on">' + esc(q.sheet || 'Feuil1') + '</span><span>+</span></div>';
    var scroll = wrap.querySelector('.xl-scroll');
    var nameBox = wrap.querySelector('.xl-name'), fval = wrap.querySelector('.xl-fval');
    var tbl = el('table');
    var ncols = q.cols.length + (q.labels ? 1 : 0);
    var head = '<tr><th class="xl-rown"></th>';
    for (var c = 0; c < ncols + off + 1; c++) head += '<th class="xl-col" data-c="' + c + '">' + colName(c) + '</th>';
    head += '</tr>';
    var rowsHtml = [];
    var r0 = 0;
    function rowHead(n) { return '<th class="xl-rown" data-r="' + n + '">' + (n + 1) + '</th>'; }
    function blanks(n) { var s = ''; for (var i = 0; i < n; i++) s += '<td class="empty"></td>'; return s; }
    /* ligne(s) vide(s) de tête */
    for (var rr = 0; rr < rowOff; rr++) { rowsHtml.push('<tr>' + rowHead(r0) + blanks(ncols + off + 1) + '</tr>'); r0++; }
    if (q.title) { rowsHtml.push('<tr>' + rowHead(r0) + blanks(off) + '<td class="title" colspan="' + ncols + '">' + esc(q.title) + '</td><td class="empty"></td></tr>'); r0++; }
    rowsHtml.push('<tr>' + rowHead(r0) + blanks(off) + (q.labels ? '<td class="empty"></td>' : '') + q.cols.map(function (cc) { return '<td class="hdr" style="min-width:' + (cc.w || 120) + 'px">' + esc(cc.h) + '</td>'; }).join('') + '<td class="empty"></td></tr>');
    r0++;
    var cellRefs = []; /* [ligne][col] = input */
    q.rows.forEach(function (row, ri) {
      var tr = '<tr data-ri="' + ri + '">' + rowHead(r0) + blanks(off);
      if (q.labels) tr += '<td class="lbl">' + esc(q.labels[ri] || '') + '</td>';
      row.forEach(function (cell, ci) {
        if (cell && typeof cell === 'object') tr += '<td class="cell" data-ri="' + ri + '" data-ci="' + ci + '" data-ref="' + colName(off + (q.labels ? 1 : 0) + ci) + (r0 + 1) + '"><input spellcheck="false" autocomplete="off"></td>';
        else if (cell == null || cell === '') tr += '<td class="given"></td>';
        else tr += '<td class="given">' + esc(cell) + '</td>';
      });
      tr += '<td class="empty"></td></tr>';
      rowsHtml.push(tr);
      r0++;
    });
    rowsHtml.push('<tr>' + rowHead(r0) + blanks(ncols + off + 1) + '</tr>');
    tbl.innerHTML = head + rowsHtml.join('');
    scroll.appendChild(tbl);
    var saved = (o.saved && o.saved.g) || {};
    tbl.querySelectorAll('td.cell').forEach(function (td) {
      var ri = +td.dataset.ri, ci = +td.dataset.ci;
      var inp = td.querySelector('input');
      (cellRefs[ri] = cellRefs[ri] || [])[ci] = inp;
      if (saved[ri + ',' + ci] != null) inp.value = saved[ri + ',' + ci];
      inp.onfocus = function () {
        tbl.querySelectorAll('td.sel').forEach(function (x) { x.classList.remove('sel'); });
        td.classList.add('sel');
        nameBox.textContent = td.dataset.ref;
        fval.textContent = inp.value;
        tbl.querySelectorAll('th.cur').forEach(function (x) { x.classList.remove('cur'); });
      };
      inp.oninput = function () {
        td.classList.remove('ok', 'ko', 'rev');
        fval.textContent = inp.value;
        var g = {};
        tbl.querySelectorAll('td.cell').forEach(function (t2) { var v = t2.querySelector('input').value; if (v) g[t2.dataset.ri + ',' + t2.dataset.ci] = v; });
        o.save({ g: g });
      };
      inp.onkeydown = function (e) {
        var k = e.key, nri = ri, nci = ci;
        if (k === 'Enter' || (k === 'ArrowDown')) nri = ri + 1;
        else if (k === 'ArrowUp') nri = ri - 1;
        else if (k === 'Tab') { nci = e.shiftKey ? ci - 1 : ci + 1; }
        else if (k === 'ArrowRight' && inp.selectionStart === inp.value.length) nci = ci + 1;
        else if (k === 'ArrowLeft' && inp.selectionStart === 0) nci = ci - 1;
        else return;
        var t = findCell(nri, nci, k);
        if (t) { e.preventDefault(); t.focus(); t.select(); }
        else if (k === 'Enter') { e.preventDefault(); if (o.submit) o.submit(); }
      };
    });
    function findCell(ri, ci, k) {
      if (cellRefs[ri] && cellRefs[ri][ci]) return cellRefs[ri][ci];
      if (k === 'Tab') {
        /* passe à la ligne suivante */
        for (var r = ri; r < cellRefs.length && r >= 0; r++) {
          if (!cellRefs[r]) continue;
          var cs = cellRefs[r].map(function (x, i) { return x ? i : -1; }).filter(function (i) { return i >= 0; });
          var nx = cs.filter(function (i) { return r > ri || i >= ci; })[0];
          if (nx != null) return cellRefs[r][nx];
          if (r === ri) continue;
        }
      }
      return null;
    }
    var legend = null;
    if (q.legend !== false && q.routeColors) {
      legend = el('div', 'xl-legend', 'Couleurs du prof :<i style="background:#ffff00"></i>réseau directement connecté<i style="background:#4ea72e"></i>route statique<i style="background:#ffc000"></i>route par défaut');
    }
    var box = el('div');
    box.appendChild(wrap);
    if (legend) box.appendChild(legend);

    function rowVals(ri) { return (cellRefs[ri] || []).map(function (i) { return i ? i.value.trim() : null; }); }
    function cellOk(ci, v, ans) { var col = q.cols[ci]; return W.match(col.kind, v, ans); }
    function answersFor(ri) { return q.rows[ri].map(function (c) { return c && typeof c === 'object' ? c.a : null; }); }
    function colorRows(assign) {
      if (!q.routeColors) return;
      tbl.querySelectorAll('tr[data-ri]').forEach(function (tr) {
        var ri = +tr.dataset.ri;
        var src = assign ? assign[ri] : ri;
        tr.classList.remove('rt-c', 'rt-s', 'rt-d');
        if (src == null) return;
        var t = q.rowTypes && q.rowTypes[src];
        if (t) tr.classList.add('rt-' + t);
      });
    }
    return {
      el: box,
      focus: function () { var f = tbl.querySelector('td.cell input'); if (f) f.focus(); },
      check: function () {
        var filled = 0;
        tbl.querySelectorAll('td.cell input').forEach(function (i) { if (i.value.trim()) filled++; });
        if (!filled) return { empty: true, msg: 'Remplis la grille (clique dans une cellule).' };
        var bad = 0, assign = {};
        var rowsIdx = q.rows.map(function (r, i) { return i; }).filter(function (i) { return cellRefs[i]; });
        if (q.unordered) {
          /* appariement ligne utilisateur -> ligne attendue (meilleur score) */
          var groups = {};
          rowsIdx.forEach(function (i) { var gk = q.groupOf ? q.groupOf[i] || 0 : 0; (groups[gk] = groups[gk] || []).push(i); });
          Object.keys(groups).forEach(function (gk) {
            var idx = groups[gk], free = idx.slice();
            var scores = idx.map(function (ui) {
              var v = rowVals(ui);
              return idx.map(function (ai) {
                var a = answersFor(ai), s = 0, full = true;
                a.forEach(function (ans, ci) { if (ans == null) return; if (v[ci] && cellOk(ci, v[ci], ans)) s++; else full = false; });
                return { ai: ai, s: s, full: full };
              });
            });
            /* d'abord les correspondances parfaites, puis les meilleures */
            var taken = {};
            idx.forEach(function (ui, k) {
              var f = scores[k].filter(function (x) { return x.full && !taken[x.ai]; })[0];
              if (f) { assign[ui] = f.ai; taken[f.ai] = 1; }
            });
            idx.forEach(function (ui, k) {
              if (assign[ui] != null) return;
              var cands = scores[k].filter(function (x) { return !taken[x.ai]; }).sort(function (x, y) { return y.s - x.s; });
              if (cands[0]) { assign[ui] = cands[0].ai; taken[cands[0].ai] = 1; }
            });
          });
        } else rowsIdx.forEach(function (i) { assign[i] = i; });
        var okMap = {};
        rowsIdx.forEach(function (ui) {
          var v = rowVals(ui), a = answersFor(assign[ui]);
          okMap[ui] = [];
          (cellRefs[ui] || []).forEach(function (inp, ci) {
            if (!inp) return;
            var ans = a[ci];
            var ok = ans == null ? !inp.value.trim() : (inp.value.trim() !== '' && cellOk(ci, inp.value, ans));
            var td = inp.parentNode;
            td.classList.toggle('ok', ok); td.classList.toggle('ko', !ok);
            okMap[ui][ci] = ok;
            if (!ok) bad++;
          });
        });
        var note = W.gridScore(q, rowsIdx, assign, okMap);
        var noteTxt = note ? ' <b>Barème du DS : ' + note.pts + ' / ' + note.max + ' pts.</b>' : '';
        if (!bad) { colorRows(assign); return { ok: true, okMsg: noteTxt }; }
        return { ok: false, msg: bad + ' cellule(s) fausse(s) ou vide(s) (en rouge).' + (q.unordered ? ' L’ordre des lignes n’a pas d’importance.' : '') + noteTxt };
      },
      reveal: function () {
        q.rows.forEach(function (row, ri) {
          row.forEach(function (c, ci) {
            if (!c || typeof c !== 'object') return;
            var inp = cellRefs[ri][ci];
            inp.value = Array.isArray(c.a) ? c.a[0] : c.a;
            inp.disabled = true;
            inp.parentNode.classList.remove('ko'); inp.parentNode.classList.add('rev');
          });
        });
        colorRows(null);
      },
      lock: function () { tbl.querySelectorAll('input').forEach(function (i) { i.disabled = true; }); if (o.solvedOk) colorRows(null); }
    };
  }

  /* Barème façon DS :
     q.score = {cell: 0.25, maskCol: 1, maskPts: 2.5}  → chaque cellule (hors colonne masque) vaut « cell »,
                                                         le masque (1re ligne) vaut « maskPts »
     q.score = {rows: [1, 1, 2, …]}                    → une ligne entièrement juste rapporte rows[i] */
  W.gridScore = function (q, rowsIdx, assign, okMap) {
    var s = q.score;
    if (!s) return null;
    var pts = 0, max = 0;
    if (s.rows) {
      s.rows.forEach(function (w) { max += w; });
      rowsIdx.forEach(function (ui) {
        var cells = okMap[ui] || [];
        var full = cells.length && cells.every(function (x, ci) { return x === undefined || x; });
        if (full && assign[ui] != null) pts += s.rows[assign[ui]] || 0;
      });
    } else {
      q.rows.forEach(function (row, ri) {
        row.forEach(function (c, ci) {
          if (!c || typeof c !== 'object' || ci === s.maskCol) return;
          max += s.cell;
          if (okMap[ri] && okMap[ri][ci]) pts += s.cell;
        });
      });
      if (s.maskCol != null) { max += s.maskPts; if (okMap[0] && okMap[0][s.maskCol]) pts += s.maskPts; }
    }
    function r(x) { return Math.round(x * 100) / 100; }
    return { pts: r(pts), max: r(max) };
  };

  /* ---------------------------------------------------------- */
  /* Labo Packet Tracer                                           */
  /* ---------------------------------------------------------- */
  function renderPT(q, o) {
    var box = el('div', 'lab-box');
    box.innerHTML = '<div class="lab-head"><img src="assets/pt/misc/app.png" alt=""><div class="lh-t"><b>' + esc(q.file || 'Activité Packet Tracer') + '</b><span>Simulateur Packet Tracer intégré — configure puis clique sur « Vérifier »</span></div></div>' +
      '<div class="lab-prog"><div></div></div><ul class="lab-tasks"></ul>' +
      '<div style="padding:12px 14px;display:flex;gap:9px;flex-wrap:wrap;background:var(--panel-2);border-top:1px solid var(--border)"></div>';
    var ul = box.querySelector('.lab-tasks'), prog = box.querySelector('.lab-prog div'), bar = box.lastChild;
    q.tasks.forEach(function (t, i) { ul.appendChild(el('li', null, '<span class="st">○</span><span>' + t.label + '</span>')); });
    var open = el('button', 'btn pt', '<img src="assets/pt/misc/app.png" style="width:18px;height:18px"> Ouvrir Packet Tracer');
    open.type = 'button';
    open.onclick = function () { o.openLab(q); };
    bar.appendChild(open);
    var reset = el('button', 'btn ghost small', '↺ Recommencer le labo');
    reset.type = 'button';
    reset.onclick = function () { if (confirm('Remettre ce labo dans son état de départ ?')) { o.resetLab(q); showResults(null); } };
    bar.appendChild(reset);
    function showResults(res) {
      var lis = ul.querySelectorAll('li');
      var n = 0;
      q.tasks.forEach(function (t, i) {
        var st = res ? res[i] : null;
        lis[i].className = st === true ? 'ok' : st === false ? 'ko' : '';
        lis[i].querySelector('.st').textContent = st === true ? '✔' : st === false ? '✘' : '○';
        if (st) n++;
      });
      prog.style.width = (res ? Math.round(n * 100 / q.tasks.length) : 0) + '%';
    }
    o.onLabResults = showResults;
    return {
      el: box,
      check: function () {
        var net = o.getNet(q);
        var res = q.tasks.map(function (t) { try { return !!t.check(net); } catch (e) { console.error(e); return false; } });
        showResults(res);
        o.saveNet(q);
        var bad = res.filter(function (x) { return !x; }).length;
        if (!bad) return { ok: true };
        var first = q.tasks[res.indexOf(false)];
        return { ok: false, msg: bad + ' objectif(s) non atteint(s). Premier en échec : « ' + first.label.replace(/<[^>]+>/g, '') + ' ».' + (first.why ? ' ' + first.why : '') };
      },
      reveal: function () { },
      lock: function () { },
      refresh: function () {
        var net = o.getNet(q);
        showResults(q.tasks.map(function (t) { try { return !!t.check(net); } catch (e) { return false; } }));
      }
    };
  }

  /* ---------------------------------------------------------- */
  /* Terminal scénarisé (ex. session SMTP par telnet)            */
  /* q.script(state, line) -> {out:[...], state}                  */
  /* ---------------------------------------------------------- */
  function renderTerm(q, o) {
    var box = el('div', 'term');
    box.innerHTML = '<div class="term-bar"><span>' + esc(q.termTitle || 'Invite de commandes') + '</span><span>■ □ ✕</span></div><div class="term-body" tabindex="0"></div>';
    var body = box.querySelector('.term-body');
    var state = (o.saved && o.saved.st) || JSON.parse(JSON.stringify(q.init || {}));
    var log = (o.saved && o.saved.log) || (q.banner ? q.banner.slice() : []);
    var line = '', inputSpan;
    function prompt() { return q.prompt ? q.prompt(state) : 'C:\\>'; }
    function draw() {
      body.innerHTML = log.map(function (l) {
        if (typeof l === 'object') return '<div class="' + l.c + '">' + esc(l.t) + '</div>';
        return '<div>' + esc(l) + '</div>';
      }).join('') + '<div><span>' + esc(prompt()) + '</span><span class="cur">' + esc(line) + '</span><span style="background:#ccc;color:#000"> </span></div>';
      body.scrollTop = body.scrollHeight;
    }
    var ta = document.createElement('textarea');
    ta.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
    ta.spellcheck = false;
    box.style.position = 'relative';
    box.appendChild(ta);
    function submitLine() {
      log.push(prompt() + line);
      var r = q.script(state, line);
      state = r.state || state;
      (r.out || []).forEach(function (x) { log.push(x); });
      line = '';
      o.save({ st: state, log: log.slice(-300) });
      draw();
      if (q.autoCheck && q.goal(state) && o.submit) o.submit();
    }
    ta.addEventListener('keydown', function (e) {
      if (o.solvedFinal) { e.preventDefault(); return; }
      if (e.key === 'Enter') { e.preventDefault(); submitLine(); return; }
      if (e.key === 'Backspace') { e.preventDefault(); line = line.slice(0, -1); draw(); }
    });
    ta.addEventListener('input', function () {
      var v = ta.value; ta.value = '';
      if (o.solvedFinal) return;
      for (var i = 0; i < v.length; i++) {
        var c = v.charCodeAt(i);
        if (c === 10 || c === 13) submitLine(); else line += v[i];
      }
      draw();
    });
    body.addEventListener('click', function () { ta.focus(); });
    body.addEventListener('focus', function () { ta.focus(); });
    draw();
    return {
      el: box,
      focus: function () { ta.focus(); },
      check: function () { return q.goal(state) ? { ok: true } : { ok: false, msg: q.goalMsg ? q.goalMsg(state) : 'Objectif pas encore atteint.' }; },
      reveal: function () { },
      lock: function () { o.solvedFinal = true; }
    };
  }

  /* ---------------------------------------------------------- */
  /* Client REST façon Postman (lab SDN)                          */
  /* ---------------------------------------------------------- */
  function renderRest(q, o) {
    var box = el('div', 'rest');
    var st = (o.saved && o.saved.rest) || { method: 'GET', url: 'http://localhost:58000/api/v1/', body: '', headers: [['', '']], history: [] };
    box.innerHTML = '<div class="rest-top"><select><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option></select><input spellcheck="false"><button type="button">Send</button></div>' +
      '<div class="rest-tabs"><span data-t="h" class="on">Headers</span><span data-t="b">Body (raw JSON)</span></div>' +
      '<div class="rest-pane"></div><div class="rest-resp"><div class="rest-status">Response</div><div class="rest-body"></div></div>';
    var sel = box.querySelector('select'), url = box.querySelector('input'), pane = box.querySelector('.rest-pane');
    var status = box.querySelector('.rest-status'), rbody = box.querySelector('.rest-body');
    sel.value = st.method; url.value = st.url;
    var tab = 'h';
    function save() { st.method = sel.value; st.url = url.value; o.save({ rest: st }); }
    function drawPane() {
      box.querySelectorAll('.rest-tabs span').forEach(function (s) { s.classList.toggle('on', s.dataset.t === tab); });
      if (tab === 'b') {
        pane.innerHTML = '<textarea spellcheck="false" placeholder=\'{ "username": "...", "password": "..." }\'></textarea>';
        var ta = pane.querySelector('textarea'); ta.value = st.body; ta.oninput = function () { st.body = ta.value; save(); };
      } else {
        pane.innerHTML = '<div class="rest-hdr"><b style="font-size:12px;color:#6b6b6b">KEY</b><b style="font-size:12px;color:#6b6b6b">VALUE</b></div>';
        st.headers.forEach(function (h, i) {
          var r = el('div', 'rest-hdr');
          r.innerHTML = '<input placeholder="Key"><input placeholder="Value">';
          var ins = r.querySelectorAll('input');
          ins[0].value = h[0]; ins[1].value = h[1];
          ins[0].oninput = ins[1].oninput = function () {
            st.headers[i] = [ins[0].value, ins[1].value];
            if (i === st.headers.length - 1 && (ins[0].value || ins[1].value)) { st.headers.push(['', '']); save(); drawPane(); ins = pane.querySelectorAll('.rest-hdr')[i + 1].querySelectorAll('input'); ins[0].focus(); return; }
            save();
          };
          pane.appendChild(r);
        });
      }
    }
    box.querySelectorAll('.rest-tabs span').forEach(function (s) { s.onclick = function () { tab = s.dataset.t; drawPane(); }; });
    sel.onchange = save; url.oninput = save;
    box.querySelector('button').onclick = function () {
      save();
      var hdrs = {};
      st.headers.forEach(function (h) { if (h[0]) hdrs[h[0].trim().toLowerCase()] = h[1].trim(); });
      var r = q.api(sel.value, url.value.trim(), hdrs, st.body, st);
      status.innerHTML = 'Status: <b class="' + (r.code < 300 ? 'ok' : 'ko') + '">' + r.code + ' ' + esc(r.text) + '</b>   Time: ' + (40 + Math.floor(Math.random() * 60)) + ' ms';
      rbody.textContent = typeof r.body === 'string' ? r.body : JSON.stringify(r.body, null, 4);
      st.history.push({ m: sel.value, u: url.value.trim(), code: r.code });
      save();
      if (o.onRest) o.onRest();
    };
    drawPane();
    return {
      el: box,
      check: function () {
        if (q.fields) return null;
        return q.goal(st) ? { ok: true } : { ok: false, msg: q.goalMsg ? q.goalMsg(st) : 'Objectif pas encore atteint.' };
      },
      reveal: function () { }, lock: function () { }, state: function () { return st; }
    };
  }

  W.render = function (q, o) {
    switch (q.type) {
      case 'qcm': case 'multi': return renderQcm(q, o);
      case 'text': return renderText(q, o);
      case 'order': return renderOrder(q, o);
      case 'match': return renderMatch(q, o);
      case 'grid': return renderGrid(q, o);
      case 'pt': return renderPT(q, o);
      case 'term': return renderTerm(q, o);
      case 'rest': {
        /* REST + éventuels champs réponse */
        var r = renderRest(q, o);
        if (!q.fields) return r;
        var t = renderText(q, o);
        var wrap = el('div');
        wrap.appendChild(r.el);
        var p = el('div', null, '<div style="margin-top:12px;font-size:.9rem;color:var(--text-2)">' + (q.fieldsIntro || 'Réponds grâce aux réponses de l’API :') + '</div>');
        wrap.appendChild(p);
        wrap.appendChild(t.el);
        return { el: wrap, check: t.check, reveal: t.reveal, lock: t.lock, focus: t.focus };
      }
    }
    return { el: el('div', null, 'Type inconnu : ' + q.type), check: function () { return { ok: true }; }, reveal: function () {}, lock: function () {} };
  };
  W.kindLabel = function (q) {
    return {
      qcm: 'QCM', multi: 'Plusieurs réponses', text: 'Réponse courte', order: 'Remettre dans l’ordre', match: 'Associer',
      grid: 'Tableau Excel', pt: 'Labo Packet Tracer', term: 'Terminal', rest: 'API REST (Postman)'
    }[q.type] || q.type;
  };

  window.W = W;
})();
