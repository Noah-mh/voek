import { Request, Response, NextFunction } from "express";
import * as voucherModel from "../model/voucher.model";

export const insertVoucherAmount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      seller_id,
      type,
      amount,
      voucher_category,
      min_spend,
      redemptions_available,
      active,
    } = req.body;
    const response: number = await voucherModel.handlesInsertingVoucherAmount(
      name,
      seller_id,
      type,
      amount,
      voucher_category,
      min_spend,
      redemptions_available,
      active
    );
    if (response === 0) return res.sendStatus(404);
    return res.sendStatus(201);
  } catch (err: any) {
    return next(err);
  }
};

export const updateRedemptionsAvailable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { voucher_id, redemptions_available } = req.body;
    const response: number =
      await voucherModel.handlesUpdateRedemptionsAvailable(
        voucher_id,
        redemptions_available
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
    const { voucherId } = req.body;
    const response: number = await voucherModel.handlesDeleteVoucher(voucherId);
    if (response === 0) return res.sendStatus(404);
    return res.sendStatus(202);
  } catch (err: any) {
    return next(err);
  }
};
