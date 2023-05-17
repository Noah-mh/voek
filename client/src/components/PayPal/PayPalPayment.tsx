import { PayPalButtons } from '@paypal/react-paypal-js';
import useAxiosPrivateCustomer from '../../hooks/useAxiosPrivateCustomer';

const PayPalPayment = () => {

    const axiosPrivateCustomer = useAxiosPrivateCustomer();

    const createOrder = async (data: any) => {

        return axiosPrivateCustomer.post(`$/my-server/create-paypal-order`, {
            cart: [
                {
                    product_id: 1,
                    name: "product 1",
                    quantity: 1,
                }
            ]
        })


            .then(async (response: any) => {
                const temp = response.data.id
                return temp
            })
    };

    return (
        <div>PayPalPayment</div>
    )
}

export default PayPalPayment