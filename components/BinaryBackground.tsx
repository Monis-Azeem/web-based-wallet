"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

const cellWidth = 16;
const cellHeight = 16;

export function BinaryBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const time = useRef<number>(0);
  const animationIdRef = useRef<number>(0);

  const handleAnimation = () => {
    //This is so because while resizing; documents.load is returning a promise, so resize used to fire handleAnimation every single time which returns like 40-50 promises while resizing which when resolved used to increase time.current significantly. To resolve that we added debounce but still there were previous frames that were causing problems.
    cancelAnimationFrame(animationIdRef.current);

    const canvas = canvasRef.current; //we are accessing the below canvas(DOM) element directly and it will persist across re-renders
    const container = containerRef.current;
    const noise2D = createNoise2D();

    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = container.offsetWidth * dpr; //we will draw the canvas on the visual pixel size of the screen. Let's say screen size is 1000px and screen is 2000px in itself, then canvas will be drawn on 1000 * 1.5 = 1500 px
    canvas.height = container.offsetHeight * dpr;

    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx?.scale(dpr, dpr);

    const columns = Math.ceil(container.offsetWidth / cellWidth);
    const rows = Math.ceil(container.offsetHeight / cellHeight);

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

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
        ctxZero.fillStyle = "white";
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
        // ctxOne.fillStyle = "#f73900";
        ctxOne.fillStyle = "#ff4111";
        ctxOne.textAlign = "center";
        ctxOne.textBaseline = "middle";
        ctxOne.fillText("1", cellWidth / 2, cellHeight / 2);

        const animate = () => {
          ctx?.clearRect(0, 0, containerWidth, containerHeight);
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, containerWidth, containerHeight);

          for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
              const noiseValue = noise2D(col * 0.12 + time.current, row * 0.12); //a noise function that gives a smooth value based on (x and y). This is responsible for that wobbly cloud thing. Else it would just random values getting change of 0 and 1. because of 0.12, nearby inputs gives nearby values

              const component = noiseValue > 0 ? canvasOne : canvasZero;
              ctx.drawImage(component, col * cellWidth, row * cellHeight);
            }
          }

          time.current = time.current + 0.003;
          animationIdRef.current = requestAnimationFrame(animate);
        };

        animate();
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  useEffect(() => {
    handleAnimation();
    let debounceTimer: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        handleAnimation();
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(debounceTimer);
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="w-full min-h-screen inset-0 absolute z-0"
      ref={containerRef}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: "pixelated" }}
      ></canvas>
    </div>
  );
}
