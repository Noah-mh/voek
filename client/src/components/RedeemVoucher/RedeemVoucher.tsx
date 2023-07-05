import { useState, useEffect } from "react";
import axios from "../../api/axios";
import Voucher from "./Voucher.js";
import "./css/RedeemVoucher.css";

interface Props {
  seller_id: number;
}

interface voucher {
  voucher_id: number;
  voucher_name: string;
  number_amount?: number;
  percentage_amount?: number;
  voucher_category: string;
  min_spend?: number;
  active: number;
}

const RedeemVoucher = ({ seller_id }: Props) => {
  const [vouchers, setVouchers] = useState<voucher[]>([]);

  const getVouchers = async () => {
    try {
      const result: any = await axios.get(`/seller/vouchers/${seller_id}`);
      setVouchers(result.data.vouchers);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    getVouchers();
  }, []);

  return (
    <div className="redeemVoucherContainer flex w-[430px] h-auto overflow-x-auto space-x-4 p-4">
      {vouchers.map((voucher: Voucher, index: number) => (
        <div key={index} className="w-200">
          <Voucher voucher={voucher} />
        </div>
      ))}
    </div>
  );
};

export default RedeemVoucher;
