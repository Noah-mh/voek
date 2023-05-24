import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer.js";
import Header from "../Header/header.js";

const LayoutSeller = () => {
  return (
    <main className="App flex flex-col min-h-screen">
      <Header isSeller={true} />
      <Outlet />
      <Footer />
    </main>
  );
};

export default LayoutSeller;
