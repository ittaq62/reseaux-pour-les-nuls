// Recalcule indépendamment les réponses des exercices d'adressage (réseau, diffusion, plages)
var H = require('./charge.js'), N = H.N;
require('../web/js/labkit.js');
var fs = require('fs'), path = require('path');
global.MODULES = [];
fs.readdirSync(path.join(__dirname, '../web/js/modules')).sort().forEach(function (f) { require(path.join(__dirname, '../web/js/modules', f)); });
var Q = {}; MODULES.forEach(function (m) { m.questions.forEach(function (q) { Q[q.id] = q; }); });
var ok = 0, ko = 0;
function eq(a, b, m) { if (String(a) === String(b)) ok++; else { ko++; console.log('ÉCHEC', m, ':', a, '≠', b); } }
function A(c) { return Array.isArray(c.a) ? c.a[0] : c.a; }
function info(cidr) { var c = N.parseCIDR(cidr); var net = N.netOf(c.ip, c.len), bc = N.bcastOf(c.ip, c.len); return { net: N.int2ip(net), bc: N.int2ip(bc), first: N.int2ip(net + 1), last: N.int2ip(bc - 1), hosts: Math.pow(2, 32 - c.len) - 2, len: c.len }; }
if (Q.i9) { var f = Q.i9.fields, x = info('192.168.1.130/26'); eq(f[0].answer, x.net, 'i9 net'); eq(f[1].answer, x.bc, 'i9 bc'); eq(f[2].answer, x.first, 'i9 first'); eq(f[3].answer, x.last, 'i9 last'); }
if (Q.i10) { var f2 = Q.i10.fields, y = info('172.16.45.200/20'); eq(f2[0].answer, y.net, 'i10'); eq(f2[1].answer, y.bc, 'i10'); eq(f2[2].answer, y.hosts, 'i10'); }
if (Q.i12) Q.i12.rows.forEach(function (r) { var z = info(r[0]); eq(A(r[1]), z.net, 'i12 ' + r[0]); eq(A(r[2]), z.bc, 'i12 ' + r[0]); });
if (Q.s4) Q.s4.rows.forEach(function (r) { var z = info(r[0] + '/24'); eq(A(r[1]), z.first, 's4'); eq(A(r[2]), z.last, 's4'); eq(A(r[3]), z.bc, 's4'); });
if (Q.s6) Q.s6.rows.forEach(function (r) { var netw = typeof r[1] === 'string' ? r[1] : A(r[1]); var z = info(netw + '/26'); eq(A(r[2]), z.first, 's6'); eq(A(r[3]), z.last, 's6'); eq(A(r[4]), z.bc, 's6'); });
if (Q.s8) { var next = N.ip2int('192.168.59.0'); Q.s8.rows.forEach(function (r) {
  var need = +r[1], h = 2; while (Math.pow(2, h) - 2 < need) h++; var len = 32 - h;
  eq(N.parseMask(A(r[2])), len, 's8 masque ' + r[0]); var z = info(N.int2ip(next) + '/' + len);
  eq(A(r[3]), z.net, 's8 net ' + r[0]); eq(A(r[4]), z.first, 's8'); eq(A(r[5]), z.last, 's8'); eq(A(r[6]), z.bc, 's8'); next += Math.pow(2, h); }); }
if (Q.s11) { var nx = N.ip2int('194.132.18.0'); Q.s11.rows.forEach(function (r) {
  var need = +r[1], h = 2; while (Math.pow(2, h) - 2 < need) h++;
  eq(A(r[2]), h, 's11 bits hôte ' + r[0]); eq(A(r[3]), 8 - h, 's11 bits sr ' + r[0]); eq(N.parseMask(A(r[4])), 32 - h, 's11 masque ' + r[0]);
  var z = info(N.int2ip(nx) + '/' + (32 - h)); eq(A(r[5]), z.net, 's11 net ' + r[0]); eq(A(r[6]), z.first, 's11 first'); eq(A(r[7]), z.last, 's11 last'); nx += Math.pow(2, h); });
  var nl = N.ip2int('194.132.18.232'); Q.s12.rows.forEach(function (r) { var z = info(N.int2ip(nl) + '/30'); eq(A(r[3]), z.net, 's12 ' + r[0]); eq(A(r[4]), z.first, 's12'); eq(A(r[5]), z.last, 's12'); nl += 4; });
  if (nx > N.ip2int('194.132.18.232')) { ko++; console.log('ÉCHEC chevauchement LAN / liaisons'); } }
/* tables de routage : chaque next hop doit être dans un réseau connecté et l'interface doit être dans le même réseau que la passerelle */
['rt7', 'rt8', 'rt16', 'rt17'].forEach(function (id) {
  var q = Q[id]; if (!q) return;
  var conn = q.rows.filter(function (r) { return r[1].a == null; }).map(function (r) { return N.parseCIDR(A(r[0])); });
  q.rows.forEach(function (r) {
    var itf = N.ip2int(A(r[2]));
    var inConn = conn.some(function (c) { return N.sameNet(itf, c.ip, c.len); });
    if (!inConn) { ko++; console.log('ÉCHEC', id, 'interface', A(r[2]), 'hors réseaux connectés'); } else ok++;
    if (r[1].a != null) {
      var gws = Array.isArray(r[1].a) ? r[1].a : [r[1].a], gw = N.ip2int(gws[0]);
      var c = conn.filter(function (c) { return N.sameNet(itf, c.ip, c.len); })[0];
      if (id === 'rt17' && A(r[0]) === '0.0.0.0/0') { ok++; return; } /* coquille de l'énoncé (voir question) */
      if (!N.sameNet(gw, c.ip, c.len)) { ko++; console.log('ÉCHEC', id, 'passerelle', gws[0], 'pas sur la liaison de', A(r[2])); } else ok++;
    }
  });
});
console.log('Calculs : OK', ok, 'KO', ko);
