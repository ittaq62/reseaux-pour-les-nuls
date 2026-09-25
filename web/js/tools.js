/* ============================================================
   Petits outils interactifs insérés dans les cours
   <div data-tool="ipcalc|subnets|ipv6"></div>
   ============================================================ */
(function () {
  'use strict';
  var N = window.NET;
  var T = window.TOOLS = window.TOOLS || {};
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function bin(n) { return N.toBin(N.int2ip(n)); }
  /* affiche l'adresse binaire en séparant partie réseau / partie hôte */
  function split(n, len) {
    var b = bin(n).replace(/\./g, ''), out = '';
    for (var i = 0; i < 32; i++) {
      if (i && i % 8 === 0) out += '.';
      out += '<span class="' + (i < len ? 'bn' : 'bh') + '">' + b[i] + '</span>';
    }
    return out;
  }
  function pad(s, n) { s = String(s); while (s.length < n) s += ' '; return s; }

  T.ipcalc = function (el) {
    el.className = 'tool';
    el.innerHTML = '<h5>🧮 Calculatrice IP (à toi de jouer : vérifie tes calculs)</h5><div class="row"><input value="192.168.1.130/26" size="22" spellcheck="false" aria-label="Adresse IP et masque"><span style="color:var(--muted);font-size:.85rem">ex. 172.16.45.200/20 ou 10.1.2.3 255.240.0.0</span></div><div class="res"></div>';
    var inp = el.querySelector('input'), res = el.querySelector('.res');
    function run() {
      var v = inp.value.trim().replace(/\s+/, ' '), m = /^(\d+\.\d+\.\d+\.\d+)(?:\s*\/\s*(\d{1,2})|\s+(\d+\.\d+\.\d+\.\d+))?$/.exec(v);
      if (!m || !N.isIP(m[1])) { res.innerHTML = 'Format : a.b.c.d/n ou a.b.c.d masque'; return; }
      var ip = N.ip2int(m[1]), len = m[2] != null ? +m[2] : m[3] ? N.maskLen(m[3]) : N.classfulLen(m[1]);
      if (len < 0 || len > 32 || isNaN(len)) { res.innerHTML = 'Masque invalide (les 1 doivent être contigus).'; return; }
      var net = N.netOf(ip, len), bc = N.bcastOf(ip, len), hosts = len >= 31 ? 0 : Math.pow(2, 32 - len) - 2;
      var cls = N.classOf(m[1]);
      res.innerHTML =
        pad('Adresse', 11) + pad(N.int2ip(ip), 17) + split(ip, len) + '\n' +
        pad('Masque /' + len, 11) + pad(N.maskStr(len), 17) + split(N.len2mask(len), len) + '\n' +
        pad('Réseau', 11) + pad(N.int2ip(net), 17) + split(net, len) + '   ← IP ET masque\n' +
        pad('Diffusion', 11) + pad(N.int2ip(bc), 17) + split(bc, len) + '   ← bits hôte à 1\n' +
        (hosts ? 'Plage      ' + N.int2ip(net + 1) + ' → ' + N.int2ip(bc - 1) + '   (' + hosts.toLocaleString('fr-FR') + ' hôtes)\n' : '') +
        'Wildcard   ' + N.wildcard(len) + '   ·   classe ' + cls + (N.isPrivate(ip) ? '   ·   adresse PRIVÉE (RFC 1918)' : '');
    }
    inp.oninput = run; run();
  };

  T.subnets = function (el) {
    el.className = 'tool';
    el.innerHTML = '<h5>✂️ Découpeur de sous-réseaux</h5><div class="row"><input value="192.168.59.0/24" size="18" spellcheck="false" aria-label="Réseau à découper"><span>en</span><input value="4" size="4" aria-label="Nombre de sous-réseaux"><span>sous-réseaux</span></div><div class="res"></div>';
    var ins = el.querySelectorAll('input'), res = el.querySelector('.res');
    function run() {
      var c = N.parseCIDR(ins[0].value.replace(/\s+/g, '')), k = parseInt(ins[1].value, 10);
      if (!c || !(k >= 1) || k > 4096) { res.textContent = 'Format : a.b.c.d/n et un nombre de sous-réseaux (1 à 4096).'; return; }
      var bits = 0; while (Math.pow(2, bits) < k) bits++;
      var len = c.len + bits;
      if (len > 30) { res.textContent = 'Impossible : il faut garder au moins 2 bits pour les hôtes (/' + len + ' > /30).'; return; }
      var size = Math.pow(2, 32 - len), base = N.netOf(c.ip, c.len);
      var out = bits + ' bit(s) emprunté(s) → /' + len + ' (' + N.maskStr(len) + '), ' + Math.pow(2, bits) + ' sous-réseaux de ' + (size - 2) + ' hôtes\n\n' +
        pad('N°', 4) + pad('Réseau', 17) + pad('1re adresse', 17) + pad('Dernière', 17) + 'Diffusion\n';
      for (var i = 0; i < Math.min(Math.pow(2, bits), 64); i++) {
        var n = (base + i * size) >>> 0;
        out += pad(i + 1, 4) + pad(N.int2ip(n), 17) + pad(N.int2ip(n + 1), 17) + pad(N.int2ip(n + size - 2), 17) + N.int2ip(n + size - 1) + '\n';
      }
      if (Math.pow(2, bits) > 64) out += '… (64 premiers affichés)';
      res.textContent = out;
    }
    ins[0].oninput = ins[1].oninput = run; run();
  };

  T.ipv6 = function (el) {
    el.className = 'tool';
    el.innerHTML = '<h5>6️⃣ Atelier IPv6</h5><div class="row"><input value="2001:0db8:0000:0000:0a1b:0000:0000:0001" size="42" spellcheck="false" aria-label="Adresse IPv6"></div><div class="row" style="margin-top:8px"><input value="00-60-5C-47-44-EC" size="20" spellcheck="false" aria-label="Adresse MAC"><span>+ préfixe</span><input value="2001:db8:1:1::/64" size="20" spellcheck="false" aria-label="Préfixe"></div><div class="res"></div>';
    var ins = el.querySelectorAll('input'), res = el.querySelector('.res');
    function run() {
      var out = '', w = N.parse6(ins[0].value.trim());
      if (w) out += 'Forme développée : ' + N.expand6(w) + '\nForme simplifiée : ' + N.fmt6(w) + '\nType : ' + N.type6(w) + '\n\n';
      else out += 'Adresse IPv6 invalide (vérifie : 8 blocs max, un seul « :: »).\n\n';
      var mac = N.macHex(ins[1].value);
      if (mac.length === 12) {
        var eui = N.eui64(ins[1].value);
        out += 'EUI-64 de ' + N.macDash(ins[1].value) + ' : ' + eui.map(function (x) { return ('000' + x.toString(16)).slice(-4); }).join(':') + '  (7e bit inversé : ' + mac.slice(0, 2) + ' → ' + ('0' + (parseInt(mac.slice(0, 2), 16) ^ 2).toString(16)).slice(-2) + ')\n';
        out += 'Lien local : ' + N.fmt6(N.linkLocal(ins[1].value)) + '\n';
        var p = N.parsePrefix6(ins[2].value.replace(/\s+/g, ''));
        if (p && p.len === 64) out += 'Globale    : ' + N.fmt6(N.withEui64(N.net6(p.w, 64), ins[1].value)) + '\n';
        else out += '(préfixe /64 attendu pour l’EUI-64)\n';
      } else out += 'MAC invalide (12 caractères hexadécimaux).';
      res.textContent = out;
    }
    ins[0].oninput = ins[1].oninput = ins[2].oninput = run; run();
  };
})();
