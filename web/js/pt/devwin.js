/* ============================================================
   Fenêtres d'équipement façon Packet Tracer :
   Physical / Config / CLI / Desktop / Services / Programming / Attributes
   ============================================================ */
(function (root) {
  'use strict';
  var N = root.NET, E = root.PTEngine;
  var A = 'assets/pt/';

  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ip(n) { return n == null ? '' : N.int2ip(n); }

  var PHYS = {
    '1941': 'iRealRouter1941Back.png', '2901': 'iRealRouter2901Back.png', '2911': 'iRealRouter2911Back.png', 'ISR4331': 'iRealRouter4331Back.png',
    'ISR4321': 'iRealRouter4321.png', 'PT8200': 'iRealRouter8200Back.png', '1841': 'iRealRouter1841.png', '2811': 'iRealRouter2811.png',
    'Router-PT': 'iPTRealRouter.png', 'Router-PT-Empty': 'iPTRealRouter.png', '2960-24TT': 'iRealSwitch2960_24TT.png', '2950-24': 'iRealSwitch2950.png',
    '2950T-24': 'iRealSwitch2950T.png', 'Switch-PT': 'iPTRealSwitch.png', 'Switch-PT-Empty': 'iPTRealSwitch.png', '3560-24PS': 'iRealSwitch3560.png',
    '3650-24PS': '3650Physical_Back.png', 'PC-PT': 'iRealWorkstation.png', 'Laptop-PT': 'iRealLaptop.png', 'Server-PT': 'iRealServer.png', 'Hub-PT': 'iPTRealHub.png'
  };
  var MODS = {
    router: ['HWIC-1GE-SFP', 'HWIC-2T', 'HWIC-4ESW', 'HWIC-8A', 'HWIC-AP-AG-B', 'HWIC-WLAN-AP-AGN', 'WIC-1AM', 'WIC-1ENET', 'WIC-1T', 'WIC-2AM', 'WIC-2T', 'WIC-Cover'],
    isr4: ['NIM-2T', 'NIM-Cover', 'NIM-ES2-4', 'GLC-GE-100FX', 'GLC-LH-SMD', 'GLC-T', 'GLC-TE'],
    switch: ['GLC-LH-SMD', 'GLC-T'],
    pc: ['PT-HOST-NM-1AM', 'PT-HOST-NM-1CE', 'PT-HOST-NM-1CFE', 'PT-HOST-NM-1CGE', 'PT-HOST-NM-1FFE', 'PT-HOST-NM-1FGE', 'PT-HOST-NM-1W', 'PT-HEADPHONE', 'PT-MICROPHONE', 'PT-CAMERA', 'PT-USB-HARD-DRIVE']
  };

  /* ---------------------------------------------------------- */
  /* Exécution de commandes IOS depuis l'interface graphique      */
  /* (comme Packet Tracer : elles s'affichent dans la CLI)        */
  /* ---------------------------------------------------------- */
  function gui(app, dev, ctx, cmds) {
    var cs = app.cliState(dev);
    var s = cs.session;
    var seq = [];
    if (cs.term && cs.term.waitReturn) { cs.term.waitReturn = false; }
    if (!cs.started) { cs.started = true; }
    if (s.pending) s.pending = null;
    if (s.mode === 'user') seq.push('enable');
    if (ctx && ctx.priv) { if (s.mode !== 'user' && s.mode !== 'priv') seq.push('end'); }
    else if (s.mode === 'user' || s.mode === 'priv') seq.push('configure terminal');
    if (ctx && ctx.iface) {
      var inIf = (s.mode === 'if' || s.mode === 'subif') && s.ctx.ifs && s.ctx.ifs.length === 1 && s.ctx.ifs[0] === ctx.iface;
      if (!inIf) seq.push('interface ' + ctx.iface);
    } else if (ctx && ctx.mode === 'rip') {
      if (s.mode !== 'rip') seq.push('router rip');
    } else if (!(ctx && ctx.priv) && s.mode !== 'config' && s.mode !== 'user' && s.mode !== 'priv') seq.push('exit');
    seq = seq.concat(cmds);
    var before = app.net.snapPorts();
    seq.forEach(function (c) {
      var p = s.prompt();
      cs.buffer.push(p + c);
      var out = s.exec(c);
      if (s.pending && /confirm|filename/.test(s.pending.prompt || '')) { cs.buffer.push(s.pending.prompt); var pp = s.pending; s.pending = null; var o2 = []; pp.handle.call(s, '', o2); out = out.concat(o2); }
      out.forEach(function (l) { cs.buffer.push(l); });
      s.async = null;
    });
    app.net.touch();
    app.net.diffPorts(before);
    app.changed();
    if (cs.term) cs.term.render();
  }

  /* ---------------------------------------------------------- */
  /* Fenêtre                                                      */
  /* ---------------------------------------------------------- */
  function DevWin(app, dev) {
    this.app = app; this.dev = dev;
    var self = this;
    var w = h('div', 'pt-win');
    var r = app.root.getBoundingClientRect();
    var W0 = Math.min(720, r.width - 40), H0 = Math.min(640, r.height - 120);
    var n = app.wins.length;
    w.style.left = Math.max(10, Math.round((r.width - W0) / 2 + n * 24 - 60)) + 'px';
    w.style.top = Math.max(60, 70 + n * 24) + 'px';
    w.style.width = W0 + 'px'; w.style.height = H0 + 'px';
    w.innerHTML = '<div class="wt"><img src="' + A + 'misc/app.png"><span class="t"></span><span class="cap"><span class="mn">—</span><span class="mx">☐</span><span class="x">✕</span></span></div>' +
      '<div class="wb"><div class="pt-tabs"></div><div class="pt-tabpanel"></div></div><div class="wf"><input type="checkbox" id="top' + Date.now() + '"><label>Top</label></div><div class="resize"></div>';
    this.w = w;
    this.title();
    app.root.appendChild(w);
    this.makeDrag();
    w.querySelector('.x').onclick = function () { self.close(); };
    w.querySelector('.mn').onclick = function () { w.style.display = 'none'; };
    w.querySelector('.mx').onclick = function () {
      if (self.max) { Object.assign(w.style, self.max); self.max = null; }
      else { self.max = { left: w.style.left, top: w.style.top, width: w.style.width, height: w.style.height }; w.style.left = '0px'; w.style.top = '0px'; w.style.width = r.width + 'px'; w.style.height = (r.height) + 'px'; }
    };
    w.addEventListener('mousedown', function () { app.focusWin(self); });
    var tabs = this.tabList();
    var tb = w.querySelector('.pt-tabs');
    tabs.forEach(function (t) {
      var s = h('span', null, t);
      s.onclick = function () { self.show(t); };
      tb.appendChild(s);
    });
    var last = app.lastTab[dev.name];
    this.show(last && tabs.indexOf(last) >= 0 ? last : 'Physical');
    app.focusWin(this);
  }
  var D = DevWin.prototype;
  D.title = function () { this.w.querySelector('.t').textContent = this.dev.name; };
  D.tabList = function () {
    var c = this.dev.cat;
    if (c === 'pc') return ['Physical', 'Config', 'Desktop', 'Programming', 'Attributes'];
    if (c === 'server') return ['Physical', 'Config', 'Services', 'Desktop', 'Programming', 'Attributes'];
    if (c === 'hub') return ['Physical', 'Config', 'Attributes'];
    return ['Physical', 'Config', 'CLI', 'Attributes'];
  };
  D.makeDrag = function () {
    var w = this.w, bar = w.querySelector('.wt'), rz = w.querySelector('.resize'), app = this.app;
    function drag(handle, fn) {
      handle.addEventListener('mousedown', function (e) {
        if (e.target.closest('.cap')) return;
        e.preventDefault();
        var sx = e.clientX, sy = e.clientY, r0 = { l: w.offsetLeft, t: w.offsetTop, w: w.offsetWidth, h: w.offsetHeight };
        function mv(ev) { fn(ev.clientX - sx, ev.clientY - sy, r0); }
        function up() { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); }
        document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
      });
    }
    drag(bar, function (dx, dy, r0) { w.style.left = Math.max(-r0.w + 80, r0.l + dx) + 'px'; w.style.top = Math.max(0, r0.t + dy) + 'px'; });
    drag(rz, function (dx, dy, r0) { w.style.width = Math.max(380, r0.w + dx) + 'px'; w.style.height = Math.max(260, r0.h + dy) + 'px'; });
  };
  D.close = function () {
    this.w.remove();
    this.app.wins = this.app.wins.filter(function (x) { return x !== this; }, this);
    this.app.changed();
  };
  D.show = function (t) {
    this.tab = t;
    this.app.lastTab[this.dev.name] = t;
    this.w.querySelectorAll('.pt-tabs span').forEach(function (s) { s.classList.toggle('on', s.textContent === t); });
    var p = this.w.querySelector('.pt-tabpanel');
    p.innerHTML = '';
    if (t === 'Physical') this.physical(p);
    else if (t === 'Config') this.config(p);
    else if (t === 'CLI') this.cli(p);
    else if (t === 'Desktop') this.desktop(p);
    else if (t === 'Services') this.services(p);
    else if (t === 'Programming') this.programming(p);
    else this.attributes(p);
  };
  D.refresh = function () { this.title(); if (this.tab !== 'CLI' && this.tab !== 'Desktop') this.show(this.tab); };

  /* ---------------- Physical ---------------- */
  D.physical = function (p) {
    var d = this.dev, app = this.app, self = this;
    var mods = d.cat === 'router' ? (/^ISR|PT8200/.test(d.model) ? MODS.isr4 : MODS.router) : d.cat === 'pc' || d.cat === 'server' ? MODS.pc : MODS.switch;
    var box = h('div', 'pt-phys');
    box.innerHTML = '<div class="mods"><div class="h">MODULES</div>' + mods.map(function (m) { return '<div>' + m + '</div>'; }).join('') + '</div>' +
      '<div class="pv"><div class="pvt">Physical Device View</div><div class="zb"><button class="pt-btn">Zoom In</button><button class="pt-btn">Original Size</button><button class="pt-btn">Zoom Out</button></div>' +
      '<div class="img"></div><div class="cust"><button class="pt-btn">Customize<br>Icon in<br>Physical View</button><button class="pt-btn">Customize<br>Icon in<br>Logical View</button></div>' +
      '<div class="desc">' + (d.cat === 'router' ? 'Cliquez sur l’interrupteur pour éteindre / allumer l’équipement (utile pour tester HSRP).' : d.cat === 'pc' || d.cat === 'server' ? 'Cliquez sur le bouton d’alimentation pour éteindre / allumer.' : 'Cliquez sur l’interrupteur pour éteindre / allumer le commutateur.') + '</div></div>';
    var imgBox = box.querySelector('.img');
    var file = PHYS[d.model] || (d.cat === 'router' ? 'iPTRealRouter.png' : d.cat === 'pc' ? 'iRealWorkstation.png' : d.cat === 'server' ? 'iRealServer.png' : 'iPTRealSwitch.png');
    var img = h('img', 'dimg'); img.src = A + 'phys/' + file;
    var zoom = null;
    img.onload = function () { if (zoom == null) zoom = Math.min(1, Math.max(0.2, (imgBox.clientWidth - 20) / img.naturalWidth)); img.style.width = Math.round(img.naturalWidth * zoom) + 'px'; };
    imgBox.appendChild(img);
    var pw = h('div', 'pt-power');
    function drawPw() {
      var isHost = d.cat === 'pc' || d.cat === 'server';
      var f = isHost ? (d.power ? 'PowerOnPC.png' : 'PowerOffPC.png') : (d.power ? 'PowerOn.png' : 'PowerOff.png');
      pw.innerHTML = '<img src="' + A + 'phys/' + f + '" title="Alimentation (' + (d.power ? 'allumé' : 'éteint') + ')" style="width:' + (isHost ? 30 : 26) + 'px">';
    }
    drawPw();
    pw.style.left = '14px'; pw.style.top = '14px';
    pw.onclick = function () { app.togglePower(d); drawPw(); };
    imgBox.appendChild(pw);
    var zb = box.querySelectorAll('.zb .pt-btn');
    zb[0].onclick = function () { zoom *= 1.25; img.onload(); };
    zb[1].onclick = function () { zoom = null; img.onload(); };
    zb[2].onclick = function () { zoom /= 1.25; img.onload(); };
    p.appendChild(box);
  };

  /* ---------------- Config ---------------- */
  D.config = function (p) {
    var d = this.dev, self = this;
    var host = d.cat === 'pc' || d.cat === 'server';
    var box = h('div', 'pt-cfg');
    var left = h('div', 'pt-cfgleft');
    var items = [['h', 'GLOBAL'], ['it', 'Settings'], ['it', 'Algorithm Settings']];
    if (d.cat === 'router') items.push(['h', 'ROUTING'], ['it', 'Static'], ['it', 'RIP'], ['h', 'SWITCHING'], ['it', 'VLAN Database']);
    if (d.cat === 'switch' || d.cat === 'l3switch') items.push(['h', 'SWITCHING'], ['it', 'VLAN Database']);
    items.push(['h', 'INTERFACE']);
    d.ifaces.forEach(function (i) { if (!i.parent) items.push(['it', i.name]); });
    if (host) items.push(['it', 'Bluetooth']);
    var col = h('div');
    col.style.cssText = 'flex:1;display:flex;flex-direction:column;min-width:0';
    var right = h('div', 'pt-cfgright');
    col.appendChild(right);
    if (!host && d.cat !== 'hub') {
      var eq = h('div', 'pt-eq', '<div class="l">Equivalent IOS Commands</div><pre></pre>');
      col.appendChild(eq);
      this.eqPre = eq.querySelector('pre');
    } else this.eqPre = null;
    items.forEach(function (it) {
      var e = h('div', it[0], it[1]);
      if (it[0] === 'it') e.onclick = function () { left.querySelectorAll('.on').forEach(function (x) { x.classList.remove('on'); }); e.classList.add('on'); self.cfgPanel(right, it[1]); };
      left.appendChild(e);
    });
    box.appendChild(left); box.appendChild(col);
    p.appendChild(box);
    var sel = this.cfgSel && items.some(function (i) { return i[1] === self.cfgSel; }) ? this.cfgSel : 'Settings';
    left.querySelectorAll('.it').forEach(function (x) { if (x.textContent === sel) x.classList.add('on'); });
    this.cfgPanel(right, sel);
  };
  D.eqRefresh = function () {
    if (!this.eqPre) return;
    var cs = this.app.cliState(this.dev);
    this.eqPre.textContent = cs.buffer.slice(-60).join('\n');
    this.eqPre.scrollTop = this.eqPre.scrollHeight;
  };
  D.cfgPanel = function (r, item) {
    this.cfgSel = item;
    var d = this.dev, app = this.app, net = app.net, self = this;
    r.innerHTML = '';
    this.eqRefresh();
    function title(t) { r.appendChild(h('div', 'ph', t)); }
    function run(ctx, cmds) { gui(app, d, ctx, cmds); self.eqRefresh(); }
    var host = d.cat === 'pc' || d.cat === 'server';
    if (item === 'Settings') {
      title('Global Settings');
      if (host) { this.hostSettings(r); return; }
      var f = h('div', 'pt-form');
      f.innerHTML = '<label>Display Name</label><input class="pt-in" data-k="dn" style="grid-column:span 3"><label>Hostname</label><input class="pt-in" data-k="hn" style="grid-column:span 3">' +
        '<label>NVRAM</label><button class="pt-btn" data-b="erase">Erase</button><button class="pt-btn" data-b="save">Save</button><span></span>' +
        '<label>Startup Config</label><button class="pt-btn" data-b="load">Load...</button><button class="pt-btn" data-b="exp1">Export...</button><span></span>' +
        '<label>Running Config</label><button class="pt-btn" data-b="exp2">Export...</button><button class="pt-btn" data-b="merge">Merge...</button><span></span>' +
        '<label>Device Clock</label><span style="grid-column:span 3;border:1px solid #ddd;padding:2px 4px">' + root.IOS.clockStr().replace(/\.\d+/, '') + '</span>';
      r.appendChild(f);
      var dn = f.querySelector('[data-k=dn]'), hn = f.querySelector('[data-k=hn]');
      dn.value = d.name; hn.value = d.hostname;
      dn.onchange = function () { if (app.rename(d, dn.value.trim())) self.title(); else dn.value = d.name; };
      hn.onchange = function () { var v = hn.value.trim(); if (v) run(null, ['hostname ' + v]); };
      f.querySelector('[data-b=erase]').onclick = function () { run({ priv: true }, ['erase startup-config']); d.startup = null; };
      f.querySelector('[data-b=save]').onclick = function () { run({ priv: true }, ['copy running-config startup-config']); };
      ['load', 'exp1', 'exp2', 'merge'].forEach(function (k) { f.querySelector('[data-b=' + k + ']').onclick = function () { app.msg('Les fichiers de configuration ne sont pas utilisés dans cet entraînement : utilise la CLI (show running-config, copy running-config startup-config…).'); }; });
      return;
    }
    if (item === 'Algorithm Settings') {
      title('Algorithm Settings');
      r.appendChild(h('div', null, '<div class="pt-row"><input type="checkbox" checked disabled> Global Settings</div><div class="pt-grp"><div class="gt">Half-Open Session Multiplier</div><input class="pt-in" value="1" style="width:80px" disabled></div><div class="pt-grp"><div class="gt">Maximum Number of Half-Open Sessions</div><input class="pt-in" value="100" style="width:80px" disabled></div><div class="pt-grp"><div class="gt">Interface Queue Size</div><input class="pt-in" value="10" style="width:80px" disabled></div>'));
      return;
    }
    if (item === 'Static') {
      title('Static Routes');
      var f2 = h('div', 'pt-form');
      f2.innerHTML = '<label>Network</label><input class="pt-in" style="grid-column:span 3"><label>Mask</label><input class="pt-in" style="grid-column:span 3"><label>Next Hop</label><input class="pt-in" style="grid-column:span 3"><span></span><span></span><button class="pt-btn" style="grid-column:span 2">Add</button>';
      r.appendChild(f2);
      var ins = f2.querySelectorAll('input');
      var lst = h('div', 'pt-list'); lst.style.marginTop = '10px';
      r.appendChild(h('div', null, '<div style="margin-top:12px">Network Address</div>'));
      r.appendChild(lst);
      var rm = h('button', 'pt-btn', 'Remove'); rm.style.cssText = 'margin-top:6px;align-self:flex-end';
      r.appendChild(rm);
      var selIdx = -1;
      function drawRoutes() {
        lst.innerHTML = '<table>' + d.cfg.routes.map(function (x, i) {
          return '<tr data-i="' + i + '"' + (i === selIdx ? ' class="sel"' : '') + '><td>' + ip(x.net) + '/' + x.len + ' via ' + (x.nh != null ? ip(x.nh) : x.iface) + '</td></tr>';
        }).join('') + '</table>';
        lst.querySelectorAll('tr').forEach(function (tr) { tr.onclick = function () { selIdx = +tr.dataset.i; drawRoutes(); }; });
      }
      drawRoutes();
      f2.querySelector('button').onclick = function () {
        var a = ins[0].value.trim(), m = ins[1].value.trim(), nh = ins[2].value.trim();
        if (!N.isIP(a) || !N.isMask(m) || !(N.isIP(nh) || E.canonIf(nh))) { app.msg('Invalid IP address or subnet mask.'); return; }
        run(null, ['ip route ' + a + ' ' + m + ' ' + nh]);
        drawRoutes();
      };
      rm.onclick = function () {
        var x = d.cfg.routes[selIdx]; if (!x) return;
        run(null, ['no ip route ' + ip(x.net) + ' ' + N.maskStr(x.len) + ' ' + (x.nh != null ? ip(x.nh) : x.iface)]);
        selIdx = -1; drawRoutes();
      };
      return;
    }
    if (item === 'RIP') {
      title('RIP Routing');
      var f3 = h('div', 'pt-form');
      f3.innerHTML = '<label>Network</label><input class="pt-in" style="grid-column:span 2"><button class="pt-btn">Add</button>';
      r.appendChild(f3);
      var lst2 = h('div', 'pt-list'); lst2.style.marginTop = '10px';
      r.appendChild(h('div', null, '<div style="margin-top:12px">Network Address</div>'));
      r.appendChild(lst2);
      var rm2 = h('button', 'pt-btn', 'Remove'); rm2.style.cssText = 'margin-top:6px;align-self:flex-end';
      r.appendChild(rm2);
      var sel2 = -1;
      function drawRip() {
        var nets = d.cfg.rip ? d.cfg.rip.networks : [];
        lst2.innerHTML = '<table>' + nets.map(function (x, i) { return '<tr data-i="' + i + '"' + (i === sel2 ? ' class="sel"' : '') + '><td>' + ip(x) + '</td></tr>'; }).join('') + '</table>';
        lst2.querySelectorAll('tr').forEach(function (tr) { tr.onclick = function () { sel2 = +tr.dataset.i; drawRip(); }; });
      }
      drawRip();
      f3.querySelector('button').onclick = function () {
        var a = f3.querySelector('input').value.trim();
        if (!N.isIP(a)) { app.msg('Invalid IP address.'); return; }
        run({ mode: 'rip' }, ['network ' + a]); drawRip();
      };
      rm2.onclick = function () {
        var nets = d.cfg.rip ? d.cfg.rip.networks : [];
        if (nets[sel2] == null) return;
        run({ mode: 'rip' }, ['no network ' + ip(nets[sel2])]); sel2 = -1; drawRip();
      };
      return;
    }
    if (item === 'VLAN Database') {
      title('VLAN Configuration');
      if (d.cat === 'router') { r.appendChild(h('div', null, '<i>Aucune base VLAN sur ce routeur.</i>')); return; }
      var f4 = h('div', 'pt-form');
      f4.innerHTML = '<label>VLAN Number</label><input class="pt-in" style="grid-column:span 3"><label>VLAN Name</label><input class="pt-in" style="grid-column:span 3"><span></span><span></span><button class="pt-btn">Add</button><button class="pt-btn">Remove</button>';
      r.appendChild(f4);
      var lst3 = h('div', 'pt-list'); lst3.style.marginTop = '10px'; lst3.style.flex = '1';
      r.appendChild(lst3);
      var sel3 = null;
      function drawV() {
        var all = d.cfg.vlans.slice();
        [[1002, 'fddi-default'], [1003, 'token-ring-default'], [1004, 'fddinet-default'], [1005, 'trnet-default']].forEach(function (x) { if (!all.some(function (v) { return v.id === x[0]; })) all.push({ id: x[0], name: x[1] }); });
        lst3.innerHTML = '<table><tr><th>VLAN No</th><th>VLAN Name</th></tr>' + all.map(function (v) { return '<tr data-v="' + v.id + '"' + (v.id === sel3 ? ' class="sel"' : '') + '><td>' + v.id + '</td><td>' + esc(v.name) + '</td></tr>'; }).join('') + '</table>';
        lst3.querySelectorAll('tr[data-v]').forEach(function (tr) { tr.onclick = function () { sel3 = +tr.dataset.v; drawV(); }; });
      }
      drawV();
      var b4 = f4.querySelectorAll('button'), i4 = f4.querySelectorAll('input');
      b4[0].onclick = function () {
        var n = +i4[0].value, nm = i4[1].value.trim();
        if (!(n >= 1 && n <= 4094)) { app.msg('Invalid VLAN number.'); return; }
        var cmds = ['vlan ' + n]; if (nm) cmds.push('name ' + nm.replace(/\s+/g, '_')); cmds.push('exit');
        run(null, cmds); drawV();
      };
      b4[1].onclick = function () { if (sel3 && sel3 !== 1 && sel3 < 1002) { run(null, ['no vlan ' + sel3]); sel3 = null; drawV(); } };
      return;
    }
    if (item === 'Bluetooth') { title('Bluetooth'); r.appendChild(h('div', null, '<div class="pt-row"><label>Port Status</label><input type="checkbox"> On</div>')); return; }
    /* ------- interface ------- */
    var ifc = net.iface(d, item);
    if (!ifc) return;
    title(item);
    if (host) { this.hostIface(r, ifc); return; }
    var st = h('div');
    var sp = E.speedOf(ifc.name);
    st.innerHTML = '<div class="pt-row"><label>Port Status</label><span class="grow"></span><input type="checkbox" data-k="on"> On</div>' +
      (/^Vlan/.test(ifc.name) ? '' : '<div class="pt-row"><label>Bandwidth</label><span class="grow"></span>' + (sp >= 1000 ? '<input type="radio" disabled> 1000 Mbps ' : '') + '<input type="radio" disabled> 100 Mbps <input type="radio" disabled> 10 Mbps <input type="checkbox" checked disabled> Auto</div>' +
        '<div class="pt-row"><label>Duplex</label><span class="grow"></span><input type="radio" disabled> Half Duplex <input type="radio" disabled> Full Duplex <input type="checkbox" checked disabled> Auto</div>') +
      '<div class="pt-row"><label>MAC Address</label><input class="pt-in" value="' + N.macPT(ifc.mac) + '" disabled style="width:260px;margin-left:auto"></div>';
    r.appendChild(st);
    var on = st.querySelector('[data-k=on]');
    on.checked = !ifc.shutdown;
    on.onchange = function () { run({ iface: ifc.name }, [on.checked ? 'no shutdown' : 'shutdown']); };
    if (ifc.sw && !ifc.sw.routed) {
      /* port de commutateur */
      var g = h('div', 'pt-grp');
      var mode = ifc.sw.mode === 'trunk' ? 'Trunk' : 'Access';
      g.innerHTML = '<div class="pt-row"><select class="pt-in" style="width:110px"><option>Access</option><option>Trunk</option></select><span class="grow"></span><span>VLAN</span><select class="pt-in" style="width:210px"></select></div><div class="vl"></div>';
      r.appendChild(g);
      var ms = g.querySelectorAll('select')[0], vs = g.querySelectorAll('select')[1], vl = g.querySelector('.vl');
      ms.value = mode;
      function drawVl() {
        vl.innerHTML = '';
        if (ms.value === 'Access') {
          vs.style.display = '';
          vs.innerHTML = d.cfg.vlans.filter(function (v) { return v.id < 1002; }).map(function (v) { return '<option value="' + v.id + '">' + v.id + ':' + esc(v.name) + '</option>'; }).join('');
          vs.value = ifc.sw.access;
        } else {
          vs.style.display = 'none';
          var list = h('div', 'pt-list');
          list.innerHTML = '<table>' + d.cfg.vlans.filter(function (v) { return v.id < 1002; }).map(function (v) { return '<tr><td><input type="checkbox" data-v="' + v.id + '"' + (net.trunkAllows(ifc, v.id) ? ' checked' : '') + '> ' + v.id + ':' + esc(v.name) + '</td></tr>'; }).join('') + '</table>';
          vl.appendChild(list);
          list.querySelectorAll('input').forEach(function (cb) {
            cb.onchange = function () {
              var al = []; list.querySelectorAll('input').forEach(function (c) { if (c.checked) al.push(c.dataset.v); });
              run({ iface: ifc.name }, ['switchport trunk allowed vlan ' + (al.length ? al.join(',') : 'none')]);
            };
          });
        }
      }
      drawVl();
      ms.onchange = function () { run({ iface: ifc.name }, ['switchport mode ' + ms.value.toLowerCase()]); drawVl(); };
      vs.onchange = function () { run({ iface: ifc.name }, ['switchport access vlan ' + vs.value]); };
    } else {
      var g2 = h('div', 'pt-grp');
      g2.innerHTML = '<div class="gt">IP Configuration</div><div class="pt-row"><label>IPv4 Address</label><input class="pt-in" data-k="ip"></div><div class="pt-row"><label>Subnet Mask</label><input class="pt-in" data-k="mk"></div>';
      r.appendChild(g2);
      var ipIn = g2.querySelector('[data-k=ip]'), mkIn = g2.querySelector('[data-k=mk]');
      ipIn.value = ifc.ip != null ? ip(ifc.ip) : ''; mkIn.value = ifc.len != null ? N.maskStr(ifc.len) : '';
      function apply() {
        var a = ipIn.value.trim(), m = mkIn.value.trim();
        ipIn.classList.toggle('bad', !!a && !N.isIP(a)); mkIn.classList.toggle('bad', !!m && !N.isMask(m));
        if (!a && !m) { if (ifc.ip != null) run({ iface: ifc.name }, ['no ip address']); return; }
        if (N.isIP(a) && N.isMask(m) && (ifc.ip !== N.ip2int(a) || ifc.len !== N.maskLen(m))) run({ iface: ifc.name }, ['ip address ' + a + ' ' + m]);
      }
      mkIn.onfocus = function () { if (!mkIn.value && N.isIP(ipIn.value.trim())) mkIn.value = N.maskStr(N.classfulLen(ipIn.value.trim())); };
      ipIn.onchange = apply; mkIn.onchange = apply;
      [ipIn, mkIn].forEach(function (x) { x.onkeydown = function (e) { if (e.key === 'Enter') apply(); }; });
    }
    r.appendChild(h('div', null, '<div class="pt-row" style="margin-top:10px"><label>Tx Ring Limit</label><input class="pt-in" value="10" style="width:260px;margin-left:auto" disabled></div>'));
  };

  /* Config d'un hôte : réglages globaux */
  D.hostSettings = function (r) {
    var d = this.dev, app = this.app, net = app.net, self = this, hs = d.host;
    var box = h('div');
    box.innerHTML = '<div class="pt-row"><label>Display Name</label><input class="pt-in" data-k="dn"></div>' +
      '<div class="pt-row"><label>Interfaces</label><select class="pt-in"><option>FastEthernet0</option></select></div>' +
      '<div class="pt-grp"><div class="gt">Gateway/DNS IPv4</div><div class="pt-row"><input type="radio" name="g4' + d.name + '" data-k="dh"> DHCP</div><div class="pt-row"><input type="radio" name="g4' + d.name + '" data-k="st"> Static</div>' +
      '<div class="pt-row"><label>Default Gateway</label><input class="pt-in" data-k="gw"></div><div class="pt-row"><label>DNS Server</label><input class="pt-in" data-k="dns"></div></div>' +
      '<div class="pt-grp"><div class="gt">Gateway/DNS IPv6</div><div class="pt-row"><input type="radio" name="g6' + d.name + '" data-k="a6"> Automatic</div><div class="pt-row"><input type="radio" name="g6' + d.name + '" data-k="s6"> Static</div>' +
      '<div class="pt-row"><label>Default Gateway</label><input class="pt-in" data-k="gw6"></div><div class="pt-row"><label>DNS Server</label><input class="pt-in" data-k="dns6"></div></div>' +
      '<div class="pt-row"><label>Device Clock</label><input class="pt-in" disabled value="' + root.IOS.clockStr().replace(/\.\d+/, '') + '"></div>';
    r.appendChild(box);
    var q = function (k) { return box.querySelector('[data-k=' + k + ']'); };
    q('dn').value = d.name;
    q('dn').onchange = function () { if (!app.rename(d, q('dn').value.trim())) q('dn').value = d.name; else self.title(); };
    function fill() {
      q('dh').checked = hs.dhcp; q('st').checked = !hs.dhcp;
      q('gw').value = hs.gw != null ? ip(hs.gw) : ''; q('dns').value = hs.dns != null ? ip(hs.dns) : '';
      q('gw').disabled = q('dns').disabled = hs.dhcp;
      var v6 = net.hostV6(d);
      q('a6').checked = hs.v6auto; q('s6').checked = !hs.v6auto;
      q('gw6').value = v6.gw ? N.fmt6(v6.gw, true) : ''; q('dns6').value = v6.dns ? N.fmt6(v6.dns, true) : '';
      q('gw6').disabled = q('dns6').disabled = hs.v6auto;
    }
    fill();
    q('dh').onchange = function () { hs.dhcp = true; net.touch(); net.dhcpRequest(d); app.changed(); fill(); };
    q('st').onchange = function () { hs.dhcp = false; net.touch(); app.changed(); fill(); };
    q('gw').onchange = function () { var v = q('gw').value.trim(); if (!v) hs.gw = null; else if (N.isIP(v)) hs.gw = N.ip2int(v); else { q('gw').classList.add('bad'); return; } q('gw').classList.remove('bad'); net.touch(); app.changed(); };
    q('dns').onchange = function () { var v = q('dns').value.trim(); if (!v) hs.dns = null; else if (N.isIP(v)) hs.dns = N.ip2int(v); else { q('dns').classList.add('bad'); return; } q('dns').classList.remove('bad'); net.touch(); app.changed(); };
    q('a6').onchange = function () { hs.v6auto = true; net.touch(); app.changed(); fill(); };
    q('s6').onchange = function () { hs.v6auto = false; net.touch(); app.changed(); fill(); };
    q('gw6').onchange = function () { var v = q('gw6').value.trim(); hs.v6gw = v && N.isIP6(v) ? N.parse6(v) : null; net.touch(); app.changed(); };
    q('dns6').onchange = function () { var v = q('dns6').value.trim(); hs.v6dns = v && N.isIP6(v) ? N.parse6(v) : null; net.touch(); app.changed(); };
  };
  /* Config d'un hôte : interface */
  D.hostIface = function (r, ifc) {
    var d = this.dev, app = this.app, net = app.net, hs = d.host;
    var box = h('div');
    box.innerHTML = '<div class="pt-row"><label>Port Status</label><span class="grow"></span><input type="checkbox" data-k="on"> On</div>' +
      '<div class="pt-row"><label>Bandwidth</label><span class="grow"></span><input type="radio" disabled> 1000 Mbps <input type="radio" disabled> 100 Mbps <input type="radio" disabled> 10 Mbps <input type="checkbox" checked disabled> Auto</div>' +
      '<div class="pt-row"><label>Duplex</label><span class="grow"></span><input type="radio" disabled> Half Duplex <input type="radio" disabled> Full Duplex <input type="checkbox" checked disabled> Auto</div>' +
      '<div class="pt-row"><label>MAC Address</label><input class="pt-in" disabled value="' + N.macPT(ifc.mac) + '"></div>' +
      '<div class="pt-grp"><div class="gt">IP Configuration</div><div class="pt-row"><input type="radio" name="ic' + d.name + '" data-k="dh"> DHCP <span style="width:20px"></span><input type="radio" name="ic' + d.name + '" data-k="st"> Static</div>' +
      '<div class="pt-row"><label>IPv4 Address</label><input class="pt-in" data-k="ip"></div><div class="pt-row"><label>Subnet Mask</label><input class="pt-in" data-k="mk"></div></div>' +
      '<div class="pt-grp"><div class="gt">IPv6 Configuration</div><div class="pt-row"><input type="radio" name="i6' + d.name + '" data-k="a6"> Automatic <span style="width:20px"></span><input type="radio" name="i6' + d.name + '" data-k="s6"> Static</div>' +
      '<div class="pt-row"><label>IPv6 Address</label><input class="pt-in" data-k="ip6"><span>/</span><input class="pt-in" data-k="len6" style="width:50px"></div>' +
      '<div class="pt-row"><label>Link Local Address</label><input class="pt-in" data-k="ll" disabled></div></div>';
    r.appendChild(box);
    var q = function (k) { return box.querySelector('[data-k=' + k + ']'); };
    function fill() {
      q('on').checked = !ifc.shutdown;
      q('dh').checked = hs.dhcp; q('st').checked = !hs.dhcp;
      q('ip').value = hs.ip != null ? ip(hs.ip) : ''; q('mk').value = hs.len != null ? N.maskStr(hs.len) : '';
      q('ip').disabled = q('mk').disabled = hs.dhcp;
      var v6 = net.hostV6(d);
      q('a6').checked = hs.v6auto; q('s6').checked = !hs.v6auto;
      q('ip6').value = v6.addrs[0] ? N.fmt6(v6.addrs[0].w, true) : ''; q('len6').value = v6.addrs[0] ? v6.addrs[0].len : '';
      q('ip6').disabled = q('len6').disabled = hs.v6auto;
      q('ll').value = N.fmt6(net.ll6(d, ifc), true);
    }
    fill();
    q('on').onchange = function () { ifc.shutdown = !q('on').checked; net.touch(); app.changed(); };
    q('dh').onchange = function () { hs.dhcp = true; net.dhcpRequest(d); app.changed(); fill(); };
    q('st').onchange = function () { hs.dhcp = false; net.touch(); app.changed(); fill(); };
    function applyIp() {
      var a = q('ip').value.trim(), m = q('mk').value.trim();
      q('ip').classList.toggle('bad', !!a && !N.isIP(a)); q('mk').classList.toggle('bad', !!m && !N.isMask(m));
      hs.ip = N.isIP(a) ? N.ip2int(a) : null; hs.len = N.isMask(m) ? N.maskLen(m) : (hs.ip != null ? hs.len : null);
      net.touch(); app.changed();
    }
    q('mk').onfocus = function () { if (!q('mk').value && N.isIP(q('ip').value.trim())) { q('mk').value = N.maskStr(N.classfulLen(q('ip').value.trim())); applyIp(); } };
    q('ip').onchange = applyIp; q('mk').onchange = applyIp;
    q('a6').onchange = function () { hs.v6auto = true; net.touch(); app.changed(); fill(); };
    q('s6').onchange = function () { hs.v6auto = false; net.touch(); app.changed(); fill(); };
    function apply6() {
      var a = q('ip6').value.trim(), l = +q('len6').value || 64;
      hs.v6 = a && N.isIP6(a) ? [{ w: N.parse6(a), len: l }] : [];
      net.touch(); app.changed();
    }
    q('ip6').onchange = apply6; q('len6').onchange = apply6;
  };

  /* ---------------- CLI ---------------- */
  D.cli = function (p) {
    var d = this.dev, app = this.app;
    var box = h('div', 'pt-cli');
    box.innerHTML = '<div class="ph">IOS Command Line Interface</div><div class="pt-term"></div><div class="cb"><button class="pt-btn">Copy</button><button class="pt-btn">Paste</button></div>';
    p.appendChild(box);
    var cs = app.cliState(d);
    var te = box.querySelector('.pt-term');
    if (!cs.booted) {
      cs.booted = true;
      bootText(d).forEach(function (l) { cs.buffer.push(l); });
    }
    var term = new root.PTTerm(te, {
      ios: true, session: cs.session, buffer: cs.buffer, waitReturn: !cs.started,
      onStart: function () { cs.started = true; },
      onCommand: function () { app.changed(); },
      bootText: function () { return bootText(d); }
    });
    cs.term = term;
    term.render();
    setTimeout(function () { term.focus(); }, 30);
    var bs = box.querySelectorAll('.cb .pt-btn');
    bs[0].onclick = function () { var t = window.getSelection().toString() || cs.buffer.join('\n'); try { navigator.clipboard.writeText(t); } catch (e) {} };
    bs[1].onclick = function () { try { navigator.clipboard.readText().then(function (t) { term.paste(t); term.focus(); }); } catch (e) {} };
  };
  function bootText(d) {
    var mi = E.modelInfo(d.model);
    if (d.cat === 'router') {
      return ['System Bootstrap, Version 15.1(4)M4, RELEASE SOFTWARE (fc1)', 'Technical Support: http://www.cisco.com/techsupport', 'Copyright (c) 2010 by cisco Systems, Inc.',
        'Total memory size = 512 MB - On-board = 512 MB, DIMM0 = 0 MB', 'CISCO' + d.model + '/K9 platform with 524288 Kbytes of main memory', 'Main memory is configured to 64/-1(On-board/DIMM0) bit mode with ECC disabled', '',
        'Readonly ROMMON initialized', 'program load complete, entry point: 0x80803000, size: 0x1b340', '', 'Initializing memory for ECC', '..', '',
        'IOS Image Load Test ', '___________________', 'Digitally Signed Release Software', '', '',
        '              Restricted Rights Legend', '', 'Use, duplication, or disclosure by the Government is', 'subject to restrictions as set forth in subparagraph',
        '(c) of the Commercial Computer Software - Restricted', 'Rights clause at FAR sec. 52.227-19 and subparagraph', '(c) (1) (ii) of the Rights in Technical Data and Computer',
        'Software clause at DFARS sec. 252.227-7013.', '', '           cisco Systems, Inc.', '           170 West Tasman Drive', '           San Jose, California 95134-1706', '', '',
        'Cisco IOS Software, ' + d.model + ' Software, Version ' + root.IOS.iosVersion(d) + ', RELEASE SOFTWARE (fc2)', 'Technical Support: http://www.cisco.com/techsupport',
        'Copyright (c) 1986-2016 by Cisco Systems, Inc.', 'Compiled Wed 23-Mar-16 14:39 by prod_rel_team', '', '',
        'This product contains cryptographic features and is subject to United', 'States and local country laws governing import, export, transfer and',
        'use. Delivery of Cisco cryptographic products does not imply', 'third-party authority to import, export, distribute or use encryption.', '',
        'cisco ' + d.model + ' (revision 1.0) with 491520K/32768K bytes of memory.', 'Processor board ID FTX152400KS',
        d.ifaces.filter(function (i) { return /Gigabit/.test(i.name) && !i.parent; }).length + ' Gigabit Ethernet interfaces', 'DRAM configuration is 64 bits wide with parity disabled.',
        '255K bytes of non-volatile configuration memory.', '249856K bytes of ATA System CompactFlash 0 (Read/Write)', '', '', 'Press RETURN to get started!', '', ''];
    }
    return ['C2960 Boot Loader (C2960-HBOOT-M) Version 12.2(25r)FX, RELEASE SOFTWARE (fc4)', 'Cisco WS-C2960-24TT (RC32300) processor (revision C0) with 21039K bytes of memory.',
      d.model + ' starting...', 'Base ethernet MAC Address: ' + N.macPT(d.ifaces[0] ? d.ifaces[0].mac : '0000.0000.0000'), 'Xmodem file system is available.',
      'Initializing Flash...', 'flashfs[0]: 1 files, 0 directories', 'flashfs[0]: 0 orphaned files, 0 orphaned directories', 'flashfs[0]: Total bytes: 64016384',
      'flashfs[0]: Bytes used: 4414921', 'flashfs[0]: Bytes available: 59601463', 'flashfs[0]: flashfs fsck took 1 seconds.', '...done Initializing Flash.', '',
      'Loading "flash:/c2960-lanbasek9-mz.150-2.SE4.bin"...', '########################################################################## [OK]', '',
      '              Restricted Rights Legend', '', 'Use, duplication, or disclosure by the Government is', 'subject to restrictions as set forth in subparagraph',
      '(c) of the Commercial Computer Software - Restricted', 'Rights clause at FAR sec. 52.227-19 and subparagraph', '(c) (1) (ii) of the Rights in Technical Data and Computer',
      'Software clause at DFARS sec. 252.227-7013.', '', 'cisco Systems, Inc.', '170 West Tasman Drive', 'San Jose, California 95134-1706', '', '',
      'Cisco IOS Software, ' + (d.cat === 'l3switch' ? '[Denali], Catalyst L3 Switch Software (CAT3K_CAA-UNIVERSALK9-M)' : 'C2960 Software (C2960-LANBASEK9-M)') + ', Version ' + root.IOS.iosVersion(d) + ', RELEASE SOFTWARE (fc1)', 'Technical Support: http://www.cisco.com/techsupport',
      'Copyright (c) 1986-2013 by Cisco Systems, Inc.', 'Compiled Wed 26-Jun-13 02:49 by prod_rel_team', '', '', 'Press RETURN to get started!', '', ''];
  }

  /* ---------------- Desktop ---------------- */
  var APPS = [['IP Configuration', 'ipconfig.png', 'ipc'], ['Dial-up', 'dialup.png'], ['Terminal', 'terminal.png'], ['Command Prompt', 'cmdprompt.png', 'cmd'],
    ['Web Browser', 'browser.png', 'web'], ['PC Wireless', 'Wireless-PC.png'], ['VPN', 'VPNdialup.png'], ['Traffic Generator', 'trafficGenerator.png'],
    ['MIB Browser', 'mibbrowser.png'], ['Cisco IP Communicator', 'IPCommunicator.png'], ['Email', 'EmailClient.png', 'mail'], ['PPPoE Dialer', 'PPPoE.png'],
    ['Text Editor', 'TextEditor.png'], ['Firewall', 'IPv4Firewall.png'], ['IPv6 Firewall', 'IPv6Firewall.png'], ['Netflow Collector', 'NetflowCollector.png'],
    ['IoT Monitor', 'IoEApp.png'], ['Bluetooth', 'Bluetooth.png']];
  D.desktop = function (p) {
    var self = this;
    var box = h('div', 'pt-desk');
    var grid = h('div', 'grid');
    APPS.forEach(function (a) {
      var e = h('div', 'pt-app', '<img src="' + A + 'desk/' + a[1] + '"><div>' + a[0] + '</div>');
      e.ondblclick = e.onclick = function () { self.openApp(box, a); };
      grid.appendChild(e);
    });
    box.appendChild(grid);
    p.appendChild(box);
    var cur = this.app.deskApp[this.dev.name];
    if (cur) { var a = APPS.filter(function (x) { return x[0] === cur; })[0]; if (a) this.openApp(box, a); }
  };
  D.openApp = function (box, a) {
    var self = this, app = this.app, d = this.dev;
    app.deskApp[d.name] = a[0];
    var w = h('div', 'pt-appwin', '<div class="at"><b>' + a[0] + '</b><span>X</span></div><div class="ab"></div>');
    box.appendChild(w);
    w.querySelector('.at span').onclick = function () { w.remove(); app.deskApp[d.name] = null; };
    var body = w.querySelector('.ab');
    if (a[2] === 'ipc') this.ipConfig(body);
    else if (a[2] === 'cmd') this.cmd(body);
    else if (a[2] === 'web') this.browser(body);
    else if (a[2] === 'mail') this.email(body);
    else body.appendChild(h('div', null, '<p style="padding:20px;color:#555;font-size:13px">Application « ' + a[0] + ' » : non utilisée dans ce cours.<br><br>Les applications utiles ici sont <b>IP Configuration</b>, <b>Command Prompt</b>, <b>Web Browser</b> et <b>Email</b>.</p>'));
  };
  D.ipConfig = function (b) {
    var d = this.dev, app = this.app, net = app.net, hs = d.host, nic = d.ifaces[0];
    var n = d.name.replace(/\W/g, '');
    var box = h('div', 'pt-ipc');
    box.innerHTML = '<div class="pt-row"><label>Interface</label><select class="pt-in" style="width:200px"><option>FastEthernet0</option></select></div>' +
      '<div class="sect">IP Configuration</div>' +
      '<div class="pt-row"><input type="radio" name="d' + n + '" data-k="dh"> DHCP <span style="width:24px"></span><input type="radio" name="d' + n + '" data-k="st"> Static <span class="msg" data-k="msg"></span></div>' +
      '<div class="pt-row"><label>IPv4 Address</label><input class="pt-in" data-k="ip"></div><div class="pt-row"><label>Subnet Mask</label><input class="pt-in" data-k="mk"></div>' +
      '<div class="pt-row"><label>Default Gateway</label><input class="pt-in" data-k="gw"></div><div class="pt-row"><label>DNS Server</label><input class="pt-in" data-k="dns"></div>' +
      '<div class="sect">IPv6 Configuration</div>' +
      '<div class="pt-row"><input type="radio" name="s' + n + '" data-k="a6"> Automatic <span style="width:24px"></span><input type="radio" name="s' + n + '" data-k="s6"> Static <span class="msg" data-k="msg6"></span></div>' +
      '<div class="pt-row"><label>IPv6 Address</label><input class="pt-in" data-k="ip6"><span>/</span><input class="pt-in" data-k="len6" style="width:46px"></div>' +
      '<div class="pt-row"><label>Link Local Address</label><input class="pt-in" data-k="ll" disabled></div>' +
      '<div class="pt-row"><label>Default Gateway</label><input class="pt-in" data-k="gw6"></div><div class="pt-row"><label>DNS Server</label><input class="pt-in" data-k="dns6"></div>' +
      '<div class="sect">802.1X</div><div class="pt-row"><input type="checkbox" disabled> Use 802.1X Security</div>' +
      '<div class="pt-row"><label>Authentication</label><select class="pt-in" disabled style="width:120px"><option>MD5</option></select></div><div class="pt-row"><label>Username</label><input class="pt-in" disabled></div><div class="pt-row"><label>Password</label><input class="pt-in" disabled></div>';
    b.appendChild(box);
    var q = function (k) { return box.querySelector('[data-k=' + k + ']'); };
    function fill() {
      q('dh').checked = hs.dhcp; q('st').checked = !hs.dhcp;
      q('ip').value = hs.ip != null ? ip(hs.ip) : ''; q('mk').value = hs.len != null ? N.maskStr(hs.len) : '';
      q('gw').value = hs.gw != null ? ip(hs.gw) : ''; q('dns').value = hs.dns != null ? ip(hs.dns) : '';
      ['ip', 'mk', 'gw', 'dns'].forEach(function (k) { q(k).disabled = hs.dhcp; q(k).classList.remove('bad'); });
      q('msg').textContent = hs.dhcp ? (hs.dhcpMsg || '') : '';
      var v6 = net.hostV6(d);
      q('a6').checked = hs.v6auto; q('s6').checked = !hs.v6auto;
      q('ip6').value = v6.addrs[0] ? N.fmt6(v6.addrs[0].w, true) : ''; q('len6').value = v6.addrs[0] ? v6.addrs[0].len : '';
      q('ll').value = N.fmt6(net.ll6(d, nic), true);
      q('gw6').value = v6.gw ? N.fmt6(v6.gw, true) : ''; q('dns6').value = v6.dns ? N.fmt6(v6.dns, true) : '';
      ['ip6', 'len6', 'gw6', 'dns6'].forEach(function (k) { q(k).disabled = hs.v6auto; });
      q('msg6').textContent = hs.v6auto ? (v6.addrs.length ? 'IPv6 request successful.' : 'IPv6 request failed.') : '';
    }
    fill();
    q('dh').onchange = function () {
      hs.dhcp = true;
      ['ip', 'mk', 'gw', 'dns'].forEach(function (k) { q(k).disabled = true; });
      q('msg').textContent = 'Requesting IP Address...';
      setTimeout(function () { net.dhcpRequest(d); app.changed(); fill(); }, 900);
    };
    q('st').onchange = function () { hs.dhcp = false; hs.dhcpMsg = ''; if (hs.ip != null && hs.len === 16 && (hs.ip >>> 16) === 0xA9FE) { hs.ip = null; hs.len = null; } net.touch(); app.changed(); fill(); };
    function setField(k, target) {
      var e = q(k), v = e.value.trim();
      if (!v) { hs[target] = null; e.classList.remove('bad'); net.touch(); app.changed(); return; }
      if (k === 'mk') {
        if (!N.isMask(v)) { e.classList.add('bad'); app.msg('Invalid Subnet Mask.'); return; }
        hs.len = N.maskLen(v);
      } else {
        if (!N.isIP(v)) { e.classList.add('bad'); app.msg('Invalid IP address detected.'); return; }
        hs[target] = N.ip2int(v);
      }
      e.classList.remove('bad'); net.touch(); app.changed();
    }
    q('ip').onchange = function () { setField('ip', 'ip'); };
    q('mk').onchange = function () { setField('mk', 'len'); };
    q('gw').onchange = function () { setField('gw', 'gw'); };
    q('dns').onchange = function () { setField('dns', 'dns'); };
    q('mk').onfocus = function () { if (!q('mk').value && N.isIP(q('ip').value.trim())) { q('mk').value = N.maskStr(N.classfulLen(q('ip').value.trim())); setField('mk', 'len'); } };
    q('a6').onchange = function () { hs.v6auto = true; net.touch(); app.changed(); fill(); };
    q('s6').onchange = function () { hs.v6auto = false; net.touch(); app.changed(); fill(); };
    function set6() {
      var a = q('ip6').value.trim(), l = +q('len6').value || 64;
      hs.v6 = a && N.isIP6(a) ? [{ w: N.parse6(a), len: l }] : [];
      var g = q('gw6').value.trim(); hs.v6gw = g && N.isIP6(g) ? N.parse6(g) : null;
      var dn = q('dns6').value.trim(); hs.v6dns = dn && N.isIP6(dn) ? N.parse6(dn) : null;
      net.touch(); app.changed();
    }
    ['ip6', 'len6', 'gw6', 'dns6'].forEach(function (k) { q(k).onchange = set6; });
    box.querySelectorAll('input.pt-in').forEach(function (i) { i.addEventListener('keydown', function (e) { if (e.key === 'Enter') i.dispatchEvent(new Event('change')); }); });
  };
  D.cmd = function (b) {
    var d = this.dev, app = this.app;
    var cs = app.pcState(d);
    var te = h('div', 'pt-term dark');
    b.appendChild(te);
    if (!cs.buffer.length) { cs.buffer.push(''); cs.buffer.push('Cisco Packet Tracer PC Command Line 1.0'); }
    var term = new root.PTTerm(te, { ios: false, session: cs.shell, buffer: cs.buffer, onCommand: function () { app.changed(); } });
    cs.term = term;
    term.render();
    setTimeout(function () { term.focus(); }, 30);
  };
  D.browser = function (b) {
    var d = this.dev, app = this.app, net = app.net;
    var box = h('div', 'pt-browser');
    box.innerHTML = '<div class="bar"><span class="nv">&lt;</span><span class="nv">&gt;</span><span>URL</span><input spellcheck="false"><button class="pt-btn">Go</button><button class="pt-btn">Stop</button></div><div class="page"></div>';
    b.appendChild(box);
    var inp = box.querySelector('input'), page = box.querySelector('.page');
    inp.value = app.browserUrl[d.name] || 'http://';
    function go() {
      var u = inp.value.trim();
      if (!u || u === 'http://') return;
      app.browserUrl[d.name] = u;
      page.innerHTML = '<i>Connecting…</i>';
      setTimeout(function () {
        var r = net.httpGet(d, u);
        app.changed();
        if (!r.ok) { page.innerHTML = r.err === 'dns' ? 'Host Name Unresolved' : 'Request Timeout'; return; }
        page.innerHTML = r.page || defaultPage();
      }, 500);
    }
    box.querySelectorAll('.pt-btn')[0].onclick = go;
    inp.onkeydown = function (e) { if (e.key === 'Enter') go(); };
  };
  /* ---------------- Email (client de messagerie du PC) ---------------- */
  D.email = function (b) {
    var d = this.dev, app = this.app, net = app.net;
    var c = net.mailCfg(d);
    app.mailLog = app.mailLog || {};
    var log = app.mailLog[d.name] = app.mailLog[d.name] || [];
    var box = h('div', 'pt-mail');
    b.appendChild(box);
    var sel = -1;
    function field(label, k, pw) { return '<div class="pt-row"><label>' + label + '</label><input class="pt-in" data-k="' + k + '"' + (pw ? ' type="password"' : '') + ' spellcheck="false"></div>'; }
    function config() {
      box.innerHTML = '<div class="sect">User Information</div>' + field('Your Name:', 'name') + field('Email Address', 'addr') +
        '<div class="sect">Server Information</div>' + field('Incoming Mail Server', 'inSrv') + field('Outgoing Mail Server', 'outSrv') +
        '<div class="sect">Logon Information</div>' + field('User Name:', 'user') + field('Password:', 'pw', true) +
        '<div class="pt-row"><span class="grow"></span><button class="pt-btn">Save</button><button class="pt-btn">Clear</button><button class="pt-btn">Reset</button></div>';
      var q = function (k) { return box.querySelector('[data-k=' + k + ']'); };
      ['name', 'addr', 'inSrv', 'outSrv', 'user', 'pw'].forEach(function (k) { q(k).value = c[k] || ''; });
      var bt = box.querySelectorAll('.pt-btn');
      bt[0].onclick = function () {
        var addr = q('addr').value.trim();
        if (addr && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addr)) { app.msg('Invalid Email Address.'); return; }
        ['name', 'addr', 'inSrv', 'outSrv', 'user'].forEach(function (k) { c[k] = q(k).value.trim(); });
        c.pw = q('pw').value;
        net.touch(); app.changed(); browser();
      };
      bt[1].onclick = function () { ['name', 'addr', 'inSrv', 'outSrv', 'user', 'pw'].forEach(function (k) { q(k).value = ''; }); };
      bt[2].onclick = function () { config(); };
    }
    function compose(to, subject) {
      box.innerHTML = '<div class="pt-row"><button class="pt-btn">Send</button></div>' +
        '<div class="pt-row"><label>To:</label><input class="pt-in" data-k="to" spellcheck="false" style="flex:1"></div>' +
        '<div class="pt-row"><label>Subject:</label><input class="pt-in" data-k="sub" spellcheck="false" style="flex:1"></div>' +
        '<textarea class="pt-in" data-k="body" style="height:170px;width:100%;box-sizing:border-box;font-family:Arial,sans-serif"></textarea>' +
        '<div class="pt-row"><span class="grow"></span><button class="pt-btn">Cancel</button></div>';
      var q = function (k) { return box.querySelector('[data-k=' + k + ']'); };
      q('to').value = to || ''; q('sub').value = subject || '';
      var bt = box.querySelectorAll('.pt-btn');
      bt[0].onclick = function () {
        var r = net.mailSend(d, q('to').value.trim(), q('sub').value.trim(), q('body').value);
        r.log.forEach(function (l) { log.push(l); });
        app.changed(); browser();
      };
      bt[1].onclick = function () { browser(); };
    }
    /* date de réception à l'heure locale : AAAA-MM-JJ HH:MM */
    function heure(iso) {
      var t = new Date(iso);
      if (!iso || isNaN(t)) return '';
      var p = function (x) { return (x < 10 ? '0' : '') + x; };
      return t.getFullYear() + '-' + p(t.getMonth() + 1) + '-' + p(t.getDate()) + ' ' + p(t.getHours()) + ':' + p(t.getMinutes());
    }
    function browser() {
      box.innerHTML = '<div class="pt-row"><button class="pt-btn">Compose</button><button class="pt-btn">Reply</button><button class="pt-btn">Receive</button><button class="pt-btn">Delete</button><span class="grow"></span><button class="pt-btn">Configure Mail</button></div>' +
        '<div class="sect">Mails</div><div class="pt-list" style="height:120px"></div><div class="mview"></div><div class="mlog"></div>';
      var bt = box.querySelectorAll('.pt-btn'), lst = box.querySelector('.pt-list'), view = box.querySelector('.mview'), lg = box.querySelector('.mlog');
      function draw() {
        lst.innerHTML = '<table><tr><th>From</th><th>Subject</th><th>Received</th></tr>' + c.inbox.map(function (m, i) {
          return '<tr data-i="' + i + '"' + (i === sel ? ' class="sel"' : '') + '><td>' + esc(m.from) + '</td><td>' + esc(m.subject) + '</td><td>' + esc(heure(m.date)) + '</td></tr>';
        }).join('') + '</table>';
        lst.querySelectorAll('tr[data-i]').forEach(function (tr) { tr.onclick = function () { sel = +tr.dataset.i; draw(); }; });
        var m = c.inbox[sel];
        view.innerHTML = m ? '<b>From:</b> ' + esc(m.from) + '<br><b>To:</b> ' + esc(m.to) + '<br><b>Subject:</b> ' + esc(m.subject) + '<hr>' + esc(m.body).replace(/\n/g, '<br>') : '';
        lg.textContent = log.slice(-8).join('\n');
      }
      bt[0].onclick = function () { compose(); };
      bt[1].onclick = function () { var m = c.inbox[sel]; if (m) compose(m.from, /^re:/i.test(m.subject) ? m.subject : 'Re: ' + m.subject); };
      bt[2].onclick = function () {
        lg.textContent = log.slice(-8).concat(['Receiving mail from POP3 Server ' + (c.inSrv || '?')]).join('\n');
        setTimeout(function () { var r = net.mailReceive(d); r.log.forEach(function (l) { log.push(l); }); app.changed(); draw(); }, 400);
      };
      bt[3].onclick = function () { if (sel >= 0 && c.inbox[sel]) { c.inbox.splice(sel, 1); sel = -1; net.touch(); app.changed(); draw(); } };
      bt[4].onclick = function () { config(); };
      draw();
    }
    if (!c.addr && !c.outSrv && !c.inSrv) config(); else browser();
  };
  function defaultPage() {
    return '<center><font size="+2" color="blue">Cisco Packet Tracer</font></center><hr>Welcome to Cisco Packet Tracer. Opening doors to new opportunities. Mind Wide Open.<p>Quick Links:<br><a>A small page</a><br><a>Copyrights</a><br><a>Image page</a><br><a>Image</a></p>';
  }

  /* ---------------- Services (serveur) ---------------- */
  var SVCS = ['HTTP', 'DHCP', 'DHCPv6', 'TFTP', 'DNS', 'SYSLOG', 'AAA', 'NTP', 'EMAIL', 'FTP', 'IoT', 'VM Management', 'Radius EAP'];
  D.services = function (p) {
    var self = this;
    var box = h('div', 'pt-cfg');
    var left = h('div', 'pt-cfgleft');
    left.appendChild(h('div', 'h', 'SERVICES'));
    var right = h('div', 'pt-cfgright');
    SVCS.forEach(function (s) {
      var e = h('div', 'it', s);
      e.onclick = function () { left.querySelectorAll('.on').forEach(function (x) { x.classList.remove('on'); }); e.classList.add('on'); self.svcPanel(right, s); };
      left.appendChild(e);
    });
    box.appendChild(left); box.appendChild(right);
    p.appendChild(box);
    var sel = this.svcSel || 'HTTP';
    left.querySelectorAll('.it').forEach(function (x) { if (x.textContent === sel) x.classList.add('on'); });
    this.svcPanel(right, sel);
  };
  D.svcPanel = function (r, s) {
    this.svcSel = s;
    var d = this.dev, app = this.app, net = app.net, sv = d.services;
    r.innerHTML = '';
    r.appendChild(h('div', 'ph', s));
    function onoff(label, obj, name) {
      var row = h('div', 'pt-row', '<label>' + label + '</label><input type="radio" name="' + name + '"> On <span style="width:20px"></span><input type="radio" name="' + name + '"> Off');
      var rs = row.querySelectorAll('input');
      rs[0].checked = !!obj.on; rs[1].checked = !obj.on;
      rs[0].onchange = function () { obj.on = true; net.touch(); app.changed(); };
      rs[1].onchange = function () { obj.on = false; net.touch(); app.changed(); };
      return row;
    }
    var uid = d.name.replace(/\W/g, '');
    if (s === 'HTTP') {
      r.appendChild(onoff('HTTP', sv.http, 'h' + uid));
      var https = { get on() { return sv.http.https !== false; }, set on(v) { sv.http.https = v; } };
      r.appendChild(onoff('HTTPS', https, 'hs' + uid));
      var fm = h('div', null, '<div style="margin:10px 0 4px">File Manager</div>');
      var lst = h('div', 'pt-list');
      lst.innerHTML = '<table><tr><th>File Name</th><th>Edit</th><th>Delete</th></tr>' + ['copyrights.html', 'cscoptlogo177x111.jpg', 'helloworld.html', 'image.html', 'index.html'].map(function (f) {
        return '<tr><td>' + f + '</td><td>' + (f === 'index.html' ? '<a href="#" data-e="1">(edit)</a>' : '') + '</td><td>(delete)</td></tr>';
      }).join('') + '</table>';
      fm.appendChild(lst); r.appendChild(fm);
      var ed = lst.querySelector('[data-e]');
      ed.onclick = function (e) {
        e.preventDefault();
        var ta = h('textarea', 'pt-in'); ta.style.cssText = 'height:180px;margin-top:8px;font-family:Courier New,monospace';
        ta.value = sv.http.pages || '<html>\n<center><font size=\'+2\' color=\'blue\'>Cisco Packet Tracer</font></center>\n<hr>Welcome to Cisco Packet Tracer. Opening doors to new opportunities. Mind Wide Open.\n</html>';
        var bt = h('button', 'pt-btn', 'Save'); bt.style.marginTop = '4px';
        bt.onclick = function () { sv.http.pages = ta.value.replace(/<script[\s\S]*?<\/script>/gi, ''); app.changed(); app.msg('File saved.'); };
        r.appendChild(ta); r.appendChild(bt);
      };
      return;
    }
    if (s === 'DHCP') {
      var dh = sv.dhcp;
      if (!dh.pools.length) dh.pools.push({ name: 'serverPool', network: '0.0.0.0', mask: '0.0.0.0', gateway: '0.0.0.0', dns: '0.0.0.0', start: d.host.ip != null ? ip(N.netOf(d.host.ip, d.host.len)) : '0.0.0.0', end: '0.0.0.0', max: 512, tftp: '0.0.0.0', wlc: '0.0.0.0' });
      var top = h('div', 'pt-row', '<label>Interface</label><select class="pt-in" style="width:160px"><option>FastEthernet0</option></select><span class="grow"></span>Service <input type="radio" name="dh' + uid + '"> On <input type="radio" name="dh' + uid + '"> Off');
      r.appendChild(top);
      var rs = top.querySelectorAll('input');
      rs[0].checked = dh.on; rs[1].checked = !dh.on;
      rs[0].onchange = function () { dh.on = true; net.touch(); app.changed(); };
      rs[1].onchange = function () { dh.on = false; net.touch(); app.changed(); };
      var f = h('div', 'pt-form');
      f.style.gridTemplateColumns = 'max-content 1fr';
      f.innerHTML = '<label>Pool Name</label><input class="pt-in" data-k="name"><label>Default Gateway</label><input class="pt-in" data-k="gateway"><label>DNS Server</label><input class="pt-in" data-k="dns">' +
        '<label>Start IP Address :</label><input class="pt-in" data-k="start"><label>Subnet Mask:</label><input class="pt-in" data-k="mask">' +
        '<label>Maximum Number of Users :</label><input class="pt-in" data-k="max"><label>TFTP Server:</label><input class="pt-in" data-k="tftp"><label>WLC Address:</label><input class="pt-in" data-k="wlc">';
      r.appendChild(f);
      var bts = h('div', 'pt-row', '<span class="grow"></span><button class="pt-btn">Add</button><button class="pt-btn">Save</button><button class="pt-btn">Remove</button>');
      r.appendChild(bts);
      var lst2 = h('div', 'pt-list'); lst2.style.flex = '1';
      r.appendChild(lst2);
      var sel = 0;
      var F = function (k) { return f.querySelector('[data-k=' + k + ']'); };
      function load(i) {
        var pl = dh.pools[i]; if (!pl) return;
        ['name', 'gateway', 'dns', 'start', 'mask', 'tftp', 'wlc'].forEach(function (k) { F(k).value = pl[k] || '0.0.0.0'; });
        F('max').value = pl.max;
      }
      function draw() {
        lst2.innerHTML = '<table><tr><th>Pool Name</th><th>Default Gateway</th><th>DNS Server</th><th>Start IP Address</th><th>Subnet Mask</th><th>Max User</th><th>TFTP Server</th><th>WLC Address</th></tr>' +
          dh.pools.map(function (pl, i) { return '<tr data-i="' + i + '"' + (i === sel ? ' class="sel"' : '') + '><td>' + esc(pl.name) + '</td><td>' + pl.gateway + '</td><td>' + pl.dns + '</td><td>' + pl.start + '</td><td>' + pl.mask + '</td><td>' + pl.max + '</td><td>' + (pl.tftp || '0.0.0.0') + '</td><td>' + (pl.wlc || '0.0.0.0') + '</td></tr>'; }).join('') + '</table>';
        lst2.querySelectorAll('tr[data-i]').forEach(function (tr) { tr.onclick = function () { sel = +tr.dataset.i; load(sel); draw(); }; });
      }
      function read() {
        var o = { name: F('name').value.trim(), gateway: F('gateway').value.trim() || '0.0.0.0', dns: F('dns').value.trim() || '0.0.0.0', start: F('start').value.trim(), mask: F('mask').value.trim(), max: +F('max').value || 0, tftp: F('tftp').value.trim() || '0.0.0.0', wlc: F('wlc').value.trim() || '0.0.0.0' };
        var bad = null;
        ['gateway', 'dns', 'start', 'tftp', 'wlc'].forEach(function (k) { if (!N.isIP(o[k])) bad = bad || k; });
        if (!N.isMask(o.mask)) bad = bad || 'mask';
        if (!o.name) bad = 'name';
        if (bad) { app.msg(bad === 'name' ? 'Pool name cannot be empty.' : 'Invalid ' + ({ gateway: 'Default Gateway', dns: 'DNS Server', start: 'Start IP Address', mask: 'Subnet Mask', tftp: 'TFTP Server', wlc: 'WLC Address' }[bad]) + '.'); return null; }
        var len = N.maskLen(o.mask), st = N.ip2int(o.start);
        o.network = ip(N.netOf(st, len));
        o.end = ip(Math.min(N.bcastOf(st, len) - 1, st + Math.max(0, o.max - 1)));
        return o;
      }
      load(0); draw();
      var b3 = bts.querySelectorAll('button');
      b3[0].onclick = function () {
        var o = read(); if (!o) return;
        if (dh.pools.some(function (x) { return x.name === o.name; })) { app.msg('Pool name already exists.'); return; }
        dh.pools.push(o); sel = dh.pools.length - 1; draw(); net.touch(); app.changed();
      };
      b3[1].onclick = function () {
        var o = read(); if (!o) return;
        if (!dh.pools[sel]) return;
        if (dh.pools[sel].name === 'serverPool') o.name = 'serverPool';
        dh.pools[sel] = o; draw(); net.touch(); app.changed();
      };
      b3[2].onclick = function () {
        if (!dh.pools[sel] || dh.pools[sel].name === 'serverPool') { app.msg('serverPool cannot be removed.'); return; }
        dh.pools.splice(sel, 1); sel = 0; load(0); draw(); net.touch(); app.changed();
      };
      return;
    }
    if (s === 'DNS') {
      var dn = sv.dns;
      r.appendChild(onoff('DNS Service', dn, 'dn' + uid));
      r.appendChild(h('div', null, '<div style="margin:8px 0 4px">Resource Records</div>'));
      var f2 = h('div', 'pt-form');
      f2.style.gridTemplateColumns = 'max-content 1fr max-content 1fr';
      f2.innerHTML = '<label>Name</label><input class="pt-in" data-k="n"><label>Type</label><select class="pt-in" data-k="t"><option value="A">A Record</option><option value="AAAA">AAAA Record</option><option value="CNAME">CNAME</option><option value="NS">NS Record</option><option value="MX">MX Record</option></select>' +
        '<label data-k="vl">Address</label><input class="pt-in" data-k="v" style="grid-column:span 3">';
      r.appendChild(f2);
      var bts2 = h('div', 'pt-row', '<span class="grow"></span><button class="pt-btn">Add</button><button class="pt-btn">Save</button><button class="pt-btn">Remove</button>');
      r.appendChild(bts2);
      var lst3 = h('div', 'pt-list'); lst3.style.flex = '1';
      r.appendChild(lst3);
      r.appendChild(h('div', 'pt-row', '<button class="pt-btn">DNS Cache</button>'));
      var sel2 = -1;
      var G = function (k) { return f2.querySelector('[data-k=' + k + ']'); };
      G('t').onchange = function () { G('vl').textContent = { A: 'Address', AAAA: 'IPv6 Address', CNAME: 'Host Name', NS: 'Server Name', MX: 'Mail Server' }[G('t').value]; };
      function draw2() {
        lst3.innerHTML = '<table><tr><th>No.</th><th>Name</th><th>Type</th><th>Detail</th></tr>' + dn.records.map(function (x, i) {
          return '<tr data-i="' + i + '"' + (i === sel2 ? ' class="sel"' : '') + '><td>' + i + '</td><td>' + esc(x.name) + '</td><td>' + { A: 'A Record', AAAA: 'AAAA Record', CNAME: 'CNAME', NS: 'NS Record', MX: 'MX Record' }[x.type] + '</td><td>' + esc(x.value || '') + '</td></tr>';
        }).join('') + '</table>';
        lst3.querySelectorAll('tr[data-i]').forEach(function (tr) {
          tr.onclick = function () { sel2 = +tr.dataset.i; var x = dn.records[sel2]; G('n').value = x.name; G('t').value = x.type; G('t').onchange(); G('v').value = x.value || ''; draw2(); };
        });
      }
      draw2();
      function rec() {
        var o = { name: G('n').value.trim(), type: G('t').value, value: G('v').value.trim() };
        if (!o.name) { app.msg('Name cannot be empty.'); return null; }
        if (o.type === 'A' && !N.isIP(o.value)) { app.msg('Invalid IP address.'); return null; }
        if (o.type === 'AAAA' && !N.isIP6(o.value)) { app.msg('Invalid IPv6 address.'); return null; }
        if (!o.value) { app.msg('Detail cannot be empty.'); return null; }
        return o;
      }
      var b4 = bts2.querySelectorAll('button');
      b4[0].onclick = function () { var o = rec(); if (!o) return; dn.records.push(o); draw2(); net.touch(); app.changed(); };
      b4[1].onclick = function () { var o = rec(); if (!o || sel2 < 0) return; dn.records[sel2] = o; draw2(); net.touch(); app.changed(); };
      b4[2].onclick = function () { if (sel2 < 0) return; dn.records.splice(sel2, 1); sel2 = -1; draw2(); net.touch(); app.changed(); };
      return;
    }
    if (s === 'EMAIL') {
      var es = net.mailSvc(d);
      r.appendChild(onoff('SMTP Service', { get on() { return es.smtp; }, set on(v) { es.smtp = v; } }, 'sm' + uid));
      r.appendChild(onoff('POP3 Service', { get on() { return es.pop3; }, set on(v) { es.pop3 = v; } }, 'po' + uid));
      var dr = h('div', 'pt-row', '<label>Domain Name:</label><input class="pt-in" style="width:220px" spellcheck="false"><button class="pt-btn">Set</button>');
      var din = dr.querySelector('input');
      din.value = es.domain;
      dr.querySelector('button').onclick = function () {
        var v = din.value.trim().toLowerCase();
        if (v && !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(v)) { app.msg('Invalid domain name.'); return; }
        es.domain = v; net.touch(); app.changed();
      };
      r.appendChild(dr);
      r.appendChild(h('div', null, '<div style="margin:10px 0 4px">User Setup</div>'));
      var ur = h('div', 'pt-row', '<label>User</label><input class="pt-in" style="width:140px" spellcheck="false"><label style="width:auto">Password</label><input class="pt-in" style="width:140px" spellcheck="false"><button class="pt-btn">+</button><button class="pt-btn">-</button>');
      r.appendChild(ur);
      var uin = ur.querySelectorAll('input'), ub = ur.querySelectorAll('button');
      var ul = h('div', 'pt-list'); ul.style.height = '150px';
      r.appendChild(ul);
      var usel = -1;
      function drawUsers() {
        ul.innerHTML = '<table><tr><th>User</th><th>Messages</th></tr>' + es.users.map(function (u, i) {
          var n = (es.boxes[u.name.toLowerCase()] || []).length;
          return '<tr data-i="' + i + '"' + (i === usel ? ' class="sel"' : '') + '><td>' + esc(u.name) + '</td><td>' + n + '</td></tr>';
        }).join('') + '</table>';
        ul.querySelectorAll('tr[data-i]').forEach(function (tr) { tr.onclick = function () { usel = +tr.dataset.i; drawUsers(); }; });
      }
      drawUsers();
      ub[0].onclick = function () {
        var nm = uin[0].value.trim(), pw = uin[1].value;
        if (!nm || !pw) { app.msg('User name and password cannot be empty.'); return; }
        if (!/^[A-Za-z0-9._-]+$/.test(nm)) { app.msg('Invalid user name.'); return; }
        if (es.users.some(function (u) { return u.name.toLowerCase() === nm.toLowerCase(); })) { app.msg('The user already exists.'); return; }
        es.users.push({ name: nm, pw: pw });
        uin[0].value = ''; uin[1].value = '';
        net.touch(); app.changed(); drawUsers();
      };
      ub[1].onclick = function () {
        if (usel < 0 || !es.users[usel]) return;
        delete es.boxes[es.users[usel].name.toLowerCase()];
        es.users.splice(usel, 1); usel = -1;
        net.touch(); app.changed(); drawUsers();
      };
      return;
    }
    var key = s.toLowerCase().replace(/\s+/g, '');
    sv[key] = sv[key] || { on: false };
    r.appendChild(onoff('Service', sv[key], 'x' + key + uid));
    r.appendChild(h('div', null, '<p style="color:#555;margin-top:12px">Service non utilisé dans les exercices du cours.</p>'));
  };

  /* ---------------- Programming / Attributes ---------------- */
  D.programming = function (p) {
    var box = h('div', 'pt-desk');
    box.innerHTML = '<div style="padding:10px;font-size:12px"><div class="pt-list" style="height:280px"><table><tr><th>Name</th><th>Type</th></tr></table></div>' +
      '<div class="pt-row" style="margin-top:6px"><button class="pt-btn">New</button><button class="pt-btn">Import</button><button class="pt-btn">Delete</button><button class="pt-btn">Open</button><button class="pt-btn">Run</button><button class="pt-btn">Stop</button></div></div>';
    p.appendChild(box);
  };
  D.attributes = function (p) {
    var d = this.dev;
    var cost = { router: 250, switch: 400, l3switch: 2000, pc: 30, server: 250, hub: 30 }[d.cat] || 100;
    var box = h('div');
    box.style.cssText = 'flex:1;display:flex;flex-direction:column;gap:4px';
    box.innerHTML = '<div>Attributes:</div><div class="pt-list" style="flex:1"><table><tr><th></th><th>Name</th><th>Attribute</th></tr>' +
      [['MTBF', 300000], ['cost', cost], ['power source', 1], ['rack units', d.cat === 'pc' ? 0 : 1], ['wattage', 5]].map(function (x, i) { return '<tr><td>' + (i + 1) + '</td><td>' + x[0] + '</td><td>' + x[1] + '</td></tr>'; }).join('') +
      '</table></div><div>Properties:</div><div class="pt-list" style="flex:1"><table><tr><th></th><th>Property</th><th>Value</th></tr><tr><td>1</td><td>PT_MODEL</td><td>' + esc(d.model) + '</td></tr>' +
      (d.cat === 'router' || d.cat === 'switch' ? '<tr><td>2</td><td>PT_VERSION</td><td>' + root.IOS.iosVersion(d) + '</td></tr>' : '') + '</table></div><div style="text-align:right"><button class="pt-btn">Refresh</button></div>';
    p.appendChild(box);
  };

  root.PTDevWin = DevWin;
  root.PTGui = gui;
})(window);
