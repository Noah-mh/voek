import { useState } from "react";
import "./App.css";
import Header from "./components/header/header.tsx";
import LoginBanner from "./components/loginBanner/loginBanner.tsx";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Header />
      <LoginBanner />
    </div>
  );
}

export default App;
