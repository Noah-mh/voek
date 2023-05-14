import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import Missing from "./components/Missing/Missing";
import LoginBanner from "./components/LoginBanner/LoginBanner";
import SignupBanner from "./components/SignupBanner/SignupBanner.js";
import Layout from "./components/Layout/Layout";
import RequireAuthCustomer from "./components/RequireAuth/RequireAuthCustomer";
import PersistLoginCustomer from "./components/PersistLogin/PersistLoginCustomer";
import PersistLoginSeller from "./components/PersistLogin/PersistLoginSeller.js";
import RequireAuthSeller from "./components/RequireAuth/RequireAuthSeller.js";
import ConfirmPassword from "./components/SignupBanner/ConfirmPassword.js";
import Test from "./components/test";
import LayoutSeller from "./components/Layout/LayouSeller.js";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Layout />}>

        <Route path='signup/verify' element={<ConfirmPassword />} />

        {/* Protected Routes for customer*/}
        <Route element={<PersistLoginCustomer />}>

          <Route path='/' element={<h1>Home</h1>} />
          <Route path='login' element={<LoginBanner />} />
          <Route path='signup' element={<SignupBanner />} />

          <Route element={<RequireAuthCustomer />}>
            <Route path='customer' element={<Test />} />
            <Route path='monkey' element={<Link to='/customer'>Customer</Link>} />
          </Route>
        </Route>

      </Route>


      <Route path='/' element={<LayoutSeller />}>

        {/* Protected Routes for seller only*/}
        <Route element={<PersistLoginSeller />}>
          <Route element={<RequireAuthSeller />}>

          </Route>
        </Route>

      </Route>

      {/* unauthorized or forbidden */}
      <Route path="/*" element={<Missing />} />
    </Routes>
  );
}

export default App;
