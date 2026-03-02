import { BinaryBackground } from "@/components/BinaryBackground";
import { BinaryBackgroundMask } from "@/components/BinaryBackgroundMask";


export default function Home() {
  // const mouseRef = useRef<MouseCoordinates>({ x: 0, y: 0 });

  return (
    <div
      className="relative"
      // onMouseDown={(e: React.MouseEvent<HTMLCanvasElement>) => {
      //   const rect = e.currentTarget.getBoundingClientRect();
      //   mouseRef.current.x = e.clientX - rect.left;
      //   mouseRef.current.y = e.clientY - rect.top;

      //   //TODO: effective mouse x
      // }}
    >
      <BinaryBackground />
      <BinaryBackgroundMask />
    </div>
  );
}
