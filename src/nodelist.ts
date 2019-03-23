export interface NODE {
  host: string;
  port: number;
  ws_port: number;
  protocol: string;
}

export const MAINNET_NODE_LIST: NODE[] = [
  {
    host: "https://aqualife1.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://aqualife2.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://aqualife3.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://beny.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://happy.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://mnbhsgwbeta.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://mnbhsgwgamma.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://nemstrunk.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://nemstrunk2.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://nsm.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://kohkei.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://mttsukuba.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://pegatennnag.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://qora01.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://shibuya.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://strategic-trader-1.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://strategic-trader-2.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://thomas1.supernode.me.supernode.me",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  }
];

export const TESTNET_NODE_LIST: NODE[] = [
  {
    host: "https://nistest.ttechdev.com",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  // {
  //   host: "https://nistest.opening-line.jp",
  //   ws_port: 7779,
  //   port: 7891,
  //   protocol: "https"
  // },
  {
    host: "https://nis-testnet.44uk.net",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  },
  {
    host: "https://planethouki.ddns.net",
    ws_port: 7779,
    port: 7891,
    protocol: "https"
  }
];
