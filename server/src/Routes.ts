import { Express, Request, Response } from "express";
import { processLogin, processSendEmailOTP, processSendSMSOTP, processVerifyOTP, processSignUp, processSendEmailLink, processSignUpLink } from "./controller/customer.controller";
import verifyJWT from "./middlewares/verifyJwt";
import verifyRoles from "./middlewares/verifyRoles";
import {
  processPublicProductDetails,
  processCartDetails,
} from "./controller/product.controller";


export default function (app: Express) {

  // KANG RUI ENDPOINTS
  app.post('/login', processLogin);
  app.post('/auth/SMS/OTP', processSendSMSOTP);
  app.post('/auth/email/OTP', processSendEmailOTP);
  app.post('/auth/verify/OTP', processVerifyOTP);
  app.post('/signup/link', processSendEmailLink);
  app.post('/signup/verify/link', processSignUpLink);
  app.post('/signup', processSignUp);
  //


  app.get("/productDetails", processPublicProductDetails);
  app.get("/cartDetails", processCartDetails);
}