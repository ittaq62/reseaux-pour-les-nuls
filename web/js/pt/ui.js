/* ============================================================
   Packet Tracer intégré — fenêtre principale
   ============================================================ */
(function (root) {
  'use strict';
  var N = root.NET, E = root.PTEngine;
  var A = 'assets/pt/';
  var SVGNS = 'http://www.w3.org/2000/svg';

  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function s(tag, attrs) { var e = document.createElementNS(SVGNS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function esc(x) { return String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ---------------------------------------------------------- */
  /* Icônes logiques et libellés                                  */
  /* ---------------------------------------------------------- */
  var ICON = {
    router: ['iRouter@2x.png', 48, 33], switch: ['iSwitch@2x.png', 50, 25], l3switch: ['iSwitch3560@2x.png', 36, 36],
    pc: ['iWorkstation@2x.png', 44, 37], laptop: ['iLaptop@2x.png', 50, 35], server: ['iServer@2x.png', 30, 49], hub: ['iHub@2x.png', 34, 31]
  };
  function iconOf(d) {
    if (d.model === 'Laptop-PT') return ICON.laptop;
    return ICON[d.cat] || ICON.router;
  }
  function modelLabel(d) {
    return { 'Router-PT-Empty': 'Router-PT', 'Switch-PT-Empty': 'Switch-PT' }[d.model] || d.model;
  }

  /* ---------------------------------------------------------- */
  /* Palette (boîte des équipements)                              */
  /* ---------------------------------------------------------- */
  var CATS = [
    { k: 'net', t: 'Network Devices', i: 'group0', subs: [
      { k: 'routers', t: 'Routers', i: 'subgroup0', m: [['PT8200', 'Specific8200_40x40.png', 'PT8200'], ['4331', 'Specific4331_40x40.png', 'ISR4331'], ['4321', 'Specific4321_40x40.png', 'ISR4321'], ['IR8340', 'SpecificComponentBoxIR8340.png'], ['1941', 'Specific1941_40x40.png', '1941'], ['2901', 'Specific2901_40x40.png', '2901'], ['2911', 'Specific2911_40x40.png', '2911'], ['819IOX', 'Specific819IOX_40x40.png'], ['819HGW', 'Specific819HGW_40x40.png'], ['829', 'Specific829_40x40.png'], ['1240', 'SpecificDevices_1240.png'], ['IR1101', 'Specific_IR1101.png'], ['PT-Router', 'SpecificArtificialRouter_40x40.png', 'Router-PT'], ['PT-Empty', 'SpecificArtificialRouterEmpty_40x40.png']] },
      { k: 'switches', t: 'Switches', i: 'subgroup1', m: [['2960', 'Specific2960_40x40.png', '2960-24TT'], ['PT-Switch', 'SpecificArtificialSwitch_40x40.png', 'Switch-PT'], ['PT-Empty', 'SpecificArtificialSwitchEmpty_40x40.png'], ['3560 24PS', 'Specific3560_24PS_40x40.png', '3560-24PS'], ['3650 24PS', 'Specific3650.png', '3650-24PS'], ['IE 2000', 'IE2000_ComponentBox.png'], ['IE-3400', 'SpecificIE3400.png'], ['IE-9320', 'Specific_ComponentBox_IE9320.png'], ['PT-Bridge', 'SpecificArtificialBridge_40x40.png'], ['2950-24', 'Specific2950-24_40x40.png', '2950-24'], ['2950T', 'Specific2950T_40x40.png', '2950T-24']] },
      { k: 'hubs', t: 'Hubs', i: 'subgroup2', m: [['PT-Hub', 'SpecificArtificialHub_40x40.png', 'Hub-PT'], ['PT-Repeater', 'SpecificArtificialRepeater_40x40.png'], ['CoAxialSplitter', 'CoaxialSplitter.png']] },
      { k: 'wireless', t: 'Wireless Devices', i: 'subgroup3', m: [['AP-PT', 'AP-PT.png'], ['AP-PT-A', 'AP-PT-A.png'], ['AP-PT-N', 'AP-PT-N.png'], ['AP-PT-AC', 'AP-PT-AC.png'], ['LAP-PT', 'LAP-PT.png'], ['3702i', 'Specific3702i_APicon.png'], ['WLC-PT', 'SpecificWLC_40x40.png'], ['HomeRouter', 'SpecificHomeRouter_40x40.png']] },
      { k: 'security', t: 'Security', i: 'subgroup7', m: [['5506-X', 'ASA.png'], ['ISA-3000', 'SpecificISA3000.png'], ['Meraki-MX65W', 'SpecificMeraki.png']] },
      { k: 'wan', t: 'WAN Emulation', i: 'subgroup8', m: [['Cloud-PT', 'SpecificArtificialCloud_40x40.png'], ['DSL-Modem', 'SpecificDSL-Modem_40x40.png'], ['Cable-Modem', 'SpecificCable-Modem_40x40.png'], ['Cell-Tower', 'SpecificCellTower_40x40.png']] }] },
    { k: 'end', t: 'End Devices', i: 'group1', subs: [
      { k: 'enddev', t: 'End Devices', i: 'subgroup6', m: [['PC', 'SpecificArtificialWorkstation_40x40.png', 'PC-PT'], ['Laptop', 'SpecificArtificialLaptop_40x40.png', 'Laptop-PT'], ['Server', 'SpecificArtificialServer_40x40.png', 'Server-PT'], ['Meraki Server', 'SpecificMerakiServer.png'], ['Network Controller', 'NetworkController.png'], ['Printer', 'SpecificArtificialPrinter_40x40.png'], ['IP Phone', 'SpecificIPPhone_40x40.png'], ['VoIP Device', 'SpecificHomeVoip_40x40.png'], ['Phone', 'SpecificAnalogPhone_40x40.png'], ['TV', 'SpecificArtificialTV_40x40.png'], ['Tablet', 'SpecificArtificialTabletPC_40x40.png'], ['Smart Phone', 'SpecificArtificialPda_40x40.png'], ['Generic Wireless', 'SpecificArtificialWirelessEndDevice_40x40.png'], ['Generic Wired', 'SpecificArtificialWiredEndDevice_40x40.png']] },
      { k: 'home', t: 'Home', i: 'subgroup9', m: [] }, { k: 'city', t: 'Smart City', i: 'subgroup10', m: [] }, { k: 'ind', t: 'Industrial', i: 'subgroup11', m: [] }, { k: 'grid', t: 'Power Grid', i: 'subgroup12', m: [] }] },
    { k: 'comp', t: 'Components', i: 'group2', subs: [{ k: 'boards', t: 'Boards', i: 'subgroup4', m: [] }, { k: 'act', t: 'Actuators', i: 'subgroup13', m: [] }, { k: 'sens', t: 'Sensors', i: 'subgroup14', m: [] }] },
    { k: 'con', t: 'Connections', i: 'group3', subs: [
      { k: 'cables', t: 'Connections', i: 'subgroup5', m: [['Automatically Choose Connection Type', 'SpecificAutoConnect_40x40.png', 'auto'], ['Console', 'SpecificConsole_40x40.png', 'console'], ['Copper Straight-Through', 'SpecificCopperStraight_40x40.png', 'straight'], ['Copper Cross-Over', 'SpecificCrossConnect_40x40.png', 'cross'], ['Fiber', 'SpecificFiber_40x40.png', 'fiber'], ['Phone', 'SpecificPhone_40x40.png'], ['Coaxial', 'SpecificCoaxial_40x40.png'], ['Serial DCE', 'SpecificSerialDCE_40x40.png', 'serial'], ['Serial DTE', 'SpecificSerialDTE_40x40.png', 'serial'], ['Octal', 'SpecificOctal_40x40.png'], ['IoT Custom Cable', 'SpecificIoECustomCable_40x40.png'], ['USB', 'SpecificUSB_40x40.png']] },
      { k: 'struct', t: 'Structured Cabling', i: 'subgroup16', m: [] }] },
    { k: 'misc', t: 'Miscellaneous', i: 'group4', subs: [{ k: 'misc', t: 'Miscellaneous', i: 'subgroup15', m: [] }] },
    { k: 'mu', t: 'Multiuser Connection', i: 'group5', subs: [{ k: 'mu', t: 'Multiuser Connection', i: 'subgroup17', m: [] }] }
  ];
  var CABLE_STYLE = {
    straight: { c: '#000000' }, cross: { c: '#000000', dash: '6 4' }, fiber: { c: '#f7990d' }, serial: { c: '#e2231a', zig: true }, console: { c: '#28b4e6', curve: true }
  };

  /* ---------------------------------------------------------- */
  /* Application                                                  */
  /* ---------------------------------------------------------- */
  var app = null;
  var PTUI = {};
  PTUI.isOpen = function () { return !!app; };

  PTUI.open = function (opts) {
    if (app) PTUI.close();
    app = {
      net: opts.net, opts: opts, wins: [], lastTab: {}, deskApp: {}, browserUrl: {}, cli: {}, pc: {},
      tool: 'select', mode: 'realtime', zoom: 1, pdus: [], pending: null, placeModel: null, cable: null,
      cat: 'net', sub: 'routers', t0: Date.now(), events: [], simT: 0
    };
    buildDom();
    app.zoom = fitZoom();
    render();
    app.timer = setInterval(tick, 250);
    document.addEventListener('keydown', onKey, true);
    if (opts.q) openActivity();
  };
  PTUI.close = function () {
    if (!app) return;
    clearInterval(app.timer);
    document.removeEventListener('keydown', onKey, true);
    changed(true);
    app.root.remove();
    app = null;
  };
  PTUI.reload = function (net) {
    if (!app) return;
    app.net = net; app.cli = {}; app.pc = {}; app.pdus = [];
    app.wins.forEach(function (w) { w.w.remove(); }); app.wins = [];
    render(); drawPdus();
    if (app.act) refreshActivity(null);
  };

  /* état partagé des consoles */
  function cliState(d) {
    var st = app.cli[d.name];
    if (!st) { st = app.cli[d.name] = { session: new root.IOS.Session(app.net, d), buffer: [], term: null, booted: false, started: false }; }
    return st;
  }
  function pcState(d) {
    var st = app.pc[d.name];
    if (!st) { st = app.pc[d.name] = { shell: new root.PCShell(app.net, d), buffer: [], term: null }; }
    return st;
  }
  var saveTm = null;
  function changed(now) {
    if (!app) return;
    clearTimeout(saveTm);
    var o = app.opts;
    if (now) { if (o.onChange) o.onChange(); return; }
    saveTm = setTimeout(function () { if (app && o.onChange) o.onChange(); }, 400);
    app.dirty = true;
  }
  function msg(t) { alert(t); }

  /* ---------------------------------------------------------- */
  /* DOM                                                          */
  /* ---------------------------------------------------------- */
  function tbIcon(file, title, fn, on) {
    var e = h('span', 'ic' + (on ? ' on' : ''), '<img src="' + A + 'toolbar/' + file + '">');
    e.title = title;
    if (fn) e.onclick = fn;
    return e;
  }
  function buildDom() {
    var r = h('div', 'ptapp');
    app.root = r;
    var file = app.opts.file || 'sans titre.pkt';
    r.innerHTML = '<div class="pt-title"><img src="' + A + 'misc/app.png"><span class="t">Cisco Packet Tracer - C:\\Users\\famil\\Documents\\IMT\\Architecture, modèles et protocoles des réseaux\\' + esc(file) + '</span>' +
      '<span class="pt-caption"><span>—</span><span>☐</span><span class="x" title="Fermer Packet Tracer (retour au cours)">✕</span></span></div>' +
      '<div class="pt-menubar"></div><div class="pt-tb" data-r="1"></div><div class="pt-tb" data-r="2"></div>' +
      '<div class="pt-nav"></div><div class="pt-center"><div class="pt-ws"></div><div class="pt-simpanel"></div></div>' +
      '<div class="pt-timebar"></div><div class="pt-bottom"></div>';
    document.body.appendChild(r);
    r.querySelector('.pt-caption .x').onclick = function () { PTUI.close(); };
    buildMenus(r.querySelector('.pt-menubar'));
    /* barre d'outils 1 */
    var t1 = r.querySelector('[data-r="1"]');
    [['file.svg', 'New (Ctrl+N)'], ['folder.svg', 'Open (Ctrl+O)'], ['save.svg', 'Save (Ctrl+S)', function () { changed(true); flash('Enregistré (sauvegarde automatique de ta progression).'); }],
      ['print.svg', 'Print (Ctrl+P)'], ['info.svg', 'Activity Wizard', function () { openActivity(); }], ['activity-wizard.svg', 'Activity Wizard', function () { openActivity(); }], ['custom-device-dialog.svg', 'Custom Devices Dialog']].forEach(function (x) { t1.appendChild(tbIcon(x[0], x[1], x[2])); });
    t1.appendChild(h('span', 'sep'));
    [['copy.svg', 'Copy (Ctrl+C)'], ['paste.svg', 'Paste (Ctrl+V)'], ['undo.svg', 'Undo (Ctrl+Z)'], ['redo.svg', 'Redo (Ctrl+Y)']].forEach(function (x) { t1.appendChild(tbIcon(x[0], x[1])); });
    t1.appendChild(h('span', 'sep'));
    t1.appendChild(tbIcon('iTBZoomIn.png', 'Zoom In', function () { setZoom(app.zoom * 1.2); }));
    t1.appendChild(tbIcon('iTBZoomReset.png', 'Zoom Reset', function () { setZoom(fitZoom()); }));
    t1.appendChild(tbIcon('iTBZoomOut.png', 'Zoom Out', function () { setZoom(app.zoom / 1.2); }));
    t1.appendChild(tbIcon('viewport.svg', 'Viewport'));
    t1.appendChild(tbIcon('drawing-palette.svg', 'Drawing Palette'));
    t1.appendChild(h('span', 'sep'));
    t1.appendChild(tbIcon('document.svg', 'Custom Devices Dialog'));
    t1.appendChild(tbIcon('cluster-association-dialog.svg', 'Cluster Association'));
    t1.appendChild(tbIcon('image.svg', 'Background image'));
    t1.appendChild(h('span', 'grow'));
    var help = h('span', 'help', '?'); help.title = 'Aide'; help.onclick = showHelp; t1.appendChild(help);
    /* barre d'outils 2 (outils communs) */
    var t2 = r.querySelector('[data-r="2"]');
    app.toolBtns = {};
    [['select', 'select.svg', 'Select (Esc)'], ['inspect', 'inspect.svg', 'Inspect (I)'], ['delete', 'delete.svg', 'Delete (Del)'], ['resize', 'resize.svg', 'Resize Shape (Alt+R)']].forEach(function (x) {
      var b = tbIcon(x[1], x[2], function () { setTool(x[0]); }, x[0] === 'select'); app.toolBtns[x[0]] = b; t2.appendChild(b);
    });
    t2.appendChild(h('span', 'sep'));
    [['note', 'notes.svg', 'Place Note (N)'], ['line', 'line.svg', 'Draw Line'], ['rect', 'rectangle.svg', 'Draw Rectangle'], ['ellipse', 'ellipse.svg', 'Draw Ellipse'], ['free', 'polygon.svg', 'Draw Freeform']].forEach(function (x) {
      var b = tbIcon(x[1], x[2], function () { setTool(x[0]); }); app.toolBtns[x[0]] = b; t2.appendChild(b);
    });
    t2.appendChild(h('span', 'sep'));
    var pdu = tbIcon('add-simple-pdu.svg', 'Add Simple PDU (P)', function () { setTool('pdu'); }); app.toolBtns.pdu = pdu; t2.appendChild(pdu);
    var cpdu = tbIcon('add-complex-pdu.svg', 'Add Complex PDU (C)', function () { flash('Utilise « Add Simple PDU » (enveloppe fermée) : il envoie un ping ICMP.'); }); t2.appendChild(cpdu);
    /* bandeau Logical / Physical */
    var nav = r.querySelector('.pt-nav');
    nav.innerHTML = '<span class="pt-pill on"><svg viewBox="0 0 16 16"><circle cx="3" cy="4" r="2" fill="#fff"/><circle cx="13" cy="4" r="2" fill="#fff"/><circle cx="8" cy="12" r="2" fill="#fff"/><path d="M3 4L8 12L13 4" stroke="#fff" fill="none"/></svg>Logical</span>' +
      '<span class="pt-pill" title="Vue physique non utilisée ici"><svg viewBox="0 0 16 16"><rect x="4" y="1" width="8" height="14" rx="1" fill="none" stroke="#fff"/><path d="M5 4h6M5 7h6M5 10h6" stroke="#fff"/></svg>Physical</span><span class="xy">x, y:</span><span class="grow"></span>' +
      '<span class="root">Root</span><span class="pt-rbtn"><img src="' + A + 'toolbar/back.svg"></span><span class="pt-rbtn"><img src="' + A + 'toolbar/new-cluster.svg"></span><span class="pt-rbtn"><img src="' + A + 'toolbar/4-way-nav.svg"></span><span class="pt-rbtn"><img src="' + A + 'toolbar/image.svg"></span>' +
      '<span class="pt-clock"><img src="' + A + 'toolbar/viewport.svg" style="width:14px;height:14px"><span class="clk">00:00:00</span></span>';
    app.xy = nav.querySelector('.xy');
    app.clock = nav.querySelector('.clk');
    /* espace de travail */
    app.ws = r.querySelector('.pt-ws');
    app.svg = s('svg', {});
    app.ws.appendChild(app.svg);
    wsEvents();
    /* barre du temps */
    var tb = r.querySelector('.pt-timebar');
    tb.innerHTML = '<span class="tm">Time: 00:00:00</span><span class="pt-roundbtn" title="Power Cycle Devices"><img src="' + A + 'sim/reset.svg"></span><span class="pt-roundbtn" title="Fast Forward Time"><img src="' + A + 'sim/ffw.svg"></span><span class="simctl" style="display:none;align-items:center;gap:4px">PLAY CONTROLS: <span class="pt-roundbtn" data-p="back"><img src="' + A + 'sim/step-backward.svg"></span><span class="pt-roundbtn" data-p="play"><img src="' + A + 'sim/play.svg"></span><span class="pt-roundbtn" data-p="fwd"><img src="' + A + 'sim/step-forward.svg"></span></span>' +
      '<span class="grow"></span><span class="pt-mode evl" style="display:none"><img src="' + A + 'sim/event-list.svg" style="width:14px;filter:invert(1)">Event List</span>' +
      '<span class="pt-mode on" data-m="realtime"><svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#fff"/><path d="M8 3v5l3 2" stroke="#0f2b53" stroke-width="1.6" fill="none"/></svg>Realtime</span>' +
      '<span class="pt-mode" data-m="simulation"><svg viewBox="0 0 16 16"><path d="M2 11h12l-2-5H4z" fill="#fff"/><circle cx="5" cy="12" r="1.6" fill="#fff"/><circle cx="11" cy="12" r="1.6" fill="#fff"/></svg>Simulation</span>';
    app.tm = tb.querySelector('.tm');
    tb.querySelectorAll('.pt-mode[data-m]').forEach(function (m) { m.onclick = function () { setMode(m.dataset.m); }; });
    tb.querySelectorAll('.pt-roundbtn')[0].onclick = function () { flash('Power Cycle : tous les équipements redémarrent (configs enregistrées conservées).'); };
    tb.querySelectorAll('.pt-roundbtn')[1].onclick = function () { app.t0 -= 30000; flash('Temps avancé de 30 s (convergence STP / protocoles).'); };
    tb.querySelector('[data-p=play]').onclick = simPlay;
    tb.querySelector('[data-p=fwd]').onclick = simStep;
    tb.querySelector('[data-p=back]').onclick = function () { flash('Retour en arrière non disponible.'); };
    /* panneau simulation */
    buildSimPanel(r.querySelector('.pt-simpanel'));
    /* bas */
    buildBottom(r.querySelector('.pt-bottom'));
  }

  function buildMenus(bar) {
    var MENUS = {
      File: [['New', 'Ctrl+N', 1], ['Open...', 'Ctrl+O', 1], ['Open Samples', '', 1], ['Recent Files', '', 1], '-', ['Save', 'Ctrl+S', 0, function () { changed(true); flash('Progression enregistrée.'); }], ['Save As...', 'Ctrl+Shift+S', 1], ['Save As Pkz...', '', 1], '-', ['Print', 'Ctrl+P', 1], '-', ['Exit', 'Ctrl+Q', 0, function () { PTUI.close(); }]],
      Edit: [['Copy', 'Ctrl+C', 1], ['Paste', 'Ctrl+V', 1], ['Undo', 'Ctrl+Z', 1], ['Redo', 'Ctrl+Y', 1]],
      Options: [['Preferences...', 'Ctrl+R', 1], ['User Profile...', '', 1], ['Algorithm Settings...', 'Ctrl+Shift+M', 1]],
      View: [['Zoom In', 'Ctrl+=', 0, function () { setZoom(app.zoom * 1.2); }], ['Zoom Out', 'Ctrl+-', 0, function () { setZoom(app.zoom / 1.2); }], ['Zoom Reset', '', 0, function () { setZoom(fitZoom()); }], '-', ['Toolbars', '', 1]],
      Tools: [['Custom Devices Dialog', '', 1], ['Show Common Tools Bar', '', 1]],
      Extensions: [['Activity Wizard...', 'Ctrl+W', 0, function () { openActivity(); }], ['Multiuser', '', 1], ['Scripting', '', 1]],
      Window: [['Activity (consignes)', '', 0, function () { openActivity(); }], ['Fermer toutes les fenêtres', '', 0, function () { app.wins.slice().forEach(function (w) { w.close(); }); }]],
      Help: [['Contents', 'F1', 0, showHelp], ['Tutorials', '', 1], ['About', '', 0, function () { msg('Réseaux pour les nuls — simulateur façon Cisco Packet Tracer 9.0 (entraînement).'); }]]
    };
    var open = null;
    Object.keys(MENUS).forEach(function (m) {
      var sp = h('span', null, m);
      sp.onclick = function (e) {
        e.stopPropagation();
        if (open) { open.remove(); var was = open.dataset.m; open = null; bar.querySelectorAll('span').forEach(function (x) { x.classList.remove('open'); }); if (was === m) return; }
        sp.classList.add('open');
        var dd = h('div', 'pt-dropdown'); dd.dataset.m = m;
        dd.style.left = sp.offsetLeft + 'px';
        MENUS[m].forEach(function (it) {
          if (it === '-') { dd.appendChild(h('hr')); return; }
          var e2 = h('div', it[2] ? 'dis' : '', '<span>' + it[0] + '</span><i>' + it[1] + '</i>');
          e2.onclick = function (ev) { ev.stopPropagation(); if (it[2]) return; close(); if (it[3]) it[3](); };
          dd.appendChild(e2);
        });
        bar.appendChild(dd); open = dd;
      };
      bar.appendChild(sp);
    });
    function close() { if (open) { open.remove(); open = null; } bar.querySelectorAll('span').forEach(function (x) { x.classList.remove('open'); }); }
    document.addEventListener('click', close);
  }

  function showHelp() {
    msg('Aide rapide :\n\n• Clique sur un équipement pour ouvrir sa fenêtre (onglets Physical, Config, CLI, Desktop…).\n• Palette en bas à gauche : choisis un équipement puis clique dans l’espace de travail pour le poser.\n• Éclair (Connections) : choisis un câble, clique sur un équipement, choisis le port, puis sur le 2e équipement.\n• Enveloppe fermée (Add Simple PDU) : clique sur la source puis la destination pour envoyer un ping.\n• Gomme (Delete) : supprime un équipement ou un câble.\n• Loupe (Inspect) : affiche les tables ARP / routage / MAC.\n• Fenêtre « Instructions » : consignes + « Check Results » pour vérifier ton labo.');
  }

  /* ---------------------------------------------------------- */
  /* Rendu de l'espace de travail                                 */
  /* ---------------------------------------------------------- */
  function bbox() {
    var net = app.net, x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9;
    net.devices.forEach(function (d) { x1 = Math.min(x1, d.x - 40); y1 = Math.min(y1, d.y - 40); x2 = Math.max(x2, d.x + 60); y2 = Math.max(y2, d.y + 60); });
    net.shapes.forEach(function (sh) { if (sh.x2 - sh.x1 < 20) return; x1 = Math.min(x1, sh.x1); y1 = Math.min(y1, sh.y1); x2 = Math.max(x2, sh.x2); y2 = Math.max(y2, sh.y2); });
    net.notes.forEach(function (n) { x1 = Math.min(x1, n.x); y1 = Math.min(y1, n.y); x2 = Math.max(x2, n.x + 150); y2 = Math.max(y2, n.y + 30); });
    if (x1 > x2) { x1 = 0; y1 = 0; x2 = 800; y2 = 500; }
    return { x1: Math.min(0, x1), y1: Math.min(0, y1), x2: x2, y2: y2 };
  }
  function fitZoom() {
    var b = bbox(), W = app.ws.clientWidth || 1200, H = app.ws.clientHeight || 500;
    return Math.max(0.35, Math.min(1.1, Math.min((W - 30) / (b.x2 - b.x1 + 40), (H - 20) / (b.y2 - b.y1 + 40))));
  }
  function setZoom(z) { app.zoom = Math.max(0.25, Math.min(2.5, z)); render(); }

  function render() {
    var net = app.net, svg = app.svg, z = app.zoom;
    var b = bbox();
    var W = Math.max(app.ws.clientWidth, (b.x2 + 80) * z), H = Math.max(app.ws.clientHeight - 4, (b.y2 + 60) * z);
    svg.setAttribute('width', W); svg.setAttribute('height', H);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var g = s('g', { transform: 'scale(' + z + ')' });
    svg.appendChild(g);
    app.g = g;
    /* formes */
    net.shapes.forEach(function (sh, i) {
      var col = 'rgb(' + sh.rgb.join(',') + ')';
      var e = sh.k === 'rect'
        ? s('rect', { x: sh.x1, y: sh.y1, width: sh.x2 - sh.x1, height: sh.y2 - sh.y1 })
        : s('ellipse', { cx: (sh.x1 + sh.x2) / 2, cy: (sh.y1 + sh.y2) / 2, rx: (sh.x2 - sh.x1) / 2, ry: (sh.y2 - sh.y1) / 2 });
      e.setAttribute('fill', sh.fill ? col : 'none');
      e.setAttribute('stroke', sh.fill ? 'none' : (sh.line || '#000'));
      e.setAttribute('stroke-width', sh.fill ? 0 : 1);
      e.dataset.shape = i;
      g.appendChild(e);
    });
    /* notes */
    net.notes.forEach(function (n, i) {
      var t = s('text', { x: n.x, y: n.y, class: 'pt-note' });
      n.text.split('\n').forEach(function (line, k) {
        var ts = s('tspan', { x: n.x, dy: k ? 13 : 0 }); ts.textContent = line; t.appendChild(ts);
      });
      t.setAttribute('font-family', 'Verdana, Tahoma, sans-serif'); t.setAttribute('font-size', '11');
      t.dataset.note = i;
      g.appendChild(t);
    });
    /* câbles */
    var lightsLayer = s('g', {});
    net.links.forEach(function (l, i) {
      var a = net.dev(l.a.dev), bb = net.dev(l.b.dev);
      if (!a || !bb) return;
      var st = CABLE_STYLE[l.cable] || CABLE_STYLE.straight;
      var x1 = a.x, y1 = a.y, x2 = bb.x, y2 = bb.y;
      var hit = s('line', { x1: x1, y1: y1, x2: x2, y2: y2, class: 'pt-link-hit' });
      hit.dataset.link = i;
      g.appendChild(hit);
      var line;
      if (st.zig) {
        var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / L * 7, ny = dx / L * 7;
        line = s('polyline', { points: [x1, y1, mx - dx * .04 + nx, my - dy * .04 + ny, mx + dx * .04 - nx, my + dy * .04 - ny, x2, y2].join(' '), class: 'pt-link' });
      } else line = s('line', { x1: x1, y1: y1, x2: x2, y2: y2, class: 'pt-link' });
      line.setAttribute('stroke', st.c);
      if (st.dash) line.setAttribute('stroke-dasharray', st.dash);
      line.style.pointerEvents = 'none';
      g.appendChild(line);
      /* voyants + libellés de ports */
      var ls = net.linkState(l);
      [['a', a, bb], ['b', bb, a]].forEach(function (x) {
        var from = x[1], to = x[2];
        var dx = to.x - from.x, dy = to.y - from.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
        var ux = dx / L, uy = dy / L;
        var dist = Math.min(34, L * 0.3);
        var lx = from.x + ux * dist, ly = from.y + uy * dist;
        var state = ls[x[0]];
        var young = state === 'up' && (from.cat === 'switch' || from.cat === 'l3switch') && l.since && Date.now() - l.since < 2500;
        var col = state === 'up' ? (young ? '#ff9900' : '#1bbb1b') : state === 'block' ? '#ff9900' : '#e00000';
        var sz = 5.5;
        var tri = s('polygon', { points: [lx + ux * sz, ly + uy * sz, lx - ux * sz - uy * sz, ly - uy * sz + ux * sz, lx - ux * sz + uy * sz, ly - uy * sz - ux * sz].join(' '), fill: col });
        if (state !== 'up' && state !== 'block') tri.setAttribute('points', [lx - 4, ly - 4, lx + 4, ly - 4, lx + 4, ly + 4, lx - 4, ly + 4].join(' '));
        lightsLayer.appendChild(tri);
        var port = l[x[0]].port;
        var txt = E.shortIf(port);
        var px = from.x + ux * (dist + 16) + (-uy) * 8, py = from.y + uy * (dist + 16) + ux * 8;
        var lg = s('g', { class: 'pt-plbl' });
        var w = txt.length * 6.3 + 4;
        lg.appendChild(s('rect', { x: px - w / 2, y: py - 8, width: w, height: 12 }));
        var t = s('text', { x: px, y: py + 1.5, 'text-anchor': 'middle' }); t.textContent = txt;
        lg.appendChild(t);
        lightsLayer.appendChild(lg);
      });
    });
    g.appendChild(lightsLayer);
    /* équipements */
    net.devices.forEach(function (d) {
      var ic = iconOf(d);
      var dg = s('g', { class: 'dev' });
      dg.dataset.dev = d.name;
      var img = s('image', { x: d.x - ic[1] / 2, y: d.y - ic[2] / 2, width: ic[1], height: ic[2] });
      img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', A + 'logical/' + ic[0]);
      img.setAttribute('href', A + 'logical/' + ic[0]);
      if (!d.power) img.setAttribute('opacity', '.45');
      dg.appendChild(img);
      var t1 = s('text', { x: d.x, y: d.y + ic[2] / 2 + 11, 'text-anchor': 'middle', class: 'pt-lbl' }); t1.textContent = modelLabel(d);
      var t2 = s('text', { x: d.x, y: d.y + ic[2] / 2 + 23, 'text-anchor': 'middle', class: 'pt-lbl' }); t2.textContent = d.name;
      dg.appendChild(t1); dg.appendChild(t2);
      g.appendChild(dg);
    });
    /* câble en cours */
    if (app.cable && app.cable.a) {
      var ad = net.dev(app.cable.a);
      var st2 = CABLE_STYLE[app.cable.kind === 'auto' ? 'straight' : app.cable.kind] || CABLE_STYLE.straight;
      app.cableLine = s('line', { x1: ad.x, y1: ad.y, x2: app.mouse ? app.mouse.x : ad.x, y2: app.mouse ? app.mouse.y : ad.y, stroke: st2.c, 'stroke-width': 2, 'stroke-dasharray': st2.dash || '' });
      app.cableLine.style.pointerEvents = 'none';
      g.appendChild(app.cableLine);
    }
    app.renderedVersion = net.version;
    if (app.animEnv) g.appendChild(app.animEnv);
  }

  /* ---------------------------------------------------------- */
  /* Événements de l'espace de travail                           */
  /* ---------------------------------------------------------- */
  function wsPoint(e) {
    var r = app.svg.getBoundingClientRect();
    return { x: (e.clientX - r.left) / app.zoom, y: (e.clientY - r.top) / app.zoom };
  }
  function devAt(e) { var g = e.target.closest && e.target.closest('.dev'); return g ? app.net.dev(g.dataset.dev) : null; }
  function wsEvents() {
    var ws = app.ws;
    var drag = null;
    ws.addEventListener('mousemove', function (e) {
      var p = wsPoint(e);
      app.mouse = p;
      app.xy.textContent = 'x: ' + Math.round(p.x) + ', y: ' + Math.round(p.y);
      if (drag) {
        var dx = p.x - drag.p.x, dy = p.y - drag.p.y;
        if (Math.abs(dx) + Math.abs(dy) > 3 / app.zoom) drag.moved = true;
        if (drag.moved) { drag.d.x = Math.round(drag.x0 + dx); drag.d.y = Math.round(drag.y0 + dy); render(); }
      }
      if (app.cableLine) { app.cableLine.setAttribute('x2', p.x); app.cableLine.setAttribute('y2', p.y); }
    });
    ws.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      closePortMenu();
      var d = devAt(e);
      var p = wsPoint(e);
      if (app.placeModel) { placeDevice(app.placeModel, p.x, p.y); return; }
      if (app.tool === 'select' && d) { drag = { d: d, p: p, x0: d.x, y0: d.y, moved: false }; e.preventDefault(); }
    });
    document.addEventListener('mouseup', function (e) {
      if (!app || !drag) return;
      var dd = drag; drag = null;
      if (dd.moved) { changed(); return; }
      openDevWin(dd.d);
    });
    ws.addEventListener('click', function (e) {
      var d = devAt(e);
      var lk = e.target.dataset && e.target.dataset.link;
      if (app.cable) { if (d) cableClick(d, e); return; }
      if (app.tool === 'delete') {
        if (d) { if (confirm('Supprimer ' + d.name + ' ?')) { var before = app.net.snapPorts(); app.net.removeDevice(d.name); app.net.diffPorts(before); closeWinsOf(d.name); render(); changed(); } return; }
        if (lk != null) { var l = app.net.links[+lk]; if (l) { app.net.disconnect(l); render(); changed(); } return; }
        var sh = e.target.dataset && e.target.dataset.shape; if (sh != null) { app.net.shapes.splice(+sh, 1); render(); changed(); return; }
        var nt = e.target.closest && e.target.closest('[data-note]'); if (nt) { app.net.notes.splice(+nt.dataset.note, 1); render(); changed(); }
        return;
      }
      if (app.tool === 'inspect' && d) { inspectMenu(d, e); return; }
      if (app.tool === 'pdu' && d) { pduClick(d); return; }
      if (app.tool === 'note') {
        var p = wsPoint(e); var t = prompt('Texte de la note :');
        if (t) { app.net.notes.push({ x: Math.round(p.x), y: Math.round(p.y), text: t }); render(); changed(); }
        setTool('select'); return;
      }
      if ((app.tool === 'rect' || app.tool === 'ellipse') && !d) {
        var p2 = wsPoint(e);
        app.net.shapes.push({ k: app.tool, x1: Math.round(p2.x - 80), y1: Math.round(p2.y - 50), x2: Math.round(p2.x + 80), y2: Math.round(p2.y + 50), rgb: [170, 255, 255], fill: false, line: '#000000' });
        render(); changed(); setTool('select');
      }
    });
    ws.addEventListener('dragover', function (e) { e.preventDefault(); });
    ws.addEventListener('drop', function (e) {
      e.preventDefault();
      var m = e.dataTransfer.getData('text/pt-model');
      if (m) { var p = wsPoint(e); placeDevice(m, p.x, p.y); }
    });
    ws.addEventListener('mousemove', function (e) {
      var d = devAt(e);
      if (!d || app.cable) { hideTip(); return; }
      showTip(d, e);
    });
    ws.addEventListener('mouseleave', hideTip);
  }
  function showTip(d, e) {
    if (!app.tipEl) { app.tipEl = h('div', 'pt-tip'); app.root.appendChild(app.tipEl); }
    var net = app.net, lines = [];
    if (d.host) {
      lines.push('Port            IP Address          IPv6 Address                  MAC Address');
      var v6 = net.hostV6(d);
      lines.push(pad('FastEthernet0', 16) + pad(d.host.ip != null ? N.int2ip(d.host.ip) + '/' + d.host.len : '<not set>', 20) + pad(v6.addrs[0] ? N.fmt6(v6.addrs[0].w, true) + '/' + v6.addrs[0].len : '<not set>', 30) + N.macPT(d.ifaces[0].mac));
      lines.push('', 'Gateway: ' + (d.host.gw != null ? N.int2ip(d.host.gw) : '<not set>'), 'DNS Server: ' + (d.host.dns != null ? N.int2ip(d.host.dns) : '<not set>'));
    } else {
      lines.push('Device Name: ' + d.name, 'Device Model: ' + d.model, 'Hostname: ' + d.hostname, '');
      lines.push('Port                     Link   IP Address');
      d.ifaces.forEach(function (i) {
        var st = net.ifStatus(d, i);
        lines.push(pad(i.name, 25) + pad(st.status === 'up' ? 'Up' : 'Down', 7) + (i.ip != null ? N.int2ip(i.ip) + '/' + i.len : '<not set>'));
      });
    }
    app.tipEl.textContent = lines.join('\n');
    var rr = app.root.getBoundingClientRect();
    app.tipEl.style.left = Math.min(e.clientX - rr.left + 16, rr.width - 420) + 'px';
    app.tipEl.style.top = (e.clientY - rr.top + 16) + 'px';
    app.tipEl.style.display = 'block';
  }
  function hideTip() { if (app && app.tipEl) app.tipEl.style.display = 'none'; }
  function pad(x, n) { x = String(x); return x.length >= n ? x + ' ' : x + new Array(n - x.length + 1).join(' '); }

  function setTool(t) {
    app.tool = t;
    app.placeModel = null;
    if (t !== 'cable') { app.cable = null; }
    Object.keys(app.toolBtns).forEach(function (k) { app.toolBtns[k].classList.toggle('on', k === t); });
    app.ws.className = 'pt-ws' + (t === 'delete' ? ' tool-delete' : t === 'pdu' ? ' tool-pdu' : '');
    app.pduSrc = null;
    render();
  }
  function onKey(e) {
    if (!app) return;
    var tag = (e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.classList.contains('pt-term');
    if (e.key === 'Escape' && !typing) { setTool('select'); closePortMenu(); markModels(); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); changed(true); flash('Progression enregistrée.'); }
  }
  function flash(t) { if (root.APP_TOAST) root.APP_TOAST(t); }

  /* ---------------------------------------------------------- */
  /* Fenêtres d'équipement                                        */
  /* ---------------------------------------------------------- */
  var ctxApi = {
    get net() { return app.net; }, get root() { return app.root; }, get wins() { return app.wins; }, set wins(v) { app.wins = v; },
    get lastTab() { return app.lastTab; }, get deskApp() { return app.deskApp; }, get browserUrl() { return app.browserUrl; },
    cliState: function (d) { return cliState(d); }, pcState: function (d) { return pcState(d); },
    changed: function () { changed(); if (app.renderedVersion !== app.net.version) render(); refreshWins(); },
    msg: msg,
    focusWin: function (w) { app.wins.forEach(function (x) { x.w.classList.toggle('focus', x === w); }); if (app.act) app.act.classList.remove('focus'); },
    rename: function (d, n) {
      if (!n || n === d.name) return false;
      var old = d.name;
      if (!app.net.renameDevice(old, n)) { msg('Ce nom est déjà utilisé.'); return false; }
      [app.cli, app.pc, app.lastTab, app.deskApp, app.browserUrl].forEach(function (m) { if (m[old]) { m[n] = m[old]; delete m[old]; } });
      render(); changed(); return true;
    },
    togglePower: function (d) {
      var before = app.net.snapPorts();
      d.power = !d.power;
      if (!d.power) { d.arp = {}; d.macTable = {}; }
      else if (d.cat === 'router' || d.cat === 'switch' || d.cat === 'l3switch') {
        /* redémarrage : la running-config est perdue, on recharge la startup-config */
        root.IOS.reloadDevice(app.net, d);
        var cs = app.cli[d.name];
        if (cs) { cs.booted = false; cs.started = false; cs.buffer.length = 0; cs.session = new root.IOS.Session(app.net, d); if (cs.term) cs.term.o.session = cs.session; }
      }
      app.net.touch(); app.net.diffPorts(before);
      render(); changed();
    }
  };
  function openDevWin(d) {
    var ex = app.wins.filter(function (w) { return w.dev === d; })[0];
    if (ex) { ex.w.style.display = ''; ctxApi.focusWin(ex); return; }
    var w = new root.PTDevWin(ctxApi, d);
    app.wins.push(w);
  }
  function closeWinsOf(name) { app.wins.slice().forEach(function (w) { if (w.dev.name === name) w.close(); }); }
  function refreshWins() {
    app.wins.forEach(function (w) { if (w.tab === 'Config' && w.eqRefresh) w.eqRefresh(); });
  }

  /* ---------------------------------------------------------- */
  /* Palette du bas                                               */
  /* ---------------------------------------------------------- */
  function buildBottom(b) {
    b.innerHTML = '<div class="pt-devbox"><div class="pt-cats"><div class="row top"></div><div class="pt-search"><img src="' + A + 'box/search.svg" style="width:14px"><input placeholder="Search for device"></div><div class="row sub"></div></div>' +
      '<div class="pt-models"><div class="pt-modlist"></div><div class="pt-modcap">(Select a Device to Drag and Drop to the Workspace)</div></div></div>' +
      '<div class="pt-scen"><div class="sc1"><span class="i">i</span><select><option>Scenario 0</option></select></div><div class="sc2"><button class="pt-navybtn">New</button><button class="pt-navybtn">Delete</button></div><button class="pt-navybtn">Toggle PDU List Window</button></div>' +
      '<div class="pt-pdus"></div>';
    app.catTop = b.querySelector('.row.top'); app.catSub = b.querySelector('.row.sub');
    app.modList = b.querySelector('.pt-modlist'); app.modCap = b.querySelector('.pt-modcap');
    app.pduBox = b.querySelector('.pt-pdus');
    var srch = b.querySelector('.pt-search input');
    srch.oninput = function () { drawModels(srch.value.trim().toLowerCase()); };
    var sb = b.querySelectorAll('.pt-scen .pt-navybtn');
    sb[1].onclick = function () { app.pdus = []; drawPdus(); };
    sb[2].onclick = function () { app.pduBox.style.display = app.pduBox.style.display === 'none' ? '' : 'none'; };
    drawCats(); drawPdus();
  }
  function drawCats() {
    app.catTop.innerHTML = '';
    CATS.forEach(function (c) {
      var e = h('span', 'cat' + (c.k === app.cat ? ' on' : ''), '<img src="' + A + 'box/' + c.i + (c.k === app.cat ? '_on' : '') + '.png">');
      e.title = c.t;
      e.onclick = function () { app.cat = c.k; app.sub = c.subs[0].k; drawCats(); };
      app.catTop.appendChild(e);
    });
    var cat = CATS.filter(function (c) { return c.k === app.cat; })[0];
    app.catSub.innerHTML = '';
    cat.subs.forEach(function (sb) {
      var e = h('span', 'cat' + (sb.k === app.sub ? ' on' : ''), '<img src="' + A + 'box/' + sb.i + (sb.k === app.sub ? '_on' : '') + '.png">');
      e.title = sb.t;
      e.onclick = function () { app.sub = sb.k; drawCats(); };
      app.catSub.appendChild(e);
    });
    drawModels('');
  }
  function drawModels(filter) {
    var list = [];
    if (filter) CATS.forEach(function (c) { c.subs.forEach(function (sb) { sb.m.forEach(function (m) { if (m[0].toLowerCase().indexOf(filter) >= 0) list.push(m); }); }); });
    else { var cat = CATS.filter(function (c) { return c.k === app.cat; })[0]; list = cat.subs.filter(function (x) { return x.k === app.sub; })[0].m; }
    app.modList.innerHTML = '';
    list.forEach(function (m) {
      var e = h('div', 'pt-mod', '<img src="' + A + 'box/' + m[1] + '"><span>' + esc(m[0]) + '</span>');
      e.title = m[0];
      e.draggable = !!m[2] && app.cat !== 'con';
      e.addEventListener('dragstart', function (ev) { if (m[2]) ev.dataTransfer.setData('text/pt-model', m[2]); });
      e.onmouseenter = function () { app.modCap.textContent = m[0]; };
      e.onmouseleave = function () { app.modCap.textContent = app.cable ? cableName(app.cable.kind) : '(Select a Device to Drag and Drop to the Workspace)'; };
      e.onclick = function () {
        if (!m[2]) { flash('« ' + m[0] + ' » n’est pas utilisé dans ce cours (simulateur d’entraînement).'); return; }
        var isCable = ['auto', 'console', 'straight', 'cross', 'fiber', 'serial'].indexOf(m[2]) >= 0;
        setTool('select');
        if (isCable) { app.tool = 'cable'; app.cable = { kind: m[2] }; app.ws.className = 'pt-ws tool-cable'; }
        else { app.placeModel = m[2]; app.ws.className = 'pt-ws tool-cable'; }
        markModels(e);
      };
      app.modList.appendChild(e);
    });
  }
  function markModels(sel) { if (!app) return; app.modList.querySelectorAll('.pt-mod').forEach(function (x) { x.classList.toggle('on', x === sel); }); }
  function cableName(k) { return { auto: 'Automatically Choose Connection Type', console: 'Console', straight: 'Copper Straight-Through', cross: 'Copper Cross-Over', fiber: 'Fiber', serial: 'Serial DCE' }[k] || ''; }
  function placeDevice(model, x, y) {
    var d = app.net.addDevice(model, Math.round(x), Math.round(y));
    app.placeModel = null; markModels(); app.ws.className = 'pt-ws';
    render(); changed();
    return d;
  }

  /* ---------------------------------------------------------- */
  /* Câblage                                                      */
  /* ---------------------------------------------------------- */
  function portMenu(d, e, cb) {
    closePortMenu();
    var net = app.net, kind = app.cable.kind;
    var m = h('div', 'pt-portmenu');
    var ports = d.ifaces.filter(function (i) { return !i.parent && !/^(Vlan|Loopback)/.test(i.name) && !net.linkOf(d.name, i.name); });
    var compat = ports.filter(function (i) {
      if (kind === 'console') return false;
      if (kind === 'serial') return i.kind === 'serial';
      if (kind === 'fiber') return i.kind === 'fiber';
      if (kind === 'auto') return true;
      return i.kind === 'copper';
    });
    if (kind === 'console') m.appendChild(h('div', null, d.cat === 'pc' ? 'RS 232' : 'Console'));
    compat.forEach(function (i) {
      var it = h('div', null, i.name);
      it.onclick = function (ev) { ev.stopPropagation(); closePortMenu(); cb(i.name); };
      m.appendChild(it);
    });
    if (!compat.length && kind !== 'console') m.appendChild(h('div', 'dis', '(aucun port libre compatible)'));
    if (kind === 'console') m.firstChild.onclick = function (ev) { ev.stopPropagation(); closePortMenu(); cb(null); };
    var rr = app.root.getBoundingClientRect();
    m.style.left = (e.clientX - rr.left + 4) + 'px';
    m.style.top = Math.min(e.clientY - rr.top + 4, rr.height - 30 - Math.min(compat.length, 30) * 20) + 'px';
    m.style.maxHeight = '60vh'; m.style.overflowY = 'auto';
    app.root.appendChild(m);
    app.portMenu = m;
  }
  function closePortMenu() { if (app && app.portMenu) { app.portMenu.remove(); app.portMenu = null; } }
  function cableClick(d, e) {
    var c = app.cable, net = app.net;
    if (c.kind === 'auto') {
      if (app.opts.q && app.opts.q.noAutoCable) { flash('Dans ce labo, c’est à toi de choisir le type de câble : pas de connexion automatique !'); endCable(); return; }
      if (!c.a) { c.a = d.name; render(); return; }
      if (c.a === d.name) return;
      var a = net.dev(c.a);
      var pa = a.ifaces.filter(function (i) { return !i.parent && i.kind === 'copper' && !/^(Vlan|Loopback)/.test(i.name) && !net.linkOf(a.name, i.name); })[0];
      var pb = d.ifaces.filter(function (i) { return !i.parent && i.kind === 'copper' && !/^(Vlan|Loopback)/.test(i.name) && !net.linkOf(d.name, i.name); })[0];
      if (!pa || !pb) { flash('Plus de port libre compatible.'); endCable(); return; }
      finishLink(a.name, pa.name, d.name, pb.name, net.expectedCable(a, pa.name, d, pb.name));
      return;
    }
    portMenu(d, e, function (port) {
      if (c.kind === 'console') { flash('Le câble console relie un PC (RS 232) au port Console : utilise plutôt l’onglet CLI de l’équipement.'); endCable(); return; }
      if (!c.a) { c.a = d.name; c.ap = port; render(); return; }
      if (c.a === d.name) { flash('Choisis un autre équipement.'); return; }
      finishLink(c.a, c.ap, d.name, port, c.kind);
    });
  }
  function finishLink(a, ap, b, bp, kind) {
    var net = app.net;
    var before = net.snapPorts();
    var l = net.connect(a, ap, b, bp, kind, true);
    net.diffPorts(before);
    endCable();
    render(); changed();
    if (l && !net.cableOk(l) && !(app.opts.q && app.opts.q.noAutoCable)) flash('Attention : les voyants restent rouges — ce type de câble ne convient pas entre ces deux équipements.');
    setTimeout(function () { if (app) render(); }, 2600);
  }
  function endCable() { app.cable = null; app.tool = 'select'; app.ws.className = 'pt-ws'; markModels(); app.modCap.textContent = '(Select a Device to Drag and Drop to the Workspace)'; }

  /* ---------------------------------------------------------- */
  /* Inspect                                                      */
  /* ---------------------------------------------------------- */
  function inspectMenu(d, e) {
    closePortMenu();
    var m = h('div', 'pt-portmenu');
    var items = [['ARP Table', 'arp']];
    if (d.cat === 'router' || d.cat === 'l3switch') items.push(['Routing Table', 'rt'], ['NAT Table', 'nat']);
    if (d.cat === 'switch' || d.cat === 'l3switch') items.push(['MAC Table', 'mac']);
    items.forEach(function (it) {
      var x = h('div', null, it[0]);
      x.onclick = function () { closePortMenu(); inspectWin(d, it); };
      m.appendChild(x);
    });
    var rr = app.root.getBoundingClientRect();
    m.style.left = (e.clientX - rr.left + 4) + 'px'; m.style.top = (e.clientY - rr.top + 4) + 'px';
    app.root.appendChild(m); app.portMenu = m;
  }
  function inspectWin(d, it) {
    var w = h('div', 'pt-win');
    w.style.cssText = 'left:120px;top:120px;width:560px;height:300px;z-index:26';
    w.innerHTML = '<div class="wt"><img src="' + A + 'misc/app.png"><span class="t">' + it[0] + ' for ' + esc(d.name) + '</span><span class="cap"><span class="x">✕</span></span></div><div class="wb"><div class="pt-list" style="flex:1;margin-top:6px"></div></div>';
    app.root.appendChild(w);
    w.querySelector('.x').onclick = function () { w.remove(); };
    var list = w.querySelector('.pt-list');
    var net = app.net, rows = [], head = [];
    if (it[1] === 'arp') {
      head = ['IP Address', 'Hardware Address', 'Interface'];
      Object.keys(d.arp).forEach(function (k) { rows.push([k, N.macPT(d.arp[k].mac), d.arp[k].iface]); });
    } else if (it[1] === 'rt') {
      head = ['Type', 'Network', 'Port', 'Next Hop IP', 'Metric'];
      net.routeTable(d).forEach(function (r) { if (r.code !== 'L') rows.push([r.code, N.int2ip(r.net) + '/' + r.len, r.iface || '---', r.nh != null ? N.int2ip(r.nh) : '---', r.ad + '/' + r.metric]); });
    } else if (it[1] === 'mac') {
      head = ['VLAN', 'Mac Address', 'Port'];
      Object.keys(d.macTable).forEach(function (k) { var e = d.macTable[k]; rows.push([e.vlan, N.macPT(e.mac), e.port]); });
    } else {
      head = ['Protocol', 'Inside Global', 'Inside Local', 'Outside Local', 'Outside Global'];
      d.natTable.forEach(function (e) { rows.push([e.proto, e.ig, e.il, e.og, e.og]); });
    }
    list.innerHTML = '<table><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
    setTool('select');
  }

  /* ---------------------------------------------------------- */
  /* PDU (ping simple)                                            */
  /* ---------------------------------------------------------- */
  var COLORS = ['#48a9b5', '#4b9fd0', '#a8dcdf', '#9a36c9', '#f06c8c', '#6cc04a', '#e3a21a', '#d64541'];
  function pduClick(d) {
    if (!app.pduSrc) { app.pduSrc = d.name; flash('Source : ' + d.name + ' — clique maintenant sur la destination.'); return; }
    var src = app.net.dev(app.pduSrc), dst = d;
    app.pduSrc = null;
    var dip = app.net.firstIP(dst);
    if (src.host && src.host.ip == null) { flash(src.name + ' n’a pas d’adresse IP.'); setTool('select'); return; }
    if (dip == null) { flash(dst.name + ' n’a pas d’adresse IP.'); setTool('select'); return; }
    var p = { src: src.name, dst: dst.name, ip: dip, status: '--', color: COLORS[app.pdus.length % COLORS.length], num: app.pdus.length, t: 0 };
    app.pdus.push(p);
    drawPdus();
    setTool('select');
    if (app.mode === 'realtime') firePdu(p); else simQueue(p);
  }
  function firePdu(p) {
    p.status = 'In Progress'; drawPdus();
    setTimeout(function () {
      if (!app) return;
      var src = app.net.dev(p.src);
      if (!src) { p.status = 'Failed'; drawPdus(); return; }
      var r = app.net.ping(src, p.ip, 1, { noArpLoss: true });
      p.status = r[0].status === 'ok' ? 'Successful' : 'Failed';
      p.t = ((Date.now() - app.t0) / 1000).toFixed(3);
      drawPdus(); changed();
    }, 700);
  }
  function drawPdus() {
    if (!app) return;
    var rows = app.pdus.map(function (p, i) {
      return '<tr><td class="fire"><span data-f="' + i + '" title="Fire"></span></td><td class="' + (p.status === 'Successful' ? 'st-ok' : p.status === 'Failed' ? 'st-ko' : '') + '">' + p.status + '</td><td>' + esc(p.src) + '</td><td>' + esc(p.dst) + '</td><td>ICMP</td><td><span class="col" style="background:' + p.color + '"></span></td><td>' + (p.t || '0.000') + '</td><td>N</td><td>' + p.num + '</td><td class="lnk">(edit)</td><td class="lnk" data-d="' + i + '">(delete)</td></tr>';
    }).join('');
    app.pduBox.innerHTML = '<table><tr><th>Fire</th><th>Last Status</th><th>Source</th><th>Destination</th><th>Type</th><th>Color</th><th>Time(sec)</th><th>Periodic</th><th>Num</th><th>Edit</th><th>Delete</th></tr>' + rows + '</table>';
    app.pduBox.querySelectorAll('[data-f]').forEach(function (e) { e.onclick = function () { var p = app.pdus[+e.dataset.f]; if (app.mode === 'realtime') firePdu(p); else simQueue(p); }; });
    app.pduBox.querySelectorAll('[data-d]').forEach(function (e) { e.onclick = function () { app.pdus.splice(+e.dataset.d, 1); drawPdus(); }; });
  }

  /* ---------------------------------------------------------- */
  /* Mode simulation                                              */
  /* ---------------------------------------------------------- */
  function buildSimPanel(p) {
    p.innerHTML = '<div class="sp-title"><span>Simulation Panel</span><span>✕</span></div><div class="sp-sub">Event List</div><div class="pt-evlist"><table><thead><tr><th>Vis.</th><th>Time(sec)</th><th>Last Device</th><th>At Device</th><th>Type</th></tr></thead><tbody></tbody></table></div>' +
      '<div class="pt-simctl"><div class="r1"><button class="pt-navybtn" data-b="reset">Reset Simulation</button><label><input type="checkbox" checked> Constant Delay</label></div><div style="text-align:right;font-size:11px">Captured to:<br><b class="cap">0.000 s</b></div>' +
      '<div>Play Controls</div><div class="pt-play"><span data-b="back"><img src="' + A + 'sim/step-backward.svg"></span><span data-b="play"><img src="' + A + 'sim/play.svg"></span><span data-b="fwd"><img src="' + A + 'sim/step-forward.svg"></span></div></div>' +
      '<div class="pt-filters"><b>Event List Filters - Visible Events</b><br>ACL Filter, ARP, BGP, Bluetooth, CAPWAP, CDP, DHCP, DHCPv6, DNS, DTP, EAPOL, EIGRP, EIGRPv6, FTP, H.323, HSRP, HSRPv6, HTTP, HTTPS, ICMP, ICMPv6, IPSec, ISAKMP, LACP, LLDP, NDP, NETFLOW, NTP, OSPF, OSPFv6, PAgP, POP3, PPP, PPPoED, RADIUS, RIP, RIPng, RTP, SCCP, SMTP, SNMP, SSH, STP, SYSLOG, TACACS, TCP, TFTP, Telnet, UDP, USB, VTP<div class="fb"><button class="pt-navybtn">Edit Filters</button><button class="pt-navybtn">Show All/None</button></div></div>';
    app.evBody = p.querySelector('tbody');
    app.evCap = p.querySelector('.cap');
    p.querySelector('[data-b=reset]').onclick = simReset;
    p.querySelector('[data-b=play]').onclick = simPlay;
    p.querySelector('[data-b=fwd]').onclick = simStep;
    p.querySelector('.sp-title span:last-child').onclick = function () { setMode('realtime'); };
  }
  function setMode(m) {
    app.mode = m;
    var r = app.root;
    r.querySelectorAll('.pt-mode[data-m]').forEach(function (x) { x.classList.toggle('on', x.dataset.m === m); });
    r.querySelector('.pt-simpanel').classList.toggle('on', m === 'simulation');
    r.querySelector('.simctl').style.display = m === 'simulation' ? 'inline-flex' : 'none';
    r.querySelector('.evl').style.display = m === 'simulation' ? 'inline-flex' : 'none';
    simReset();
    setTimeout(function () { if (app) render(); }, 30);
  }
  function simReset() { app.sim = { steps: [], i: 0, playing: false }; app.simT = 0; if (app.evBody) app.evBody.innerHTML = ''; if (app.evCap) app.evCap.textContent = '0.000 s'; app.animEnv = null; render(); }
  function simQueue(p) {
    var net = app.net, src = net.dev(p.src);
    var st = {};
    var pkt = { src: src.host ? src.host.ip : null, dst: p.ip, proto: 'icmp', id: 900 + p.num, ttl: 128 };
    var f = net.forward(src, pkt, st);
    var steps = [];
    function addPath(hops, type) {
      for (var i = 0; i < hops.length; i++) steps.push({ last: i ? hops[i - 1] : '--', at: hops[i], type: type, color: p.color });
    }
    addPath(f.hops, 'ICMP');
    if (f.status === 'ok') {
      var rep = { src: pkt.dst, dst: pkt.src, proto: 'icmp', id: pkt.id, ttl: 128 };
      var r = net.forward(f.dev, rep, {});
      addPath(r.hops.slice(1).length ? [f.dev.name].concat(r.hops.slice(1)) : [], 'ICMP');
      p.pendingStatus = r.status === 'ok' ? 'Successful' : 'Failed';
    } else p.pendingStatus = 'Failed';
    app.sim.steps = app.sim.steps.concat(steps);
    app.sim.pdu = p;
    p.status = 'In Progress'; drawPdus();
    flash('PDU ajouté : clique sur ▶ (Play) ou ▶| (Capture/Forward) pour suivre le paquet.');
  }
  function simStep() {
    if (!app.sim || app.sim.i >= app.sim.steps.length) { finishSim(); return; }
    var stp = app.sim.steps[app.sim.i++];
    app.simT += 0.001 + Math.random() * 0.002;
    var tr = h('tr', null, '<td><span class="sq" style="background:' + stp.color + '"></span></td><td>' + app.simT.toFixed(3) + '</td><td>' + esc(stp.last) + '</td><td>' + esc(stp.at) + '</td><td>' + stp.type + '</td>');
    app.evBody.querySelectorAll('tr').forEach(function (x) { x.classList.remove('cur'); });
    tr.classList.add('cur');
    app.evBody.appendChild(tr);
    app.evCap.textContent = app.simT.toFixed(3) + ' s';
    animate(stp);
    if (app.sim.i >= app.sim.steps.length) setTimeout(finishSim, 700);
  }
  function animate(stp) {
    var net = app.net, from = net.dev(stp.last), to = net.dev(stp.at);
    if (!to) return;
    var env = s('g', { class: 'pt-env' });
    var img = s('image', { width: 22, height: 16 });
    img.setAttribute('href', A + 'sim/gPacketSolid.png');
    var rect = s('rect', { width: 22, height: 16, rx: 2, fill: stp.color, opacity: .85 });
    env.appendChild(rect); env.appendChild(img);
    app.animEnv = env;
    app.g.appendChild(env);
    var x0 = from ? from.x : to.x, y0 = from ? from.y : to.y, t0 = performance.now();
    (function fr(now) {
      if (!app || app.animEnv !== env) return;
      var k = Math.min(1, (now - t0) / 500);
      var x = x0 + (to.x - x0) * k - 11, y = y0 + (to.y - y0) * k - 30;
      env.setAttribute('transform', 'translate(' + x + ',' + y + ')');
      if (k < 1) requestAnimationFrame(fr);
    })(t0);
  }
  function simPlay() {
    if (!app.sim || app.sim.playing) return;
    app.sim.playing = true;
    (function loop() {
      if (!app || !app.sim.playing) return;
      if (app.sim.i >= app.sim.steps.length) { app.sim.playing = false; finishSim(); return; }
      simStep();
      setTimeout(loop, 650);
    })();
  }
  function finishSim() {
    if (!app || !app.sim || !app.sim.pdu) return;
    var p = app.sim.pdu;
    p.status = p.pendingStatus || 'Failed';
    p.t = app.simT.toFixed(3);
    app.sim.pdu = null;
    drawPdus();
  }

  /* ---------------------------------------------------------- */
  /* Horloge, messages asynchrones, rafraîchissement              */
  /* ---------------------------------------------------------- */
  function hms(ms) { var t = Math.floor(ms / 1000); function z(n) { return ('0' + n).slice(-2); } return z(Math.floor(t / 3600)) + ':' + z(Math.floor(t / 60) % 60) + ':' + z(t % 60); }
  function tick() {
    if (!app) return;
    var el = Date.now() - app.t0;
    app.tm.textContent = 'Time: ' + hms(el);
    app.clock.textContent = hms(el + 8 * 3600000);
    var net = app.net;
    if (net.events.length) {
      var evs = net.events.splice(0, net.events.length);
      evs.forEach(function (ev) {
        var d = net.dev(ev.dev);
        if (!d) return;
        var cs = app.cli[ev.dev];
        if (!cs || !cs.booted) return;
        var deliver = function () {
          if (!app) return;
          if (cs.term && cs.term.el.isConnected) cs.term.notify(ev.text);
          else cs.buffer.push(ev.text);
          refreshWins();
        };
        if (ev.delay) setTimeout(deliver, 900); else deliver();
      });
    }
    if (app.renderedVersion !== net.version || app.links_young) render();
    app.links_young = net.links.some(function (l) { return l.since && Date.now() - l.since < 3000; });
  }

  /* ---------------------------------------------------------- */
  /* Fenêtre d'activité (consignes + vérification)               */
  /* ---------------------------------------------------------- */
  function openActivity() {
    var q = app.opts.q;
    if (!q) return;
    if (app.act) { app.act.style.display = ''; app.act.classList.add('focus'); return; }
    var w = h('div', 'pt-win pt-act');
    var r = app.root.getBoundingClientRect();
    w.style.cssText = 'right:14px;top:90px;width:' + Math.min(430, r.width * 0.34) + 'px;height:' + Math.min(560, r.height - 240) + 'px;z-index:22';
    w.innerHTML = '<div class="wt"><img src="' + A + 'misc/app.png"><span class="t">Instructions — ' + esc(q.file || 'Activité') + '</span><span class="cap"><span class="mn">—</span><span class="x">✕</span></span></div>' +
      '<div class="wb"><div class="acont"></div><div class="abar"><button class="pt-btn" data-b="check">Check Results</button><button class="pt-btn" data-b="hint">💡 Indice</button><button class="pt-btn" data-b="reset">Reset Activity</button><span class="grow"></span><span class="comp">Completion: <b>0%</b></span></div></div><div class="resize"></div>';
    app.root.appendChild(w);
    app.act = w;
    w.querySelector('.x').onclick = w.querySelector('.mn').onclick = function () { w.style.display = 'none'; };
    /* déplacement */
    var bar = w.querySelector('.wt');
    bar.addEventListener('mousedown', function (e) {
      if (e.target.closest('.cap')) return;
      var sx = e.clientX, sy = e.clientY, l0 = w.offsetLeft, t0 = w.offsetTop;
      w.style.right = 'auto'; w.style.left = l0 + 'px';
      function mv(ev) { w.style.left = (l0 + ev.clientX - sx) + 'px'; w.style.top = Math.max(0, t0 + ev.clientY - sy) + 'px'; }
      function up() { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); }
      document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
    });
    var rz = w.querySelector('.resize');
    rz.addEventListener('mousedown', function (e) {
      e.preventDefault();
      var sx = e.clientX, sy = e.clientY, w0 = w.offsetWidth, h0 = w.offsetHeight;
      function mv(ev) { w.style.width = Math.max(300, w0 + ev.clientX - sx) + 'px'; w.style.height = Math.max(200, h0 + ev.clientY - sy) + 'px'; }
      function up() { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); }
      document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
    });
    w.addEventListener('mousedown', function () { app.wins.forEach(function (x) { x.w.classList.remove('focus'); }); w.classList.add('focus'); });
    w.querySelector('[data-b=check]').onclick = function () {
      var res = app.opts.onCheck();
      refreshActivity(res);
      var n = res.filter(Boolean).length;
      if (n === res.length) {
        if (app.opts.onValidate) app.opts.onValidate();
        setTimeout(function () { msg('Félicitations ! Toutes les tâches sont réussies (100%).\n\nLa question est validée dans le cours.'); }, 50);
      }
    };
    w.querySelector('[data-b=hint]').onclick = function () {
      var hs = app.opts.hints || [];
      app.hintShown = Math.min(hs.length, (app.hintShown || 0) + 1);
      refreshActivity(app.lastRes);
      if (!hs.length) flash('Pas d’indice pour ce labo.');
    };
    w.querySelector('[data-b=reset]').onclick = function () {
      if (!confirm('Reset Activity : remettre le labo dans son état de départ ? (tes configurations seront perdues)')) return;
      app.opts.onReset();
    };
    refreshActivity(null);
  }
  function refreshActivity(res) {
    var w = app.act, q = app.opts.q;
    if (!w) return;
    app.lastRes = res;
    var hs = app.opts.hints || [];
    var shown = Math.max(app.hintShown || 0, app.opts.hintIdx ? app.opts.hintIdx() : 0);
    var html = '<h4>' + esc(q.titre || 'Activité') + '</h4><div>' + q.q + '</div><h4>Objectifs (Assessment Items)</h4><ul>';
    q.tasks.forEach(function (t, i) {
      var st = res ? res[i] : null;
      html += '<li class="' + (st === true ? 'ok' : st === false ? 'ko' : '') + '">' + (st === true ? '✔ ' : st === false ? '✘ ' : '○ ') + t.label + '</li>';
    });
    html += '</ul>';
    for (var i = 0; i < Math.min(shown, hs.length); i++) html += '<div class="hint">💡 <b>Indice ' + (i + 1) + ' :</b> ' + hs[i] + '</div>';
    w.querySelector('.acont').innerHTML = html;
    var n = res ? res.filter(Boolean).length : 0;
    w.querySelector('.comp b').textContent = (res ? Math.round(100 * n / res.length) : 0) + '%';
  }

  root.PTUI = PTUI;
})(window);
