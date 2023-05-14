import Header from "../header/header";
import Footer from "../footer/footer";
import { Link } from "react-router-dom";
import loginPhoto from "../../img/login/loginVec.png";

const Missing = () => {
  return (
    <>
      <Header />
      <div className="containerZ main w-screen h-screen flex">
        <div className="cardZ bg-white flex w-2/3 h-3/5 justify-between mx-auto my-20 rounded-md overflow-hidden">
          <div className="left  w-1/2 h-full flex-wrap py-7">
            <img src={loginPhoto} alt="loginPhoto" className="w-3/5 mx-auto" />
            <h1 className="text-center pt-4 text-white">
              Explore a new world with VOEK.
            </h1>
          </div>
          <div className="right w-1/2  h-full flex-wrap justify-center p-12">
            <h1 className="mb-5">Page You Were Looking For Is Invalid</h1>
            <Link to='/'><h2>Go Home</h2></Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Missing