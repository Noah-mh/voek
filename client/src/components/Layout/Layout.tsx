import { Outlet } from "react-router-dom";
import Header from "../header/header.js";
import Footer from "../footer/footer.js";
import { useNavigate } from "react-router-dom";

const Layout = () => {

  const navigate = useNavigate();

  return (
    <main className="App flex flex-col min-h-screen">
      <Header isCustomer={true} />
      <div className="flex-grow chat-parent">
        <Outlet />
      </div>
      <div className="fixed bottom-0 right-10 m-10">
        <button onClick={() => {navigate('/contact')}} className="bg-purpleAccent text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-white hover:text-purpleAccent transition duration-300 text-xl">
          Contact Us
        </button>
      </div>
      <Footer className="mt-auto" />
    </main>
  );
};

export default Layout;
