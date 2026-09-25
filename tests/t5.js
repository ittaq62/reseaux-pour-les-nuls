var H = require('./charge.js'), N = H.N;
function run(sh, line) {
  var o = sh.exec(line);
  if (sh.async) { var a = sh.async; a.results.forEach(function (r, i) { if (a.line) o.push(a.line(r, i)); }); a.done(o); sh.async = null; }
  console.log(sh.prompt === undefined ? '' : 'C:\>' + line); console.log(o.join('\n'));
}
var n = H.net('EX0-ROUTAGE-fin');
var sh = new global.PCShell(n, n.dev('PC0'));
run(sh, 'ping 192.168.4.1');
run(sh, 'ping 192.168.4.1');
run(sh, 'tracert 192.168.4.1');
run(sh, 'ipconfig');
run(sh, 'arp -a');
run(sh, 'ping 10.1.1.1');
var s2 = H.net('NAT-PAT-depart');
var sh2 = new global.PCShell(s2, s2.dev('PC0'));
run(sh2, 'nslookup www.imt.local');
run(sh2, 'ping www.inconnu.local');
run(sh2, 'blabla');
// SSH (SDN lab) : Admin DHCP
var sd = H.net('SDN-LAB1');
var ad = sd.dev('Admin'); console.log('dhcp admin', sd.dhcpRequest(ad), N.int2ip(ad.host.ip));
var sh3 = new global.PCShell(sd, ad);
run(sh3, 'ping 192.168.101.100');
run(sh3, 'ssh -l cisco 10.0.1.4');
console.log(sh3.prompt());
run(sh3, 'cisco123!');
console.log('prompt:', sh3.prompt());
run(sh3, 'show version | include RELEASE');
run(sh3, 'exit');
run(sh3, 'exit');
