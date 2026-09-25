/* ============================================================
   Réseaux pour les nuls — application (navigation, quiz,
   indices, bypass, labos Packet Tracer, sauvegarde)
   ============================================================ */
(function () {
  'use strict';
  var MODULES = (window.MODULES || []).slice().sort(function (a, b) { return a.num - b.num; });
  var STORE = 'reseaux-pour-les-nuls-v1';
  var W = window.W;

  /* ---------------------------------------------------------- */
  /* État & sauvegarde (navigateur + fichier via le serveur)     */
  /* ---------------------------------------------------------- */
  function blank() { return { v: 1, updatedAt: 0, done: {}, tries: {}, hints: {}, ui: {}, labs: {}, first: {}, last: null, exam: {} }; }
  var state = loadLocal();
  var server = false;
  function loadLocal() {
    try { var raw = localStorage.getItem(STORE); if (raw) { var s = JSON.parse(raw); return Object.assign(blank(), s); } } catch (e) {}
    return blank();
  }
  var saveTimer = null;
  function save(immediate) {
    state.updatedAt = Date.now();
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* quota : on garde le serveur */ }
    if (!server) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(pushServer, immediate ? 10 : 700);
  }
  function pushServer() {
    var body = JSON.stringify(state);
    fetch('/api/progression', { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } })
      .then(function (r) { setSaveLabel(r.ok ? 'ok' : 'err'); })
      .catch(function () { setSaveLabel('err'); });
    fetch('/api/csv', { method: 'POST', body: toCSV() }).catch(function () {});
  }
  function setSaveLabel(s) {
    var e = document.getElementById('saveState');
    if (!e) return;
    if (s === 'ok') { e.textContent = '✔ Progression enregistrée (sauvegarde/progression.json)'; e.className = 'sf-save ok'; }
    else if (s === 'err') { e.textContent = '⚠ Serveur injoignable : sauvegarde dans le navigateur'; e.className = 'sf-save'; }
    else { e.textContent = 'Sauvegarde : navigateur uniquement (lance « Réseaux pour les nuls » depuis le Bureau pour un fichier)'; e.className = 'sf-save'; }
  }
  function toCSV() {
    var rows = [['module', 'question', 'type', 'statut', 'essais_rates', 'indices_vus']];
    MODULES.forEach(function (m) {
      m.questions.forEach(function (q, i) {
        var s = state.done[q.id];
        rows.push([m.num + ' ' + m.titre, 'Q' + (i + 1) + ' ' + stripTags(q.q).slice(0, 80), q.type, s === 'ok' ? 'réussie' : s === 'bypass' ? 'passée (réponse vue)' : 'à faire', state.tries[q.id] || 0, state.hints[q.id] || 0]);
      });
    });
    return rows.map(function (r) { return r.map(function (c) { c = String(c); return /[;"\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(';'); }).join('\r\n');
  }
  function syncServer() {
    if (location.protocol === 'file:') { setSaveLabel('none'); return; }
    fetch('/api/progression', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (s) {
      server = true;
      if (s && s.updatedAt && s.updatedAt > (state.updatedAt || 0)) {
        state = Object.assign(blank(), s);
        try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {}
        route();
        toast('Progression rechargée depuis le fichier de sauvegarde.');
      } else if ((state.updatedAt || 0) > ((s && s.updatedAt) || 0)) pushServer();
      setSaveLabel('ok');
    }).catch(function () { server = false; setSaveLabel('none'); });
  }

  /* ---------------------------------------------------------- */
  /* Aides                                                       */
  /* ---------------------------------------------------------- */
  function $(id) { return document.getElementById(id); }
  function stripTags(s) { return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }
  function modById(id) { return MODULES.filter(function (m) { return m.id === id; })[0]; }
  function modProgress(m) {
    var ok = 0, byp = 0;
    m.questions.forEach(function (q) { var s = state.done[q.id]; if (s === 'ok') ok++; else if (s === 'bypass') byp++; });
    return { ok: ok, bypass: byp, total: m.questions.length, complete: ok + byp === m.questions.length };
  }
  function globalProgress() {
    var d = 0, t = 0;
    MODULES.forEach(function (m) { var p = modProgress(m); d += p.ok + p.bypass; t += p.total; });
    return { done: d, total: t, pct: t ? Math.round(100 * d / t) : 0 };
  }
  function firstUnsolved(m) {
    for (var i = 0; i < m.questions.length; i++) if (!state.done[m.questions[i].id]) return i;
    return m.questions.length;
  }
  function toast(msg) {
    var t = $('toast'); t.innerHTML = msg; t.classList.add('show');
    clearTimeout(toast.tm); toast.tm = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }
  window.APP_TOAST = toast;
  function confetti(n) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var box = $('confetti'), cols = ['#00bceb', '#6cc04a', '#fbab18', '#e2231a', '#ffffff', '#049fd9'];
    for (var i = 0; i < (n || 60); i++) {
      var c = document.createElement('div');
      c.className = 'cf';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = cols[i % cols.length];
      c.style.animationDuration = (1.6 + Math.random() * 1.8) + 's';
      c.style.animationDelay = (Math.random() * .4) + 's';
      box.appendChild(c);
      setTimeout(function (x) { return function () { x.remove(); }; }(c), 4200);
    }
  }

  /* ---------------------------------------------------------- */
  /* Barre latérale                                               */
  /* ---------------------------------------------------------- */
  var SECTIONS = { 1: 'Les bases', 5: 'Adressage & routage', 8: 'LAN & services', 13: 'Aller plus loin', 18: 'Mise en pratique' };
  function renderSidebar(activeId) {
    var list = $('moduleList');
    list.innerHTML = '';
    MODULES.forEach(function (m) {
      if (SECTIONS[m.num]) { var s = document.createElement('div'); s.className = 'mod-sep'; s.textContent = SECTIONS[m.num]; list.appendChild(s); }
      var p = modProgress(m);
      var it = document.createElement('div');
      it.className = 'mod-item' + (m.id === activeId ? ' active' : '');
      it.innerHTML = '<span class="mi-num">' + m.num + '</span><span class="mi-icon">' + m.icon + '</span><span class="mi-txt">' + m.titre +
        '<span class="mi-sub">' + m.sous + '</span></span><span class="mi-state' + (p.complete ? ' done' : '') + '">' + (p.complete ? '✔' : (p.ok + p.bypass) + '/' + p.total) + '</span>';
      it.onclick = function () { go('#/m/' + m.id); $('sidebar').classList.remove('open'); };
      list.appendChild(it);
    });
    var g = globalProgress();
    $('gpFill').style.width = g.pct + '%';
    $('gpLabel').textContent = g.pct + ' % — ' + g.done + '/' + g.total + ' questions';
  }

  /* ---------------------------------------------------------- */
  /* Routage (hash)                                               */
  /* ---------------------------------------------------------- */
  function go(h) { if (location.hash === h) route(); else location.hash = h; }
  function route() {
    var h = location.hash || '#/';
    var m = /^#\/m\/([\w-]+)(?:\/(cours|quiz))?(?:\/(\d+))?/.exec(h);
    if (window.PTUI && PTUI.isOpen()) PTUI.close();
    if (m) { showModule(m[1], m[2] || null, m[3] != null ? +m[3] : null); return; }
    if (h === '#/fiche') { showFiche(); return; }
    showHome();
  }
  window.addEventListener('hashchange', route);

  /* ---------------------------------------------------------- */
  /* Accueil                                                      */
  /* ---------------------------------------------------------- */
  function showHome() {
    renderSidebar(null);
    var v = $('view');
    var g = globalProgress();
    var nbPT = 0, nbXL = 0;
    MODULES.forEach(function (m) { m.questions.forEach(function (q) { if (q.type === 'pt') nbPT++; if (q.type === 'grid') nbXL++; }); });
    var resume = state.last && modById(state.last.mod) ? modById(state.last.mod) : MODULES[0];
    var html = '<section class="hero"><img class="hero-art" src="assets/img/hero.svg" alt="">' +
      '<h2>Réseaux <em>pour les nuls</em></h2>' +
      '<p>Architecture, modèles et protocoles des réseaux — tout ton module IMT, du modèle OSI à HSRP, en passant par le routage, les VLAN, DHCP, DNS, NAT, IPv6 et le SDN. Des cours simples, des questions qui ne te lâchent pas tant que tu n’as pas compris, un <b>Packet Tracer intégré</b> identique au vrai et des <b>tableaux Excel</b> comme en DS.</p>' +
      '<div class="hero-stats"><div class="hero-stat"><b>' + MODULES.length + '</b>modules</div><div class="hero-stat"><b>' + g.total + '</b>questions</div><div class="hero-stat"><b>' + nbPT + '</b>labos Packet Tracer</div><div class="hero-stat"><b>' + nbXL + '</b>tableaux Excel</div><div class="hero-stat"><b>' + g.pct + ' %</b>réalisé</div></div>' +
      '<button class="btn" id="btnResume">' + (g.done ? '▶ Reprendre : ' + resume.titre : '▶ Commencer : ' + MODULES[0].titre) + '</button></section>';
    html += '<h3 class="home-title">Comment ça marche ?</h3><div class="howto">' +
      '<div class="how-step"><b>📖 1. Le cours</b>Chaque module commence par un cours « pour les nuls » tiré de tes supports (analogies, schémas, pièges d’examen).</div>' +
      '<div class="how-step"><b>🎯 2. Les questions</b>Tant que ta réponse est fausse, la question suivante reste <b>verrouillée</b>. Pas de triche possible !</div>' +
      '<div class="how-step"><b>💡 3. Les indices</b>Bloqué ? Les indices arrivent du plus vague au plus précis. Et si vraiment ça coince : <b>🏳️ Donne-moi la réponse</b> (la question est marquée « passée »).</div>' +
      '<div class="how-step"><b>🖥️ 4. Packet Tracer & Excel</b>Les labos s’ouvrent dans un Packet Tracer intégré (CLI Cisco, Config, Desktop des PC…). Les tables de routage se remplissent dans une grille Excel.</div>' +
      '<div class="how-step"><b>💾 5. Sauvegarde auto</b>Tout est enregistré au fur et à mesure (fichier <code>sauvegarde/progression.json</code> + navigateur), y compris tes configs dans les labos.</div>' +
      '</div>';
    html += '<h3 class="home-title">Les modules</h3><div class="home-grid">';
    MODULES.forEach(function (m) {
      var p = modProgress(m);
      var pt = m.questions.filter(function (q) { return q.type === 'pt'; }).length;
      var xl = m.questions.filter(function (q) { return q.type === 'grid'; }).length;
      html += '<div class="home-card" data-id="' + m.id + '"><div class="hc-top"><span class="hc-icon">' + m.icon + '</span><span class="hc-num">Module ' + m.num + '</span></div>' +
        '<h3>' + m.titre + '</h3><p>' + m.sous + '</p><div class="hc-tags"><span class="tag">' + p.total + ' questions</span>' +
        (pt ? '<span class="tag pt">' + pt + ' labo' + (pt > 1 ? 's' : '') + ' PT</span>' : '') + (xl ? '<span class="tag xl">' + xl + ' Excel</span>' : '') +
        '</div><div class="hc-prog"><div class="hc-fill' + (p.complete ? ' full' : '') + '" style="width:' + Math.round(100 * (p.ok + p.bypass) / p.total) + '%"></div></div></div>';
    });
    html += '</div>';
    v.innerHTML = html;
    v.querySelectorAll('.home-card').forEach(function (c) { c.onclick = function () { go('#/m/' + c.dataset.id); }; });
    $('btnResume').onclick = function () { go('#/m/' + resume.id + (g.done ? '/quiz' : '')); };
    $('main').scrollTop = 0;
  }

  /* ---------------------------------------------------------- */
  /* Module                                                       */
  /* ---------------------------------------------------------- */
  var cur = { mod: null, tab: 'cours', qi: 0, ctl: null };
  function showModule(id, tab, qi) {
    var m = modById(id);
    if (!m) { showHome(); return; }
    if (!tab) tab = (state.last && state.last.mod === id && state.last.tab) || 'cours';
    cur.mod = m; cur.tab = tab;
    state.last = { mod: id, tab: tab }; save();
    renderSidebar(id);
    var p = modProgress(m);
    var v = $('view');
    v.innerHTML = '<div class="mod-head"><span class="mh-icon">' + m.icon + '</span><div><h2>Module ' + m.num + ' — ' + m.titre + '</h2><div class="mh-sub">' + m.sous + '</div></div></div>' +
      (m.source ? '<div class="mod-src">D’après tes supports : <b>' + m.source + '</b></div>' : '') +
      '<div class="tabs"><button class="tab' + (tab === 'cours' ? ' active' : '') + '" data-t="cours">📖 Cours</button>' +
      '<button class="tab' + (tab === 'quiz' ? ' active' : '') + '" data-t="quiz">🎯 Questions <span class="badge">' + (p.ok + p.bypass) + '/' + p.total + '</span></button></div><div id="tabBody"></div>';
    v.querySelectorAll('.tab').forEach(function (b) { b.onclick = function () { go('#/m/' + id + '/' + b.dataset.t); }; });
    if (tab === 'cours') renderLesson(m);
    else renderQuiz(m, qi);
    $('main').scrollTop = 0;
  }
  function renderLesson(m) {
    var b = $('tabBody');
    b.innerHTML = '<div class="lesson">' + m.cours + '<div class="go-quiz"><button class="btn" id="goQuiz">🎯 Passer aux questions</button></div></div>';
    $('goQuiz').onclick = function () { go('#/m/' + m.id + '/quiz'); };
    if (window.TOOLS) b.querySelectorAll('[data-tool]').forEach(function (e) { var f = TOOLS[e.dataset.tool]; if (f) f(e); });
  }

  /* ---------------------------------------------------------- */
  /* Quiz                                                         */
  /* ---------------------------------------------------------- */
  function renderQuiz(m, qi) {
    var b = $('tabBody');
    var first = firstUnsolved(m);
    if (qi == null) qi = Math.min(first, m.questions.length);
    if (qi > first) qi = first;
    if (qi >= m.questions.length) { renderDone(m); return; }
    cur.qi = qi;
    var q = m.questions[qi];
    var solved = state.done[q.id] || null;
    /* points de progression */
    var dots = m.questions.map(function (qq, i) {
      var s = state.done[qq.id];
      return '<span class="q-dot' + (s === 'ok' ? ' ok' : s === 'bypass' ? ' bypass' : '') + (i === qi ? ' cur' : '') + (i > first ? ' locked' : '') + '" data-i="' + i + '" title="Question ' + (i + 1) + '"></span>';
    }).join('');
    b.innerHTML = '<div class="quiz-top"><span class="q-count">Question ' + (qi + 1) + ' / ' + m.questions.length + (solved ? (solved === 'ok' ? ' — ✔ réussie' : ' — ↷ passée') : '') + '</span><div class="q-dots">' + dots + '</div></div>' +
      '<div class="q-card' + (q.type === 'grid' || q.type === 'pt' ? ' wide' : '') + '" id="qCard"><div class="q-kind">' + W.kindLabel(q) + (q.tag ? '<span class="pill">' + q.tag + '</span>' : '') + '</div>' +
      '<div class="q-text">' + q.q + '</div><div id="qWidget"></div><div class="q-feedback" id="qFb"></div><div class="hints" id="qHints"></div>' +
      '<div class="answer-box" id="qAns" style="display:none"></div><div class="explain-box" id="qExp" style="display:none"></div>' +
      '<div class="q-actions" id="qAct"></div></div><div class="q-nav" id="qNav"></div>';
    b.querySelectorAll('.q-dot').forEach(function (d) {
      d.onclick = function () { var i = +d.dataset.i; if (i <= first) go('#/m/' + m.id + '/quiz/' + i); };
    });
    var o = {
      saved: state.ui[q.id], solved: solved,
      save: function (x) { state.ui[q.id] = Object.assign(state.ui[q.id] || {}, x); save(); },
      submit: function () { validate(); },
      autoCheck: q.type === 'qcm' ? function () { validate(); } : null,
      openLab: openLab, getNet: getNet, saveNet: saveNet, resetLab: resetLab
    };
    var ctl = W.render(q, o);
    cur.ctl = ctl; cur.q = q; cur.o = o;
    $('qWidget').appendChild(ctl.el);
    var fb = $('qFb'), act = $('qAct'), nav = $('qNav');
    var nbHints = (q.hints || []).length;
    var shown = Math.min(state.hints[q.id] || 0, nbHints);
    function drawHints() {
      var h = $('qHints'); h.innerHTML = '';
      for (var i = 0; i < shown; i++) h.innerHTML += '<div class="hint-box"><span>💡</span><div><b>Indice ' + (i + 1) + ' :</b> ' + q.hints[i] + '</div></div>';
    }
    drawHints();
    function feedback(kind, msg) { fb.className = 'q-feedback ' + kind; fb.innerHTML = msg; }
    function showExplain() {
      if (q.explain) { var e = $('qExp'); e.style.display = 'block'; e.innerHTML = '<b>💬 À retenir :</b> ' + q.explain; }
    }
    function showAnswer() {
      var a = $('qAns');
      a.style.display = 'block';
      a.innerHTML = '<b>🏳️ La réponse :</b> ' + answerHtml(q);
      if (q.type === 'pt' && q.solution) {
        var bt = document.createElement('button');
        bt.className = 'btn small pt'; bt.style.marginTop = '8px';
        bt.innerHTML = '⚙ Appliquer la solution dans le labo';
        bt.onclick = function () {
          applySolution(q);
          toast('Solution appliquée : ouvre Packet Tracer pour l’observer (ping, show run…).');
          if (ctl.refresh) ctl.refresh();
        };
        a.appendChild(bt);
      }
    }
    function drawActions() {
      act.innerHTML = '';
      nav.innerHTML = '';
      var prev = document.createElement('button');
      prev.className = 'btn ghost small'; prev.textContent = '← Précédente';
      prev.disabled = qi === 0;
      prev.onclick = function () { go('#/m/' + m.id + '/quiz/' + (qi - 1)); };
      nav.appendChild(prev);
      if (state.done[q.id]) {
        var next = document.createElement('button');
        next.className = 'btn'; next.textContent = qi + 1 < m.questions.length ? 'Question suivante →' : 'Terminer le module ✔';
        next.onclick = function () { go('#/m/' + m.id + '/quiz/' + (qi + 1)); };
        act.appendChild(next);
        setTimeout(function () { next.focus(); }, 30);
        return;
      }
      var val = document.createElement('button');
      val.className = 'btn green'; val.textContent = q.type === 'pt' ? '✔ Vérifier le labo' : '✔ Valider';
      val.onclick = validate;
      act.appendChild(val);
      if (nbHints) {
        var hb = document.createElement('button');
        hb.className = 'btn ghost'; hb.textContent = '💡 Indice' + (shown < nbHints ? ' (' + (shown + 1) + '/' + nbHints + ')' : ' (plus d’indice)');
        hb.disabled = shown >= nbHints;
        hb.onclick = function () {
          shown++; state.hints[q.id] = shown; save(); drawHints(); drawActions();
        };
        act.appendChild(hb);
      }
      var sp = document.createElement('span'); sp.className = 'spacer'; act.appendChild(sp);
      var by = document.createElement('button');
      by.className = 'btn warn'; by.textContent = '🏳️ Donne-moi la réponse';
      by.onclick = function () {
        if (!confirm('Afficher la réponse ? La question sera marquée « passée » (↷) et tu pourras continuer.')) return;
        state.done[q.id] = 'bypass'; save();
        ctl.reveal(); if (ctl.lock) ctl.lock();
        feedback('info', 'Pas de souci : lis bien la réponse et l’explication, puis continue. Tu pourras refaire cette question plus tard.');
        showAnswer(); showExplain();
        drawActions(); renderSidebar(m.id); refreshTop();
      };
      act.appendChild(by);
    }
    function refreshTop() {
      var s = state.done[q.id];
      var c = b.querySelector('.q-count');
      c.textContent = 'Question ' + (qi + 1) + ' / ' + m.questions.length + (s ? (s === 'ok' ? ' — ✔ réussie' : ' — ↷ passée') : '');
      var dd = b.querySelectorAll('.q-dot')[qi];
      dd.classList.toggle('ok', s === 'ok'); dd.classList.toggle('bypass', s === 'bypass');
      var tb = document.querySelector('.tab[data-t="quiz"] .badge');
      var p = modProgress(m);
      if (tb) tb.textContent = (p.ok + p.bypass) + '/' + p.total;
    }
    function validate() {
      if (state.done[q.id]) return;
      var r = ctl.check();
      if (!r) return;
      if (r.empty) { feedback('info', r.msg); return; }
      if (r.ok) {
        state.done[q.id] = 'ok';
        if (!state.tries[q.id]) state.first[q.id] = true;
        save();
        if (ctl.lock) { o.solvedOk = true; ctl.lock(); }
        feedback('good', pick(['✔ Bravo, c’est ça !', '✔ Exact !', '✔ Parfait !', '✔ Bien joué !', '✔ Correct !']) + (r.okMsg ? ' ' + r.okMsg : '') + (q.okMsg ? ' ' + q.okMsg : ''));
        showExplain();
        confetti(q.type === 'pt' || q.type === 'grid' ? 90 : 35);
        drawActions(); renderSidebar(m.id); refreshTop();
        if (modProgress(m).complete) setTimeout(function () { confetti(120); }, 500);
        return;
      }
      state.tries[q.id] = (state.tries[q.id] || 0) + 1; save();
      feedback('bad', '✘ ' + r.msg + (nbHints && shown < nbHints && state.tries[q.id] >= 2 ? ' <i>(Besoin d’un coup de pouce ? Clique sur 💡 Indice.)</i>' : ''));
      var card = $('qCard'); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
    }
    window.APP_VALIDATE = function (qid) { if (cur.q && cur.q.id === qid) validate(); };
    if (solved) {
      ctl.reveal(); if (ctl.lock) ctl.lock();
      if (solved === 'ok') feedback('good', '✔ Question réussie.');
      else { feedback('info', '↷ Question passée (réponse affichée).'); showAnswer(); }
      showExplain();
      if (solved === 'bypass' && q.type !== 'pt') { /* permet de la retenter */
        var retry = document.createElement('button');
        retry.className = 'btn ghost small'; retry.textContent = '↺ Retenter cette question';
        retry.onclick = function () { delete state.done[q.id]; delete state.ui[q.id]; save(); renderSidebar(m.id); renderQuiz(m, qi); };
        setTimeout(function () { act.appendChild(retry); }, 0);
      }
    }
    if (q.type === 'pt' && ctl.refresh && labCache[q.id]) ctl.refresh();
    drawActions();
    if (ctl.focus && !solved) setTimeout(function () { ctl.focus(); }, 60);
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function answerHtml(q) {
    if (q.answerHtml) return q.answerHtml;
    if (q.type === 'qcm') return q.choices[q.good];
    if (q.type === 'multi') return q.good.map(function (i) { return q.choices[i]; }).join(' ; ');
    if (q.type === 'text') {
      var f = q.fields || [{ answer: q.accept }];
      return f.map(function (x) { var a = Array.isArray(x.answer) ? x.answer[0] : x.answer; return (x.label ? x.label + ' ' : '') + '<code>' + W.esc(typeof a === 'string' || typeof a === 'number' ? a : '(voir explication)') + '</code>'; }).join('<br>');
    }
    if (q.type === 'order') return q.items.map(function (x, i) { return (i + 1) + '. ' + x; }).join('<br>');
    if (q.type === 'match') return q.pairs.map(function (p) { return p[0] + ' → <b>' + p[1] + '</b>'; }).join('<br>');
    if (q.type === 'grid') return 'La grille est remplie ci-dessus (valeurs en bleu).';
    if (q.type === 'pt') return solutionHtml(q);
    return '';
  }
  function solutionHtml(q) {
    if (!q.solution) return 'Voir l’explication.';
    var html = '';
    q.solution.forEach(function (s) {
      if (s.cli) html += '<div class="sol-dev"><b>' + s.dev + '</b> (onglet CLI) :<pre>' + W.esc(s.cli.join('\n')) + '</pre></div>';
      else if (s.host) html += '<div class="sol-dev"><b>' + s.dev + '</b> (Desktop → IP Configuration) : ' + Object.keys(s.host).map(function (k) { return k + ' = <code>' + s.host[k] + '</code>'; }).join(', ') + '</div>';
      else if (s.dhcp) html += '<div class="sol-dev"><b>' + s.dev + '</b> : Desktop → IP Configuration → <b>DHCP</b></div>';
      else if (s.link) html += '<div class="sol-dev">Câble <b>' + s.link[4] + '</b> entre <b>' + s.link[0] + '</b> (' + s.link[1] + ') et <b>' + s.link[2] + '</b> (' + s.link[3] + ')</div>';
      else if (s.text) html += '<div class="sol-dev">' + s.text + '</div>';
    });
    return html;
  }
  function renderDone(m) {
    var p = modProgress(m);
    var idx = MODULES.indexOf(m), nextM = MODULES[idx + 1];
    $('tabBody').innerHTML = '<div class="q-card" style="text-align:center;padding:40px 24px"><div style="font-size:3.2rem">🏆</div>' +
      '<h3 style="margin:10px 0 6px;font-size:1.4rem">Module terminé !</h3><p style="color:var(--muted)">' + p.ok + ' réussie(s), ' + p.bypass + ' passée(s) sur ' + p.total + '.</p>' +
      '<div style="margin-top:18px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">' +
      '<button class="btn ghost" id="dRev">🔁 Revoir les questions</button>' + (nextM ? '<button class="btn" id="dNext">Module suivant : ' + nextM.titre + ' →</button>' : '<button class="btn" id="dHome">🏠 Accueil</button>') + '</div></div>';
    $('dRev').onclick = function () { go('#/m/' + m.id + '/quiz/0'); };
    if (nextM) $('dNext').onclick = function () { go('#/m/' + nextM.id); };
    else $('dHome').onclick = function () { go('#/'); };
  }

  /* ---------------------------------------------------------- */
  /* Labos Packet Tracer                                          */
  /* ---------------------------------------------------------- */
  var labCache = {};
  function buildLab(q) {
    var net = q.build ? q.build() : window.LAB.topo(q.topo);
    return net;
  }
  function getNet(q) {
    if (labCache[q.id]) return labCache[q.id];
    var net;
    if (state.labs[q.id]) {
      try { net = new PTEngine.Net(); net.load(state.labs[q.id]); } catch (e) { net = null; }
    }
    if (!net) net = buildLab(q);
    labCache[q.id] = net;
    return net;
  }
  function saveNet(q) {
    var net = labCache[q.id];
    if (!net) return;
    state.labs[q.id] = net.toJSON();
    save();
  }
  function resetLab(q) {
    delete state.labs[q.id];
    delete labCache[q.id];
    save();
  }
  function applySolution(q) {
    var net = getNet(q);
    window.LAB.apply(net, q.solution);
    saveNet(q);
  }
  function openLab(q) {
    var net = getNet(q);
    PTUI.open({
      net: net, q: q, file: q.file,
      onChange: function () { saveNet(q); },
      onCheck: function () {
        var res = q.tasks.map(function (t) { try { return !!t.check(net); } catch (e) { return false; } });
        if (cur.o && cur.o.onLabResults && cur.q === q) cur.o.onLabResults(res);
        return res;
      },
      onValidate: function () { if (window.APP_VALIDATE) window.APP_VALIDATE(q.id); },
      onReset: function () { resetLab(q); var n = getNet(q); PTUI.reload(n); if (cur.o && cur.o.onLabResults) cur.o.onLabResults(null); },
      hints: q.hints || [], hintIdx: function () { return state.hints[q.id] || 0; },
      solved: function () { return !!state.done[q.id]; }
    });
  }

  /* ---------------------------------------------------------- */
  /* Fiche                                                        */
  /* ---------------------------------------------------------- */
  function showFiche() {
    renderSidebar(null);
    var v = $('view');
    v.innerHTML = '<div class="f-head"><div><h2>📄 Fiche de révision</h2><div class="f-sub">Tout le module condensé : l’essentiel à connaître par cœur pour le DS (adressage, routage, commandes Cisco, ports, protocoles). Imprimable sur une feuille recto-verso.</div></div>' +
      '<div class="no-print"><button class="btn" onclick="window.print()">🖨 Imprimer / PDF</button></div></div><div class="fiche-grid">' + (window.FICHE || '') + '</div>';
    $('main').scrollTop = 0;
  }

  /* ---------------------------------------------------------- */
  /* Démarrage                                                    */
  /* ---------------------------------------------------------- */
  $('homeLink').onclick = function () { go('#/'); };
  $('burger').onclick = function () { $('sidebar').classList.toggle('open'); };
  $('btnFiche').onclick = function () { go('#/fiche'); };
  $('btnReset').onclick = function () {
    if (!confirm('Tout remettre à zéro ? Ta progression (et tes labos) seront effacés.')) return;
    state = blank(); labCache = {};
    try { localStorage.removeItem(STORE); } catch (e) {}
    if (server) fetch('/api/progression', { method: 'DELETE' }).catch(function () {});
    save(true); go('#/'); toast('Progression remise à zéro.');
  };
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    $('btnTheme').textContent = t === 'light' ? '🌙' : '☀️';
    try { localStorage.setItem('reseaux-theme', t); } catch (e) {}
  }
  var th0 = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(th0);
  $('btnTheme').onclick = function () { applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'); };
  window.addEventListener('beforeunload', function () { if (server) { try { navigator.sendBeacon('/api/progression', new Blob([JSON.stringify(state)], { type: 'application/json' })); } catch (e) {} } });
  route();
  syncServer();
  window.APP = { state: function () { return state; }, modules: MODULES, go: go, getNet: getNet };
})();
