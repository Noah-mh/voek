import { useEffect, useState } from "react";
import useAxiosPrivateCustomer from "../../hooks/UseAxiosPrivateCustomer";
import useCustomer from "../../hooks/UseCustomer";
import { Link } from "react-router-dom";

interface Product {
    description: string;
    name: string;
    price: number;
    product_id: number;
    variation_1?: string;
    variation_2?: string;
    quantity: number;
    sku: string,
    orders_date: string
  }

const ViewOrders = () => {

    const [orders, setOrders] = useState<Product[]>([])
    const axiosPrivateCustomer = useAxiosPrivateCustomer()
    const { customer } = useCustomer()

    useEffect(() => {
        const getOrders = async () => {
            try {
                const result: any = await axiosPrivateCustomer.get(`/customer/orders/${customer.customer_id}`)
                setOrders(result.data.listedOrders)
            } catch (err: any) {
                console.log(err);
            }
        }
        getOrders();
        console.log(orders)
    }, [])

    return (
        <div>

            {
                orders.map((order: Product) => (
                    <div key={order.sku} className="bg-orange-500 mb-5">
                        <Link to={`/productDetailsWithReviews/${order.product_id}`}>{order.name}</Link>
                        <p>{order.description}</p>
                        <p>Price Of Product{order.price}</p>
                        <p>Amount Bought{order.quantity}</p>
                        <h2>Total Price{order.quantity * order.quantity}</h2>
                        <div>
                            <p>The Variation You Bought</p>
                            <p>
                                {
                                    order.variation_1 && order.variation_2 ?
                                        `${order.variation_1} and ${order.variation_2}`
                                        : order.variation_1 ?
                                            order.variation_1
                                            : order.variation_2 ?
                                                order.variation_2
                                                : "No Variation"
                                }
                            </p>
                            <h3>Order was made on the {convertUtcToDateString(order.orders_date)}</h3>
                        </div>
                    </div>
                ))
            }

        </div>
    )
}

export default ViewOrders

function convertUtcToDateString(utcTime) {
    const date = new Date(utcTime);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month starts from 0
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }