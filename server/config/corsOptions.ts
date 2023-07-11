import allowedOrigins from "./allowedOrigin";

const corsOptions = {
  origin: (origin: any, callback: any) => {
    console.log("origin: ", origin);
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log("Not allowed by CORS...");
      callback(new Error("Not allowed by CORS..."));
    }
  },
  optionSuccessStatus: 200,
};
export default corsOptions;
