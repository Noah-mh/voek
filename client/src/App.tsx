import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import Missing from "./components/Missing/Missing";
import LoginBanner from "./components/LoginBanner/LoginBanner.js";
import SignupBanner from "./components/SignupBanner/SignupBanner.js";
import Layout from "./components/Layout/Layout";
import Homepage from "./components/Homepage/Homepage.js";
import RequireAuthCustomer from "./components/RequireAuth/RequireAuthCustomer";
import CartPage from "./components/cart/UserCart";
import PersistLoginCustomer from "./components/PersistLogin/PersistLoginCustomer";
import PersistLoginSeller from "./components/PersistLogin/PersistLoginSeller.js";
import RequireAuthSeller from "./components/RequireAuth/RequireAuthSeller.js";
import ConfirmPassword from "./components/SignupBanner/ConfirmPassword.js";
import Test from "./components/test";
import LayoutSeller from "./components/Layout/LayouSeller.js";
import Wishlist from "./components/Wishlist/Wishlist.js";
import ProductDetailWithReview from "./components/Product/ProductDetailsWithReviews.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="signup/verify" element={<ConfirmPassword />} />

        {/* Customer Routes */}
        <Route element={<PersistLoginCustomer />}>
          {/* Public Routes with persist login */}

          <Route path="/" element={<Homepage />} />
          <Route path="login" element={<LoginBanner />} />
          <Route path="signup" element={<SignupBanner />} />
          <Route
            path="productDetailsWithReviews/:product_id"
            element={<ProductDetailWithReview />}
          />
          <Route path="/customer/cart" element={<CartPage />} />

          <Route element={<RequireAuthCustomer />}>
            {/* Prtoected Routes with persist login */}

            <Route path="customer" element={<Test />} />
            <Route
              path="monkey"
              element={<Link to="/customer">Customer</Link>}
            />
          </Route>
          <Route path="wishlist" element={<Wishlist />} />
        </Route>
      </Route>

      {/* Seller Routes */}
      <Route path="/" element={<LayoutSeller />}>
        {/* Protected Routes for seller only*/}
        <Route element={<PersistLoginSeller />}>
          <Route element={<RequireAuthSeller />}></Route>
        </Route>
      </Route>

      {/* unauthorized or forbidden */}
      <Route path="/*" element={<Missing />} />
    </Routes>
  );
}

export default App;
