import React, { useEffect, useRef } from "react";
import background from "./src/background.png";
import bghills from "./src/hills.png";
import platformImg from "./src/platform.png";
import platformImgTall from "./src/platformSmallTall.png";
import spriteRunRight from "./src/spriteRunRight.png";
import spriteRunLeft from "./src/spriteRunLeft.png";
import spriteStandLeft from "./src/spriteStandLeft.png";
import spriteStandRight from "./src/spriteStandRight.png";

const MyComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const c = canvas.getContext("2d")!;
    if (!canvas) {
      console.error("Could not find canvas");
      return;
    } else if (!c) {
      console.error("Could not get 2D context");
      return;
    } else {
      canvas.width = 1024;
      canvas.height = 576;
      let gravity = 0.5;
      let platformImage = new Image();
      let platformImageTall = new Image();
      let bgImage = new Image();
      let bgHills = new Image();
      let spriteRunLeftImg = new Image();
      let spriteRunRightImg = new Image();
      let spriteStandLeftImg = new Image();
      let spriteStandRightImg = new Image();
      let currentKey = "";
      let lastKey = "";

      spriteRunLeftImg.src = spriteRunLeft;
      spriteRunRightImg.src = spriteRunRight;
      spriteStandLeftImg.src = spriteStandLeft;
      spriteStandRightImg.src = spriteStandRight;

      bgImage.src = background;
      bgHills.src = bghills;
      platformImage.src = platformImg;
      platformImageTall.src = platformImgTall;

      class Platform {
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

        draw() {
          c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
          );
        }
      }

      class GenericObject {
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

        draw() {
          c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
          );
        }
      }

      const keys = {
        w: {
          pressed: false,
        },
        s: {
          pressed: false,
        },
        a: {
          pressed: false,
        },
        d: {
          pressed: false,
        },
        space: {
          pressed: false,
        },
      };
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
      class Goomba {
        position: { x: number; y: number };
        velocity: { x: number; y: number };
        width: number;
        height: number;
        speed: number;
        changeDirectionInterval: number;
        timeSinceDirectionChange: number;
        gravity: number;
        direction: number;

        constructor() {
          this.position = {
            x: 0,
            y: 0,
          };
          this.velocity = {
            x: 1,
            y: 0,
          };
          this.width = 30;
          this.height = 30;
          this.speed = 2;
          this.changeDirectionInterval = 1.7; // Change direction every 1 second (1000 milliseconds)
          this.timeSinceDirectionChange = 0;
          this.gravity = 0.5;
          this.direction = 1;
        }

        draw() {
          c.fillStyle = "red";
          c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }

        move(deltaTime: number) {
          const nextX = this.position.x + this.velocity.x * deltaTime;
          const nextY = this.position.y + this.velocity.y * deltaTime;

          platforms.forEach((platform) => {
            if (
              nextY + this.height >= platform.position.y &&
              nextY <= platform.position.y + platform.height &&
              nextX + this.width >= platform.position.x &&
              nextX <= platform.position.x + platform.width
            ) {
              // Collision with platform
              this.velocity.y = 0; // Stop vertical movement
              this.position.y = platform.position.y - this.height;
            }
          });

          this.position.x = nextX;
          this.position.y = nextY;

          this.timeSinceDirectionChange += deltaTime;

          if (this.timeSinceDirectionChange >= this.changeDirectionInterval) {
            this.changeDirection();
            this.timeSinceDirectionChange = 0;
          }
        }
        changeDirection() {
          this.direction = -this.direction; // Invert the current direction
          this.velocity.x = this.speed * this.direction;
        }

        update() {
          this.position.y += this.velocity.y;
          this.position.x += this.velocity.x;
          this.velocity.y += gravity;

          // if (this.position.x + this.velocity.x < 0) {
          //   this.velocity.x = 0;
          //   this.position.x = 0;
          // } else {
          //   this.position.x += this.velocity.x;
          // }

          if (
            this.position.y + this.height + this.velocity.y <=
            canvas.height
          ) {
            this.velocity.y += gravity;
          }
          if (this.position.y > canvas.height) {
            removeGoomba(this);
          }
        }
      }
      function resetGoomba() {
        goombas = [new Goomba()];
      }

      function removeGoomba(goomba: Goomba) {
        const index = goombas.indexOf(goomba);
        if (index !== -1) {
          goombas.splice(index, 1);
        }
      }
      function resetGame() {
        player = new Player();
        scrollOffset = 0;
        tallPlatforms = [
          new Platform({
            x: platformImage.width * 4 + 500,
            y: 470 - platformImageTall.height,
            image: platformImageTall,
          }),
        ];
        shortPlatforms = [
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
        ];

        platforms = [...tallPlatforms, ...shortPlatforms];
        genericObjects = [
          new GenericObject({ x: -1, y: -1, image: bgImage }),
          new GenericObject({ x: -1, y: -1, image: bgHills }),
        ];
        let goombas = [new Goomba(), new Goomba()];
        // reset any other game state here
      }
      let platforms = [...tallPlatforms, ...shortPlatforms];

      let genericObjects = [
        new GenericObject({ x: -1, y: -1, image: bgImage }),
        new GenericObject({ x: -1, y: -1, image: bgHills }),
      ];

      let goombas = [new Goomba()];

      class Player {
        position: { x: number; y: number };
        velocity: { x: number; y: number };
        width: number;
        height: number;
        speed: number;
        jumpHeight: number;
        canJump: boolean;
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
            y: 1,
          };
          this.width = 66;
          this.height = 150;
          this.speed = 0.4;
          this.jumpHeight = 0.5;
          this.canJump = false;
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
        }

        draw() {
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

        update() {
          this.frames++;
          if (this.frames > 28 || this.frames > 60) this.frames = 0;
          this.draw();
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

          if (
            this.position.y + this.height + this.velocity.y <=
            canvas.height
          ) {
            this.velocity.y += gravity;
          }
        }
      }
      var goombaCount = 0;
      let player = new Player();
      let scrollOffset = 0;
      let lastFrameTime = performance.now();

      function isCollidedGoomba() {
        goombas.forEach((goomba) => {
          if (
            player.position.x + player.width >= goomba.position.x &&
            player.position.x <= goomba.position.x + goomba.width &&
            player.position.y + player.height >= goomba.position.y &&
            player.position.y <= goomba.position.y + goomba.height
          ) {
            const playerBottom =
              player.position.y + player.height - goomba.height;
            const goombaTop = goomba.position.y - 10;
            const goombaBottom = goomba.position.y + goomba.height;

            if (playerBottom <= goombaTop) {
              // Player collided with goomba from the top
              removeGoomba(goomba);
            } else {
              // Player collided with goomba from the sides or bottom
              resetGame(); // Implement the logic to reset the game or handle player death
            }
          }
        });
      }

      function animate() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastFrameTime) / 1000; // Convert to seconds
        lastFrameTime = currentTime;
        window.requestAnimationFrame(animate);
        c.fillStyle = "white";
        c.fillRect(0, 0, canvas.width, canvas.height);

        genericObjects.forEach((genericObject) => {
          genericObject.draw();
        });

        platforms.forEach((platform, index) => {
          platform.draw();

          if (index >= 3) {
            // Randomly render a Goomba on the platform

            if (Math.random() < 0.01 && goombas.length < 10) {
              const goomba = new Goomba();
              goomba.position.x =
                platform.position.x +
                (platform.width - goomba.width) * Math.random();
              goomba.position.y = platform.position.y - goomba.height;
              goombas.push(goomba);
            }
          }
          if ((keys.w.pressed || keys.space.pressed) && player.position.y > 0) {
            player.velocity.y -= player.jumpHeight;
          }

          if (keys.s.pressed) {
            player.velocity.y += gravity * 5;
          }

          if (keys.d.pressed && player.position.x <= canvas.width / 3) {
            if (
              (keys.a.pressed && player.position.x <= canvas.width / 3) ||
              (keys.a.pressed && scrollOffset === 0 && player.position.x > 0)
            ) {
              player.velocity.x -= player.speed;
            } else {
              player.velocity.x += player.speed;
            } //
          } else if (
            (keys.a.pressed && player.position.x <= canvas.width / 3) ||
            (keys.a.pressed && scrollOffset === 0 && player.position.x > 0)
          ) {
            if (keys.d.pressed && player.position.x >= canvas.width / 40) {
              player.velocity.x += player.speed;
            } else {
              player.velocity.x -= player.speed;
            } // }
          } else {
            player.velocity.x = 0;

            if (keys.d.pressed) {
              scrollOffset += 5;
              platforms.forEach((platform) => {
                platform.position.x -= player.speed * 6;
              });

              goombas.forEach((goomba) => {
                if (goomba.direction == 1) {
                  goomba.position.x -= 2;
                } else if (goomba.direction == -1) {
                  goomba.position.x += 2;
                }
              });

              genericObjects.forEach((genericObject) => {
                genericObject.position.x -= player.speed * 0.66;
              });
            } else if (keys.a.pressed && scrollOffset > 0) {
              scrollOffset -= 5;
              platforms.forEach((platform) => {
                platform.position.x += player.speed * 6;
              });
              goombas.forEach((goomba) => {
                console.log(goomba.direction);
                if (goomba.direction == 1) {
                  goomba.position.x += 2;
                } else if (goomba.direction == -1) {
                  goomba.position.x -= 2;
                }
              });
              genericObjects.forEach((genericObject) => {
                genericObject.position.x += player.speed * 0.66;
              });
            }
          }
        });
        goombas.forEach((goomba) => {
          goomba.draw();
          goomba.move(deltaTime);

          if (goomba.position.y > canvas.height) {
            removeGoomba(goomba);
          }
        });
        if (
          keys.d.pressed &&
          lastKey == "right" &&
          player.currentSprite != player.sprites.run.right
        ) {
          player.frames = 1;
          player.currentSprite = player.sprites.run.right;
          player.currentCropWidth = player.sprites.run.cropWidth;
          player.width = player.sprites.run.width;
        } else if (
          keys.a.pressed &&
          lastKey == "left" &&
          player.currentSprite != player.sprites.run.left
        ) {
          player.currentSprite = player.sprites.run.left;
          player.currentCropWidth = player.sprites.run.cropWidth;
          player.width = player.sprites.run.width;
        } else if (
          !keys.a.pressed &&
          lastKey == "left" &&
          player.currentSprite != player.sprites.stand.left
        ) {
          player.currentSprite = player.sprites.stand.left;
          player.currentCropWidth = player.sprites.stand.cropWidth;
          player.width = player.sprites.stand.width;
        } else if (
          !keys.d.pressed &&
          lastKey == "right" &&
          player.currentSprite != player.sprites.stand.right
        ) {
          player.currentSprite = player.sprites.stand.right;
          player.currentCropWidth = player.sprites.stand.cropWidth;
          player.width = player.sprites.stand.width;
        }
        platforms.forEach((platform) => {
          // Check for collision only when player is moving downwards (falling or jumping off a platform)
          if (
            player.velocity.y >= 0 &&
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >=
              platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x + player.velocity.x <=
              platform.position.x + platform.width + player.width
          ) {
            player.velocity.y = 0;
            player.position.y = platform.position.y - player.height;
          }

          goombas.forEach((goomba) => {
            if (
              goomba.velocity.y >= 0 &&
              goomba.position.y + goomba.height <= platform.position.y &&
              goomba.position.y + goomba.height + goomba.velocity.y >=
                platform.position.y &&
              goomba.position.x + goomba.width >= platform.position.x &&
              goomba.position.x + goomba.velocity.x <=
                platform.position.x + platform.width + goomba.width
            ) {
              goomba.velocity.y = 0;
            }
          });
        });

        if (player.position.y > canvas.height) {
          resetGame();
        }

        player.update();

        isCollidedGoomba();
        goombas.forEach((goomba) => {
          // if (goomba.position.y > canvas.height) {
          //   goombas.remove(goomba)
          // }
          goomba.update();
        });
      }

      animate();

      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case "w":
            if (
              player.currentSprite === player.sprites.stand.right ||
              player.currentSprite === player.sprites.stand.left
            ) {
              player.currentSprite = player.sprites.run.right;
              player.currentCropWidth = player.sprites.run.cropWidth;
              player.width = player.sprites.run.width;
            }
            if (player.velocity.y === 0) {
              player.velocity.y -= player.jumpHeight;
            }
            keys.w.pressed = true;
            break;
          case "a":
            lastKey = "left";
            keys.a.pressed = true;
            break;
          case "s":
            keys.s.pressed = true;
            break;
          case "d":
            lastKey = "right";
            keys.d.pressed = true;
            break;
          default:
            break;
        }
        if (e.key === " ") {
          keys.space.pressed = true;
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        switch (e.key) {
          case "w":
            keys.w.pressed = false;
            if (player.currentSprite == player.sprites.run.right) {
              player.currentSprite = player.sprites.stand.right;
              player.currentCropWidth = player.sprites.stand.cropWidth;
              player.width = player.sprites.stand.width;
            }
            break;
          case "a":
            keys.a.pressed = false;
            if (!keys.d.pressed) {
              player.currentSprite = player.sprites.stand.left;
              player.currentCropWidth = player.sprites.stand.cropWidth;
              player.width = player.sprites.stand.width;
            }
            break;
          case "s":
            keys.s.pressed = false;
            break;
          case "d":
            keys.d.pressed = false;
            if (!keys.a.pressed) {
              player.currentSprite = player.sprites.stand.right;
              player.currentCropWidth = player.sprites.stand.cropWidth;
              player.width = player.sprites.stand.width;
            }
            break;
          case "space":
            keys.space.pressed = false;
            break;
          default:
            break;
        }
        if (e.key === " ") {
          keys.space.pressed = false;
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, []);

  return <canvas id="canvas" ref={canvasRef}></canvas>;
};

export default MyComponent;
