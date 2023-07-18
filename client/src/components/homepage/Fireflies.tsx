import React, { useEffect } from "react";
import "./css/Fireflies.css";

const Fireflies = () => {
  const quantity = 15;

  useEffect(() => {
    let styleTag = document.createElement("style");
    let keyframes = "";

    for (let i = 1; i <= quantity; i++) {
      let steps = Math.floor(Math.random() * 12) + 16;
      let animationCSS = "";
      for (let step = 0; step <= steps; step++) {
        animationCSS += `
          ${step * (100 / steps)}% {
            transform: translateX(${Math.random() * 100 - 50}vw) translateY(${
          Math.random() * 100 - 50
        }vh) scale(${Math.random() * 0.75 + 0.25});
          }
        `;
      }

      keyframes += `
        @keyframes move${i} {
          ${animationCSS}
        }
      `;
    }

    styleTag.innerHTML = keyframes;
    document.head.appendChild(styleTag);
  }, []);

  const fireflies = Array.from({ length: quantity }, (_, i) => {
    const rotationSpeed = `${Math.random() * 10 + 8}s`;
    const flashDuration = `${Math.random() * 6000 + 5000}ms`;
    const flashDelay = `${Math.random() * 8000 + 500}ms`;
    return (
      <div
        className={`firefly firefly-${i + 1}`}
        key={i}
        style={{
          animationName: `move${i + 1}`,
        }}
      >
        <style>
          {`
            .firefly-${i + 1}::before {
              animation-duration: ${rotationSpeed};
            }
            .firefly-${i + 1}::after {
              animation-duration: ${rotationSpeed}, ${flashDuration};
              animation-delay: 0ms, ${flashDelay};
            }
          `}
        </style>
      </div>
    );
  });

  return <div>{fireflies}</div>;
};

export default Fireflies;
