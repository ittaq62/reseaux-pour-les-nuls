var H = require('./charge.js'), N = H.N;
var ok = 0, ko = 0;
function check(c, m) { if (c) ok++; else { ko++; console.log('ÉCHEC:', m); } }
// ---- IPv6 (Pratique IPv6/DHCPv6) ----
var n = H.net('IPv6-Depart');
H.cli(n,'R1',['conf t','ipv6 unicast-routing','int fa0/0','ipv6 address fc00::1/64','no shutdown','int fa0/1','ipv6 address 2001:db8:1:1::/64 eui-64','no sh','int fa1/0','ipv6 address 2001:db8:1:2::/64 eui-64','no sh','exit','ipv6 route ::/0 fc00::2','end']);
H.cli(n,'R2',['conf t','ipv6 unicast-routing','int fa0/0','ipv6 address fc00::2/64','no shut','int fa0/1','ipv6 address 2001:db8:2::/64 eui-64','ipv6 address fe80::1 link-local','no shut','exit',
  'ipv6 route 2001:db8:1:1::/64 fc00::1','ipv6 route 2001:db8:1:2::/64 fc00::1','ipv6 dhcp pool sansetat','dns-server 2001:db8:2::53','exit','int fa0/1','ipv6 dhcp server sansetat','ipv6 nd other-config-flag','end']);
['PC0','PC1','PC2'].forEach(function(p){ n.dev(p).host.v6auto = true; });
n.touch();
var c1 = n.hostV6(n.dev('PC1')), c0 = n.hostV6(n.dev('PC0'));
console.log('PC1', c1.addrs.map(function(a){return N.fmt6(a.w,true)}), 'gw', N.fmt6(c1.gw,true));
console.log('PC0', c0.addrs.map(function(a){return N.fmt6(a.w,true)}), 'gw', N.fmt6(c0.gw,true), 'dns', c0.dns && N.fmt6(c0.dns,true));
check(c1.addrs.length && N.fmt6(c1.addrs[0].w,true)==='2001:DB8:1:1:260:5CFF:FE47:44EC', 'SLAAC PC1');
check(N.fmt6(c0.gw,true)==='FE80::1', 'gw PC0 = FE80::1');
check(c0.dns && N.fmt6(c0.dns)==='2001:db8:2::53', 'DHCPv6 sans état DNS');
check(n.canPing6('PC1', c0.addrs[0].w), 'ping6 PC1 -> PC0');
check(n.canPing6('PC2', c1.addrs[0].w), 'ping6 PC2 -> PC1');
console.log(H.cli(n,'R1',['show ipv6 interface brief','show ipv6 route']).join('\n'));
// route récapitulative
H.cli(n,'R2',['conf t','no ipv6 route 2001:db8:1:1::/64 fc00::1','no ipv6 route 2001:db8:1:2::/64 fc00::1','ipv6 route 2001:db8:1::/48 fc00::1','end']);
check(n.canPing6('PC0', c1.addrs[0].w), 'ping6 PC0 -> PC1 via récapitulative');
// ---- STP / tempête : TP-TAP ----
var t = H.net('TP-TAP');
check(t.canPing('PC-B1-1','PC-b2-1'), 'TAP ping de base');
t.connect('COMM-BAT1','GigabitEthernet0/1','COMM-BAT2','GigabitEthernet0/2', 'cross');
// G0/2 de BAT2 déjà utilisé -> refus attendu
check(t.links.length===5, 'port occupé refusé');
t.connect('COMM-BAT1','FastEthernet0/24','COMM-BAT2','FastEthernet0/24','cross');
check(!t.canPing('PC-B1-1','PC-b2-1'), 'boucle sans STP => tempête');
H.cli(t,'COMM-BAT1',['conf t','spanning-tree vlan 1','end']); H.cli(t,'COMM-BAT2',['conf t','spanning-tree vlan 1','end']);
check(t.canPing('PC-B1-1','PC-b2-1'), 'STP réactivé => OK');
console.log(H.cli(t,'COMM-BAT2',['show spanning-tree']).join('\n'));
console.log(H.cli(t,'COMM-BAT1',['show spanning-tree']).join('\n'));
// ---- messages d'erreur CLI ----
var s = new H.IOS.Session(t, t.dev('COMM-BAT1')); s.mode='user';
console.log(s.prompt()+' ', s.exec('sh ip int br').slice(0,3).join('\n'));
console.log(s.prompt()+' conf t'); console.log(s.exec('conf t').join('\n'));
console.log(s.prompt()+' en'); s.exec('en'); console.log(s.prompt()+' co'); console.log(s.exec('co').join('\n'));
console.log(s.prompt()+' show ip rout'); console.log(s.exec('show ip rout').join('\n'));
console.log(s.prompt()+' sho'); console.log(s.exec('sho').join('\n'));
console.log(s.prompt()+' blabla'); console.log(s.exec('blabla').join('\n'));
s.exec('conf t'); console.log(s.prompt()+' int fa0/30'); console.log(s.exec('int fa0/30').join('\n'));
console.log(s.prompt()+' int f0/5'); s.exec('int f0/5'); console.log(s.prompt()+' switchport access vlan 20'); console.log(s.exec('switchport access vlan 20').join('\n'));
console.log(s.prompt()+' ip route 1.1.1.0 255.255.255.0 2.2.2.2'); console.log(s.exec('ip route 1.1.1.0 255.255.255.0 2.2.2.2').join('\n'));
console.log('?', s.help('switchport ').join('\n'));
console.log('Tab:', s.complete('sw'));
s.exec('end');
console.log(s.exec('show run | include vlan|interface Fa').join('\n'));
console.log(s.exec('sh vlan br').join('\n'));
console.log('OK', ok, 'KO', ko);
