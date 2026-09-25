/* ============================================================
   Terminal texte (CLI IOS / invite de commandes des PC)
   - historique ↑↓, Tab, ?, Ctrl+C / Ctrl+Z, --More--, collage
   - affichage progressif des pings, messages asynchrones
   ============================================================ */
(function (root) {
  'use strict';

  function Term(el, opts) {
    this.el = el; this.o = opts || {};
    this.lines = this.o.buffer || [];      /* lignes déjà affichées (partagées) */
    this.input = ''; this.pos = 0;
    this.hist = this.o.history || []; this.hpos = -1;
    this.busy = false; this.more = null; this.queue = [];
    this.waitReturn = !!this.o.waitReturn;
    var self = this;
    /* zone de saisie cachée : capte clavier, IME, collage et saisie automatisée */
    var ta = document.createElement('textarea');
    ta.setAttribute('autocomplete', 'off'); ta.setAttribute('autocorrect', 'off'); ta.setAttribute('autocapitalize', 'off'); ta.spellcheck = false;
    ta.style.cssText = 'position:absolute;left:-9999px;top:0;width:1px;height:1px;opacity:0;';
    el.parentNode.style.position = el.parentNode.style.position || 'relative';
    el.parentNode.appendChild(ta);
    this.ta = ta;
    ta.addEventListener('keydown', function (e) { self.key(e); });
    ta.addEventListener('input', function () {
      var v = ta.value; ta.value = '';
      if (!v) return;
      self.typeText(v);
    });
    ta.addEventListener('paste', function (e) { e.preventDefault(); self.paste((e.clipboardData || window.clipboardData).getData('text')); });
    ta.addEventListener('focus', function () { el.classList.remove('blur'); });
    ta.addEventListener('blur', function () { el.classList.add('blur'); });
    el.addEventListener('mouseup', function () { if (!window.getSelection().toString()) ta.focus(); });
    el.addEventListener('click', function () { if (!window.getSelection().toString()) ta.focus(); });
    this.render();
  }
  var T = Term.prototype;
  T.sess = function () { return this.o.session; };
  T.promptStr = function () {
    if (this.waitReturn || this.more) return '';
    var s = this.sess();
    return s.prompt();
  };
  T.print = function (arr) {
    var self = this;
    (Array.isArray(arr) ? arr : [arr]).forEach(function (l) { self.lines.push(l); });
    if (this.lines.length > 1500) this.lines.splice(0, this.lines.length - 1500);
  };
  T.render = function () {
    var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
    var html = esc(this.lines.join('\n'));
    if (this.lines.length) html += '\n';
    if (this.more) html += '<span> --More-- </span><span class="caret"> </span>';
    else if (!this.busy) {
      var p = this.promptStr();
      var secret = this.sess().pending && this.sess().pending.secret;
      var shown = secret ? '' : this.input;
      var pos = secret ? 0 : this.pos;
      html += esc(p) + esc(shown.slice(0, pos)) + '<span class="caret">' + (shown[pos] ? esc(shown[pos]) : ' ') + '</span>' + esc(shown.slice(pos + 1));
    }
    this.el.innerHTML = html;
    this.el.scrollTop = this.el.scrollHeight;
  };
  T.focus = function () { this.ta.focus(); };
  /* texte saisi (hors touches spéciales) */
  T.typeText = function (v) {
    for (var i = 0; i < v.length; i++) {
      var ch = v[i];
      var nl = ch === String.fromCharCode(10) || ch === String.fromCharCode(13);
      if (this.more) { this.moreKey(nl ? 'Enter' : ch); continue; }
      if (this.busy) continue;
      if (this.waitReturn) { if (nl) { this.waitReturn = false; this.print(''); if (this.o.onStart) this.o.onStart(); } continue; }
      if (nl) { this.enter(); continue; }
      if (ch === '?' && this.o.ios && !this.sess().pending) { this.help(); continue; }
      this.input = this.input.slice(0, this.pos) + ch + this.input.slice(this.pos);
      this.pos++;
    }
    this.render();
  };

  T.key = function (e) {
    var k = e.key;
    if (this.more) { if (k === 'Enter' || k === ' ' || k === 'Escape' || k === 'q') { e.preventDefault(); this.moreKey(k); } return; }
    if (this.busy) {
      if (e.ctrlKey && (k === 'c' || k === 'C') || (e.ctrlKey && e.shiftKey && k === '6')) { e.preventDefault(); this.abort(); }
      else if (k === 'Enter') { e.preventDefault(); }
      return;
    }
    if (this.waitReturn) {
      if (k === 'Enter') { e.preventDefault(); this.waitReturn = false; this.print(''); if (this.o.onStart) this.o.onStart(); this.render(); }
      return;
    }
    if (e.ctrlKey && !e.altKey) {
      var lk = k.toLowerCase();
      if (lk === 'c') {
        if (window.getSelection().toString()) return; /* copie */
        e.preventDefault(); this.ctrlC(); return;
      }
      if (lk === 'z') { e.preventDefault(); this.ctrlZ(); return; }
      if (lk === 'a') { e.preventDefault(); this.pos = 0; this.render(); return; }
      if (lk === 'e') { e.preventDefault(); this.pos = this.input.length; this.render(); return; }
      if (lk === 'u') { e.preventDefault(); this.input = ''; this.pos = 0; this.render(); return; }
      if (lk === 'v') return; /* collage natif -> event paste */
      return;
    }
    switch (k) {
      case 'Enter': e.preventDefault(); this.enter(); return;
      case 'Backspace': e.preventDefault(); if (this.pos > 0) { this.input = this.input.slice(0, this.pos - 1) + this.input.slice(this.pos); this.pos--; } this.render(); return;
      case 'Delete': e.preventDefault(); this.input = this.input.slice(0, this.pos) + this.input.slice(this.pos + 1); this.render(); return;
      case 'ArrowLeft': e.preventDefault(); if (this.pos > 0) this.pos--; this.render(); return;
      case 'ArrowRight': e.preventDefault(); if (this.pos < this.input.length) this.pos++; this.render(); return;
      case 'Home': e.preventDefault(); this.pos = 0; this.render(); return;
      case 'End': e.preventDefault(); this.pos = this.input.length; this.render(); return;
      case 'ArrowUp': e.preventDefault(); this.histMove(1); return;
      case 'ArrowDown': e.preventDefault(); this.histMove(-1); return;
      case 'Tab': e.preventDefault(); this.tab(); return;
      case 'Escape': e.preventDefault(); return;
    }
    if (k === '?' && this.o.ios && !(this.sess().pending)) { e.preventDefault(); this.help(); return; }
    /* autres caractères : gérés par l'événement input de la zone cachée */
  };
  T.histMove = function (d) {
    var s = this.sess();
    var h = s.history || this.hist;
    if (!h.length) return;
    if (this.hpos === -1) this.saved = this.input;
    this.hpos = Math.max(-1, Math.min(h.length - 1, this.hpos + d));
    this.input = this.hpos === -1 ? (this.saved || '') : h[h.length - 1 - this.hpos];
    this.pos = this.input.length;
    this.render();
  };
  T.tab = function () {
    var s = this.sess();
    if (!s.complete) return;
    var n = s.complete(this.input);
    if (n !== this.input) { this.input = n; this.pos = n.length; }
    this.render();
  };
  T.help = function () {
    var s = this.sess();
    this.print(this.promptStr() + this.input + '?');
    this.print(s.help(this.input));
    this.render();
  };
  T.ctrlC = function () {
    var s = this.sess();
    this.print(this.promptStr() + this.input + '^C');
    this.input = ''; this.pos = 0; this.hpos = -1;
    if (s.pending) s.pending = null;
    if (this.o.ios && s.isConfig && s.isConfig()) { s.mode = 'priv'; s.ctx = {}; this.print('%SYS-5-CONFIG_I: Configured from console by console'); }
    this.render();
  };
  T.ctrlZ = function () {
    var s = this.sess();
    if (!this.o.ios) return;
    this.print(this.promptStr() + this.input + '^Z');
    this.input = ''; this.pos = 0;
    if (s.isConfig && s.isConfig()) { s.mode = 'priv'; s.ctx = {}; this.print('%SYS-5-CONFIG_I: Configured from console by console'); }
    this.render();
  };
  T.paste = function (txt) {
    if (!txt) return;
    var parts = txt.replace(/\r/g, '').split('\n');
    if (parts.length === 1) { this.input = this.input.slice(0, this.pos) + parts[0] + this.input.slice(this.pos); this.pos += parts[0].length; this.render(); return; }
    var first = this.input.slice(0, this.pos) + parts[0];
    var rest = parts.slice(1);
    if (rest[rest.length - 1] === '') rest.pop();
    this.input = first; this.pos = first.length;
    this.queue = this.queue.concat(rest);
    this.enter();
  };
  T.enter = function () {
    var s = this.sess(), line = this.input;
    var secret = s.pending && s.pending.secret;
    this.print(this.promptStr() + (secret ? '' : line));
    this.input = ''; this.pos = 0; this.hpos = -1;
    var out;
    try { out = s.exec(line); } catch (err) { out = ['% erreur interne : ' + err.message]; console.error(err); }
    if (s.loggedOut) { s.loggedOut = false; this.print(out); this.waitReturn = true; this.render(); this.next(); return; }
    if (s.rebooted) {
      s.rebooted = false; this.busy = true; this.render();
      var self = this;
      var boot = this.o.bootText ? this.o.bootText() : ['System Bootstrap, Version 15.1(4)M4, RELEASE SOFTWARE (fc1)', 'Initializing memory for ECC', '..', 'Press RETURN to get started!'];
      var i = 0;
      (function step() {
        if (i < boot.length) { self.print(boot[i++]); self.render(); setTimeout(step, 60); return; }
        self.busy = false; self.waitReturn = true; self.render(); self.next();
      })();
      return;
    }
    if (this.o.onCommand) this.o.onCommand(line);
    this.output(out || [], s.async);
  };
  /* affiche une sortie, avec pagination --More-- (IOS) puis l'éventuel async */
  T.output = function (out, async) {
    var s = this.sess();
    s.async = null;
    var page = this.o.ios ? 23 : 1e9;
    if (out.length > page) {
      this.print(out.slice(0, page));
      this.more = { rest: out.slice(page), async: async, page: page };
      this.render();
      return;
    }
    this.print(out);
    if (async) { this.runAsync(async); return; }
    this.render();
    this.next();
  };
  T.moreKey = function (k) {
    var m = this.more;
    if (k === ' ') {
      var chunk = m.rest.slice(0, m.page); m.rest = m.rest.slice(m.page);
      this.print(chunk);
    } else if (k === 'Enter') {
      this.print(m.rest.slice(0, 1)); m.rest = m.rest.slice(1);
    } else m.rest = [];
    if (!m.rest.length) {
      this.more = null;
      if (m.async) { this.runAsync(m.async); return; }
      this.render(); this.next(); return;
    }
    this.render();
  };
  T.runAsync = function (a) {
    var self = this;
    this.busy = true; this.render();
    var i = 0;
    this.cancel = false;
    if (a.kind === 'ping') {
      /* IOS : !!!!! sur une ligne */
      this.print('');
      (function step() {
        if (self.cancel) return;
        if (i < a.results.length) {
          var r = a.results[i++];
          var ch = r.status === 'ok' ? '!' : r.status === 'unreach' ? 'U' : '.';
          self.lines[self.lines.length - 1] += ch;
          self.render();
          setTimeout(step, r.status === 'ok' ? 180 : 700);
          return;
        }
        var o = []; a.done(o); self.print(o);
        self.busy = false; self.render(); self.next();
      })();
      return;
    }
    (function step2() {
      if (self.cancel) return;
      if (i < a.results.length) {
        var r = a.results[i];
        self.print(a.line(r, i)); i++;
        self.render();
        setTimeout(step2, r.status === 'ok' || (r.ip != null) ? 420 : 900);
        return;
      }
      var o = []; a.done(o); self.print(o);
      self.busy = false; self.render(); self.next();
    })();
  };
  T.abort = function () {
    this.cancel = true;
    this.busy = false;
    this.print(['Control-C', '^C']);
    this.render();
  };
  T.next = function () {
    if (this.queue.length && !this.busy && !this.more && !this.waitReturn) {
      var l = this.queue.shift();
      this.input = l; this.pos = l.length;
      var self = this;
      setTimeout(function () { self.enter(); }, 25);
    }
  };
  /* message asynchrone (ex. %LINK-5-CHANGED) : s'insère avant l'invite */
  T.notify = function (text) {
    if (this.waitReturn) { this.print(text); this.render(); return; }
    this.print(text);
    this.render();
  };

  root.PTTerm = Term;
})(window);
