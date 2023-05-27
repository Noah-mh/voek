import { Outlet } from "react-router-dom";
import Footer from "../footer/footer.js";
import Header from "../header/header.js";

const LayoutSeller = () => {
  return (
    <main className="App flex flex-col min-h-screen">
      <Header isSeller={true} />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer className="mt-auto" />
    </main>
  );
};

export default LayoutSeller;
