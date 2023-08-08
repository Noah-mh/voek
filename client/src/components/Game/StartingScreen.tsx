import React, { useEffect, useState } from "react";
import "./css/StartingScreen.css";
import HowToPlayModal from "./HowToPlayModal";

interface StartScreenProps {
  onStartGame: () => void;
  highestScore: number;
  triesLeft: number;
}

const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  highestScore,
  triesLeft,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleStartButtonClick = () => {
    setIsFadingOut(true);
  };

  useEffect(() => {
    if (isFadingOut) {
      const timeoutId = setTimeout(() => {
        onStartGame();
      }, 500); // 500ms matches the transition duration in the CSS

      return () => clearTimeout(timeoutId); // Clear timeout if component is unmounted during fade-out
    }
  }, [isFadingOut, onStartGame]);
  return (
    <div
      id="startScreen"
      className={isFadingOut ? "fadeOut flex flex-col" : " flex flex-col"}
    >
      <div className="startText">
        <h1 className="purples text-7xl drop-shadow-lg"> Click the circle!</h1>
        <h1 className="grays text-center text-lg drop-shadow-md">
          Highest Score: {highestScore}
        </h1>
        <h1 className=" text-center text-lg drop-shadow-md">
          Tries Left: {triesLeft}
        </h1>
        {triesLeft != 0 ? (
          <button
            id="startButton"
            onClick={handleStartButtonClick}
            className="bg-white text-purpleAccent font-Barlow font-bold rounded mt-6 bubbly-button w-1/2 mx-auto drop-shadow-md"
          >
            Start
          </button>
        ) : (
          <button
            id="startButton"
            disabled
            className="bg-white text-purpleAccent font-Barlow font-bold rounded mt-6 bubbly-button w-1/2 mx-auto drop-shadow-md opacity-50"
          >
            All tries finished for today.
          </button>
        )}

        <button className="mt-6" onClick={handleOpen}>
          <h1>How To Play?</h1>
        </button>
      </div>
      {open && <HowToPlayModal open={open} setOpen={setOpen} />}
      <div className="shape"></div>
    </div>
  );
};

export default StartScreen;
