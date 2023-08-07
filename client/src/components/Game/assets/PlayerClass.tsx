import React from "react";
import spriteRunRight from "../src/spriteRunRight.png";
import spriteRunLeft from "../src/spriteRunLeft.png";
import spriteStandLeft from "../src/spriteStandLeft.png";
import spriteStandRight from "../src/spriteStandRight.png";
import { Util } from "./UtilClass";
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";

let c;
let spriteRunLeftImg = new Image();
let spriteRunRightImg = new Image();
let spriteStandLeftImg = new Image();
let spriteStandRightImg = new Image();
spriteRunLeftImg.src = spriteRunLeft;
spriteRunRightImg.src = spriteRunRight;
spriteStandLeftImg.src = spriteStandLeft;
spriteStandRightImg.src = spriteStandRight;
var friction = 0.9;
var gravity = 0.2;

export class Player {
  that: Player;
  type: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  width: number;
  height: number;
  speed: number;
  jumpHeight: number;
  jumping: boolean;
  grounded: boolean;
  image: HTMLImageElement;
  frames: number;
  sprites: {
    stand: {
      right: HTMLImageElement;
      cropWidth: number;
      width: number;
      left: HTMLImageElement;
    };
    run: {
      right: HTMLImageElement;
      cropWidth: number;
      width: number;
      left: HTMLImageElement;
    };
  };
  currentSprite: HTMLImageElement;
  currentCropWidth: number;

  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 66;
    this.height = 150;
    this.speed = 3;
    this.jumpHeight = 0.5;

    this.jumping = false;
    this.grounded = false;

    this.that = this;

    this.image = spriteStandRightImg;
    this.frames = 0;
    this.sprites = {
      stand: {
        right: spriteStandRightImg,
        cropWidth: 177,
        width: 66,
        left: spriteStandLeftImg,
      },
      run: {
        right: spriteRunRightImg,
        cropWidth: 341,
        width: 127.875,
        left: spriteRunLeftImg,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
    this.type = "small";
  }

  render(c: CanvasRenderingContext2D) {
    // let img = Util.imageCache[this.image.src];

    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update(c: CanvasRenderingContext2D) {
    this.frames++;
    if (this.frames > 28 || this.frames > 60) this.frames = 0;
    this.render(c);
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    this.velocity.y += gravity;
    if (this.position.x + this.velocity.x < 0) {
      // Stop the player from moving further left
      this.velocity.x = 0;
      this.position.x = 0;
    } else {
      // Otherwise, update the x position as normal
      this.position.x += this.velocity.x;
    }
  }
}
