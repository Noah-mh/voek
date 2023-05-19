import { PayPalButtons } from '@paypal/react-paypal-js';
import useAxiosPrivateCustomer from '../../hooks/useAxiosPrivateCustomer';
import { useEffect, useState } from 'react';

interface Props {
    paypalAmount: number
}

const PayPalPayment = ({ paypalAmount }: Props) => {

    const [amount, setAmount] = useState<number>()

    useEffect(() => {
        setAmount(paypalAmount);
    }, [paypalAmount])

    const axiosPrivateCustomer = useAxiosPrivateCustomer();

    const createOrder = async (data: any) => {

        return axiosPrivateCustomer.post(`/create-paypal-order`, {
            amount
        }).then(async (response: any) => {
            const temp = response.data.id
            return temp
        })
    };

    const onApprove = async (data: any) => {
        return axiosPrivateCustomer.post(`/capture-paypal-order`, {
            orderID: data.orderID
        })
            .then((response: any) => response);
    };

    return (
        <PayPalButtons
            createOrder={(data, actions) => createOrder(data)}
            onApprove={(data, actions) => onApprove(data)}
        />
    )
}

export default PayPalPayment