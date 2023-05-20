import { PayPalButtons } from '@paypal/react-paypal-js';
import useAxiosPrivateCustomer from '../../hooks/useAxiosPrivateCustomer';
import { useEffect, useRef, useState } from 'react';

interface Props {
    paypalAmount: number
}

const PayPalPayment = ({ paypalAmount }: Props) => {

    const amountRef = useRef<number>()
    const [amount, setAmount] = useState<number>()

    useEffect(() => {
        setAmount(paypalAmount);
        amountRef.current = paypalAmount; // Update the ref value whenever the state changes
        console.log(paypalAmount)
    }, [paypalAmount])

    const axiosPrivateCustomer = useAxiosPrivateCustomer();

    const createOrder = async (data: any) => {

        return axiosPrivateCustomer.post(`/create-paypal-order`, {
            amount: amountRef.current // Use the current value of the ref
        }).then(async (response: any) => {
            const temp = response.data.id
            return temp
        })
    };

    const onApprove = async (data: any) => {
        return axiosPrivateCustomer.post(`/capture-paypal-order`, {
            orderID: data.orderID
        })
            .then((response: any) => {
                console.log(response)
                console.log('success')
            });
    };

    return (
        <PayPalButtons
            createOrder={(data, actions) => createOrder(data)}
            onApprove={(data, actions) => onApprove(data)}
        />
    )
}

export default PayPalPayment
