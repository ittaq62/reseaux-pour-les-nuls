/* ============================================================
   Invite de commandes des PC / serveurs (Packet Tracer PC Command Line 1.0)
   ============================================================ */
(function (root) {
  'use strict';
  var N = root.NET || (typeof require !== 'undefined' ? require('../netutil.js') : null);
  var IOS = root.IOS || (typeof require !== 'undefined' ? require('./ios.js') : null);

  function ip(n) { return n == null ? '0.0.0.0' : N.int2ip(n); }
  function up6(w) { return w ? N.fmt6(w, true) : '::'; }
  function pad(s, n) { s = String(s); return s.length >= n ? s + ' ' : s + new Array(n - s.length + 1).join(' '); }

  function Shell(net, dev) {
    this.net = net; this.dev = dev;
    this.remote = null; /* session SSH/Telnet vers un équipement */
    this.pending = null;
  }
  var S = Shell.prototype;
  S.prompt = function () {
    if (this.pending && this.pending.prompt) return this.pending.prompt;
    if (this.remote) return this.remote.session.prompt();
    return 'C:\\>';
  };
  S.banner = function () { return ['Cisco Packet Tracer PC Command Line 1.0']; };

  S.exec = function (line) {
    var out = [];
    this.async = null;
    if (this.pending) { var p = this.pending; this.pending = null; p.handle.call(this, line, out); return out; }
    if (this.remote) {
      var rs = this.remote.session;
      if (/^\s*(exit|logout)\s*$/i.test(line) && (rs.mode === 'user' || rs.mode === 'priv')) {
        var host = this.remote.host;
        this.remote = null;
        out.push('', '[Connection to ' + host + ' closed by foreign host]');
        return out;
      }
      out = rs.exec(line);
      if (rs.async) this.async = rs.async;
      return out;
    }
    var t = line.trim();
    if (!t) return out;
    var parts = t.split(/\s+/), cmd = parts[0].toLowerCase(), args = parts.slice(1);
    var h = this.dev.host;
    switch (cmd) {
      case '?': case 'help': return this.help();
      case 'ipconfig': return this.ipconfig(args);
      case 'ipv6config': return this.ipv6config(args);
      case 'ping': return this.ping(args);
      case 'tracert': return this.tracert(args);
      case 'arp': return this.arp(args);
      case 'nslookup': return this.nslookup(args);
      case 'ssh': return this.ssh(args, 'ssh');
      case 'telnet': return this.ssh(args, 'telnet');
      case 'netstat': return ['', 'Active Connections', '', '  Proto  Local Address          Foreign Address        State'];
      case 'dir': return ['', 'Volume in drive C has no label.', 'Volume Serial Number is 5E12-4AF3', 'Directory of C:\\', '', '1/1/1970   1:0 PM               26         sampleFile.txt', '                26 bytes          1 File(s)'];
      case 'echo': return [args.join(' ')];
      case 'exit': return [];
      default: return ['Invalid Command.'];
    }
  };
  S.help = function () {
    return ['', 'Available Commands',
      '?                       Display the list of available commands',
      'arp                     Display the arp table',
      'delete                  Delete the specified file from C: directory.',
      'dir                     Display the list of files in C: directory.',
      'dnscmd                  Manage DNS servers',
      'echo                    Displays messages that are passed to it.',
      'exit                    Quits the program',
      'ftp                     Transfers files to and from a computer running an FTP server service',
      'help                    Display the list of available commands',
      'httpd                   Starts or stops HTTP service',
      'ipconfig                Display network configuration for each network adapter',
      'ipv6config              IPv6 configuration for each network adapter',
      'mkdir                   Creates a directory.',
      'more                    Display the contents of a file',
      'netstat                 Displays protocol statistics and current TCP/IP network connections',
      'nslookup                DNS Lookup',
      'ping                    Send echo messages',
      'rename                  Rename a file',
      'rmdir                   Removes a directory.',
      'snmpget                 SNMP GET',
      'snmpgetbulk             SNMP GETBULK',
      'snmpset                 SNMP SET',
      'ssh                     Ssh client',
      'telnet                  Telnet client',
      'tftp                    Transfers files to and from a computer running a TFTP server service',
      'tracert                 Trace route to remote host'];
  };
  S.ipconfig = function (args) {
    var h = this.dev.host, nic = this.dev.ifaces[0], net = this.net;
    var a = (args[0] || '').toLowerCase();
    if (a === '/release') {
      if (!h.dhcp) return ['', 'The IP address for adapter FastEthernet0 is not DHCP enabled.'];
      net.dhcpRelease(this.dev);
      return ['', '   IP Address......................: 0.0.0.0', '   Subnet Mask.....................: 0.0.0.0', '   Default Gateway.................: 0.0.0.0', '   DNS Server......................: 0.0.0.0'];
    }
    if (a === '/renew') {
      if (!h.dhcp) return ['', 'The IP address for adapter FastEthernet0 is not DHCP enabled.'];
      var ok = net.dhcpRequest(this.dev);
      if (!ok) return ['DHCP request failed. '];
      return ['', '   IP Address......................: ' + ip(h.ip), '   Subnet Mask.....................: ' + ip(N.len2mask(h.len)),
        '   Default Gateway.................: ' + ip(h.gw), '   DNS Server......................: ' + ip(h.dns)];
    }
    var all = a === '/all';
    if (a && !all) return ['Invalid Command.'];
    var v6 = net.hostV6(this.dev);
    var out = ['', 'FastEthernet0 Connection:(default port)', '', '   Connection-specific DNS Suffix..: '];
    if (all) out.push('   Physical Address................: ' + N.macPT(nic.mac));
    out.push('   Link-local IPv6 Address.........: ' + up6(net.ll6(this.dev, nic)),
      '   IPv6 Address....................: ' + (v6.addrs[0] ? up6(v6.addrs[0].w) : '::'),
      '   IPv4 Address....................: ' + ip(h.ip),
      '   Subnet Mask.....................: ' + (h.len != null ? ip(N.len2mask(h.len)) : '0.0.0.0'),
      '   Default Gateway.................: ' + (v6.gw ? up6(v6.gw) : '::'),
      '                                     ' + ip(h.gw));
    if (all) {
      out.push('   DHCP Servers....................: 0.0.0.0', '   DHCPv6 IAID.....................: ', '   DHCPv6 Client DUID..............: 00-01-00-01-' + N.macDash(nic.mac),
        '   DNS Servers.....................: ' + (v6.dns ? up6(v6.dns) : '::'), '                                     ' + ip(h.dns));
    }
    out.push('', 'Bluetooth Connection:', '', '   Connection-specific DNS Suffix..: ', '   Link-local IPv6 Address.........: ::', '   IPv6 Address....................: ::',
      '   IPv4 Address....................: 0.0.0.0', '   Subnet Mask.....................: 0.0.0.0', '   Default Gateway.................: ::', '                                     0.0.0.0', '');
    return out;
  };
  S.ipv6config = function () {
    var net = this.net, nic = this.dev.ifaces[0], v6 = net.hostV6(this.dev);
    return ['', 'FastEthernet0 Connection:(default port)', '', '   Connection-specific DNS Suffix..: ', '   IPv6 Address....................: ' + (v6.addrs[0] ? up6(v6.addrs[0].w) + '/' + v6.addrs[0].len : '::'),
      '   Link-local IPv6 Address.........: ' + up6(net.ll6(this.dev, nic)), '   Default Gateway.................: ' + (v6.gw ? up6(v6.gw) : '::'),
      '   DNS Servers.....................: ' + (v6.dns ? up6(v6.dns) : '::'), ''];
  };
  S.resolve = function (name) {
    if (N.isIP(name)) return { v4: N.ip2int(name) };
    if (N.isIP6(name)) return { v6: N.parse6(name) };
    var r = this.net.dnsResolve(this.dev, name);
    return r.ok ? { v4: r.ip } : null;
  };
  S.ping = function (args) {
    var count = 4, target = null, forever = false;
    for (var i = 0; i < args.length; i++) {
      if (args[i] === '-n' && args[i + 1]) { count = Math.max(1, Math.min(100, +args[i + 1] || 4)); i++; }
      else if (args[i] === '-t') forever = true;
      else target = args[i];
    }
    if (!target) return ['', 'Usage: ping [-n count] [-t] target', ''];
    if (forever) count = 8;
    var r = this.resolve(target);
    if (!r) return ['Ping request could not find host ' + target + '. Please check the name and try again.'];
    var net = this.net, dev = this.dev, out = [''];
    var shown = r.v4 != null ? ip(r.v4) : up6(r.v6);
    var results;
    if (r.v4 != null) {
      if (dev.host.ip == null) { return ['', 'Pinging ' + shown + ' with 32 bytes of data:', ''].concat(repeat('Request timed out.', count), stats(shown, count, 0)); }
      results = net.ping(dev, r.v4, count);
    } else results = net.ping6(dev, r.v6, count);
    out.push('Pinging ' + shown + ' with 32 bytes of data:', '');
    this.async = {
      kind: 'pcping', results: results,
      line: function (x) {
        if (x.status === 'ok') return 'Reply from ' + shown + ': bytes=32 time' + (x.arp ? '=1ms' : '<1ms') + ' TTL=' + x.ttl;
        if (x.status === 'unreach') return 'Reply from ' + (typeof x.from === 'number' ? ip(x.from) : up6(x.from)) + ': Destination host unreachable.';
        if (x.status === 'ttl') return 'Reply from ' + ip(x.from) + ': TTL expired in transit.';
        return 'Request timed out.';
      },
      done: function (o) {
        var rec = results.filter(function (x) { return x.status === 'ok' || x.status === 'unreach' || x.status === 'ttl'; }).length;
        var okc = results.filter(function (x) { return x.status === 'ok'; }).length;
        stats(shown, count, rec, okc).forEach(function (l) { o.push(l); });
      }
    };
    return out;
  };
  function repeat(s, n) { var a = []; for (var i = 0; i < n; i++) a.push(s); return a; }
  function stats(shown, sent, rec, okc) {
    var lost = sent - rec;
    var o = ['', 'Ping statistics for ' + shown + ':', '    Packets: Sent = ' + sent + ', Received = ' + rec + ', Lost = ' + lost + ' (' + Math.round(lost * 100 / sent) + '% loss),'];
    if (okc) o.push('Approximate round trip times in milli-seconds:', '    Minimum = 0ms, Maximum = 1ms, Average = 0ms');
    o.push('');
    return o;
  }
  S.tracert = function (args) {
    var t = args[args.length - 1];
    if (!t) return ['', 'Usage: tracert target'];
    var r = this.resolve(t);
    if (!r || r.v4 == null) return ['Unable to resolve target system name ' + t + '.'];
    var hops = this.net.traceroute(this.dev, r.v4);
    var out = ['', 'Tracing route to ' + ip(r.v4) + ' over a maximum of 30 hops: ', ''];
    this.async = {
      kind: 'tracert', results: hops,
      line: function (h, i) {
        var n = ('  ' + (i + 1)).slice(-3);
        if (h.ip == null) return n + '   *         *         *         Request timed out.';
        return n + '   0 ms      0 ms      0 ms      ' + ip(h.ip);
      },
      done: function (o) { o.push('', 'Trace complete.'); }
    };
    return out;
  };
  S.arp = function (args) {
    var a = (args[0] || '').toLowerCase();
    if (a === '-d') { this.dev.arp = {}; return []; }
    if (a !== '-a') return ['Usage: arp [-a|-d]'];
    var keys = Object.keys(this.dev.arp);
    if (!keys.length) return ['No ARP Entries Found'];
    var out = ['  Internet Address      Physical Address      Type'];
    var self = this;
    keys.forEach(function (k) { out.push('  ' + pad(k, 22) + pad(N.macCisco(self.dev.arp[k].mac), 22) + 'dynamic'); });
    return out;
  };
  S.nslookup = function (args) {
    var h = this.dev.host;
    var name = args[0];
    var srv = h.dns != null ? ip(h.dns) : '255.255.255.255';
    var out = ['', 'Server: [' + srv + ']', 'Address:  ' + srv, ''];
    if (!name) return out.concat(['>']);
    var r = this.net.dnsResolve(this.dev, name);
    if (r.ok) { out.push('Non-authoritative answer:', 'Name:\t' + name, 'Address:  ' + ip(r.ip)); return out; }
    if (r.err === 'nxdomain') { out.push('*** UnKnown can\'t find ' + name + ': Non-existent domain'); return out; }
    out.push('DNS request timed out.', '    timeout was 15000 milli seconds.', 'DNS request timed out.', '    timeout was 15000 milli seconds.', '*** Request to ' + srv + ' timed-out');
    return out;
  };
  S.ssh = function (args, proto) {
    var user = null, host = null;
    for (var i = 0; i < args.length; i++) {
      if (args[i] === '-l') { user = args[i + 1]; i++; } else host = args[i];
    }
    if (!host || (proto === 'ssh' && !user)) return proto === 'ssh' ? ['', 'Usage: SSH -l username target', ''] : ['', 'Usage: telnet target', ''];
    var r = this.resolve(host);
    if (!r || r.v4 == null) return ['% Unknown host ' + host];
    var out = proto === 'telnet' ? ['Trying ' + ip(r.v4) + ' ...'] : [];
    var tr = this.net.transact(this.dev, r.v4, 'tcp', proto === 'ssh' ? 22 : 23);
    if (!tr.ok || !(tr.dev.cat === 'router' || tr.dev.cat === 'switch' || tr.dev.cat === 'l3switch')) {
      out.push('% Connection timed out; remote host not responding');
      return out;
    }
    var d = tr.dev, vty = d.cfg.lines.vty || {};
    if (proto === 'ssh' && (!d.cfg.users.length || vty.login !== 'local')) { out.push('% Connection refused by remote host'); return out; }
    if (proto === 'telnet') out.push('Open');
    if (proto === 'telnet' && !vty.password && vty.login !== 'local') { out.push('', '', '[Connection to ' + host + ' closed by foreign host]'); return out; }
    var self = this;
    var sess = new IOS.Session(this.net, d);
    sess.mode = 'user';
    function login(pw) {
      var okUser = vty.login === 'local' ? d.cfg.users.some(function (u) { return u.name === user && u.pw === pw; }) : pw === vty.password;
      return okUser;
    }
    var askUser = proto === 'telnet' && vty.login === 'local';
    var tries = 0;
    function askPw() {
      self.pending = {
        prompt: 'Password: ', secret: true, handle: function (l, o) {
          if (login(l)) {
            if (d.cfg.banner) o.push(d.cfg.banner);
            var u = d.cfg.users.filter(function (x) { return x.name === user; })[0];
            if (u && +u.priv === 15) sess.mode = 'priv';
            self.remote = { session: sess, host: host };
            o.push('');
            return;
          }
          tries++;
          if (tries >= 3) { o.push('% Bad passwords', '', '[Connection to ' + host + ' closed by foreign host]'); return; }
          askPw();
        }
      };
    }
    if (askUser) {
      out.push('', 'User Access Verification', '');
      this.pending = { prompt: 'Username: ', handle: function (l) { user = l.trim(); askPw(); } };
    } else {
      out.push('');
      askPw();
    }
    return out;
  };

  root.PCShell = Shell;
  if (typeof module !== 'undefined') module.exports = Shell;
})(typeof window !== 'undefined' ? window : globalThis);
