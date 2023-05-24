import { Outlet } from "react-router-dom";
import Header from "../Header/header.js";
import Footer from "../Footer/Footer.js";

const Layout = () => {
  return (
    <main className="App flex flex-col min-h-screen">
      <Header isCustomer={true} />
      <Outlet />
      <Footer />
    </main>
  );
};

export default Layout;
