import React, { useEffect, useRef } from "react";
import backgroundImg from "../src/background.png";
import bghillsImg from "../src/hills.png";
import platformImg from "../src/platform.png";
import platformImgTall from "../src/platformSmallTall.png";
import spriteRunRight from "../src/spriteRunRight.png";
import spriteRunLeft from "../src/spriteRunLeft.png";
import spriteStandLeft from "../src/spriteStandLeft.png";
import spriteStandRight from "../src/spriteStandRight.png";
import { Player } from "./PlayerClass";
import { Util } from "./UtilClass";
import { Platform } from "./Platform";
import { GameUI } from "./GameUI";

const MainGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  let level = {
    background: "#0000ff",
    platforms: [],
    // enemies: [new Goomba(200, 400)],
    playerImgResource: [
      spriteRunRight,
      spriteRunLeft,
      spriteStandLeft,
      spriteStandRight,
    ],
    imgResources: [backgroundImg, bghillsImg, platformImg, platformImgTall],
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const c = canvas.getContext("2d")!;
    var gameUI = new GameUI(canvas, c);
    // canvas.width = 1024;
    // canvas.height = 576;
    let maxWidth = 0;
    let viewPort = 1024;
    let height = 576;
    gameUI.setWidth(1024);
    gameUI.setHeight(576);
    gameUI.show();

    let translatedDist = 0;
    let platformImage = new Image();
    let platformImageTall = new Image();
    let bgImage = new Image();
    let bgHills = new Image();
    let spriteRunLeftImg = new Image();
    let spriteRunRightImg = new Image();
    let spriteStandLeftImg = new Image();
    let spriteStandRightImg = new Image();
    let currentKey = "";
    let platforms: Platform[] = [];
    let lastKey = "";
    let centerPos;

    spriteRunLeftImg.src = spriteRunLeft;
    spriteRunRightImg.src = spriteRunRight;
    spriteStandLeftImg.src = spriteStandLeft;
    spriteStandRightImg.src = spriteStandRight;

    bgImage.src = backgroundImg;
    bgHills.src = bghillsImg;
    platformImage.src = platformImg;
    platformImageTall.src = platformImgTall;

    let tallPlatforms = [
      new Platform({
        x: platformImage.width * 4 + 500 + 30,
        y: 470 - platformImageTall.height,
        image: platformImageTall,
      }),
    ];
    let shortPlatforms = [
      new Platform({ x: -1, y: 470, image: platformImage }),
      new Platform({
        x: platformImage.width - 3,
        y: 470,
        image: platformImage,
      }),
      new Platform({
        x: platformImage.width * 2 + 300,
        y: 470,
        image: platformImage,
      }),
      new Platform({
        x: platformImage.width * 3 + 300,
        y: 470,
        image: platformImage,
      }),
      new Platform({
        x: platformImage.width * 4 + 500,
        y: 470,
        image: platformImage,
      }),
      new Platform({
        x: platformImage.width * 6 + 500,
        y: 470,
        image: platformImage,
      }),
    ];

    platforms = [...tallPlatforms, ...shortPlatforms];

    Util.loadImgResources(level.imgResources, main);
    const player = new Player();
    const keys: { [key: string]: boolean } = {};

    //movemment keys (when keys pressed)
    const bindKeyPress = () => {
      //key binding

      window.addEventListener("keydown", function (e: KeyboardEvent) {
        keys[e.key] = true;
      });

      window.addEventListener("keyup", function (e: KeyboardEvent) {
        keys[e.key] = false;
      });
    };
    bindKeyPress();

    //handle player sprite draw + movement
    function updatePlayer() {
      var friction = 0.9;
      var gravity = 0.2;
      player.frames++;
      if (player.frames > 28 || player.frames > 60) player.frames = 0;
      //up
      if (player.grounded) {
        player.velocity.y = 0;
      } else {
        player.velocity.y += gravity;
      }

      if (keys["w"]) {
        if (!player.jumping && player.grounded) {
          player.jumping = true;
          player.grounded = false;
          player.velocity.y = -(player.speed / 2 + 5.5);

          //if player is not currently running right and is standing right
          if (
            player.currentSprite != player.sprites.run.right &&
            player.currentSprite == player.sprites.stand.right
          ) {
            player.currentSprite = player.sprites.run.right;
            player.currentCropWidth = player.sprites.run.cropWidth;
            player.width = player.sprites.run.width;
          } else if (
            player.currentSprite != player.sprites.run.left &&
            player.currentSprite == player.sprites.stand.left
          ) {
            player.currentSprite = player.sprites.run.left;
            player.currentCropWidth = player.sprites.run.cropWidth;
            player.width = player.sprites.run.width;
          }
        }
      }

      //left arrow
      if (keys["a"]) {
        if (player.velocity.x > -player.speed) {
          player.velocity.x--;
        }

        if (player.currentSprite != player.sprites.run.left) {
          player.currentSprite = player.sprites.run.left;
          player.currentCropWidth = player.sprites.run.cropWidth;
          player.width = player.sprites.run.width;
        }
      }

      //right arrow
      if (keys["d"]) {
        if (
          player.velocity.x < player.speed &&
          player.position.x < translatedDist + viewPort / 2 - 100
        ) {
          player.velocity.x++;
        }
        player.currentSprite = player.sprites.run.right;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.width = player.sprites.run.width;
        playerScroll();
      }

      //velocity 0 Sprite position

      if (
        Math.abs(player.velocity.x) < 1 &&
        !player.jumping &&
        !keys["d"] &&
        !keys["a"]
      ) {
        if (player.currentSprite == player.sprites.run.right) {
          player.currentSprite = player.sprites.stand.right;
          player.currentCropWidth = player.sprites.stand.cropWidth;
          player.width = player.sprites.stand.width;
        } else if (player.currentSprite == player.sprites.run.left) {
          player.currentSprite = player.sprites.stand.left;
          player.currentCropWidth = player.sprites.stand.cropWidth;
          player.width = player.sprites.stand.width;
        }
      }

      if (player.grounded) {
        player.velocity.y = 0;
      }
      player.velocity.x *= friction;

      player.position.x += player.velocity.x;
      player.position.y += player.velocity.y;
    }

    function collisionCheck(objA: any, objB: any) {
      // get the vectors to check against
      var vX = objA.x + objA.width / 2 - (objB.x + objB.width / 2);
      var vY = objA.y + objA.height / 2 - (objB.y + objB.height / 2);

      // add the half widths and half heights of the objects
      var hWidths = objA.width / 2 + objB.width / 2;
      var hHeights = objA.height / 2 + objB.height / 2;
      var collisionDirection = null;

      // if the x and y vector are less than the half width or half height, then we must be inside the object, causing a collision
      if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var offsetX = hWidths - Math.abs(vX);
        var offsetY = hHeights - Math.abs(vY);

        if (offsetX >= offsetY) {
          if (vY > 0 && vY < 37) {
            collisionDirection = "t";
          } else if (vY < 0) {
            collisionDirection = "b";
          }
        } else {
          if (vX > 0) {
            collisionDirection = "l";
            objA.x += offsetX;
          } else {
            collisionDirection = "r";
            objA.x -= offsetX;
          }
        }
      }
      return collisionDirection;
    }

    function generateMap() {
      player.grounded = false;

      platforms.forEach((platform) => {
        if (
          platform.position.x + platform.width >= translatedDist &&
          platform.position.x <= translatedDist + viewPort
        ) {
          platform.draw(c);
        }
      });

      playerPlatformCollision(platforms, player);
    }

    //main game loop

    function elementPlayerCollision(element: any, player: Player) {
      var collisionDirection = collisionCheck(player, element);
      if (collisionDirection == "l" || collisionDirection == "r") {
        player.velocity.x = 0;
        player.jumping = false;
      } else if (collisionDirection == "t") {
        player.velocity.y *= -1;
        player.velocity.y == 0;
      }
    }

    function playerPlatformCollision(platforms: Platform[], player: Player) {
      platforms.forEach((platform) => {
        if (
          (player.velocity.y >= 0 &&
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >=
              platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x + player.velocity.x <=
              platform.position.x + platform.width + player.width) ||
          (player.position.y + player.height > platform.position.y &&
            player.position.x + player.width > platform.position.x &&
            player.position.x < platform.position.x + platform.width)
        ) {
          player.grounded = true;
          player.jumping = false;
          player.velocity.y = 0;

          player.position.y = platform.position.y - player.height;
        }
      });
    }

    function playerScroll() {
      let centerPos = translatedDist + viewPort / 2;
      if (
        player.position.x > translatedDist + viewPort / 2 - 100 &&
        keys["d"]
      ) {
        player.velocity.x = 0;
        translatedDist += player.speed;
        platforms.forEach((platform) => {
          platform.position.x -= player.speed * 6;
        });
      }
    }

    function main() {
      gameUI.clear(0, 0, canvas.width, canvas.height);

      c.fillStyle = "white";
      c.fillRect(0, 0, canvas.width, canvas.height);
      generateMap();
      player.grounded = false;

      playerPlatformCollision(platforms, player);
      player.render(c);
      window.requestAnimationFrame(main);

      updatePlayer();
    }
  }, []);

  return <canvas id="canvas" ref={canvasRef}></canvas>;
};

export default MainGame;
