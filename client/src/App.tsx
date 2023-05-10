import { useEffect } from "react";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import Missing from "./components/Missing/Missing";
import LoginBanner from "./components/LoginBanner/LoginBanner";
import SignUP from "./components/LoginBanner/Signup";
import Layout from "./components/Layout/Layout";
import RequireAuthCustomer from "./components/RequireAuth/RequireAuthCustomer";
// 
function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes*/}
        <Route path='/' element={<h1></h1>} />
        <Route path='login' element={<LoginBanner />} />
        <Route path='signup' element={<SignUP />} />


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
