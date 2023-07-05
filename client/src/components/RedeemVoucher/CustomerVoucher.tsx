import { useEffect, useState } from 'react';
import useAxiosPrivateCustomer from '../../hooks/useAxiosPrivateCustomer';
import useCustomer from "../../hooks/UseCustomer"
import { v4 as uuidv4 } from 'uuid';
import MyVouchers from './MyVouchers';
import { ToastContainer } from 'react-toastify';

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


const CustomerVoucher = () => {

    const { customer } = useCustomer();
    const axiosPrivateCustomer = useAxiosPrivateCustomer()
    const [myVouchers, setMyVouchers] = useState<CustomerVoucher[]>([]);

    const getVouchers = async () => {
        const { data } = await axiosPrivateCustomer.get(`customer/vouchers/wallet/${customer.customer_id}`);
        setMyVouchers(data.vouchers)
    }

    useEffect(() => {
        getVouchers();
    }, [])

    return (
        <>
            <ToastContainer />
            <div className="flex flex-wrap gap-4">
                {myVouchers.map((voucher: CustomerVoucher) => (
                    <div key={uuidv4()} className="flex-auto">
                        <MyVouchers voucher={voucher} getVouchers={getVouchers} />
                    </div>
                ))}
            </div>
        </>
    )
}

export default CustomerVoucher