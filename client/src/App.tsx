import "./App.css";
import { Route, Routes } from "react-router-dom";
import Missing from "./components/Missing/Missing";
import LoginBannerSeller from "./components/LoginBannerSeller/LoginBannerSeller.js";
import LoginBanner from "./components/LoginBanner/LoginBanner.js";
import SignupBannerCustomer from "./components/SignupBannerCustomer/SignupBannerCustomer.js";
import Layout from "./components/Layout/Layout";
import Homepage from "./components/Homepage/Homepage.js";
import RequireAuthCustomer from "./components/RequireAuth/RequireAuthCustomer";
import CartPage from "./components/Cart/UserCart.js";
import VerifySignupSeller from "./components/SignupSeller/VerifySignupSeller.js";
import SignupBannerSeller from "./components/SignupSeller/SignupBannerSeller.js";
import ResetPasswordSeller from "./components/ResetPasswordSeller/ResetPasswordSeller.js";
import PersistLoginCustomer from "./components/PersistLogin/PersistLoginCustomer";
import PersistLoginSeller from "./components/PersistLogin/PersistLoginSeller.js";
import RequireAuthSeller from "./components/RequireAuth/RequireAuthSeller.js";
import VerifySignupCustomer from "./components/SignupBannerCustomer/VerifySignupCustomer.js";
import LayoutSeller from "./components/Layout/LayoutSeller.js";
import Wishlist from "./components/Wishlist/Wishlist.js";
import ProductDetailWithReview from "./components/Product/ProductDetailsWithReviews.js";
import SearchResults from "./components/SearchResults/SearchResults.js";
import ForgetPasswordCustomer from "./components/ForgetPasswordCustomer/ForgetPasswordCustomer.js";
import ResetPasswordCustomer from "./components/ResetPasswordCustomer/ResetPasswordCustomer.js";
import ForgetPasswordSeller from "./components/ForgetPasswordSeller/ForgetPasswordSeller.js";
import HomepageSeller from "./components/HomepageSeller/HomepageSeller.js";
import ManageProducts from "./components/SellerSidebar/ManageProducts.js";
import AddProduct from "./components/SellerSidebar/AddProduct.js";
import ManageOrders from "./components/SellerSidebar/ManageOrders.js";

import ViewMyOrders from "./components/ViewMyOrders/ViewMyOrders.js";
import LastViewed from "./components/LastViewed(History)/LastViewed.js";
import SomeComponent from "./components/Test/cloudinaryTest.js";
import PayPal from "./components/PayPal/PayPal.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="signup/verify" element={<VerifySignupCustomer />} />
        <Route
          path="forgetPassword/verify"
          element={<ResetPasswordCustomer />}
        />
        <Route path="forgetPassword" element={<ForgetPasswordCustomer />} />

        {/* Customer Routes */}
        <Route element={<PersistLoginCustomer />}>
          {/* Public Routes with persist login */}

          <Route path="/" element={<Homepage />} />
          <Route path="login" element={<LoginBanner />} />
          <Route path="signup" element={<SignupBannerCustomer />} />
          <Route
            path="productDetailsWithReviews/:product_id"
            element={<ProductDetailWithReview />}
          />
          <Route path="test" element={<SomeComponent/>}/>
          <Route path="searchResults/:userInput" element={<SearchResults />} />
          <Route path="customer/cart" element={<CartPage />} />

          <Route path="lastViewed" element={<LastViewed />} />

          <Route element={<RequireAuthCustomer />}>
            {/* Prtoected Routes with persist login */}
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="customer/cart" element={<CartPage />} />
            <Route path="orders" element={<ViewMyOrders />} />
          </Route>
        </Route>
      </Route>

      {/* Seller Routes */}
      <Route path="/" element={<LayoutSeller />}>
        <Route path="seller/signup/verify" element={<VerifySignupSeller />} />
        <Route
          path="seller/forgetPassword/verify"
          element={<ResetPasswordSeller />}
        />
        <Route
          path="seller/forgetPassword"
          element={<ForgetPasswordSeller />}
        />

        {/* Protected Routes for seller only*/}
        <Route element={<PersistLoginSeller />}>
          <Route path="seller/login" element={<LoginBannerSeller />} />
          <Route path="seller/signup" element={<SignupBannerSeller />} />
          <Route element={<RequireAuthSeller />}>
            <Route path="seller/home" element={<HomepageSeller />} />
            <Route path="seller/manageProducts" element={<ManageProducts />} />
            <Route path="seller/addProduct" element={<AddProduct />} />
            <Route path="seller/manageOrders" element={<ManageOrders />} />
          </Route>
        </Route>
      </Route>

      {/* unauthorized or forbidden */}
      <Route path="/*" element={<Missing />} />
    </Routes>
  );
}

export default App;
