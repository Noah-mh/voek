import "./signUP.css";

// havent finish any of the routes

const Signup = (): JSX.Element => {

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
  }

  return (
    <div className="right w-1/2  h-full flex-wrap justify-center p-12">
      <h1 className=" text-center font-bold">SIGN UP</h1>
      <form onSubmit={submitHandler} className="pt-6">
        <div className="field-wrapper flex">
          <input
            type="text"
            name="username"
            placeholder="USERNAME"
            className="w-72"
            autoComplete="off"
          />
        </div>
        <div className="field-wrapper flex">
          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            autoComplete="off"
            className="w-72"
          />
        </div>
        <div className="field-wrapper flex">
          <input
            type="number"
            name="phoneNumber"
            placeholder="PHONE NUMBER"
            autoComplete="new-phoneNumber"
            className="w-72"
          />
        </div>
        <input type="submit" value="GET OTP" className="submitLogin" />
      </form>
    </div>
  );
};
export default Signup;
