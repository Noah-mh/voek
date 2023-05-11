import { Outlet } from "react-router-dom";
import Header from "../header/Header.tsx";
import Footer from "../footer/Footer.tsx";

const Layout = () => {
  return (
    <main className="App">
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
};

export default Layout;
