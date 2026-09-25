// Charge l'environnement navigateur minimal pour tester le moteur sous Node
global.window = global;
require('../web/js/netutil.js');
require('../web/js/pt/engine.js');
require('../web/js/pt/ios.js');
require('../web/js/pt/pcshell.js');
require('../web/js/data/topologies.js');
module.exports = {
  N: global.NET, E: global.PTEngine, IOS: global.IOS, T: global.PT_TOPOS,
  net: function (key) { var n = new global.PTEngine.Net(); n.loadTopo(global.PT_TOPOS[key]); return n; },
  cli: function (net, dev, lines, mode) {
    var s = new global.IOS.Session(net, net.dev(dev)); s.mode = mode || 'priv';
    var out = [];
    lines.forEach(function (l) { out = out.concat(s.exec(l)); if (s.async) { s.async.results.forEach(function(r){}); var o=[]; s.async.done(o); out = out.concat(o); s.async = null; } });
    return out;
  }
};
