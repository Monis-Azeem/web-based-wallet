import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import nacl from "tweetnacl";
import { derivePath } from "ed25519-hd-key";
import { HDKey } from "@scure/bip32";
import * as btc from "@scure/btc-signer";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { Wallet } from "ethers";
import { WalletType } from "@/types/wallets";

type walletDerivation = {
  name: string;
  derivationPath: string;
};

// HD wallets based on BIP-39 and then used along concept of BIP-32
export function generateWallet(derivationPaths: Array<walletDerivation>, x: string, mnemonicValue?: string): Array<WalletType> {
  let arr: Array<WalletType> = [];

  console.log('Derivation Paths: ', derivationPaths)

  const mnemonic = mnemonicValue && mnemonicValue.length > 0 ? mnemonicValue : generateMnemonic(256);
  const seed = mnemonicToSeedSync(mnemonic);

  for (let i = 0; i < derivationPaths.length; i++) {
    let root, publicKey, privateKey, child, secretKey, walletAddress;

    const newDerivationPath = derivationPaths[i].derivationPath.replace('x', `${x}`)

    if (derivationPaths[i]?.name === "Ethereum") {
      root = HDKey.fromMasterSeed(seed); //master key
      child = root.derive(newDerivationPath as string);
      publicKey = Buffer.from(child.publicKey ?? []).toString("hex");
      privateKey = Buffer.from(child.privateKey ?? []).toString("hex");
      walletAddress = new Wallet(privateKey).address;
    } 
    
    else if (derivationPaths[i]?.name === "Bitcoin Native SegWit") {
      root = HDKey.fromMasterSeed(seed); //master key
      child = root.derive(newDerivationPath as string);
      publicKey = Buffer.from(child.publicKey ?? []).toString("hex");
      privateKey = btc.WIF().encode(Buffer.from(child.privateKey ?? []));
      walletAddress = btc.p2wpkh(
        Buffer.from(child.publicKey ?? []),
        btc.NETWORK,
      ).address;
    } 
    
    else if (derivationPaths[i]?.name === "Solana") {
      child = derivePath(
        newDerivationPath as string,
        seed.toString("hex"),
      ).key; //This is child private key - 32 bytes
      publicKey = bs58.encode(nacl.sign.keyPair.fromSeed(child).publicKey); //32 bytes
      secretKey = nacl.sign.keyPair.fromSeed(child).secretKey; //64 bytes - private key + publicKey
      privateKey = bs58.encode(secretKey); //This matches Phantom Solana and Metamask wallets
      walletAddress = Keypair.fromSecretKey(secretKey).publicKey.toBase58();
    }

    arr.push({
      name: derivationPaths[i]?.name,
      publicKey: publicKey ?? '',
      privateKey: privateKey ?? '',
      walletAddress: walletAddress ?? '',
    });
  }

  return arr;
}

// generateWallet(derivationPaths);
