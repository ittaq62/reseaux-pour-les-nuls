/* Généré par outils/pkt_vers_js.py à partir des fichiers Packet Tracer du cours. */
window.PT_TOPOS = {
 "EX0-ROUTAGE-debut": {
  "version": "8.2.2.0400",
  "devices": [
   {
    "name": "PB1",
    "type": "Router",
    "model": "Router-PT",
    "x": 575,
    "y": 200,
    "config": [
     "hostname PB1",
     "interface FastEthernet0/0",
     " ip address 192.168.10.4 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet1/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface Serial2/0",
     " no ip address",
     " clock rate 2000000",
     " shutdown",
     "interface Serial3/0",
     " no ip address",
     " clock rate 2000000",
     " shutdown",
     "interface FastEthernet4/0",
     " ip address 192.168.0.1 255.255.255.0",
     "interface FastEthernet5/0",
     " no ip address",
     " shutdown",
     "router rip",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "0001.9629.A9DC"
     },
     {
      "name": "FastEthernet1/0",
      "mac": "0004.9AE6.B799"
     },
     {
      "name": "Serial2/0",
      "mac": "0001.9629.A9DC",
      "kind": "serial"
     },
     {
      "name": "Serial3/0",
      "mac": "0001.9629.A9DC",
      "kind": "serial"
     },
     {
      "name": "FastEthernet4/0",
      "mac": "00D0.58A8.1007",
      "kind": "fiber"
     },
     {
      "name": "FastEthernet5/0",
      "mac": "0040.0B8E.29A8",
      "kind": "fiber"
     }
    ]
   },
   {
    "name": "PB2",
    "type": "Router",
    "model": "Router-PT",
    "x": 744,
    "y": 208,
    "config": [
     "hostname Router",
     "interface FastEthernet0/0",
     " ip address 192.168.11.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet1/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface Serial2/0",
     " no ip address",
     " clock rate 2000000",
     " shutdown",
     "interface Serial3/0",
     " no ip address",
     " clock rate 2000000",
     " shutdown",
     "interface FastEthernet4/0",
     " ip address 192.168.0.2 255.255.255.0",
     "interface FastEthernet5/0",
     " no ip address",
     " shutdown",
     "router rip",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "0090.0C48.6EAE"
     },
     {
      "name": "FastEthernet1/0",
      "mac": "0050.0F00.963B"
     },
     {
      "name": "Serial2/0",
      "mac": "0090.0C48.6EAE",
      "kind": "serial"
     },
     {
      "name": "Serial3/0",
      "mac": "0090.0C48.6EAE",
      "kind": "serial"
     },
     {
      "name": "FastEthernet4/0",
      "mac": "0001.6326.C603",
      "kind": "fiber"
     },
     {
      "name": "FastEthernet5/0",
      "mac": "0001.97A5.2A3D",
      "kind": "fiber"
     }
    ]
   },
   {
    "name": "RB1E2",
    "type": "Router",
    "model": "1841",
    "x": 366,
    "y": 98,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface FastEthernet0/0",
     " ip address 192.168.3.254 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet0/1",
     " ip address 192.168.10.3 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "router rip",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "000A.41B4.1B01"
     },
     {
      "name": "FastEthernet0/1",
      "mac": "000A.41B4.1B02"
     }
    ]
   },
   {
    "name": "RB1E1",
    "type": "Router",
    "model": "1841",
    "x": 356,
    "y": 204,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface FastEthernet0/0",
     " ip address 192.168.2.254 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet0/1",
     " ip address 192.168.10.2 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "router rip",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "00D0.D30E.8601"
     },
     {
      "name": "FastEthernet0/1",
      "mac": "00D0.D30E.8602"
     }
    ]
   },
   {
    "name": "RB1E0",
    "type": "Router",
    "model": "1841",
    "x": 354,
    "y": 358,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface FastEthernet0/0",
     " ip address 192.168.1.254 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet0/1",
     " ip address 192.168.10.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "router rip",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "00E0.A3AA.4101"
     },
     {
      "name": "FastEthernet0/1",
      "mac": "00E0.A3AA.4102"
     }
    ]
   },
   {
    "name": "RB2",
    "type": "Router",
    "model": "1841",
    "x": 908,
    "y": 206,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface FastEthernet0/0",
     " ip address 192.168.11.2 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet0/1",
     " ip address 192.168.4.254 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "router rip",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "0001.42DA.AA01"
     },
     {
      "name": "FastEthernet0/1",
      "mac": "0001.42DA.AA02"
     }
    ]
   },
   {
    "name": "B1E0",
    "type": "Switch",
    "model": "2950-24",
    "x": 175,
    "y": 398,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "mls qos",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0060.3E25.0001"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0060.3E25.0002"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0060.3E25.0003"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0060.3E25.0004"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0060.3E25.0005"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0060.3E25.0006"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0060.3E25.0007"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0060.3E25.0008"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0060.3E25.0009"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0060.3E25.000A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0060.3E25.000B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0060.3E25.000C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0060.3E25.000D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0060.3E25.000E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0060.3E25.000F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0060.3E25.0010"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0060.3E25.0011"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0060.3E25.0012"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0060.3E25.0013"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0060.3E25.0014"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0060.3E25.0015"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0060.3E25.0016"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0060.3E25.0017"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0060.3E25.0018"
     }
    ]
   },
   {
    "name": "B1E1",
    "type": "Switch",
    "model": "2950-24",
    "x": 178,
    "y": 206,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "mls qos",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0009.7C22.9801"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0009.7C22.9802"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0009.7C22.9803"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0009.7C22.9804"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0009.7C22.9805"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0009.7C22.9806"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0009.7C22.9807"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0009.7C22.9808"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0009.7C22.9809"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0009.7C22.980A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0009.7C22.980B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0009.7C22.980C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0009.7C22.980D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0009.7C22.980E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0009.7C22.980F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0009.7C22.9810"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0009.7C22.9811"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0009.7C22.9812"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0009.7C22.9813"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0009.7C22.9814"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0009.7C22.9815"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0009.7C22.9816"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0009.7C22.9817"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0009.7C22.9818"
     }
    ]
   },
   {
    "name": "B1E2",
    "type": "Switch",
    "model": "2950-24",
    "x": 228,
    "y": 68,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "mls qos",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "00D0.97C7.5801"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "00D0.97C7.5802"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "00D0.97C7.5803"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "00D0.97C7.5804"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "00D0.97C7.5805"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "00D0.97C7.5806"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "00D0.97C7.5807"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "00D0.97C7.5808"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "00D0.97C7.5809"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "00D0.97C7.580A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "00D0.97C7.580B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "00D0.97C7.580C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "00D0.97C7.580D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "00D0.97C7.580E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "00D0.97C7.580F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "00D0.97C7.5810"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "00D0.97C7.5811"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "00D0.97C7.5812"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "00D0.97C7.5813"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "00D0.97C7.5814"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "00D0.97C7.5815"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "00D0.97C7.5816"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "00D0.97C7.5817"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "00D0.97C7.5818"
     }
    ]
   },
   {
    "name": "B2",
    "type": "Switch",
    "model": "2950-24",
    "x": 1018,
    "y": 215,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "mls qos",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0001.C703.6301"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0001.C703.6302"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0001.C703.6303"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0001.C703.6304"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0001.C703.6305"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0001.C703.6306"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0001.C703.6307"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0001.C703.6308"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0001.C703.6309"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0001.C703.630A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0001.C703.630B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0001.C703.630C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0001.C703.630D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0001.C703.630E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0001.C703.630F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0001.C703.6310"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0001.C703.6311"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0001.C703.6312"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0001.C703.6313"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0001.C703.6314"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0001.C703.6315"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0001.C703.6316"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0001.C703.6317"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0001.C703.6318"
     }
    ]
   },
   {
    "name": "PC0",
    "type": "Pc",
    "model": "PC-PT",
    "x": 82,
    "y": 57,
    "mac": "0090.214A.A655",
    "ip": "192.168.3.1",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.3.254",
    "dns": ""
   },
   {
    "name": "PC2",
    "type": "Pc",
    "model": "PC-PT",
    "x": 88,
    "y": 174,
    "mac": "00D0.FF6E.93EA",
    "ip": "192.168.2.10",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.2.254",
    "dns": ""
   },
   {
    "name": "PC3",
    "type": "Pc",
    "model": "PC-PT",
    "x": 86,
    "y": 258,
    "mac": "0060.5CA4.4AB3",
    "ip": "192.168.2.11",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.2.254",
    "dns": ""
   },
   {
    "name": "PC4",
    "type": "Pc",
    "model": "PC-PT",
    "x": 84,
    "y": 397,
    "mac": "0006.2A61.7204",
    "ip": "192.168.1.10",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": ""
   },
   {
    "name": "BB",
    "type": "Switch",
    "model": "2950-24",
    "x": 458,
    "y": 205,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "mls qos",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "000D.BD87.7A01"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "000D.BD87.7A02"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "000D.BD87.7A03"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "000D.BD87.7A04"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "000D.BD87.7A05"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "000D.BD87.7A06"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "000D.BD87.7A07"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "000D.BD87.7A08"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "000D.BD87.7A09"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "000D.BD87.7A0A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "000D.BD87.7A0B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "000D.BD87.7A0C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "000D.BD87.7A0D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "000D.BD87.7A0E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "000D.BD87.7A0F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "000D.BD87.7A10"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "000D.BD87.7A11"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "000D.BD87.7A12"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "000D.BD87.7A13"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "000D.BD87.7A14"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "000D.BD87.7A15"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "000D.BD87.7A16"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "000D.BD87.7A17"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "000D.BD87.7A18"
     }
    ]
   },
   {
    "name": "PC6",
    "type": "Pc",
    "model": "PC-PT",
    "x": 1134,
    "y": 223,
    "mac": "0090.0C32.1759",
    "ip": "192.168.4.1",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.4.254",
    "dns": ""
   }
  ],
  "links": [
   [
    "PB1",
    "FastEthernet4/0",
    "PB2",
    "FastEthernet4/0",
    "fiber"
   ],
   [
    "PC0",
    "FastEthernet0",
    "B1E2",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "PC2",
    "FastEthernet0",
    "B1E1",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "PC3",
    "FastEthernet0",
    "B1E1",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "PC4",
    "FastEthernet0",
    "B1E0",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "B1E2",
    "FastEthernet0/3",
    "RB1E2",
    "FastEthernet0/0",
    "straight"
   ],
   [
    "B1E1",
    "FastEthernet0/3",
    "RB1E1",
    "FastEthernet0/0",
    "straight"
   ],
   [
    "RB1E0",
    "FastEthernet0/0",
    "B1E0",
    "FastEthernet0/3",
    "straight"
   ],
   [
    "RB1E2",
    "FastEthernet0/1",
    "BB",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "RB1E1",
    "FastEthernet0/1",
    "BB",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "RB1E0",
    "FastEthernet0/1",
    "BB",
    "FastEthernet0/3",
    "straight"
   ],
   [
    "PB1",
    "FastEthernet0/0",
    "BB",
    "FastEthernet0/4",
    "straight"
   ],
   [
    "PB2",
    "FastEthernet0/0",
    "RB2",
    "FastEthernet0/0",
    "cross"
   ],
   [
    "B2",
    "FastEthernet0/1",
    "RB2",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "B2",
    "FastEthernet0/11",
    "PC6",
    "FastEthernet0",
    "straight"
   ]
  ],
  "notes": [
   {
    "x": 407,
    "y": 360,
    "text": "192.168.10.0/24"
   },
   {
    "x": 615,
    "y": 285,
    "text": "192.168.0.0/24"
   },
   {
    "x": 122,
    "y": 110,
    "text": "192.168.3.0/24"
   },
   {
    "x": 117,
    "y": 477,
    "text": "192.168.1.0/24"
   },
   {
    "x": 963,
    "y": 283,
    "text": "192.168.4.0/24"
   },
   {
    "x": 790,
    "y": 286,
    "text": "192.168.11.0/24"
   },
   {
    "x": 133,
    "y": 292,
    "text": "192.168.2.0/24"
   }
  ],
  "shapes": [
   {
    "k": "rect",
    "x1": 39,
    "y1": 145,
    "x2": 350,
    "y2": 304,
    "rgb": [
     0,
     0,
     255
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "rect",
    "x1": 37,
    "y1": 13,
    "x2": 347,
    "y2": 125,
    "rgb": [
     255,
     255,
     255
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "rect",
    "x1": 908,
    "y1": 156,
    "x2": 1152,
    "y2": 294,
    "rgb": [
     255,
     255,
     255
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "rect",
    "x1": 50,
    "y1": 344,
    "x2": 340,
    "y2": 485,
    "rgb": [
     0,
     0,
     255
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "ellipse",
    "x1": 594,
    "y1": 140,
    "x2": 736,
    "y2": 316,
    "rgb": [
     255,
     255,
     255
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "ellipse",
    "x1": 754,
    "y1": 144,
    "x2": 898,
    "y2": 307,
    "rgb": [
     255,
     255,
     255
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "ellipse",
    "x1": 362,
    "y1": 18,
    "x2": 582,
    "y2": 459,
    "rgb": [
     255,
     255,
     255
    ],
    "fill": false,
    "line": "#000000"
   }
  ],
  "file": "EX0-ROUTAGE-debut.pkt"
 },
 "EX0-ROUTAGE-fin": {
  "version": "8.2.2.0400",
  "devices": [
   {
    "name": "PB1",
    "type": "Router",
    "model": "Router-PT",
    "x": 575,
    "y": 200,
    "config": [
     "hostname PB1",
     "interface FastEthernet0/0",
     " ip address 192.168.10.4 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet1/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface Serial2/0",
     " no ip address",
     " clock rate 2000000",
     " shutdown",
     "interface Serial3/0",
     " no ip address",
     " clock rate 2000000",
     " shutdown",
     "interface FastEthernet4/0",
     " ip address 192.168.0.1 255.255.255.0",
     "interface FastEthernet5/0",
     " no ip address",
     " shutdown",
     "router rip",
     "ip classless",
     "ip route 192.168.3.0 255.255.255.0 192.168.10.3",
     "ip route 192.168.2.0 255.255.255.0 192.168.10.2",
     "ip route 192.168.1.0 255.255.255.0 192.168.10.1",
     "ip route 192.168.4.0 255.255.255.0 192.168.0.2",
     "ip route 192.168.11.0 255.255.255.0 192.168.0.2",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "0001.9629.A9DC"
     },
     {
      "name": "FastEthernet1/0",
      "mac": "0004.9AE6.B799"
     },
     {
      "name": "Serial2/0",
      "mac": "0001.9629.A9DC",
      "kind": "serial"
     },
     {
      "name": "Serial3/0",
      "mac": "0001.9629.A9DC",
      "kind": "serial"
     },
     {
      "name": "FastEthernet4/0",
      "mac": "00D0.58A8.1007",
      "kind": "fiber"
     },
     {
      "name": "FastEthernet5/0",
      "mac": "0040.0B8E.29A8",
      "kind": "fiber"
     }
    ]
   },
   {
    "name": "PB2",
    "type": "Router",
    "model": "Router-PT",
    "x": 744,
    "y": 208,
    "config": [
     "hostname Router",
     "interface FastEthernet0/0",
     " ip address 192.168.11.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet1/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface Serial2/0",
     " no ip address",
     " clock rate 2000000",
     " shutdown",
     "interface Serial3/0",
     " no ip address",
     " clock rate 2000000",
     " shutdown",
     "interface FastEthernet4/0",
     " ip address 192.168.0.2 255.255.255.0",
     "interface FastEthernet5/0",
     " no ip address",
     " shutdown",
     "router rip",
     "ip classless",
     "ip route 192.168.4.0 255.255.255.0 192.168.11.2",
     "ip route 0.0.0.0 0.0.0.0 192.168.0.1",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "0090.0C48.6EAE"
     },
     {
      "name": "FastEthernet1/0",
      "mac": "0050.0F00.963B"
     },
     {
      "name": "Serial2/0",
      "mac": "0090.0C48.6EAE",
      "kind": "serial"
     },
     {
      "name": "Serial3/0",
      "mac": "0090.0C48.6EAE",
      "kind": "serial"
     },
     {
      "name": "FastEthernet4/0",
      "mac": "0001.6326.C603",
      "kind": "fiber"
     },
     {
      "name": "FastEthernet5/0",
      "mac": "0001.97A5.2A3D",
      "kind": "fiber"
     }
    ]
   },
   {
    "name": "RB1E2",
    "type": "Router",
    "model": "1841",
    "x": 366,
    "y": 98,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface FastEthernet0/0",
     " ip address 192.168.3.254 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet0/1",
     " ip address 192.168.10.3 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "router rip",
     "ip classless",
     "ip route 0.0.0.0 0.0.0.0 192.168.10.4",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "000A.41B4.1B01"
     },
     {
      "name": "FastEthernet0/1",
      "mac": "000A.41B4.1B02"
     }
    ]
   },
   {
    "name": "RB1E1",
    "type": "Router",
    "model": "1841",
    "x": 356,
    "y": 204,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface FastEthernet0/0",
     " ip address 192.168.2.254 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet0/1",
     " ip address 192.168.10.2 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "router rip",
     "ip classless",
     "ip route 0.0.0.0 0.0.0.0 192.168.10.4",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "00D0.D30E.8601"
     },
     {
      "name": "FastEthernet0/1",
      "mac": "00D0.D30E.8602"
     }
    ]
   },
   {
    "name": "RB1E0",
    "type": "Router",
    "model": "1841",
    "x": 354,
    "y": 358,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface FastEthernet0/0",
     " ip address 192.168.1.254 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet0/1",
     " ip address 192.168.10.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "router rip",
     "ip classless",
     "ip route 0.0.0.0 0.0.0.0 192.168.10.4",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "00E0.A3AA.4101"
     },
     {
      "name": "FastEthernet0/1",
      "mac": "00E0.A3AA.4102"
     }
    ]
   },
   {
    "name": "RB2",
    "type": "Router",
    "model": "1841",
    "x": 908,
    "y": 207,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface FastEthernet0/0",
     " ip address 192.168.11.2 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet0/1",
     " ip address 192.168.4.254 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "router rip",
     "ip classless",
     "ip route 0.0.0.0 0.0.0.0 192.168.11.1",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "0001.42DA.AA01"
     },
     {
      "name": "FastEthernet0/1",
      "mac": "0001.42DA.AA02"
     }
    ]
   },
   {
    "name": "B1E0",
    "type": "Switch",
    "model": "2950-24",
    "x": 175,
    "y": 398,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "mls qos",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0060.3E25.0001"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0060.3E25.0002"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0060.3E25.0003"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0060.3E25.0004"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0060.3E25.0005"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0060.3E25.0006"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0060.3E25.0007"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0060.3E25.0008"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0060.3E25.0009"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0060.3E25.000A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0060.3E25.000B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0060.3E25.000C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0060.3E25.000D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0060.3E25.000E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0060.3E25.000F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0060.3E25.0010"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0060.3E25.0011"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0060.3E25.0012"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0060.3E25.0013"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0060.3E25.0014"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0060.3E25.0015"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0060.3E25.0016"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0060.3E25.0017"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0060.3E25.0018"
     }
    ]
   },
   {
    "name": "B1E1",
    "type": "Switch",
    "model": "2950-24",
    "x": 178,
    "y": 206,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "mls qos",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0009.7C22.9801"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0009.7C22.9802"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0009.7C22.9803"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0009.7C22.9804"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0009.7C22.9805"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0009.7C22.9806"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0009.7C22.9807"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0009.7C22.9808"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0009.7C22.9809"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0009.7C22.980A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0009.7C22.980B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0009.7C22.980C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0009.7C22.980D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0009.7C22.980E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0009.7C22.980F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0009.7C22.9810"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0009.7C22.9811"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0009.7C22.9812"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0009.7C22.9813"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0009.7C22.9814"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0009.7C22.9815"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0009.7C22.9816"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0009.7C22.9817"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0009.7C22.9818"
     }
    ]
   },
   {
    "name": "B1E2",
    "type": "Switch",
    "model": "2950-24",
    "x": 228,
    "y": 68,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "mls qos",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "00D0.97C7.5801"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "00D0.97C7.5802"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "00D0.97C7.5803"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "00D0.97C7.5804"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "00D0.97C7.5805"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "00D0.97C7.5806"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "00D0.97C7.5807"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "00D0.97C7.5808"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "00D0.97C7.5809"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "00D0.97C7.580A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "00D0.97C7.580B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "00D0.97C7.580C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "00D0.97C7.580D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "00D0.97C7.580E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "00D0.97C7.580F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "00D0.97C7.5810"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "00D0.97C7.5811"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "00D0.97C7.5812"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "00D0.97C7.5813"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "00D0.97C7.5814"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "00D0.97C7.5815"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "00D0.97C7.5816"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "00D0.97C7.5817"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "00D0.97C7.5818"
     }
    ]
   },
   {
    "name": "B2",
    "type": "Switch",
    "model": "2950-24",
    "x": 1018,
    "y": 215,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "mls qos",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0001.C703.6301"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0001.C703.6302"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0001.C703.6303"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0001.C703.6304"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0001.C703.6305"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0001.C703.6306"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0001.C703.6307"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0001.C703.6308"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0001.C703.6309"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0001.C703.630A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0001.C703.630B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0001.C703.630C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0001.C703.630D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0001.C703.630E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0001.C703.630F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0001.C703.6310"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0001.C703.6311"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0001.C703.6312"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0001.C703.6313"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0001.C703.6314"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0001.C703.6315"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0001.C703.6316"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0001.C703.6317"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0001.C703.6318"
     }
    ]
   },
   {
    "name": "PC0",
    "type": "Pc",
    "model": "PC-PT",
    "x": 82,
    "y": 57,
    "mac": "0090.214A.A655",
    "ip": "192.168.3.1",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.3.254",
    "dns": ""
   },
   {
    "name": "PC2",
    "type": "Pc",
    "model": "PC-PT",
    "x": 88,
    "y": 174,
    "mac": "00D0.FF6E.93EA",
    "ip": "192.168.2.10",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.2.254",
    "dns": ""
   },
   {
    "name": "PC3",
    "type": "Pc",
    "model": "PC-PT",
    "x": 86,
    "y": 258,
    "mac": "0060.5CA4.4AB3",
    "ip": "192.168.2.11",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.2.254",
    "dns": ""
   },
   {
    "name": "PC4",
    "type": "Pc",
    "model": "PC-PT",
    "x": 84,
    "y": 397,
    "mac": "0006.2A61.7204",
    "ip": "192.168.1.10",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": ""
   },
   {
    "name": "BB",
    "type": "Switch",
    "model": "2950-24",
    "x": 458,
    "y": 205,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "mls qos",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "000D.BD87.7A01"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "000D.BD87.7A02"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "000D.BD87.7A03"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "000D.BD87.7A04"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "000D.BD87.7A05"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "000D.BD87.7A06"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "000D.BD87.7A07"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "000D.BD87.7A08"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "000D.BD87.7A09"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "000D.BD87.7A0A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "000D.BD87.7A0B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "000D.BD87.7A0C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "000D.BD87.7A0D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "000D.BD87.7A0E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "000D.BD87.7A0F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "000D.BD87.7A10"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "000D.BD87.7A11"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "000D.BD87.7A12"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "000D.BD87.7A13"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "000D.BD87.7A14"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "000D.BD87.7A15"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "000D.BD87.7A16"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "000D.BD87.7A17"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "000D.BD87.7A18"
     }
    ]
   },
   {
    "name": "PC6",
    "type": "Pc",
    "model": "PC-PT",
    "x": 1134,
    "y": 223,
    "mac": "0090.0C32.1759",
    "ip": "192.168.4.1",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.4.254",
    "dns": ""
   }
  ],
  "links": [
   [
    "PB1",
    "FastEthernet4/0",
    "PB2",
    "FastEthernet4/0",
    "fiber"
   ],
   [
    "PC0",
    "FastEthernet0",
    "B1E2",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "PC2",
    "FastEthernet0",
    "B1E1",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "PC3",
    "FastEthernet0",
    "B1E1",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "PC4",
    "FastEthernet0",
    "B1E0",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "B1E2",
    "FastEthernet0/3",
    "RB1E2",
    "FastEthernet0/0",
    "straight"
   ],
   [
    "B1E1",
    "FastEthernet0/3",
    "RB1E1",
    "FastEthernet0/0",
    "straight"
   ],
   [
    "RB1E0",
    "FastEthernet0/0",
    "B1E0",
    "FastEthernet0/3",
    "straight"
   ],
   [
    "RB1E2",
    "FastEthernet0/1",
    "BB",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "RB1E1",
    "FastEthernet0/1",
    "BB",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "RB1E0",
    "FastEthernet0/1",
    "BB",
    "FastEthernet0/3",
    "straight"
   ],
   [
    "PB1",
    "FastEthernet0/0",
    "BB",
    "FastEthernet0/4",
    "straight"
   ],
   [
    "PB2",
    "FastEthernet0/0",
    "RB2",
    "FastEthernet0/0",
    "cross"
   ],
   [
    "B2",
    "FastEthernet0/1",
    "RB2",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "B2",
    "FastEthernet0/11",
    "PC6",
    "FastEthernet0",
    "straight"
   ]
  ],
  "notes": [
   {
    "x": 407,
    "y": 360,
    "text": "192.168.10.0/24"
   },
   {
    "x": 615,
    "y": 285,
    "text": "192.168.0.0/24"
   },
   {
    "x": 122,
    "y": 110,
    "text": "192.168.3.0/24"
   },
   {
    "x": 117,
    "y": 477,
    "text": "192.168.1.0/24"
   },
   {
    "x": 963,
    "y": 283,
    "text": "192.168.4.0/24"
   },
   {
    "x": 790,
    "y": 286,
    "text": "192.168.11.0/24"
   },
   {
    "x": 133,
    "y": 292,
    "text": "192.168.2.0/24"
   }
  ],
  "shapes": [
   {
    "k": "rect",
    "x1": 39,
    "y1": 145,
    "x2": 350,
    "y2": 304,
    "rgb": [
     0,
     0,
     255
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "rect",
    "x1": 37,
    "y1": 13,
    "x2": 347,
    "y2": 125,
    "rgb": [
     255,
     255,
     255
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "rect",
    "x1": 908,
    "y1": 156,
    "x2": 1152,
    "y2": 294,
    "rgb": [
     255,
     255,
     255
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "rect",
    "x1": 50,
    "y1": 344,
    "x2": 340,
    "y2": 485,
    "rgb": [
     0,
     0,
     255
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "ellipse",
    "x1": 594,
    "y1": 140,
    "x2": 736,
    "y2": 316,
    "rgb": [
     255,
     255,
     255
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "ellipse",
    "x1": 754,
    "y1": 144,
    "x2": 898,
    "y2": 307,
    "rgb": [
     255,
     255,
     255
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "ellipse",
    "x1": 362,
    "y1": 18,
    "x2": 582,
    "y2": 459,
    "rgb": [
     255,
     255,
     255
    ],
    "fill": false,
    "line": "#000000"
   }
  ],
  "file": "EX0-ROUTAGE-fin.pkt"
 },
 "EX-ROUTAGE-CORR": {
  "version": "9.0.0.0810",
  "devices": [
   {
    "name": "LENS",
    "type": "Router",
    "model": "Router-PT-Empty",
    "x": 906,
    "y": 260,
    "config": [
     "hostname Router",
     "interface GigabitEthernet0/0",
     " ip address 192.168.4.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet1/0",
     " ip address 192.168.100.9 255.255.255.252",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet2/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface GigabitEthernet3/0",
     " ip address 192.168.100.6 255.255.255.252",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet4/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "ip classless",
     "ip route 192.168.5.0 255.255.255.0 192.168.100.10",
     "ip route 0.0.0.0 0.0.0.0 192.168.100.5",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0",
      "mac": "0003.E407.5B8C"
     },
     {
      "name": "GigabitEthernet1/0",
      "mac": "0010.11A1.3D4D"
     },
     {
      "name": "GigabitEthernet2/0",
      "mac": "0010.11E8.9B05"
     },
     {
      "name": "GigabitEthernet3/0",
      "mac": "0010.1127.931C"
     },
     {
      "name": "GigabitEthernet4/0",
      "mac": "0009.7CA4.A390"
     }
    ]
   },
   {
    "name": "LILLE",
    "type": "Router",
    "model": "Router-PT-Empty",
    "x": 616,
    "y": 205,
    "config": [
     "hostname Router",
     "interface GigabitEthernet0/0",
     " ip address 192.168.1.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet1/0",
     " ip address 192.168.2.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet2/0",
     " ip address 192.168.100.1 255.255.255.252",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet3/0",
     " ip address 192.168.100.5 255.255.255.252",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet4/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "ip classless",
     "ip route 192.168.3.0 255.255.255.0 192.168.100.2",
     "ip route 0.0.0.0 0.0.0.0 192.168.100.6",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0",
      "mac": "0060.3ED1.0092"
     },
     {
      "name": "GigabitEthernet1/0",
      "mac": "000B.BE47.A9A8"
     },
     {
      "name": "GigabitEthernet2/0",
      "mac": "0030.A384.A6D9"
     },
     {
      "name": "GigabitEthernet3/0",
      "mac": "00E0.F750.B5CB"
     },
     {
      "name": "GigabitEthernet4/0",
      "mac": "0001.633E.011C"
     }
    ]
   },
   {
    "name": "VALENCIENNES",
    "type": "Router",
    "model": "Router-PT-Empty",
    "x": 1120,
    "y": 331,
    "config": [
     "hostname Router",
     "interface GigabitEthernet0/0",
     " ip address 192.168.5.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet1/0",
     " ip address 192.168.100.10 255.255.255.252",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet2/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface GigabitEthernet3/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface GigabitEthernet4/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "ip classless",
     "ip route 0.0.0.0 0.0.0.0 192.168.100.9",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0",
      "mac": "0060.2FCE.99B9"
     },
     {
      "name": "GigabitEthernet1/0",
      "mac": "0001.9619.6041"
     },
     {
      "name": "GigabitEthernet2/0",
      "mac": "0009.7C1B.9D0A"
     },
     {
      "name": "GigabitEthernet3/0",
      "mac": "0060.3E46.AB8E"
     },
     {
      "name": "GigabitEthernet4/0",
      "mac": "0001.4252.7B23"
     }
    ]
   },
   {
    "name": "ARRAS",
    "type": "Router",
    "model": "Router-PT-Empty",
    "x": 614,
    "y": 486,
    "config": [
     "hostname Router",
     "interface GigabitEthernet0/0",
     " ip address 192.168.3.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet1/0",
     " ip address 192.168.100.2 255.255.255.252",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet2/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface GigabitEthernet3/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface GigabitEthernet4/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "ip classless",
     "ip route 0.0.0.0 0.0.0.0 192.168.100.1",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0",
      "mac": "0090.0C55.182A"
     },
     {
      "name": "GigabitEthernet1/0",
      "mac": "0002.164A.B558"
     },
     {
      "name": "GigabitEthernet2/0",
      "mac": "00D0.BCC7.EB30"
     },
     {
      "name": "GigabitEthernet3/0",
      "mac": "0030.F281.A325"
     },
     {
      "name": "GigabitEthernet4/0",
      "mac": "0002.1795.85DE"
     }
    ]
   },
   {
    "name": "LILLE1",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 370,
    "y": 81,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "00D0.FF72.0101"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "00D0.FF72.0102"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "00D0.FF72.0103"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "00D0.FF72.0104"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "00D0.FF72.0105"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "00D0.FF72.0106"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "00D0.FF72.0107"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "00D0.FF72.0108"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "00D0.FF72.0109"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "00D0.FF72.010A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "00D0.FF72.010B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "00D0.FF72.010C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "00D0.FF72.010D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "00D0.FF72.010E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "00D0.FF72.010F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "00D0.FF72.0110"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "00D0.FF72.0111"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "00D0.FF72.0112"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "00D0.FF72.0113"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "00D0.FF72.0114"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "00D0.FF72.0115"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "00D0.FF72.0116"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "00D0.FF72.0117"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "00D0.FF72.0118"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "00D0.FF72.0119"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "00D0.FF72.011A"
     }
    ]
   },
   {
    "name": "LILLE2",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 366,
    "y": 251,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0009.7C7D.6101"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0009.7C7D.6102"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0009.7C7D.6103"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0009.7C7D.6104"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0009.7C7D.6105"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0009.7C7D.6106"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0009.7C7D.6107"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0009.7C7D.6108"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0009.7C7D.6109"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0009.7C7D.610A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0009.7C7D.610B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0009.7C7D.610C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0009.7C7D.610D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0009.7C7D.610E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0009.7C7D.610F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0009.7C7D.6110"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0009.7C7D.6111"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0009.7C7D.6112"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0009.7C7D.6113"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0009.7C7D.6114"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0009.7C7D.6115"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0009.7C7D.6116"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0009.7C7D.6117"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0009.7C7D.6118"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0009.7C7D.6119"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "0009.7C7D.611A"
     }
    ]
   },
   {
    "name": "PC-L1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 152,
    "y": 72,
    "mac": "0060.5CE3.7965",
    "ip": "192.168.1.10",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.1",
    "dns": ""
   },
   {
    "name": "PC-L2",
    "type": "Pc",
    "model": "PC-PT",
    "x": 149,
    "y": 250,
    "mac": "00D0.BC50.32EB",
    "ip": "192.168.2.10",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.2.1",
    "dns": ""
   },
   {
    "name": "Switch-ARRAS",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 352,
    "y": 495,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "000D.BD77.7801"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "000D.BD77.7802"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "000D.BD77.7803"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "000D.BD77.7804"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "000D.BD77.7805"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "000D.BD77.7806"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "000D.BD77.7807"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "000D.BD77.7808"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "000D.BD77.7809"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "000D.BD77.780A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "000D.BD77.780B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "000D.BD77.780C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "000D.BD77.780D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "000D.BD77.780E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "000D.BD77.780F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "000D.BD77.7810"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "000D.BD77.7811"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "000D.BD77.7812"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "000D.BD77.7813"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "000D.BD77.7814"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "000D.BD77.7815"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "000D.BD77.7816"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "000D.BD77.7817"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "000D.BD77.7818"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "000D.BD77.7819"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "000D.BD77.781A"
     }
    ]
   },
   {
    "name": "Switch-LENS",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 1056,
    "y": 78,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "000B.BE8E.D901"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "000B.BE8E.D902"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "000B.BE8E.D903"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "000B.BE8E.D904"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "000B.BE8E.D905"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "000B.BE8E.D906"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "000B.BE8E.D907"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "000B.BE8E.D908"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "000B.BE8E.D909"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "000B.BE8E.D90A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "000B.BE8E.D90B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "000B.BE8E.D90C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "000B.BE8E.D90D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "000B.BE8E.D90E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "000B.BE8E.D90F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "000B.BE8E.D910"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "000B.BE8E.D911"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "000B.BE8E.D912"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "000B.BE8E.D913"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "000B.BE8E.D914"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "000B.BE8E.D915"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "000B.BE8E.D916"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "000B.BE8E.D917"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "000B.BE8E.D918"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "000B.BE8E.D919"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "000B.BE8E.D91A"
     }
    ]
   },
   {
    "name": "Switch-VAL",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 1192,
    "y": 448,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0001.C907.3E01"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0001.C907.3E02"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0001.C907.3E03"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0001.C907.3E04"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0001.C907.3E05"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0001.C907.3E06"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0001.C907.3E07"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0001.C907.3E08"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0001.C907.3E09"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0001.C907.3E0A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0001.C907.3E0B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0001.C907.3E0C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0001.C907.3E0D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0001.C907.3E0E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0001.C907.3E0F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0001.C907.3E10"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0001.C907.3E11"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0001.C907.3E12"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0001.C907.3E13"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0001.C907.3E14"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0001.C907.3E15"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0001.C907.3E16"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0001.C907.3E17"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0001.C907.3E18"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0001.C907.3E19"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "0001.C907.3E1A"
     }
    ]
   },
   {
    "name": "PC-ARRAS",
    "type": "Pc",
    "model": "PC-PT",
    "x": 145,
    "y": 495,
    "mac": "000C.8520.4A01",
    "ip": "192.168.3.10",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.3.1",
    "dns": ""
   },
   {
    "name": "PC-LENS",
    "type": "Pc",
    "model": "PC-PT",
    "x": 1325,
    "y": 72,
    "mac": "00E0.F9D8.B234",
    "ip": "192.168.4.10",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.4.1",
    "dns": ""
   },
   {
    "name": "PC-VAL",
    "type": "Pc",
    "model": "PC-PT",
    "x": 1345,
    "y": 444,
    "mac": "00D0.FF9E.7550",
    "ip": "192.168.5.10",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.5.1",
    "dns": ""
   },
   {
    "name": "Server0",
    "type": "Server",
    "model": "Server-PT",
    "x": 216,
    "y": 150,
    "mac": "0001.6425.8378",
    "ip": "192.168.1.100",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.1",
    "dns": "",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.1.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.1.0",
        "end": "192.168.2.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   }
  ],
  "links": [
   [
    "LILLE1",
    "FastEthernet0/1",
    "LILLE",
    "GigabitEthernet0/0",
    "straight"
   ],
   [
    "LILLE2",
    "FastEthernet0/1",
    "LILLE",
    "GigabitEthernet1/0",
    "straight"
   ],
   [
    "PC-L1",
    "FastEthernet0",
    "LILLE1",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "PC-L2",
    "FastEthernet0",
    "LILLE2",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "Switch-ARRAS",
    "FastEthernet0/1",
    "ARRAS",
    "GigabitEthernet0/0",
    "straight"
   ],
   [
    "PC-ARRAS",
    "FastEthernet0",
    "Switch-ARRAS",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "Switch-LENS",
    "FastEthernet0/1",
    "LENS",
    "GigabitEthernet0/0",
    "straight"
   ],
   [
    "PC-LENS",
    "FastEthernet0",
    "Switch-LENS",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "Switch-VAL",
    "FastEthernet0/1",
    "VALENCIENNES",
    "GigabitEthernet0/0",
    "straight"
   ],
   [
    "PC-VAL",
    "FastEthernet0",
    "Switch-VAL",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "LILLE",
    "GigabitEthernet2/0",
    "ARRAS",
    "GigabitEthernet1/0",
    "cross"
   ],
   [
    "LILLE",
    "GigabitEthernet3/0",
    "LENS",
    "GigabitEthernet3/0",
    "cross"
   ],
   [
    "VALENCIENNES",
    "GigabitEthernet1/0",
    "LENS",
    "GigabitEthernet1/0",
    "cross"
   ],
   [
    "Server0",
    "FastEthernet0",
    "LILLE1",
    "FastEthernet0/3",
    "straight"
   ]
  ],
  "notes": [],
  "shapes": [],
  "file": "EX-ROUTAGE-CORR.pkt"
 },
 "HSRP": {
  "version": "8.2.2.0400",
  "devices": [
   {
    "name": "Router1",
    "type": "Router",
    "model": "1841",
    "x": 598,
    "y": 317,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface FastEthernet0/0",
     " ip address 192.168.2.254 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet0/1",
     " ip address 193.1.1.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "router rip",
     " network 192.168.2.0",
     " network 193.1.1.0",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "000B.BEE5.1601"
     },
     {
      "name": "FastEthernet0/1",
      "mac": "000B.BEE5.1602"
     }
    ]
   },
   {
    "name": "PC0",
    "type": "Pc",
    "model": "PC-PT",
    "x": 1242,
    "y": 162,
    "mac": "0090.2BAC.19C4",
    "ip": "",
    "mask": "",
    "dhcp": true,
    "v6auto": false,
    "gw": "192.168.2.254",
    "dns": "192.168.2.3"
   },
   {
    "name": "PC1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 1246,
    "y": 238,
    "mac": "0001.6453.40A0",
    "ip": "",
    "mask": "",
    "dhcp": true,
    "v6auto": false,
    "gw": "192.168.2.254",
    "dns": "192.168.2.3"
   },
   {
    "name": "WEB",
    "type": "Server",
    "model": "Server-PT",
    "x": 864,
    "y": 302,
    "mac": "0001.63E8.0497",
    "ip": "192.168.2.2",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.2.254",
    "dns": "192.168.2.3",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.2.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.2.0",
        "end": "192.168.3.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "MAIL",
    "type": "Server",
    "model": "Server-PT",
    "x": 786,
    "y": 309,
    "mac": "0001.6359.B172",
    "ip": "192.168.2.1",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.2.254",
    "dns": "192.168.2.1",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.2.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.2.0",
        "end": "192.168.3.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "DNS",
    "type": "Server",
    "model": "Server-PT",
    "x": 928,
    "y": 311,
    "mac": "0001.4205.B4E2",
    "ip": "192.168.2.3",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.2.254",
    "dns": "192.168.2.3",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.2.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.2.0",
        "end": "192.168.3.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": true,
      "records": [
       {
        "name": "dns.epsi.fr",
        "type": "A",
        "value": "192.168.2.3"
       },
       {
        "name": "imap.epsi.local",
        "type": "CNAME",
        "value": "mail.epsi.local"
       },
       {
        "name": "mail.epsi.local",
        "type": "A",
        "value": "192.168.2.1"
       },
       {
        "name": "pop.epsi.local",
        "type": "CNAME",
        "value": "mail.epsi.local"
       },
       {
        "name": "SMTP.epsi.local",
        "type": "CNAME",
        "value": "mail.epsi.local"
       },
       {
        "name": "web.epsi.local",
        "type": "CNAME",
        "value": "WEB.EPSI.LOCAL"
       },
       {
        "name": "web.epsi.local",
        "type": "A",
        "value": "192.168.2.2"
       }
      ]
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "DHCP",
    "type": "Server",
    "model": "Server-PT",
    "x": 1054,
    "y": 330,
    "mac": "0001.6334.37C3",
    "ip": "192.168.2.10",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.2.254",
    "dns": "192.168.2.3",
    "services": {
     "dhcp": {
      "on": true,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.2.0",
        "mask": "255.255.255.0",
        "gateway": "192.168.2.254",
        "dns": "192.168.2.3",
        "start": "192.168.2.0",
        "end": "192.168.2.50",
        "max": 50,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "LABINFO",
    "type": "Switch",
    "model": "2950-24",
    "x": 881,
    "y": 175,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0001.96A5.1001"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0001.96A5.1002"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0001.96A5.1003"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0001.96A5.1004"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0001.96A5.1005"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0001.96A5.1006"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0001.96A5.1007"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0001.96A5.1008"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0001.96A5.1009"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0001.96A5.100A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0001.96A5.100B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0001.96A5.100C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0001.96A5.100D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0001.96A5.100E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0001.96A5.100F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0001.96A5.1010"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0001.96A5.1011"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0001.96A5.1012"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0001.96A5.1013"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0001.96A5.1014"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0001.96A5.1015"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0001.96A5.1016"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0001.96A5.1017"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0001.96A5.1018"
     }
    ]
   },
   {
    "name": "Switch2",
    "type": "Switch",
    "model": "2950-24",
    "x": 405,
    "y": 181,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0001.630C.7401"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0001.630C.7402"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0001.630C.7403"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0001.630C.7404"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0001.630C.7405"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0001.630C.7406"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0001.630C.7407"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0001.630C.7408"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0001.630C.7409"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0001.630C.740A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0001.630C.740B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0001.630C.740C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0001.630C.740D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0001.630C.740E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0001.630C.740F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0001.630C.7410"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0001.630C.7411"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0001.630C.7412"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0001.630C.7413"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0001.630C.7414"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0001.630C.7415"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0001.630C.7416"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0001.630C.7417"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0001.630C.7418"
     }
    ]
   },
   {
    "name": "SRV-EXT1",
    "type": "Server",
    "model": "Server-PT",
    "x": 419,
    "y": 57,
    "mac": "00E0.B009.C272",
    "ip": "193.1.1.10",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "193.1.1.1",
    "dns": "192.168.2.3",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "193.1.1.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "193.1.1.0",
        "end": "193.1.2.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "PE1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 438,
    "y": 275,
    "mac": "000D.BDD9.1A2D",
    "ip": "193.1.1.100",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "193.1.1.1",
    "dns": "192.168.2.3"
   },
   {
    "name": "Router0",
    "type": "Router",
    "model": "1841",
    "x": 604,
    "y": 113,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface FastEthernet0/0",
     " ip address 192.168.2.253 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet0/1",
     " ip address 193.1.1.2 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "000C.8561.0301"
     },
     {
      "name": "FastEthernet0/1",
      "mac": "000C.8561.0302"
     }
    ]
   },
   {
    "name": "SITE1",
    "type": "Router",
    "model": "1841",
    "x": 250,
    "y": 147,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface FastEthernet0/0",
     " ip address 10.0.0.1 255.0.0.0",
     " duplex auto",
     " speed auto",
     "interface FastEthernet0/1",
     " ip address 193.1.1.3 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "00D0.97A1.E501"
     },
     {
      "name": "FastEthernet0/1",
      "mac": "00D0.97A1.E502"
     }
    ]
   },
   {
    "name": "Switch0",
    "type": "Switch",
    "model": "2950-24",
    "x": 175,
    "y": 290,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "00D0.FF6C.5801"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "00D0.FF6C.5802"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "00D0.FF6C.5803"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "00D0.FF6C.5804"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "00D0.FF6C.5805"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "00D0.FF6C.5806"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "00D0.FF6C.5807"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "00D0.FF6C.5808"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "00D0.FF6C.5809"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "00D0.FF6C.580A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "00D0.FF6C.580B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "00D0.FF6C.580C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "00D0.FF6C.580D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "00D0.FF6C.580E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "00D0.FF6C.580F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "00D0.FF6C.5810"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "00D0.FF6C.5811"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "00D0.FF6C.5812"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "00D0.FF6C.5813"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "00D0.FF6C.5814"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "00D0.FF6C.5815"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "00D0.FF6C.5816"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "00D0.FF6C.5817"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "00D0.FF6C.5818"
     }
    ]
   },
   {
    "name": "PC12",
    "type": "Pc",
    "model": "PC-PT",
    "x": 136,
    "y": 408,
    "mac": "0002.4A4E.1B0B",
    "ip": "10.0.0.4",
    "mask": "255.0.0.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "10.0.0.1",
    "dns": ""
   },
   {
    "name": "PC13",
    "type": "Pc",
    "model": "PC-PT",
    "x": 214,
    "y": 416,
    "mac": "0001.6447.055C",
    "ip": "10.1.1.100",
    "mask": "255.0.0.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "10.0.0.1",
    "dns": ""
   },
   {
    "name": "PC11",
    "type": "Pc",
    "model": "PC-PT",
    "x": 84,
    "y": 292,
    "mac": "0060.47B0.CEB6",
    "ip": "10.1.1.2",
    "mask": "255.0.0.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "10.0.0.1",
    "dns": ""
   }
  ],
  "links": [
   [
    "LABINFO",
    "FastEthernet0/2",
    "MAIL",
    "FastEthernet0",
    "straight"
   ],
   [
    "LABINFO",
    "FastEthernet0/3",
    "WEB",
    "FastEthernet0",
    "straight"
   ],
   [
    "LABINFO",
    "FastEthernet0/4",
    "DNS",
    "FastEthernet0",
    "straight"
   ],
   [
    "Router1",
    "FastEthernet0/1",
    "Switch2",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "SRV-EXT1",
    "FastEthernet0",
    "Switch2",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "Switch2",
    "FastEthernet0/3",
    "PE1",
    "FastEthernet0",
    "straight"
   ],
   [
    "Router0",
    "FastEthernet0/1",
    "Switch2",
    "FastEthernet0/4",
    "straight"
   ],
   [
    "Router0",
    "FastEthernet0/0",
    "LABINFO",
    "FastEthernet0/24",
    "straight"
   ],
   [
    "Router1",
    "FastEthernet0/0",
    "LABINFO",
    "FastEthernet0/23",
    "straight"
   ],
   [
    "PC0",
    "FastEthernet0",
    "LABINFO",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "PC1",
    "FastEthernet0",
    "LABINFO",
    "FastEthernet0/5",
    "straight"
   ],
   [
    "DHCP",
    "FastEthernet0",
    "LABINFO",
    "FastEthernet0/6",
    "straight"
   ],
   [
    "Switch2",
    "FastEthernet0/24",
    "SITE1",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "SITE1",
    "FastEthernet0/0",
    "Switch0",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "Switch0",
    "FastEthernet0/2",
    "PC11",
    "FastEthernet0",
    "straight"
   ],
   [
    "Switch0",
    "FastEthernet0/3",
    "PC12",
    "FastEthernet0",
    "straight"
   ],
   [
    "Switch0",
    "FastEthernet0/4",
    "PC13",
    "FastEthernet0",
    "straight"
   ]
  ],
  "notes": [
   {
    "x": 379,
    "y": 339,
    "text": "RESEAU EXTERNE"
   },
   {
    "x": 848,
    "y": 489,
    "text": "SITE PRINCIPAL"
   },
   {
    "x": 538,
    "y": 477,
    "text": "ROUTEURS D'ACCES"
   },
   {
    "x": 371,
    "y": 574,
    "text": "Configurer la tolérance aux pannes sur le routeur principal et le routeur de secours \nMettre à jour la configuration du serveur DHCP"
   }
  ],
  "shapes": [
   {
    "k": "rect",
    "x1": 360,
    "y1": 19,
    "x2": 468,
    "y2": 377,
    "rgb": [
     32,
     80,
     255
    ],
    "fill": true,
    "line": "#000000"
   },
   {
    "k": "rect",
    "x1": 592,
    "y1": 36,
    "x2": 1307,
    "y2": 437,
    "rgb": [
     170,
     255,
     0
    ],
    "fill": true,
    "line": "#000000"
   },
   {
    "k": "ellipse",
    "x1": 47,
    "y1": 89,
    "x2": 290,
    "y2": 541,
    "rgb": [
     255,
     85,
     0
    ],
    "fill": true,
    "line": "#000000"
   }
  ],
  "file": "HSRP.pkt"
 },
 "NAT-PAT-depart": {
  "version": "8.2.2.0400",
  "devices": [
   {
    "name": "Router0",
    "type": "Router",
    "model": "ISR4331",
    "x": 510,
    "y": 70,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface GigabitEthernet0/0/0",
     " ip address 192.168.1.254 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/0/1",
     " ip address 13.1.1.1 255.0.0.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/0/2",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "router rip",
     " network 13.0.0.0",
     " network 192.168.1.0",
     "ip classless",
     "access-list 1 permit any",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0/0",
      "mac": "0006.2A24.7001"
     },
     {
      "name": "GigabitEthernet0/0/1",
      "mac": "0006.2A24.7002"
     },
     {
      "name": "GigabitEthernet0/0/2",
      "mac": "0006.2A24.7003"
     }
    ]
   },
   {
    "name": "Router1",
    "type": "Router",
    "model": "ISR4331",
    "x": 810,
    "y": 68,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface GigabitEthernet0/0/0",
     " ip address 13.1.1.2 255.0.0.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/0/1",
     " ip address 192.168.2.254 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/0/2",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "router rip",
     " network 13.0.0.0",
     " network 192.168.2.0",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0/0",
      "mac": "00D0.9719.7001"
     },
     {
      "name": "GigabitEthernet0/0/1",
      "mac": "00D0.9719.7002"
     },
     {
      "name": "GigabitEthernet0/0/2",
      "mac": "00D0.9719.7003"
     }
    ]
   },
   {
    "name": "Switch0",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 660,
    "y": 69,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "00E0.F737.5701"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "00E0.F737.5702"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "00E0.F737.5703"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "00E0.F737.5704"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "00E0.F737.5705"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "00E0.F737.5706"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "00E0.F737.5707"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "00E0.F737.5708"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "00E0.F737.5709"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "00E0.F737.570A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "00E0.F737.570B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "00E0.F737.570C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "00E0.F737.570D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "00E0.F737.570E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "00E0.F737.570F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "00E0.F737.5710"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "00E0.F737.5711"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "00E0.F737.5712"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "00E0.F737.5713"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "00E0.F737.5714"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "00E0.F737.5715"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "00E0.F737.5716"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "00E0.F737.5717"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "00E0.F737.5718"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "00E0.F737.5719"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "00E0.F737.571A"
     }
    ]
   },
   {
    "name": "Switch1",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 318,
    "y": 67,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0030.A359.9B01"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0030.A359.9B02"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0030.A359.9B03"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0030.A359.9B04"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0030.A359.9B05"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0030.A359.9B06"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0030.A359.9B07"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0030.A359.9B08"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0030.A359.9B09"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0030.A359.9B0A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0030.A359.9B0B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0030.A359.9B0C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0030.A359.9B0D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0030.A359.9B0E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0030.A359.9B0F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0030.A359.9B10"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0030.A359.9B11"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0030.A359.9B12"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0030.A359.9B13"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0030.A359.9B14"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0030.A359.9B15"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0030.A359.9B16"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0030.A359.9B17"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0030.A359.9B18"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0030.A359.9B19"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "0030.A359.9B1A"
     }
    ]
   },
   {
    "name": "PC0",
    "type": "Pc",
    "model": "PC-PT",
    "x": 90,
    "y": 62,
    "mac": "0002.4A61.3077",
    "ip": "192.168.1.1",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": "192.168.1.200"
   },
   {
    "name": "PC1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 109,
    "y": 160,
    "mac": "000A.F3EE.0DEE",
    "ip": "192.168.1.2",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": "192.168.1.200"
   },
   {
    "name": "PC2",
    "type": "Pc",
    "model": "PC-PT",
    "x": 204,
    "y": 239,
    "mac": "0010.111A.C2B0",
    "ip": "192.168.1.3",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": "192.168.1.200"
   },
   {
    "name": "WEB1",
    "type": "Server",
    "model": "Server-PT",
    "x": 1110,
    "y": 41,
    "mac": "0090.2BC9.B3B6",
    "ip": "192.168.2.10",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.2.254",
    "dns": "",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.2.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.2.0",
        "end": "192.168.2.254",
        "max": 255,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "Switch2",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 990,
    "y": 65,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0004.9AD9.1601"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0004.9AD9.1602"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0004.9AD9.1603"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0004.9AD9.1604"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0004.9AD9.1605"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0004.9AD9.1606"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0004.9AD9.1607"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0004.9AD9.1608"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0004.9AD9.1609"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0004.9AD9.160A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0004.9AD9.160B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0004.9AD9.160C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0004.9AD9.160D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0004.9AD9.160E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0004.9AD9.160F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0004.9AD9.1610"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0004.9AD9.1611"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0004.9AD9.1612"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0004.9AD9.1613"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0004.9AD9.1614"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0004.9AD9.1615"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0004.9AD9.1616"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0004.9AD9.1617"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0004.9AD9.1618"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0004.9AD9.1619"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "0004.9AD9.161A"
     }
    ]
   },
   {
    "name": "DNS",
    "type": "Server",
    "model": "Server-PT",
    "x": 328,
    "y": 198,
    "mac": "0001.4252.E783",
    "ip": "192.168.1.200",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": "192.168.1.200",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.1.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.1.0",
        "end": "192.168.1.254",
        "max": 255,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": true,
      "records": [
       {
        "name": "www.imt.local",
        "type": "A",
        "value": "13.1.1.2"
       }
      ]
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "XNET",
    "type": "Server",
    "model": "Server-PT",
    "x": 406,
    "y": 199,
    "mac": "0002.17B2.AE04",
    "ip": "192.168.1.100",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": "192.168.1.200",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.1.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.1.0",
        "end": "192.168.1.254",
        "max": 255,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "PC3",
    "type": "Pc",
    "model": "PC-PT",
    "x": 926,
    "y": 168,
    "mac": "0006.2A9E.4DDB",
    "ip": "",
    "mask": "",
    "dhcp": false,
    "v6auto": false,
    "gw": "",
    "dns": ""
   },
   {
    "name": "WEB2",
    "type": "Server",
    "model": "Server-PT",
    "x": 1112,
    "y": 163,
    "mac": "0030.F291.2EAC",
    "ip": "192.168.2.11",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.2.254",
    "dns": "192.168.1.200",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.2.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.2.0",
        "end": "192.168.2.254",
        "max": 255,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "Server4",
    "type": "Server",
    "model": "Server-PT",
    "x": 992,
    "y": 149,
    "mac": "0003.E48D.D0B5",
    "ip": "",
    "mask": "",
    "dhcp": false,
    "v6auto": false,
    "gw": "",
    "dns": "",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "0.0.0.0",
        "mask": "0.0.0.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "0.0.0.0",
        "end": "0.0.2.0",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   }
  ],
  "links": [
   [
    "PC0",
    "FastEthernet0",
    "Switch1",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "PC1",
    "FastEthernet0",
    "Switch1",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "PC2",
    "FastEthernet0",
    "Switch1",
    "FastEthernet0/3",
    "straight"
   ],
   [
    "Switch1",
    "FastEthernet0/4",
    "Router0",
    "GigabitEthernet0/0/0",
    "straight"
   ],
   [
    "Router0",
    "GigabitEthernet0/0/1",
    "Switch0",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "Switch0",
    "FastEthernet0/2",
    "Router1",
    "GigabitEthernet0/0/0",
    "straight"
   ],
   [
    "Router1",
    "GigabitEthernet0/0/1",
    "Switch2",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "Switch2",
    "FastEthernet0/2",
    "WEB1",
    "FastEthernet0",
    "straight"
   ],
   [
    "DNS",
    "FastEthernet0",
    "Switch1",
    "FastEthernet0/5",
    "straight"
   ],
   [
    "Switch1",
    "FastEthernet0/6",
    "XNET",
    "FastEthernet0",
    "straight"
   ],
   [
    "Switch2",
    "FastEthernet0/3",
    "WEB2",
    "FastEthernet0",
    "straight"
   ]
  ],
  "notes": [
   {
    "x": 471,
    "y": 402,
    "text": "Objectif 2 : Transférer tous les paquets destinés à l’interface publique (g0/0/0/) du routeur r1 sur le port 80 vers le serveur WEB1 et les paquets adressés au port 8000 vers le serveur WEB2"
   },
   {
    "x": 981,
    "y": 271,
    "text": "SITE 2\n192.168.2.0/24"
   },
   {
    "x": 319,
    "y": 279,
    "text": "SITE 1\n192.168.1.0/24"
   },
   {
    "x": 469,
    "y": 372,
    "text": "Objectif1 : translater toutes les adresses du site interne (bleu) dans l'adresse publique du routeur : router0"
   }
  ],
  "shapes": [
   {
    "k": "rect",
    "x1": 830,
    "y1": -11,
    "x2": 1267,
    "y2": 294,
    "rgb": [
     255,
     255,
     0
    ],
    "fill": true,
    "line": "#000000"
   },
   {
    "k": "rect",
    "x1": 63,
    "y1": 34,
    "x2": 504,
    "y2": 339,
    "rgb": [
     0,
     85,
     255
    ],
    "fill": true,
    "line": "#000000"
   },
   {
    "k": "ellipse",
    "x1": 523,
    "y1": 22,
    "x2": 799,
    "y2": 137,
    "rgb": [
     255,
     85,
     0
    ],
    "fill": true,
    "line": "#000000"
   }
  ],
  "file": "NAT-PAT-depart.pkt"
 },
 "IPv6-Depart": {
  "version": "6.2.0.0052",
  "devices": [
   {
    "name": "R2",
    "type": "Router",
    "model": "1841",
    "x": 484,
    "y": 151,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname R2",
     "spanning-tree mode pvst",
     "interface FastEthernet0/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface FastEthernet0/1",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "0040.0B5C.0001"
     },
     {
      "name": "FastEthernet0/1",
      "mac": "0040.0B5C.0002"
     }
    ]
   },
   {
    "name": "R1",
    "type": "Router",
    "model": "2811",
    "x": 222,
    "y": 148,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname R1",
     "spanning-tree mode pvst",
     "interface FastEthernet0/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface FastEthernet0/1",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface FastEthernet1/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/0",
      "mac": "00E0.B0EA.A601"
     },
     {
      "name": "FastEthernet0/1",
      "mac": "00E0.B0EA.A602"
     },
     {
      "name": "FastEthernet1/0",
      "mac": "00D0.588D.030C"
     }
    ]
   },
   {
    "name": "PC1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 134,
    "y": 256,
    "mac": "0060.5C47.44EC",
    "ip": "",
    "mask": "",
    "dhcp": false,
    "v6auto": false,
    "gw": "",
    "dns": ""
   },
   {
    "name": "PC2",
    "type": "Pc",
    "model": "PC-PT",
    "x": 328,
    "y": 273,
    "mac": "0004.9AD4.1A78",
    "ip": "",
    "mask": "",
    "dhcp": false,
    "v6auto": false,
    "gw": "",
    "dns": ""
   },
   {
    "name": "PC0",
    "type": "Pc",
    "model": "PC-PT",
    "x": 684,
    "y": 161,
    "mac": "0001.C9ED.EDC2",
    "ip": "",
    "mask": "",
    "dhcp": false,
    "v6auto": false,
    "gw": "",
    "dns": ""
   }
  ],
  "links": [
   [
    "R1",
    "FastEthernet0/0",
    "R2",
    "FastEthernet0/0",
    "cross"
   ],
   [
    "PC1",
    "FastEthernet0",
    "R1",
    "FastEthernet0/1",
    "cross"
   ],
   [
    "PC2",
    "FastEthernet0",
    "R1",
    "FastEthernet1/0",
    "cross"
   ],
   [
    "PC0",
    "FastEthernet0",
    "R2",
    "FastEthernet0/1",
    "cross"
   ]
  ],
  "notes": [
   {
    "x": 187,
    "y": 111,
    "text": "Routeur R1"
   }
  ],
  "shapes": [],
  "file": "Pratique-IPv6-DHCPv6-01-Depart.pkt"
 },
 "SC1": {
  "version": "9.0.0.0810",
  "devices": [
   {
    "name": "ETAGE2",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 1022,
    "y": 75,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0001.6401.6001"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0001.6401.6002"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0001.6401.6003"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0001.6401.6004"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0001.6401.6005"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0001.6401.6006"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0001.6401.6007"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0001.6401.6008"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0001.6401.6009"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0001.6401.600A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0001.6401.600B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0001.6401.600C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0001.6401.600D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0001.6401.600E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0001.6401.600F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0001.6401.6010"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0001.6401.6011"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0001.6401.6012"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0001.6401.6013"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0001.6401.6014"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0001.6401.6015"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0001.6401.6016"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0001.6401.6017"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0001.6401.6018"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0001.6401.6019"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "0001.6401.601A"
     }
    ]
   },
   {
    "name": "ETAGE1",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 1012,
    "y": 288,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0030.F27A.5A01"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0030.F27A.5A02"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0030.F27A.5A03"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0030.F27A.5A04"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0030.F27A.5A05"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0030.F27A.5A06"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0030.F27A.5A07"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0030.F27A.5A08"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0030.F27A.5A09"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0030.F27A.5A0A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0030.F27A.5A0B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0030.F27A.5A0C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0030.F27A.5A0D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0030.F27A.5A0E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0030.F27A.5A0F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0030.F27A.5A10"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0030.F27A.5A11"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0030.F27A.5A12"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0030.F27A.5A13"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0030.F27A.5A14"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0030.F27A.5A15"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0030.F27A.5A16"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0030.F27A.5A17"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0030.F27A.5A18"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0030.F27A.5A19"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "0030.F27A.5A1A"
     }
    ]
   },
   {
    "name": "BACKBONE",
    "type": "Switch",
    "model": "Switch-PT-Empty",
    "x": 1232,
    "y": 436,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet1/1",
     "interface GigabitEthernet2/1",
     "interface GigabitEthernet3/1",
     "interface GigabitEthernet4/1",
     "interface GigabitEthernet5/1",
     "interface GigabitEthernet6/1",
     "interface GigabitEthernet7/1",
     "interface GigabitEthernet8/1",
     "interface GigabitEthernet9/1",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/1",
      "mac": "000D.BD87.02AC"
     },
     {
      "name": "GigabitEthernet1/1",
      "mac": "00E0.F9A7.0D51"
     },
     {
      "name": "GigabitEthernet2/1",
      "mac": "0090.2BBD.0C0A"
     },
     {
      "name": "GigabitEthernet3/1",
      "mac": "00E0.A3BC.EA32"
     },
     {
      "name": "GigabitEthernet4/1",
      "mac": "0007.EC43.B979"
     },
     {
      "name": "GigabitEthernet5/1",
      "mac": "00E0.8FDE.5E96"
     },
     {
      "name": "GigabitEthernet6/1",
      "mac": "0060.4768.21E5"
     },
     {
      "name": "GigabitEthernet7/1",
      "mac": "0060.3E3D.BDD5"
     },
     {
      "name": "GigabitEthernet8/1",
      "mac": "0001.C720.3A1C"
     },
     {
      "name": "GigabitEthernet9/1",
      "mac": "0090.0CDC.6EA0"
     }
    ]
   },
   {
    "name": "DHCP",
    "type": "Server",
    "model": "Server-PT",
    "x": 1062,
    "y": 595,
    "mac": "00E0.F936.3480",
    "ip": "192.168.1.1",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": "192.168.1.2",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.1.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.1.0",
        "end": "192.168.2.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "DNS",
    "type": "Server",
    "model": "Server-PT",
    "x": 1170,
    "y": 583,
    "mac": "000A.F3E3.DAA6",
    "ip": "192.168.1.2",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": "192.168.1.2",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.1.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.1.0",
        "end": "192.168.2.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "ACTIVEDIR",
    "type": "Server",
    "model": "Server-PT",
    "x": 1382,
    "y": 581,
    "mac": "00D0.580B.2D75",
    "ip": "192.168.1.3",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": "192.168.1.2",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.1.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.1.0",
        "end": "192.168.2.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "SGBD",
    "type": "Server",
    "model": "Server-PT",
    "x": 1300,
    "y": 576,
    "mac": "0001.63CE.DBE0",
    "ip": "192.168.1.4",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": "192.168.1.2",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.1.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.1.0",
        "end": "192.168.2.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "SW-Opspc",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 624,
    "y": 70,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0001.6301.118A"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0000.0C38.3D49"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "00E0.B02D.A136"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "00D0.D308.9787"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "00D0.FFAB.D312"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0060.5C7C.74B2"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0060.3E0E.1D82"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0090.2119.CD52"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "000A.F39B.1A31"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "00E0.B058.4E53"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0090.21EB.1DA7"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "00D0.5850.AE8C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "000B.BEC8.92A2"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0030.F231.036C"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "000B.BEDD.A139"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0001.96BA.22B3"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0002.16EA.1796"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0001.9681.38E0"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0000.0CD1.B0A6"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0060.476B.4C17"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0060.2F79.53E8"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "000C.CF91.3239"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0002.17BE.7E15"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "000A.4133.BBEC"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "00E0.8F3B.35C3"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "00D0.9794.051C"
     }
    ]
   },
   {
    "name": "Internet",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 214,
    "y": 414,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0060.70A4.B901"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0060.70A4.B902"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0060.70A4.B903"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0060.70A4.B904"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0060.70A4.B905"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0060.70A4.B906"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0060.70A4.B907"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0060.70A4.B908"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0060.70A4.B909"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0060.70A4.B90A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0060.70A4.B90B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0060.70A4.B90C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0060.70A4.B90D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0060.70A4.B90E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0060.70A4.B90F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0060.70A4.B910"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0060.70A4.B911"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0060.70A4.B912"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0060.70A4.B913"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0060.70A4.B914"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0060.70A4.B915"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0060.70A4.B916"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0060.70A4.B917"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0060.70A4.B918"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0060.70A4.B919"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "0060.70A4.B91A"
     }
    ]
   },
   {
    "name": "PC0",
    "type": "Pc",
    "model": "PC-PT",
    "x": 121,
    "y": 544,
    "mac": "0005.5EC9.9A98",
    "ip": "13.1.1.10",
    "mask": "255.0.0.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "13.1.1.1",
    "dns": ""
   },
   {
    "name": "Server1",
    "type": "Server",
    "model": "Server-PT",
    "x": 90,
    "y": 356,
    "mac": "0001.C972.CE97",
    "ip": "13.1.1.100",
    "mask": "255.0.0.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "13.1.1.1",
    "dns": "",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "13.0.0.0",
        "mask": "255.0.0.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "13.0.0.0",
        "end": "13.0.1.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "Router0",
    "type": "Router",
    "model": "1941",
    "x": 430,
    "y": 415,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface GigabitEthernet0/0",
     " ip address 13.1.1.1 255.0.0.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/1",
     " ip address 1.1.1.1 255.0.0.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0",
      "mac": "0002.17B3.9401"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0002.17B3.9402"
     }
    ]
   },
   {
    "name": "R_INTERNE",
    "type": "Router",
    "model": "1941",
    "x": 850,
    "y": 424,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface GigabitEthernet0/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/1",
     " ip address 1.1.1.2 255.0.0.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0",
      "mac": "0001.C72E.8101"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0001.C72E.8102"
     }
    ]
   }
  ],
  "links": [
   [
    "DHCP",
    "FastEthernet0",
    "BACKBONE",
    "GigabitEthernet0/1",
    "straight"
   ],
   [
    "DNS",
    "FastEthernet0",
    "BACKBONE",
    "GigabitEthernet1/1",
    "straight"
   ],
   [
    "SGBD",
    "FastEthernet0",
    "BACKBONE",
    "GigabitEthernet2/1",
    "straight"
   ],
   [
    "ACTIVEDIR",
    "FastEthernet0",
    "BACKBONE",
    "GigabitEthernet3/1",
    "straight"
   ],
   [
    "PC0",
    "FastEthernet0",
    "Internet",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "Server1",
    "FastEthernet0",
    "Internet",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "Router0",
    "GigabitEthernet0/0",
    "Internet",
    "GigabitEthernet0/1",
    "straight"
   ],
   [
    "Router0",
    "GigabitEthernet0/1",
    "R_INTERNE",
    "GigabitEthernet0/1",
    "cross"
   ],
   [
    "R_INTERNE",
    "GigabitEthernet0/0",
    "BACKBONE",
    "GigabitEthernet9/1",
    "straight"
   ]
  ],
  "notes": [],
  "shapes": [],
  "file": "SC1.pkt"
 },
 "SC1-Cowork": {
  "version": "9.0.1.0858",
  "devices": [
   {
    "name": "ETAGE2",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 1022,
    "y": 75,
    "vlans": [
     [
      1,
      "default"
     ],
     [
      10,
      "DEVELOPPEMENT"
     ],
     [
      20,
      "ADMINISTRATION"
     ],
     [
      30,
      "PRODUCTION"
     ]
    ],
    "config": [
     "hostname ETAGE2",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     " switchport access vlan 10",
     " switchport mode access",
     "interface FastEthernet0/2",
     " switchport access vlan 10",
     " switchport mode access",
     "interface FastEthernet0/3",
     " switchport access vlan 10",
     " switchport mode access",
     "interface FastEthernet0/4",
     " switchport access vlan 10",
     " switchport mode access",
     "interface FastEthernet0/5",
     " switchport access vlan 20",
     " switchport mode access",
     "interface FastEthernet0/6",
     " switchport access vlan 20",
     " switchport mode access",
     "interface FastEthernet0/7",
     " switchport access vlan 20",
     " switchport mode access",
     "interface FastEthernet0/8",
     " switchport access vlan 20",
     " switchport mode access",
     "interface FastEthernet0/9",
     " switchport access vlan 30",
     " switchport mode access",
     "interface FastEthernet0/10",
     " switchport access vlan 30",
     " switchport mode access",
     "interface FastEthernet0/11",
     " switchport access vlan 30",
     " switchport mode access",
     "interface FastEthernet0/12",
     " switchport access vlan 30",
     " switchport mode access",
     "interface FastEthernet0/13",
     " switchport access vlan 30",
     " switchport mode access",
     "interface FastEthernet0/14",
     " switchport access vlan 30",
     " switchport mode access",
     "interface FastEthernet0/15",
     " switchport access vlan 30",
     " switchport mode access",
     "interface FastEthernet0/16",
     " switchport access vlan 30",
     " switchport mode access",
     "interface FastEthernet0/17",
     " switchport access vlan 30",
     " switchport mode access",
     "interface FastEthernet0/18",
     " switchport access vlan 30",
     " switchport mode access",
     "interface FastEthernet0/19",
     " switchport access vlan 30",
     " switchport mode access",
     "interface FastEthernet0/20",
     " switchport access vlan 30",
     " switchport mode access",
     "interface FastEthernet0/21",
     " switchport access vlan 30",
     " switchport mode access",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     " switchport mode trunk",
     "interface GigabitEthernet0/2",
     " switchport mode trunk",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0001.6401.6001"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0001.6401.6002"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0001.6401.6003"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0001.6401.6004"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0001.6401.6005"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0001.6401.6006"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0001.6401.6007"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0001.6401.6008"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0001.6401.6009"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0001.6401.600A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0001.6401.600B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0001.6401.600C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0001.6401.600D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0001.6401.600E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0001.6401.600F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0001.6401.6010"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0001.6401.6011"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0001.6401.6012"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0001.6401.6013"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0001.6401.6014"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0001.6401.6015"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0001.6401.6016"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0001.6401.6017"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0001.6401.6018"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0001.6401.6019"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "0001.6401.601A"
     }
    ]
   },
   {
    "name": "ETAGE1",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 1012,
    "y": 288,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0030.F27A.5A01"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0030.F27A.5A02"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0030.F27A.5A03"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0030.F27A.5A04"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0030.F27A.5A05"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0030.F27A.5A06"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0030.F27A.5A07"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0030.F27A.5A08"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0030.F27A.5A09"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0030.F27A.5A0A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0030.F27A.5A0B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0030.F27A.5A0C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0030.F27A.5A0D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0030.F27A.5A0E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0030.F27A.5A0F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0030.F27A.5A10"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0030.F27A.5A11"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0030.F27A.5A12"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0030.F27A.5A13"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0030.F27A.5A14"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0030.F27A.5A15"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0030.F27A.5A16"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0030.F27A.5A17"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0030.F27A.5A18"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0030.F27A.5A19"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "0030.F27A.5A1A"
     }
    ]
   },
   {
    "name": "BACKBONE",
    "type": "Switch",
    "model": "Switch-PT-Empty",
    "x": 1232,
    "y": 436,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet1/1",
     "interface GigabitEthernet2/1",
     "interface GigabitEthernet3/1",
     "interface GigabitEthernet4/1",
     "interface GigabitEthernet5/1",
     "interface GigabitEthernet6/1",
     "interface GigabitEthernet7/1",
     "interface GigabitEthernet8/1",
     "interface GigabitEthernet9/1",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/1",
      "mac": "000D.BD87.02AC"
     },
     {
      "name": "GigabitEthernet1/1",
      "mac": "00E0.F9A7.0D51"
     },
     {
      "name": "GigabitEthernet2/1",
      "mac": "0090.2BBD.0C0A"
     },
     {
      "name": "GigabitEthernet3/1",
      "mac": "00E0.A3BC.EA32"
     },
     {
      "name": "GigabitEthernet4/1",
      "mac": "0007.EC43.B979"
     },
     {
      "name": "GigabitEthernet5/1",
      "mac": "00E0.8FDE.5E96"
     },
     {
      "name": "GigabitEthernet6/1",
      "mac": "0060.4768.21E5"
     },
     {
      "name": "GigabitEthernet7/1",
      "mac": "0060.3E3D.BDD5"
     },
     {
      "name": "GigabitEthernet8/1",
      "mac": "0001.C720.3A1C"
     },
     {
      "name": "GigabitEthernet9/1",
      "mac": "0090.0CDC.6EA0"
     }
    ]
   },
   {
    "name": "DHCP",
    "type": "Server",
    "model": "Server-PT",
    "x": 1062,
    "y": 595,
    "mac": "00E0.F936.3480",
    "ip": "192.168.1.1",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": "192.168.1.2",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.1.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.1.0",
        "end": "192.168.2.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "DNS",
    "type": "Server",
    "model": "Server-PT",
    "x": 1170,
    "y": 583,
    "mac": "000A.F3E3.DAA6",
    "ip": "192.168.1.2",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": "192.168.1.2",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.1.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.1.0",
        "end": "192.168.2.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "ACTIVEDIR",
    "type": "Server",
    "model": "Server-PT",
    "x": 1382,
    "y": 581,
    "mac": "00D0.580B.2D75",
    "ip": "192.168.1.3",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": "192.168.1.2",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.1.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.1.0",
        "end": "192.168.2.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "SGBD",
    "type": "Server",
    "model": "Server-PT",
    "x": 1300,
    "y": 576,
    "mac": "0001.63CE.DBE0",
    "ip": "192.168.1.4",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.254",
    "dns": "192.168.1.2",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.1.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.1.0",
        "end": "192.168.2.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "SW-Opspc",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 624,
    "y": 70,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0001.6301.118A"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0000.0C38.3D49"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "00E0.B02D.A136"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "00D0.D308.9787"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "00D0.FFAB.D312"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0060.5C7C.74B2"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0060.3E0E.1D82"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0090.2119.CD52"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "000A.F39B.1A31"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "00E0.B058.4E53"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0090.21EB.1DA7"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "00D0.5850.AE8C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "000B.BEC8.92A2"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0030.F231.036C"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "000B.BEDD.A139"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0001.96BA.22B3"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0002.16EA.1796"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0001.9681.38E0"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0000.0CD1.B0A6"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0060.476B.4C17"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0060.2F79.53E8"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "000C.CF91.3239"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0002.17BE.7E15"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "000A.4133.BBEC"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "00E0.8F3B.35C3"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "00D0.9794.051C"
     }
    ]
   },
   {
    "name": "Internet",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 214,
    "y": 414,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0060.70A4.B901"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0060.70A4.B902"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0060.70A4.B903"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0060.70A4.B904"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0060.70A4.B905"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0060.70A4.B906"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0060.70A4.B907"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0060.70A4.B908"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0060.70A4.B909"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0060.70A4.B90A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0060.70A4.B90B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0060.70A4.B90C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0060.70A4.B90D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0060.70A4.B90E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0060.70A4.B90F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0060.70A4.B910"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0060.70A4.B911"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0060.70A4.B912"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0060.70A4.B913"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0060.70A4.B914"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0060.70A4.B915"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0060.70A4.B916"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0060.70A4.B917"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0060.70A4.B918"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0060.70A4.B919"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "0060.70A4.B91A"
     }
    ]
   },
   {
    "name": "PC0",
    "type": "Pc",
    "model": "PC-PT",
    "x": 119,
    "y": 544,
    "mac": "0005.5EC9.9A98",
    "ip": "13.1.1.10",
    "mask": "255.0.0.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "13.1.1.1",
    "dns": ""
   },
   {
    "name": "Server1",
    "type": "Server",
    "model": "Server-PT",
    "x": 90,
    "y": 356,
    "mac": "0001.C972.CE97",
    "ip": "13.1.1.100",
    "mask": "255.0.0.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "13.1.1.1",
    "dns": "",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "13.0.0.0",
        "mask": "255.0.0.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "13.0.0.0",
        "end": "13.0.1.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "Router0",
    "type": "Router",
    "model": "1941",
    "x": 430,
    "y": 415,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface GigabitEthernet0/0",
     " ip address 13.1.1.1 255.0.0.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/1",
     " ip address 1.1.1.1 255.0.0.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0",
      "mac": "0002.17B3.9401"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0002.17B3.9402"
     }
    ]
   },
   {
    "name": "R_INTERNE",
    "type": "Router",
    "model": "1941",
    "x": 850,
    "y": 424,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface GigabitEthernet0/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/1",
     " ip address 1.1.1.2 255.0.0.0",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0",
      "mac": "0001.C72E.8101"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0001.C72E.8102"
     }
    ]
   },
   {
    "name": "D1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 274,
    "y": 793,
    "mac": "0000.0CE8.CB77",
    "ip": "192.168.10.1",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.10.254",
    "dns": ""
   },
   {
    "name": "D4",
    "type": "Pc",
    "model": "PC-PT",
    "x": 458,
    "y": 793,
    "mac": "00E0.B0D6.2866",
    "ip": "192.168.10.2",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.10.254",
    "dns": ""
   },
   {
    "name": "A1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 642,
    "y": 793,
    "mac": "0090.211C.E5B8",
    "ip": "192.168.20.1",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.20.254",
    "dns": ""
   },
   {
    "name": "A3",
    "type": "Pc",
    "model": "PC-PT",
    "x": 827,
    "y": 793,
    "mac": "00E0.F9E0.CC26",
    "ip": "192.168.20.2",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.20.254",
    "dns": ""
   },
   {
    "name": "P1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 1011,
    "y": 793,
    "mac": "0060.708D.0B2A",
    "ip": "192.168.30.1",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.30.254",
    "dns": ""
   },
   {
    "name": "P13",
    "type": "Pc",
    "model": "PC-PT",
    "x": 1195,
    "y": 793,
    "mac": "0060.3E67.9379",
    "ip": "192.168.30.2",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.30.254",
    "dns": ""
   }
  ],
  "links": [
   [
    "DHCP",
    "FastEthernet0",
    "BACKBONE",
    "GigabitEthernet0/1",
    "straight"
   ],
   [
    "DNS",
    "FastEthernet0",
    "BACKBONE",
    "GigabitEthernet1/1",
    "straight"
   ],
   [
    "SGBD",
    "FastEthernet0",
    "BACKBONE",
    "GigabitEthernet2/1",
    "straight"
   ],
   [
    "ACTIVEDIR",
    "FastEthernet0",
    "BACKBONE",
    "GigabitEthernet3/1",
    "straight"
   ],
   [
    "PC0",
    "FastEthernet0",
    "Internet",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "Server1",
    "FastEthernet0",
    "Internet",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "Router0",
    "GigabitEthernet0/0",
    "Internet",
    "GigabitEthernet0/1",
    "straight"
   ],
   [
    "Router0",
    "GigabitEthernet0/1",
    "R_INTERNE",
    "GigabitEthernet0/1",
    "cross"
   ],
   [
    "R_INTERNE",
    "GigabitEthernet0/0",
    "BACKBONE",
    "GigabitEthernet9/1",
    "straight"
   ],
   [
    "D1",
    "FastEthernet0",
    "ETAGE2",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "D4",
    "FastEthernet0",
    "ETAGE2",
    "FastEthernet0/4",
    "straight"
   ],
   [
    "A1",
    "FastEthernet0",
    "ETAGE2",
    "FastEthernet0/5",
    "straight"
   ],
   [
    "A3",
    "FastEthernet0",
    "ETAGE2",
    "FastEthernet0/7",
    "straight"
   ],
   [
    "P1",
    "FastEthernet0",
    "ETAGE2",
    "FastEthernet0/9",
    "straight"
   ],
   [
    "P13",
    "FastEthernet0",
    "ETAGE2",
    "FastEthernet0/21",
    "straight"
   ]
  ],
  "notes": [],
  "shapes": [],
  "file": "SC1_Cowork.pkt"
 },
 "CORR-TP1": {
  "version": "9.0.0.0810",
  "devices": [
   {
    "name": "Sw-Bat-1",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 900,
    "y": 579,
    "vlans": [
     [
      1,
      "default"
     ],
     [
      10,
      "VLAN0010"
     ],
     [
      20,
      "DEV"
     ],
     [
      30,
      "COM"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     " switchport access vlan 20",
     "interface FastEthernet0/2",
     " switchport access vlan 20",
     "interface FastEthernet0/3",
     " switchport access vlan 20",
     "interface FastEthernet0/4",
     " switchport access vlan 20",
     "interface FastEthernet0/5",
     " switchport access vlan 20",
     "interface FastEthernet0/6",
     " switchport access vlan 20",
     "interface FastEthernet0/7",
     " switchport access vlan 20",
     "interface FastEthernet0/8",
     " switchport access vlan 20",
     "interface FastEthernet0/9",
     " switchport access vlan 10",
     "interface FastEthernet0/10",
     " switchport access vlan 10",
     "interface FastEthernet0/11",
     " switchport access vlan 10",
     "interface FastEthernet0/12",
     " switchport access vlan 10",
     "interface FastEthernet0/13",
     " switchport access vlan 30",
     "interface FastEthernet0/14",
     " switchport access vlan 30",
     "interface FastEthernet0/15",
     " switchport access vlan 20",
     "interface FastEthernet0/16",
     " switchport access vlan 20",
     "interface FastEthernet0/17",
     " switchport access vlan 10",
     "interface FastEthernet0/18",
     " switchport access vlan 10",
     "interface FastEthernet0/19",
     " switchport access vlan 10",
     "interface FastEthernet0/20",
     " switchport access vlan 10",
     "interface FastEthernet0/21",
     " switchport access vlan 10",
     "interface FastEthernet0/22",
     " switchport access vlan 10",
     "interface FastEthernet0/23",
     " switchport access vlan 30",
     "interface FastEthernet0/24",
     " switchport access vlan 30",
     "interface GigabitEthernet0/1",
     " switchport trunk allowed vlan 1-1001",
     " switchport mode trunk",
     "interface GigabitEthernet0/2",
     " switchport mode trunk",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "00E0.8F33.6A01"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "00E0.8F33.6A02"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "00E0.8F33.6A03"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "00E0.8F33.6A04"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "00E0.8F33.6A05"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "00E0.8F33.6A06"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "00E0.8F33.6A07"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "00E0.8F33.6A08"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "00E0.8F33.6A09"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "00E0.8F33.6A0A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "00E0.8F33.6A0B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "00E0.8F33.6A0C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "00E0.8F33.6A0D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "00E0.8F33.6A0E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "00E0.8F33.6A0F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "00E0.8F33.6A10"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "00E0.8F33.6A11"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "00E0.8F33.6A12"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "00E0.8F33.6A13"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "00E0.8F33.6A14"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "00E0.8F33.6A15"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "00E0.8F33.6A16"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "00E0.8F33.6A17"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "00E0.8F33.6A18"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "00E0.8F33.6A19"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "00E0.8F33.6A1A"
     }
    ]
   },
   {
    "name": "ADMIN1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 852,
    "y": 487,
    "mac": "0001.64B3.A8CA",
    "ip": "192.168.20.1",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.20.254",
    "dns": ""
   },
   {
    "name": "DEV1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 406,
    "y": 358,
    "mac": "00E0.8F9E.E336",
    "ip": "",
    "mask": "",
    "dhcp": true,
    "v6auto": true,
    "gw": "192.168.10.254",
    "dns": "192.168.20.100"
   },
   {
    "name": "SERV-INFRA",
    "type": "Server",
    "model": "Server-PT",
    "x": 834,
    "y": 647,
    "mac": "00E0.8F8A.1C07",
    "ip": "192.168.20.100",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.20.254",
    "dns": "",
    "services": {
     "dhcp": {
      "on": true,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.20.0",
        "mask": "255.255.255.0",
        "gateway": "192.168.20.254",
        "dns": "192.168.20.100",
        "start": "192.168.20.200",
        "end": "192.168.20.249",
        "max": 50,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       },
       {
        "name": "DEV",
        "network": "192.168.10.0",
        "mask": "255.255.255.0",
        "gateway": "192.168.10.254",
        "dns": "192.168.20.100",
        "start": "192.168.10.200",
        "end": "192.168.10.249",
        "max": 50,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       },
       {
        "name": "COM",
        "network": "192.168.30.0",
        "mask": "255.255.255.0",
        "gateway": "192.168.30.254",
        "dns": "192.168.20.100",
        "start": "192.168.30.200",
        "end": "192.168.30.249",
        "max": 50,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "A1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 403,
    "y": 633,
    "mac": "00E0.B0CA.6C07",
    "ip": "",
    "mask": "",
    "dhcp": true,
    "v6auto": false,
    "gw": "192.168.20.254",
    "dns": "192.168.20.100"
   },
   {
    "name": "A3",
    "type": "Pc",
    "model": "PC-PT",
    "x": 675,
    "y": 637,
    "mac": "0090.2BAE.7973",
    "ip": "",
    "mask": "",
    "dhcp": true,
    "v6auto": false,
    "gw": "192.168.20.254",
    "dns": "192.168.20.100"
   },
   {
    "name": "A2",
    "type": "Pc",
    "model": "PC-PT",
    "x": 543,
    "y": 638,
    "mac": "0090.2106.2AAC",
    "ip": "",
    "mask": "",
    "dhcp": true,
    "v6auto": false,
    "gw": "192.168.20.254",
    "dns": "192.168.20.100"
   },
   {
    "name": "Router-INTERVLAN",
    "type": "Router",
    "model": "ISR4331",
    "x": 1056,
    "y": 367,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface GigabitEthernet0/0/0",
     " no ip address",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/0/0.10",
     " encapsulation dot1Q 10",
     " ip address 192.168.10.254 255.255.255.0",
     " ip helper-address 192.168.20.100",
     "interface GigabitEthernet0/0/0.20",
     " encapsulation dot1Q 20",
     " ip address 192.168.20.254 255.255.255.0",
     "interface GigabitEthernet0/0/0.30",
     " encapsulation dot1Q 30",
     " ip address 192.168.30.254 255.255.255.0",
     " ip helper-address 192.168.20.100",
     "interface GigabitEthernet0/0/1",
     " ip address 13.1.1.1 255.0.0.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/0/2",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0/0",
      "mac": "000A.4147.6301"
     },
     {
      "name": "GigabitEthernet0/0/1",
      "mac": "000A.4147.6302"
     },
     {
      "name": "GigabitEthernet0/0/2",
      "mac": "000A.4147.6303"
     }
    ]
   },
   {
    "name": "COM1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 839,
    "y": 356,
    "mac": "0001.968B.777B",
    "ip": "",
    "mask": "",
    "dhcp": true,
    "v6auto": false,
    "gw": "192.168.30.254",
    "dns": "192.168.20.100"
   },
   {
    "name": "EXTERNE",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 1274,
    "y": 392,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0040.0B20.7201"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0040.0B20.7202"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0040.0B20.7203"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0040.0B20.7204"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0040.0B20.7205"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0040.0B20.7206"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0040.0B20.7207"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0040.0B20.7208"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0040.0B20.7209"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0040.0B20.720A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0040.0B20.720B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0040.0B20.720C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0040.0B20.720D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0040.0B20.720E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0040.0B20.720F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0040.0B20.7210"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0040.0B20.7211"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0040.0B20.7212"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0040.0B20.7213"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0040.0B20.7214"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0040.0B20.7215"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0040.0B20.7216"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0040.0B20.7217"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0040.0B20.7218"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0040.0B20.7219"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "0040.0B20.721A"
     }
    ]
   },
   {
    "name": "WEB",
    "type": "Server",
    "model": "Server-PT",
    "x": 1190,
    "y": 517,
    "mac": "00D0.FF37.C054",
    "ip": "13.1.1.2",
    "mask": "255.0.0.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "13.1.1.1",
    "dns": "",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "13.0.0.0",
        "mask": "255.0.0.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "13.0.0.0",
        "end": "13.0.1.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "Sw-Bat-2",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 204,
    "y": 581,
    "vlans": [
     [
      1,
      "default"
     ],
     [
      10,
      "VLAN0010"
     ],
     [
      20,
      "DEV"
     ],
     [
      30,
      "COM"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     " switchport access vlan 20",
     "interface FastEthernet0/2",
     " switchport access vlan 20",
     "interface FastEthernet0/3",
     " switchport access vlan 20",
     "interface FastEthernet0/4",
     " switchport access vlan 20",
     "interface FastEthernet0/5",
     " switchport access vlan 20",
     "interface FastEthernet0/6",
     " switchport access vlan 20",
     "interface FastEthernet0/7",
     " switchport access vlan 20",
     "interface FastEthernet0/8",
     " switchport access vlan 20",
     "interface FastEthernet0/9",
     " switchport access vlan 10",
     "interface FastEthernet0/10",
     " switchport access vlan 10",
     "interface FastEthernet0/11",
     " switchport access vlan 10",
     "interface FastEthernet0/12",
     " switchport access vlan 10",
     "interface FastEthernet0/13",
     " switchport access vlan 30",
     "interface FastEthernet0/14",
     " switchport access vlan 30",
     "interface FastEthernet0/15",
     " switchport access vlan 20",
     "interface FastEthernet0/16",
     " switchport access vlan 20",
     "interface FastEthernet0/17",
     " switchport access vlan 10",
     "interface FastEthernet0/18",
     " switchport access vlan 10",
     "interface FastEthernet0/19",
     " switchport access vlan 10",
     "interface FastEthernet0/20",
     " switchport access vlan 10",
     "interface FastEthernet0/21",
     " switchport access vlan 10",
     "interface FastEthernet0/22",
     " switchport access vlan 10",
     "interface FastEthernet0/23",
     " switchport access vlan 30",
     "interface FastEthernet0/24",
     " switchport access vlan 30",
     "interface GigabitEthernet0/1",
     " switchport trunk allowed vlan 1-1001",
     " switchport mode trunk",
     "interface GigabitEthernet0/2",
     " switchport mode trunk",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "000C.8570.AB7A"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0090.0CE3.19D4"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0030.A316.A018"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "00E0.B07C.C4C0"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0000.0C9C.0820"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "000C.85B0.9693"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0002.16BA.A599"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0002.179B.BA68"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "000A.411B.02CB"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "00E0.F974.B544"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "00D0.BC3E.3B63"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0060.4735.ED50"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "00E0.A375.DE90"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0030.A372.0371"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0005.5EDD.EBDA"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "00E0.B03A.9A1A"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "00E0.F979.4EC5"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0006.2AAE.3A1E"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0006.2A1C.802E"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "00E0.F7E3.BDC4"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "00E0.F98D.C7DB"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "00D0.581E.ACB7"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "00D0.FFBC.57C9"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "000B.BE06.875A"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "00E0.A3C6.4889"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "0001.C9E0.18DC"
     }
    ]
   },
   {
    "name": "A4",
    "type": "Pc",
    "model": "PC-PT",
    "x": 213,
    "y": 672,
    "mac": "0002.16B0.C3D5",
    "ip": "",
    "mask": "",
    "dhcp": true,
    "v6auto": false,
    "gw": "192.168.20.254",
    "dns": "192.168.20.100"
   },
   {
    "name": "EXT1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 1352,
    "y": 499,
    "mac": "0001.428E.0465",
    "ip": "13.1.1.3",
    "mask": "255.0.0.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "13.1.1.1",
    "dns": ""
   }
  ],
  "links": [
   [
    "ADMIN1",
    "FastEthernet0",
    "Sw-Bat-1",
    "FastEthernet0/15",
    "straight"
   ],
   [
    "DEV1",
    "FastEthernet0",
    "Sw-Bat-1",
    "FastEthernet0/17",
    "straight"
   ],
   [
    "SERV-INFRA",
    "FastEthernet0",
    "Sw-Bat-1",
    "FastEthernet0/7",
    "straight"
   ],
   [
    "A1",
    "FastEthernet0",
    "Sw-Bat-1",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "A2",
    "FastEthernet0",
    "Sw-Bat-1",
    "FastEthernet0/3",
    "straight"
   ],
   [
    "A3",
    "FastEthernet0",
    "Sw-Bat-1",
    "FastEthernet0/5",
    "straight"
   ],
   [
    "Sw-Bat-1",
    "GigabitEthernet0/1",
    "Router-INTERVLAN",
    "GigabitEthernet0/0/0",
    "straight"
   ],
   [
    "COM1",
    "FastEthernet0",
    "Sw-Bat-1",
    "FastEthernet0/23",
    "straight"
   ],
   [
    "EXTERNE",
    "FastEthernet0/1",
    "WEB",
    "FastEthernet0",
    "straight"
   ],
   [
    "EXTERNE",
    "FastEthernet0/2",
    "Router-INTERVLAN",
    "GigabitEthernet0/0/1",
    "straight"
   ],
   [
    "Sw-Bat-2",
    "GigabitEthernet0/2",
    "Sw-Bat-1",
    "GigabitEthernet0/2",
    "cross"
   ],
   [
    "A4",
    "FastEthernet0",
    "Sw-Bat-2",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "EXTERNE",
    "FastEthernet0/3",
    "EXT1",
    "FastEthernet0",
    "straight"
   ]
  ],
  "notes": [],
  "shapes": [
   {
    "k": "rect",
    "x1": 477,
    "y1": 320,
    "x2": 598,
    "y2": 707,
    "rgb": [
     0,
     0,
     0
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "rect",
    "x1": 341,
    "y1": 321,
    "x2": 916,
    "y2": 709,
    "rgb": [
     0,
     0,
     0
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "rect",
    "x1": 1157,
    "y1": 253,
    "x2": 1396,
    "y2": 676,
    "rgb": [
     0,
     0,
     0
    ],
    "fill": false,
    "line": "#000000"
   },
   {
    "k": "rect",
    "x1": 597,
    "y1": 320,
    "x2": 751,
    "y2": 708,
    "rgb": [
     0,
     0,
     0
    ],
    "fill": false,
    "line": "#000000"
   }
  ],
  "file": "CORR-TP1.pkt"
 },
 "TP-TAP": {
  "version": "9.0.0.0810",
  "devices": [
   {
    "name": "COMM-BAT1",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 298,
    "y": 340,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "no spanning-tree vlan 1",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0001.96A9.4E01"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "0001.96A9.4E02"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0001.96A9.4E03"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0001.96A9.4E04"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0001.96A9.4E05"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0001.96A9.4E06"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0001.96A9.4E07"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "0001.96A9.4E08"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0001.96A9.4E09"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "0001.96A9.4E0A"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0001.96A9.4E0B"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "0001.96A9.4E0C"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0001.96A9.4E0D"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0001.96A9.4E0E"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "0001.96A9.4E0F"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0001.96A9.4E10"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0001.96A9.4E11"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0001.96A9.4E12"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0001.96A9.4E13"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0001.96A9.4E14"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "0001.96A9.4E15"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0001.96A9.4E16"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0001.96A9.4E17"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0001.96A9.4E18"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0001.96A9.4E19"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "0001.96A9.4E1A"
     }
    ]
   },
   {
    "name": "PC-B1-1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 203,
    "y": 138,
    "mac": "0005.5E4C.DC82",
    "ip": "192.168.1.100",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.1",
    "dns": ""
   },
   {
    "name": "PC-b2-1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 1041,
    "y": 124,
    "mac": "0001.9693.658C",
    "ip": "192.168.1.200",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.1",
    "dns": ""
   },
   {
    "name": "Router0",
    "type": "Router",
    "model": "PT8200",
    "x": 1378,
    "y": 370,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Router",
     "spanning-tree mode pvst",
     "interface GigabitEthernet0/0/0",
     " ip address 192.168.1.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/0/1",
     " no ip address",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/0/2",
     " no ip address",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/0/3",
     " no ip address",
     " duplex auto",
     " speed auto",
     "interface Vlan1",
     " no ip address",
     "ip classless",
     "line con 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0/0",
      "mac": "00D0.FFB5.4D01"
     },
     {
      "name": "GigabitEthernet0/0/1",
      "mac": "00D0.FFB5.4D02"
     },
     {
      "name": "GigabitEthernet0/0/2",
      "mac": "00D0.FFB5.4D03"
     },
     {
      "name": "GigabitEthernet0/0/3",
      "mac": "00D0.FFB5.4D04"
     }
    ]
   },
   {
    "name": "SRV1",
    "type": "Server",
    "model": "Server-PT",
    "x": 1112,
    "y": 132,
    "mac": "0005.5E5A.23E5",
    "ip": "192.168.1.10",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.1.1",
    "dns": "",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.1.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.1.0",
        "end": "192.168.2.255",
        "max": 512,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": false,
      "records": []
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "COMM-BAT2",
    "type": "Switch",
    "model": "2960-24TT",
    "x": 1072,
    "y": 347,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "no spanning-tree vlan 1",
     "spanning-tree mode pvst",
     "interface FastEthernet0/1",
     "interface FastEthernet0/2",
     "interface FastEthernet0/3",
     "interface FastEthernet0/4",
     "interface FastEthernet0/5",
     "interface FastEthernet0/6",
     "interface FastEthernet0/7",
     "interface FastEthernet0/8",
     "interface FastEthernet0/9",
     "interface FastEthernet0/10",
     "interface FastEthernet0/11",
     "interface FastEthernet0/12",
     "interface FastEthernet0/13",
     "interface FastEthernet0/14",
     "interface FastEthernet0/15",
     "interface FastEthernet0/16",
     "interface FastEthernet0/17",
     "interface FastEthernet0/18",
     "interface FastEthernet0/19",
     "interface FastEthernet0/20",
     "interface FastEthernet0/21",
     "interface FastEthernet0/22",
     "interface FastEthernet0/23",
     "interface FastEthernet0/24",
     "interface GigabitEthernet0/1",
     "interface GigabitEthernet0/2",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "line con 0",
     "line vty 0 4",
     " login",
     "line vty 5 15",
     " login"
    ],
    "ifaces": [
     {
      "name": "FastEthernet0/1",
      "mac": "0009.7C7D.DD59"
     },
     {
      "name": "FastEthernet0/2",
      "mac": "00D0.BCD2.EC56"
     },
     {
      "name": "FastEthernet0/3",
      "mac": "0010.11B4.C6C3"
     },
     {
      "name": "FastEthernet0/4",
      "mac": "0001.63D6.25DC"
     },
     {
      "name": "FastEthernet0/5",
      "mac": "0001.4338.2043"
     },
     {
      "name": "FastEthernet0/6",
      "mac": "0009.7CA8.7209"
     },
     {
      "name": "FastEthernet0/7",
      "mac": "0090.0C82.07B8"
     },
     {
      "name": "FastEthernet0/8",
      "mac": "00E0.F7C8.44AC"
     },
     {
      "name": "FastEthernet0/9",
      "mac": "0007.ECD6.B9A9"
     },
     {
      "name": "FastEthernet0/10",
      "mac": "000D.BDBA.1AB2"
     },
     {
      "name": "FastEthernet0/11",
      "mac": "0006.2A8D.A167"
     },
     {
      "name": "FastEthernet0/12",
      "mac": "000C.CF69.E8C3"
     },
     {
      "name": "FastEthernet0/13",
      "mac": "0090.2B62.3286"
     },
     {
      "name": "FastEthernet0/14",
      "mac": "0001.9625.A7A6"
     },
     {
      "name": "FastEthernet0/15",
      "mac": "00D0.BA00.462E"
     },
     {
      "name": "FastEthernet0/16",
      "mac": "0003.E487.5E11"
     },
     {
      "name": "FastEthernet0/17",
      "mac": "0060.473D.7322"
     },
     {
      "name": "FastEthernet0/18",
      "mac": "0001.C783.E045"
     },
     {
      "name": "FastEthernet0/19",
      "mac": "0001.6396.A9D4"
     },
     {
      "name": "FastEthernet0/20",
      "mac": "0001.636B.8A42"
     },
     {
      "name": "FastEthernet0/21",
      "mac": "00E0.A344.D2C4"
     },
     {
      "name": "FastEthernet0/22",
      "mac": "0060.2F84.2B5D"
     },
     {
      "name": "FastEthernet0/23",
      "mac": "0000.0CAD.A04C"
     },
     {
      "name": "FastEthernet0/24",
      "mac": "0001.C751.A33C"
     },
     {
      "name": "GigabitEthernet0/1",
      "mac": "0090.2BDA.8223"
     },
     {
      "name": "GigabitEthernet0/2",
      "mac": "0001.4283.5EE1"
     }
    ]
   }
  ],
  "links": [
   [
    "PC-B1-1",
    "FastEthernet0",
    "COMM-BAT1",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "PC-b2-1",
    "FastEthernet0",
    "COMM-BAT2",
    "FastEthernet0/1",
    "straight"
   ],
   [
    "SRV1",
    "FastEthernet0",
    "COMM-BAT2",
    "FastEthernet0/2",
    "straight"
   ],
   [
    "COMM-BAT2",
    "GigabitEthernet0/1",
    "Router0",
    "GigabitEthernet0/0/0",
    "straight"
   ],
   [
    "COMM-BAT1",
    "GigabitEthernet0/2",
    "COMM-BAT2",
    "GigabitEthernet0/2",
    "cross"
   ]
  ],
  "notes": [],
  "shapes": [
   {
    "k": "rect",
    "x1": 162,
    "y1": 99,
    "x2": 391,
    "y2": 526,
    "rgb": [
     255,
     85,
     127
    ],
    "fill": true,
    "line": "#000000"
   },
   {
    "k": "rect",
    "x1": 1321,
    "y1": 513,
    "x2": 1331,
    "y2": 523,
    "rgb": [
     170,
     255,
     255
    ],
    "fill": true,
    "line": "#000000"
   },
   {
    "k": "rect",
    "x1": 989,
    "y1": 75,
    "x2": 1275,
    "y2": 522,
    "rgb": [
     170,
     255,
     255
    ],
    "fill": true,
    "line": "#000000"
   }
  ],
  "file": "TP-TAP.pkt"
 },
 "SDN-LAB1": {
  "version": "8.2.2.0400",
  "devices": [
   {
    "name": "SWL1",
    "type": "MultiLayerSwitch",
    "model": "3650-24PS",
    "x": 200,
    "y": 223,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname SWL1",
     "username cisco privilege 15 password 0 cisco123!",
     "ip ssh version 1",
     "spanning-tree mode pvst",
     "interface GigabitEthernet1/0/1",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/2",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/3",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/4",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/5",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/6",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/7",
     "interface GigabitEthernet1/0/8",
     "interface GigabitEthernet1/0/9",
     "interface GigabitEthernet1/0/10",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/11",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/12",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/13",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/14",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/15",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/16",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/17",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/18",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/19",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/20",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/21",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/22",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/23",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/24",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/1/1",
     "interface GigabitEthernet1/1/2",
     "interface GigabitEthernet1/1/3",
     "interface GigabitEthernet1/1/4",
     "interface Vlan1",
     " ip address 192.168.101.2 255.255.255.0",
     "ip default-gateway 192.168.101.1",
     "ip classless",
     "no cdp run",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login local"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet1/0/1",
      "mac": "000A.F3A2.C232"
     },
     {
      "name": "GigabitEthernet1/0/2",
      "mac": "0001.63B8.7930"
     },
     {
      "name": "GigabitEthernet1/0/3",
      "mac": "000A.410C.702B"
     },
     {
      "name": "GigabitEthernet1/0/4",
      "mac": "0000.0C70.09C2"
     },
     {
      "name": "GigabitEthernet1/0/5",
      "mac": "00D0.FF96.D207"
     },
     {
      "name": "GigabitEthernet1/0/6",
      "mac": "0090.2B34.6A5A"
     },
     {
      "name": "GigabitEthernet1/0/7",
      "mac": "00D0.581E.8287"
     },
     {
      "name": "GigabitEthernet1/0/8",
      "mac": "0030.F286.5B0A"
     },
     {
      "name": "GigabitEthernet1/0/9",
      "mac": "000C.CF89.69BB"
     },
     {
      "name": "GigabitEthernet1/0/10",
      "mac": "0060.47D8.EBD4"
     },
     {
      "name": "GigabitEthernet1/0/11",
      "mac": "0005.5E98.1519"
     },
     {
      "name": "GigabitEthernet1/0/12",
      "mac": "0001.646D.4B16"
     },
     {
      "name": "GigabitEthernet1/0/13",
      "mac": "0090.0C1E.6C9C"
     },
     {
      "name": "GigabitEthernet1/0/14",
      "mac": "0009.7C0A.061C"
     },
     {
      "name": "GigabitEthernet1/0/15",
      "mac": "0030.F242.71C1"
     },
     {
      "name": "GigabitEthernet1/0/16",
      "mac": "00D0.D384.6E9A"
     },
     {
      "name": "GigabitEthernet1/0/17",
      "mac": "0005.5EBC.B40E"
     },
     {
      "name": "GigabitEthernet1/0/18",
      "mac": "0007.EC92.7D4D"
     },
     {
      "name": "GigabitEthernet1/0/19",
      "mac": "0090.2B17.D159"
     },
     {
      "name": "GigabitEthernet1/0/20",
      "mac": "0005.5E3E.4EB1"
     },
     {
      "name": "GigabitEthernet1/0/21",
      "mac": "000A.4103.A626"
     },
     {
      "name": "GigabitEthernet1/0/22",
      "mac": "0002.4A6E.7ADC"
     },
     {
      "name": "GigabitEthernet1/0/23",
      "mac": "0002.16E8.647D"
     },
     {
      "name": "GigabitEthernet1/0/24",
      "mac": "0001.638D.D8EB"
     },
     {
      "name": "GigabitEthernet1/1/1",
      "mac": "0060.706B.23BC"
     },
     {
      "name": "GigabitEthernet1/1/2",
      "mac": "0001.431E.3558"
     },
     {
      "name": "GigabitEthernet1/1/3",
      "mac": "0004.9A26.849A"
     },
     {
      "name": "GigabitEthernet1/1/4",
      "mac": "0003.E4D7.2A2E"
     }
    ]
   },
   {
    "name": "SWR1",
    "type": "MultiLayerSwitch",
    "model": "3650-24PS",
    "x": 774,
    "y": 242,
    "vlans": [
     [
      1,
      "default"
     ],
     [
      2,
      "VLAN0002"
     ]
    ],
    "config": [
     "hostname SWR1",
     "username cisco privilege 15 password 0 cisco123!",
     "ip ssh version 1",
     "spanning-tree mode pvst",
     "interface GigabitEthernet1/0/1",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/2",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/3",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/4",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/5",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/6",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/7",
     "interface GigabitEthernet1/0/8",
     "interface GigabitEthernet1/0/9",
     "interface GigabitEthernet1/0/10",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/11",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/12",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/13",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/14",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/15",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/16",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/17",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/18",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/19",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/20",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/21",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/22",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/23",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/24",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/1/1",
     "interface GigabitEthernet1/1/2",
     "interface GigabitEthernet1/1/3",
     "interface GigabitEthernet1/1/4",
     "interface Vlan1",
     " ip address 10.0.1.2 255.255.255.0",
     "ip default-gateway 10.0.1.1",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login local"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet1/0/1",
      "mac": "0050.0F59.BC03"
     },
     {
      "name": "GigabitEthernet1/0/2",
      "mac": "0030.A366.D2CA"
     },
     {
      "name": "GigabitEthernet1/0/3",
      "mac": "0000.0C8D.7101"
     },
     {
      "name": "GigabitEthernet1/0/4",
      "mac": "0007.EC97.6458"
     },
     {
      "name": "GigabitEthernet1/0/5",
      "mac": "0060.2F75.4E61"
     },
     {
      "name": "GigabitEthernet1/0/6",
      "mac": "0005.5E57.87B7"
     },
     {
      "name": "GigabitEthernet1/0/7",
      "mac": "0009.7CB6.5132"
     },
     {
      "name": "GigabitEthernet1/0/8",
      "mac": "00E0.A3E7.9782"
     },
     {
      "name": "GigabitEthernet1/0/9",
      "mac": "0002.1797.5668"
     },
     {
      "name": "GigabitEthernet1/0/10",
      "mac": "0090.2185.3822"
     },
     {
      "name": "GigabitEthernet1/0/11",
      "mac": "0060.2FE3.E626"
     },
     {
      "name": "GigabitEthernet1/0/12",
      "mac": "000A.41E0.8868"
     },
     {
      "name": "GigabitEthernet1/0/13",
      "mac": "0003.E4D9.D5C2"
     },
     {
      "name": "GigabitEthernet1/0/14",
      "mac": "0001.C700.45D3"
     },
     {
      "name": "GigabitEthernet1/0/15",
      "mac": "0001.C975.ED5D"
     },
     {
      "name": "GigabitEthernet1/0/16",
      "mac": "0060.2F71.64E5"
     },
     {
      "name": "GigabitEthernet1/0/17",
      "mac": "00D0.D3C2.B3DA"
     },
     {
      "name": "GigabitEthernet1/0/18",
      "mac": "0009.7C30.E54B"
     },
     {
      "name": "GigabitEthernet1/0/19",
      "mac": "0001.63A3.43EC"
     },
     {
      "name": "GigabitEthernet1/0/20",
      "mac": "0030.F2BC.8861"
     },
     {
      "name": "GigabitEthernet1/0/21",
      "mac": "0009.7C2E.2E71"
     },
     {
      "name": "GigabitEthernet1/0/22",
      "mac": "000C.859C.9115"
     },
     {
      "name": "GigabitEthernet1/0/23",
      "mac": "0004.9A30.D51D"
     },
     {
      "name": "GigabitEthernet1/0/24",
      "mac": "0050.0F1D.8793"
     },
     {
      "name": "GigabitEthernet1/1/1",
      "mac": "0001.C9C1.770D"
     },
     {
      "name": "GigabitEthernet1/1/2",
      "mac": "00D0.BC70.59A1"
     },
     {
      "name": "GigabitEthernet1/1/3",
      "mac": "0030.A395.6680"
     },
     {
      "name": "GigabitEthernet1/1/4",
      "mac": "0001.43A3.1068"
     }
    ]
   },
   {
    "name": "SWL2",
    "type": "MultiLayerSwitch",
    "model": "3650-24PS",
    "x": 194,
    "y": 377,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname SWL2",
     "username cisco privilege 15 password 0 cisco123!",
     "ip ssh version 1",
     "ip domain-name example.com",
     "spanning-tree mode pvst",
     "interface GigabitEthernet1/0/1",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/2",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/3",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/4",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/5",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/6",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/7",
     "interface GigabitEthernet1/0/8",
     "interface GigabitEthernet1/0/9",
     "interface GigabitEthernet1/0/10",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/11",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/12",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/13",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/14",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/15",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/16",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/17",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/18",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/19",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/20",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/21",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/22",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/23",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/24",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/1/1",
     "interface GigabitEthernet1/1/2",
     "interface GigabitEthernet1/1/3",
     "interface GigabitEthernet1/1/4",
     "interface Vlan1",
     " ip address 192.168.102.2 255.255.255.0",
     "ip default-gateway 192.168.102.1",
     "ip classless",
     "no cdp run",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login local"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet1/0/1",
      "mac": "0004.9A59.983B"
     },
     {
      "name": "GigabitEthernet1/0/2",
      "mac": "0004.9AC0.A7AE"
     },
     {
      "name": "GigabitEthernet1/0/3",
      "mac": "0007.EC56.47D6"
     },
     {
      "name": "GigabitEthernet1/0/4",
      "mac": "0002.4A7B.6D4C"
     },
     {
      "name": "GigabitEthernet1/0/5",
      "mac": "0090.0C24.27BC"
     },
     {
      "name": "GigabitEthernet1/0/6",
      "mac": "00D0.58BC.C529"
     },
     {
      "name": "GigabitEthernet1/0/7",
      "mac": "0004.9A4D.7986"
     },
     {
      "name": "GigabitEthernet1/0/8",
      "mac": "000C.CF8E.31E6"
     },
     {
      "name": "GigabitEthernet1/0/9",
      "mac": "00E0.B02A.2740"
     },
     {
      "name": "GigabitEthernet1/0/10",
      "mac": "0060.3E08.7CD9"
     },
     {
      "name": "GigabitEthernet1/0/11",
      "mac": "0060.3E7D.5585"
     },
     {
      "name": "GigabitEthernet1/0/12",
      "mac": "0000.0C3E.1B99"
     },
     {
      "name": "GigabitEthernet1/0/13",
      "mac": "00E0.B07D.5290"
     },
     {
      "name": "GigabitEthernet1/0/14",
      "mac": "000A.F328.E272"
     },
     {
      "name": "GigabitEthernet1/0/15",
      "mac": "0002.4A4A.D253"
     },
     {
      "name": "GigabitEthernet1/0/16",
      "mac": "0001.63B5.B43A"
     },
     {
      "name": "GigabitEthernet1/0/17",
      "mac": "00D0.BC36.4E58"
     },
     {
      "name": "GigabitEthernet1/0/18",
      "mac": "0001.42CA.26D6"
     },
     {
      "name": "GigabitEthernet1/0/19",
      "mac": "0001.C754.E599"
     },
     {
      "name": "GigabitEthernet1/0/20",
      "mac": "00E0.A3B6.099A"
     },
     {
      "name": "GigabitEthernet1/0/21",
      "mac": "00E0.F7C3.00B1"
     },
     {
      "name": "GigabitEthernet1/0/22",
      "mac": "00E0.8F11.EA28"
     },
     {
      "name": "GigabitEthernet1/0/23",
      "mac": "0060.472C.DD44"
     },
     {
      "name": "GigabitEthernet1/0/24",
      "mac": "00E0.F716.6E67"
     },
     {
      "name": "GigabitEthernet1/1/1",
      "mac": "00E0.A3A9.2E6D"
     },
     {
      "name": "GigabitEthernet1/1/2",
      "mac": "0002.17B5.DDA5"
     },
     {
      "name": "GigabitEthernet1/1/3",
      "mac": "000B.BEBA.89C5"
     },
     {
      "name": "GigabitEthernet1/1/4",
      "mac": "00D0.D3A4.5A59"
     }
    ]
   },
   {
    "name": "Admin",
    "type": "Pc",
    "model": "PC-PT",
    "x": 1112,
    "y": 156,
    "mac": "000B.BE16.D6BA",
    "ip": "",
    "mask": "",
    "dhcp": true,
    "v6auto": false,
    "gw": "10.0.1.1",
    "dns": ""
   },
   {
    "name": "PC2",
    "type": "Pc",
    "model": "PC-PT",
    "x": 1114,
    "y": 377,
    "mac": "0060.700B.2BC5",
    "ip": "",
    "mask": "",
    "dhcp": true,
    "v6auto": false,
    "gw": "10.0.2.1",
    "dns": ""
   },
   {
    "name": "PC1",
    "type": "Pc",
    "model": "PC-PT",
    "x": 1114,
    "y": 238,
    "mac": "0001.9747.D29B",
    "ip": "",
    "mask": "",
    "dhcp": true,
    "v6auto": false,
    "gw": "10.0.1.1",
    "dns": ""
   },
   {
    "name": "R3",
    "type": "Router",
    "model": "ISR4331",
    "x": 589,
    "y": 311,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname R3",
     "ip dhcp excluded-address 10.0.1.1 10.0.1.128",
     "ip dhcp excluded-address 10.0.2.1 10.0.2.128",
     "ip dhcp pool LAN1",
     " network 10.0.1.0 255.255.255.0",
     " default-router 10.0.1.1",
     "ip dhcp pool LAN2",
     " network 10.0.2.0 255.255.255.0",
     " default-router 10.0.2.1",
     "username cisco privilege 15 password 0 cisco123!",
     "ip ssh version 1",
     "spanning-tree mode pvst",
     "interface GigabitEthernet0/0/0",
     " ip address 10.0.1.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/0/1",
     " ip address 10.0.2.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/0/2",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface Serial0/1/0",
     " ip address 192.168.1.1 255.255.255.0",
     " clock rate 4000000",
     "interface Serial0/1/1",
     " ip address 192.168.2.1 255.255.255.0",
     " clock rate 4000000",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "router ospf 1",
     " log-adjacency-changes",
     " network 0.0.0.0 255.255.255.255 area 0",
     "ip classless",
     "no cdp run",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login local"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0/0",
      "mac": "0002.4A87.3369"
     },
     {
      "name": "GigabitEthernet0/0/1",
      "mac": "0090.2BBC.7BC0"
     },
     {
      "name": "GigabitEthernet0/0/2",
      "mac": "0003.E487.BC1C"
     },
     {
      "name": "Serial0/1/0",
      "mac": "0004.9A0C.0653",
      "kind": "serial"
     },
     {
      "name": "Serial0/1/1",
      "mac": "0040.0B3E.D931",
      "kind": "serial"
     }
    ]
   },
   {
    "name": "R1",
    "type": "Router",
    "model": "ISR4331",
    "x": 365,
    "y": 228,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname R1",
     "username cisco privilege 15 password 0 cisco123!",
     "ip ssh version 1",
     "spanning-tree mode pvst",
     "interface GigabitEthernet0/0/0",
     " ip address 192.168.101.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/0/1",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface GigabitEthernet0/0/2",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface Serial0/1/0",
     " ip address 192.168.1.2 255.255.255.0",
     "interface Serial0/1/1",
     " no ip address",
     " clock rate 2000000",
     " shutdown",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "router ospf 1",
     " log-adjacency-changes",
     " network 0.0.0.0 255.255.255.255 area 0",
     "ip classless",
     "ip route 0.0.0.0 0.0.0.0 Serial0/1/0",
     "no cdp run",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login local"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0/0",
      "mac": "0001.C700.304D"
     },
     {
      "name": "GigabitEthernet0/0/1",
      "mac": "0009.7CB0.CC36"
     },
     {
      "name": "GigabitEthernet0/0/2",
      "mac": "00D0.58C5.DAE6"
     },
     {
      "name": "Serial0/1/0",
      "mac": "0050.0F8D.C4BC",
      "kind": "serial"
     },
     {
      "name": "Serial0/1/1",
      "mac": "0060.3E58.7CBB",
      "kind": "serial"
     }
    ]
   },
   {
    "name": "R2",
    "type": "Router",
    "model": "ISR4331",
    "x": 363,
    "y": 379,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname R2",
     "username cisco privilege 15 password 0 cisco123!",
     "ip ssh version 1",
     "ip domain-name example.com",
     "spanning-tree mode pvst",
     "interface GigabitEthernet0/0/0",
     " ip address 192.168.102.1 255.255.255.0",
     " duplex auto",
     " speed auto",
     "interface GigabitEthernet0/0/1",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface GigabitEthernet0/0/2",
     " no ip address",
     " duplex auto",
     " speed auto",
     " shutdown",
     "interface Serial0/1/0",
     " no ip address",
     " clock rate 2000000",
     " shutdown",
     "interface Serial0/1/1",
     " ip address 192.168.2.2 255.255.255.0",
     "interface Vlan1",
     " no ip address",
     " shutdown",
     "router ospf 1",
     " log-adjacency-changes",
     " network 0.0.0.0 255.255.255.255 area 0",
     "ip classless",
     "ip route 0.0.0.0 0.0.0.0 Serial0/1/1",
     "no cdp run",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login local"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet0/0/0",
      "mac": "000A.F30D.EB71"
     },
     {
      "name": "GigabitEthernet0/0/1",
      "mac": "0040.0B06.58BA"
     },
     {
      "name": "GigabitEthernet0/0/2",
      "mac": "0090.0CDB.C3CE"
     },
     {
      "name": "Serial0/1/0",
      "mac": "00D0.D370.553E",
      "kind": "serial"
     },
     {
      "name": "Serial0/1/1",
      "mac": "000B.BECD.2A59",
      "kind": "serial"
     }
    ]
   },
   {
    "name": "Example Server",
    "type": "Server",
    "model": "Server-PT",
    "x": 76,
    "y": 221,
    "mac": "000A.4113.C0B0",
    "ip": "192.168.101.100",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.101.1",
    "dns": "192.168.101.100",
    "services": {
     "dhcp": {
      "on": false,
      "pools": [
       {
        "name": "serverPool",
        "network": "192.168.101.0",
        "mask": "255.255.255.0",
        "gateway": "0.0.0.0",
        "dns": "0.0.0.0",
        "start": "192.168.101.0",
        "end": "192.168.101.254",
        "max": 255,
        "tftp": "0.0.0.0",
        "wlc": "0.0.0.0"
       }
      ]
     },
     "dns": {
      "on": true,
      "records": [
       {
        "name": "www.example.com",
        "type": "A",
        "value": "192.168.101.100"
       }
      ]
     },
     "http": {
      "on": true
     }
    }
   },
   {
    "name": "PC3",
    "type": "Pc",
    "model": "PC-PT",
    "x": 1116,
    "y": 456,
    "mac": "0050.0F6E.234D",
    "ip": "",
    "mask": "",
    "dhcp": true,
    "v6auto": false,
    "gw": "10.0.2.1",
    "dns": ""
   },
   {
    "name": "PC4",
    "type": "Pc",
    "model": "PC-PT",
    "x": 74,
    "y": 377,
    "mac": "0001.435B.5044",
    "ip": "192.168.102.3",
    "mask": "255.255.255.0",
    "dhcp": false,
    "v6auto": false,
    "gw": "192.168.102.1",
    "dns": ""
   },
   {
    "name": "SWR2",
    "type": "MultiLayerSwitch",
    "model": "3650-24PS",
    "x": 776,
    "y": 381,
    "vlans": [
     [
      1,
      "default"
     ],
     [
      2,
      "VLAN0002"
     ]
    ],
    "config": [
     "hostname SWR2",
     "username cisco privilege 15 password 0 cisco123!",
     "ip ssh version 1",
     "spanning-tree mode pvst",
     "interface GigabitEthernet1/0/1",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/2",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/3",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/4",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/5",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/6",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/7",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/8",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/9",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/10",
     " switchport mode trunk",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/11",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/12",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/13",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/14",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/15",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/16",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/17",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/18",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/19",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/20",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/21",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/22",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/23",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/0/24",
     " switchport mode access",
     " switchport nonegotiate",
     "interface GigabitEthernet1/1/1",
     "interface GigabitEthernet1/1/2",
     "interface GigabitEthernet1/1/3",
     "interface GigabitEthernet1/1/4",
     "interface Vlan1",
     " ip address 10.0.1.3 255.255.255.0",
     "ip default-gateway 10.0.1.1",
     "ip classless",
     "no cdp run",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login local"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet1/0/1",
      "mac": "0030.F239.675C"
     },
     {
      "name": "GigabitEthernet1/0/2",
      "mac": "0060.3E22.1BE0"
     },
     {
      "name": "GigabitEthernet1/0/3",
      "mac": "00E0.B0A4.52DB"
     },
     {
      "name": "GigabitEthernet1/0/4",
      "mac": "0090.0C14.7416"
     },
     {
      "name": "GigabitEthernet1/0/5",
      "mac": "000D.BD9E.24E7"
     },
     {
      "name": "GigabitEthernet1/0/6",
      "mac": "000C.8510.9268"
     },
     {
      "name": "GigabitEthernet1/0/7",
      "mac": "0002.1757.2308"
     },
     {
      "name": "GigabitEthernet1/0/8",
      "mac": "00E0.F7E8.A242"
     },
     {
      "name": "GigabitEthernet1/0/9",
      "mac": "0001.4325.E5B9"
     },
     {
      "name": "GigabitEthernet1/0/10",
      "mac": "0001.97C4.2562"
     },
     {
      "name": "GigabitEthernet1/0/11",
      "mac": "0060.70E7.AD9B"
     },
     {
      "name": "GigabitEthernet1/0/12",
      "mac": "0004.9A5C.E3CC"
     },
     {
      "name": "GigabitEthernet1/0/13",
      "mac": "0030.A3A2.2400"
     },
     {
      "name": "GigabitEthernet1/0/14",
      "mac": "0001.643E.625C"
     },
     {
      "name": "GigabitEthernet1/0/15",
      "mac": "0009.7C14.23B0"
     },
     {
      "name": "GigabitEthernet1/0/16",
      "mac": "0001.96DA.7009"
     },
     {
      "name": "GigabitEthernet1/0/17",
      "mac": "00D0.FF2B.70CE"
     },
     {
      "name": "GigabitEthernet1/0/18",
      "mac": "000A.F31C.27C5"
     },
     {
      "name": "GigabitEthernet1/0/19",
      "mac": "0000.0C26.5397"
     },
     {
      "name": "GigabitEthernet1/0/20",
      "mac": "0007.ECD1.38BA"
     },
     {
      "name": "GigabitEthernet1/0/21",
      "mac": "00D0.BA71.2B91"
     },
     {
      "name": "GigabitEthernet1/0/22",
      "mac": "00E0.F92D.B49E"
     },
     {
      "name": "GigabitEthernet1/0/23",
      "mac": "0001.9793.57EC"
     },
     {
      "name": "GigabitEthernet1/0/24",
      "mac": "0000.0CC5.CDC0"
     },
     {
      "name": "GigabitEthernet1/1/1",
      "mac": "0050.0F5C.6547"
     },
     {
      "name": "GigabitEthernet1/1/2",
      "mac": "0007.ECE1.DE73"
     },
     {
      "name": "GigabitEthernet1/1/3",
      "mac": "00D0.FFE6.7AE5"
     },
     {
      "name": "GigabitEthernet1/1/4",
      "mac": "00D0.BA6B.DE37"
     }
    ]
   },
   {
    "name": "SWR4",
    "type": "MultiLayerSwitch",
    "model": "3650-24PS",
    "x": 970,
    "y": 380,
    "vlans": [
     [
      1,
      "default"
     ],
     [
      2,
      "VLAN0002"
     ]
    ],
    "config": [
     "hostname SWR4",
     "username cisco privilege 15 password 0 cisco123!",
     "ip ssh version 1",
     "spanning-tree mode pvst",
     "interface GigabitEthernet1/0/1",
     "interface GigabitEthernet1/0/2",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/3",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/4",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/5",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/6",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/7",
     "interface GigabitEthernet1/0/8",
     "interface GigabitEthernet1/0/9",
     "interface GigabitEthernet1/0/10",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/11",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/12",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/13",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/14",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/15",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/16",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/17",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/18",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/19",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/20",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/21",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/22",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/23",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/24",
     " switchport access vlan 2",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/1/1",
     "interface GigabitEthernet1/1/2",
     "interface GigabitEthernet1/1/3",
     "interface GigabitEthernet1/1/4",
     "interface Vlan1",
     " ip address 10.0.1.5 255.255.255.0",
     "ip default-gateway 10.0.1.1",
     "ip classless",
     "no cdp run",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login local"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet1/0/1",
      "mac": "0040.0B57.B26D"
     },
     {
      "name": "GigabitEthernet1/0/2",
      "mac": "0050.0F82.352A"
     },
     {
      "name": "GigabitEthernet1/0/3",
      "mac": "0005.5E49.4272"
     },
     {
      "name": "GigabitEthernet1/0/4",
      "mac": "0001.43C6.5552"
     },
     {
      "name": "GigabitEthernet1/0/5",
      "mac": "0000.0C30.16C4"
     },
     {
      "name": "GigabitEthernet1/0/6",
      "mac": "0060.5C54.DC4D"
     },
     {
      "name": "GigabitEthernet1/0/7",
      "mac": "00D0.979D.9EA4"
     },
     {
      "name": "GigabitEthernet1/0/8",
      "mac": "0001.C777.E3B2"
     },
     {
      "name": "GigabitEthernet1/0/9",
      "mac": "0002.164A.8DE7"
     },
     {
      "name": "GigabitEthernet1/0/10",
      "mac": "0060.5C0E.A42D"
     },
     {
      "name": "GigabitEthernet1/0/11",
      "mac": "0090.0C81.E476"
     },
     {
      "name": "GigabitEthernet1/0/12",
      "mac": "0090.2144.9955"
     },
     {
      "name": "GigabitEthernet1/0/13",
      "mac": "0001.C9AB.0D82"
     },
     {
      "name": "GigabitEthernet1/0/14",
      "mac": "0060.5C7C.4282"
     },
     {
      "name": "GigabitEthernet1/0/15",
      "mac": "0002.170D.9048"
     },
     {
      "name": "GigabitEthernet1/0/16",
      "mac": "0005.5EE5.3964"
     },
     {
      "name": "GigabitEthernet1/0/17",
      "mac": "00E0.A3B5.9E73"
     },
     {
      "name": "GigabitEthernet1/0/18",
      "mac": "0060.3E12.2EB2"
     },
     {
      "name": "GigabitEthernet1/0/19",
      "mac": "0060.2FD8.D674"
     },
     {
      "name": "GigabitEthernet1/0/20",
      "mac": "0001.63D8.6D46"
     },
     {
      "name": "GigabitEthernet1/0/21",
      "mac": "0060.470C.9E7A"
     },
     {
      "name": "GigabitEthernet1/0/22",
      "mac": "0090.0CBA.EDC6"
     },
     {
      "name": "GigabitEthernet1/0/23",
      "mac": "0060.3E23.6ECB"
     },
     {
      "name": "GigabitEthernet1/0/24",
      "mac": "0001.433D.9B8B"
     },
     {
      "name": "GigabitEthernet1/1/1",
      "mac": "00E0.B000.B268"
     },
     {
      "name": "GigabitEthernet1/1/2",
      "mac": "000C.85B1.695E"
     },
     {
      "name": "GigabitEthernet1/1/3",
      "mac": "0006.2A44.9103"
     },
     {
      "name": "GigabitEthernet1/1/4",
      "mac": "00D0.580B.CABA"
     }
    ]
   },
   {
    "name": "SWR3",
    "type": "MultiLayerSwitch",
    "model": "3650-24PS",
    "x": 966,
    "y": 243,
    "vlans": [
     [
      1,
      "default"
     ],
     [
      2,
      "VLAN0002"
     ]
    ],
    "config": [
     "hostname SWR3",
     "username cisco privilege 15 password 0 cisco123!",
     "ip ssh version 1",
     "spanning-tree mode pvst",
     "interface GigabitEthernet1/0/1",
     "interface GigabitEthernet1/0/2",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/3",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/4",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/5",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/6",
     " switchport mode trunk",
     "interface GigabitEthernet1/0/7",
     "interface GigabitEthernet1/0/8",
     "interface GigabitEthernet1/0/9",
     "interface GigabitEthernet1/0/10",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/11",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/12",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/13",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/14",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/15",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/16",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/17",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/18",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/19",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/20",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/21",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/22",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/23",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/0/24",
     " switchport mode access",
     " switchport nonegotiate",
     " spanning-tree portfast",
     "interface GigabitEthernet1/1/1",
     "interface GigabitEthernet1/1/2",
     "interface GigabitEthernet1/1/3",
     "interface GigabitEthernet1/1/4",
     "interface Vlan1",
     " ip address 10.0.1.4 255.255.255.0",
     "ip default-gateway 10.0.1.1",
     "ip classless",
     "no cdp run",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login local"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet1/0/1",
      "mac": "0001.644E.9ABA"
     },
     {
      "name": "GigabitEthernet1/0/2",
      "mac": "0090.0C47.D5A4"
     },
     {
      "name": "GigabitEthernet1/0/3",
      "mac": "0050.0F53.A11C"
     },
     {
      "name": "GigabitEthernet1/0/4",
      "mac": "0090.2B04.63A8"
     },
     {
      "name": "GigabitEthernet1/0/5",
      "mac": "0060.3ECA.0CC2"
     },
     {
      "name": "GigabitEthernet1/0/6",
      "mac": "0090.2B02.E402"
     },
     {
      "name": "GigabitEthernet1/0/7",
      "mac": "00D0.BC91.BA01"
     },
     {
      "name": "GigabitEthernet1/0/8",
      "mac": "0050.0F7E.26E2"
     },
     {
      "name": "GigabitEthernet1/0/9",
      "mac": "0000.0C11.6A59"
     },
     {
      "name": "GigabitEthernet1/0/10",
      "mac": "0002.1677.9BAB"
     },
     {
      "name": "GigabitEthernet1/0/11",
      "mac": "0001.C9A6.76CE"
     },
     {
      "name": "GigabitEthernet1/0/12",
      "mac": "0001.C71A.8324"
     },
     {
      "name": "GigabitEthernet1/0/13",
      "mac": "000C.CF6B.A1D1"
     },
     {
      "name": "GigabitEthernet1/0/14",
      "mac": "0001.96C9.4DC0"
     },
     {
      "name": "GigabitEthernet1/0/15",
      "mac": "0001.96DD.5436"
     },
     {
      "name": "GigabitEthernet1/0/16",
      "mac": "0001.425E.A1CC"
     },
     {
      "name": "GigabitEthernet1/0/17",
      "mac": "0001.6468.7616"
     },
     {
      "name": "GigabitEthernet1/0/18",
      "mac": "0005.5EEB.BC38"
     },
     {
      "name": "GigabitEthernet1/0/19",
      "mac": "00E0.B09B.D9D6"
     },
     {
      "name": "GigabitEthernet1/0/20",
      "mac": "0001.C739.D518"
     },
     {
      "name": "GigabitEthernet1/0/21",
      "mac": "000C.8562.A095"
     },
     {
      "name": "GigabitEthernet1/0/22",
      "mac": "0007.EC8D.5626"
     },
     {
      "name": "GigabitEthernet1/0/23",
      "mac": "0060.2FD5.95C2"
     },
     {
      "name": "GigabitEthernet1/0/24",
      "mac": "00E0.F966.A071"
     },
     {
      "name": "GigabitEthernet1/1/1",
      "mac": "00D0.975A.2EBE"
     },
     {
      "name": "GigabitEthernet1/1/2",
      "mac": "0005.5E81.779B"
     },
     {
      "name": "GigabitEthernet1/1/3",
      "mac": "00E0.F7E1.A00A"
     },
     {
      "name": "GigabitEthernet1/1/4",
      "mac": "0001.C70B.B2A9"
     }
    ]
   },
   {
    "name": "Multilayer Switch0",
    "type": "MultiLayerSwitch",
    "model": "3650-24PS",
    "x": 494,
    "y": 579,
    "off": true,
    "vlans": [
     [
      1,
      "default"
     ]
    ],
    "config": [
     "hostname Switch",
     "spanning-tree mode pvst",
     "interface GigabitEthernet1/0/1",
     "interface GigabitEthernet1/0/2",
     "interface GigabitEthernet1/0/3",
     "interface GigabitEthernet1/0/4",
     "interface GigabitEthernet1/0/5",
     "interface GigabitEthernet1/0/6",
     "interface GigabitEthernet1/0/7",
     "interface GigabitEthernet1/0/8",
     "interface GigabitEthernet1/0/9",
     "interface GigabitEthernet1/0/10",
     "interface GigabitEthernet1/0/11",
     "interface GigabitEthernet1/0/12",
     "interface GigabitEthernet1/0/13",
     "interface GigabitEthernet1/0/14",
     "interface GigabitEthernet1/0/15",
     "interface GigabitEthernet1/0/16",
     "interface GigabitEthernet1/0/17",
     "interface GigabitEthernet1/0/18",
     "interface GigabitEthernet1/0/19",
     "interface GigabitEthernet1/0/20",
     "interface GigabitEthernet1/0/21",
     "interface GigabitEthernet1/0/22",
     "interface GigabitEthernet1/0/23",
     "interface GigabitEthernet1/0/24",
     "interface GigabitEthernet1/1/1",
     "interface GigabitEthernet1/1/2",
     "interface GigabitEthernet1/1/3",
     "interface GigabitEthernet1/1/4",
     "interface Vlan1",
     " no ip address",
     "ip classless",
     "line con 0",
     "line aux 0",
     "line vty 0 4",
     " login"
    ],
    "ifaces": [
     {
      "name": "GigabitEthernet1/0/1",
      "mac": "0004.9A65.0201"
     },
     {
      "name": "GigabitEthernet1/0/2",
      "mac": "0004.9A65.0202"
     },
     {
      "name": "GigabitEthernet1/0/3",
      "mac": "0004.9A65.0203"
     },
     {
      "name": "GigabitEthernet1/0/4",
      "mac": "0004.9A65.0204"
     },
     {
      "name": "GigabitEthernet1/0/5",
      "mac": "0004.9A65.0205"
     },
     {
      "name": "GigabitEthernet1/0/6",
      "mac": "0004.9A65.0206"
     },
     {
      "name": "GigabitEthernet1/0/7",
      "mac": "0004.9A65.0207"
     },
     {
      "name": "GigabitEthernet1/0/8",
      "mac": "0004.9A65.0208"
     },
     {
      "name": "GigabitEthernet1/0/9",
      "mac": "0004.9A65.0209"
     },
     {
      "name": "GigabitEthernet1/0/10",
      "mac": "0004.9A65.020A"
     },
     {
      "name": "GigabitEthernet1/0/11",
      "mac": "0004.9A65.020B"
     },
     {
      "name": "GigabitEthernet1/0/12",
      "mac": "0004.9A65.020C"
     },
     {
      "name": "GigabitEthernet1/0/13",
      "mac": "0004.9A65.020D"
     },
     {
      "name": "GigabitEthernet1/0/14",
      "mac": "0004.9A65.020E"
     },
     {
      "name": "GigabitEthernet1/0/15",
      "mac": "0004.9A65.020F"
     },
     {
      "name": "GigabitEthernet1/0/16",
      "mac": "0004.9A65.0210"
     },
     {
      "name": "GigabitEthernet1/0/17",
      "mac": "0004.9A65.0211"
     },
     {
      "name": "GigabitEthernet1/0/18",
      "mac": "0004.9A65.0212"
     },
     {
      "name": "GigabitEthernet1/0/19",
      "mac": "0004.9A65.0213"
     },
     {
      "name": "GigabitEthernet1/0/20",
      "mac": "0004.9A65.0214"
     },
     {
      "name": "GigabitEthernet1/0/21",
      "mac": "0004.9A65.0215"
     },
     {
      "name": "GigabitEthernet1/0/22",
      "mac": "0004.9A65.0216"
     },
     {
      "name": "GigabitEthernet1/0/23",
      "mac": "0004.9A65.0217"
     },
     {
      "name": "GigabitEthernet1/0/24",
      "mac": "0004.9A65.0218"
     },
     {
      "name": "GigabitEthernet1/1/1",
      "mac": "0001.4256.7A01"
     },
     {
      "name": "GigabitEthernet1/1/2",
      "mac": "0001.4256.7A02"
     },
     {
      "name": "GigabitEthernet1/1/3",
      "mac": "0001.4256.7A03"
     },
     {
      "name": "GigabitEthernet1/1/4",
      "mac": "0001.4256.7A04"
     }
    ]
   }
  ],
  "links": [
   [
    "R1",
    "GigabitEthernet0/0/0",
    "SWL1",
    "GigabitEthernet1/0/1",
    "straight"
   ],
   [
    "Example Server",
    "FastEthernet0",
    "SWL1",
    "GigabitEthernet1/0/3",
    "straight"
   ],
   [
    "R3",
    "GigabitEthernet0/0/0",
    "SWR1",
    "GigabitEthernet1/0/1",
    "straight"
   ],
   [
    "SWR1",
    "GigabitEthernet1/0/2",
    "SWR3",
    "GigabitEthernet1/0/2",
    "cross"
   ],
   [
    "SWR1",
    "GigabitEthernet1/0/3",
    "SWR4",
    "GigabitEthernet1/0/3",
    "cross"
   ],
   [
    "SWR1",
    "GigabitEthernet1/0/5",
    "SWR2",
    "GigabitEthernet1/0/5",
    "cross"
   ],
   [
    "R2",
    "GigabitEthernet0/0/0",
    "SWL2",
    "GigabitEthernet1/0/1",
    "straight"
   ],
   [
    "PC4",
    "FastEthernet0",
    "SWL2",
    "GigabitEthernet1/0/24",
    "straight"
   ],
   [
    "Admin",
    "FastEthernet0",
    "SWR3",
    "GigabitEthernet1/0/21",
    "straight"
   ],
   [
    "PC2",
    "FastEthernet0",
    "SWR4",
    "GigabitEthernet1/0/23",
    "straight"
   ],
   [
    "PC1",
    "FastEthernet0",
    "SWR3",
    "GigabitEthernet1/0/22",
    "straight"
   ],
   [
    "R3",
    "Serial0/1/0",
    "R1",
    "Serial0/1/0",
    "serial"
   ],
   [
    "R3",
    "Serial0/1/1",
    "R2",
    "Serial0/1/1",
    "serial"
   ],
   [
    "R3",
    "GigabitEthernet0/0/1",
    "SWR2",
    "GigabitEthernet1/0/1",
    "straight"
   ],
   [
    "PC3",
    "FastEthernet0",
    "SWR4",
    "GigabitEthernet1/0/24",
    "straight"
   ],
   [
    "SWR2",
    "GigabitEthernet1/0/2",
    "SWR4",
    "GigabitEthernet1/0/2",
    "cross"
   ],
   [
    "SWR2",
    "GigabitEthernet1/0/4",
    "SWR3",
    "GigabitEthernet1/0/4",
    "cross"
   ],
   [
    "SWR3",
    "GigabitEthernet1/0/5",
    "SWR4",
    "GigabitEthernet1/0/5",
    "cross"
   ]
  ],
  "notes": [
   {
    "x": 755,
    "y": 430,
    "text": "10.0.1.3"
   },
   {
    "x": 439,
    "y": 381,
    "text": "192.168.2.2"
   },
   {
    "x": 169,
    "y": 184,
    "text": "192.168.101.2"
   },
   {
    "x": 1153,
    "y": 457,
    "text": "10.0.2.130"
   },
   {
    "x": 422,
    "y": 225,
    "text": "192.168.1.2"
   },
   {
    "x": 28,
    "y": 334,
    "text": "192.168.102.3"
   },
   {
    "x": 945,
    "y": 201,
    "text": "10.0.1.4"
   },
   {
    "x": 743,
    "y": 203,
    "text": "10.0.1.2"
   },
   {
    "x": 622,
    "y": 257,
    "text": "10.0.1.1"
   },
   {
    "x": 1151,
    "y": 150,
    "text": "10.0.1.129"
   },
   {
    "x": 534,
    "y": 258,
    "text": "192.168.1.1"
   },
   {
    "x": 327,
    "y": 185,
    "text": "192.168.101.1"
   },
   {
    "x": 577,
    "y": 187,
    "text": "Login: cisco\nPass: cisco123!"
   },
   {
    "x": 949,
    "y": 435,
    "text": "10.0.1.5"
   },
   {
    "x": 625,
    "y": 344,
    "text": "10.0.2.1"
   },
   {
    "x": 505,
    "y": 338,
    "text": "192.168.2.1"
   },
   {
    "x": 1169,
    "y": 416,
    "text": "LAN 2"
   },
   {
    "x": 271,
    "y": 344,
    "text": "192.168.102.1"
   },
   {
    "x": 560,
    "y": 159,
    "text": "All Subnet Masks are /24"
   },
   {
    "x": 1165,
    "y": 196,
    "text": "LAN 1"
   },
   {
    "x": 23,
    "y": 277,
    "text": "192.168.101.100"
   },
   {
    "x": 152,
    "y": 334,
    "text": "192.168.102.2"
   },
   {
    "x": 1154,
    "y": 376,
    "text": "10.0.2.129"
   },
   {
    "x": 1146,
    "y": 238,
    "text": "10.0.1.130"
   }
  ],
  "shapes": [],
  "file": "SDN_Version_LAB_1.pkt"
 }
};
