/* ============================================================
   Boîte à outils des labos : construction, solutions, contrôles
   ============================================================ */
(function (root) {
  'use strict';
  var N = root.NET, E = root.PTEngine, IOS = root.IOS;
  var LAB = {};

  /* topologie extraite d'un .pkt du cours */
  LAB.topo = function (key) {
    var n = new E.Net();
    n.loadTopo(root.PT_TOPOS[key]);
    n.events = [];
    return n;
  };
  /* topologie construite à la main :
     {devices:[[nom, modèle, x, y]], links:[[a, portA, b, portB, câble]], notes:[[x, y, texte]],
      cli:{nom:[lignes]}, hosts:{nom:{ip,mask,gw,dns}}, on:[nom routeur dont on active les interfaces]} */
  LAB.make = function (spec) {
    var n = new E.Net();
    (spec.devices || []).forEach(function (d) { n.addDevice(d[1], d[2], d[3], d[0]); });
    (spec.links || []).forEach(function (l) { n.connect(l[0], l[1], l[2], l[3], l[4], true); });
    n.notes = (spec.notes || []).map(function (x) { return { x: x[0], y: x[1], text: x[2] }; });
    Object.keys(spec.cli || {}).forEach(function (k) { LAB.cli(n, k, spec.cli[k]); });
    Object.keys(spec.hosts || {}).forEach(function (k) { LAB.host(n, k, spec.hosts[k]); });
    /* un équipement préconfiguré est considéré comme enregistré (comme dans un .pkt fourni) */
    Object.keys(spec.cli || {}).forEach(function (k) {
      var d = n.dev(k);
      if (d) d.startup = JSON.parse(JSON.stringify({ hostname: d.hostname, cfg: d.cfg, ifaces: d.ifaces }));
    });
    n.events = [];
    n.touch();
    return n;
  };
  /* « enregistre » la config de tous les équipements (comme un .pkt sauvegardé après write memory) */
  LAB.save = function (n) {
    n.devices.forEach(function (d) {
      if (d.cat !== 'pc' && d.cat !== 'server') d.startup = JSON.parse(JSON.stringify({ hostname: d.hostname, cfg: d.cfg, ifaces: d.ifaces }));
    });
    n.events = [];
    n.touch();
    return n;
  };
  /* état final d'un labo (départ + solution), pour enchaîner les TP d'un module à l'autre */
  LAB.solved = function (qid) {
    var q = null;
    (root.MODULES || []).forEach(function (m) { m.questions.forEach(function (x) { if (x.id === qid) q = x; }); });
    if (!q) throw new Error('labo inconnu ' + qid);
    var n = q.build ? q.build() : LAB.topo(q.topo);
    LAB.apply(n, q.solution);
    return LAB.save(n);
  };
  /* exécute des commandes IOS (mode privilégié) sans afficher les messages */
  LAB.cli = function (net, dev, lines) {
    var d = typeof dev === 'string' ? net.dev(dev) : dev;
    var s = new IOS.Session(net, d, { silent: true });
    s.mode = 'priv';
    var out = [];
    lines.forEach(function (l) {
      if (s.pending) { var p = s.pending; s.pending = null; p.handle.call(s, l, out); return; }
      out = out.concat(s.exec(l));
      if (s.pending && /confirm|filename/.test(s.pending.prompt || '')) { var p2 = s.pending; s.pending = null; p2.handle.call(s, '', out); }
      s.async = null;
    });
    net.touch();
    return out;
  };
  /* configure un hôte */
  LAB.host = function (net, dev, h) {
    var d = typeof dev === 'string' ? net.dev(dev) : dev;
    if (h.dhcp) { d.host.dhcp = true; net.dhcpRequest(d); return; }
    d.host.dhcp = false;
    if (h.ip != null) d.host.ip = N.ip2int(h.ip);
    if (h.mask != null) d.host.len = N.parseMask(h.mask);
    if (h.gw !== undefined) d.host.gw = h.gw ? N.ip2int(h.gw) : null;
    if (h.dns !== undefined) d.host.dns = h.dns ? N.ip2int(h.dns) : null;
    if (h.v6auto != null) d.host.v6auto = h.v6auto;
    net.touch();
  };
  /* applique une solution (liste d'étapes) */
  LAB.apply = function (net, sol) {
    (sol || []).forEach(function (s) {
      if (s.cli) LAB.cli(net, s.dev, s.cli);
      else if (s.host) LAB.host(net, s.dev, s.host);
      else if (s.dhcp) LAB.host(net, s.dev, { dhcp: true });
      else if (s.link) {
        var l = s.link;
        var ex = net.linkOf(l[0], l[1]); if (ex) net.disconnect(ex);
        var ex2 = net.linkOf(l[2], l[3]); if (ex2) net.disconnect(ex2);
        net.connect(l[0], l[1], l[2], l[3], l[4], true);
      }
      else if (s.fn) s.fn(net);
    });
    /* les PC en DHCP renouvellent leur bail */
    net.devices.forEach(function (d) { if (d.host && d.host.dhcp) net.dhcpRequest(d); });
    net.events = [];
    net.touch();
  };

  /* ---------- contrôles fréquents ---------- */
  LAB.ping = function (net, a, b) { return net.canPing(a, b); };
  LAB.noPing = function (net, a, b) { return !net.canPing(a, b); };
  LAB.hostIs = function (net, dev, ip, mask, gw) {
    var d = net.dev(dev); if (!d || !d.host) return false;
    if (ip && d.host.ip !== N.ip2int(ip)) return false;
    if (mask && d.host.len !== N.parseMask(mask)) return false;
    if (gw && d.host.gw !== N.ip2int(gw)) return false;
    return true;
  };
  LAB.hostInNet = function (net, dev, cidr) {
    var d = net.dev(dev), c = N.parseCIDR(cidr);
    return !!(d && d.host && d.host.ip != null && c && N.sameNet(d.host.ip, c.ip, c.len) && d.host.len === c.len);
  };
  /* le PC obtient-il bien une adresse par DHCP dans ce réseau ? (renouvelle) */
  LAB.dhcpGets = function (net, dev, cidr, gw) {
    var d = net.dev(dev);
    if (!d || !d.host || !d.host.dhcp) return false;
    net.dhcpRequest(d);
    if (!LAB.hostInNet(net, dev, cidr)) return false;
    if (gw && d.host.gw !== N.ip2int(gw)) return false;
    return true;
  };
  LAB.ifIp = function (net, dev, ifn, ip, mask) {
    var d = net.dev(dev), i = d && net.iface(d, ifn);
    return !!(i && i.ip === N.ip2int(ip) && (!mask || i.len === N.parseMask(mask)));
  };
  LAB.ifUp = function (net, dev, ifn) { var d = net.dev(dev); return !!d && net.l3Up(d, net.iface(d, ifn)); };
  LAB.hasRoute = function (net, dev, cidr, code) {
    var d = net.dev(dev), c = N.parseCIDR(cidr);
    return net.routeTable(d).some(function (r) { return r.net === c.ip && r.len === c.len && (!code || r.code.indexOf(code) === 0); });
  };
  LAB.vlanName = function (net, sw, id, name) {
    var d = net.dev(sw);
    return d.cfg.vlans.some(function (v) { return v.id === id && (!name || v.name.toLowerCase() === name.toLowerCase()); });
  };
  LAB.accessVlan = function (net, sw, ports, vid) {
    var d = net.dev(sw);
    return ports.every(function (p) {
      var i = net.iface(d, p);
      return i && i.sw && i.sw.access === vid && net.opMode(d, i) === 'access';
    });
  };
  LAB.isTrunk = function (net, sw, port) {
    var d = net.dev(sw), i = net.iface(d, port);
    return !!(i && i.sw && i.sw.mode === 'trunk');
  };
  LAB.linked = function (net, a, b, cable) {
    return net.links.some(function (l) {
      var ok = (l.a.dev === a && l.b.dev === b) || (l.a.dev === b && l.b.dev === a);
      return ok && (!cable || l.cable === cable) && net.cableOk(l);
    });
  };
  LAB.linkedPorts = function (net, a, ap, b, bp) {
    var l = net.linkOf(a, ap);
    if (!l || !net.cableOk(l)) return false;
    var o = l.a.dev === a && l.a.port === ap ? l.b : l.a;
    return o.dev === b && (!bp || o.port === bp);
  };
  /* « ssh -l user ip » depuis un PC, puis le mot de passe : la session s'ouvre-t-elle ? */
  LAB.sshLogin = function (net, pc, ip, user, pw) {
    var sh = new root.PCShell(net, net.dev(pc));
    sh.exec('ssh -l ' + user + ' ' + ip);
    if (!sh.pending) return false;
    sh.exec(pw);
    return !!sh.remote;
  };
  LAB.range = function (prefix, a, b) { var r = []; for (var i = a; i <= b; i++) r.push(prefix + i); return r; };

  root.LAB = LAB;
  if (typeof module !== 'undefined') module.exports = LAB;
})(typeof window !== 'undefined' ? window : globalThis);
