/* ============================================================
   Outils d'adressage IPv4 / IPv6 / MAC (utilisés partout)
   ============================================================ */
(function (root) {
  'use strict';

  var N = {};

  /* ---------- IPv4 ---------- */
  N.ip2int = function (s) {
    if (typeof s !== 'string') return null;
    s = s.trim();
    var m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(s);
    if (!m) return null;
    var n = 0;
    for (var i = 1; i <= 4; i++) {
      var o = +m[i];
      if (o > 255 || (m[i].length > 1 && m[i][0] === '0' && false)) return null;
      n = n * 256 + o;
    }
    return n >>> 0;
  };
  N.int2ip = function (n) {
    n = n >>> 0;
    return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
  };
  N.isIP = function (s) { return N.ip2int(s) !== null; };
  N.len2mask = function (len) {
    if (len <= 0) return 0;
    return (0xFFFFFFFF << (32 - len)) >>> 0;
  };
  N.maskLen = function (mask) {
    var m = typeof mask === 'number' ? mask : N.ip2int(mask);
    if (m === null) return -1;
    var len = 0, seen0 = false;
    for (var i = 31; i >= 0; i--) {
      var bit = (m >>> i) & 1;
      if (bit) { if (seen0) return -1; len++; } else seen0 = true;
    }
    return len;
  };
  N.isMask = function (s) { return N.maskLen(s) >= 0; };
  N.maskStr = function (len) { return N.int2ip(N.len2mask(len)); };
  /* accepte "255.255.255.0", "/24", "24" */
  N.parseMask = function (s) {
    if (s == null) return -1;
    s = String(s).trim();
    var m = /^\/?(\d{1,2})$/.exec(s);
    if (m) { var l = +m[1]; return l <= 32 ? l : -1; }
    return N.maskLen(s);
  };
  N.netOf = function (ip, len) {
    var i = typeof ip === 'number' ? ip : N.ip2int(ip);
    return (i & N.len2mask(len)) >>> 0;
  };
  N.bcastOf = function (ip, len) {
    var i = typeof ip === 'number' ? ip : N.ip2int(ip);
    return (N.netOf(i, len) | (~N.len2mask(len) >>> 0)) >>> 0;
  };
  N.sameNet = function (a, b, len) {
    var x = typeof a === 'number' ? a : N.ip2int(a), y = typeof b === 'number' ? b : N.ip2int(b);
    if (x === null || y === null) return false;
    return N.netOf(x, len) === N.netOf(y, len);
  };
  N.parseCIDR = function (s) {
    var m = /^\s*(\d+\.\d+\.\d+\.\d+)\s*\/\s*(\d{1,2})\s*$/.exec(s || '');
    if (!m || !N.isIP(m[1]) || +m[2] > 32) return null;
    return { ip: N.ip2int(m[1]), len: +m[2] };
  };
  N.classOf = function (ip) {
    var f = (typeof ip === 'number' ? ip : N.ip2int(ip)) >>> 24;
    if (f < 128) return 'A';
    if (f < 192) return 'B';
    if (f < 224) return 'C';
    if (f < 240) return 'D';
    return 'E';
  };
  N.classfulLen = function (ip) {
    var c = N.classOf(ip);
    return c === 'A' ? 8 : c === 'B' ? 16 : 24;
  };
  N.isPrivate = function (ip) {
    var i = typeof ip === 'number' ? ip : N.ip2int(ip);
    return N.sameNet(i, N.ip2int('10.0.0.0'), 8) || N.sameNet(i, N.ip2int('172.16.0.0'), 12) ||
      N.sameNet(i, N.ip2int('192.168.0.0'), 16);
  };
  N.wildcard = function (len) { return N.int2ip(~N.len2mask(len) >>> 0); };
  N.toBin = function (ip) {
    var i = typeof ip === 'number' ? ip : N.ip2int(ip);
    return [i >>> 24, (i >>> 16) & 255, (i >>> 8) & 255, i & 255].map(function (o) {
      return ('00000000' + o.toString(2)).slice(-8);
    }).join('.');
  };

  /* ---------- MAC ---------- */
  N.macHex = function (mac) { return String(mac || '').replace(/[^0-9a-fA-F]/g, '').toLowerCase(); };
  N.macCisco = function (mac) { /* 0060.5c47.44ec */
    var h = N.macHex(mac);
    return h.slice(0, 4) + '.' + h.slice(4, 8) + '.' + h.slice(8, 12);
  };
  N.macPT = function (mac) { return N.macCisco(mac).toUpperCase(); };
  N.macDash = function (mac) { return N.macHex(mac).replace(/(..)(?!$)/g, '$1-').toUpperCase(); };

  /* ---------- IPv6 ---------- */
  /* renvoie un tableau de 8 entiers (0-65535) ou null */
  N.parse6 = function (s) {
    if (typeof s !== 'string') return null;
    s = s.trim().toLowerCase();
    var pct = s.indexOf('%'); if (pct >= 0) s = s.slice(0, pct);
    if (!/^[0-9a-f:.]+$/.test(s) || s.indexOf(':::') >= 0) return null;
    var parts = s.split('::');
    if (parts.length > 2) return null;
    function grp(x) {
      if (x === '') return [];
      var g = x.split(':'), out = [];
      for (var i = 0; i < g.length; i++) {
        if (!/^[0-9a-f]{1,4}$/.test(g[i])) {
          if (i === g.length - 1 && N.isIP(g[i])) {
            var v4 = N.ip2int(g[i]); out.push(v4 >>> 16, v4 & 65535); continue;
          }
          return null;
        }
        out.push(parseInt(g[i], 16));
      }
      return out;
    }
    var a = grp(parts[0]);
    if (a === null) return null;
    if (parts.length === 1) return a.length === 8 ? a : null;
    var b = grp(parts[1]);
    if (b === null || a.length + b.length > 7) return null;
    var fill = [];
    for (var k = 0; k < 8 - a.length - b.length; k++) fill.push(0);
    return a.concat(fill, b);
  };
  N.isIP6 = function (s) { return N.parse6(s) !== null; };
  /* forme compressée (RFC 5952) ; upper=true -> style Cisco */
  N.fmt6 = function (w, upper) {
    if (typeof w === 'string') w = N.parse6(w);
    if (!w) return '';
    var best = -1, bestLen = 0, i, j;
    for (i = 0; i < 8; i++) {
      if (w[i] === 0) {
        for (j = i; j < 8 && w[j] === 0; j++);
        if (j - i > bestLen && j - i >= 2) { best = i; bestLen = j - i; }
        i = j;
      }
    }
    var h = w.map(function (x) { return x.toString(16); });
    var s;
    if (best >= 0) {
      s = h.slice(0, best).join(':') + '::' + h.slice(best + bestLen).join(':');
    } else s = h.join(':');
    return upper ? s.toUpperCase() : s;
  };
  N.expand6 = function (w) {
    if (typeof w === 'string') w = N.parse6(w);
    if (!w) return '';
    return w.map(function (x) { return ('0000' + x.toString(16)).slice(-4); }).join(':');
  };
  N.eq6 = function (a, b) {
    var x = N.parse6(a), y = N.parse6(b);
    if (!x || !y) return false;
    for (var i = 0; i < 8; i++) if (x[i] !== y[i]) return false;
    return true;
  };
  N.net6 = function (w, len) {
    if (typeof w === 'string') w = N.parse6(w);
    var out = [];
    for (var i = 0; i < 8; i++) {
      var bits = Math.max(0, Math.min(16, len - i * 16));
      var m = bits === 0 ? 0 : (0xFFFF << (16 - bits)) & 0xFFFF;
      out.push(w[i] & m);
    }
    return out;
  };
  N.sameNet6 = function (a, b, len) {
    var x = N.net6(a, len), y = N.net6(b, len);
    for (var i = 0; i < 8; i++) if (x[i] !== y[i]) return false;
    return true;
  };
  /* "2001:db8::/64" -> {w, len} */
  N.parsePrefix6 = function (s) {
    var m = /^\s*([0-9a-fA-F:.]+)\s*\/\s*(\d{1,3})\s*$/.exec(s || '');
    if (!m) return null;
    var w = N.parse6(m[1]); var len = +m[2];
    if (!w || len > 128) return null;
    return { w: w, len: len };
  };
  /* identifiant d'interface EUI-64 (4 mots) à partir d'une MAC */
  N.eui64 = function (mac) {
    var h = N.macHex(mac);
    if (h.length !== 12) return null;
    var b = [];
    for (var i = 0; i < 12; i += 2) b.push(parseInt(h.substr(i, 2), 16));
    b[0] ^= 0x02; /* inversion du bit U/L (7e bit) */
    var e = [b[0], b[1], b[2], 0xFF, 0xFE, b[3], b[4], b[5]];
    return [(e[0] << 8) | e[1], (e[2] << 8) | e[3], (e[4] << 8) | e[5], (e[6] << 8) | e[7]];
  };
  N.withEui64 = function (prefixW, mac) {
    var id = N.eui64(mac);
    return prefixW.slice(0, 4).concat(id);
  };
  N.linkLocal = function (mac) { return [0xfe80, 0, 0, 0].concat(N.eui64(mac)); };
  N.solicitedNode = function (w) {
    if (typeof w === 'string') w = N.parse6(w);
    return [0xff02, 0, 0, 0, 0, 1, 0xff00 | (w[6] & 0xff), w[7]];
  };
  N.type6 = function (w) {
    if (typeof w === 'string') w = N.parse6(w);
    if (!w) return '';
    if ((w[0] & 0xffc0) === 0xfe80) return 'link-local';
    if ((w[0] & 0xfe00) === 0xfc00) return 'ULA';
    if ((w[0] & 0xff00) === 0xff00) return 'multicast';
    if ((w[0] & 0xe000) === 0x2000) return 'global';
    if (w.every(function (x, i) { return i < 7 ? x === 0 : x === 1; })) return 'loopback';
    if (w.every(function (x) { return x === 0; })) return 'unspecified';
    return 'autre';
  };

  root.NET = N;
  if (typeof module !== 'undefined') module.exports = N;
})(typeof window !== 'undefined' ? window : globalThis);
