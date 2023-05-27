import React from "react";
import { ToastContainer, toast } from "react-toastify";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import useCustomer from "../../hooks/UseCustomer";

interface CustomerVoucher {
  voucher_id: number;
  voucher_name: string;
  number_amount?: number;
  percentage_amount?: number;
  voucher_category: string;
  min_spend: number;
  customer_voucher_id: number;
  active: number;
}

interface Props {
  voucher: CustomerVoucher;
  getVouchers: () => void;
}

const MyVouchers = ({ voucher, getVouchers }: Props) => {
  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const onClickHandler = async () => {
    try {
      await axiosPrivateCustomer.delete(
        `/customer/vouchers/${voucher.customer_voucher_id}/${voucher.voucher_id}`
      );
      getVouchers();
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div
      className="max-w-xs mx-auto bg-white rounded-lg shadow-md p-6"
      style={{ width: "250px" }}
    >
      <h1 className="text-2xl font-bold mb-4">{voucher.voucher_name}</h1>
      <div className="mb-4">
        <h2 className="text-lg">Spend a minimum of {voucher.min_spend}</h2>
        <h2 className="text-md text-gray-500">{voucher.voucher_category}</h2>
        {voucher.number_amount ? (
          <h2 className="text-lg mb-3">Get ${voucher.number_amount} off</h2>
        ) : (
          <h2 className="text-lg mb-3">
            Get {voucher.percentage_amount && voucher.percentage_amount * 100}%
            off
          </h2>
        )}
        {!voucher.active ? (
          <h2 className="text-lg mb-3">Voucher is no longer available</h2>
        ) : null}
        <button
          onClick={onClickHandler}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Remove From Voucher Wallet
        </button>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default MyVouchers;
