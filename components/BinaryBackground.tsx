"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import type { MouseCoordinates } from "@/types/mouse";

const cellWidth = 16;
const cellHeight = 16;

export function BinaryBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const time = useRef<number>(0);
  const mouseRef = useRef<MouseCoordinates>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current; //we are accessing the below canvas(DOM) element directly and it will persist across re-renders
    const container = containerRef.current;
    const noise2D = createNoise2D();

    if (!canvas || !container) return;

    canvas.width = container.offsetWidth * 1.5; //we will draw the canvas on the visual pixel size of the screen. Let's say 1000px and screen is 2000px, then canvas will be drawn on 1000 * 1.5 = 1500 px and then shrink back down to actual screen sizes below.

    //CSS controls display size and this canvas.width controls how many pixels it draws on.
    canvas.height = container.offsetHeight * 1.5;

    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx?.scale(1.5, 1.5);

    const columns = Math.ceil(container.offsetWidth / cellWidth);
    const rows = Math.ceil(container.offsetHeight / cellHeight);

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    let animationId: number; //kick off the animation loop

    

    const isLoaded = document.fonts.check("16px FixedSys");

console.log(isLoaded); // true = ready to use

    document.fonts.load('16px "FixedSys"').then(() => {

        const canvasZero = document.createElement("canvas");
  canvasZero.width = cellWidth;
  canvasZero.height = cellHeight;

  const ctxZero = canvasZero.getContext("2d");
  if (!ctxZero) throw new Error("ctxZero does not exist");
  ctxZero.imageSmoothingEnabled = false;
  ctxZero.font = '16px "FixedSys"';
  // ctxZero.scale(1.5, 1.5)
  ctxZero.fillStyle = "white";
  ctxZero.textAlign = "center";
  ctxZero.textBaseline = "middle";
  ctxZero.fillText("0", cellWidth / 2, cellHeight / 2);

  const canvasOne = document.createElement("canvas");
  canvasOne.width = cellWidth;
  canvasOne.height = cellHeight;

  const ctxOne = canvasOne.getContext("2d");
  if (!ctxOne) throw new Error("ctxOne does not exist");

  ctxOne.imageSmoothingEnabled = false

  ctxOne.font = '16px "FixedSys"';
  // ctxOne.scale(1.5, 1.5)

  ctxOne.fillStyle = "white";
  ctxOne.textAlign = "center";
  ctxOne.textBaseline = "middle";
  ctxOne.fillText("1", cellWidth / 2, cellHeight / 2);

      const animate = () => {
        console.log("container width: ", containerWidth);
        ctx?.clearRect(0, 0, containerWidth, containerHeight);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, containerWidth, containerHeight);

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < columns; col++) {
            const noiseValue = noise2D(col * 0.12 + time.current, row * 0.12);

            //   const baseAlpha = 0.08 + Math.abs(noiseValue) * 0.18;
            //     ctx.globalAlpha = baseAlpha;

            const component = noiseValue > 0 ? canvasOne : canvasZero;
            //   ctx.setTransform(1, 0, 0, 1, 0, 0);

            ctx.drawImage(component, col * cellWidth, row * cellHeight);
            //   ctx.setTransform(1.5, 0, 0, 1.5, 0, 0);
          }
        }

        time.current = time.current + 0.003;
        animationId = requestAnimationFrame(animate);
      };

      animate();
    }).catch((err) => {
        console.error('Error: ', err)
    });

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      className="w-full min-h-screen absolute inset-0 z-0 pixel-text"
      ref={containerRef}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseMove={(e: React.MouseEvent<HTMLCanvasElement>) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mouseRef.current.x = e.clientX - rect.left;
          mouseRef.current.y = e.clientY - rect.top;

          //TODO: effective mouse x
        }}
      ></canvas>
    </div>
  );
}

// function CanvasZero({ref} : {ref: React.Ref<HTMLCanvasElement>}) {
// //   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     if(!ref || typeof ref === "function") return;

//     const canvas = ref.current;
//     if (!canvas) return;

//     const ctxZero = canvas.getContext("2d");
//     if (!ctxZero) return;

//     ctxZero.font = "12px Geist";
//     ctxZero.fillStyle = "white";
//     ctxZero.textAlign = "center";
//     ctxZero.textBaseline = "middle";
//     ctxZero.fillText("0", 0, 0);
//   }, []);
//   return (
//     <canvas
//       className="text-center"
//       style={{ width: cellWidth, height: cellHeight }}
//       ref={ref}
//     ></canvas>
//   );
// }

// function CanvasOne({ref} : {ref: React.Ref<HTMLCanvasElement>}) {
// //   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//         if(!ref || typeof ref === "function") return;

//     const canvas = ref.current;
//     if (!canvas) return;

//     const ctxOne = canvas.getContext("2d");
//     if (!ctxOne) return;

//     ctxOne.font = "12px Geist";
//     ctxOne.fillStyle = "white";
//     ctxOne.textAlign = "center";
//     ctxOne.textBaseline = "middle";
//     ctxOne.fillText("1", 0, 0);
//   }, []);
//   return (
//     <canvas
//       className="text-center"
//       style={{ width: cellWidth, height: cellHeight }}
//       ref={ref}
//     ></canvas>
//   );
// }

function canvasSelection(noiseValue: number): HTMLCanvasElement {
  //CANVAS ONE AND ZERO------------
  const canvasZero = document.createElement("canvas");
  canvasZero.width = cellWidth;
  canvasZero.height = cellHeight;

  const ctxZero = canvasZero.getContext("2d");
  if (!ctxZero) throw new Error("ctxZero does not exist");

  ctxZero.font = "12px FixedSys";
  // ctxZero.scale(1.5, 1.5)
  ctxZero.fillStyle = "white";
  ctxZero.textAlign = "center";
  ctxZero.textBaseline = "middle";
  ctxZero.fillText("0", cellWidth / 2, cellHeight / 2);

  const canvasOne = document.createElement("canvas");
  canvasOne.width = cellWidth;
  canvasOne.height = cellHeight;

  const ctxOne = canvasOne.getContext("2d");
  if (!ctxOne) throw new Error("ctxOne does not exist");

  ctxOne.font = "12px FixedSys";
  // ctxOne.scale(1.5, 1.5)

  ctxOne.fillStyle = "white";
  ctxOne.textAlign = "center";
  ctxOne.textBaseline = "middle";
  ctxOne.fillText("1", cellWidth / 2, cellHeight / 2);

  return noiseValue > 0 ? canvasOne : canvasZero;
}
