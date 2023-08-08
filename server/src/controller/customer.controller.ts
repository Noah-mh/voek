import jwt from "jsonwebtoken";
import config from "../../config/config";
import { UserInfo } from "../interfaces/interfaces";
import { Request, Response, NextFunction } from "express";
import * as customerModel from "../model/customer.model";

export const processLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.sendStatus(400);
  } else {
    try {
      const response: UserInfo | null = await customerModel.handleLogin(
        email,
        password
      );
      if (response) {
        return res.json(response);
      } else {
        res.sendStatus(401);
      }
    } catch (err: any) {
      return next(err);
    }
  }
};

export const processSendSMSOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phoneNumber, customer_id } = req.body;
    if (!phoneNumber || !customer_id) return res.sendStatus(400);
    const response = await customerModel.handleSendSMSOTP(
      phoneNumber,
      customer_id
    );
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const processSendEmailOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, customer_id } = req.body;
    if (!email || !customer_id) return res.sendStatus(400);
    const response = await customerModel.handleSendEmailOTP(email, customer_id);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const processVerifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id, OTP } = req.body;
    if (!customer_id || !OTP) return res.sendStatus(400);
    const response: any = await customerModel.handleVerifyOTP(customer_id, OTP);
    if (response.length) {
      const accessToken = jwt.sign(
        {
          UserInfo: {
            customer_id: response[0].customer_id,
            role: "customer",
          },
        },
        config.accessTokenSecret!,
        { expiresIn: "300s" }
      );
      const refreshToken = jwt.sign(
        {
          UserInfo: {
            customer_id: response[0].customer_id,
            role: "customer",
          },
        },
        config.refreshTokenSecret!,
        { expiresIn: "7d" }
      );
      await customerModel.handleStoreRefreshToken(
        refreshToken,
        response[0].customer_id
      );
      res.cookie("customerJwt", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ refreshToken, accessToken });
    } else {
      res.sendStatus(400);
    }
  } catch (err: any) {
    return next(err);
  }
};

export const processSendEmailLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, phone_number, password } = req.body;
    const { referral_id } = req.params;
    if (!email || !username || !phone_number || !password)
      return res.sendStatus(400);
    const result = await customerModel.handleSignUp(
      username,
      password,
      email,
      phone_number,
      referral_id
    );
    if (result === 1062) {
      return res.sendStatus(409);
    }
    const signUpToken = jwt.sign(
      { customer_id: result, referral_id },
      config.signUpCustomerTokenSecret!,
      { expiresIn: "300s" }
    );
    const result2 = await customerModel.handleSendEmailLink(signUpToken, email);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const processSignUpLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { signUpToken } = req.body;
    if (!signUpToken) return res.sendStatus(400);
    jwt.verify(
      signUpToken,
      config.signUpCustomerTokenSecret as any,
      (err: any, decoded: any) => {
        if (err) return res.sendStatus(403);
        const { customer_id, referral_id } = decoded;
        const result = customerModel.handleActiveAccount(
          customer_id,
          referral_id
        );
        return res.status(200);
      }
    );
  } catch (err: any) {
    return next(err);
  }
};

export const processLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  if (!cookies?.customerJwt) return res.sendStatus(204);
  const refreshToken = cookies.customerJwt;
  await customerModel.handleLogOut(refreshToken);
  res.clearCookie("customerJwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.sendStatus(204);
};

export const processForgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (!email) return res.sendStatus(400);
    const result: any = await customerModel.handleForgetPassword(email);
    if (result.length) {
      const forgetPasswordToken = jwt.sign(
        { customer_id: result[0].customer_id },
        config.forgetPasswordCustomerTokenSecret!,
        { expiresIn: "300s" }
      );
      await customerModel.handleSendEmailForgetPassword(
        forgetPasswordToken,
        email
      );
    }
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const processForgetPasswordLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { forgetPasswordToken } = req.body;
    if (!forgetPasswordToken) return res.sendStatus(400);
    jwt.verify(
      forgetPasswordToken,
      config.forgetPasswordCustomerTokenSecret as any,
      (err: any, decoded: any) => {
        if (err) return res.sendStatus(403);
        const { customer_id } = decoded;
        return res.json({ customer_id });
      }
    );
  } catch (err: any) {
    return next(err);
  }
};

export const processResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, customer_id } = req.body;
    if (!password || !customer_id) return res.sendStatus(400);
    const result = await customerModel.handleResetPassword(
      password,
      customer_id
    );
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const processGetReferralId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    if (!customer_id) return res.sendStatus(400);
    const result = await customerModel.handleGetReferralId(customer_id);
    return res.json({ referral_id: result });
  } catch (err: any) {
    return next(err);
  }
};

//ALLISON :D

export const processGetCoins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    const result = await customerModel.handleGetCoins(customer_id);
    console.log("Successfully got coins");
    return res.json({ result });
  } catch (err: any) {
    return next(err);
  }
};

export const processGetAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    const result = await customerModel.handleGetCustomerAddresses(customer_id);
    console.log("Successfully got address");
    return res.json(result);
  } catch (err: any) {
    return next(err);
  }
};

export const processGetLastCheckedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;

    const result = await customerModel.handleGetLastCheckedIn(customer_id);
    console.log("Successfully got last checked in");
    return res.json(result);
  } catch (err: any) {
    return next(err);
  }
};

export const processUpdateLastCheckedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.body;

    const result = await customerModel.handleUpdateCheckIn(customer_id);
    console.log("Successfully update last checked in");
    return res.json(result);
  } catch (err: any) {
    return next(err);
  }
};

export const processNewLastCheckedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.body;

    const result = await customerModel.handleNewLastCheckedIn(customer_id);
    console.log("Successfully added new checkedin");
    return res.json(result);
  } catch (err: any) {
    return next(err);
  }
};

export const processGetHighestScore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;

    const result = await customerModel.handleGetHighestScore(customer_id);
    console.log("Successfully got highest score");
    return res.json(result);
  } catch (err: any) {
    return next(err);
  }
};

export const processUpdateGameCoins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id, score } = req.body;

    const result = await customerModel.handleAddGameCoins(customer_id, score);
    console.log("Successfully added coins");
    return res.json(result);
  } catch (err: any) {
    return next(err);
  }
};

export const processUpdateLastPlayed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.body;

    const result = await customerModel.handleUpdateLastPlayed(customer_id);
    console.log("Successfully updated last played");
    return res.json(result);
  } catch (err: any) {
    return next(err);
  }
};

export const processUpdateHighestScore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id, highest_score } = req.body;

    const result = await customerModel.handleUpdateHighestScore(
      customer_id,
      highest_score
    );
    console.log("Successfully updated highest score");
    return res.json(result);
  } catch (err: any) {
    return next(err);
  }
};

// NHAT TIEN :D
export const updateCustomerLastViewedCat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId, customerId } = req.body;
    const response: Array<object> =
      await customerModel.handlesUpdateCustomerLastViewedCat(
        categoryId,
        customerId
      );
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};

export const getCustomerLastViewedCat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    const customerId = parseInt(customer_id);
    const response: Array<object> =
      await customerModel.handlesGetCustomerLastViewedCat(customerId);
    return res.send(response);
  } catch (err: any) {
    return next(err);
  }
};

//Noah
export const getCustomerDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    // Type checking for customer_id.
    const response = await customerModel.handlesCustomerDetails(
      parseInt(customer_id)
    );
    // Respond with status code and the data.
    return res.json({ details: response });
  } catch (err: any) {
    // Return a response with status code and error message.
    return res.status(500).json({ message: err.message });
  }
};

//Noah
export const updateCustomerDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, email, username, phone_number } = req.body;
    const { customer_id } = req.params;
    if (!customer_id) return res.sendStatus(400);
    const result = await customerModel.handleUpdateCustomerDetails(
      password,
      email,
      username,
      parseInt(phone_number),
      parseInt(customer_id)
    );
    if (result) return res.json(result);
    return res.sendStatus(201);
  } catch (err: any) {
    return next(err);
  }
};

export const processChangeEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { changeCustomerEmailToken } = req.body;
    if (!changeCustomerEmailToken) return res.sendStatus(400);
    jwt.verify(
      changeCustomerEmailToken,
      config.emailTokenSecret as any,
      async (err: any, decoded: any) => {
        if (err) return res.sendStatus(403);
        const { customer_id } = decoded;
        await customerModel.handleChangeEmail(customer_id);
        return res.sendStatus(200);
      }
    );
  } catch (err: any) {
    return next(err);
  }
};

//Noah
export const updateCustomerPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    const { image_url } = req.body;
    const customerId = parseInt(customer_id);
    const response: number = await customerModel.handleCustomerProfilePhotoEdit(
      image_url,
      customerId
    );
    if (!response) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const deactivateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    await customerModel.handleDeactivateAccount(parseInt(customer_id));
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const getCustomerStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    const result = await customerModel.handleGetCustomerStatus(
      parseInt(customer_id)
    );
    return res.json({ status: result });
  } catch (err: any) {
    return next(err);
  }
};

export const activateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    await customerModel.handleActivateAccount(parseInt(customer_id));
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

//Noah
export const processCustomerAddressAdd = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    const { postal_code, block, street_name, country, unit_no } = req.body;
    const customerId = parseInt(customer_id);
    const response: number = await customerModel.handleCustomerAddressAdd(
      postal_code,
      block,
      street_name,
      country,
      unit_no,
      customerId
    );
    if (!response) return res.sendStatus(404);
    console.log("Successfully added address with id ", response);
    return res.json(response);
  } catch (err: any) {
    return next(err);
  }
};

//Noah
export const processCustomerAddressDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id, address_id } = req.params;
    const customerId = parseInt(customer_id);
    const addressId = parseInt(address_id);
    const response: number = await customerModel.handleCustomerAddressDelete(
      addressId,
      customerId
    );
    if (!response) return res.sendStatus(404);
    console.log("Successfully deleted address");
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

//Noah
export const processCustomerAddressUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    const { address_id, postal_code, block, street_name, country, unit_no } =
      req.body;
    const customerId = parseInt(customer_id);
    const addressId = parseInt(address_id);
    const response: number = await customerModel.handleCustomerAddressUpdate(
      addressId,
      postal_code,
      block,
      street_name,
      country,
      unit_no,
      customerId
    );
    if (!response) return res.sendStatus(404);
    console.log("Successfully updated address");
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const processViewVouchers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    const result = await customerModel.handleViewVouchers(
      parseInt(customer_id)
    );
    return res.json({ vouchers: result });
  } catch (err: any) {
    return next(err);
  }
};

export const processCustomerVouchers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id } = req.params;
    const result = await customerModel.handleCustomerVouchers(
      parseInt(customer_id)
    );
    return res.json({ vouchers: result });
  } catch (err: any) {
    return next(err);
  }
};

export const processPutVouchers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_id, voucher_id } = req.params;
    await customerModel.handlePutVouchers(
      parseInt(customer_id),
      parseInt(voucher_id)
    );
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};

export const processDeleteVouchers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customer_voucher_id, voucher_id } = req.params;
    await customerModel.handleDeleteVouchers(
      parseInt(customer_voucher_id),
      parseInt(voucher_id)
    );
    return res.sendStatus(200);
  } catch (err: any) {
    return next(err);
  }
};
