import { BinaryBackground } from "@/components/BinaryBackground";
import { BinaryBackgroundMask } from "@/components/BinaryBackgroundMask";
import { WalletComponent } from "@/components/WalletComponent";


export default function Home() {

  return (
    <div
      className="relative flex justify-center"
    >
      <WalletComponent />
      <BinaryBackground />
      <BinaryBackgroundMask />
    </div>
  );
}
