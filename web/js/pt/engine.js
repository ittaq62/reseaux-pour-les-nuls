/* ============================================================
   Simulateur réseau façon Packet Tracer — moteur
   Modèle : équipements, interfaces, câbles ; commutation (VLAN,
   trunk 802.1Q, STP), routage (connecté, statique, RIP, OSPF),
   ARP, DHCP (+ relais), DNS, HTTP, NAT/PAT, HSRP, IPv6 (SLAAC).
   Tout l'état persistant est en objets/tableaux simples (JSON).
   ============================================================ */
(function (root) {
  'use strict';
  var N = root.NET || (typeof require !== 'undefined' ? require('../netutil.js') : null);

  /* ---------------------------------------------------------- */
  /* Catalogue des modèles                                       */
  /* ---------------------------------------------------------- */
  function range(prefix, a, b) { var r = []; for (var i = a; i <= b; i++) r.push(prefix + i); return r; }
  var MODELS = {
    '1941': { cat: 'router', ios: 15, ifs: ['GigabitEthernet0/0', 'GigabitEthernet0/1'], label: '1941' },
    '2901': { cat: 'router', ios: 15, ifs: ['GigabitEthernet0/0', 'GigabitEthernet0/1'], label: '2901' },
    '2911': { cat: 'router', ios: 15, ifs: ['GigabitEthernet0/0', 'GigabitEthernet0/1', 'GigabitEthernet0/2'], label: '2911' },
    'ISR4321': { cat: 'router', ios: 16, ifs: ['GigabitEthernet0/0/0', 'GigabitEthernet0/0/1'], label: '4321' },
    'ISR4331': { cat: 'router', ios: 16, ifs: ['GigabitEthernet0/0/0', 'GigabitEthernet0/0/1', 'GigabitEthernet0/0/2'], label: '4331' },
    'PT8200': { cat: 'router', ios: 17, ifs: range('GigabitEthernet0/0/', 0, 3), label: 'PT8200' },
    '1841': { cat: 'router', ios: 12, ifs: ['FastEthernet0/0', 'FastEthernet0/1'], label: '1841' },
    '2811': { cat: 'router', ios: 12, ifs: ['FastEthernet0/0', 'FastEthernet0/1'], label: '2811' },
    'Router-PT': { cat: 'router', ios: 12, ifs: ['FastEthernet0/0', 'FastEthernet1/0', 'Serial2/0', 'Serial3/0', 'FastEthernet4/0', 'FastEthernet5/0'], label: 'Router-PT' },
    'Router-PT-Empty': { cat: 'router', ios: 12, ifs: [], label: 'Router-PT' },
    '2960-24TT': { cat: 'switch', ifs: range('FastEthernet0/', 1, 24).concat(['GigabitEthernet0/1', 'GigabitEthernet0/2']), label: '2960-24TT' },
    '2950-24': { cat: 'switch', ifs: range('FastEthernet0/', 1, 24), label: '2950-24' },
    '2950T-24': { cat: 'switch', ifs: range('FastEthernet0/', 1, 24).concat(['GigabitEthernet0/1', 'GigabitEthernet0/2']), label: '2950T-24' },
    'Switch-PT': { cat: 'switch', ifs: range('FastEthernet', 0, 5).map(function (n, i) { return 'FastEthernet' + i + '/1'; }), label: 'Switch-PT' },
    'Switch-PT-Empty': { cat: 'switch', ifs: [], label: 'Switch-PT' },
    '3650-24PS': { cat: 'l3switch', ifs: range('GigabitEthernet1/0/', 1, 24).concat(range('GigabitEthernet1/1/', 1, 4)), label: '3650-24PS' },
    '3560-24PS': { cat: 'l3switch', ifs: range('FastEthernet0/', 1, 24).concat(['GigabitEthernet0/1', 'GigabitEthernet0/2']), label: '3560-24PS' },
    'Hub-PT': { cat: 'hub', ifs: range('Port', 0, 5), label: 'Hub-PT' },
    'PC-PT': { cat: 'pc', ifs: ['FastEthernet0'], label: 'PC-PT' },
    'Laptop-PT': { cat: 'pc', ifs: ['FastEthernet0'], label: 'Laptop-PT' },
    'Server-PT': { cat: 'server', ifs: ['FastEthernet0'], label: 'Server-PT' }
  };
  function modelInfo(model) {
    if (MODELS[model]) return MODELS[model];
    if (/^PT8200/.test(model)) return MODELS.PT8200;
    return { cat: 'router', ios: 15, ifs: [], label: model };
  }
  var TYPE2CAT = { Router: 'router', Switch: 'switch', MultiLayerSwitch: 'l3switch', Pc: 'pc', Laptop: 'pc', Server: 'server', Hub: 'hub' };

  /* ---------------------------------------------------------- */
  /* Noms d'interfaces                                            */
  /* ---------------------------------------------------------- */
  var IFTYPES = ['FastEthernet', 'GigabitEthernet', 'Ethernet', 'Serial', 'Vlan', 'Loopback', 'Port-channel', 'Port'];
  function splitIf(name) {
    var m = /^([A-Za-z-]+)\s*([\d/.:]+)$/.exec(String(name).trim());
    return m ? { type: m[1], num: m[2] } : null;
  }
  /* "g0/0", "Gig 0/0", "gigabitethernet0/0.10" -> nom canonique (ou null) */
  function canonIfType(t) {
    t = t.toLowerCase();
    var hits = IFTYPES.filter(function (x) { return x.toLowerCase().indexOf(t) === 0; });
    if (hits.length === 1) return hits[0];
    /* "port" est ambigu avec "port-channel" : exact */
    var exact = IFTYPES.filter(function (x) { return x.toLowerCase() === t; });
    if (exact.length) return exact[0];
    /* abréviations Cisco usuelles */
    var ab = { f: 'FastEthernet', fa: 'FastEthernet', g: 'GigabitEthernet', gi: 'GigabitEthernet', gig: 'GigabitEthernet', e: 'Ethernet', s: 'Serial', se: 'Serial', v: 'Vlan', vl: 'Vlan', l: 'Loopback', lo: 'Loopback' };
    return ab[t] || null;
  }
  function canonIf(s) {
    var p = splitIf(s);
    if (!p) return null;
    var t = canonIfType(p.type);
    return t ? t + p.num : null;
  }
  function shortIf(name) {
    var p = splitIf(name);
    if (!p) return name;
    var ab = { FastEthernet: 'Fa', GigabitEthernet: 'Gig', Ethernet: 'Eth', Serial: 'Se', Vlan: 'Vlan', Loopback: 'Lo', Port: 'Port' };
    return (ab[p.type] || p.type) + p.num;
  }
  function kindOfIf(name) {
    if (/^Serial/.test(name)) return 'serial';
    return 'copper';
  }
  function speedOf(name) {
    if (/^Gigabit/.test(name)) return 1000;
    if (/^FastEthernet|^Port/.test(name)) return 100;
    if (/^Ethernet/.test(name)) return 10;
    if (/^Serial/.test(name)) return 1.544;
    return 100;
  }

  /* MAC déterministe */
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function genMac(seed) {
    var h1 = hashStr(seed), h2 = hashStr(seed + '#');
    var b = [0x00, (h1 >>> 24) & 0xfe, (h1 >>> 16) & 255, (h1 >>> 8) & 255, h1 & 255, h2 & 255];
    var ouis = [[0x00, 0x01], [0x00, 0x0d], [0x00, 0x60], [0x00, 0xe0], [0x00, 0xd0], [0x00, 0x90], [0x00, 0x02], [0x00, 0x0a]];
    var o = ouis[h2 % ouis.length];
    b[0] = o[0]; b[1] = o[1];
    var hx = b.map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join('').toUpperCase();
    return hx.slice(0, 4) + '.' + hx.slice(4, 8) + '.' + hx.slice(8, 12);
  }

  /* ---------------------------------------------------------- */
  /* Fabrique d'objets                                           */
  /* ---------------------------------------------------------- */
  function newIface(dev, name, mac) {
    var cat = dev.cat;
    var ifc = {
      name: name, mac: mac || genMac(dev.name + '/' + name), kind: kindOfIf(name),
      shutdown: cat === 'router' || /^Vlan/.test(name),
      desc: '', ip: null, len: null, sec: [], helper: [], natIn: false, natOut: false,
      standby: {}, v6: { enabled: false, ll: null, addrs: [], dhcp: null, ndO: false, ndM: false },
      sw: null, encap: null, parent: null, clock: null, bw: null, speed: 'auto', duplex: 'auto'
    };
    if ((cat === 'switch' || cat === 'l3switch') && !/^Vlan/.test(name)) {
      ifc.sw = { mode: 'dynamic-auto', access: 1, native: 1, allowed: null, voice: null, noneg: false, portfast: false, routed: false };
      ifc.shutdown = false;
    }
    if (cat === 'hub') ifc.shutdown = false;
    return ifc;
  }
  function newDevice(name, model, typeHint) {
    var mi = modelInfo(model);
    var cat = (typeHint && TYPE2CAT[typeHint]) || mi.cat;
    var d = {
      name: name, model: model, cat: cat, x: 100, y: 100, power: true,
      ifaces: [],
      hostname: cat === 'router' ? 'Router' : (cat === 'switch' || cat === 'l3switch') ? 'Switch' : name,
      cfg: {
        enableSecret: null, enablePassword: null, banner: null, pwdEnc: false, domainLookup: true, domainName: null,
        ipRouting: cat === 'router', ipv6Routing: false, routes: [], routes6: [],
        rip: null, ospf: {}, dhcpPools: {}, dhcpExcl: [], dhcp6Pools: {}, acls: {}, natDyn: [], natStatic: [], natPools: {},
        vlans: (cat === 'switch' || cat === 'l3switch') ? [{ id: 1, name: 'default' }] : [],
        stp: { mode: 'pvst', prio: {}, off: [] }, lines: { con: {}, vty: {} }, cdp: true, defGw: null, users: [], other: []
      },
      host: null, services: null, arp: {}, macTable: {}, dhcpLeases: {}, natTable: []
    };
    if (cat === 'pc' || cat === 'server') {
      d.host = { dhcp: false, ip: null, len: null, gw: null, dns: null, v6auto: false, v6: [], v6gw: null, v6dns: null, v6ll: null, dhcpMsg: '' };
      d.hostname = name;
    }
    if (cat === 'server') {
      d.services = {
        http: { on: true, https: true, pages: null },
        dhcp: { on: false, pools: [] },
        dns: { on: false, records: [] },
        email: { on: false }, ftp: { on: true }, tftp: { on: true }, syslog: { on: false }, ntp: { on: true }
      };
    }
    mi.ifs.forEach(function (n) { d.ifaces.push(newIface(d, n)); });
    if (cat === 'switch' || cat === 'l3switch') d.ifaces.push(newIface(d, 'Vlan1'));
    return d;
  }

  /* ---------------------------------------------------------- */
  /* Réseau                                                      */
  /* ---------------------------------------------------------- */
  function Net(data) {
    this.devices = [];
    this.links = [];
    this.notes = [];
    this.shapes = [];
    this.version = 0;
    this.hsrp = {};       /* segment|groupe -> nom du routeur actif */
    this.events = [];     /* messages console (LINK/LINEPROTO) à distribuer */
    this.bootTime = Date.now();
    if (data) this.load(data);
  }
  var P = Net.prototype;

  P.touch = function () { this.version++; this._cache = null; };
  P.dev = function (name) {
    for (var i = 0; i < this.devices.length; i++) if (this.devices[i].name === name) return this.devices[i];
    return null;
  };
  P.iface = function (dev, name) {
    if (typeof dev === 'string') dev = this.dev(dev);
    if (!dev) return null;
    for (var i = 0; i < dev.ifaces.length; i++) if (dev.ifaces[i].name === name) return dev.ifaces[i];
    return null;
  };

  /* Chargement d'une topologie extraite d'un .pkt (voir outils/pkt_vers_js.py) */
  P.loadTopo = function (t, opts) {
    opts = opts || {};
    var self = this;
    t.devices.forEach(function (td) {
      var d = newDevice(td.name, td.model, td.type);
      d.x = td.x; d.y = td.y;
      if (td.off) d.power = false;
      if (td.ifaces && td.ifaces.length) {
        var byName = {};
        d.ifaces.forEach(function (i) { byName[i.name] = i; });
        var list = [];
        td.ifaces.forEach(function (ti) {
          var ifc = byName[ti.name] || newIface(d, ti.name, ti.mac || null);
          if (ti.mac) ifc.mac = ti.mac;
          if (ti.kind) ifc.kind = ti.kind;
          list.push(ifc);
        });
        if (d.cat === 'switch' || d.cat === 'l3switch') list.push(byName.Vlan1 || newIface(d, 'Vlan1'));
        d.ifaces = list;
      }
      if (d.host) {
        if (td.mac) d.ifaces[0].mac = td.mac;
        d.host.dhcp = !!td.dhcp;
        if (td.ip && N.isIP(td.ip) && N.isMask(td.mask)) { d.host.ip = N.ip2int(td.ip); d.host.len = N.maskLen(td.mask); }
        if (td.gw && N.isIP(td.gw) && td.gw !== '0.0.0.0') d.host.gw = N.ip2int(td.gw);
        if (td.dns && N.isIP(td.dns) && td.dns !== '0.0.0.0') d.host.dns = N.ip2int(td.dns);
        d.host.v6auto = !!td.v6auto;
        if (d.host.dhcp && !opts.keepDhcp) { d.host.ip = null; d.host.len = null; }
      }
      if (d.services && td.services) {
        if (td.services.dhcp) d.services.dhcp = JSON.parse(JSON.stringify(td.services.dhcp));
        if (td.services.dns) d.services.dns = JSON.parse(JSON.stringify(td.services.dns));
        if (td.services.http) d.services.http.on = td.services.http.on;
      }
      self.devices.push(d);
      if (td.config && root.IOS) {
        /* les interfaces présentes dans la running-config sans "shutdown" sont actives */
        if (d.cat === 'router') d.ifaces.forEach(function (i) { i.shutdown = false; });
        d.ifaces.forEach(function (i) { if (/^Vlan/.test(i.name)) i.shutdown = false; });
        if (td.vlans && (d.cat === 'switch' || d.cat === 'l3switch')) {
          d.cfg.vlans = td.vlans.map(function (v) { return { id: v[0], name: v[1] }; });
        }
        root.IOS.applyConfig(self, d, td.config);
        /* la config chargée est considérée comme enregistrée (startup-config) */
        d.startup = JSON.parse(JSON.stringify({ hostname: d.hostname, cfg: d.cfg, ifaces: d.ifaces }));
      }
    });
    t.links.forEach(function (l) { self.connect(l[0], l[1], l[2], l[3], l[4], true); });
    this.notes = (t.notes || []).map(function (n) { return { x: n.x, y: n.y, text: n.text }; });
    this.shapes = (t.shapes || []).map(function (s) { return JSON.parse(JSON.stringify(s)); });
    this.touch();
  };

  P.addDevice = function (model, x, y, name) {
    var mi = modelInfo(model);
    var base = { router: 'Router', switch: 'Switch', l3switch: 'Multilayer Switch', pc: model === 'Laptop-PT' ? 'Laptop' : 'PC', server: 'Server', hub: 'Hub' }[mi.cat] || 'Device';
    if (!name) {
      var i = 0; while (this.dev(base + i)) i++;
      name = base + i;
    }
    var d = newDevice(name, model);
    d.x = x; d.y = y;
    this.devices.push(d);
    this.touch();
    return d;
  };
  P.removeDevice = function (name) {
    this.links = this.links.filter(function (l) { return l.a.dev !== name && l.b.dev !== name; });
    this.devices = this.devices.filter(function (d) { return d.name !== name; });
    this.touch();
  };
  P.renameDevice = function (oldN, newN) {
    if (!newN || this.dev(newN)) return false;
    var d = this.dev(oldN); if (!d) return false;
    d.name = newN;
    if (d.host) d.hostname = newN;
    this.links.forEach(function (l) { if (l.a.dev === oldN) l.a.dev = newN; if (l.b.dev === oldN) l.b.dev = newN; });
    this.touch();
    return true;
  };
  P.linkOf = function (devName, ifName) {
    for (var i = 0; i < this.links.length; i++) {
      var l = this.links[i];
      if ((l.a.dev === devName && l.a.port === ifName) || (l.b.dev === devName && l.b.port === ifName)) return l;
    }
    return null;
  };
  P.peer = function (devName, ifName) {
    var l = this.linkOf(devName, ifName);
    if (!l) return null;
    var o = (l.a.dev === devName && l.a.port === ifName) ? l.b : l.a;
    return { dev: this.dev(o.dev), ifn: o.port, link: l };
  };
  P.connect = function (a, ap, b, bp, cable, silent) {
    if (this.linkOf(a, ap) || this.linkOf(b, bp)) return null;
    var da = this.dev(a), db = this.dev(b);
    if (!da || !db || !this.iface(da, ap) || !this.iface(db, bp)) return null;
    var l = { a: { dev: a, port: ap }, b: { dev: b, port: bp }, cable: cable || 'straight', since: Date.now() };
    this.links.push(l);
    this.touch();
    if (!silent) this.linkEvents(l);
    return l;
  };
  P.disconnect = function (link) {
    var before = [this.physUp(link.a.dev, link.a.port), this.physUp(link.b.dev, link.b.port)];
    this.links = this.links.filter(function (l) { return l !== link; });
    this.touch();
    var self = this;
    [link.a, link.b].forEach(function (end, k) {
      if (before[k]) self.emitLink(end.dev, end.port, false);
    });
  };
  /* Messages %LINK / %LINEPROTO après un changement */
  P.linkEvents = function (l) {
    var self = this;
    [l.a, l.b].forEach(function (end) {
      if (self.physUp(end.dev, end.port)) self.emitLink(end.dev, end.port, true);
    });
  };
  P.emitLink = function (devName, ifn, up) {
    var d = this.dev(devName);
    if (!d || d.cat === 'pc' || d.cat === 'server' || d.cat === 'hub') return;
    this.events.push({ dev: devName, text: '%LINK-5-CHANGED: Interface ' + ifn + ', changed state to ' + (up ? 'up' : 'down') });
    this.events.push({ dev: devName, text: '%LINEPROTO-5-UPDOWN: Line protocol on Interface ' + ifn + ', changed state to ' + (up ? 'up' : 'down'), delay: 1 });
  };

  /* ---------------------------------------------------------- */
  /* Couche physique                                              */
  /* ---------------------------------------------------------- */
  function group(d) { return (d.cat === 'switch' || d.cat === 'l3switch' || d.cat === 'hub') ? 'dce' : 'dte'; }
  /* le bon câble selon le cours : droit entre équipements de couches différentes, croisé sinon */
  P.expectedCable = function (a, ap, b, bp) {
    var da = typeof a === 'string' ? this.dev(a) : a, db = typeof b === 'string' ? this.dev(b) : b;
    var ia = this.iface(da, ap), ib = this.iface(db, bp);
    if (ia.kind === 'serial' || ib.kind === 'serial') return 'serial';
    if (ia.kind === 'fiber' && ib.kind === 'fiber') return 'fiber';
    return group(da) === group(db) ? 'cross' : 'straight';
  };
  P.cableOk = function (l) {
    var da = this.dev(l.a.dev), db = this.dev(l.b.dev);
    if (!da || !db) return false;
    var ia = this.iface(da, l.a.port), ib = this.iface(db, l.b.port);
    if (!ia || !ib) return false;
    if (l.cable === 'console') return false;
    if (l.cable === 'serial') return ia.kind === 'serial' && ib.kind === 'serial';
    if (ia.kind === 'serial' || ib.kind === 'serial') return false;
    if (l.cable === 'fiber') return ia.kind === 'fiber' && ib.kind === 'fiber';
    if (ia.kind === 'fiber' || ib.kind === 'fiber') return false;
    return l.cable === (group(da) === group(db) ? 'cross' : 'straight');
  };
  /* état physique d'un port (couche 1-2) */
  P.physUp = function (devName, ifn) {
    var d = typeof devName === 'string' ? this.dev(devName) : devName;
    if (!d || !d.power) return false;
    var i = this.iface(d, ifn);
    if (!i || i.shutdown || i.parent) return false;
    var l = this.linkOf(d.name, ifn);
    if (!l || !this.cableOk(l)) return false;
    var o = (l.a.dev === d.name && l.a.port === ifn) ? l.b : l.a;
    var od = this.dev(o.dev);
    if (!od || !od.power) return false;
    var oi = this.iface(od, o.port);
    return !!oi && !oi.shutdown;
  };
  /* statut d'une interface logique : {status, proto} comme "show ip interface brief" */
  P.ifStatus = function (d, ifc) {
    if (typeof ifc === 'string') ifc = this.iface(d, ifc);
    if (!d.power) return { status: 'down', proto: 'down' };
    if (ifc.shutdown) return { status: 'administratively down', proto: 'down' };
    if (ifc.parent) {
      var p = this.iface(d, ifc.parent);
      if (!p || p.shutdown) return { status: 'administratively down', proto: 'down' };
      var up = this.physUp(d, p.name);
      return { status: up ? 'up' : 'down', proto: up ? 'up' : 'down' };
    }
    if (/^Vlan(\d+)/.test(ifc.name)) {
      var vid = +/^Vlan(\d+)/.exec(ifc.name)[1];
      var any = this.vlanHasUpPort(d, vid);
      return { status: 'up', proto: any ? 'up' : 'down' };
    }
    if (/^Loopback/.test(ifc.name)) return { status: 'up', proto: 'up' };
    var u = this.physUp(d, ifc.name);
    return { status: u ? 'up' : 'down', proto: u ? 'up' : 'down' };
  };
  P.l3Up = function (d, ifc) {
    var s = this.ifStatus(d, ifc);
    return s.status === 'up' && s.proto === 'up';
  };
  P.vlanHasUpPort = function (d, vid) {
    var self = this;
    return d.ifaces.some(function (i) {
      if (!i.sw || !self.physUp(d, i.name)) return false;
      var m = self.opMode(d, i);
      if (m === 'access') return i.sw.access === vid;
      return self.trunkAllows(i, vid);
    });
  };
  P.linkState = function (l) {
    /* pour les voyants : 'up' (vert), 'down' (rouge), 'block' (orange), ou 'wait' */
    var ua = this.physUp(l.a.dev, l.a.port), ub = this.physUp(l.b.dev, l.b.port);
    var res = { a: ua ? 'up' : 'down', b: ub ? 'up' : 'down' };
    if (ua && ub) {
      var st = this.stpAll();
      ['a', 'b'].forEach(function (k) {
        var e = l[k], key = e.dev + '|' + e.port;
        if (st.blocked[key]) res[k] = 'block';
      });
    }
    return res;
  };

  /* ---------------------------------------------------------- */
  /* Commutation : modes de port, VLAN, STP                      */
  /* ---------------------------------------------------------- */
  P.vlanExists = function (d, vid) { return d.cfg.vlans.some(function (v) { return v.id === vid; }); };
  P.trunkAllows = function (i, vid) {
    if (!i.sw) return false;
    if (!i.sw.allowed) return vid >= 1 && vid <= 4094;
    return i.sw.allowed.indexOf(vid) >= 0;
  };
  P.opMode = function (d, i) {
    if (!i.sw) return 'routed';
    if (i.sw.routed) return 'routed';
    var m = i.sw.mode;
    if (m === 'access' || m === 'trunk') return m;
    var p = this.peer(d.name, i.name);
    if (!p || !p.dev) return 'access';
    var pi = this.iface(p.dev, p.ifn);
    if (!pi || !pi.sw || pi.sw.routed) return 'access';
    var pm = pi.sw.mode;
    if (pi.sw.noneg && pm === 'trunk') pm = 'nonego-trunk';
    if (m === 'dynamic-desirable') return (pm === 'trunk' || pm === 'dynamic-desirable' || pm === 'dynamic-auto') ? 'trunk' : 'access';
    /* dynamic auto */
    return (pm === 'trunk' || pm === 'dynamic-desirable') ? 'trunk' : 'access';
  };
  /* VLAN d'entrée d'une trame sur un port de switch (null = rejetée) */
  P.ingressVlan = function (d, i, tag) {
    var m = this.opMode(d, i);
    if (m === 'access') {
      if (tag == null) return this.vlanExists(d, i.sw.access) ? i.sw.access : null;
      if (i.sw.voice != null && tag === i.sw.voice) return tag;
      return null;
    }
    if (m === 'trunk') {
      var v = tag == null ? i.sw.native : tag;
      return this.trunkAllows(i, v) && this.vlanExists(d, v) ? v : null;
    }
    return null;
  };
  /* étiquette en sortie (undefined = le port ne transporte pas ce VLAN) */
  P.egressTag = function (d, i, vid) {
    var m = this.opMode(d, i);
    if (m === 'access') return i.sw.access === vid ? null : (i.sw.voice === vid ? vid : undefined);
    if (m === 'trunk') {
      if (!this.trunkAllows(i, vid)) return undefined;
      return vid === i.sw.native ? null : vid;
    }
    return undefined;
  };
  P.baseMac = function (d) {
    var v = this.iface(d, 'Vlan1');
    return N.macHex((v || d.ifaces[0] || { mac: genMac(d.name) }).mac);
  };
  P.stpPrio = function (d, vid) {
    var p = d.cfg.stp.prio[vid];
    return (p == null ? 32768 : p) + vid;
  };
  P.stpOn = function (d, vid) { return d.cfg.stp.off.indexOf(vid) < 0; };
  function portCost(ifc) {
    var s = speedOf(ifc.name);
    return s >= 10000 ? 2 : s >= 1000 ? 4 : s >= 100 ? 19 : 100;
  }
  /* Calcule STP pour tous les VLAN présents : ports bloqués, racines, rôles */
  P.stpAll = function () {
    if (this._cache && this._cache.stp) return this._cache.stp;
    var self = this;
    var res = { blocked: {}, byVlan: {}, storm: {} };
    var sws = this.devices.filter(function (d) { return (d.cat === 'switch' || d.cat === 'l3switch') && d.power; });
    var vids = {};
    sws.forEach(function (d) { d.cfg.vlans.forEach(function (v) { if (v.id < 1002) vids[v.id] = 1; }); });
    Object.keys(vids).forEach(function (vk) {
      var vid = +vk;
      /* graphe des liens switch-switch transportant ce VLAN */
      var edges = [];
      sws.forEach(function (d) {
        d.ifaces.forEach(function (i) {
          if (!i.sw || !self.physUp(d, i.name)) return;
          var p = self.peer(d.name, i.name);
          if (!p || !(p.dev.cat === 'switch' || p.dev.cat === 'l3switch')) return;
          if (self.egressTag(d, i, vid) === undefined) return;
          if (d.name < p.dev.name || (d.name === p.dev.name && i.name < p.ifn)) edges.push({ a: d, ai: i, b: p.dev, bi: self.iface(p.dev, p.ifn) });
        });
      });
      var parts = sws.filter(function (d) { return self.vlanExists(d, vid) && self.stpOn(d, vid); });
      if (!parts.length) return;
      function bid(d) { return [self.stpPrio(d, vid), self.baseMac(d)]; }
      function cmpBid(x, y) { return x[0] !== y[0] ? x[0] - y[0] : (x[1] < y[1] ? -1 : x[1] > y[1] ? 1 : 0); }
      /* composantes connexes */
      var adj = {};
      edges.forEach(function (e) {
        (adj[e.a.name] = adj[e.a.name] || []).push({ me: e.a, mi: e.ai, o: e.b, oi: e.bi });
        (adj[e.b.name] = adj[e.b.name] || []).push({ me: e.b, mi: e.bi, o: e.a, oi: e.ai });
      });
      var seen = {};
      var info = { roots: [], ports: {} };
      sws.forEach(function (s0) {
        if (seen[s0.name]) return;
        var comp = [], q = [s0]; seen[s0.name] = 1;
        while (q.length) {
          var c = q.shift(); comp.push(c);
          (adj[c.name] || []).forEach(function (n) { if (!seen[n.o.name]) { seen[n.o.name] = 1; q.push(n.o); } });
        }
        var compEdges = edges.filter(function (e) { return comp.indexOf(e.a) >= 0; });
        var stpMembers = comp.filter(function (d) { return self.vlanExists(d, vid) && self.stpOn(d, vid); });
        var noStp = comp.filter(function (d) { return !self.stpOn(d, vid); });
        /* boucle sans STP => tempête */
        if (compEdges.length >= comp.length && noStp.length) { res.storm[vid + '|' + comp.map(function (d) { return d.name; }).sort().join(',')] = comp.map(function (d) { return d.name; }); }
        if (!stpMembers.length) return;
        var root = stpMembers.slice().sort(function (x, y) { return cmpBid(bid(x), bid(y)); })[0];
        info.roots.push(root.name);
        /* Dijkstra sur les switches STP */
        var dist = {}, via = {};
        stpMembers.forEach(function (d) { dist[d.name] = Infinity; });
        dist[root.name] = 0;
        var todo = stpMembers.slice();
        while (todo.length) {
          todo.sort(function (x, y) { return dist[x.name] - dist[y.name] || cmpBid(bid(x), bid(y)); });
          var u = todo.shift();
          if (dist[u.name] === Infinity) break;
          (adj[u.name] || []).forEach(function (n) {
            if (!self.stpOn(n.o, vid)) return;
            var nd = dist[u.name] + portCost(n.oi);
            if (nd < dist[n.o.name]) dist[n.o.name] = nd;
          });
        }
        /* port racine de chaque switch non racine */
        var rootPort = {};
        stpMembers.forEach(function (d) {
          if (d === root || dist[d.name] === Infinity) return;
          var best = null;
          (adj[d.name] || []).forEach(function (n) {
            if (!self.stpOn(n.o, vid) || dist[n.o.name] === Infinity) return;
            var c = dist[n.o.name] + portCost(n.mi);
            var key = [c, bid(n.o), n.oi.name];
            if (!best || c < best.k[0] || (c === best.k[0] && (cmpBid(key[1], best.k[1]) < 0 || (cmpBid(key[1], best.k[1]) === 0 && key[2] < best.k[2])))) best = { k: key, n: n };
          });
          if (best) rootPort[d.name] = best.n.mi.name;
        });
        /* rôles par segment */
        compEdges.forEach(function (e) {
          var A = e.a, B = e.b;
          if (!self.stpOn(A, vid) || !self.stpOn(B, vid)) return;
          var ka = A.name + '|' + e.ai.name, kb = B.name + '|' + e.bi.name;
          var aRoot = rootPort[A.name] === e.ai.name, bRoot = rootPort[B.name] === e.bi.name;
          var da = dist[A.name], db = dist[B.name];
          var aDes;
          if (aRoot) aDes = false; else if (bRoot) aDes = true;
          else if (da !== db) aDes = da < db;
          else { var c = cmpBid(bid(A), bid(B)); aDes = c < 0 || (c === 0 && e.ai.name < e.bi.name); }
          info.ports[ka] = aRoot ? 'Root' : aDes ? 'Desg' : 'Altn';
          info.ports[kb] = bRoot ? 'Root' : !aDes ? 'Desg' : 'Altn';
          if (info.ports[ka] === 'Altn') res.blocked[ka] = vid;
          if (info.ports[kb] === 'Altn') res.blocked[kb] = vid;
        });
        info.dist = Object.assign(info.dist || {}, dist);
        info.rootPort = Object.assign(info.rootPort || {}, rootPort);
      });
      res.byVlan[vid] = info;
    });
    this._cache = this._cache || {};
    this._cache.stp = res;
    return res;
  };
  P.portBlocked = function (d, ifn, vid) {
    var st = this.stpAll();
    var info = st.byVlan[vid];
    return !!(info && info.ports[d.name + '|' + ifn] === 'Altn');
  };

  /* ---------------------------------------------------------- */
  /* Domaine de diffusion (niveau 2)                             */
  /* Point terminal = { dev, ifc } (interface logique L3)        */
  /* ---------------------------------------------------------- */
  P.endpointsFromWire = function (d, ifc, tag) {
    /* trame arrivant sur un routeur / hôte */
    var self = this, out = [];
    if (d.cat === 'pc' || d.cat === 'server') {
      if (tag == null) out.push({ dev: d, ifc: ifc });
      return out;
    }
    if (d.cat === 'router' || (ifc.sw && ifc.sw.routed)) {
      if (!ifc.shutdown) {
        if (tag == null) {
          out.push({ dev: d, ifc: ifc });
          d.ifaces.forEach(function (s) { if (s.parent === ifc.name && s.encap && s.encap.native) out.push({ dev: d, ifc: s }); });
        } else {
          d.ifaces.forEach(function (s) { if (s.parent === ifc.name && s.encap && s.encap.vlan === tag && !s.encap.native) out.push({ dev: d, ifc: s }); });
        }
      }
    }
    return out.filter(function (e) { return !e.ifc.shutdown; });
  };
  /* sortie d'un point terminal : [port physique, étiquette] */
  P.wireOf = function (d, ifc) {
    if (ifc.parent) return { port: ifc.parent, tag: ifc.encap && !ifc.encap.native ? ifc.encap.vlan : null };
    return { port: ifc.name, tag: null };
  };
  /* BFS : tous les points terminaux joignables en niveau 2 depuis (d, ifc) */
  P.l2Domain = function (d, ifc) {
    var self = this;
    var key0 = d.name + '|' + ifc.name;
    this._cache = this._cache || {};
    this._cache.l2 = this._cache.l2 || {};
    if (this._cache.l2[key0]) return this._cache.l2[key0];
    var res = { endpoints: [], storm: false, switches: {}, vlan: null, parents: {} };
    var start = { dev: d, ifc: ifc };
    /* SVI d'un switch : part dans son VLAN */
    var q = [];
    var visited = {}, queued = {};
    if (/^Vlan(\d+)/.test(ifc.name) && (d.cat === 'switch' || d.cat === 'l3switch')) {
      var vid0 = +/^Vlan(\d+)/.exec(ifc.name)[1];
      res.vlan = vid0;
      q.push({ sw: d, vid: vid0, from: null, parent: null });
    } else {
      var w = this.wireOf(d, ifc);
      if (!this.physUp(d, w.port)) { res.endpoints.push(start); this._cache.l2[key0] = res; return res; }
      var p = this.peer(d.name, w.port);
      q.push({ wire: { dev: p.dev, ifn: p.ifn, tag: w.tag }, parent: null });
    }
    res.endpoints.push(start);
    var epSeen = {}; epSeen[key0] = 1;
    var guard = 0;
    while (q.length && guard++ < 5000) {
      var it = q.shift();
      if (it.wire) {
        var od = it.wire.dev, oi = this.iface(od, it.wire.ifn);
        if (od.cat === 'switch' || od.cat === 'l3switch') {
          if (oi.sw && oi.sw.routed) {
            this.endpointsFromWire(od, oi, it.wire.tag).forEach(addEp);
            continue;
          }
          var vid = this.ingressVlan(od, oi, it.wire.tag);
          if (vid == null) continue;
          if (this.stpOn(od, vid) && this.portBlocked(od, oi.name, vid)) continue;
          var k = od.name + '|' + vid;
          if (visited[k] || queued[k]) { if (!this.stpOn(od, vid)) res.storm = true; continue; }
          queued[k] = 1;
          if (res.vlan == null) res.vlan = vid;
          q.push({ sw: od, vid: vid, from: oi.name, parent: it.parent });
        } else if (od.cat === 'hub') {
          var kh = od.name + '|hub|' + it.wire.tag;
          if (visited[kh]) { res.storm = true; continue; }
          visited[kh] = 1;
          od.ifaces.forEach(function (hi) {
            if (hi.name === oi.name || !self.physUp(od, hi.name)) return;
            var pp = self.peer(od.name, hi.name);
            q.push({ wire: { dev: pp.dev, ifn: pp.ifn, tag: it.wire.tag }, parent: it.parent });
          });
        } else {
          this.endpointsFromWire(od, oi, it.wire.tag).forEach(addEp);
        }
      } else if (it.sw) {
        var s = it.sw, v = it.vid, kk = s.name + '|' + v;
        if (visited[kk]) continue;
        visited[kk] = 1;
        res.switches[s.name] = res.switches[s.name] || {};
        res.switches[s.name][v] = it.from;
        /* SVI */
        var svi = this.iface(s, 'Vlan' + v);
        if (svi && svi.ip != null && !svi.shutdown && svi !== ifc) addEp({ dev: s, ifc: svi });
        s.ifaces.forEach(function (si) {
          if (!si.sw || si.name === it.from || si.sw.routed) return;
          if (!self.physUp(s, si.name)) return;
          var tg = self.egressTag(s, si, v);
          if (tg === undefined) return;
          if (self.stpOn(s, v) && self.portBlocked(s, si.name, v)) return;
          var pp = self.peer(s.name, si.name);
          q.push({ wire: { dev: pp.dev, ifn: pp.ifn, tag: tg }, parent: { sw: s.name, port: si.name, vid: v, up: it.parent } });
        });
      }
    }
    function addEp(e) {
      var k2 = e.dev.name + '|' + e.ifc.name;
      if (epSeen[k2]) return;
      epSeen[k2] = 1;
      res.endpoints.push(e);
    }
    /* tempête détectée par l'analyse STP globale */
    var st = this.stpAll();
    Object.keys(st.storm).forEach(function (k3) {
      var vv = +k3.split('|')[0];
      if (res.vlan === vv && st.storm[k3].some(function (n) { return res.switches[n]; })) res.storm = true;
    });
    this._cache.l2[key0] = res;
    return res;
  };

  /* ---------------------------------------------------------- */
  /* Adresses                                                    */
  /* ---------------------------------------------------------- */
  P.hostIface = function (d) { return d.ifaces[0]; };
  P.ipsOf = function (d, ifc) {
    /* adresses IPv4 [{ip,len}] portées par une interface logique */
    if (d.host) return d.host.ip != null ? [{ ip: d.host.ip, len: d.host.len }] : [];
    var r = [];
    if (ifc.ip != null) r.push({ ip: ifc.ip, len: ifc.len });
    ifc.sec.forEach(function (s) { r.push({ ip: s.ip, len: s.len }); });
    return r;
  };
  P.ownsIP = function (d, ifc, ip, withVirtual) {
    var own = this.ipsOf(d, ifc).some(function (a) { return a.ip === ip; });
    if (own) return true;
    if (withVirtual && d.cat === 'router') {
      var self = this;
      return Object.keys(ifc.standby).some(function (g) {
        var sb = ifc.standby[g];
        return sb.ip === ip && self.hsrpActive(d, ifc, +g) === d.name;
      });
    }
    return false;
  };
  P.allIPs = function (d) {
    var self = this, r = [];
    if (d.host) return d.host.ip != null ? [d.host.ip] : [];
    d.ifaces.forEach(function (i) {
      if (!self.l3Up(d, i)) return;
      self.ipsOf(d, i).forEach(function (a) { r.push(a.ip); });
    });
    return r;
  };
  P.firstIP = function (d) {
    if (d.host) return d.host.ip;
    for (var i = 0; i < d.ifaces.length; i++) if (d.ifaces[i].ip != null) return d.ifaces[i].ip;
    return null;
  };

  /* ---------------------------------------------------------- */
  /* HSRP                                                        */
  /* ---------------------------------------------------------- */
  P.hsrpMembers = function (d, ifc, grp) {
    var self = this;
    var dom = this.l2Domain(d, ifc);
    return dom.endpoints.filter(function (e) {
      return e.dev.cat === 'router' && e.dev.power && e.ifc.standby[grp] && self.l3Up(e.dev, e.ifc);
    });
  };
  P.hsrpActive = function (d, ifc, grp) {
    if (!ifc.standby[grp] || !this.l3Up(d, ifc)) return null;
    var members = this.hsrpMembers(d, ifc, grp);
    if (!members.length) return null;
    var seg = grp + '|' + members.map(function (m) { return m.dev.name; }).sort().join(',');
    var segKey = grp + '|' + (ifc.standby[grp].ip || 0);
    function prio(m) { var p = m.ifc.standby[grp].prio; return p == null ? 100 : p; }
    function better(x, y) { return prio(x) !== prio(y) ? prio(x) > prio(y) : (x.ifc.ip || 0) > (y.ifc.ip || 0); }
    var best = members[0];
    members.forEach(function (m) { if (better(m, best)) best = m; });
    var cur = this.hsrp[segKey];
    var curM = members.filter(function (m) { return m.dev.name === cur; })[0];
    var active;
    if (curM) {
      active = curM;
      if (best !== curM && best.ifc.standby[grp].preempt && better(best, curM)) active = best;
    } else active = best;
    this.hsrp[segKey] = active.dev.name;
    this._hsrpSeg = seg;
    return active.dev.name;
  };
  P.hsrpInfo = function (d, ifc, grp) {
    var members = this.hsrpMembers(d, ifc, grp);
    var act = this.hsrpActive(d, ifc, grp);
    function prio(m) { var p = m.ifc.standby[grp].prio; return p == null ? 100 : p; }
    var others = members.filter(function (m) { return m.dev.name !== act; }).sort(function (x, y) { return prio(y) - prio(x) || (y.ifc.ip - x.ifc.ip); });
    var stby = others[0] || null;
    var state = act === d.name ? 'Active' : (stby && stby.dev === d ? 'Standby' : (members.some(function (m) { return m.dev === d; }) ? 'Listen' : 'Init'));
    var actM = members.filter(function (m) { return m.dev.name === act; })[0];
    return { state: state, active: actM, standby: stby, members: members };
  };
  function hsrpMac(grp) { return '0000.0C07.AC' + ('0' + (grp & 255).toString(16).toUpperCase()).slice(-2); }

  /* ---------------------------------------------------------- */
  /* Routage IPv4                                                */
  /* ---------------------------------------------------------- */
  function aclPermits(dev, num, ip) {
    var acl = dev.cfg.acls[num];
    if (!acl) return false;
    for (var i = 0; i < acl.length; i++) {
      var r = acl[i];
      var match = r.any || ((ip & ~r.wild) >>> 0) === ((r.src & ~r.wild) >>> 0);
      if (match) return r.action === 'permit';
    }
    return false;
  }
  P.aclPermits = function (dev, num, ip) { return aclPermits(dev, num, ip); };

  P.connectedRoutes = function (d) {
    var self = this, r = [];
    d.ifaces.forEach(function (i) {
      if (!self.l3Up(d, i)) return;
      if (i.sw && !i.sw.routed && !/^Vlan/.test(i.name)) return;
      if (/^Vlan/.test(i.name) && d.cat === 'switch') return; /* switch L2 : pas de routage */
      self.ipsOf(d, i).forEach(function (a) {
        r.push({ code: 'C', net: N.netOf(a.ip, a.len), len: a.len, iface: i.name, ad: 0, metric: 0 });
        r.push({ code: 'L', net: a.ip, len: 32, iface: i.name, ad: 0, metric: 0, local: true });
      });
    });
    return r;
  };
  /* Table complète (meilleures routes) */
  P.routeTable = function (d) {
    this._cache = this._cache || {};
    this._cache.rt = this._cache.rt || {};
    if (this._cache.rt[d.name]) return this._cache.rt[d.name];
    var self = this;
    var conn = this.connectedRoutes(d);
    var cand = conn.slice();
    if (d.cat === 'router' || (d.cat === 'l3switch' && d.cfg.ipRouting)) {
      /* statiques */
      d.cfg.routes.forEach(function (s) {
        var ok = false, via = null;
        if (s.iface) {
          var ifc = self.iface(d, s.iface);
          ok = ifc && self.l3Up(d, ifc);
        } else if (s.nh != null) {
          /* next-hop joignable par une route (récursive, hors elle-même) */
          ok = self.resolveNh(d, s.nh, conn, d.cfg.routes, 0);
        }
        if (ok) cand.push({ code: s.len === 0 ? 'S*' : 'S', net: s.net, len: s.len, nh: s.nh, iface: s.iface, ad: s.ad || 1, metric: 0 });
      });
      /* dynamiques */
      var dyn = this.dynamicRoutes();
      (dyn[d.name] || []).forEach(function (r) { cand.push(r); });
    }
    /* meilleure route par préfixe (AD la plus faible) */
    var best = {};
    cand.forEach(function (r) {
      var k = r.net + '/' + r.len;
      if (!best[k] || r.ad < best[k][0].ad) best[k] = [r];
      else if (r.ad === best[k][0].ad && r.code !== 'C' && r.code !== 'L' && best[k][0].metric === r.metric && !best[k].some(function (x) { return x.nh === r.nh && x.iface === r.iface; })) best[k].push(r);
    });
    var table = [];
    Object.keys(best).forEach(function (k) { best[k].forEach(function (r) { table.push(r); }); });
    table.sort(function (a, b) { return a.net - b.net || a.len - b.len; });
    this._cache.rt[d.name] = table;
    return table;
  };
  P.resolveNh = function (d, nh, conn, statics, depth) {
    if (depth > 4) return false;
    if (conn.some(function (c) { return !c.local && N.sameNet(nh, c.net, c.len); })) return true;
    var self = this;
    return statics.some(function (s) {
      if (s.len === 0 && depth === 0 && false) return false;
      if (!N.sameNet(nh, s.net, s.len) || s.nh == null || s.nh === nh) return false;
      return self.resolveNh(d, s.nh, conn, statics, depth + 1);
    });
  };
  P.lookup = function (d, dst) {
    var t = this.routeTable(d), best = null;
    for (var i = 0; i < t.length; i++) {
      var r = t[i];
      if (N.sameNet(dst, r.net, r.len) && (!best || r.len > best.len)) best = r;
    }
    return best;
  };
  /* résout une route en (interface de sortie, next-hop IP) */
  P.egressFor = function (d, dst, depth) {
    depth = depth || 0;
    if (depth > 6) return null;
    var r = this.lookup(d, dst);
    if (!r) return null;
    if (r.code === 'C' || r.code === 'L') return { iface: r.iface, nh: dst, route: r };
    if (r.nh == null && r.iface) return { iface: r.iface, nh: dst, route: r };
    var sub = this.egressFor(d, r.nh, depth + 1);
    if (!sub) return null;
    return { iface: r.iface || sub.iface, nh: r.nh, route: r };
  };

  /* RIP / OSPF : calcul global par itérations (Bellman-Ford) */
  P.dynamicRoutes = function () {
    this._cache = this._cache || {};
    if (this._cache.dyn) return this._cache.dyn;
    var self = this, out = {};
    this._cache.dyn = out; /* évite la récursion */
    var routers = this.devices.filter(function (d) { return d.power && (d.cat === 'router' || (d.cat === 'l3switch' && d.cfg.ipRouting)); });
    /* ---- RIP ---- */
    function ripIfs(d) {
      if (!d.cfg.rip) return [];
      return d.ifaces.filter(function (i) {
        if (i.ip == null || !self.l3Up(d, i)) return false;
        return d.cfg.rip.networks.some(function (n) { return N.sameNet(i.ip, n, N.classfulLen(n)); });
      });
    }
    var rip = {};
    routers.forEach(function (d) {
      if (!d.cfg.rip) return;
      var tbl = {};
      ripIfs(d).forEach(function (i) { tbl[N.netOf(i.ip, i.len) + '/' + i.len] = { net: N.netOf(i.ip, i.len), len: i.len, metric: 0, iface: i.name, nh: null, conn: true }; });
      rip[d.name] = tbl;
    });
    /* voisinages RIP */
    var nbrs = [];
    routers.forEach(function (d) {
      if (!d.cfg.rip) return;
      ripIfs(d).forEach(function (i) {
        self.l2Domain(d, i).endpoints.forEach(function (e) {
          if (e.dev === d || !e.dev.cfg.rip || !rip[e.dev.name]) return;
          if (ripIfs(e.dev).indexOf(e.ifc) < 0) return;
          if (e.ifc.ip == null || !N.sameNet(e.ifc.ip, i.ip, i.len)) return;
          nbrs.push({ me: d, mi: i, o: e.dev, oi: e.ifc });
        });
      });
    });
    function sendVer(d) { return d.cfg.rip.version || 1; }
    function accepts(d, v) { var mv = d.cfg.rip.version; return mv ? mv === v : true; }
    for (var it = 0; it < 20; it++) {
      var changed = false;
      nbrs.forEach(function (nb) {
        if (!accepts(nb.me, sendVer(nb.o))) return;
        if (nb.o.cfg.rip.passive.indexOf(nb.oi.name) >= 0) return;
        var theirs = rip[nb.o.name], mine = rip[nb.me.name];
        var sumAuto = nb.o.cfg.rip.version !== 2 || nb.o.cfg.rip.autoSummary;
        Object.keys(theirs).forEach(function (k) {
          var r = theirs[k];
          if (r.iface === nb.oi.name && !r.conn) return; /* split horizon */
          var net = r.net, len = r.len;
          if (sumAuto && N.classOf(net) !== 'D' && !N.sameNet(net, nb.oi.ip, N.classfulLen(nb.oi.ip))) { len = N.classfulLen(net); net = N.netOf(net, len); }
          var m = r.metric + 1;
          if (m > 15) return;
          var kk = net + '/' + len;
          var cur = mine[kk];
          if (!cur || (!cur.conn && m < cur.metric)) {
            if (cur && cur.conn) return;
            mine[kk] = { net: net, len: len, metric: m, iface: nb.mi.name, nh: nb.oi.ip, conn: false };
            changed = true;
          }
        });
      });
      if (!changed) break;
    }
    Object.keys(rip).forEach(function (n) {
      out[n] = out[n] || [];
      Object.keys(rip[n]).forEach(function (k) {
        var r = rip[n][k];
        if (!r.conn) out[n].push({ code: 'R', net: r.net, len: r.len, nh: r.nh, iface: r.iface, ad: 120, metric: r.metric });
      });
    });
    /* ---- OSPF ---- */
    function ospfIfs(d) {
      var pids = Object.keys(d.cfg.ospf);
      if (!pids.length) return [];
      return d.ifaces.filter(function (i) {
        if (i.ip == null || !self.l3Up(d, i)) return false;
        return pids.some(function (p) {
          return d.cfg.ospf[p].networks.some(function (n) { return ((i.ip & ~n.wild) >>> 0) === ((n.addr & ~n.wild) >>> 0); });
        });
      });
    }
    function cost(i) { var s = speedOf(i.name); return Math.max(1, Math.floor(100 / s)); }
    var ospfR = routers.filter(function (d) { return ospfIfs(d).length; });
    var links = [];
    ospfR.forEach(function (d) {
      ospfIfs(d).forEach(function (i) {
        self.l2Domain(d, i).endpoints.forEach(function (e) {
          if (e.dev === d || ospfR.indexOf(e.dev) < 0 || ospfIfs(e.dev).indexOf(e.ifc) < 0) return;
          if (!N.sameNet(e.ifc.ip, i.ip, i.len)) return;
          links.push({ me: d, mi: i, o: e.dev, oi: e.ifc, c: cost(i) });
        });
      });
    });
    ospfR.forEach(function (src) {
      var dist = {}, first = {};
      ospfR.forEach(function (d) { dist[d.name] = Infinity; });
      dist[src.name] = 0;
      for (var k = 0; k < ospfR.length + 1; k++) {
        links.forEach(function (l) {
          if (dist[l.me.name] === Infinity) return;
          var nd = dist[l.me.name] + l.c;
          if (nd < dist[l.o.name]) {
            dist[l.o.name] = nd;
            first[l.o.name] = l.me === src ? { iface: l.mi.name, nh: l.oi.ip } : first[l.me.name];
          }
        });
      }
      var myNets = {};
      ospfIfs(src).forEach(function (i) { myNets[N.netOf(i.ip, i.len) + '/' + i.len] = 1; });
      var best = {};
      ospfR.forEach(function (d) {
        if (d === src || dist[d.name] === Infinity || !first[d.name]) return;
        ospfIfs(d).forEach(function (i) {
          var net = N.netOf(i.ip, i.len), kk = net + '/' + i.len;
          if (myNets[kk]) return;
          var m = dist[d.name] + cost(i);
          if (!best[kk] || m < best[kk].metric) best[kk] = { code: 'O', net: net, len: i.len, nh: first[d.name].nh, iface: first[d.name].iface, ad: 110, metric: m };
        });
      });
      out[src.name] = (out[src.name] || []).concat(Object.keys(best).map(function (k) { return best[k]; }));
    });
    return out;
  };

  /* ---------------------------------------------------------- */
  /* Résolution ARP & acheminement                               */
  /* ---------------------------------------------------------- */
  P.learnMac = function (dom, epFrom, epTo) {
    /* apprentissage des tables MAC le long du chemin (approximatif mais utile) */
    var self = this;
    Object.keys(dom.switches).forEach(function (sn) {
      var s = self.dev(sn);
      Object.keys(dom.switches[sn]).forEach(function (v) {
        var port = dom.switches[sn][v];
        if (!port) return;
        s.macTable[v + '|' + N.macHex(epFrom.ifc.mac)] = { vlan: +v, mac: epFrom.ifc.mac, port: port };
      });
    });
    if (epTo) {
      var dom2 = this.l2Domain(epTo.dev, epTo.ifc);
      Object.keys(dom2.switches).forEach(function (sn) {
        var s = self.dev(sn);
        Object.keys(dom2.switches[sn]).forEach(function (v) {
          var port = dom2.switches[sn][v];
          if (!port) return;
          s.macTable[v + '|' + N.macHex(epTo.ifc.mac)] = { vlan: +v, mac: epTo.ifc.mac, port: port };
        });
      });
    }
  };
  /* Trouve le point terminal qui porte "ip" dans le domaine de (d, ifc) */
  P.arp = function (d, ifc, ip, st) {
    var dom = this.l2Domain(d, ifc);
    if (dom.storm) { if (st) st.storm = true; return null; }
    var hit = null, self = this;
    dom.endpoints.forEach(function (e) {
      if (hit || e.dev === d && e.ifc === ifc) return;
      if (!e.dev.power) return;
      if (e.dev.host) { if (e.dev.host.ip === ip && self.physUp(e.dev, e.ifc.name)) hit = e; return; }
      if (!self.l3Up(e.dev, e.ifc)) return;
      if (self.ownsIP(e.dev, e.ifc, ip, true)) hit = e;
    });
    if (hit) {
      var cache = d.arp, k = N.int2ip(ip);
      var mac = hit.ifc.mac;
      if (hit.dev.cat === 'router' && !this.ipsOf(hit.dev, hit.ifc).some(function (a) { return a.ip === ip; })) {
        Object.keys(hit.ifc.standby).forEach(function (g) { if (hit.ifc.standby[g].ip === ip) mac = hsrpMac(+g); });
      }
      if (!cache[k] || cache[k].mac !== mac) { if (st) st.arpMiss = true; }
      cache[k] = { mac: mac, iface: ifc.name, t: Date.now() };
      /* la cible apprend aussi l'émetteur */
      var myIp = this.ipsOf(d, ifc)[0];
      if (myIp) hit.dev.arp[N.int2ip(myIp.ip)] = { mac: ifc.mac, iface: hit.ifc.name, t: Date.now() };
      this.learnMac(dom, { dev: d, ifc: ifc }, hit);
    }
    return hit;
  };

  /* NAT : traduction en entrée (depuis l'extérieur) */
  P.natIn = function (d, pkt) {
    var self = this;
    for (var i = 0; i < d.cfg.natStatic.length; i++) {
      var s = d.cfg.natStatic[i];
      var g = self.natGlobalIP(d, s);
      if (g !== pkt.dst) continue;
      if (s.proto) {
        if (pkt.proto !== s.proto || pkt.dport !== s.gport) continue;
        pkt.dst = s.local; pkt.dport = s.lport;
        this.natRecord(d, { proto: s.proto, ig: g + ':' + s.gport, il: s.local + ':' + s.lport, og: pkt.src + ':' + pkt.sport, stat: true });
        return true;
      }
      pkt.dst = s.local;
      return true;
    }
    for (var j = 0; j < d.natTable.length; j++) {
      var e = d.natTable[j];
      if (e.stat) continue;
      if (e.gip === pkt.dst && e.gport === (pkt.proto === 'icmp' ? pkt.id : pkt.dport)) {
        pkt.dst = e.lip;
        if (pkt.proto === 'icmp') pkt.id = e.lport; else pkt.dport = e.lport;
        return true;
      }
    }
    return false;
  };
  P.natGlobalIP = function (d, s) {
    if (s.gIface) { var i = this.iface(d, s.gIface); return i ? i.ip : null; }
    return s.global;
  };
  P.natRecord = function (d, e) {
    var k = JSON.stringify([e.proto, e.ig, e.il, e.og]);
    if (d.natTable.some(function (x) { return x.key === k; })) return;
    e.key = k; e.t = Date.now();
    d.natTable.push(e);
    if (d.natTable.length > 60) d.natTable.shift();
  };
  /* NAT : traduction en sortie (intérieur -> extérieur) */
  P.natOut = function (d, pkt, egr) {
    var self = this;
    /* statique d'abord */
    for (var i = 0; i < d.cfg.natStatic.length; i++) {
      var s = d.cfg.natStatic[i];
      if (s.local !== pkt.src) continue;
      if (s.proto) {
        if (pkt.proto !== s.proto || pkt.sport !== s.lport) continue;
        pkt.src = self.natGlobalIP(d, s); pkt.sport = s.gport;
        return true;
      }
      pkt.src = self.natGlobalIP(d, s);
      return true;
    }
    for (var j = 0; j < d.cfg.natDyn.length; j++) {
      var r = d.cfg.natDyn[j];
      if (!aclPermits(d, r.acl, pkt.src)) continue;
      var gip;
      if (r.iface) { var ii = this.iface(d, r.iface); gip = ii && ii.ip; }
      else if (r.pool && d.cfg.natPools[r.pool]) gip = d.cfg.natPools[r.pool].start;
      if (gip == null) continue;
      var lport = pkt.proto === 'icmp' ? pkt.id : pkt.sport;
      var gport = lport;
      /* PAT : garde le port si libre */
      var used = d.natTable.some(function (e) { return e.gip === gip && e.gport === gport && e.lip !== pkt.src; });
      if (used) gport = 1024 + (d.natTable.length % 60000);
      var e = { proto: pkt.proto, gip: gip, gport: gport, lip: pkt.src, lport: lport, oip: pkt.dst, oport: pkt.proto === 'icmp' ? lport : pkt.dport };
      e.ig = N.int2ip(gip) + ':' + gport; e.il = N.int2ip(pkt.src) + ':' + lport;
      e.og = N.int2ip(pkt.dst) + ':' + e.oport;
      e.key = JSON.stringify([e.proto, e.ig, e.il, e.og]);
      if (!d.natTable.some(function (x) { return x.key === e.key; })) { e.t = Date.now(); d.natTable.push(e); }
      pkt.src = gip;
      if (pkt.proto === 'icmp') pkt.id = gport; else pkt.sport = gport;
      return true;
    }
    return false;
  };

  /* Acheminement d'un paquet IPv4 depuis un équipement.
     pkt = {src, dst, proto:'icmp'|'udp'|'tcp', sport, dport, id, ttl}
     Retour : {status:'ok'|'timeout'|'unreach'|'ttl'|'storm', dev (où il est arrivé), from (IP qui répond en cas d'erreur), hops[] } */
  P.forward = function (d0, pkt, st) {
    st = st || {};
    var hops = [d0.name], cur = null;
    var ttl0 = pkt.ttl || 128;
    pkt.ttl = ttl0;
    /* 1. émission depuis l'origine */
    if (d0.host) {
      var nic = this.hostIface(d0);
      if (d0.host.ip == null) return { status: 'noip', hops: hops };
      if (pkt.dst === d0.host.ip) return { status: 'ok', dev: d0, hops: hops, ttl: pkt.ttl };
      if (!this.physUp(d0, nic.name)) return { status: 'timeout', hops: hops };
      var nh = N.sameNet(pkt.dst, d0.host.ip, d0.host.len) ? pkt.dst : d0.host.gw;
      if (pkt.dst === N.bcastOf(d0.host.ip, d0.host.len)) return { status: 'timeout', hops: hops };
      if (nh == null) return { status: 'timeout', hops: hops };
      cur = this.arp(d0, nic, nh, st);
      if (!cur) return { status: st.storm ? 'storm' : 'timeout', hops: hops };
    } else if (d0.cat === 'switch' || (d0.cat === 'l3switch' && !d0.cfg.ipRouting)) {
      var self0 = this;
      var svi = d0.ifaces.filter(function (i) { return /^Vlan/.test(i.name) && i.ip != null && self0.l3Up(d0, i); })[0];
      if (!svi) return { status: 'noip', hops: hops };
      if (pkt.src == null) pkt.src = svi.ip;
      if (pkt.dst === svi.ip) return { status: 'ok', dev: d0, hops: hops, ttl: pkt.ttl };
      var nhs = N.sameNet(pkt.dst, svi.ip, svi.len) ? pkt.dst : d0.cfg.defGw;
      if (nhs == null) return { status: 'timeout', hops: hops };
      cur = this.arp(d0, svi, nhs, st);
      if (!cur) return { status: st.storm ? 'storm' : 'timeout', hops: hops };
    } else {
      if (this.allIPs(d0).indexOf(pkt.dst) >= 0) return { status: 'ok', dev: d0, hops: hops, ttl: pkt.ttl };
      var eg = this.egressFor(d0, pkt.dst);
      if (!eg) return { status: 'unreach', from: pkt.src, hops: hops };
      var ei = this.iface(d0, eg.iface);
      if (pkt.src == null) pkt.src = ei.ip;
      cur = this.arp(d0, ei, eg.nh, st);
      if (!cur) return { status: st.storm ? 'storm' : 'timeout', hops: hops };
    }
    /* 2. saut par saut */
    /* un routeur décrémente toujours le TTL (255 au plus) : une boucle de routage finit en « TTL expired » */
    for (var guard = 0; guard < 300; guard++) {
      var d = cur.dev, ing = cur.ifc;
      hops.push(d.name);
      if (d.host) {
        if (d.host.ip === pkt.dst) return { status: 'ok', dev: d, hops: hops, ttl: pkt.ttl };
        return { status: 'timeout', hops: hops };
      }
      if (d.cat === 'switch' || (d.cat === 'l3switch' && !d.cfg.ipRouting)) {
        if (this.ownsIP(d, ing, pkt.dst, false)) return { status: 'ok', dev: d, hops: hops, ttl: pkt.ttl };
        return { status: 'timeout', hops: hops };
      }
      /* routeur */
      if (!this.l3Up(d, ing)) return { status: 'timeout', hops: hops };
      if (ing.natOut) this.natIn(d, pkt);
      var mine = this.allIPs(d).indexOf(pkt.dst) >= 0 || this.ownsIP(d, ing, pkt.dst, true);
      if (mine) return { status: 'ok', dev: d, hops: hops, ttl: pkt.ttl };
      pkt.ttl -= 1;
      if (pkt.ttl <= 0) return { status: 'ttl', from: ing.ip, dev: d, hops: hops };
      var e2 = this.egressFor(d, pkt.dst);
      if (!e2) return { status: 'unreach', from: ing.ip, dev: d, hops: hops };
      var out = this.iface(d, e2.iface);
      if (ing.natIn && out.natOut) this.natOut(d, pkt, out);
      var nxt = this.arp(d, out, e2.nh, st);
      if (!nxt) return { status: st.storm ? 'storm' : 'timeout', dev: d, hops: hops };
      cur = nxt;
    }
    return { status: 'timeout', hops: hops };
  };

  /* Ping complet (aller + retour) : renvoie la liste des résultats d'écho */
  P.ping = function (src, dstIp, count, opts) {
    opts = opts || {};
    var results = [];
    for (var n = 0; n < count; n++) {
      var st = {};
      var id = 1 + n;
      var req = { src: opts.srcIp != null ? opts.srcIp : (src.host ? src.host.ip : null), dst: dstIp, proto: 'icmp', id: id, ttl: src.host ? 128 : 255 };
      var origSrc = req.src;
      var f = this.forward(src, req, st);
      if (f.status === 'noip') { results.push({ status: 'noip' }); continue; }
      if (f.status !== 'ok') {
        if (f.status === 'unreach' || f.status === 'ttl') {
          /* le message ICMP doit revenir */
          var back = this.forward(this.dev(f.dev ? f.dev.name : src.name), { src: f.from, dst: origSrc != null ? origSrc : req.src, proto: 'icmp', id: id, ttl: 255 }, {});
          results.push(back.status === 'ok' ? { status: f.status, from: f.from } : { status: 'timeout' });
        } else results.push({ status: f.status === 'storm' ? 'timeout' : 'timeout', storm: f.status === 'storm' });
        continue;
      }
      /* réponse : de la cible vers la source (telle que vue par la cible) */
      var target = f.dev;
      var rep = { src: req.dst, dst: req.src, proto: 'icmp', id: req.id, ttl: target.host ? 128 : 255 };
      var r = this.forward(target, rep, st);
      if (r.status === 'ok' && r.dev === src) {
        if (st.arpMiss && n === 0 && !opts.noArpLoss) { results.push({ status: 'timeout', arp: true }); continue; }
        results.push({ status: 'ok', ttl: rep.ttl, from: dstIp, hops: f.hops });
      } else results.push({ status: 'timeout' });
    }
    return results;
  };
  /* Joignabilité simple (pour les vérifications) */
  P.canPing = function (a, b) {
    var da = typeof a === 'string' ? this.dev(a) : a;
    var ip = typeof b === 'number' ? b : (N.isIP(b) ? N.ip2int(b) : this.firstIP(this.dev(b)));
    if (ip == null || !da) return false;
    var r = this.ping(da, ip, 2, { noArpLoss: true });
    return r.some(function (x) { return x.status === 'ok'; });
  };
  P.traceroute = function (src, dstIp) {
    var hops = [];
    for (var t = 1; t <= 30; t++) {
      var pkt = { src: src.host ? src.host.ip : null, dst: dstIp, proto: 'icmp', id: 100 + t, ttl: t };
      var f = this.forward(src, pkt, {});
      if (f.status === 'ok') { hops.push({ ip: dstIp, ok: true }); break; }
      if (f.status === 'ttl') hops.push({ ip: f.from, ok: true });
      else if (f.status === 'unreach') { hops.push({ ip: f.from, unreach: true }); break; }
      else hops.push({ ip: null });
      if (hops.length >= 30) break;
    }
    return hops;
  };

  /* Transport applicatif (UDP/TCP) aller-retour : renvoie l'équipement atteint */
  P.transact = function (src, dstIp, proto, dport) {
    var sport = 1025 + Math.floor(Math.random() * 3000);
    var req = { src: src.host ? src.host.ip : null, dst: dstIp, proto: proto, sport: sport, dport: dport, ttl: 128 };
    var f = this.forward(src, req, {});
    if (f.status !== 'ok') return { ok: false, status: f.status };
    var target = f.dev;
    var rep = { src: req.dst, dst: req.src, proto: proto, sport: req.dport, dport: req.sport, ttl: 128 };
    var r = this.forward(target, rep, {});
    if (r.status !== 'ok' || r.dev !== src) return { ok: false, status: 'timeout' };
    return { ok: true, dev: target, port: req.dport };
  };

  /* ---------------------------------------------------------- */
  /* DHCP                                                        */
  /* ---------------------------------------------------------- */
  function poolNet(p) {
    var start = N.ip2int(p.start), len = N.maskLen(p.mask);
    if (start == null || len < 0) return null;
    return { net: N.netOf(start, len), len: len, start: start };
  }
  P.serverAllocate = function (srv, giaddr, mac, domainUsed) {
    var dh = srv.services.dhcp;
    if (!dh.on) return null;
    var ref = giaddr != null ? giaddr : srv.host.ip;
    if (ref == null) return null;
    var pool = null;
    dh.pools.forEach(function (p) {
      var pn = poolNet(p);
      if (!pool && pn && N.sameNet(ref, pn.net, pn.len)) pool = p;
    });
    if (!pool) return null;
    var pn = poolNet(pool);
    srv.dhcpLeases = srv.dhcpLeases || {};
    var key = N.macHex(mac);
    var lease = srv.dhcpLeases[key];
    if (lease && N.sameNet(lease.ip, pn.net, pn.len)) return { ip: lease.ip, len: pn.len, gw: N.ip2int(pool.gateway), dns: N.ip2int(pool.dns) };
    var used = {};
    Object.keys(srv.dhcpLeases).forEach(function (k) { used[srv.dhcpLeases[k].ip] = 1; });
    (domainUsed || []).forEach(function (ip) { used[ip] = 1; });
    used[srv.host.ip] = 1;
    for (var i = 0; i < (pool.max || 256); i++) {
      var ip = pn.start + i;
      if (!N.sameNet(ip, pn.net, pn.len) || ip === N.bcastOf(pn.net, pn.len)) break;
      if (ip === pn.net) continue;
      if (used[ip]) continue;
      srv.dhcpLeases[key] = { ip: ip, mac: mac, pool: pool.name };
      var gw = N.ip2int(pool.gateway), dns = N.ip2int(pool.dns);
      return { ip: ip, len: pn.len, gw: gw && gw !== 0 ? gw : null, dns: dns && dns !== 0 ? dns : null };
    }
    return null;
  };
  P.routerAllocate = function (r, ref, mac, domainUsed) {
    var pools = r.cfg.dhcpPools, pool = null, pname = null;
    Object.keys(pools).forEach(function (n) {
      var p = pools[n];
      if (!pool && p.net != null && N.sameNet(ref, p.net, p.len)) { pool = p; pname = n; }
    });
    if (!pool) return null;
    r.dhcpLeases = r.dhcpLeases || {};
    var key = N.macHex(mac);
    var lease = r.dhcpLeases[key];
    if (lease && N.sameNet(lease.ip, pool.net, pool.len)) return { ip: lease.ip, len: pool.len, gw: pool.routers[0] || null, dns: pool.dns[0] || null };
    var used = {};
    Object.keys(r.dhcpLeases).forEach(function (k) { used[r.dhcpLeases[k].ip] = 1; });
    (domainUsed || []).forEach(function (ip) { used[ip] = 1; });
    this.allIPs(r).forEach(function (ip) { used[ip] = 1; });
    var bc = N.bcastOf(pool.net, pool.len);
    for (var ip = pool.net + 1; ip < bc; ip++) {
      if (used[ip]) continue;
      if (r.cfg.dhcpExcl.some(function (x) { return ip >= x[0] && ip <= x[1]; })) continue;
      r.dhcpLeases[key] = { ip: ip, mac: mac, pool: pname };
      return { ip: ip, len: pool.len, gw: pool.routers[0] || null, dns: pool.dns[0] || null };
    }
    return null;
  };
  /* Demande DHCP complète d'un hôte */
  P.dhcpRequest = function (h) {
    var nic = this.hostIface(h);
    h.host.ip = null; h.host.len = null;
    if (!h.power || !this.physUp(h, nic.name)) return this.dhcpFail(h);
    var dom = this.l2Domain(h, nic);
    if (dom.storm) return this.dhcpFail(h);
    var self = this;
    var usedStatic = dom.endpoints.filter(function (e) { return e.dev.host && e.dev !== h && e.dev.host.ip != null && !e.dev.host.dhcp; })
      .map(function (e) { return e.dev.host.ip; });
    var got = null;
    /* 1. serveurs du même domaine */
    dom.endpoints.forEach(function (e) {
      if (got || e.dev === h || !e.dev.power) return;
      if (e.dev.cat === 'server' && e.dev.services.dhcp.on && e.dev.host.ip != null && self.physUp(e.dev, e.ifc.name)) {
        got = self.serverAllocate(e.dev, null, nic.mac, usedStatic);
      }
    });
    /* 2. routeurs : pool local ou relais */
    dom.endpoints.forEach(function (e) {
      if (got || e.dev.cat !== 'router' || !e.dev.power || !self.l3Up(e.dev, e.ifc) || e.ifc.ip == null) return;
      got = self.routerAllocate(e.dev, e.ifc.ip, nic.mac, usedStatic);
      if (got) return;
      e.ifc.helper.forEach(function (hip) {
        if (got) return;
        /* aller-retour routé entre le relais et le serveur */
        var tr = self.forward(e.dev, { src: e.ifc.ip, dst: hip, proto: 'udp', sport: 67, dport: 67, ttl: 255 }, {});
        if (tr.status !== 'ok') return;
        var srv = tr.dev;
        var back = self.forward(srv, { src: hip, dst: e.ifc.ip, proto: 'udp', sport: 67, dport: 67, ttl: 128 }, {});
        if (back.status !== 'ok') return;
        if (srv.cat === 'server') got = self.serverAllocate(srv, e.ifc.ip, nic.mac, usedStatic);
        else if (srv.cat === 'router') got = self.routerAllocate(srv, e.ifc.ip, nic.mac, usedStatic);
      });
    });
    if (!got) return this.dhcpFail(h);
    h.host.ip = got.ip; h.host.len = got.len; h.host.gw = got.gw; h.host.dns = got.dns;
    h.host.dhcpMsg = 'DHCP request successful.';
    this.touch();
    return true;
  };
  P.dhcpFail = function (h) {
    var hx = N.macHex(this.hostIface(h).mac);
    h.host.ip = N.ip2int('169.254.' + parseInt(hx.slice(8, 10), 16) + '.' + (parseInt(hx.slice(10, 12), 16) || 1));
    h.host.len = 16; h.host.gw = null; h.host.dns = null;
    h.host.dhcpMsg = 'DHCP failed. APIPA is being used.';
    this.touch();
    return false;
  };
  P.dhcpRelease = function (h) {
    h.host.ip = null; h.host.len = null; h.host.gw = null; h.host.dns = null;
    this.touch();
  };

  /* ---------------------------------------------------------- */
  /* DNS / HTTP                                                  */
  /* ---------------------------------------------------------- */
  P.dnsResolve = function (h, name) {
    name = String(name).trim().toLowerCase().replace(/\.$/, '');
    if (N.isIP(name)) return { ok: true, ip: N.ip2int(name) };
    if (!h.host || h.host.dns == null) return { ok: false, err: 'noserver' };
    var tr = this.transact(h, h.host.dns, 'udp', 53);
    if (!tr.ok) return { ok: false, err: 'timeout', server: h.host.dns };
    var srv = tr.dev;
    if (srv.cat !== 'server' || !srv.services.dns.on) return { ok: false, err: 'refused', server: h.host.dns };
    var recs = srv.services.dns.records;
    for (var hop = 0; hop < 8; hop++) {
      var a = recs.filter(function (r) { return r.name.toLowerCase().replace(/\.$/, '') === name; });
      var A = a.filter(function (r) { return r.type === 'A'; })[0];
      if (A && N.isIP(A.value)) return { ok: true, ip: N.ip2int(A.value), server: h.host.dns, name: name };
      var C = a.filter(function (r) { return r.type === 'CNAME'; })[0];
      if (C) { name = C.value.toLowerCase().replace(/\.$/, ''); continue; }
      break;
    }
    return { ok: false, err: 'nxdomain', server: h.host.dns };
  };
  P.httpGet = function (h, url) {
    var m = /^\s*(?:(https?):\/\/)?([^\/:\s]+)(?::(\d+))?(\/[^\s]*)?\s*$/i.exec(url || '');
    if (!m) return { ok: false, err: 'badurl' };
    var scheme = (m[1] || 'http').toLowerCase();
    var port = m[3] ? +m[3] : (scheme === 'https' ? 443 : 80);
    var r = this.dnsResolve(h, m[2]);
    if (!r.ok) return { ok: false, err: 'dns', host: m[2] };
    var tr = this.transact(h, r.ip, 'tcp', port);
    if (!tr.ok) return { ok: false, err: 'timeout' };
    var srv = tr.dev;
    if (srv.cat !== 'server') return { ok: false, err: 'timeout' };
    if (tr.port === 80 && !srv.services.http.on) return { ok: false, err: 'timeout' };
    if (tr.port === 443 && srv.services.http.https === false) return { ok: false, err: 'timeout' };
    if (tr.port !== 80 && tr.port !== 443) return { ok: false, err: 'timeout' };
    return { ok: true, server: srv, page: srv.services.http.pages, path: m[4] || '/', url: scheme + '://' + m[2] + (m[3] ? ':' + m[3] : '') + (m[4] || '') };
  };

  /* ---------------------------------------------------------- */
  /* Messagerie : service EMAIL des serveurs, client Email des PC */
  /* ---------------------------------------------------------- */
  P.mailSvc = function (srv) {
    var s = srv.services.email = srv.services.email || {};
    if (s.smtp == null) s.smtp = true;
    if (s.pop3 == null) s.pop3 = true;
    if (s.domain == null) s.domain = '';
    s.users = s.users || [];
    s.boxes = s.boxes || {};
    return s;
  };
  P.mailCfg = function (h) {
    h.host.mail = h.host.mail || { name: '', addr: '', inSrv: '', outSrv: '', user: '', pw: '', inbox: [] };
    return h.host.mail;
  };
  /* serveur de messagerie d'un domaine, vu depuis « from » : MX puis A */
  P.mailHost = function (from, domain) {
    if (!from.host || from.host.dns == null) return null;
    var tr = this.transact(from, from.host.dns, 'udp', 53);
    if (!tr.ok || tr.dev.cat !== 'server' || !tr.dev.services.dns.on) return null;
    var recs = tr.dev.services.dns.records;
    function same(a, b) { return String(a).toLowerCase().replace(/\.$/, '') === String(b).toLowerCase().replace(/\.$/, ''); }
    var mx = recs.filter(function (r) { return r.type === 'MX' && same(r.name, domain); })[0];
    var r = this.dnsResolve(from, mx ? mx.value : domain);
    return r.ok ? r.ip : null;
  };
  /* dépose un message dans la boîte d'un utilisateur du serveur (relais SMTP si autre domaine) */
  P.mailDeliver = function (srv, msg, hops) {
    var es = this.mailSvc(srv);
    var p = msg.to.split('@'), user = p[0].toLowerCase(), dom = (p[1] || '').toLowerCase();
    if (es.domain && dom === es.domain.toLowerCase()) {
      if (!es.users.some(function (u) { return u.name.toLowerCase() === user; })) return false;
      (es.boxes[user] = es.boxes[user] || []).push(msg);
      return true;
    }
    if (hops > 3) return false;
    var dst = this.mailHost(srv, dom);
    if (dst == null) return false;
    var tr = this.transact(srv, dst, 'tcp', 25);
    if (!tr.ok || tr.dev === srv || tr.dev.cat !== 'server' || !this.mailSvc(tr.dev).smtp) return false;
    return this.mailDeliver(tr.dev, msg, hops + 1);
  };
  P.mailSend = function (h, to, subject, body) {
    var c = this.mailCfg(h), log = ['Sending mail to ' + to + ' , with subject : ' + subject + ' ..', 'Mail Server: ' + (c.outSrv || '?')];
    if (!c.addr || !c.outSrv) return { ok: false, log: log.concat(['Send Mail Failed.', '(Configure Mail : adresse e-mail et serveur sortant obligatoires)']) };
    if (!/^[^@\s]+@[^@\s]+$/.test(to)) return { ok: false, log: log.concat(['Send Mail Failed.', '(adresse du destinataire invalide)']) };
    var r = this.dnsResolve(h, c.outSrv);
    if (!r.ok) return { ok: false, log: log.concat(['Unknown Mail Server.']) };
    var tr = this.transact(h, r.ip, 'tcp', 25);
    if (!tr.ok || tr.dev.cat !== 'server' || !this.mailSvc(tr.dev).smtp) return { ok: false, log: log.concat(['Send Mail Failed.']) };
    var msg = { from: c.addr, to: to.toLowerCase(), subject: subject, body: body, date: new Date().toISOString() };
    if (!this.mailDeliver(tr.dev, msg, 0)) return { ok: false, log: log.concat(['Send Mail Failed.']) };
    this.touch();
    return { ok: true, log: log.concat(['Send Success.']) };
  };
  P.mailReceive = function (h) {
    var c = this.mailCfg(h), log = ['Receiving mail from POP3 Server ' + (c.inSrv || '?')];
    if (!c.inSrv || !c.user) return { ok: false, n: 0, log: log.concat(['Receive Mail Failed.', '(Configure Mail : serveur entrant et nom d’utilisateur obligatoires)']) };
    var r = this.dnsResolve(h, c.inSrv);
    if (!r.ok) return { ok: false, n: 0, log: log.concat(['Unknown Mail Server.']) };
    var tr = this.transact(h, r.ip, 'tcp', 110);
    if (!tr.ok || tr.dev.cat !== 'server' || !this.mailSvc(tr.dev).pop3) return { ok: false, n: 0, log: log.concat(['Receive Mail Failed.']) };
    var es = this.mailSvc(tr.dev), user = c.user.toLowerCase();
    var u = es.users.filter(function (x) { return x.name.toLowerCase() === user; })[0];
    if (!u || u.pw !== c.pw) return { ok: false, n: 0, log: log.concat(['Receive Mail Failed: Authentication failed.']) };
    var box = es.boxes[user] || [];
    c.inbox = c.inbox.concat(box);
    es.boxes[user] = [];
    this.touch();
    return { ok: true, n: box.length, log: log.concat(['Receive Mail Success.' + (box.length ? '' : ' (no new mail)')]) };
  };

  /* ---------------------------------------------------------- */
  /* IPv6                                                        */
  /* ---------------------------------------------------------- */
  P.ll6 = function (d, ifc) {
    if (d.host) return d.host.v6ll || N.linkLocal(ifc.mac);
    return ifc.v6.ll || N.linkLocal(ifc.mac);
  };
  P.v6On = function (d, ifc) {
    if (d.host) return true;
    return ifc.v6.enabled || ifc.v6.addrs.length > 0 || !!ifc.v6.ll;
  };
  P.v6Addrs = function (d, ifc) {
    /* [{w,len}] globales/ULA de l'interface */
    if (d.host) return this.hostV6(d).addrs;
    return ifc.v6.addrs.map(function (a) {
      return { w: a.eui ? N.withEui64(a.w, ifc.mac) : a.w, len: a.len };
    });
  };
  /* configuration IPv6 effective d'un hôte (statique ou SLAAC) */
  P.hostV6 = function (h) {
    var nic = this.hostIface(h), self = this;
    if (!h.host.v6auto) return { addrs: h.host.v6.slice(), gw: h.host.v6gw, dns: h.host.v6dns };
    var res = { addrs: [], gw: null, dns: null };
    if (!this.physUp(h, nic.name)) return res;
    var dom = this.l2Domain(h, nic);
    dom.endpoints.forEach(function (e) {
      if (res.gw || e.dev.cat !== 'router' || !e.dev.cfg.ipv6Routing || !self.l3Up(e.dev, e.ifc)) return;
      var pref = self.v6Addrs(e.dev, e.ifc).filter(function (a) { return a.len === 64 && N.type6(a.w) !== 'link-local'; })[0];
      if (!pref) return;
      res.addrs.push({ w: N.withEui64(N.net6(pref.w, 64), nic.mac), len: 64 });
      res.gw = self.ll6(e.dev, e.ifc);
      if (e.ifc.v6.dhcp && e.ifc.v6.ndO) {
        var pool = e.dev.cfg.dhcp6Pools[e.ifc.v6.dhcp];
        if (pool && pool.dns.length) res.dns = pool.dns[0];
      }
    });
    return res;
  };
  P.owns6 = function (d, ifc, w) {
    if (N.eq6(N.fmt6(this.ll6(d, ifc)), N.fmt6(w))) return true;
    return this.v6Addrs(d, ifc).some(function (a) { return N.eq6(N.fmt6(a.w), N.fmt6(w)); });
  };
  P.nd = function (d, ifc, w) {
    var dom = this.l2Domain(d, ifc), self = this, hit = null;
    if (dom.storm) return null;
    dom.endpoints.forEach(function (e) {
      if (hit || (e.dev === d && e.ifc === ifc) || !e.dev.power) return;
      if (e.dev.host) { if (self.physUp(e.dev, e.ifc.name) && self.owns6(e.dev, e.ifc, w)) hit = e; return; }
      if (self.l3Up(e.dev, e.ifc) && self.v6On(e.dev, e.ifc) && self.owns6(e.dev, e.ifc, w)) hit = e;
    });
    return hit;
  };
  P.routeTable6 = function (d) {
    var self = this, t = [];
    d.ifaces.forEach(function (i) {
      if (!self.l3Up(d, i) || !self.v6On(d, i)) return;
      self.v6Addrs(d, i).forEach(function (a) {
        t.push({ code: 'C', w: N.net6(a.w, a.len), len: a.len, iface: i.name, ad: 0 });
        t.push({ code: 'L', w: a.w, len: 128, iface: i.name, ad: 0, local: true });
      });
    });
    if (d.cfg.ipv6Routing) {
      d.cfg.routes6.forEach(function (s) {
        var ok;
        if (s.iface) ok = !!self.iface(d, s.iface) && self.l3Up(d, self.iface(d, s.iface));
        else ok = t.some(function (c) { return !c.local && N.sameNet6(s.nh, c.w, c.len); });
        if (ok) t.push({ code: 'S', w: N.net6(s.w, s.len), len: s.len, nh: s.nh, iface: s.iface, ad: 1 });
      });
    }
    return t;
  };
  P.lookup6 = function (d, w) {
    var t = this.routeTable6(d), best = null;
    t.forEach(function (r) { if (N.sameNet6(w, r.w, r.len) && (!best || r.len > best.len)) best = r; });
    return best;
  };
  P.forward6 = function (d0, pkt) {
    var hops = [d0.name], cur = null, self = this;
    if (d0.host) {
      var nic = this.hostIface(d0), cfg = this.hostV6(d0);
      if (this.owns6(d0, nic, pkt.dst)) return { status: 'ok', dev: d0, hops: hops, ttl: pkt.ttl };
      if (!this.physUp(d0, nic.name)) return { status: 'timeout', hops: hops };
      var local = N.type6(pkt.dst) === 'link-local' || cfg.addrs.some(function (a) { return N.sameNet6(pkt.dst, a.w, a.len); });
      var nh = local ? pkt.dst : cfg.gw;
      if (!nh) return { status: 'timeout', hops: hops };
      cur = this.nd(d0, nic, nh);
      if (!cur) return { status: 'timeout', hops: hops };
    } else {
      var own = d0.ifaces.some(function (i) { return self.v6On(d0, i) && self.owns6(d0, i, pkt.dst); });
      if (own) return { status: 'ok', dev: d0, hops: hops, ttl: pkt.ttl };
      var r0 = this.lookup6(d0, pkt.dst);
      if (!r0) return { status: 'unreach', hops: hops };
      var ifn0 = r0.iface, nh0 = pkt.dst;
      if (r0.code === 'S' && r0.nh) { nh0 = r0.nh; if (!ifn0) { var rr = this.lookup6(d0, r0.nh); if (!rr) return { status: 'unreach', hops: hops }; ifn0 = rr.iface; } }
      cur = this.nd(d0, this.iface(d0, ifn0), nh0);
      if (!cur) return { status: 'timeout', hops: hops };
    }
    for (var g = 0; g < 64; g++) {
      var d = cur.dev, ing = cur.ifc;
      hops.push(d.name);
      if (d.host) return this.owns6(d, ing, pkt.dst) ? { status: 'ok', dev: d, hops: hops, ttl: pkt.ttl } : { status: 'timeout', hops: hops };
      if (d.cat !== 'router' || !d.cfg.ipv6Routing) {
        var mine0 = d.ifaces.some(function (i) { return self.v6On(d, i) && self.owns6(d, i, pkt.dst); });
        return mine0 ? { status: 'ok', dev: d, hops: hops, ttl: pkt.ttl } : { status: 'timeout', hops: hops };
      }
      var mine = d.ifaces.some(function (i) { return self.l3Up(d, i) && self.v6On(d, i) && self.owns6(d, i, pkt.dst); });
      if (mine) return { status: 'ok', dev: d, hops: hops, ttl: pkt.ttl };
      pkt.ttl--;
      if (pkt.ttl <= 0) return { status: 'ttl', hops: hops };
      var r = this.lookup6(d, pkt.dst);
      if (!r) return { status: 'unreach', from: this.v6Addrs(d, ing)[0] ? this.v6Addrs(d, ing)[0].w : this.ll6(d, ing), dev: d, hops: hops };
      var ifn = r.iface, nh2 = pkt.dst;
      if (r.code === 'S' && r.nh) {
        nh2 = r.nh;
        if (!ifn) { var r2 = this.lookup6(d, r.nh); if (!r2) return { status: 'unreach', dev: d, hops: hops }; ifn = r2.iface; }
      }
      var nxt = this.nd(d, this.iface(d, ifn), nh2);
      if (!nxt) return { status: 'timeout', dev: d, hops: hops };
      cur = nxt;
    }
    return { status: 'timeout', hops: hops };
  };
  P.srcAddr6 = function (d, dstW) {
    if (d.host) {
      var cfg = this.hostV6(d);
      if (N.type6(dstW) === 'link-local') return this.ll6(d, this.hostIface(d));
      return cfg.addrs[0] ? cfg.addrs[0].w : this.ll6(d, this.hostIface(d));
    }
    var r = this.lookup6(d, dstW);
    if (!r) return null;
    var ifn = r.iface;
    if (!ifn && r.nh) { var r2 = this.lookup6(d, r.nh); ifn = r2 && r2.iface; }
    var i = this.iface(d, ifn);
    var a = i && this.v6Addrs(d, i)[0];
    return a ? a.w : (i ? this.ll6(d, i) : null);
  };
  P.ping6 = function (src, dstW, count) {
    var out = [];
    for (var n = 0; n < count; n++) {
      var s = this.srcAddr6(src, dstW);
      if (!s) { out.push({ status: 'timeout' }); continue; }
      var f = this.forward6(src, { src: s, dst: dstW, ttl: src.host ? 128 : 64 });
      if (f.status !== 'ok') { out.push({ status: f.status === 'unreach' ? 'unreach' : 'timeout', from: f.from }); continue; }
      var rep = { src: dstW, dst: s, ttl: f.dev.host ? 128 : 64 };
      var r = this.forward6(f.dev, rep);
      out.push(r.status === 'ok' && r.dev === src ? { status: 'ok', ttl: rep.ttl } : { status: 'timeout' });
    }
    return out;
  };
  P.canPing6 = function (a, dst) {
    var da = typeof a === 'string' ? this.dev(a) : a;
    var w = typeof dst === 'string' ? N.parse6(dst) : dst;
    if (!w || !da) return false;
    return this.ping6(da, w, 2).some(function (x) { return x.status === 'ok'; });
  };

  /* ---------------------------------------------------------- */
  /* Sérialisation (sauvegarde de la progression)                */
  /* ---------------------------------------------------------- */
  P.toJSON = function () {
    return {
      devices: this.devices, links: this.links, notes: this.notes, shapes: this.shapes, hsrp: this.hsrp
    };
  };
  P.load = function (o) {
    var j = JSON.parse(JSON.stringify(o));
    this.devices = j.devices || [];
    this.links = j.links || [];
    this.notes = j.notes || [];
    this.shapes = j.shapes || [];
    this.hsrp = j.hsrp || {};
    this.touch();
  };
  P.clone = function () { var n = new Net(); n.load(this.toJSON()); return n; };

  var Engine = {
    Net: Net, MODELS: MODELS, modelInfo: modelInfo, newDevice: newDevice, newIface: newIface,
    canonIf: canonIf, canonIfType: canonIfType, shortIf: shortIf, splitIf: splitIf, speedOf: speedOf,
    genMac: genMac, hsrpMac: hsrpMac, IFTYPES: IFTYPES, portCost: portCost
  };
  root.PTEngine = Engine;
  if (typeof module !== 'undefined') module.exports = Engine;
})(typeof window !== 'undefined' ? window : globalThis);
