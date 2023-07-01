import { useState, useEffect } from 'react'
import useCustomer from '../../hooks/UseCustomer';
import { toast } from "react-toastify";
import useAxiosPrivateCustomer from '../../hooks/useAxiosPrivateCustomer';
import Loader from '../Loader/Loader';

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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [redeemed, setRedeemed] = useState<boolean>(false);
    const axiosPrivateCustomer = useAxiosPrivateCustomer()

    useEffect(() => {
        customer.customer_id && getCustomerVoucher();
    }, [])

    const getCustomerVoucher = async () => {
        try {
            const result: any = await axiosPrivateCustomer.get(`/customer/vouchers/${customer.customer_id}`);
            const customerVouchers: CustomerVoucher[] = result.data.vouchers;
            console.log(customerVouchers)
            const foundVoucher = customerVouchers.find(voucherID => voucherID.voucher_id === voucher.voucher_id);
            setRedeemed(foundVoucher ? true : false)
        } catch (err: any) {
            console.log(err)
        } finally {
            setIsLoading(false);
        }
    }

    const onClickHandler = async (e: any) => {
        e.preventDefault();
        if (customer.customer_id) {
            await axiosPrivateCustomer.put(`/customer/vouchers/${customer.customer_id}/${voucher.voucher_id}}`);
            toast.success("Voucher has been claimed. Please check ur voucher waller 🤡", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setRedeemed(true);
        } else {
            toast.warning("Login To Redeem Voucher. 🤡", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6" style={{ width: '250px' }}>
            <h1 className="text-2xl font-bold mb-4">{voucher.voucher_name}</h1>
            <div className="mb-4">
                <h2 className="text-lg">Spend a minimum of {voucher.min_spend}</h2>
                {voucher.number_amount ? (
                    <h2 className="text-lg mb-5">Get ${voucher.number_amount} off</h2>
                ) : (
                    <h2 className="text-lg mb-5">Get {voucher.percentage_amount && voucher.percentage_amount * 100}% off</h2>
                )}
                {isLoading ? <Loader />
                    : !voucher.active ? <h2 className="text-lg">Voucher is no longer available</h2> :
                        redeemed ? <h2 className="text-lg">Voucher has been redeemed</h2> :
                            <button
                                onClick={onClickHandler}
                                className="bg-blue-500 text-white py-2 px-4 rounded-md"
                            >
                                Redeem Now!!!
                            </button>}
            </div>
        </div>
    )
}

export default Voucher