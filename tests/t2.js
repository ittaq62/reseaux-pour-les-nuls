var H = require('./charge.js');
var ok = 0, ko = 0;
function check(c, m) { if (c) ok++; else { ko++; console.log('ÉCHEC:', m); } }
// VLAN : SC1_Cowork (ETAGE2 configuré par l'étudiant)
var n = H.net('SC1-Cowork');
check(n.canPing('D1','D4'), 'D1->D4 même VLAN');
check(n.canPing('A1','A3'), 'A1->A3');
check(n.canPing('P1','P13'), 'P1->P13');
check(!n.canPing('D1','A1'), 'D1->A1 doit échouer');
console.log(H.cli(n,'ETAGE2',['show vlan brief']).join('\n'));
// CORR-TP1 : router-on-a-stick + DHCP par relais
var c = H.net('CORR-TP1');
['DEV1','A1','A2','A3','A4','COM1'].forEach(function(p){ var d=c.dev(p); var r=c.dhcpRequest(d); check(r, 'DHCP '+p+' '+d.host.dhcpMsg); console.log(p, H.N.int2ip(d.host.ip)+'/'+d.host.len, 'gw', d.host.gw!=null?H.N.int2ip(d.host.gw):'-', 'dns', d.host.dns!=null?H.N.int2ip(d.host.dns):'-'); });
check(c.canPing('DEV1','ADMIN1'), 'DEV1->ADMIN1 inter-VLAN');
check(c.canPing('COM1','SERV-INFRA'), 'COM1->SERV-INFRA');
check(c.canPing('A4','ADMIN1'), 'A4 (autre switch) -> ADMIN1');
var w = c.httpGet(c.dev('DEV1'), 'http://13.1.1.2'); check(w.ok, 'web 13.1.1.2 '+JSON.stringify(w.err));
console.log(H.cli(c,'Router-INTERVLAN',['show ip route','show ip interface brief']).join('\n'));
console.log(H.cli(c,'Sw-Bat-1',['show interfaces trunk']).join('\n'));
// HSRP.pkt : DHCP depuis serveur DHCP, ping extérieur
var h = H.net('HSRP');
['PC0','PC1'].forEach(function(p){ var d=h.dev(p); check(h.dhcpRequest(d),'hsrp dhcp '+p); console.log(p, H.N.int2ip(d.host.ip)); });
check(h.canPing('PC0','192.168.2.254'), 'PC0 -> Router1');
check(h.canPing('PC0','193.1.1.10'), 'PC0 -> SRV-EXT1 via Router1 (rip)');
console.log('OK', ok, 'KO', ko);
