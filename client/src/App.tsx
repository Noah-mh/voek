import { useEffect } from "react";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import Missing from "./components/Missing/Missing.tsx";
import LoginBanner from "./components/LoginBanner/LoginBanner.tsx";
import SignUP from "./components/LoginBanner/SignUP.tsx";
import Layout from "./components/Layout/Layout.tsx";
import RequireAuthCustomer from "./components/RequireAuth/RequireAuthCustomer";
import CartPage from "./components/cart/UserCart.tsx";
//
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes*/}
        <Route path="/" element={<h1></h1>} />
        <Route path="login" element={<LoginBanner />} />
        <Route path="signup" element={<SignUP />} />
        <Route path="cart" element={<CartPage />} />

        {/* Protected Routes */}
        {/* use this as example to protect routes */}
        {/* <Route element={<RequireAuthCustomer />}>
          <Route path='customer' element={<h1>Customer</h1>} />
        </Route> */}
      </Route>
      {/* unauthorized or forbidden */}
      <Route path="/*" element={<Missing />} />
    </Routes>
  );
}

export default App;
