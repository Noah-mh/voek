import "./App.css";
import { Route, Routes } from "react-router-dom";
import Missing from "./components/Missing/Missing";
import LoginBannerSeller from "./components/LoginBannerSeller/LoginBannerSeller.js";
import LoginBanner from "./components/LoginBanner/LoginBanner.js";
import SignupBannerCustomer from "./components/SignupBannerCustomer/SignupBannerCustomer.js";
import Layout from "./components/Layout/Layout";
import Homepage from "./components/homepage/Homepage.js";
import RequireAuthCustomer from "./components/RequireAuth/RequireAuthCustomer";
import CartPage from "./components/UserCart/UserCart.js";
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
import Checkout from "./components/Checkout/Checkout.js";
import CustomerProfilePage from "./components/Customer/CustomerProfilePage.js";
import LastViewed from "./components/LastViewed(History)/LastViewed.js";
import ViewCustomerOrders from "./components/SellerSidebar/ViewCustomerOrders.js";
import CategoryResults from "./components/CategoryResults/CategoryResults.js";
import SellerProfile from "./components/SellerProfile/SellerProfile.js";
import VerifySellerEmail from "./components/SellerProfile/VerifySellerEmail.js";
import VerifyCustomerEmail from "./components/Customer/VerifyCustomerEmail.js";
import SellerVouchers from "./components/SellerVouchers/SellerVouchers.js";
import RedeemVoucher from "./components/RedeemVoucher/RedeemVoucher.js";
import CustomerSellerProfilePage from "./components/Product/CustomerSellerProfilePage.js";
import Chat from "./components/Chat/Chat.js";
import Analytics from "./components/CustomerAnalytics/Analytics.js";
// import Game from "./components/Game/Game.js";
// import MainGame from "./components/Game/assets/MainGame.js";
import DailyCoins from "./components/DailyCoin/DailyCoin.js";
import ClaimVouchers from "./components/RedeemVoucher/ClaimVouchers.js";

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
        {/* <Route path="monkeyRun" element={<Game />} />
        <Route path="hell" element={<MainGame />} /> */}

        {/* Customer Routes */}
        <Route element={<PersistLoginCustomer />}>
          {/* Public Routes with persist login */}

          <Route path="/" element={<Homepage />} />

          <Route path="/" element={<Homepage />} />
          <Route path="login" element={<LoginBanner />} />
          <Route path="signup" element={<SignupBannerCustomer />} />
          <Route
            path="productDetailsWithReviews/:product_id"
            element={<ProductDetailWithReview />}
          />
          <Route path="searchResults/:userInput?" element={<SearchResults />} />
          <Route
            path="categoryResults/:categoryId"
            element={<CategoryResults />}
          />

          <Route
            path="customer/email-verification"
            element={<VerifyCustomerEmail />}
          />
          <Route path="test" element={<RedeemVoucher seller_id={1} />} />

          <Route
            path="customerSellerProfile/:seller_id"
            element={<CustomerSellerProfilePage />}
          />
          <Route path="claimVouchers" element={<ClaimVouchers />} />

          <Route element={<RequireAuthCustomer />}>
            {/* Protected Routes with persist login */}
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="customer/cart" element={<CartPage />} />
            <Route path="customer/checkout" element={<Checkout />} />
            <Route path="profile" element={<CustomerProfilePage />} />
            <Route path="lastViewed" element={<LastViewed />} />
            {/* <Route path="analytics" element={<Analytics />} /> */}
            <Route path="chat" element={<Chat userType="customer" />} />
            <Route path="customer/dailyCheckIn" element={<DailyCoins />} />
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
        <Route
          path="seller/email-verification"
          element={<VerifySellerEmail />}
        />

        {/* Protected Routes for seller only*/}
        <Route element={<PersistLoginSeller />}>
          <Route path="seller/login" element={<LoginBannerSeller />} />
          <Route path="seller/signup" element={<SignupBannerSeller />} />
          <Route element={<RequireAuthSeller />}>
            <Route path="seller/home" element={<HomepageSeller />} />
            <Route path="seller/orders" element={<ViewCustomerOrders />} />
            <Route path="seller/profile" element={<SellerProfile />} />
            <Route path="seller/vouchers" element={<SellerVouchers />} />
            <Route path="seller/chat" element={<Chat userType="seller" />} />
          </Route>
        </Route>
      </Route>

      {/* unauthorized or forbidden */}
      <Route path="/*" element={<Missing />} />
    </Routes>
  );
}

export default App;
//
