"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import type { MouseCoordinates } from "@/types/mouse";

const cellWidth = 16;
const cellHeight = 16;

export function BinaryBackgroundMask() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const time = useRef<number>(0);
  const mouseRef = useRef<MouseCoordinates>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current; //we are accessing the below canvas(DOM) element directly and it will persist across re-renders
    const container = containerRef.current;
    const noise2D = createNoise2D();

    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = container.offsetWidth * dpr; //we will draw the canvas on the visual pixel size of the screen. Let's say screen size is 1000px and screen is 2000px in itself, then canvas will be drawn on 1000 * 1.5 = 1500 px

    //CSS using Tailwind controls display size and this canvas.width controls how many pixels it draws on.
    canvas.height = container.offsetHeight * dpr;

    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx?.scale(dpr, dpr);

    const columns = Math.ceil(container.offsetWidth / cellWidth);
    const rows = Math.ceil(container.offsetHeight / cellHeight);

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    let animationId: number; //kick off the animation loop

    document.fonts
      .load('13px "JetBrainsMono"')
      .then(() => {
        const canvasZero = document.createElement("canvas");
        canvasZero.width = cellWidth;
        canvasZero.height = cellHeight;
        const ctxZero = canvasZero.getContext("2d");
        if (!ctxZero) throw new Error("ctxZero does not exist");
        ctxZero.imageSmoothingEnabled = false;
        ctxZero.font = '13px "JetBrainsMono"';
        // ctxZero.fillStyle = "#636363";
        ctxZero.fillStyle = "black";
        ctxZero.textAlign = "center";
        ctxZero.textBaseline = "middle";
        ctxZero.fillText("0", cellWidth / 2, cellHeight / 2);

        const canvasOne = document.createElement("canvas");
        canvasOne.width = cellWidth;
        canvasOne.height = cellHeight;
        const ctxOne = canvasOne.getContext("2d");
        if (!ctxOne) throw new Error("ctxOne does not exist");
        ctxOne.imageSmoothingEnabled = false;
        ctxOne.font = '13px "JetBrainsMono"';
        ctxOne.fillStyle = "white";
        ctxOne.textAlign = "center";
        ctxOne.textBaseline = "middle";
        ctxOne.fillText("1", cellWidth / 2, cellHeight / 2);

        const animate = () => {
          ctx?.clearRect(0, 0, containerWidth, containerHeight);
          ctx.fillStyle = "#ff4111";
          ctx.fillRect(0, 0, containerWidth, containerHeight);
          if (containerRef.current) {
            containerRef.current.style.maskPosition = `${mouseRef.current.x - 130 / 2}px ${mouseRef.current.y - 130 / 2}px`;
          }

          for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
              const noiseValue = noise2D(col * 0.12 + time.current, row * 0.12); //a noise function that gives a smooth value based on (x and y). This is responsible for that wobbly cloud thing. Else it would just random values getting change of 0 and 1. because of 0.12, nearby inputs gives nearby values
              const component = noiseValue > 0 ? canvasOne : canvasZero;
              ctx.drawImage(component, col * cellWidth, row * cellHeight);
            }
          }

          time.current = time.current + 0.003;
          animationId = requestAnimationFrame(animate);
        };

        animate();
      })
      .catch((err) => {
        console.error("Error: ", err);
      });

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      className="absolute inset-0 w-full min-h-screen z-1"
      ref={containerRef}
      style={{
        maskImage: "url(/Ellipse.svg)",
        WebkitMaskImage: "url(/Ellipse.svg)",
        maskRepeat: "no-repeat",
        maskSize: "130px",
        color: "white",
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseMove={(e: React.MouseEvent<HTMLCanvasElement>) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mouseRef.current.x = e.clientX - rect.left;
          mouseRef.current.y = e.clientY - rect.top;
        }}
        style={{ imageRendering: "pixelated" }}
      ></canvas>
    </div>
  );
}
