import React, { useEffect, useRef } from "react";

let instance: GameUI | null = null;

export class GameUI {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  // private canvasRef: React.RefObject<HTMLCanvasElement>;
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  setWidth(width: number) {
    this.canvas.width = width;
  }

  setHeight(height: number) {
    this.canvas.height = height;
  }

  getWidth() {
    return this.canvas.width;
  }

  getHeight() {
    return this.canvas.height;
  }

  getCanvas() {
    return this.canvas;
  }

  show() {
    this.canvas.style.display = "block";
  }

  hide() {
    this.canvas.style.display = "none";
  }

  clear(x: number, y: number, width: number, height: number) {
    this.ctx.clearRect(x, y, width, height);
  }

  scrollWindow(x: number, y: number) {
    this.ctx.translate(x, y);
  }

  draw(
    image: CanvasImageSource,
    sx: number,
    sy: number,
    sWidth: number,
    sHeight: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.ctx.drawImage(image, sx, sy, sWidth, sHeight, x, y, width, height);
  }

  makeBox(x: number, y: number, width: number, height: number) {
    this.ctx.rect(x, y, width, height);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
  }

  writeText(text: string, x: number, y: number) {
    this.ctx.font = "20px SuperMario256";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(text, x, y);
  }
  getInstance() {
    if (instance == null) {
      instance = new GameUI(this.canvas, this.ctx);
    }

    return instance;
  }
}

// const MyMarioGame: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     const gameUI = GameUI.getInstance();
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         gameUI.setWidth(1024);
//         gameUI.setHeight(576);

//         // Example usage of gameUI functions
//         gameUI.show();
//         gameUI.clear(0, 0, 800, 600);
//         // Call other functions to draw your game elements.
//       }
//     }
//   }, []);

//   return <canvas ref={canvasRef} className="game-screen" />;
// };

// export default MyMarioGame;
