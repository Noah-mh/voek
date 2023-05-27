import { Outlet } from "react-router-dom";
import Header from "../header/header.js";
import Footer from "../footer/footer.js";

const Layout = () => {
  return (
    <main className="App flex flex-col min-h-screen">
      <Header isCustomer={true} />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer className="mt-auto" />
    </main>
  );
};

export default Layout;
