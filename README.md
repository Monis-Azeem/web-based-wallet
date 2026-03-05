# Web Based Wallet

A browser-based crypto wallet generator for Solana, Ethereum, and Bitcoin.

## Technologies

- **Next.js 16** (App Router) — React framework
- **TypeScript** — type safety
- **Tailwind CSS v4** — styling
- **shadcn/ui** — UI components
- **BIP39** — mnemonic seed phrase generation
- **@scure/bip32** — HD wallet derivation
- **ethers.js** — Ethereum wallet
- **@solana/web3.js** — Solana wallet
- **@scure/btc-signer** — Bitcoin wallet
- **simplex-noise** — smooth noise for binary rain
- **lucide-react** — icons
- **JetBrains Mono** — monospace font

## Post

[View on X →](https://x.com/MonisAzeem/status/2029513997377269923?s=20)

## Wallet Generator

Enter a seed phrase or leave it blank to generate one automatically. The app derives wallets for Solana, Ethereum, and Bitcoin from that phrase using standard BIP44 derivation paths. Each wallet shows a truncated address, public key, and private key — all copyable with one click.

## Binary Rain

The background is a full-screen HTML Canvas animation. Characters (0 and 1) are pre-rendered onto small offscreen canvases once for performance, then stamped across a grid every frame. Simplex noise drives which cells show 0 vs 1, creating smooth organic wave patterns instead of random flickering. The animation runs via `requestAnimationFrame` and handles window resize by recalculating the grid dimensions and restarting the loop.

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
