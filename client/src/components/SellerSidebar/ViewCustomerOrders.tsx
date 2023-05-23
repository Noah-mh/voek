import { useEffect, useState } from 'react'
import useSeller from '../../hooks/useSeller';
import useAxiosPrivateSeller from '../../hooks/useAxiosPrivateSeller';

interface customerOrders {
    orders_id: number;
    username: string;
    email: string;
    postal_code: string;
    phone_number: number;
    block: string;
    unit_no: string;
    street_name: string;
    orders_date: string;
    sku: string;
    variation_1: string;
    variation_2: string;
    product_id: number;
    customer_id: number;
    orders_product_id: number;
    total_price: number;
    quantity: number;
    shipment_id: number | null;
    shipment_created: string | null;
    shipment_delivered: string | null;
    name: string;
    description: string;
}



const ViewCustomerOrders = () => {

    const axiosPrivateSeller = useAxiosPrivateSeller();
    const { seller } = useSeller();
    const searchParams = new URLSearchParams(location.search);
    const orders_id: string | null = searchParams.get('orders_id');

    const [customerOrders, setCustomerOrders] = useState<customerOrders[]>([]);


    useEffect(() => {
        const getCustomerOrder = async () => {
            const result = await axiosPrivateSeller.get(`/seller/customer/${orders_id}/${seller.seller_id}`);
            setCustomerOrders(result.data.orders);
            console.log(result.data.orders)
        }
        getCustomerOrder()
    }, [])

    return (
        <div className="container mx-auto">
            <div className="bg-gray-100 p-8 rounded-lg mb-8">
                <h1 className="text-4xl font-bold mb-4">{customerOrders[0]?.username}'s Order</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h1 className="text-2xl mb-2">{customerOrders[0]?.email}</h1>
                        <h1 className="text-2xl mb-2">{customerOrders[0]?.phone_number}</h1>
                        <h1 className="text-xl mb-2">Order Address:</h1>
                        <p>{customerOrders[0]?.block}, {customerOrders[0]?.street_name}, {customerOrders[0]?.unit_no}</p>
                        <h1 className="text-xl mb-2">Postal Code: {customerOrders[0]?.postal_code}</h1>
                    </div>
                    <div>
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="text-2xl font-bold mb-4">Order History</h1>
                            <p className="text-lg">Order Created: {convertUtcToLocal(customerOrders[0]?.orders_date)}</p>
                            {customerOrders[0]?.shipment_created && (
                                <p className="text-lg">Order Shipped: {convertUtcToLocal(customerOrders[0]?.shipment_created)}</p>
                            )}
                            {customerOrders[0]?.shipment_delivered && (
                                <p className="text-lg">Order Delivered: {convertUtcToLocal(customerOrders[0]?.shipment_delivered)}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {customerOrders.map((customerOrder) => (
                <div className="bg-white p-4 rounded-lg mb-4" key={customerOrder.orders_product_id}>
                    <h1 className="text-2xl font-bold">{customerOrder.name}</h1>
                    <h1 className="text-lg mb-2">{customerOrder.description}</h1>
                    <p className="text-base">
                        {customerOrder.variation_1 && customerOrder.variation_2
                            ? `${customerOrder.variation_1} and ${customerOrder.variation_2}`
                            : customerOrder.variation_1
                                ? customerOrder.variation_1
                                : customerOrder.variation_2
                                    ? customerOrder.variation_2
                                    : "No Variation"}
                    </p>
                </div>
            ))}
        </div>
    )
}

export default ViewCustomerOrders

function convertUtcToLocal(utcTime: string): string {
    // Convert UTC time to local time
    const localTime = new Date(utcTime);

    // Get the local date components
    const day = localTime.getDate();
    const month = localTime.getMonth() + 1; // Months are zero-based
    const year = localTime.getFullYear();

    // Format the local time as DD/MM/YYYY
    const formattedLocalTime = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    return formattedLocalTime;
}
