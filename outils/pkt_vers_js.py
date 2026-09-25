# -*- coding: utf-8 -*-
"""
Convertit les fichiers Packet Tracer (.pkt) du cours en topologies JavaScript
pour le simulateur de l'appli (web/js/data/topologies.js).

Usage :  python outils/pkt_vers_js.py "<dossier des .pkt>"
"""
import sys, os, re, json, html
import xml.etree.ElementTree as ET

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pkt_dechiffre import decode_pkt  # noqa: E402

FICHIERS = {
    'EX0-ROUTAGE-debut': 'EX0-ROUTAGE-debut.pkt',
    'EX0-ROUTAGE-fin': 'EX0-ROUTAGE-fin.pkt',
    'EX-ROUTAGE-CORR': 'EX-ROUTAGE-CORR.pkt',
    'HSRP': 'HSRP.pkt',
    'NAT-PAT-depart': 'NAT-PAT-depart.pkt',
    'IPv6-Depart': 'Pratique-IPv6-DHCPv6-01-Depart.pkt',
    'SC1': 'SC1.pkt',
    'SC1-Cowork': 'SC1_Cowork.pkt',
    'CORR-TP1': 'CORR-TP1.pkt',
    'TP-TAP': 'TP-TAP.pkt',
    'SDN-LAB1': 'SDN_Version_LAB_1.pkt',
}

HOSTS = ('Pc', 'Server', 'Laptop', 'Printer', 'NetworkController', 'TabletPC', 'Pda')
IGNORE = ('Power Distribution Device',)

# lignes de running-config sans intérêt pour le simulateur
DROP = re.compile(r'^(!.*|end|version .*|no service .*|service timestamps.*|license .*|'
                  r'boot-start-marker|boot-end-marker|ip flow-export .*|crypto pki .*|'
                  r'certificate .*|quit|ptp .*|spanning-tree extend system-id|no ipv6 cef|'
                  r'ip cef|no ip cef|ipv6 cef|redundancy|mode .*|no ip http.*|'
                  r' ?[0-9A-F]{8}( [0-9A-F]{8})*)$')


def t(e, path, d=''):
    x = e.find(path)
    return (x.text or '').strip() if x is not None and x.text is not None else d


def ports_dfs(module):
    """Ports physiques (type, mac) dans l'ordre des slots."""
    out = []
    for p in module.findall('PORT'):
        out.append((t(p, 'TYPE'), t(p, 'MACADDRESS')))
    for slot in module.findall('SLOT'):
        for m in slot.findall('MODULE'):
            out.extend(ports_dfs(m))
    return out


def host_port(e):
    for p in e.iter('PORT'):
        if t(p, 'TYPE').startswith('eCopper') or t(p, 'TYPE').startswith('eFiber'):
            return p
    return None


def services(e):
    s = {}
    dh = e.find('DHCP_SERVERS')
    if dh is not None:
        srv = dh.find('.//DHCP_SERVER')
        if srv is not None:
            pools = []
            for p in srv.findall('POOLS/POOL'):
                pools.append({
                    'name': t(p, 'NAME'), 'network': t(p, 'NETWORK'), 'mask': t(p, 'MASK'),
                    'gateway': t(p, 'DEFAULT_ROUTER'), 'dns': t(p, 'DNS_SERVER'),
                    'start': t(p, 'START_IP'), 'end': t(p, 'END_IP'),
                    'max': int(t(p, 'MAX_USERS', '0') or 0), 'tftp': t(p, 'TFTP_ADDRESS'),
                    'wlc': t(p, 'WLC_ADDRESS'),
                })
            s['dhcp'] = {'on': t(srv, 'ENABLED') == '1', 'pools': pools}
    dn = e.find('DNS_SERVER')
    if dn is not None:
        recs = []
        for r in dn.findall('NAMESERVER-DATABASE/RESOURCE-RECORD'):
            typ = t(r, 'TYPE')
            rec = {'name': t(r, 'NAME'), 'type': {'A-REC': 'A', 'CNAME': 'CNAME', 'NS-REC': 'NS',
                                                   'SOA': 'SOA', 'MX-REC': 'MX', 'AAAA-REC': 'AAAA'}.get(typ, typ)}
            if t(r, 'IPADDRESS'):
                rec['value'] = t(r, 'IPADDRESS')
            elif t(r, 'HOSTNAME'):
                rec['value'] = t(r, 'HOSTNAME')
            recs.append(rec)
        s['dns'] = {'on': t(dn, 'ENABLED') == '1', 'records': recs}
    hp = e.find('HTTP_SERVER')
    if hp is not None:
        s['http'] = {'on': t(hp, 'ENABLED') == '1'}
    return s


def extract(xml):
    r = ET.fromstring(xml)
    devs = r.find('NETWORK/DEVICES')
    ref = {}
    out_devs = []
    order = []
    for d in devs:
        e = d.find('ENGINE')
        typ = e.find('TYPE').text
        name = t(e, 'NAME')
        order.append(name)
        ref[t(e, 'SAVE_REF_ID').replace('save-ref-id:', '')] = name
        if typ in IGNORE:
            continue
        model = e.find('TYPE').get('model')
        dev = {
            'name': name, 'type': typ, 'model': model,
            'x': round(float(t(d, 'WORKSPACE/LOGICAL/X', '0'))),
            'y': round(float(t(d, 'WORKSPACE/LOGICAL/Y', '0'))),
        }
        if t(e, 'POWER') == 'false':
            dev['off'] = True
        if typ in HOSTS:
            p = host_port(e)
            if p is not None:
                dev['mac'] = t(p, 'MACADDRESS')
                dev['ip'] = t(p, 'IP')
                dev['mask'] = t(p, 'SUBNET')
                dev['dhcp'] = t(p, 'PORT_DHCP_ENABLE') == 'true'
                dev['v6auto'] = t(p, 'IPV6_ADDRESS_AUTOCONFIG') == 'true'
            dev['gw'] = t(e, 'GATEWAY')
            dev['dns'] = t(e, 'DNS_CLIENT/SERVER_IP')
            if typ == 'Server':
                dev['services'] = services(e)
        vl = e.find('VLANS')
        if vl is not None and typ not in HOSTS:
            dev['vlans'] = [[int(v.get('number')), v.get('name')] for v in vl.findall('VLAN')
                            if int(v.get('number')) < 1002]
        rc = e.find('RUNNINGCONFIG')
        if rc is not None and typ not in HOSTS:
            lines = [(l.text or '').rstrip() for l in rc.findall('LINE')]
            cfg = [l for l in lines if l.strip() and not DROP.match(l)]
            dev['config'] = cfg
            ifn = [l.split(' ', 1)[1] for l in lines if l.startswith('interface ')]
            phys = [n for n in ifn if '.' not in n and not n.startswith('Vlan')]
            ports = [p for p in ports_dfs(e.find('MODULE'))
                     if p[0].startswith(('eCopper', 'eFiber', 'eSerial', 'eSmartSerial'))]
            macs, kinds = {}, {}
            if len(ports) == len(phys):
                for n, (pt, mac) in zip(phys, ports):
                    macs[n] = mac
                    kinds[n] = 'fiber' if pt.startswith('eFiber') else 'serial' if 'Serial' in pt else 'copper'
            dev['ifaces'] = []
            for n in phys:
                ifd = {'name': n, 'mac': macs.get(n, '')}
                if kinds.get(n, 'copper') != 'copper':
                    ifd['kind'] = kinds[n]
                dev['ifaces'].append(ifd)
        out_devs.append(dev)
    links = []
    for l in r.find('NETWORK/LINKS'):
        c = l.find('CABLE')
        ports = [p.text for p in c.findall('PORT')]
        fa, fb = t(c, 'FROM').replace('save-ref-id:', ''), t(c, 'TO').replace('save-ref-id:', '')
        a, b = ref.get(fa), ref.get(fb)
        if a is None and fa.isdigit():  # anciens fichiers (PT 6) : index de l'équipement
            a = order[int(fa)]
        if b is None and fb.isdigit():
            b = order[int(fb)]
        ctype = t(c, 'TYPE') or t(l, 'TYPE')
        cable = {'eStraightThrough': 'straight', 'eCrossOver': 'cross', 'eFiber': 'fiber',
                 'eSerial': 'serial', 'eConsole': 'console', 'eSmartSerial': 'serial'}.get(ctype, ctype)
        if a and b:
            links.append([a, ports[0], b, ports[1], cable])
    notes = []
    for n in r.iter('NOTE'):
        txt = t(n, 'TEXT')
        if txt and t(n, 'X'):
            txt = re.sub(r'<br ?/?>', '\n', html.unescape(txt))
            txt = re.sub(r'<[^>]+>', '', txt)
            txt = re.sub(r'\n\s*\n+', '\n', txt).strip()
            notes.append({'x': round(float(t(n, 'X'))), 'y': round(float(t(n, 'Y'))), 'text': txt})
    shapes = []
    for tag, kind in (('RECTANGLE', 'rect'), ('ELLIPSE', 'ellipse')):
        for n in r.iter(tag):
            col = n.find('Color')
            rgb = [int(t(col, k, '0')) for k in ('Red', 'Green', 'Blue')] if col is not None else [0, 0, 0]
            f = n.find('Filled')
            shapes.append({'k': kind, 'x1': int(float(t(n, 'TopLeftX'))), 'y1': int(float(t(n, 'TopLeftY'))),
                           'x2': int(float(t(n, 'BottomRightX'))), 'y2': int(float(t(n, 'BottomRightY'))),
                           'rgb': rgb, 'fill': (f.text or '0').strip() == '1' if f is not None else False,
                           'line': f.get('OUTLINECOLOR', '#000000') if f is not None else '#000000'})
    return {'version': t(r, 'VERSION'), 'devices': out_devs, 'links': links, 'notes': notes, 'shapes': shapes}


def main():
    src = sys.argv[1]
    dst = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'web', 'js', 'data', 'topologies.js')
    out = {}
    for key, fn in FICHIERS.items():
        path = os.path.join(src, fn)
        if not os.path.exists(path):
            print('absent :', fn)
            continue
        out[key] = extract(decode_pkt(open(path, 'rb').read()))
        out[key]['file'] = fn
        print('ok', key, len(out[key]['devices']), 'équipements', len(out[key]['links']), 'câbles')
    with open(dst, 'w', encoding='utf-8') as f:
        f.write('/* Généré par outils/pkt_vers_js.py à partir des fichiers Packet Tracer du cours. */\n')
        f.write('window.PT_TOPOS = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n')
    print('écrit :', os.path.normpath(dst))


if __name__ == '__main__':
    main()
