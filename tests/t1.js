var H = require('./charge.js');
var ok = 0, ko = 0;
function check(c, m) { if (c) ok++; else { ko++; console.log('ÉCHEC:', m); } }
// 1. Correction Lille : tout pingue
var n = H.net('EX-ROUTAGE-CORR');
var pcs = ['PC-L1','PC-L2','PC-ARRAS','PC-LENS','PC-VAL','Server0'];
pcs.forEach(function(a){ pcs.forEach(function(b){ if(a!==b) check(n.canPing(a,b), 'CORR ping '+a+' -> '+b); }); });
console.log(H.cli(n,'LILLE',['show ip route']).join('\n'));
console.log(H.cli(n,'LILLE',['show ip interface brief']).join('\n'));
// 2. EX0 début : ne pingue pas au-delà du LAN ; fin : tout pingue
var d = H.net('EX0-ROUTAGE-debut'), f = H.net('EX0-ROUTAGE-fin');
check(d.canPing('PC2','PC3'), 'debut PC2->PC3 même LAN');
check(!d.canPing('PC0','PC6'), 'debut PC0->PC6 doit échouer');
['PC0','PC2','PC3','PC4','PC6'].forEach(function(a){ ['PC0','PC2','PC4','PC6'].forEach(function(b){ if(a!==b) check(f.canPing(a,b), 'fin ping '+a+'->'+b); }); });
console.log(H.cli(f,'PB1',['show ip route']).join('\n'));
console.log('OK', ok, 'KO', ko);
