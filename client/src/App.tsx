import { useState } from "react";
import "./App.css";
import Header from "./components/header/header.tsx";
import LoginBanner from "./components/loginBanner/loginBanner.tsx";
import Footer from "./components/footer/footer.tsx";

function App() {
  return (
    <>
      <Header />
      <LoginBanner />
      <Footer />
    </>
  );
}

export default App;
