import React from "react";
import "./Loading.css";

const Loading: React.FC = () => {
  return (
    <div className="container">
      <div className="loader"></div>
      <div className="loader"></div>
      <div className="loader"></div>
    </div>
  );
}

export default Loading;

