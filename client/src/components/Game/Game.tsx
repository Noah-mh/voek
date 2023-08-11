import React, { useState, useEffect, useRef, useContext } from "react";
import "./css/Game.css";
import StartScreen from "./StartingScreen";
import CustomerContext from "../../context/CustomerProvider";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import { ToastContainer, toast, Id } from "react-toastify";
const Game: React.FC = () => {
  const { customer } = useContext(CustomerContext);
  const customer_id = customer.customer_id;
  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [circleDiameter, setCircleDiameter] = useState<number>(100);
  const [currentCircle, setCurrentCircle] = useState<any>({});
  const [barWidth, setBarWidth] = useState<number>(100);
  const [reductionRate, setReductionRate] = useState<number>(0.005);
  const [score, setScore] = useState<number>(0);
  const [animationFrameId, setAnimationFrameId] = useState<number | null>(null);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [highestScore, setHighestScore] = useState<number>(0);
  const [triesLeft, setTriesLeft] = useState<number>(3);
  const [toastId, setToastId] = useState<Id | undefined>(undefined);

  const getHighestScore = async () => {
    try {
      const res = await axiosPrivateCustomer.get(
        `/customer/game/getHighestScore/${customer_id}`
      );
      console.log(res.data);
      console.log("highestScore");
      if (res.data.length === 0) {
        setHighestScore(0);
      } else {
        setHighestScore(res.data.highest_score);
        setTriesLeft(res.data.tries_left);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const updateHighestScore = async () => {
    await axiosPrivateCustomer.put(`/customer/game/updateScore`, {
      customer_id: customer_id,
      highest_score: score,
    });
  };

  const updateCoins = async () => {
    return await axiosPrivateCustomer.put(`customer/game/updateCoins`, {
      customer_id: customer_id,
      score: score,
    });
  };

  const updateStats = async () => {
    try {
      await Promise.all([updateCoins(), updateHighestScore()]);
      getHighestScore();
    } catch (err: any) {
      console.log(err);
    }
  };

  const updateTriesLeft = async () => {
    try {
      await axiosPrivateCustomer.put(`/customer/game/updateLastPlayed`, {
        customer_id: customer_id,
      });
    } catch (err: any) {
      console.log(err);
    }
  };
  const drawCircle = (x: number, y: number, diameter: number) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    canvas.width = 1024;
    canvas.height = 576;
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)"; // Color of the shadow
    ctx.shadowBlur = 10; // Blur intensity
    ctx.shadowOffsetX = 5; // Horizontal distance of shadow
    ctx.shadowOffsetY = 5; // Vertical distance of shadow

    ctx.fillStyle = "#492583";
    ctx.beginPath();
    ctx.arc(x, y, diameter / 2, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();

    // Reset shadow properties to default to avoid applying it to other drawings
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };
  const startGame = () => {
    setIsGameStarted(true); // Hide the start screen
    updateTriesLeft();
    createCircle();
    updateBar();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const createCircle = () => {
    clearCanvas();

    const x = Math.random() * (canvasRef.current!.width - circleDiameter);
    const y = Math.random() * (canvasRef.current!.height - circleDiameter);
    drawCircle(x + circleDiameter / 2, y + circleDiameter / 2, circleDiameter);
    setCurrentCircle({
      x: x + circleDiameter / 2,
      y: y + circleDiameter / 2,
      diameter: circleDiameter,
    });
  };

  const handleCircleClick = () => {
    setBarWidth((prev) => Math.min(prev + 5, 100));
    setReductionRate((prev) => Math.min(prev + 0.005, 0.2));
    setCircleDiameter((prev) => Math.max(prev - 3, 35));
    setScore((prev) => prev + 1);
  };
  const updateBar = () => {
    setBarWidth((prevWidth) => prevWidth - reductionRate);
  };

  const endGame = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    updateStats();
    // alert("Game Over! You have gained " + score + " coins.");
    toast.dismiss(toastId);

    const id = toast.info("Game Over! You have gained  " + score + "  coins.", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setToastId(id);
    // Reset game states
    setIsGameStarted(false);
    setScore(0);
    setBarWidth(100);
    setReductionRate(0.005);
    setCircleDiameter(100);
  };
  useEffect(() => {
    if (barWidth > 0 && isGameStarted) {
      const id = requestAnimationFrame(updateBar);
      setAnimationFrameId(id);
    } else if (barWidth <= 0) {
      endGame();
    }
  }, [barWidth, isGameStarted]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const distance = Math.sqrt(
      (x - currentCircle.x) ** 2 + (y - currentCircle.y) ** 2
    );
    if (distance <= currentCircle.diameter / 2) {
      handleCircleClick();
      createCircle();
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [animationFrameId]);

  useEffect(() => {
    getHighestScore();
  }, []);

  return (
    <div className="game-container">
      {!isGameStarted && (
        <StartScreen
          onStartGame={startGame}
          highestScore={highestScore}
          triesLeft={triesLeft}
        />
      )}
      <canvas
        id="gameCanvas"
        ref={canvasRef}
        onClick={handleCanvasClick}
      ></canvas>
      <div id="gameBarContainer">
        <div id="gameBar" style={{ width: `${barWidth}%` }}></div>
      </div>
      <div id="score">Score: {score}</div>
      <ToastContainer />
    </div>
  );
};

export default Game;
