import { Request, Response, NextFunction } from "express";
import * as voucherModel from "../model/voucher.model";

export const insertVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      sellerId,
      type,
      amount,
      Category,
      minSpend,
      expiryDate,
      redemptionsAvailable,
    } = req.body;
    if (
      name === undefined ||
      sellerId === undefined ||
      type === undefined ||
      amount === undefined ||
      Category === undefined ||
      minSpend === undefined ||
      expiryDate === undefined ||
      redemptionsAvailable === undefined
    )
      return res.sendStatus(400);
    const response: number = await voucherModel.handlesInsertingVoucher(
      name,
      sellerId,
      type,
      amount,
      Category,
      minSpend,
      expiryDate,
      redemptionsAvailable
    );
    if (response === 0) return res.sendStatus(404);
    return res.sendStatus(201);
  } catch (err: any) {
    return next(err);
  }
};

export const getVoucherCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response: any = await voucherModel.handlesGetVoucherCategories();
    return res.status(200).json(response);
  } catch (err: any) {
    return next(err);
  }
};

export const getVouchers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sellerId } = req.params;
    const response: any = await voucherModel.handlesGetVouchers(
      parseInt(sellerId)
    );
    return res.status(200).json(response);
  } catch (err: any) {
    return next(err);
  }
};

export const updateActive = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { voucherId, active } = req.body;
    const response: number = await voucherModel.handlesUpdateActive(
      voucherId,
      active
    );
    if (response === 0) return res.sendStatus(400);
    return res.sendStatus(204);
  } catch (err: any) {
    return next(err);
  }
};

export const updateVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      amount,
      percentage,
      category,
      minSpend,
      expiryDate,
      redemptionsAvailable,
      active,
      voucherId,
    } = req.body;
    if (
      name === undefined ||
      amount === undefined ||
      percentage === undefined ||
      category === undefined ||
      minSpend === undefined ||
      expiryDate === undefined ||
      redemptionsAvailable === undefined ||
      active === undefined ||
      voucherId === undefined
    )
      return res.sendStatus(400);
    const response: number = await voucherModel.handlesUpdateVoucher(
      name,
      amount,
      percentage,
      category,
      minSpend,
      expiryDate,
      redemptionsAvailable,
      active,
      voucherId
    );
    if (response === 0) return res.sendStatus(404);
    return res.sendStatus(204);
  } catch (err: any) {
    return next(err);
  }
};

export const deleteVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { voucherId } = req.params;
    const response: number = await voucherModel.handlesDeleteVoucher(
      parseInt(voucherId)
    );
    if (response === 0) return res.sendStatus(400);
    return res.sendStatus(202);
  } catch (err: any) {
    return next(err);
  }
};
