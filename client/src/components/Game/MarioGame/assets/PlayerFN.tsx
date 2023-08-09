import React from "react";
import { Player } from "./PlayerClass";
import { Util } from "./UtilClass";
import spriteRunRight from "../src/spriteRunRight.png";
import spriteRunLeft from "../src/spriteRunLeft.png";
import spriteStandLeft from "../src/spriteStandLeft.png";
import spriteStandRight from "../src/spriteStandRight.png";

interface PlayerFNProps {
  player: Player;
}

const PlayerFN = ({ player }: PlayerFNProps) => {
  const keys: { [key: string]: boolean } = {};
  //key binding

  const handleKeyDown = (e: KeyboardEvent) => {
    keys[e.key] = true;
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    keys[e.key] = false;
  };

  function update() {
    var friction = 0.9;
    var gravity = 0.2;

    //movement of player (if keys pressed)

  }



  // window event listeners
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  return <></>;
};

export default PlayerFN;
