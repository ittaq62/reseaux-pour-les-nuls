/* ============================================================
   Émulateur de CLI Cisco IOS (routeurs, commutateurs)
   - modes : user > / priv # / (config) / (config-if) / ...
   - abréviations, "?", Tab, historique, messages d'erreur IOS
   - les commandes modifient le modèle du moteur (engine.js)
   ============================================================ */
(function (root) {
  'use strict';
  var N = root.NET || (typeof require !== 'undefined' ? require('../netutil.js') : null);
  var E = root.PTEngine || (typeof require !== 'undefined' ? require('./engine.js') : null);

  /* ---------------------------------------------------------- */
  /* Aide des mots-clés (textes IOS)                              */
  /* ---------------------------------------------------------- */
  var HELP = {
    'access-list': 'Add an access list entry', 'address': 'Configure IPv6 address on interface',
    'area': 'OSPF area parameters', 'arp': 'ARP table', 'auto-summary': 'Enable automatic network number summarization',
    'bandwidth': 'Set bandwidth informational parameter', 'banner': 'Define a login banner', 'binding': 'DHCP address bindings',
    'brief': 'Brief summary', 'cdp': 'Global CDP configuration subcommands', 'clear': 'Reset functions',
    'clock': 'Configure serial interface clock', 'configure': 'Enter configuration mode', 'copy': 'Copy from one file to another',
    'crypto': 'Encryption module', 'default-gateway': 'Specify default gateway (if not routing IP)',
    'default-information': 'Control distribution of default information', 'default-router': 'Default routers',
    'description': 'Interface specific description', 'dhcp': 'Configure DHCP server and relay parameters',
    'disable': 'Turn off privileged commands', 'dns-server': 'DNS servers', 'do': 'To run exec commands in config mode',
    'domain-lookup': 'Enable IP Domain Name System hostname translation', 'domain-name': 'Define the default domain name',
    'duplex': 'Configure duplex operation.', 'enable': 'Turn on privileged commands', 'encapsulation': 'Set encapsulation type for an interface',
    'end': 'Exit from configure mode', 'erase': 'Erase a filesystem', 'excluded-address': 'Prevent DHCP from assigning certain addresses',
    'exit': 'Exit from the EXEC', 'helper-address': 'Specify a destination address for UDP broadcasts',
    'history': 'Display the session command history', 'hostname': 'Set system\'s network name',
    'interface': 'Select an interface to configure', 'interfaces': 'Interface status and configuration',
    'ip': 'Global IP configuration subcommands', 'ipv6': 'IPv6 configuration commands', 'line': 'Configure a terminal line',
    'login': 'Enable password checking', 'logout': 'Exit from the EXEC', 'mac-address-table': 'MAC forwarding table',
    'mode': 'Set trunking mode of the interface', 'name': 'Ascii name of the VLAN', 'nat': 'NAT configuration commands',
    'neighbors': 'CDP neighbor entries', 'network': 'Enable routing on an IP network', 'no': 'Negate a command or set its defaults',
    'passive-interface': 'Suppress routing updates on an interface', 'password': 'Set a password', 'ping': 'Send echo messages',
    'pool': 'Configure DHCP address pools', 'preempt': 'Overthrow lower priority designated routers',
    'priority': 'Priority level', 'protocols': 'IP routing protocol process parameters and statistics',
    'range': 'interface range command', 'reload': 'Halt and perform a cold restart', 'route': 'Establish static routes',
    'router': 'Enable a routing process', 'routing': 'Enable IP routing', 'running-config': 'Current operating configuration',
    'secret': 'Assign the privileged level secret', 'service': 'Modify use of network based services',
    'show': 'Show running system information', 'shutdown': 'Shutdown the selected interface',
    'spanning-tree': 'Spanning Tree Subsystem', 'speed': 'Configure speed operation.', 'standby': 'HSRP interface configuration commands',
    'startup-config': 'Contents of startup configuration', 'switchport': 'Set switching mode characteristics',
    'terminal': 'Set terminal line parameters', 'traceroute': 'Trace route to destination', 'trunk': 'Set trunking characteristics of the interface',
    'unicast-routing': 'Enable unicast routing', 'version': 'System hardware and software status', 'vlan': 'Vlan commands',
    'write': 'Write running configuration to memory, network, or terminal', 'access': 'Set access mode characteristics of the interface',
    'allowed': 'Set allowed VLAN characteristics when interface is in trunking mode', 'native': 'Set trunking native characteristics when interface is in trunking mode',
    'dot1Q': 'IEEE 802.1Q Virtual LAN', 'inside': 'Inside address translation', 'outside': 'Outside address translation',
    'source': 'Source address translation', 'list': 'Specify access list describing local addresses', 'overload': 'Overload an address translation',
    'static': 'Specify static local->global mapping', 'tcp': 'Transmission Control Protocol', 'udp': 'User Datagram Protocol',
    'permit': 'Specify packets to forward', 'deny': 'Specify packets to reject', 'any': 'Any source host', 'host': 'A single host address',
    'rip': 'Routing Information Protocol (RIP)', 'ospf': 'Open Shortest Path First (OSPF)', 'eigrp': 'Enhanced Interior Gateway Routing Protocol (EIGRP)',
    'translations': 'Translation entries', 'statistics': 'Translation statistics', 'mac': 'MAC configuration', 'address-table': 'MAC forwarding table',
    'link-local': 'Use link-local address', 'eui-64': 'Use eui-64 interface identifier', 'nd': 'IPv6 interface Neighbor Discovery subcommands',
    'other-config-flag': 'Hosts should use DHCP for non-address config', 'managed-config-flag': 'Hosts should use DHCP for address config',
    'server': 'Configure IPv6 DHCP server on this interface', 'memory': 'Write to NV memory', 'con': 'Primary terminal line', 'vty': 'Virtual terminal',
    'transport': 'Define transport protocols for line', 'input': 'Define which protocols to use when connecting to the terminal server',
    'secondary': 'Make this IP address a secondary address', 'motd': 'Set Message of the Day banner', 'portfast': 'Spanning tree portfast options',
    'root': 'Configure switch as root', 'primary': 'Configure this switch as primary root for this spanning tree',
    'mode-pvst': 'Per-Vlan spanning tree mode', 'pvst': 'Per-Vlan spanning tree mode', 'rapid-pvst': 'Per-Vlan rapid spanning tree mode',
    'run': 'Enable CDP', 'username': 'Establish User Name Authentication', 'detail': 'Show detailed information', 'lease': 'Address lease time',
    'connected': 'Connected', 'nonegotiate': 'Device will not engage in negotiation protocol on this interface',
    'voice': 'Voice appliance attributes', 'dynamic': 'Set trunking mode to dynamically negotiate access or trunk mode',
    'auto': 'Set trunking mode dynamic negotiation parameter to AUTO', 'desirable': 'Set trunking mode dynamic negotiation parameter to DESIRABLE',
    'clock-rate': 'Configure serial interface clock', 'rate': 'Configure serial interface clock speed',
    'password-encryption': 'Encrypt system passwords', 'ssh': 'Configure ssh options', 'http': 'HTTP server configuration',
    'arp-cache': 'Clear the entire ARP cache', 'flash:': 'display information about flash: file system', 'users': 'Display information about terminal lines',
    'include': 'Include lines that match', 'begin': 'Begin with the line that matches', 'exclude': 'Exclude lines that match', 'section': 'Filter a section of output',
    'netmask': 'Specify the network mask', 'prefix-length': 'Specify the prefix length', 'router-id': 'router-id for this OSPF process',
    'timers': 'Hello and hold timers', 'authentication': 'Authentication', 'track': 'Priority tracking', 'length': 'Set number of lines on a screen'
  };

  /* ---------------------------------------------------------- */
  /* Grammaire : arbre de commandes par mode                      */
  /* ---------------------------------------------------------- */
  var TREES = {};
  function node() { return { kw: {}, params: [], run: null }; }
  function tree(mode) { return TREES[mode] || (TREES[mode] = node()); }
  /* spec : mots séparés par espaces ; paramètres entre <> :
     <IP> <MASK> <IP6> <PFX6> <n-m> <WORD> <LINE> <IF> <VLIST>  */
  function def(modes, spec, run, helps) {
    modes.split(',').forEach(function (m) {
      var n = tree(m.trim());
      spec.match(/<[^>]*>|\S+/g).forEach(function (tok) {
        var pm = /^<([^:>]+)(?::([^>]+))?>$/.exec(tok);
        if (pm) {
          var t = pm[1];
          var found = n.params.filter(function (p) { return p.type === t; })[0];
          if (!found) { found = { type: t, node: node() }; n.params.push(found); }
          if (pm[2] && !found.help) found.help = pm[2];
          n = found.node;
        } else {
          n.kw[tok] = n.kw[tok] || node();
          if (helps && helps[tok]) n.kw[tok].help = helps[tok];
          n = n.kw[tok];
        }
      });
      n.run = run;
    });
  }
  var PARAM_HELP = {
    IP: 'A.B.C.D', MASK: 'A.B.C.D', IP6: 'X:X:X:X::X', PFX6: 'X:X:X:X::X/<0-128>', WORD: 'WORD', LINE: 'LINE', IF: 'interface',
    VLIST: 'WORD'
  };
  function paramDesc(t) {
    if (/^\d+-\d+$/.test(t)) return ['<' + t + '>', ''];
    var d = {
      IP: ['A.B.C.D', 'IP address'], MASK: ['A.B.C.D', 'IP subnet mask'], IP6: ['X:X:X:X::X', 'IPv6 address'],
      PFX6: ['X:X:X:X::X/<0-128>', 'IPv6 prefix'], WORD: ['WORD', ''], LINE: ['LINE', ''], IF: ['GigabitEthernet', 'GigabitEthernet IEEE 802.3z'],
      VLIST: ['WORD', 'VLAN IDs of the allowed VLANs when this port is in trunking mode'], NH: ['A.B.C.D', 'Forwarding router\'s address']
    };
    return d[t] || [t, ''];
  }

  /* Tokenisation */
  function tokenize(s) {
    var out = [], re = /\S+/g, m;
    while ((m = re.exec(s))) out.push({ t: m[0], pos: m.index });
    return out;
  }
  function matchParam(type, toks, i, ctx) {
    var t = toks[i] && toks[i].t;
    if (t == null) return null;
    if (type === 'LINE') return { val: ctx.line.slice(toks[i].pos).replace(/\s+$/, ''), used: toks.length - i };
    if (type === 'IP' || type === 'MASK' || type === 'NH') return N.isIP(t) ? { val: N.ip2int(t), used: 1 } : null;
    if (type === 'IP6') return N.isIP6(t) && t.indexOf('/') < 0 ? { val: N.parse6(t), used: 1 } : null;
    if (type === 'PFX6') { var p = N.parsePrefix6(t); return p ? { val: p, used: 1 } : null; }
    if (type === 'WORD') return { val: t, used: 1 };
    if (type === 'VLIST') return /^[\d,\-]+$/.test(t) ? { val: t, used: 1 } : null;
    var rm = /^(\d+)-(\d+)$/.exec(type);
    if (rm) { if (!/^\d+$/.test(t)) return null; var v = +t; return v >= +rm[1] && v <= +rm[2] ? { val: v, used: 1 } : null; }
    if (type === 'IF') {
      /* "g0/0" ou "gig 0/0" */
      var one = E.canonIf(t);
      if (one) return { val: one, used: 1 };
      if (/^[A-Za-z-]+$/.test(t) && E.canonIfType(t) && toks[i + 1] && /^[\d/.:]+$/.test(toks[i + 1].t)) {
        return { val: E.canonIfType(t) + toks[i + 1].t, used: 2 };
      }
      return null;
    }
    return null;
  }
  /* Analyse d'une ligne dans un arbre ; renvoie {ok, run, args, err, pos} */
  function parse(treeRoot, line) {
    var toks = tokenize(line);
    var n = treeRoot, args = [], ctx = { line: line };
    var i = 0;
    while (i < toks.length) {
      var tok = toks[i].t, low = tok.toLowerCase();
      var kws = Object.keys(n.kw);
      var exact = kws.filter(function (k) { return k.toLowerCase() === low; });
      var pref = kws.filter(function (k) { return k.toLowerCase().indexOf(low) === 0; });
      if (exact.length === 1 || (pref.length === 1)) {
        var k = exact.length === 1 ? exact[0] : pref[0];
        /* un paramètre numérique a priorité si le token est un nombre et aucun mot-clé exact */
        n = n.kw[k]; args.push(k); i++;
        continue;
      }
      if (pref.length > 1) {
        /* un paramètre peut-il prendre ce token ? */
        var pm0 = tryParams(n, toks, i, ctx);
        if (pm0) { n = pm0.node; args.push(pm0.val); i += pm0.used; continue; }
        return { err: 'ambiguous', pos: toks[i].pos, tok: line.slice(0, toks[i].pos + tok.length) };
      }
      var pm = tryParams(n, toks, i, ctx);
      if (pm) { n = pm.node; args.push(pm.val); i += pm.used; continue; }
      return { err: 'invalid', pos: toks[i].pos };
    }
    if (!n.run) return { err: toks.length ? 'incomplete' : 'empty' };
    return { ok: true, run: n.run, args: args, node: n };
  }
  function tryParams(n, toks, i, ctx) {
    for (var j = 0; j < n.params.length; j++) {
      var p = n.params[j];
      var m = matchParam(p.type, toks, i, ctx);
      if (m) return { node: p.node, val: m.val, used: m.used };
    }
    return null;
  }
  /* Nœud atteint par une ligne partielle (pour ? et Tab) */
  function walk(treeRoot, toks, line) {
    var n = treeRoot, ctx = { line: line }, i = 0;
    while (i < toks.length) {
      var low = toks[i].t.toLowerCase();
      var kws = Object.keys(n.kw).filter(function (k) { return k.toLowerCase().indexOf(low) === 0; });
      var exact = kws.filter(function (k) { return k.toLowerCase() === low; });
      if (exact.length === 1 || kws.length === 1) { n = n.kw[exact[0] || kws[0]]; i++; continue; }
      var pm = tryParams(n, toks, i, ctx);
      if (pm && pm.used + i <= toks.length) { n = pm.node; i += pm.used; continue; }
      return null;
    }
    return n;
  }

  /* ---------------------------------------------------------- */
  /* Formatage                                                    */
  /* ---------------------------------------------------------- */
  function pad(s, n) { s = String(s); return s.length >= n ? s + ' ' : s + new Array(n - s.length + 1).join(' '); }
  function padL(s, n) { s = String(s); return s.length >= n ? s : new Array(n - s.length + 1).join(' ') + s; }
  function ip(n) { return n == null ? 'unassigned' : N.int2ip(n); }
  function mask(len) { return N.maskStr(len); }
  function upper6(w) { return N.fmt6(w, true); }

  /* ---------------------------------------------------------- */
  /* Session CLI                                                  */
  /* ---------------------------------------------------------- */
  function Session(net, dev, opts) {
    this.net = net; this.dev = dev; this.opts = opts || {};
    this.mode = 'user'; this.ctx = {};
    this.history = [];
    this.pending = null; /* question en attente (confirm, mot de passe...) */
    this.silent = !!this.opts.silent;
  }
  var S = Session.prototype;
  S.prompt = function () {
    var h = this.dev.hostname;
    var suf = {
      user: '>', priv: '#', config: '(config)#', if: '(config-if)#', subif: '(config-subif)#', ifrange: '(config-if-range)#',
      rip: '(config-router)#', ospf: '(config-router)#', vlan: '(config-vlan)#', dhcp: '(dhcp-config)#', dhcp6: '(config-dhcpv6)#',
      line: '(config-line)#'
    }[this.mode];
    if (this.pending && this.pending.prompt) return this.pending.prompt;
    return h + suf;
  };
  S.isConfig = function () { return ['user', 'priv'].indexOf(this.mode) < 0; };
  S.treeFor = function (mode) {
    var m = mode || this.mode;
    var cat = this.dev.cat;
    var key = m;
    if (m === 'if' || m === 'subif' || m === 'ifrange') key = 'if';
    return TREES[key] || node();
  };
  /* Exécute une ligne ; renvoie un tableau de lignes de sortie */
  S.exec = function (line) {
    var out = [];
    this.out = out;
    if (this.pending) {
      var p = this.pending; this.pending = null;
      p.handle.call(this, line, out);
      return out;
    }
    var raw = line;
    line = line.replace(/\s+$/, '');
    if (!line.trim()) return out;
    if (!this.silent) { this.history.push(raw.trim()); if (this.history.length > 50) this.history.shift(); }
    /* pipe | include ... */
    var pipe = null, pm = /^(.*?)\s*\|\s*(include|exclude|begin|section|i|in|inc|incl|e|ex|excl|b|be|beg|s|se|sec)\s+(.*)$/i.exec(line);
    if (pm && /^\s*(sh|sho|show|do)/i.test(pm[1])) { line = pm[1]; pipe = { k: pm[2].toLowerCase()[0], re: pm[3] }; }
    var t = parse(this.treeFor(), line);
    var mode0 = this.mode;
    if (!t.ok && this.isConfig() && this.mode !== 'config') {
      /* commande globale tapée depuis un sous-mode */
      var t2 = parse(tree('config'), line);
      if (t2.ok) { this.mode = 'config'; this.ctx = {}; t = t2; }
    }
    if (!t.ok) {
      if (t.err === 'empty') return out;
      if ((this.mode === 'user' || this.mode === 'priv') && t.err === 'invalid' && t.pos === 0 && tokenize(line).length === 1) {
        /* mot inconnu en mode exec : IOS tente une résolution de nom */
        if (this.dev.cfg.domainLookup) out.push('Translating "' + line.trim() + '"...domain server (255.255.255.255)', '');
        out.push('% Unknown command or computer name, or unable to find computer address');
        return out;
      }
      if (t.err === 'invalid') {
        out.push(new Array(this.prompt().length + t.pos + 1).join(' ') + '^');
        out.push("% Invalid input detected at '^' marker.");
        out.push('\t');
      } else if (t.err === 'incomplete') out.push('% Incomplete command.', '');
      else if (t.err === 'ambiguous') out.push('% Ambiguous command: "' + t.tok + '"');
      return out;
    }
    var before = this.silent ? null : this.net.snapPorts();
    var res;
    try {
      res = t.run.call(this, t.args, out, line);
    } catch (e) {
      out.push('% Internal error: ' + e.message);
      if (typeof console !== 'undefined') console.error(e);
    }
    if (res !== 'noTouch') this.net.touch();
    if (!this.silent) this.net.diffPorts(before);
    if (pipe && out.length) out = this.applyPipe(out, pipe);
    this.out = out;
    return out;
  };
  S.applyPipe = function (lines, p) {
    var re;
    try { re = new RegExp(p.re); } catch (e) { re = { test: function (x) { return x.indexOf(p.re) >= 0; } }; }
    if (p.k === 'i') return lines.filter(function (l) { return re.test(l); });
    if (p.k === 'e') return lines.filter(function (l) { return !re.test(l); });
    if (p.k === 'b') { for (var i = 0; i < lines.length; i++) if (re.test(lines[i])) return lines.slice(i); return []; }
    if (p.k === 's') {
      var out = [], on = false;
      lines.forEach(function (l) { if (/^\S/.test(l)) on = re.test(l); if (on) out.push(l); });
      return out;
    }
    return lines;
  };
  /* Aide contextuelle "?" : renvoie les lignes à afficher */
  S.help = function (line) {
    var tr = this.treeFor();
    var endsSpace = /\s$/.test(line) || line === '';
    var toks = tokenize(line);
    var out = [];
    if (!endsSpace) {
      /* complétion des mots commençant par le dernier token */
      var last = toks.pop();
      var n = walk(tr, toks, line);
      if (!n) { out.push('% Unrecognized command'); return out; }
      var low = last.t.toLowerCase();
      var words = Object.keys(n.kw).filter(function (k) { return k.toLowerCase().indexOf(low) === 0; }).sort();
      if (!words.length) { out.push('% Unrecognized command'); return out; }
      out.push(words.map(function (w) { return pad(w, w.length + 2); }).join(''));
      return out;
    }
    var n2 = walk(tr, toks, line);
    if (!n2) { out.push('% Unrecognized command'); return out; }
    if (!toks.length) out.push(this.isConfig() ? (this.mode === 'config' ? 'Configure commands:' : '') : 'Exec commands:');
    var rows = [];
    Object.keys(n2.kw).sort().forEach(function (k) { rows.push([k, n2.kw[k].help || HELP[k] || '']); });
    var dev = this.dev;
    n2.params.forEach(function (p) {
      if (p.type === 'IF') {
        var types = {};
        dev.ifaces.forEach(function (i) { var sp = E.splitIf(i.name); if (sp) types[sp.type] = 1; });
        if (dev.cat !== 'switch') types.Loopback = 1;
        if (dev.cat !== 'router') types.Vlan = 1;
        var ID = { Ethernet: 'IEEE 802.3', FastEthernet: 'FastEthernet IEEE 802.3', GigabitEthernet: 'GigabitEthernet IEEE 802.3z', Serial: 'Serial', Loopback: 'Loopback interface', Vlan: 'Catalyst Vlans', Port: 'Port' };
        Object.keys(types).sort().forEach(function (t) { rows.push([t, ID[t] || t]); });
        return;
      }
      var d = paramDesc(p.type); rows.push([d[0], p.help || d[1]]);
    });
    var w = rows.reduce(function (m, r) { return Math.max(m, r[0].length); }, 0) + 2;
    rows.forEach(function (r) { out.push('  ' + pad(r[0], w) + r[1]); });
    if (n2.run) out.push('  <cr>');
    return out.filter(function (l, i) { return l !== '' || i > 0; });
  };
  /* Tab : complète le dernier mot si unique */
  S.complete = function (line) {
    if (/\s$/.test(line) || !line) return line;
    var toks = tokenize(line);
    var last = toks.pop();
    var n = walk(this.treeFor(), toks, line);
    if (!n) return line;
    var low = last.t.toLowerCase();
    var words = Object.keys(n.kw).filter(function (k) { return k.toLowerCase().indexOf(low) === 0; });
    if (words.length !== 1) return line;
    return line.slice(0, last.pos) + words[0] + ' ';
  };
  S.ifaceCtx = function () {
    var self = this;
    return (this.ctx.ifs || []).map(function (n) { return self.net.iface(self.dev, n); }).filter(Boolean);
  };

  /* ---------------------------------------------------------- */
  /* Aides moteur : snapshot des ports pour les messages %LINK    */
  /* ---------------------------------------------------------- */
  E.Net.prototype.snapPorts = function () {
    var net = this, snap = {};
    this.devices.forEach(function (d) {
      if (d.cat === 'pc' || d.cat === 'server' || d.cat === 'hub') return;
      d.ifaces.forEach(function (i) {
        var s = net.ifStatus(d, i);
        snap[d.name + '|' + i.name] = s.status + '/' + s.proto;
      });
      d.ifaces.forEach(function (i) {
        Object.keys(i.standby).forEach(function (g) {
          snap['hsrp|' + d.name + '|' + i.name + '|' + g] = net.hsrpInfo(d, i, +g).state;
        });
      });
    });
    return snap;
  };
  E.Net.prototype.diffPorts = function (before) {
    if (!before) return;
    var net = this, after = this.snapPorts();
    Object.keys(after).forEach(function (k) {
      var a = after[k], b = before[k];
      if (a === b) return;
      var parts = k.split('|');
      if (parts[0] === 'hsrp') {
        net.events.push({ dev: parts[1], text: '%HSRP-6-STATECHANGE: ' + parts[2] + ' Grp ' + parts[3] + ' state ' + (b || 'Init') + ' -> ' + a });
        return;
      }
      if (b === undefined) return;
      var dn = parts[0], ifn = parts.slice(1).join('|');
      var sa = a.split('/'), sb = b.split('/');
      if (sa[0] !== sb[0]) net.events.push({ dev: dn, text: '%LINK-5-CHANGED: Interface ' + ifn + ', changed state to ' + sa[0] });
      if (sa[1] !== sb[1]) net.events.push({ dev: dn, text: '%LINEPROTO-5-UPDOWN: Line protocol on Interface ' + ifn + ', changed state to ' + sa[1], delay: 1 });
    });
  };

  /* ---------------------------------------------------------- */
  /* Commandes du mode EXEC                                       */
  /* ---------------------------------------------------------- */
  var EXEC = 'user,priv';
  def('user', 'enable', function (a, out) {
    var d = this.dev;
    var pw = d.cfg.enableSecret || d.cfg.enablePassword;
    if (pw) {
      var self = this, tries = 0;
      this.pending = {
        prompt: 'Password:', secret: true, handle: function (l, o) {
          if (l === pw) { self.mode = 'priv'; return; }
          tries++;
          if (tries < 3) { self.pending = this; return; }
          o.push('% Bad secrets', '');
        }
      };
      return 'noTouch';
    }
    this.mode = 'priv';
    return 'noTouch';
  });
  def('priv', 'enable', function () { return 'noTouch'; });
  def('priv', 'disable', function () { this.mode = 'user'; return 'noTouch'; });
  def(EXEC, 'exit', function (a, out) { this.mode = 'user'; this.loggedOut = true; out.push('', this.dev.hostname + ' con0 is now available', '', '', '', '', '', 'Press RETURN to get started.'); return 'noTouch'; });
  def(EXEC, 'logout', function (a, out) { this.mode = 'user'; this.loggedOut = true; out.push('', this.dev.hostname + ' con0 is now available', '', '', '', '', '', 'Press RETURN to get started.'); return 'noTouch'; });
  def('priv', 'configure terminal', function (a, out) {
    this.mode = 'config'; this.ctx = {};
    out.push('Enter configuration commands, one per line.  End with CNTL/Z.');
    return 'noTouch';
  });
  def('priv', 'configure', function (a, out) {
    var self = this;
    this.pending = { prompt: 'Configuring from terminal, memory, or network [terminal]? ', handle: function (l, o) {
      if (!l.trim() || /^t/i.test(l.trim())) { self.mode = 'config'; self.ctx = {}; o.push('Enter configuration commands, one per line.  End with CNTL/Z.'); }
      else o.push('?Must be "terminal", "memory" or "network"');
    } };
    return 'noTouch';
  });
  def('priv', 'copy running-config startup-config', function (a, out) {
    var self = this;
    this.pending = { prompt: 'Destination filename [startup-config]? ', handle: function (l, o) {
      self.saveStartup(); o.push('Building configuration...', '[OK]');
    } };
    return 'noTouch';
  });
  def('priv', 'copy startup-config running-config', function (a, out) {
    var self = this;
    this.pending = { prompt: 'Destination filename [running-config]? ', handle: function (l, o) {
      if (self.dev.startup) { restoreStartup(self.net, self.dev, true); o.push(self.runningText().length + ' bytes copied in 0.416 secs'); }
      else o.push('%Error opening nvram:startup-config (No such file or directory)');
    } };
    return 'noTouch';
  });
  S.saveStartup = function () {
    var d = this.dev;
    d.startup = JSON.parse(JSON.stringify({ hostname: d.hostname, cfg: d.cfg, ifaces: d.ifaces }));
  };
  function writeMem(a, out) { this.saveStartup(); out.push('Building configuration...', '[OK]'); return 'noTouch'; }
  def('priv', 'write memory', writeMem);
  def('priv', 'write', writeMem);
  def('priv', 'write terminal', function (a, out) { var s = this; this.runningText().forEach(function (l) { out.push(l); }); return 'noTouch'; });
  def('priv', 'erase startup-config', function (a, out) {
    var self = this;
    this.pending = { prompt: 'Erasing the nvram filesystem will remove all configuration files! Continue? [confirm]', handle: function (l, o) {
      if (!l.trim() || /^y/i.test(l.trim())) { self.dev.startup = null; o.push('[OK]', 'Erase of nvram: complete', '%SYS-7-NV_BLOCK_INIT: Initialized the geometry of nvram'); }
    } };
    return 'noTouch';
  });
  def('priv', 'reload', function (a, out) {
    var self = this;
    this.pending = { prompt: 'Proceed with reload? [confirm]', handle: function (l, o) {
      if (l.trim() && !/^y/i.test(l.trim())) return;
      reloadDevice(self.net, self.dev);
      self.mode = 'user'; self.ctx = {};
      self.rebooted = true;
    } };
    return 'noTouch';
  });
  def('priv', 'clear ip nat translation *', function () { this.dev.natTable = []; });
  def('priv', 'clear arp-cache', function () { this.dev.arp = {}; });
  def('priv', 'clear mac-address-table dynamic', function () { this.dev.macTable = {}; });
  def('priv', 'clear mac address-table dynamic', function () { this.dev.macTable = {}; });
  def(EXEC, 'terminal length <0-512>', function () { return 'noTouch'; });
  def(EXEC, 'terminal no monitor', function () { return 'noTouch'; });
  def(EXEC, 'terminal monitor', function () { return 'noTouch'; });

  /* ping / traceroute */
  function doPing(a, out) {
    var target = a[a.length - 1];
    var self = this;
    var d = this.dev, net = this.net;
    if (Array.isArray(target) && target.length === 8) {
      /* IPv6 */
      var w = target;
      out.push('Type escape sequence to abort.');
      out.push('Sending 5, 100-byte ICMP Echos to ' + upper6(w) + ', timeout is 2 seconds:');
      var r6 = net.ping6(d, w, 5);
      this.async = { kind: 'ping', results: r6, done: function (o) {
        var ok = r6.filter(function (x) { return x.status === 'ok'; }).length;
        o.push('Success rate is ' + Math.floor(ok * 100 / 5) + ' percent (' + ok + '/5)' + (ok ? ', round-trip min/avg/max = 0/0/1 ms' : ''));
      } };
      return 'noTouch';
    }
    if (typeof target !== 'number') {
      out.push('% Unrecognized host or address, or protocol not running.', '');
      return 'noTouch';
    }
    out.push('Type escape sequence to abort.');
    out.push('Sending 5, 100-byte ICMP Echos to ' + ip(target) + ', timeout is 2 seconds:');
    var res = net.ping(d, target, 5);
    this.async = { kind: 'ping', results: res, done: function (o) {
      var ok = res.filter(function (x) { return x.status === 'ok'; }).length;
      o.push('Success rate is ' + Math.floor(ok * 100 / 5) + ' percent (' + ok + '/5)' + (ok ? ', round-trip min/avg/max = 0/0/1 ms' : ''));
    } };
    return 'noTouch';
  }
  def(EXEC, 'ping <IP:Ping destination address or hostname>', doPing);
  def(EXEC, 'ping <IP6>', doPing);
  def(EXEC, 'ping ipv6 <IP6>', doPing);
  def(EXEC, 'ping <WORD>', doPing);
  function doTrace(a, out) {
    var target = a[a.length - 1];
    if (typeof target !== 'number') { out.push('% Unrecognized host or address, or protocol not running.', ''); return 'noTouch'; }
    out.push('Type escape sequence to abort.');
    out.push('Tracing the route to ' + ip(target), '');
    var hops = this.net.traceroute(this.dev, target);
    hops.forEach(function (h, i) {
      out.push(padL(i + 1, 2) + '   ' + (h.ip == null ? '*         *         *' : ip(h.ip) + (h.unreach ? '  !H  *  !H' : '       0 msec    0 msec    0 msec')));
    });
    return 'noTouch';
  }
  def(EXEC, 'traceroute <IP>', doTrace);
  def(EXEC, 'traceroute <WORD>', doTrace);

  /* ---------------------------------------------------------- */
  /* SHOW                                                         */
  /* ---------------------------------------------------------- */
  function showDef(spec, fn, privOnly) {
    def(privOnly ? 'priv' : EXEC, 'show ' + spec, function (a, out) { fn.call(this, a, out); return 'noTouch'; });
    /* "do show ..." dans les modes de configuration */
    ['config', 'if', 'rip', 'ospf', 'vlan', 'dhcp', 'dhcp6', 'line'].forEach(function (m) {
      def(m, 'do show ' + spec, function (a, out) { fn.call(this, a.slice(1), out); return 'noTouch'; });
    });
  }
  showDef('running-config', function (a, out) { this.runningText().forEach(function (l) { out.push(l); }); }, true);
  showDef('startup-config', function (a, out) {
    var d = this.dev;
    if (!d.startup) { out.push('startup-config is not present'); return; }
    var tmp = JSON.parse(JSON.stringify(d)); tmp.hostname = d.startup.hostname; tmp.cfg = d.startup.cfg; tmp.ifaces = d.startup.ifaces;
    var txt = runningConfig(this.net, tmp);
    out.push('Using ' + txt.join('\n').length + ' bytes');
    txt.slice(3).forEach(function (l) { out.push(l); });
  }, true);
  showDef('version', function (a, out) { showVersion(this.net, this.dev).forEach(function (l) { out.push(l); }); });
  showDef('clock', function (a, out) { out.push('*' + clockStr()); });
  showDef('history', function (a, out) { this.history.forEach(function (h) { out.push('  ' + h); }); });
  showDef('ip interface brief', function (a, out) {
    var net = this.net, d = this.dev;
    out.push('Interface              IP-Address      OK? Method Status                Protocol ');
    d.ifaces.forEach(function (i) {
      var s = net.ifStatus(d, i);
      var addr = d.cat === 'router' || /^Vlan/.test(i.name) || (i.sw && i.sw.routed) ? (i.ip != null ? ip(i.ip) : 'unassigned') : 'unassigned';
      var method = i.ip != null ? 'manual' : 'unset ';
      out.push(pad(i.name, 23) + pad(addr, 16) + 'YES ' + pad(method, 7) + pad(s.status, 22) + s.proto + ' ');
    });
  });
  showDef('ip route', function (a, out) { showIpRoute(this.net, this.dev, null).forEach(function (l) { out.push(l); }); });
  showDef('ip route static', function (a, out) { showIpRoute(this.net, this.dev, 'S').forEach(function (l) { out.push(l); }); });
  showDef('ip route connected', function (a, out) { showIpRoute(this.net, this.dev, 'C').forEach(function (l) { out.push(l); }); });
  showDef('ip route rip', function (a, out) { showIpRoute(this.net, this.dev, 'R').forEach(function (l) { out.push(l); }); });
  showDef('ip route ospf', function (a, out) { showIpRoute(this.net, this.dev, 'O').forEach(function (l) { out.push(l); }); });
  showDef('interfaces', function (a, out) { var s = this; s.dev.ifaces.forEach(function (i) { showInterface(s.net, s.dev, i).forEach(function (l) { out.push(l); }); }); });
  showDef('interfaces <IF>', function (a, out) {
    var i = this.net.iface(this.dev, a[a.length - 1]);
    if (!i) { out.push('%Invalid interface type and number'); return; }
    showInterface(this.net, this.dev, i).forEach(function (l) { out.push(l); });
  });
  showDef('interfaces trunk', function (a, out) { showTrunk(this.net, this.dev).forEach(function (l) { out.push(l); }); });
  showDef('interfaces status', function (a, out) { showIntStatus(this.net, this.dev).forEach(function (l) { out.push(l); }); });
  showDef('ip interface <IF>', function (a, out) {
    var i = this.net.iface(this.dev, a[a.length - 1]);
    if (!i) { out.push('%Invalid interface type and number'); return; }
    var s = this.net.ifStatus(this.dev, i);
    out.push(i.name + ' is ' + s.status + ', line protocol is ' + s.proto + ' (connected)');
    if (i.ip != null) out.push('  Internet address is ' + ip(i.ip) + '/' + i.len);
    else out.push('  Internet protocol processing disabled');
    if (i.helper.length) out.push('  Helper address is ' + i.helper.map(ip).join(', '));
    else out.push('  Helper address is not set');
    out.push('  Directed broadcast forwarding is disabled');
    if (i.natIn || i.natOut) out.push('  Network address translation is enabled, interface in domain ' + (i.natIn ? 'inside' : 'outside'));
  });
  showDef('vlan brief', function (a, out) { showVlan(this.net, this.dev, true).forEach(function (l) { out.push(l); }); });
  showDef('vlan', function (a, out) { showVlan(this.net, this.dev, false).forEach(function (l) { out.push(l); }); });
  showDef('mac address-table', function (a, out) { showMac(this.net, this.dev).forEach(function (l) { out.push(l); }); });
  showDef('mac-address-table', function (a, out) { showMac(this.net, this.dev).forEach(function (l) { out.push(l); }); });
  showDef('ip dhcp binding', function (a, out) {
    out.push('IP address       Client-ID/              Lease expiration        Type', '                 Hardware address');
    var l = this.dev.dhcpLeases || {};
    Object.keys(l).forEach(function (k) { out.push(pad(ip(l[k].ip), 17) + pad(N.macPT(l[k].mac), 24) + pad('--', 24) + 'Automatic'); });
  });
  showDef('ip dhcp pool', function (a, out) {
    var d = this.dev;
    Object.keys(d.cfg.dhcpPools).forEach(function (n) {
      var p = d.cfg.dhcpPools[n];
      var used = Object.keys(d.dhcpLeases || {}).filter(function (k) { return d.dhcpLeases[k].pool === n; }).length;
      out.push('', 'Pool ' + n + ' :', ' Utilization mark (high/low)    : 100 / 0', ' Subnet size (first/next)       : 0 / 0 ',
        ' Total addresses                : ' + (p.net != null ? Math.pow(2, 32 - p.len) - 2 : 0), ' Leased addresses               : ' + used,
        ' Excluded addresses             : ' + d.cfg.dhcpExcl.length, ' Pending event                  : none', '',
        ' 1 subnet is currently in the pool', ' Current index        IP address range                    Leased/Excluded/Total');
      if (p.net != null) out.push(' ' + pad(ip(p.net + 1), 21) + pad(ip(p.net + 1) + '       - ' + ip(N.bcastOf(p.net, p.len) - 1), 36) + used + '    / ' + d.cfg.dhcpExcl.length + '     / ' + (Math.pow(2, 32 - p.len) - 2));
    });
  });
  showDef('ip nat translations', function (a, out) { showNat(this.net, this.dev).forEach(function (l) { out.push(l); }); });
  showDef('ip nat statistics', function (a, out) {
    var d = this.dev, ins = [], outs = [];
    d.ifaces.forEach(function (i) { if (i.natIn) ins.push(i.name); if (i.natOut) outs.push(i.name); });
    var dyn = d.natTable.filter(function (e) { return !e.stat; }).length;
    out.push('Total translations: ' + (dyn + d.cfg.natStatic.length) + ' (' + d.cfg.natStatic.length + ' static, ' + dyn + ' dynamic, ' + dyn + ' extended)');
    out.push('Outside Interfaces: ' + outs.join(' , '), 'Inside Interfaces: ' + ins.join(' , '), 'Hits: ' + (dyn * 4) + '  Misses: ' + dyn, 'Expired translations: 0', 'Dynamic mappings:');
    d.cfg.natDyn.forEach(function (r) { out.push('-- Inside Source', 'access-list ' + r.acl + ' interface ' + (r.iface || r.pool) + ' refCount ' + dyn); });
  });
  showDef('standby brief', function (a, out) { showStandby(this.net, this.dev, true).forEach(function (l) { out.push(l); }); });
  showDef('standby', function (a, out) { showStandby(this.net, this.dev, false).forEach(function (l) { out.push(l); }); });
  showDef('ipv6 interface brief', function (a, out) { showIpv6Brief(this.net, this.dev).forEach(function (l) { out.push(l); }); });
  showDef('ipv6 interface', function (a, out) { var s = this; s.dev.ifaces.forEach(function (i) { if (s.net.v6On(s.dev, i)) showIpv6If(s.net, s.dev, i).forEach(function (l) { out.push(l); }); }); });
  showDef('ipv6 interface <IF>', function (a, out) {
    var i = this.net.iface(this.dev, a[a.length - 1]);
    if (!i) { out.push('%Invalid interface type and number'); return; }
    showIpv6If(this.net, this.dev, i).forEach(function (l) { out.push(l); });
  });
  showDef('ipv6 route', function (a, out) { showIpv6Route(this.net, this.dev).forEach(function (l) { out.push(l); }); });
  showDef('ipv6 dhcp interface', function (a, out) {
    var d = this.dev;
    d.ifaces.forEach(function (i) { if (i.v6.dhcp) out.push(i.name + ' is in server mode', '  Using pool: ' + i.v6.dhcp, '  Preference value: 0', '  Hint from client: ignored', '  Rapid-Commit: disabled'); });
  });
  showDef('ipv6 dhcp pool', function (a, out) {
    var d = this.dev;
    Object.keys(d.cfg.dhcp6Pools).forEach(function (n) {
      var p = d.cfg.dhcp6Pools[n];
      out.push('DHCPv6 pool: ' + n);
      p.dns.forEach(function (w) { out.push('  DNS server: ' + upper6(w)); });
      if (p.domain) out.push('  Domain name: ' + p.domain);
      out.push('  Active clients: 0');
    });
  });
  showDef('arp', function (a, out) { showArp(this.net, this.dev).forEach(function (l) { out.push(l); }); });
  showDef('ip arp', function (a, out) { showArp(this.net, this.dev).forEach(function (l) { out.push(l); }); });
  showDef('cdp neighbors', function (a, out) { showCdp(this.net, this.dev, false).forEach(function (l) { out.push(l); }); });
  showDef('cdp neighbors detail', function (a, out) { showCdp(this.net, this.dev, true).forEach(function (l) { out.push(l); }); });
  showDef('access-lists', function (a, out) {
    var d = this.dev;
    Object.keys(d.cfg.acls).sort(function (x, y) { return x - y; }).forEach(function (n) {
      out.push('Standard IP access list ' + n);
      d.cfg.acls[n].forEach(function (r, k) { out.push('    ' + ((k + 1) * 10) + ' ' + aclText(r)); });
    });
  });
  showDef('ip protocols', function (a, out) { showProtocols(this.net, this.dev).forEach(function (l) { out.push(l); }); });
  showDef('spanning-tree', function (a, out) { showStp(this.net, this.dev, null).forEach(function (l) { out.push(l); }); });
  showDef('spanning-tree vlan <1-4094>', function (a, out) { showStp(this.net, this.dev, a[a.length - 1]).forEach(function (l) { out.push(l); }); });
  showDef('flash:', function (a, out) {
    out.push('Directory of flash:/', '', '    3  -rw-     33591768          <no date>  ' + (this.dev.cat === 'router' ? 'c1900-universalk9-mz.SPA.151-4.M5.bin' : 'c2960-lanbasek9-mz.150-2.SE4.bin'), '', '64016384 bytes total (30424616 bytes free)');
  });
  showDef('users', function (a, out) { out.push('    Line       User       Host(s)              Idle       Location', '*  0 con 0                idle                 00:00:00 '); });

  /* ---------------------------------------------------------- */
  /* Mode configuration globale                                   */
  /* ---------------------------------------------------------- */
  var CFGMODES = 'config,if,rip,ospf,vlan,dhcp,dhcp6,line';
  def(CFGMODES, 'exit', function (a, out) {
    if (this.mode === 'config') { this.mode = 'priv'; this.ctx = {}; out.push('%SYS-5-CONFIG_I: Configured from console by console'); }
    else { this.mode = 'config'; this.ctx = {}; }
    return 'noTouch';
  });
  def(CFGMODES, 'end', function (a, out) { this.mode = 'priv'; this.ctx = {}; out.push('%SYS-5-CONFIG_I: Configured from console by console'); return 'noTouch'; });
  ['config', 'if', 'rip', 'ospf', 'vlan', 'dhcp', 'dhcp6', 'line'].forEach(function (m) {
    def(m, 'do <LINE>', function (a, out) {
      var sub = new Session(this.net, this.dev); sub.mode = 'priv';
      var lines = sub.exec(a[1]);
      if (sub.async) this.async = sub.async;
      lines.forEach(function (l) { out.push(l); });
    });
  });
  def('config', 'hostname <WORD:This system\'s network name>', function (a) {
    var h = a[1];
    if (!/^[A-Za-z]/.test(h)) { this.out.push('% Hostname contains one or more illegal characters.'); return; }
    this.dev.hostname = h;
  });
  def('config', 'no hostname', function () { this.dev.hostname = this.dev.cat === 'router' ? 'Router' : 'Switch'; });
  def('config', 'enable secret <LINE>', function (a) { this.dev.cfg.enableSecret = a[2].replace(/^[05]\s+/, ''); });
  def('config', 'enable password <LINE>', function (a) { this.dev.cfg.enablePassword = a[2].replace(/^[07]\s+/, ''); });
  def('config', 'no enable secret', function () { this.dev.cfg.enableSecret = null; });
  def('config', 'no enable password', function () { this.dev.cfg.enablePassword = null; });
  def('config', 'service password-encryption', function () { this.dev.cfg.pwdEnc = true; });
  def('config', 'no service password-encryption', function () { this.dev.cfg.pwdEnc = false; });
  def('config', 'banner motd <LINE>', function (a) {
    var s = a[2], dl = s[0];
    var end = s.indexOf(dl, 1);
    this.dev.cfg.banner = end > 0 ? s.slice(1, end) : s.slice(1);
  });
  def('config', 'no banner motd', function () { this.dev.cfg.banner = null; });
  def('config', 'ip domain-lookup', function () { this.dev.cfg.domainLookup = true; });
  def('config', 'no ip domain-lookup', function () { this.dev.cfg.domainLookup = false; });
  def('config', 'ip domain-name <WORD>', function (a) { this.dev.cfg.domainName = a[2]; });
  def('config', 'ip name-server <IP>', function (a) { this.dev.cfg.nameServer = a[2]; });
  def('config', 'ip routing', function () { if (this.dev.cat !== 'switch') this.dev.cfg.ipRouting = true; else invalidAt(this, 'ip routing'); });
  def('config', 'no ip routing', function () { this.dev.cfg.ipRouting = false; });
  def('config', 'ip classless', function () {});
  def('config', 'ip cef', function () {});
  def('config', 'no ip cef', function () {});
  def('config', 'ipv6 cef', function () {});
  def('config', 'no ipv6 cef', function () {});
  def('config', 'ip default-gateway <IP>', function (a) { this.dev.cfg.defGw = a[2]; });
  def('config', 'no ip default-gateway', function () { this.dev.cfg.defGw = null; });
  def('config', 'cdp run', function () { this.dev.cfg.cdp = true; });
  def('config', 'no cdp run', function () { this.dev.cfg.cdp = false; });
  function addUser(d, u) {
    u.pw = u.pw.replace(/^[0-9]\s+/, '');
    d.cfg.users = d.cfg.users.filter(function (x) { return x.name !== u.name; });
    d.cfg.users.push(u);
  }
  def('config', 'username <WORD> password <LINE>', function (a) { addUser(this.dev, { name: a[1], pw: a[3] }); });
  def('config', 'username <WORD> secret <LINE>', function (a) { addUser(this.dev, { name: a[1], pw: a[3], secret: true }); });
  def('config', 'username <WORD> privilege <0-15> password <LINE>', function (a) { addUser(this.dev, { name: a[1], pw: a[5], priv: a[3] }); });
  def('config', 'username <WORD> privilege <0-15> secret <LINE>', function (a) { addUser(this.dev, { name: a[1], pw: a[5], priv: a[3], secret: true }); });
  def('config', 'ip ssh version <1-2>', function (a) { this.dev.cfg.sshVersion = a[3]; });
  def('config', 'crypto key generate rsa', function (a, out) {
    var self = this;
    this.pending = { prompt: 'How many bits in the modulus [512]: ', handle: function (l, o) {
      o.push('% Generating ' + (l.trim() || '512') + ' bit RSA keys, keys will be non-exportable...[OK]');
    } };
    out.push('The name for the keys will be: ' + this.dev.hostname + '.' + (this.dev.cfg.domainName || 'cisco.com'),
      'Choose the size of the key modulus in the range of 360 to 4096 for your', '  General Purpose Keys. Choosing a key modulus greater than 512 may take', '  a few minutes.', '');
  });
  def('config', 'ip http server', function () {});
  def('config', 'no ip http server', function () {});
  def('config', 'logging <IP>', function (a) { this.dev.cfg.logging = a[1]; });
  def('config', 'ntp server <IP>', function (a) { this.dev.cfg.ntp = a[2]; });
  def('config', 'spanning-tree mode pvst', function () { this.dev.cfg.stp.mode = 'pvst'; });
  def('config', 'spanning-tree mode rapid-pvst', function () { this.dev.cfg.stp.mode = 'rapid-pvst'; });
  def('config', 'spanning-tree extend system-id', function () {});
  def('config', 'spanning-tree vlan <1-4094> priority <0-61440>', function (a, out) {
    var p = a[4];
    if (p % 4096) { out.push('% Bridge Priority must be in increments of 4096.', '% Allowed values are:', '  0     4096  8192  12288 16384 20480 24576 28672', '  32768 36864 40960 45056 49152 53248 57344 61440'); return; }
    this.dev.cfg.stp.prio[a[2]] = p;
  });
  def('config', 'spanning-tree vlan <1-4094> root primary', function (a) { this.dev.cfg.stp.prio[a[2]] = 24576; });
  def('config', 'spanning-tree vlan <1-4094> root secondary', function (a) { this.dev.cfg.stp.prio[a[2]] = 28672; });
  def('config', 'no spanning-tree vlan <1-4094>', function (a) { var o = this.dev.cfg.stp.off; if (o.indexOf(a[3]) < 0) o.push(a[3]); });
  def('config', 'spanning-tree vlan <1-4094>', function (a) { this.dev.cfg.stp.off = this.dev.cfg.stp.off.filter(function (v) { return v !== a[2]; }); });

  /* interface */
  def('config', 'interface <IF>', function (a, out) { return enterIf(this, a[1], out); });
  def('config', 'interface range <LINE>', function (a, out) {
    var list = expandRange(this.dev, a[2]);
    if (!list) { invalidAt(this, 'interface range ' + a[2]); return 'noTouch'; }
    this.mode = 'ifrange'; this.ctx = { ifs: list };
    return 'noTouch';
  });
  def('config', 'no interface <IF>', function (a, out) {
    var n = a[2], d = this.dev, i = this.net.iface(d, n);
    if (!i) return;
    if (i.parent || /^(Loopback|Vlan)/.test(n)) {
      if (/^Vlan1$/.test(n)) { out.push('% Removal of interface Vlan1 is not permitted'); return; }
      d.ifaces = d.ifaces.filter(function (x) { return x !== i; });
    } else out.push('% Removal of physical interfaces is not permitted');
  });
  function enterIf(s, name, out) {
    var d = s.dev, net = s.net;
    var i = net.iface(d, name);
    if (!i) {
      var sub = /^(.+)\.(\d+)$/.exec(name);
      if (sub && d.cat === 'router' && net.iface(d, sub[1]) && !net.iface(d, sub[1]).parent) {
        i = E.newIface(d, name); i.parent = sub[1]; i.shutdown = false; i.mac = net.iface(d, sub[1]).mac;
        insertIface(d, i);
      } else if (/^Vlan(\d+)$/.test(name) && (d.cat === 'switch' || d.cat === 'l3switch')) {
        var vid = +/^Vlan(\d+)$/.exec(name)[1];
        if (vid < 1 || vid > 4094) { invalidAt(s, 'interface ' + name); return 'noTouch'; }
        i = E.newIface(d, name); i.shutdown = false; i.mac = d.ifaces.filter(function (x) { return /^Vlan1$/.test(x.name); })[0].mac;
        d.ifaces.push(i);
        out.push('%LINK-5-CHANGED: Interface ' + name + ', changed state to up');
      } else if (/^Loopback\d+$/.test(name) && d.cat !== 'switch') {
        i = E.newIface(d, name); i.shutdown = false; d.ifaces.push(i);
        out.push('%LINK-5-CHANGED: Interface ' + name + ', changed state to up', '%LINEPROTO-5-UPDOWN: Line protocol on Interface ' + name + ', changed state to up');
      } else {
        out.push('%Invalid interface type and number');
        return 'noTouch';
      }
    }
    s.mode = i.parent ? 'subif' : 'if';
    s.ctx = { ifs: [i.name] };
    return 'noTouch';
  }
  function insertIface(d, i) {
    var idx = -1;
    d.ifaces.forEach(function (x, k) { if (x.name === i.parent || x.parent === i.parent) idx = k; });
    d.ifaces.splice(idx + 1, 0, i);
  }
  function invalidAt(s, line) {
    s.out.push(new Array(s.prompt().length + 1).join(' ') + '^', "% Invalid input detected at '^' marker.", '\t');
  }
  function expandRange(d, spec) {
    /* "f0/1 - 4, f0/6" ou "fa0/1-24" ou "g0/1 - 2" */
    var parts = spec.split(','), out = [];
    for (var k = 0; k < parts.length; k++) {
      var p = parts[k].replace(/\s+/g, ' ').trim();
      var m = /^([A-Za-z-]+)\s*([\d/]+\/)(\d+)\s*(?:-\s*(\d+))?$/.exec(p);
      if (!m) return null;
      var t = E.canonIfType(m[1]);
      if (!t) return null;
      var a = +m[3], b = m[4] ? +m[4] : a;
      if (b < a) return null;
      for (var n = a; n <= b; n++) {
        var name = t + m[2] + n;
        if (!d.ifaces.some(function (x) { return x.name === name; })) return null;
        out.push(name);
      }
    }
    return out;
  }

  /* routes statiques */
  function addRoute(s, net0, msk, nh, ifn, ad) {
    var len = N.maskLen(msk);
    if (len < 0) { s.out.push('%Inconsistent address and mask'); return; }
    if ((net0 & N.len2mask(len)) >>> 0 !== net0) { s.out.push('%Inconsistent address and mask'); return; }
    var r = s.dev.cfg.routes;
    var ex = r.filter(function (x) { return x.net === net0 && x.len === len && x.nh === nh && x.iface === ifn; })[0];
    if (ex) { ex.ad = ad; return; }
    r.push({ net: net0, len: len, nh: nh, iface: ifn, ad: ad || 1 });
  }
  def('config', 'ip route <IP:Destination prefix> <MASK:Destination prefix mask> <NH:Forwarding router\'s address>', function (a) { addRoute(this, a[2], a[3], a[4], null, 1); });
  def('config', 'ip route <IP> <MASK> <NH> <1-255>', function (a) { addRoute(this, a[2], a[3], a[4], null, a[5]); });
  def('config', 'ip route <IP> <MASK> <IF>', function (a, out) {
    if (!this.net.iface(this.dev, a[4])) { out.push('%Invalid interface type and number'); return; }
    addRoute(this, a[2], a[3], null, a[4], 1);
  });
  def('config', 'ip route <IP> <MASK> <IF> <NH>', function (a) { addRoute(this, a[2], a[3], a[5], a[4], 1); });
  def('config', 'no ip route <IP> <MASK>', function (a) {
    var len = N.maskLen(a[4]);
    this.dev.cfg.routes = this.dev.cfg.routes.filter(function (x) { return !(x.net === a[3] && x.len === len); });
  });
  def('config', 'no ip route <IP> <MASK> <NH>', function (a) {
    var len = N.maskLen(a[4]);
    this.dev.cfg.routes = this.dev.cfg.routes.filter(function (x) { return !(x.net === a[3] && x.len === len && x.nh === a[5]); });
  });
  def('config', 'no ip route <IP> <MASK> <IF>', function (a) {
    var len = N.maskLen(a[4]);
    this.dev.cfg.routes = this.dev.cfg.routes.filter(function (x) { return !(x.net === a[3] && x.len === len && x.iface === a[5]); });
  });

  /* DHCP (routeur) */
  def('config', 'ip dhcp pool <WORD:Pool name>', function (a) {
    var p = this.dev.cfg.dhcpPools;
    if (!p[a[3]]) p[a[3]] = { net: null, len: null, routers: [], dns: [], domain: null };
    this.mode = 'dhcp'; this.ctx = { pool: a[3] };
  });
  def('config', 'no ip dhcp pool <WORD>', function (a) { delete this.dev.cfg.dhcpPools[a[4]]; });
  def('config', 'ip dhcp excluded-address <IP:Low IP address>', function (a) { this.dev.cfg.dhcpExcl.push([a[3], a[3]]); });
  def('config', 'ip dhcp excluded-address <IP:Low IP address> <IP:High IP address>', function (a) { this.dev.cfg.dhcpExcl.push([a[3], a[4]]); });
  def('config', 'no ip dhcp excluded-address <IP>', function (a) { this.dev.cfg.dhcpExcl = this.dev.cfg.dhcpExcl.filter(function (x) { return x[0] !== a[4]; }); });
  def('config', 'no ip dhcp excluded-address <IP> <IP>', function (a) { this.dev.cfg.dhcpExcl = this.dev.cfg.dhcpExcl.filter(function (x) { return !(x[0] === a[4] && x[1] === a[5]); }); });
  def('dhcp', 'network <IP:Network number in dotted-decimal notation> <MASK:Network mask or prefix length>', function (a, out) {
    var len = N.maskLen(a[2]);
    if (len < 0) { out.push('%Invalid mask'); return; }
    var p = this.dev.cfg.dhcpPools[this.ctx.pool]; p.net = N.netOf(a[1], len); p.len = len;
  });
  def('dhcp', 'network <IP> <WORD>', function (a, out) {
    var m = /^\/(\d+)$/.exec(a[2]);
    if (!m) { invalidAt(this, ''); return; }
    var p = this.dev.cfg.dhcpPools[this.ctx.pool]; p.len = +m[1]; p.net = N.netOf(a[1], p.len);
  });
  def('dhcp', 'default-router <IP:Router\'s IP address>', function (a) { this.dev.cfg.dhcpPools[this.ctx.pool].routers = [a[1]]; });
  def('dhcp', 'default-router <IP> <IP>', function (a) { this.dev.cfg.dhcpPools[this.ctx.pool].routers = [a[1], a[2]]; });
  def('dhcp', 'dns-server <IP:Server\'s name or IP address>', function (a) { this.dev.cfg.dhcpPools[this.ctx.pool].dns = [a[1]]; });
  def('dhcp', 'dns-server <IP> <IP>', function (a) { this.dev.cfg.dhcpPools[this.ctx.pool].dns = [a[1], a[2]]; });
  def('dhcp', 'domain-name <WORD>', function (a) { this.dev.cfg.dhcpPools[this.ctx.pool].domain = a[1]; });
  def('dhcp', 'lease <0-365>', function (a) { this.dev.cfg.dhcpPools[this.ctx.pool].lease = a[1]; });
  def('dhcp', 'no default-router', function () { this.dev.cfg.dhcpPools[this.ctx.pool].routers = []; });
  def('dhcp', 'no dns-server', function () { this.dev.cfg.dhcpPools[this.ctx.pool].dns = []; });

  /* NAT */
  def('config', 'ip nat inside source list <1-199> interface <IF> overload', function (a, out) {
    if (!this.net.iface(this.dev, a[7])) { out.push('%Invalid interface type and number'); return; }
    var r = this.dev.cfg.natDyn.filter(function (x) { return x.acl === a[5]; })[0];
    if (r) { r.iface = a[7]; r.pool = null; r.overload = true; } else this.dev.cfg.natDyn.push({ acl: a[5], iface: a[7], pool: null, overload: true });
  });
  def('config', 'ip nat inside source list <1-199> pool <WORD>', function (a) { this.dev.cfg.natDyn.push({ acl: a[5], iface: null, pool: a[7], overload: false }); });
  def('config', 'ip nat inside source list <1-199> pool <WORD> overload', function (a) { this.dev.cfg.natDyn.push({ acl: a[5], iface: null, pool: a[7], overload: true }); });
  def('config', 'ip nat pool <WORD> <IP> <IP> netmask <MASK>', function (a) { this.dev.cfg.natPools[a[3]] = { start: a[4], end: a[5], len: N.maskLen(a[7]) }; });
  def('config', 'ip nat inside source static <IP> <IP>', function (a) {
    this.dev.cfg.natStatic.push({ proto: null, local: a[5], global: a[6] });
  });
  ['tcp', 'udp'].forEach(function (pr) {
    def('config', 'ip nat inside source static ' + pr + ' <IP> <1-65535> <IP> <1-65535>', function (a) {
      this.dev.cfg.natStatic.push({ proto: pr, local: a[6], lport: a[7], global: a[8], gport: a[9] });
    });
    def('config', 'ip nat inside source static ' + pr + ' <IP> <1-65535> interface <IF> <1-65535>', function (a) {
      this.dev.cfg.natStatic.push({ proto: pr, local: a[6], lport: a[7], global: null, gIface: a[9], gport: a[10] });
    });
    def('config', 'no ip nat inside source static ' + pr + ' <IP> <1-65535> <IP> <1-65535>', function (a) {
      this.dev.cfg.natStatic = this.dev.cfg.natStatic.filter(function (x) { return !(x.proto === pr && x.local === a[7] && x.lport === a[8] && x.gport === a[10]); });
    });
  });
  def('config', 'no ip nat inside source static <IP> <IP>', function (a) {
    this.dev.cfg.natStatic = this.dev.cfg.natStatic.filter(function (x) { return !(x.proto == null && x.local === a[6] && x.global === a[7]); });
  });
  def('config', 'no ip nat inside source list <1-199> interface <IF> overload', function (a) {
    this.dev.cfg.natDyn = this.dev.cfg.natDyn.filter(function (x) { return x.acl !== a[6]; });
  });

  /* ACL standard */
  function aclAdd(s, num, action, rule) {
    var acls = s.dev.cfg.acls;
    acls[num] = acls[num] || [];
    rule.action = action;
    acls[num].push(rule);
  }
  ['permit', 'deny'].forEach(function (act) {
    def('config', 'access-list <1-99:IP standard access list> ' + act + ' any', function (a) { aclAdd(this, a[1], act, { any: true }); });
    def('config', 'access-list <1-99> ' + act + ' host <IP>', function (a) { aclAdd(this, a[1], act, { src: a[4], wild: 0 }); });
    def('config', 'access-list <1-99> ' + act + ' <IP>', function (a) { aclAdd(this, a[1], act, { src: a[3], wild: 0 }); });
    def('config', 'access-list <1-99> ' + act + ' <IP> <MASK>', function (a) { aclAdd(this, a[1], act, { src: (a[3] & ~a[4]) >>> 0, wild: a[4] }); });
  });
  def('config', 'no access-list <1-99>', function (a) { delete this.dev.cfg.acls[a[2]]; });

  /* RIP / OSPF */
  def('config', 'router rip', function () {
    if (this.dev.cat === 'switch') { invalidAt(this, 'router rip'); return; }
    if (!this.dev.cfg.rip) this.dev.cfg.rip = { version: null, networks: [], passive: [], autoSummary: true };
    this.mode = 'rip'; this.ctx = {};
  });
  def('config', 'no router rip', function () { this.dev.cfg.rip = null; });
  def('rip', 'version <1-2>', function (a) { this.dev.cfg.rip.version = a[1]; });
  def('rip', 'no version', function () { this.dev.cfg.rip.version = null; });
  def('rip', 'network <IP:Network number>', function (a) {
    var n = N.netOf(a[1], N.classfulLen(a[1]));
    if (this.dev.cfg.rip.networks.indexOf(n) < 0) this.dev.cfg.rip.networks.push(n);
  });
  def('rip', 'no network <IP>', function (a) {
    var n = N.netOf(a[2], N.classfulLen(a[2]));
    this.dev.cfg.rip.networks = this.dev.cfg.rip.networks.filter(function (x) { return x !== n; });
  });
  def('rip', 'no auto-summary', function () { this.dev.cfg.rip.autoSummary = false; });
  def('rip', 'auto-summary', function () { this.dev.cfg.rip.autoSummary = true; });
  def('rip', 'passive-interface <IF>', function (a) { this.dev.cfg.rip.passive.push(a[1]); });
  def('rip', 'no passive-interface <IF>', function (a) { this.dev.cfg.rip.passive = this.dev.cfg.rip.passive.filter(function (x) { return x !== a[2]; }); });
  def('rip', 'default-information originate', function () { this.dev.cfg.rip.defOrig = true; });
  def('rip', 'redistribute static', function () { this.dev.cfg.rip.redistStatic = true; });
  def('config', 'router ospf <1-65535:Process ID>', function (a) {
    if (this.dev.cat === 'switch') { invalidAt(this, 'router ospf'); return; }
    var o = this.dev.cfg.ospf;
    if (!o[a[2]]) o[a[2]] = { networks: [], rid: null, passive: [] };
    this.mode = 'ospf'; this.ctx = { pid: a[2] };
  });
  def('config', 'no router ospf <1-65535>', function (a) { delete this.dev.cfg.ospf[a[3]]; });
  def('ospf', 'network <IP> <MASK> area <0-4294967295>', function (a) {
    this.dev.cfg.ospf[this.ctx.pid].networks.push({ addr: a[1], wild: a[2], area: a[4] });
  });
  def('ospf', 'no network <IP> <MASK> area <0-4294967295>', function (a) {
    var o = this.dev.cfg.ospf[this.ctx.pid];
    o.networks = o.networks.filter(function (n) { return !(n.addr === a[2] && n.wild === a[3]); });
  });
  def('ospf', 'router-id <IP>', function (a) { this.dev.cfg.ospf[this.ctx.pid].rid = a[1]; });
  def('ospf', 'passive-interface <IF>', function (a) { this.dev.cfg.ospf[this.ctx.pid].passive.push(a[1]); });
  def('ospf', 'log-adjacency-changes', function () {});
  def('ospf', 'default-information originate', function () {});

  /* VLAN (switch) */
  function vlanOk(s) { if (s.dev.cat !== 'switch' && s.dev.cat !== 'l3switch') { invalidAt(s, 'vlan'); return false; } return true; }
  def('config', 'vlan <1-4094:ISL VLAN IDs 1-1005>', function (a, out) {
    if (!vlanOk(this)) return;
    var id = a[1];
    if (id >= 1002 && id <= 1005) { out.push('Default VLAN ' + id + ' may not have its name changed.'); }
    if (!this.net.vlanExists(this.dev, id)) this.dev.cfg.vlans.push({ id: id, name: 'VLAN' + ('000' + id).slice(-4) });
    this.dev.cfg.vlans.sort(function (x, y) { return x.id - y.id; });
    this.mode = 'vlan'; this.ctx = { vlan: id };
  });
  def('config', 'no vlan <1-4094>', function (a, out) {
    if (a[2] === 1) { out.push('Default VLAN 1 may not be deleted.'); return; }
    this.dev.cfg.vlans = this.dev.cfg.vlans.filter(function (v) { return v.id !== a[2]; });
  });
  def('vlan', 'name <WORD:The ascii name for the VLAN>', function (a) {
    var id = this.ctx.vlan;
    this.dev.cfg.vlans.forEach(function (v) { if (v.id === id) v.name = a[1]; });
  });
  def('vlan', 'no name', function () { var id = this.ctx.vlan; this.dev.cfg.vlans.forEach(function (v) { if (v.id === id) v.name = 'VLAN' + ('000' + id).slice(-4); }); });

  /* IPv6 global */
  def('config', 'ipv6 unicast-routing', function () { this.dev.cfg.ipv6Routing = true; });
  def('config', 'no ipv6 unicast-routing', function () { this.dev.cfg.ipv6Routing = false; });
  def('config', 'ipv6 route <PFX6> <IP6>', function (a) { this.dev.cfg.routes6.push({ w: N.net6(a[2].w, a[2].len), len: a[2].len, nh: a[3], iface: null }); });
  def('config', 'ipv6 route <PFX6> <IF>', function (a) { this.dev.cfg.routes6.push({ w: N.net6(a[2].w, a[2].len), len: a[2].len, nh: null, iface: a[3] }); });
  def('config', 'ipv6 route <PFX6> <IF> <IP6>', function (a) { this.dev.cfg.routes6.push({ w: N.net6(a[2].w, a[2].len), len: a[2].len, nh: a[4], iface: a[3] }); });
  def('config', 'no ipv6 route <PFX6>', function (a) {
    var p = a[3];
    this.dev.cfg.routes6 = this.dev.cfg.routes6.filter(function (r) { return !(r.len === p.len && N.sameNet6(r.w, p.w, p.len)); });
  });
  def('config', 'no ipv6 route <PFX6> <IP6>', function (a) {
    var p = a[3];
    this.dev.cfg.routes6 = this.dev.cfg.routes6.filter(function (r) { return !(r.len === p.len && N.sameNet6(r.w, p.w, p.len)); });
  });
  def('config', 'ipv6 dhcp pool <WORD>', function (a) {
    var p = this.dev.cfg.dhcp6Pools;
    if (!p[a[3]]) p[a[3]] = { dns: [], domain: null };
    this.mode = 'dhcp6'; this.ctx = { pool: a[3] };
  });
  def('dhcp6', 'dns-server <IP6>', function (a) { this.dev.cfg.dhcp6Pools[this.ctx.pool].dns.push(a[1]); });
  def('dhcp6', 'domain-name <WORD>', function (a) { this.dev.cfg.dhcp6Pools[this.ctx.pool].domain = a[1]; });

  /* lignes */
  def('config', 'line con 0', function () { this.mode = 'line'; this.ctx = { line: 'con' }; });
  def('config', 'line aux 0', function () { this.mode = 'line'; this.ctx = { line: 'aux' }; });
  def('config', 'line vty <0-15> <0-15>', function (a) { this.mode = 'line'; this.ctx = { line: 'vty', from: a[2], to: a[3] }; });
  def('line', 'password <LINE>', function (a) { this.dev.cfg.lines[this.ctx.line] = this.dev.cfg.lines[this.ctx.line] || {}; this.dev.cfg.lines[this.ctx.line].password = a[1].replace(/^[07]\s+/, ''); });
  def('line', 'login', function () { this.dev.cfg.lines[this.ctx.line] = this.dev.cfg.lines[this.ctx.line] || {}; this.dev.cfg.lines[this.ctx.line].login = true; });
  def('line', 'login local', function () { this.dev.cfg.lines[this.ctx.line] = this.dev.cfg.lines[this.ctx.line] || {}; this.dev.cfg.lines[this.ctx.line].login = 'local'; });
  def('line', 'no login', function () { (this.dev.cfg.lines[this.ctx.line] || {}).login = false; });
  def('line', 'transport input <WORD>', function (a) { this.dev.cfg.lines[this.ctx.line] = this.dev.cfg.lines[this.ctx.line] || {}; this.dev.cfg.lines[this.ctx.line].transport = a[2]; });
  def('line', 'exec-timeout <0-35791> <0-2147483>', function () {});
  def('line', 'logging synchronous', function () {});

  /* ---------------------------------------------------------- */
  /* Mode interface                                               */
  /* ---------------------------------------------------------- */
  function eachIf(s, fn) { s.ifaceCtx().forEach(function (i) { fn(i); }); }
  def('if', 'ip address <IP:IP address> <MASK:IP subnet mask>', function (a, out) {
    var s = this, d = this.dev, net = this.net;
    eachIf(this, function (i) {
      if (i.sw && !i.sw.routed && !/^Vlan/.test(i.name)) { invalidAt(s, ''); return; }
      if (i.parent && !i.encap) {
        out.push('% Configuring IP routing on a LAN subinterface is only allowed if that', 'subinterface is already configured as part of an IEEE 802.10, IEEE 802.1Q,', 'or ISL vLAN.', '');
        return;
      }
      var len = N.maskLen(a[3]);
      if (len < 0) { out.push('Bad mask 0x' + ('00000000' + (a[3] >>> 0).toString(16).toUpperCase()).slice(-8) + ' for address ' + ip(a[2])); return; }
      if (len < 31 && (a[2] === N.netOf(a[2], len) || a[2] === N.bcastOf(a[2], len))) { out.push('Bad mask /' + len + ' for address ' + ip(a[2])); return; }
      var clash = d.ifaces.filter(function (x) {
        return x !== i && x.ip != null && (N.sameNet(x.ip, a[2], Math.min(x.len, len)));
      })[0];
      if (clash && d.cat !== 'switch') { out.push('% ' + ip(N.netOf(a[2], len)) + ' overlaps with ' + clash.name); return; }
      i.ip = a[2]; i.len = len;
    });
  });
  def('if', 'ip address <IP> <MASK> secondary', function (a) { eachIf(this, function (i) { i.sec.push({ ip: a[2], len: N.maskLen(a[3]) }); }); });
  def('if', 'no ip address', function () { eachIf(this, function (i) { i.ip = null; i.len = null; i.sec = []; }); });
  def('if', 'no ip address <IP> <MASK>', function () { eachIf(this, function (i) { i.ip = null; i.len = null; }); });
  def('if', 'ip address dhcp', function (a, out) { out.push('% DHCP client not supported in this simulation.'); });
  def('if', 'shutdown', function () { eachIf(this, function (i) { i.shutdown = true; }); });
  def('if', 'no shutdown', function () { eachIf(this, function (i) { i.shutdown = false; }); });
  def('if', 'description <LINE>', function (a) { eachIf(this, function (i) { i.desc = a[1]; }); });
  def('if', 'no description', function () { eachIf(this, function (i) { i.desc = ''; }); });
  def('if', 'duplex <WORD>', function (a) { eachIf(this, function (i) { i.duplex = a[1]; }); });
  def('if', 'speed <WORD>', function (a) { eachIf(this, function (i) { i.speed = a[1]; }); });
  def('if', 'bandwidth <1-10000000>', function (a) { eachIf(this, function (i) { i.bw = a[1]; }); });
  def('if', 'clock rate <300-4000000>', function (a) { eachIf(this, function (i) { i.clock = a[2]; }); });
  def('if', 'mtu <64-18000>', function () {});
  def('if', 'encapsulation dot1Q <1-4094:IEEE 802.1Q VLAN ID required>', function (a, out) {
    var s = this;
    eachIf(this, function (i) {
      if (!i.parent) { invalidAt(s, ''); return; }
      i.encap = { vlan: a[2], native: false };
    });
  });
  def('if', 'encapsulation dot1Q <1-4094> native', function (a) { eachIf(this, function (i) { if (i.parent) i.encap = { vlan: a[2], native: true }; }); });
  def('if', 'ip helper-address <IP:IP destination address>', function (a) { eachIf(this, function (i) { if (i.helper.indexOf(a[2]) < 0) i.helper.push(a[2]); }); });
  def('if', 'no ip helper-address', function () { eachIf(this, function (i) { i.helper = []; }); });
  def('if', 'no ip helper-address <IP>', function (a) { eachIf(this, function (i) { i.helper = i.helper.filter(function (h) { return h !== a[3]; }); }); });
  def('if', 'ip nat inside', function () { eachIf(this, function (i) { i.natIn = true; i.natOut = false; }); });
  def('if', 'ip nat outside', function () { eachIf(this, function (i) { i.natOut = true; i.natIn = false; }); });
  def('if', 'no ip nat inside', function () { eachIf(this, function (i) { i.natIn = false; }); });
  def('if', 'no ip nat outside', function () { eachIf(this, function (i) { i.natOut = false; }); });
  def('if', 'ip ospf cost <1-65535>', function () {});
  /* HSRP */
  function sb(i, g) { i.standby[g] = i.standby[g] || { ip: null, prio: null, preempt: false }; return i.standby[g]; }
  def('if', 'standby ip <IP>', function (a) { eachIf(this, function (i) { sb(i, 0).ip = a[2]; }); });
  def('if', 'standby <0-4095:group number> ip <IP:Virtual IP address>', function (a) { eachIf(this, function (i) { sb(i, a[1]).ip = a[3]; }); });
  def('if', 'standby priority <0-255>', function (a) { eachIf(this, function (i) { sb(i, 0).prio = a[2]; }); });
  def('if', 'standby <0-4095> priority <0-255>', function (a) { eachIf(this, function (i) { sb(i, a[1]).prio = a[3]; }); });
  def('if', 'standby preempt', function () { eachIf(this, function (i) { sb(i, 0).preempt = true; }); });
  def('if', 'standby <0-4095> preempt', function (a) { eachIf(this, function (i) { sb(i, a[1]).preempt = true; }); });
  def('if', 'standby <0-4095> preempt delay minimum <0-3600>', function (a) { eachIf(this, function (i) { sb(i, a[1]).preempt = true; }); });
  def('if', 'standby version <1-2>', function (a) { eachIf(this, function (i) { i.hsrpV = a[2]; }); });
  def('if', 'standby <0-4095> timers <1-254> <1-255>', function () {});
  def('if', 'no standby <0-4095>', function (a) { eachIf(this, function (i) { delete i.standby[a[2]]; }); });
  def('if', 'no standby <0-4095> preempt', function (a) { eachIf(this, function (i) { if (i.standby[a[2]]) i.standby[a[2]].preempt = false; }); });
  def('if', 'no standby <0-4095> priority', function (a) { eachIf(this, function (i) { if (i.standby[a[2]]) i.standby[a[2]].prio = null; }); });
  /* IPv6 interface */
  def('if', 'ipv6 enable', function () { eachIf(this, function (i) { i.v6.enabled = true; }); });
  def('if', 'no ipv6 enable', function () { eachIf(this, function (i) { i.v6.enabled = false; }); });
  def('if', 'ipv6 address <PFX6:IPv6 prefix>', function (a) {
    eachIf(this, function (i) {
      var p = a[2];
      if (!i.v6.addrs.some(function (x) { return !x.eui && N.eq6(N.fmt6(x.w), N.fmt6(p.w)) && x.len === p.len; })) i.v6.addrs.push({ w: p.w, len: p.len, eui: false });
    });
  });
  def('if', 'ipv6 address <PFX6> eui-64', function (a) {
    eachIf(this, function (i) {
      var p = a[2];
      var net0 = N.net6(p.w, 64);
      if (!i.v6.addrs.some(function (x) { return x.eui && N.sameNet6(x.w, net0, 64); })) i.v6.addrs.push({ w: net0, len: p.len, eui: true });
    });
  });
  def('if', 'ipv6 address <IP6> link-local', function (a) { eachIf(this, function (i) { i.v6.ll = a[2]; }); });
  def('if', 'no ipv6 address', function () { eachIf(this, function (i) { i.v6.addrs = []; i.v6.ll = null; }); });
  def('if', 'no ipv6 address <PFX6>', function (a) {
    eachIf(this, function (i) { i.v6.addrs = i.v6.addrs.filter(function (x) { return !(x.len === a[3].len && N.sameNet6(x.w, a[3].w, 128)); }); });
  });
  def('if', 'no ipv6 address <PFX6> eui-64', function (a) {
    eachIf(this, function (i) { i.v6.addrs = i.v6.addrs.filter(function (x) { return !(x.eui && N.sameNet6(x.w, a[3].w, 64)); }); });
  });
  def('if', 'no ipv6 address <IP6> link-local', function () { eachIf(this, function (i) { i.v6.ll = null; }); });
  def('if', 'ipv6 dhcp server <WORD>', function (a) { eachIf(this, function (i) { i.v6.dhcp = a[3]; }); });
  def('if', 'no ipv6 dhcp server', function () { eachIf(this, function (i) { i.v6.dhcp = null; }); });
  def('if', 'ipv6 nd other-config-flag', function () { eachIf(this, function (i) { i.v6.ndO = true; }); });
  def('if', 'ipv6 nd managed-config-flag', function () { eachIf(this, function (i) { i.v6.ndM = true; }); });
  def('if', 'no ipv6 nd other-config-flag', function () { eachIf(this, function (i) { i.v6.ndO = false; }); });
  /* switchport */
  function swOnly(s) {
    var ok = s.ifaceCtx().every(function (i) { return !!i.sw; });
    if (!ok) invalidAt(s, '');
    return ok;
  }
  def('if', 'switchport mode access', function () { if (swOnly(this)) eachIf(this, function (i) { i.sw.mode = 'access'; i.sw.routed = false; }); });
  def('if', 'switchport mode trunk', function (a, out) {
    var s = this;
    if (!swOnly(this)) return;
    if (this.dev.model === '3560-24PS') {
      /* 3560 : l'encapsulation doit être définie avant */
      var bad = this.ifaceCtx().some(function (i) { return !i.sw.encapSet; });
      if (bad) { out.push('Command rejected: An interface whose trunk encapsulation is "Auto" can not be configured to "trunk" mode.'); return; }
    }
    eachIf(this, function (i) { i.sw.mode = 'trunk'; i.sw.routed = false; });
  });
  def('if', 'switchport mode dynamic auto', function () { if (swOnly(this)) eachIf(this, function (i) { i.sw.mode = 'dynamic-auto'; }); });
  def('if', 'switchport mode dynamic desirable', function () { if (swOnly(this)) eachIf(this, function (i) { i.sw.mode = 'dynamic-desirable'; }); });
  def('if', 'switchport access vlan <1-4094:VLAN ID of the VLAN when this port is in access mode>', function (a, out) {
    if (!swOnly(this)) return;
    var d = this.dev, v = a[3];
    if (!this.net.vlanExists(d, v)) {
      out.push('% Access VLAN does not exist. Creating vlan ' + v);
      d.cfg.vlans.push({ id: v, name: 'VLAN' + ('000' + v).slice(-4) });
      d.cfg.vlans.sort(function (x, y) { return x.id - y.id; });
    }
    eachIf(this, function (i) { i.sw.access = v; });
  });
  def('if', 'no switchport access vlan', function () { if (swOnly(this)) eachIf(this, function (i) { i.sw.access = 1; }); });
  def('if', 'switchport trunk native vlan <1-4094>', function (a) { if (swOnly(this)) eachIf(this, function (i) { i.sw.native = a[4]; }); });
  def('if', 'switchport trunk encapsulation dot1q', function (a, out) {
    if (this.dev.cat !== 'l3switch') { invalidAt(this, ''); return; }
    eachIf(this, function (i) { i.sw.encapSet = true; });
  });
  function parseVlist(s) {
    var out = [];
    var ok = s.split(',').every(function (p) {
      var m = /^(\d+)(?:-(\d+))?$/.exec(p);
      if (!m) return false;
      var a = +m[1], b = m[2] ? +m[2] : a;
      if (b < a || a < 1 || b > 4094) return false;
      for (var k = a; k <= b; k++) out.push(k);
      return true;
    });
    return ok ? out : null;
  }
  def('if', 'switchport trunk allowed vlan <VLIST>', function (a, out) {
    var l = parseVlist(a[4]);
    if (!l) { invalidAt(this, ''); return; }
    if (swOnly(this)) eachIf(this, function (i) { i.sw.allowed = l.length >= 4094 ? null : l; });
  });
  def('if', 'switchport trunk allowed vlan add <VLIST>', function (a) {
    var l = parseVlist(a[5]); if (!l) return;
    if (swOnly(this)) eachIf(this, function (i) { if (!i.sw.allowed) return; l.forEach(function (v) { if (i.sw.allowed.indexOf(v) < 0) i.sw.allowed.push(v); }); i.sw.allowed.sort(function (x, y) { return x - y; }); });
  });
  def('if', 'switchport trunk allowed vlan remove <VLIST>', function (a) {
    var l = parseVlist(a[5]); if (!l) return;
    if (swOnly(this)) eachIf(this, function (i) {
      if (!i.sw.allowed) { i.sw.allowed = []; for (var k = 1; k <= 4094; k++) i.sw.allowed.push(k); }
      i.sw.allowed = i.sw.allowed.filter(function (v) { return l.indexOf(v) < 0; });
    });
  });
  def('if', 'switchport trunk allowed vlan all', function () { if (swOnly(this)) eachIf(this, function (i) { i.sw.allowed = null; }); });
  def('if', 'switchport voice vlan <1-4094>', function (a) { if (swOnly(this)) eachIf(this, function (i) { i.sw.voice = a[3]; }); });
  def('if', 'switchport nonegotiate', function () { if (swOnly(this)) eachIf(this, function (i) { i.sw.noneg = true; }); });
  def('if', 'switchport port-security', function () {});
  def('if', 'switchport port-security maximum <1-132>', function () {});
  def('if', 'switchport port-security mac-address sticky', function () {});
  def('if', 'switchport port-security violation <WORD>', function () {});
  def('if', 'switchport', function () { eachIf(this, function (i) { if (i.sw) i.sw.routed = false; }); });
  def('if', 'no switchport', function () {
    if (this.dev.cat !== 'l3switch') { invalidAt(this, ''); return; }
    eachIf(this, function (i) { if (i.sw) i.sw.routed = true; });
  });
  def('if', 'spanning-tree portfast', function (a, out) {
    eachIf(this, function (i) { if (i.sw) i.sw.portfast = true; });
    out.push('%Warning: portfast should only be enabled on ports connected to a single', ' host. Connecting hubs, concentrators, switches, bridges, etc... to this', ' interface  when portfast is enabled, can cause temporary bridging loops.', ' Use with CAUTION', '');
  });
  def('if', 'spanning-tree bpduguard enable', function () {});
  def('if', 'no spanning-tree portfast', function () { eachIf(this, function (i) { if (i.sw) i.sw.portfast = false; }); });
  def('if', 'interface <IF>', function (a, out) { return enterIf(this, a[1], out); });

  /* ---------------------------------------------------------- */
  /* Rendus "show"                                                */
  /* ---------------------------------------------------------- */
  function clockStr() {
    var d = new Date();
    var mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
    var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
    function z(n) { return ('0' + n).slice(-2); }
    return z(d.getHours()) + ':' + z(d.getMinutes()) + ':' + z(d.getSeconds()) + '.' + ('00' + d.getMilliseconds()).slice(-3) + ' UTC ' + wd + ' ' + mo + ' ' + d.getDate() + ' ' + d.getFullYear();
  }
  function iosVersion(d) {
    var mi = E.modelInfo(d.model);
    if (d.cat === 'switch') return d.model.indexOf('2950') === 0 ? '12.1(22)EA4' : '15.0(2)SE4';
    if (d.cat === 'l3switch') return '16.3.2';
    return { 12: '12.4(15)T1', 15: '15.1(4)M5', 16: '16.9.4', 17: '17.6.3' }[mi.ios] || '15.1(4)M5';
  }
  function showVersion(net, d) {
    var v = iosVersion(d);
    var up = Math.floor((Date.now() - net.bootTime) / 60000);
    var lines = ['Cisco IOS Software, ' + (d.cat === 'router' ? 'C' + d.model.replace(/\D/g, '') + ' Software (' + (d.model === '1941' ? 'C1900-UNIVERSALK9-M' : 'C' + d.model.replace(/\D/g, '') + '-ADVIPSERVICESK9-M') + ')' : 'C2960 Software (C2960-LANBASEK9-M)') + ', Version ' + v + ', RELEASE SOFTWARE (fc1)',
      'Technical Support: http://www.cisco.com/techsupport', 'Copyright (c) 1986-2016 by Cisco Systems, Inc.', 'Compiled Wed 23-Mar-16 14:39 by prod_rel_team', '',
      'ROM: System Bootstrap, Version 15.1(4)M5, RELEASE SOFTWARE (fc1)', '',
      d.hostname + ' uptime is ' + up + ' minutes', 'System returned to ROM by power-on', '',
      'cisco ' + d.model + ' (revision 1.0) with 491520K/32768K bytes of memory.', 'Processor board ID FTX152400KS',
      d.ifaces.filter(function (i) { return /Gigabit/.test(i.name) && !i.parent; }).length + ' Gigabit Ethernet interfaces',
      d.ifaces.filter(function (i) { return /^FastEthernet/.test(i.name) && !i.parent; }).length + ' FastEthernet interfaces',
      'DRAM configuration is 64 bits wide with parity disabled.', '255K bytes of non-volatile configuration memory.', '', 'Configuration register is 0x2102'];
    return lines;
  }
  function routeLine(r, d, style15) {
    var code = r.code;
    var pfx = ip(r.net) + '/' + r.len;
    var tail;
    if (r.code === 'C') tail = ' is directly connected, ' + r.iface;
    else if (r.code === 'L') tail = ' is directly connected, ' + r.iface;
    else if (r.code === 'S' || r.code === 'S*') tail = (r.nh != null ? ' [' + r.ad + '/0] via ' + ip(r.nh) : ' is directly connected, ' + r.iface);
    else tail = ' [' + r.ad + '/' + r.metric + '] via ' + ip(r.nh) + ', 00:00:' + ('0' + (Math.floor(Date.now() / 1000) % 30)).slice(-2) + ', ' + r.iface;
    return { code: code, pfx: pfx, tail: tail };
  }
  function showIpRoute(net, d, filter) {
    if (d.cat === 'switch' || (d.cat === 'l3switch' && !d.cfg.ipRouting)) {
      return d.cfg.defGw != null ? ['Default gateway is ' + ip(d.cfg.defGw), '', 'Host               Gateway           Last Use    Total Uses  Interface', 'ICMP redirect cache is empty'] : ['Default gateway is not set', '', 'Host               Gateway           Last Use    Total Uses  Interface', 'ICMP redirect cache is empty'];
    }
    var mi = E.modelInfo(d.model);
    var style15 = (mi.ios || 15) >= 15;
    var t = net.routeTable(d).filter(function (r) { return style15 || r.code !== 'L'; });
    var out = [];
    if (!filter) {
      if (style15) {
        out.push('Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP',
          '       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area',
          '       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2',
          '       E1 - OSPF external type 1, E2 - OSPF external type 2, E - EGP',
          '       i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area',
          '       * - candidate default, U - per-user static route, o - ODR',
          '       P - periodic downloaded static route', '');
      } else {
        out.push('Codes: C - connected, S - static, I - IGRP, R - RIP, M - mobile, B - BGP',
          '       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area',
          '       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2',
          '       E1 - OSPF external type 1, E2 - OSPF external type 2, E - EGP',
          '       i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area',
          '       * - candidate default, U - per-user static route, o - ODR',
          '       P - periodic downloaded static route', '');
      }
      var def0 = t.filter(function (r) { return r.len === 0; })[0];
      out.push(def0 ? 'Gateway of last resort is ' + (def0.nh != null ? ip(def0.nh) : '0.0.0.0') + ' to network 0.0.0.0' : 'Gateway of last resort is not set', '');
    } else {
      t = t.filter(function (r) { return r.code === filter || (filter === 'S' && r.code === 'S*') || (filter === 'C' && r.code === 'L'); });
    }
    /* regroupement par réseau "classful" */
    var groups = [], byKey = {};
    t.forEach(function (r) {
      if (r.len === 0) { groups.push({ single: r }); return; }
      var cl = N.classfulLen(r.net), key = N.netOf(r.net, cl);
      if (!byKey[key]) { byKey[key] = { key: key, cl: cl, routes: [] }; groups.push(byKey[key]); }
      byKey[key].routes.push(r);
    });
    groups.forEach(function (g) {
      if (g.single) {
        var x = routeLine(g.single, d, style15);
        out.push(pad(x.code, style15 ? 6 : 5) + x.pfx + x.tail);
        return;
      }
      var rs = g.routes;
      if (rs.length === 1 && rs[0].len === g.cl) {
        var y = routeLine(rs[0], d, style15);
        out.push(pad(y.code, style15 ? 6 : 5) + y.pfx + y.tail);
        return;
      }
      var lens = {};
      rs.forEach(function (r) { lens[r.len] = 1; });
      var nl = Object.keys(lens).length;
      var hdr = nl > 1 ? ip(g.key) + '/' + g.cl + ' is variably subnetted, ' + rs.length + ' subnets, ' + nl + ' masks'
        : ip(g.key) + '/' + rs[0].len + ' is subnetted, ' + rs.length + ' subnet' + (rs.length > 1 ? 's' : '');
      out.push((style15 ? '      ' : '     ') + hdr);
      rs.forEach(function (r) {
        var z = routeLine(r, d, style15);
        out.push(pad(z.code, style15 ? 9 : 8) + z.pfx + z.tail);
      });
    });
    return out;
  }
  function showInterface(net, d, i) {
    var s = net.ifStatus(d, i);
    var out = [];
    var hw = /Gigabit/.test(i.name) ? 'CN Gigabit Ethernet' : /^Fast/.test(i.name) ? 'Lance' : /^Serial/.test(i.name) ? 'HD64570' : /^Vlan/.test(i.name) ? 'CPU Interface' : 'Ethernet';
    out.push(i.name + ' is ' + s.status + ', line protocol is ' + s.proto + (s.proto === 'up' && i.sw ? ' (connected)' : ''));
    out.push('  Hardware is ' + hw + ', address is ' + N.macCisco(i.mac) + ' (bia ' + N.macCisco(i.mac) + ')');
    if (i.desc) out.push('  Description: ' + i.desc);
    if (i.ip != null) out.push('  Internet address is ' + ip(i.ip) + '/' + i.len);
    var bw = i.bw || (E.speedOf(i.name) * 1000);
    out.push('  MTU 1500 bytes, BW ' + bw + ' Kbit, DLY 100 usec,', '     reliability 255/255, txload 1/255, rxload 1/255');
    if (i.encap) out.push('  Encapsulation 802.1Q Virtual LAN, Vlan ID  ' + i.encap.vlan);
    else out.push('  Encapsulation ARPA, loopback not set');
    if (!i.parent && !/^Vlan/.test(i.name)) out.push('  Full-duplex, ' + (E.speedOf(i.name) >= 1000 ? '1000Mb/s' : '100Mb/s') + ', media type is RJ45');
    out.push('  ARP type: ARPA, ARP Timeout 04:00:00, ', '  Last input 00:00:08, output 00:00:05, output hang never', '  Last clearing of "show interface" counters never',
      '  Input queue: 0/75/0 (size/max/drops); Total output drops: 0', '  5 minute input rate 0 bits/sec, 0 packets/sec', '  5 minute output rate 0 bits/sec, 0 packets/sec');
    return out;
  }
  function showIntStatus(net, d) {
    var out = ['Port      Name               Status       Vlan       Duplex  Speed Type'];
    d.ifaces.forEach(function (i) {
      if (!i.sw) return;
      var up = net.physUp(d, i.name);
      var st = i.shutdown ? 'disabled' : up ? 'connected' : 'notconnect';
      var vl = net.opMode(d, i) === 'trunk' ? 'trunk' : String(i.sw.access);
      out.push(pad(E.shortIf(i.name), 10) + pad(i.desc || '', 19) + pad(st, 13) + pad(vl, 11) + pad('auto', 8) + pad('auto', 6) + (/Gig/.test(i.name) ? '10/100/1000BaseTX' : '10/100BaseTX'));
    });
    return out;
  }
  function vlanPortsText(names) {
    var lines = [], cur = '';
    names.forEach(function (n) {
      var piece = (cur ? ', ' : '') + n;
      if ((cur + piece).length > 31) { lines.push(cur + ','); cur = n; }
      else cur += piece;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function showVlan(net, d, brief) {
    if (d.cat !== 'switch' && d.cat !== 'l3switch') return ['% Ambiguous command: "show vlan"'];
    var out = ['', 'VLAN Name                             Status    Ports', '---- -------------------------------- --------- -------------------------------'];
    d.cfg.vlans.forEach(function (v) {
      if (v.id >= 1002 && v.id <= 1005) return;
      var ports = d.ifaces.filter(function (i) { return i.sw && !i.sw.routed && net.opMode(d, i) === 'access' && (i.sw.access === v.id || i.sw.voice === v.id); })
        .map(function (i) { return E.shortIf(i.name).replace(/^Gig/, 'Gig'); });
      var pl = vlanPortsText(ports);
      out.push(pad(v.id, 5) + pad(v.name, 33) + pad('active', 10) + (pl[0] || ''));
      pl.slice(1).forEach(function (l) { out.push(new Array(49).join(' ') + l); });
    });
    [[1002, 'fddi-default'], [1003, 'token-ring-default'], [1004, 'fddinet-default'], [1005, 'trnet-default']].forEach(function (x) {
      out.push(pad(x[0], 5) + pad(x[1], 33) + 'active    ');
    });
    if (!brief) {
      out.push('', 'VLAN Type  SAID       MTU   Parent RingNo BridgeNo Stp  BrdgMode Trans1 Trans2', '---- ----- ---------- ----- ------ ------ -------- ---- -------- ------ ------');
      d.cfg.vlans.forEach(function (v) { if (v.id < 1002) out.push(pad(v.id, 5) + 'enet  ' + pad(100000 + v.id, 11) + '1500  -      -      -        -    -        0      0'); });
    }
    return out;
  }
  function showTrunk(net, d) {
    var tr = d.ifaces.filter(function (i) { return i.sw && net.physUp(d, i.name) && net.opMode(d, i) === 'trunk'; });
    if (!tr.length) return [];
    var out = ['Port        Mode         Encapsulation  Status        Native vlan'];
    tr.forEach(function (i) { out.push(pad(E.shortIf(i.name), 12) + pad(i.sw.mode === 'trunk' ? 'on' : 'auto', 13) + pad('802.1q', 15) + pad('trunking', 14) + i.sw.native); });
    out.push('', 'Port        Vlans allowed on trunk');
    tr.forEach(function (i) { out.push(pad(E.shortIf(i.name), 12) + (i.sw.allowed ? compress(i.sw.allowed) : '1-1005')); });
    out.push('', 'Port        Vlans allowed and active in management domain');
    var act = d.cfg.vlans.filter(function (v) { return v.id < 1002; }).map(function (v) { return v.id; });
    tr.forEach(function (i) { out.push(pad(E.shortIf(i.name), 12) + compress(act.filter(function (v) { return net.trunkAllows(i, v); }))); });
    out.push('', 'Port        Vlans in spanning tree forwarding state and not pruned');
    tr.forEach(function (i) { out.push(pad(E.shortIf(i.name), 12) + compress(act.filter(function (v) { return net.trunkAllows(i, v) && !net.portBlocked(d, i.name, v); }))); });
    return out;
  }
  function compress(list) {
    var out = [], i = 0;
    list = list.slice().sort(function (a, b) { return a - b; });
    while (i < list.length) {
      var j = i;
      while (j + 1 < list.length && list[j + 1] === list[j] + 1) j++;
      out.push(j > i + 1 ? list[i] + '-' + list[j] : j === i + 1 ? list[i] + ',' + list[j] : '' + list[i]);
      i = j + 1;
    }
    return out.join(',') || 'none';
  }
  function showMac(net, d) {
    var out = ['          Mac Address Table', '-------------------------------------------', '', 'Vlan    Mac Address       Type        Ports', '----    -----------       --------    -----', ''];
    Object.keys(d.macTable).map(function (k) { return d.macTable[k]; }).sort(function (a, b) { return a.vlan - b.vlan; }).forEach(function (e) {
      if (!net.physUp(d, e.port)) return;
      out.push(pad('   ' + e.vlan, 8) + pad(N.macCisco(e.mac), 18) + pad('DYNAMIC', 12) + E.shortIf(e.port));
    });
    return out;
  }
  function showNat(net, d) {
    var out = ['Pro  Inside global     Inside local       Outside local      Outside global'];
    d.cfg.natStatic.forEach(function (s) {
      var g = net.natGlobalIP(d, s);
      if (s.proto) out.push(pad(s.proto, 5) + pad(ip(g) + ':' + s.gport, 18) + pad(ip(s.local) + ':' + s.lport, 19) + pad('---', 19) + '---');
      else out.push(pad('---', 5) + pad(ip(g), 18) + pad(ip(s.local), 19) + pad('---', 19) + '---');
    });
    d.natTable.forEach(function (e) {
      if (e.stat) { out.push(pad(e.proto, 5) + pad(fmtHP(e.ig), 18) + pad(fmtHP(e.il), 19) + pad(fmtHP(e.og), 19) + fmtHP(e.og)); return; }
      out.push(pad(e.proto, 5) + pad(fmtHP(e.ig), 18) + pad(fmtHP(e.il), 19) + pad(fmtHP(e.og), 19) + fmtHP(e.og));
    });
    return out;
  }
  function fmtHP(s) {
    var m = /^(\d+):(\d+)$/.exec(s);
    return m ? ip(+m[1]) + ':' + m[2] : s;
  }
  function showStandby(net, d, brief) {
    var out = [];
    if (brief) out.push('                     P indicates configured to preempt.', '                     |', 'Interface   Grp  Pri P State    Active          Standby         Virtual IP');
    d.ifaces.forEach(function (i) {
      Object.keys(i.standby).forEach(function (g) {
        var sb = i.standby[g], info = net.hsrpInfo(d, i, +g);
        var pri = sb.prio == null ? 100 : sb.prio;
        var act = info.state === 'Active' ? 'local' : info.active ? ip(info.active.ifc.ip) : 'unknown';
        var stb = info.state === 'Standby' ? 'local' : info.standby ? ip(info.standby.ifc.ip) : 'unknown';
        if (brief) out.push(pad(E.shortIf(i.name), 12) + pad(g, 5) + pad(pri, 4) + (sb.preempt ? 'P ' : '  ') + pad(info.state, 9) + pad(act, 16) + pad(stb, 16) + (sb.ip != null ? ip(sb.ip) : 'unknown'));
        else {
          out.push(i.name + ' - Group ' + g, '  State is ' + info.state, '    ' + (info.state === 'Active' ? '5' : '1') + ' state changes, last state change 00:02:17',
            '  Virtual IP address is ' + (sb.ip != null ? ip(sb.ip) : 'unknown'), '  Active virtual MAC address is ' + E.hsrpMac(+g).toLowerCase(),
            '    Local virtual MAC address is ' + E.hsrpMac(+g).toLowerCase() + ' (v1 default)', '  Hello time 3 sec, hold time 10 sec',
            '  Preemption ' + (sb.preempt ? 'enabled' : 'disabled'), '  Active router is ' + act, '  Standby router is ' + stb, '  Priority ' + pri + ' (default 100)', '  Group name is hsrp-' + E.shortIf(i.name) + '-' + g + ' (default)');
        }
      });
    });
    return out;
  }
  function showIpv6Brief(net, d) {
    var out = [];
    d.ifaces.forEach(function (i) {
      var s = net.ifStatus(d, i);
      out.push(pad(i.name, 27) + '[' + s.status + '/' + s.proto + ']');
      if (!net.v6On(d, i)) { out.push('    unassigned'); return; }
      out.push('    ' + upper6(net.ll6(d, i)));
      net.v6Addrs(d, i).forEach(function (a) { out.push('    ' + upper6(a.w)); });
    });
    return out;
  }
  function showIpv6If(net, d, i) {
    var s = net.ifStatus(d, i);
    var out = [i.name + ' is ' + s.status + ', line protocol is ' + s.proto];
    if (!net.v6On(d, i)) { out.push('  IPv6 is disabled'); return out; }
    out.push('  IPv6 is enabled, link-local address is ' + upper6(net.ll6(d, i)), '  No Virtual link-local address(es):');
    var ad = net.v6Addrs(d, i);
    out.push('  Global unicast address(es):');
    ad.forEach(function (a, k) { out.push('    ' + upper6(a.w) + ', subnet is ' + upper6(N.net6(a.w, a.len)) + '/' + a.len + (i.v6.addrs[k] && i.v6.addrs[k].eui ? ' [EUI]' : '')); });
    out.push('  Joined group address(es):', '    FF02::1');
    if (d.cfg.ipv6Routing) out.push('    FF02::2');
    out.push('    ' + upper6(N.solicitedNode(net.ll6(d, i))));
    ad.forEach(function (a) { out.push('    ' + upper6(N.solicitedNode(a.w))); });
    out.push('  MTU is 1500 bytes', '  ICMP error messages limited to one every 100 milliseconds', '  ICMP redirects are enabled', '  ND DAD is enabled, number of DAD attempts: 1', '  ND reachable time is 30000 milliseconds');
    if (d.cfg.ipv6Routing) {
      out.push('  ND advertised reachable time is 0 milliseconds', '  ND advertised retransmit interval is 0 milliseconds', '  ND router advertisements are sent every 200 seconds', '  ND router advertisements live for 1800 seconds', '  ND advertised default router preference is Medium');
      out.push('  Hosts use stateless autoconfig for addresses.');
      if (i.v6.ndO) out.push('  Hosts use DHCP to obtain other configuration.');
    }
    return out;
  }
  function showIpv6Route(net, d) {
    var t = net.routeTable6(d);
    var out = ['IPv6 Routing Table - ' + (t.length + 1) + ' entries', 'Codes: C - Connected, L - Local, S - Static, R - RIP, B - BGP', '       U - Per-user Static route, M - MIPv6',
      '       I1 - ISIS L1, I2 - ISIS L2, IA - ISIS interarea, IS - ISIS summary', '       O - OSPF intra, OI - OSPF inter, OE1 - OSPF ext 1, OE2 - OSPF ext 2',
      '       ON1 - OSPF NSSA ext 1, ON2 - OSPF NSSA ext 2', '       D - EIGRP, EX - EIGRP external'];
    t.sort(function (a, b) { return (a.len === 0 ? -1 : 0) - (b.len === 0 ? -1 : 0) || (N.expand6(a.w) < N.expand6(b.w) ? -1 : 1); });
    t.forEach(function (r) {
      out.push(pad(r.code, 4) + upper6(r.w) + '/' + r.len + ' [' + r.ad + '/0]');
      if (r.code === 'S') out.push('     via ' + (r.nh ? upper6(r.nh) : '::') + (r.iface ? ', ' + r.iface : ''));
      else out.push('     via ::, ' + r.iface);
    });
    out.push('L   FF00::/8 [0/0]', '     via ::, Null0');
    return out;
  }
  function showArp(net, d) {
    var out = ['Protocol  Address          Age (min)  Hardware Addr   Type   Interface'];
    var rows = [];
    d.ifaces.forEach(function (i) {
      if (i.ip != null && net.l3Up(d, i)) rows.push([i.ip, '-', i.mac, i.name]);
    });
    Object.keys(d.arp).forEach(function (k) {
      var e = d.arp[k];
      rows.push([N.ip2int(k), String(Math.max(0, Math.floor((Date.now() - e.t) / 60000))), e.mac, e.iface]);
    });
    rows.sort(function (a, b) { return a[0] - b[0]; });
    rows.forEach(function (r) { out.push('Internet  ' + pad(ip(r[0]), 17) + padL(r[1], 9) + '   ' + pad(N.macCisco(r[2]), 16) + 'ARPA   ' + r[3]); });
    return out;
  }
  function showCdp(net, d, detail) {
    var out = [];
    if (!d.cfg.cdp) return ['% CDP is not enabled'];
    var rows = [];
    d.ifaces.forEach(function (i) {
      if (i.parent || !net.physUp(d, i.name)) return;
      var p = net.peer(d.name, i.name);
      if (!p || !p.dev || !(p.dev.cat === 'router' || p.dev.cat === 'switch' || p.dev.cat === 'l3switch') || !p.dev.cfg.cdp) return;
      rows.push({ i: i, p: p });
    });
    if (!detail) {
      out.push('Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge', '                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone');
      out.push('Device ID    Local Intrfce   Holdtme    Capability   Platform    Port ID');
      rows.forEach(function (r) {
        var cap = r.p.dev.cat === 'router' ? 'R' : r.p.dev.cat === 'l3switch' ? 'S I' : 'S';
        out.push(pad(r.p.dev.hostname, 13) + pad(E.shortIf(r.i.name).replace(/^(\D+)/, '$1 '), 16) + pad('169', 11) + pad(cap, 13) + pad(r.p.dev.model.replace('-24TT', ''), 12) + E.shortIf(r.p.ifn).replace(/^(\D+)/, '$1 '));
      });
    } else {
      rows.forEach(function (r) {
        var ips = net.ipsOf(r.p.dev, net.iface(r.p.dev, r.p.ifn));
        out.push('', '-------------------------', 'Device ID: ' + r.p.dev.hostname, 'Entry address(es): ');
        if (ips.length) out.push('  IP address : ' + ip(ips[0].ip));
        out.push('Platform: cisco ' + r.p.dev.model + ',  Capabilities: ' + (r.p.dev.cat === 'router' ? 'Router' : 'Switch'), 'Interface: ' + r.i.name + ',  Port ID (outgoing port): ' + r.p.ifn, 'Holdtime: 169', '', 'Version :', 'Cisco IOS Software, Version ' + iosVersion(r.p.dev));
      });
    }
    return out;
  }
  function aclText(r) {
    if (r.any) return r.action + ' any';
    if (r.wild === 0) return r.action + ' host ' + ip(r.src);
    return r.action + ' ' + ip(r.src) + ' ' + ip(r.wild);
  }
  function showProtocols(net, d) {
    var out = [];
    if (d.cfg.rip) {
      var r = d.cfg.rip;
      out.push('Routing Protocol is "rip"', 'Sending updates every 30 seconds, next due in 12 seconds', 'Invalid after 180 seconds, hold down 180, flushed after 240',
        'Outgoing update filter list for all interfaces is not set', 'Incoming update filter list for all interfaces is not set', 'Redistributing: rip',
        'Default version control: send version ' + (r.version || 1) + ', receive ' + (r.version ? 'version ' + r.version : 'any version'),
        '  Interface             Send  Recv  Triggered RIP  Key-chain');
      d.ifaces.forEach(function (i) {
        if (i.ip == null || !r.networks.some(function (n) { return N.sameNet(i.ip, n, N.classfulLen(n)); })) return;
        out.push('  ' + pad(i.name, 22) + pad(r.version || 1, 6) + pad(r.version || '2 1', 6));
      });
      out.push('Automatic network summarization is ' + (r.autoSummary && r.version !== 1 ? 'in effect' : r.version === 1 || r.version == null ? 'in effect' : 'not in effect'), 'Maximum path: 4', 'Routing for Networks:');
      r.networks.forEach(function (n) { out.push('\t' + ip(n)); });
      if (r.passive.length) { out.push('Passive Interface(s):'); r.passive.forEach(function (p) { out.push('\t' + p); }); }
      out.push('Routing Information Sources:', '\tGateway         Distance      Last Update', 'Distance: (default is 120)');
    }
    Object.keys(d.cfg.ospf).forEach(function (pid) {
      out.push('', 'Routing Protocol is "ospf ' + pid + '"', 'Outgoing update filter list for all interfaces is not set', 'Incoming update filter list for all interfaces is not set',
        'Router ID ' + ip(d.cfg.ospf[pid].rid || Math.max.apply(null, net.allIPs(d).concat([0]))), 'Number of areas in this router is 1. 1 normal 0 stub 0 nssa', 'Maximum path: 4', 'Routing for Networks:');
      d.cfg.ospf[pid].networks.forEach(function (n) { out.push('    ' + ip(n.addr) + ' ' + ip(n.wild) + ' area ' + n.area); });
      out.push('Distance: (default is 110)');
    });
    return out;
  }
  function showStp(net, d, vid) {
    if (d.cat !== 'switch' && d.cat !== 'l3switch') return ['No spanning tree instance exists.'];
    var st = net.stpAll(), out = [];
    var vids = d.cfg.vlans.map(function (v) { return v.id; }).filter(function (v) { return v < 1002 && (vid == null || v === vid) && net.stpOn(d, v); });
    vids.forEach(function (v) {
      var info = st.byVlan[v];
      var ports = d.ifaces.filter(function (i) { return i.sw && net.physUp(d, i.name) && net.egressTag(d, i, v) !== undefined; });
      if (!ports.length && v !== 1) return;
      var rootName = info && info.roots.filter(function (r) { var rd = net.dev(r); return rd && info.dist && info.dist[d.name] !== undefined; })[0];
      var root = rootName ? net.dev(rootName) : d;
      var dist = info && info.dist ? info.dist[d.name] : 0;
      function macOf(x) { return N.macCisco(net.baseMac(x)).toUpperCase(); }
      out.push('VLAN' + ('000' + v).slice(-4), '  Spanning tree enabled protocol ieee',
        '  Root ID    Priority    ' + net.stpPrio(root, v), '             Address     ' + macOf(root));
      if (root === d) out.push('             This bridge is the root');
      else out.push('             Cost        ' + dist, '             Port        ' + (d.ifaces.indexOf(net.iface(d, info.rootPort[d.name])) + 1) + '(' + info.rootPort[d.name] + ')');
      out.push('             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec', '',
        '  Bridge ID  Priority    ' + net.stpPrio(d, v) + '  (priority ' + (net.stpPrio(d, v) - v) + ' sys-id-ext ' + v + ')', '             Address     ' + macOf(d),
        '             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec', '             Aging Time  20', '',
        'Interface        Role Sts Cost      Prio.Nbr Type', '---------------- ---- --- --------- -------- --------------------------------');
      ports.forEach(function (i) {
        var role = (info && info.ports[d.name + '|' + i.name]) || 'Desg';
        var sts = role === 'Altn' ? 'BLK' : 'FWD';
        out.push(pad(E.shortIf(i.name), 17) + pad(role, 5) + pad(sts, 4) + pad(E.portCost(i), 10) + pad('128.' + (d.ifaces.indexOf(i) + 1), 9) + 'P2p');
      });
      out.push('');
    });
    return out;
  }

  /* ---------------------------------------------------------- */
  /* Running-config                                               */
  /* ---------------------------------------------------------- */
  function runningConfig(net, d) {
    var c = d.cfg, L = [];
    var mi = E.modelInfo(d.model);
    var ver = d.cat === 'router' ? ((mi.ios || 15) >= 16 ? '16.9' : (mi.ios || 15) >= 15 ? '15.1' : '12.4') : d.model.indexOf('2950') === 0 ? '12.1' : d.cat === 'l3switch' ? '16.3.2' : '15.0';
    L.push('!', 'version ' + ver, 'no service timestamps log datetime msec', 'no service timestamps debug datetime msec', (c.pwdEnc ? '' : 'no ') + 'service password-encryption', '!', 'hostname ' + d.hostname, '!', '!', '!');
    if (c.enableSecret) L.push('enable secret 5 $1$mERr$' + hashPw(c.enableSecret));
    if (c.enablePassword) L.push('enable password ' + (c.pwdEnc ? '7 0822455D0A16' : c.enablePassword));
    L.push('!', '!');
    c.dhcpExcl.forEach(function (x) { L.push('ip dhcp excluded-address ' + ip(x[0]) + (x[1] !== x[0] ? ' ' + ip(x[1]) : '')); });
    if (c.dhcpExcl.length) L.push('!');
    Object.keys(c.dhcpPools).forEach(function (n) {
      var p = c.dhcpPools[n];
      L.push('ip dhcp pool ' + n);
      if (p.net != null) L.push(' network ' + ip(p.net) + ' ' + mask(p.len));
      if (p.routers.length) L.push(' default-router ' + p.routers.map(ip).join(' '));
      if (p.dns.length) L.push(' dns-server ' + p.dns.map(ip).join(' '));
      if (p.domain) L.push(' domain-name ' + p.domain);
      L.push('!');
    });
    Object.keys(c.dhcp6Pools).forEach(function (n) {
      var p = c.dhcp6Pools[n];
      L.push('ipv6 dhcp pool ' + n);
      p.dns.forEach(function (w) { L.push(' dns-server ' + upper6(w)); });
      if (p.domain) L.push(' domain-name ' + p.domain);
      L.push('!');
    });
    if (d.cat === 'router') L.push('!', 'ip cef');
    if (c.ipv6Routing) L.push('ipv6 unicast-routing');
    if (d.cat === 'router') L.push('no ipv6 cef');
    L.push('!', '!', '!');
    c.users.forEach(function (u) { L.push('username ' + u.name + (u.priv != null ? ' privilege ' + u.priv : '') + (u.secret ? ' secret 5 $1$mERr$' + hashPw(u.pw) : ' password 0 ' + u.pw)); });
    if (d.cat === 'router') L.push('!', 'license udi pid CISCO' + d.model + '/K9 sn FTX1524' + (hashPw(d.name).slice(0, 4)).toUpperCase(), '!');
    L.push('!', '!', '!', '!');
    if (c.domainName) L.push('ip domain-name ' + c.domainName);
    if (c.sshVersion) L.push('ip ssh version ' + c.sshVersion);
    if (!c.domainLookup) L.push('no ip domain-lookup');
    L.push('!', '!');
    if (d.cat !== 'router' || true) L.push('spanning-tree mode ' + c.stp.mode);
    if (d.cat === 'switch' || d.cat === 'l3switch') {
      L.push('spanning-tree extend system-id');
      Object.keys(c.stp.prio).forEach(function (v) { L.push('spanning-tree vlan ' + v + ' priority ' + c.stp.prio[v]); });
      c.stp.off.forEach(function (v) { L.push('no spanning-tree vlan ' + v); });
    }
    L.push('!', '!', '!', '!', '!', '!');
    d.ifaces.forEach(function (i) {
      L.push('interface ' + i.name);
      if (i.desc) L.push(' description ' + i.desc);
      if (i.encap) L.push(' encapsulation dot1Q ' + i.encap.vlan + (i.encap.native ? ' native' : ''));
      if (i.sw && !i.sw.routed) {
        if (i.sw.access !== 1) L.push(' switchport access vlan ' + i.sw.access);
        if (i.sw.native !== 1) L.push(' switchport trunk native vlan ' + i.sw.native);
        if (i.sw.allowed) L.push(' switchport trunk allowed vlan ' + compress(i.sw.allowed));
        if (i.sw.encapSet) L.push(' switchport trunk encapsulation dot1q');
        if (i.sw.mode === 'access') L.push(' switchport mode access');
        if (i.sw.mode === 'trunk') L.push(' switchport mode trunk');
        if (i.sw.mode === 'dynamic-desirable') L.push(' switchport mode dynamic desirable');
        if (i.sw.voice != null) L.push(' switchport voice vlan ' + i.sw.voice);
        if (i.sw.noneg) L.push(' switchport nonegotiate');
        if (i.sw.portfast) L.push(' spanning-tree portfast');
      } else {
        if (i.sw && i.sw.routed) L.push(' no switchport');
        if (i.ip != null) L.push(' ip address ' + ip(i.ip) + ' ' + mask(i.len));
        i.sec.forEach(function (s) { L.push(' ip address ' + ip(s.ip) + ' ' + mask(s.len) + ' secondary'); });
        if (i.ip == null && !i.parent && !(/^Vlan/.test(i.name) === false && d.cat !== 'router' && !(i.sw && i.sw.routed))) L.push(' no ip address');
        i.helper.forEach(function (h) { L.push(' ip helper-address ' + ip(h)); });
        if (i.natIn) L.push(' ip nat inside');
        if (i.natOut) L.push(' ip nat outside');
        Object.keys(i.standby).forEach(function (g) {
          var s = i.standby[g], gs = +g === 0 ? '' : g + ' ';
          if (s.ip != null) L.push(' standby ' + gs + 'ip ' + ip(s.ip));
          if (s.prio != null) L.push(' standby ' + gs + 'priority ' + s.prio);
          if (s.preempt) L.push(' standby ' + gs + 'preempt');
        });
        if (i.v6.ll) L.push(' ipv6 address ' + upper6(i.v6.ll) + ' link-local');
        i.v6.addrs.forEach(function (a) { L.push(' ipv6 address ' + upper6(a.w) + '/' + a.len + (a.eui ? ' eui-64' : '')); });
        if (i.v6.enabled) L.push(' ipv6 enable');
        if (i.v6.dhcp) L.push(' ipv6 dhcp server ' + i.v6.dhcp);
        if (i.v6.ndO) L.push(' ipv6 nd other-config-flag');
        if (i.v6.ndM) L.push(' ipv6 nd managed-config-flag');
        if (!i.parent && !/^(Vlan|Loopback)/.test(i.name) && d.cat === 'router') {
          if (/^Serial/.test(i.name)) { if (i.clock) L.push(' clock rate ' + i.clock); }
          else L.push(' duplex ' + i.duplex, ' speed ' + i.speed);
        }
      }
      if (i.shutdown) L.push(' shutdown');
      L.push('!');
    });
    if (c.rip) {
      L.push('router rip');
      if (c.rip.version) L.push(' version ' + c.rip.version);
      c.rip.passive.forEach(function (p) { L.push(' passive-interface ' + p); });
      c.rip.networks.forEach(function (n) { L.push(' network ' + ip(n)); });
      if (c.rip.defOrig) L.push(' default-information originate');
      if (!c.rip.autoSummary) L.push(' no auto-summary');
      L.push('!');
    }
    Object.keys(c.ospf).forEach(function (pid) {
      var o = c.ospf[pid];
      L.push('router ospf ' + pid);
      if (o.rid != null) L.push(' router-id ' + ip(o.rid));
      L.push(' log-adjacency-changes');
      o.networks.forEach(function (n) { L.push(' network ' + ip(n.addr) + ' ' + ip(n.wild) + ' area ' + n.area); });
      L.push('!');
    });
    Object.keys(c.natPools).forEach(function (n) { var p = c.natPools[n]; L.push('ip nat pool ' + n + ' ' + ip(p.start) + ' ' + ip(p.end) + ' netmask ' + mask(p.len)); });
    c.natDyn.forEach(function (r) { L.push('ip nat inside source list ' + r.acl + (r.iface ? ' interface ' + r.iface : ' pool ' + r.pool) + (r.overload ? ' overload' : '')); });
    c.natStatic.forEach(function (s) {
      if (s.proto) L.push('ip nat inside source static ' + s.proto + ' ' + ip(s.local) + ' ' + s.lport + (s.gIface ? ' interface ' + s.gIface + ' ' : ' ' + ip(s.global) + ' ') + s.gport);
      else L.push('ip nat inside source static ' + ip(s.local) + ' ' + ip(s.global));
    });
    if (d.cat === 'router' || d.cat === 'l3switch') L.push('ip classless');
    if (c.defGw != null) L.push('ip default-gateway ' + ip(c.defGw));
    c.routes.forEach(function (r) { L.push('ip route ' + ip(r.net) + ' ' + mask(r.len) + (r.iface ? ' ' + r.iface : '') + (r.nh != null ? ' ' + ip(r.nh) : '') + (r.ad && r.ad !== 1 ? ' ' + r.ad : '') + ' '); });
    c.routes6.forEach(function (r) { L.push('ipv6 route ' + upper6(r.w) + '/' + r.len + (r.iface ? ' ' + r.iface : '') + (r.nh ? ' ' + upper6(r.nh) : '')); });
    L.push('!', 'ip flow-export version 9', '!', '!');
    Object.keys(c.acls).forEach(function (n) { c.acls[n].forEach(function (r) { L.push('access-list ' + n + ' ' + aclText(r)); }); });
    if (c.logging != null) L.push('logging ' + ip(c.logging));
    if (c.banner) L.push('banner motd ^C' + c.banner + '^C');
    L.push('!', '!', '!', '!', '!', 'line con 0');
    lineCfg(L, c.lines.con);
    if (d.cat === 'router') L.push('!', 'line aux 0');
    L.push('!', 'line vty 0 4');
    lineCfg(L, c.lines.vty, true);
    if (d.cat !== 'router') { L.push('line vty 5 15'); lineCfg(L, c.lines.vty, true); }
    if (c.ntp != null) L.push('!', 'ntp server ' + ip(c.ntp));
    L.push('!', '!', '!', 'end');
    var body = L.join('\n');
    return ['Building configuration...', '', 'Current configuration : ' + (body.length + 1) + ' bytes'].concat(L);
  }
  function lineCfg(L, l, vty) {
    l = l || {};
    if (l.password) L.push(' password ' + (l.password));
    if (l.login === 'local') L.push(' login local');
    else if (l.login || (vty && l.login !== false)) L.push(' login');
    if (l.transport) L.push(' transport input ' + l.transport);
  }
  function hashPw(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h.toString(36) + 'TSwWkQ7mOE8M0L'; }
  S.runningText = function () { return runningConfig(this.net, this.dev); };

  /* ---------------------------------------------------------- */
  /* Chargement d'une configuration (running-config d'un .pkt)   */
  /* ---------------------------------------------------------- */
  function applyConfig(net, d, lines) {
    var s = new Session(net, d, { silent: true });
    s.mode = 'config';
    lines.forEach(function (l) {
      if (!l.trim() || /^!/.test(l)) return;
      if (!/^\s/.test(l) && s.mode !== 'config') { s.mode = 'config'; s.ctx = {}; }
      if (/^\s/.test(l) && s.mode === 'config') return; /* sous-commande d'un bloc ignoré */
      if (/^end$/.test(l.trim())) return;
      s.exec(l.trim());
    });
    return s;
  }
  function restoreStartup(net, d, merge) {
    var st = d.startup;
    if (!st) return;
    d.hostname = st.hostname;
    d.cfg = JSON.parse(JSON.stringify(st.cfg));
    d.ifaces = JSON.parse(JSON.stringify(st.ifaces));
    net.touch();
  }
  function reloadDevice(net, d) {
    var before = net.snapPorts();
    if (d.startup) restoreStartup(net, d);
    else {
      var fresh = E.newDevice(d.name, d.model, null);
      /* conserve les interfaces du modèle chargé (MAC) */
      var macs = {};
      d.ifaces.forEach(function (i) { macs[i.name] = { mac: i.mac, kind: i.kind }; });
      d.hostname = fresh.hostname; d.cfg = fresh.cfg;
      d.ifaces = d.ifaces.filter(function (i) { return !i.parent && !/^(Loopback)/.test(i.name) && !(/^Vlan/.test(i.name) && i.name !== 'Vlan1'); }).map(function (i) {
        var n = E.newIface(d, i.name, i.mac); n.kind = i.kind; return n;
      });
    }
    d.arp = {}; d.macTable = {}; d.natTable = []; d.dhcpLeases = {};
    net.touch();
    net.diffPorts(before);
  }

  var IOS = {
    Session: Session, applyConfig: applyConfig, runningConfig: runningConfig, HELP: HELP, TREES: TREES, parse: parse,
    reloadDevice: reloadDevice, showIpRoute: showIpRoute, clockStr: clockStr, iosVersion: iosVersion
  };
  root.IOS = IOS;
  if (typeof module !== 'undefined') module.exports = IOS;
})(typeof window !== 'undefined' ? window : globalThis);
