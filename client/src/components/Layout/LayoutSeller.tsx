import { Outlet } from "react-router-dom";
import Footer from "../footer/footer.js";
import Header from "../header/header.js";

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
