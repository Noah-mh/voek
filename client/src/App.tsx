import { useState } from "react";
import "./App.css";
import Header from "./components/header/header.tsx";
import LoginBanner from "./components/loginBanner/loginBanner.tsx";
import Footer from "./components/footer/footer.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LoginBanner />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
