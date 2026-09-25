var H = require('./charge.js'), N = H.N;
var ok = 0, ko = 0;
function check(c, m) { if (c) ok++; else { ko++; console.log('ÉCHEC:', m); } }
// ---- NAT/PAT (objectifs 1 et 2) ----
var n = H.net('NAT-PAT-depart');
// PC3 et Server4 sans config dans le fichier de départ : on les ignore
check(n.canPing('PC0','192.168.2.10'), 'sans NAT, RIP route déjà : PC0 -> WEB1');
H.cli(n,'Router0',['conf t','int g0/0/0','ip nat inside','int g0/0/1','ip nat outside','exit','ip nat inside source list 1 interface g0/0/1 overload','end']);
H.cli(n,'Router1',['conf t','int g0/0/0','ip nat outside','int g0/0/1','ip nat inside','exit',
  'ip nat inside source static tcp 192.168.2.10 80 13.1.1.2 80','ip nat inside source static tcp 192.168.2.11 80 13.1.1.2 8000','end']);
var w1 = n.httpGet(n.dev('PC0'), 'http://www.imt.local'); check(w1.ok && w1.server.name==='WEB1', 'www.imt.local -> WEB1 '+JSON.stringify(w1.err));
var w2 = n.httpGet(n.dev('PC1'), 'http://13.1.1.2:8000'); check(w2.ok && w2.server.name==='WEB2', ':8000 -> WEB2 '+JSON.stringify(w2.err));
check(n.canPing('PC0','13.1.1.2'), 'PC0 ping 13.1.1.2 (routeur)');
console.log(H.cli(n,'Router0',['show ip nat translations']).join('\n'));
console.log(H.cli(n,'Router1',['show ip nat translations']).join('\n'));
// ---- HSRP ----
var h = H.net('HSRP');
H.cli(h,'Router1',['conf t','int fa0/0','ip address 192.168.2.252 255.255.255.0','standby 1 ip 192.168.2.254','standby 1 priority 150','standby 1 preempt','end']);
H.cli(h,'Router0',['conf t','int fa0/0','standby 1 ip 192.168.2.254','end']);
// Router0 n'a pas de route : ajoutons RIP comme Router1
H.cli(h,'Router0',['conf t','router rip','network 192.168.2.0','network 193.1.1.0','end']);
['PC0','PC1'].forEach(function(p){ h.dhcpRequest(h.dev(p)); });
check(h.canPing('PC0','193.1.1.10'), 'HSRP: PC0 -> ext via actif');
console.log(H.cli(h,'Router1',['show standby brief']).join('\n'));
H.cli(h,'Router1',['conf t','int fa0/0','shutdown','end']);
check(h.canPing('PC0','193.1.1.10'), 'HSRP: bascule sur Router0');
console.log(H.cli(h,'Router0',['show standby brief']).join('\n'));
H.cli(h,'Router1',['conf t','int fa0/0','no shutdown','end']);
console.log(H.cli(h,'Router1',['show standby brief']).join('\n'));
console.log(h.events.map(function(e){return e.dev+': '+e.text}).join('\n'));
console.log('OK', ok, 'KO', ko);
