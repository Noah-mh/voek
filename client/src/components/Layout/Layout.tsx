import { Outlet } from "react-router-dom";
import Header from "../Header/header.js";
import Footer from "../Footer/Footer.js";

const Layout = () => {
  return (
    <main className="App">
      <Header isCustomer={true} />
      <Outlet />
      <Footer />
    </main>
  );
};

export default Layout;
