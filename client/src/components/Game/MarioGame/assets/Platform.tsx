import React from "react";

let c;
let level;
let player;

export class Platform {
  position: { x: number; y: number };
  width: number;
  height: number;
  image: HTMLImageElement;

  constructor({
    x,
    y,
    image,
  }: {
    x: number;
    y: number;
    image: HTMLImageElement;
  }) {
    this.position = { x, y };
    this.width = image.width;
    this.height = image.height;
    this.image = image;
  }

  draw(c: CanvasRenderingContext2D) {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

export default Platform;
