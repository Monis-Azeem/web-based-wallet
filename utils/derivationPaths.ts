// In derivation paths, x will change according to number of accounts we will generate

export const derivationPaths = [
  {
    name: "Solana",
    derivationPath: `m/44'/501'/x'/0'`,
  },
  {
    name: "Ethereum",
    derivationPath: `m/44'/60'/0'/0/x`,
  },
  {
    name: "Bitcoin Native SegWit",
    derivationPath: `m/84'/0'/0'/0/x`,
  },
];