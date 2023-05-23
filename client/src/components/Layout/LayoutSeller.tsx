import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer.js";
import Header from "../Header/header.js";

const LayoutSeller = () => {
  return (
    <main className="App">
      <Header isSeller={true} />
      <Outlet />
      <Footer />
    </main>
  );
};

export default LayoutSeller;
