import { useState, useEffect } from "react";
import useCustomer from "../../hooks/UseCustomer";
import { toast, Id } from "react-toastify";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import Loader from "../Loader/Loader";
import Button from "@mui/material/Button";

interface Voucher {
  voucher_id: number;
  voucher_name: string;
  number_amount?: number;
  percentage_amount?: number;
  voucher_category: string;
  min_spend?: number;
  active: number;
}

interface Props {
  voucher: Voucher;
}

interface CustomerVoucher {
  voucher_id: number;
}

const Voucher = ({ voucher }: Props) => {
  const { customer } = useCustomer();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [redeemed, setRedeemed] = useState<boolean>(false);
  const [toastId, setToastId] = useState<Id | undefined>(undefined);
  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  useEffect(() => {
    customer.customer_id && getCustomerVoucher();
  }, []);

  const getCustomerVoucher = async () => {
    setIsLoading(true);
    try {
      const result: any = await axiosPrivateCustomer.get(
        `/customer/vouchers/${customer.customer_id}`
      );
      const customerVouchers: CustomerVoucher[] = result.data.vouchers;
      console.log(customerVouchers);
      const foundVoucher = customerVouchers.find(
        (voucherID) => voucherID.voucher_id === voucher.voucher_id
      );
      setRedeemed(foundVoucher ? true : false);
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickHandler = async (e: any) => {
    e.preventDefault();
    if (customer.customer_id) {
      await axiosPrivateCustomer.put(
        `/customer/vouchers/${customer.customer_id}/${voucher.voucher_id}}`
      );
      toast.dismiss(toastId);
      const id = toast.success(
        "Voucher has been claimed. Please check ur voucher waller 🤡",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      setToastId(id);
      setRedeemed(true);
    } else {
      toast.dismiss(toastId);
      const id = toast.warning("Login To Redeem Voucher. 🤡", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setToastId(id);
    }
  };

  return (
    <div
      className="max-w-md bg-white rounded-lg shadow-md p-6 mx-4"
      style={{ width: "400px", height: "220px" }}
    >
      <h1 className="text-2xl font-bold mb-4">{voucher.voucher_name}</h1>
      <div className="mb-4">
        <h2 className="text-lg">Spend a minimum of {voucher.min_spend}</h2>
        {voucher.number_amount ? (
          <h2 className="text-lg mb-5">Get ${voucher.number_amount} off</h2>
        ) : (
          <h2 className="text-lg mb-5">
            Get {voucher.percentage_amount && voucher.percentage_amount * 100}%
            off
          </h2>
        )}
        {isLoading ? (
          <Loader />
        ) : !voucher.active ? (
          <Button
            color="error"
            size="large"
            variant="contained"
            disabled
            className="col-span-1"
          >
            Voucher is no longer available
          </Button>
        ) : redeemed ? (
          <Button
            color="error"
            size="large"
            variant="contained"
            disabled
            className="col-span-1"
          >
            Voucher redeemed already
          </Button>
        ) : (
          <Button
            onClick={onClickHandler}
            color="primary"
            size="large"
            variant="contained"
            className="col-span-1"
          >
            Redeem Now!!!
          </Button>
        )}
      </div>
    </div>
  );
};

export default Voucher;
