import { useEffect, useState } from "react";
import useAxiosPrivateCustomer from "../../hooks/UseAxiosPrivateCustomer";
import useCustomer from "../../hooks/UseCustomer";

const ViewOrders = () => {

    const [orders, setOrders] = useState<Object[]>([])
    const axiosPrivateCustomer = useAxiosPrivateCustomer()
    const { customer } = useCustomer()

    useEffect(() => {
        const getOrders = async () => {
            try {
                const result: any = await axiosPrivateCustomer.get(`/customer/orders/${customer.customer_id}`)
                console.log(result.data)
            } catch (err: any) {
                console.log(err);
            }
        }
        getOrders();
    }, [])

    return (
        <div>ViewOrders</div>
    )
}

export default ViewOrders