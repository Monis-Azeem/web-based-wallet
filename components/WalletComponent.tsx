"use client";

import { Wallet, Copy, Check } from "lucide-react";
import { useRef, useState } from "react";
import { Input, Button } from "@/components/ui";
import { generateWallet } from "@/wallet-generator/wallet-generator";
import { derivationPaths } from "@/utils/derivationPaths";
import type { WalletType } from "@/types/wallets";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function WalletComponent() {
  const [wallets, setWallets] = useState<Array<Array<WalletType>>>([]);
  const [copyId, setCopyId] = useState<string>('')
  const [mnemonic, setMnemonic] = useState<string>('')
  const walletRef = useRef(0);

  const handleWallet = () => {
    const wallet = generateWallet(
      derivationPaths,
      walletRef.current.toString(),
      mnemonic.length > 0 ? mnemonic : undefined
    );
    setWallets((prev) => [...prev, wallet]);
    walletRef.current = walletRef.current + 1;
  };

  const handleCopy = (text: string, id: string) => {
    setCopyId(id)
    navigator.clipboard.writeText(text)
    setTimeout(() => setCopyId(''), 1500)
  }

  return (
    <div className="max-h-screen w-[95%] lg:w-[60%] flex justify-center absolute z-2 pt-2 pb-2">
      <div className="dark bg-background w-full rounded-md flex flex-col p-6 lg:p-8 font-jet text-foreground">
        <div className="w-full gap-4 flex justify-between items-center">
          <div>
            <h2 className="tracking-tight">Wallet Generator</h2>
            <p>Web based Wallet</p> 
          </div>

          <div className="border-2 p-1 border-primary rounded-sm shadow-md shadow-primary flex justify-center items-center">
            <Wallet size={"32px"} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-8">
          <Input className="placeholder:text-xs lg:placeholder:text-base" placeholder="Enter Seed phrase or Press Generate Wallet" value={mnemonic} onChange={(e) => {
            setMnemonic(e.currentTarget.value)
          }}/>
          <Button
            className="font-semibold tracking-tight"
            onClick={handleWallet}
          >
            Generate Wallet
          </Button>
        </div>

        <div className="grid grid-cols-1 mt-8 gap-4 text-foreground overflow-y-auto">
          {wallets.map((walletArr) =>
            walletArr.map((wallet, key) => (
              <div
                key={key}
                className={cn("border border-border rounded-md p-4")}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-3">
                    <Image
                      src={
                        wallet.name === "Solana"
                          ? "/solanaLogoMark.svg"
                          : wallet.name === "Ethereum"
                            ? "/ethereumLogo.svg"
                            : "/bitcoinLogo.svg"
                      }
                      alt="Solana Logo"
                      width={"20"}
                      height={"20"}
                    />
                    <h3>{wallet.name}</h3>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p>
                      {wallet.walletAddress.slice(0, 4) +
                        "..." +
                        wallet.walletAddress.slice(-4)}
                    </p>
                    {copyId === `${wallet.walletAddress}` ? <Check size={'16px'} className="text-green-500"/> : <Copy size={"16px"} onClick={() => handleCopy(wallet.walletAddress, wallet.walletAddress)}/>}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p>
                    Public Key :{" "}
                    {wallet.publicKey.slice(0, 4) +
                      "..." +
                      wallet.publicKey.slice(-4)}
                  </p>
                  {copyId === `${wallet.publicKey}` ? <Check size={'16px'} className="text-green-500"/> : <Copy size={"16px"} onClick={() => handleCopy(wallet.publicKey, wallet.publicKey)}/>}
                </div>

                <div className="flex justify-between items-center">
                  <p>
                    Private Key :{" "}
                    {wallet.privateKey.slice(0, 4) +
                      "..." +
                      wallet.privateKey.slice(-4)}
                  </p>
                  {copyId === `${wallet.privateKey}` ? <Check size={'16px'} className="text-green-500"/> : <Copy size={"16px"} onClick={() => handleCopy(wallet.privateKey, wallet.privateKey)}/>}
                </div>
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
