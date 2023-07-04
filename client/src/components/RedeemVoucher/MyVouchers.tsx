import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import Button from '@mui/material/Button';

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


  const onClickHandler = async (e: any) => {
    e.preventDefault();
    try {
      await axiosPrivateCustomer.delete(
        `/customer/vouchers/${voucher.customer_voucher_id}/${voucher.voucher_id}`
      );
      getVouchers();
      toast.success("Voucher has been removed from your wallet", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 grid grid-cols-1 gap-4" style={{ width: '400px', height: '250px' }}>
      <h1 className="text-2xl font-bold mb-4">{voucher.voucher_name}</h1>
      <div className="mb-4">
        <h2 className="text-lg">Spend a minimum of {voucher.min_spend}</h2>
        {voucher.number_amount ? (
          <h2 className="text-lg mb-5">Get ${voucher.number_amount} off</h2>
        ) : (
          <h2 className="text-lg mb-5">Get {voucher.percentage_amount && voucher.percentage_amount * 100}% off</h2>
        )}
        <Button
          onClick={onClickHandler}
          color="primary"
          size="large"
          variant="contained"
          className="col-span-1"
        >
          Remove from wallet
        </Button>
      </div>
    </div>
  );
};

export default MyVouchers;
