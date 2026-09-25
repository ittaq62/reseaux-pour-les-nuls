// Vérifie tous les modules : structure des questions, cohérence des réponses,
// et pour chaque labo PT : départ en échec, solution appliquée = tous les objectifs OK.
var H = require('./charge.js');
require('../web/js/labkit.js');
require('../web/js/widgets.js');
var fs = require('fs'), path = require('path');
var dir = path.join(__dirname, '../web/js/modules');
global.MODULES = [];
fs.readdirSync(dir).filter(function (f) { return /\.js$/.test(f); }).sort().forEach(function (f) { require(path.join(dir, f)); });
var W = global.W, LAB = global.LAB;
var ok = 0, ko = 0, ids = {};
function fail(m) { ko++; console.log('ÉCHEC:', m); }
function first(a) { return Array.isArray(a) ? a.filter(function (x) { return typeof x === 'string' || typeof x === 'number'; })[0] : a; }
var only = process.argv[2];
MODULES.sort(function (a, b) { return a.num - b.num; }).forEach(function (m) {
  if (only && m.id !== only) return;
  if (!m.cours || !m.titre || !m.questions.length) fail(m.id + ' incomplet');
  m.questions.forEach(function (q, i) {
    var tag = m.id + '/' + q.id;
    if (ids[q.id]) fail('id en double ' + q.id); ids[q.id] = 1;
    if (!q.q) fail(tag + ' sans énoncé');
    if (q.type !== 'pt' && !(q.hints && q.hints.length)) fail(tag + ' sans indice');
    try {
      switch (q.type) {
        case 'qcm': if (!(q.good >= 0 && q.good < q.choices.length)) fail(tag + ' good hors limites'); break;
        case 'multi': q.good.forEach(function (g) { if (!(g >= 0 && g < q.choices.length)) fail(tag + ' good hors limites'); }); break;
        case 'order': if (q.items.length < 2) fail(tag); break;
        case 'match': q.pairs.forEach(function (p) { if (!p[0] || !p[1]) fail(tag + ' paire vide'); }); break;
        case 'text': {
          var fields = q.fields || [{ kind: q.kind, answer: q.accept }];
          fields.forEach(function (f, k) {
            var a = first(f.answer);
            if (a == null) { fail(tag + ' champ ' + k + ' sans réponse affichable'); return; }
            if (!W.match(f.kind || q.kind, String(a), f.answer)) fail(tag + ' champ ' + k + ' : la réponse "' + a + '" ne se valide pas elle-même');
          });
          break;
        }
        case 'grid': {
          q.rows.forEach(function (r, ri) {
            if (r.length !== q.cols.length) fail(tag + ' ligne ' + ri + ' : ' + r.length + ' cellules pour ' + q.cols.length + ' colonnes');
            r.forEach(function (c, ci) {
              if (!c || typeof c !== 'object') return;
              if (c.a == null) return;
              var a = first(c.a);
              if (!W.match(q.cols[ci].kind, String(a), c.a)) fail(tag + ' cellule ' + ri + ',' + ci + ' "' + a + '" ne se valide pas (kind ' + q.cols[ci].kind + ')');
            });
          });
          if (q.rowTypes && q.rowTypes.length !== q.rows.length) fail(tag + ' rowTypes');
          break;
        }
        case 'pt': {
          var build = function () { return q.build ? q.build() : LAB.topo(q.topo); };
          var n0 = build();
          var r0 = q.tasks.map(function (t) { try { return !!t.check(n0); } catch (e) { return 'ERR ' + e.message; } });
          if (r0.every(function (x) { return x === true; })) fail(tag + ' : le labo est déjà réussi au départ');
          r0.forEach(function (x, k) { if (typeof x === 'string') fail(tag + ' tâche ' + k + ' (départ) ' + x); });
          var n1 = build();
          LAB.apply(n1, q.solution);
          var r1 = q.tasks.map(function (t) { try { return !!t.check(n1); } catch (e) { return 'ERR ' + e.message; } });
          r1.forEach(function (x, k) { if (x !== true) fail(tag + ' solution : tâche ' + k + ' « ' + q.tasks[k].label.replace(/<[^>]+>/g, '') + ' » = ' + x); });
          /* la solution survit à une sauvegarde / rechargement */
          var n2 = new H.E.Net(); n2.load(JSON.parse(JSON.stringify(n1.toJSON())));
          q.tasks.forEach(function (t, k) { var x; try { x = !!t.check(n2); } catch (e) { x = e.message; } if (x !== true) fail(tag + ' après rechargement : tâche ' + k + ' = ' + x); });
          if (process.env.V) console.log(tag, 'départ', JSON.stringify(r0));
          break;
        }
        case 'term': {
          if (typeof q.script !== 'function' || typeof q.goal !== 'function') { fail(tag + ' term incomplet'); break; }
          var st = JSON.parse(JSON.stringify(q.init || {}));
          if (q.goal(st)) fail(tag + ' objectif atteint au départ');
          (q.testLines || []).forEach(function (l) { var r = q.script(st, l); st = r.state || st; if (process.env.V) (r.out || []).forEach(function (o) { console.log('   ' + o); }); });
          if (!q.testLines) fail(tag + ' sans testLines'); else if (!q.goal(st)) fail(tag + ' : la solution n’atteint pas l’objectif');
          break;
        }
        case 'rest': {
          if (typeof q.api !== 'function') { fail(tag + ' rest incomplet'); break; }
          var rs = { headers: [], history: [] }, base = 'http://localhost:58000/api/v1/';
          if (q.api('GET', base + 'host', {}, '', rs).code !== 401) fail(tag + ' sans ticket : 401 attendu');
          var tk = q.api('POST', base + 'ticket', {}, '{"username": "cisco", "password": "cisco123!"}', rs);
          if (tk.code !== 201) fail(tag + ' ticket : 201 attendu');
          var hd = { 'x-auth-token': tk.body.response.serviceTicket };
          var nd = q.api('GET', base + 'network-device', hd, '', rs), ho = q.api('GET', base + 'host', hd, '', rs);
          if (nd.code !== 200 || ho.code !== 200) fail(tag + ' GET avec ticket : 200 attendu');
          if (q.goal && !q.fields && !q.goal(rs)) fail(tag + ' objectif non atteint par le scénario');
          if (q.fields) { var js = JSON.stringify([nd.body, ho.body]); q.fields.forEach(function (f, k) { var a = first(f.answer); if (!W.match(f.kind, String(a), f.answer)) fail(tag + ' champ ' + k + ' incohérent'); if (f.kind !== 'int' && f.kind !== 'iface' && js.indexOf(String(a)) < 0) fail(tag + ' champ ' + k + ' : ' + a + ' absent des réponses API'); }); if (nd.body.response.length !== 9) fail(tag + ' 9 équipements attendus'); }
          break;
        }
        default: fail(tag + ' type inconnu ' + q.type);
      }
      ok++;
    } catch (e) { fail(tag + ' exception ' + e.stack); }
  });
});
var tot = 0; MODULES.forEach(function (m) { tot += m.questions.length; });
console.log('Modules :', MODULES.length, '— questions :', tot, '— OK', ok, 'KO', ko);
