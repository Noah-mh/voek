import { Link } from 'react-router-dom';
import useAxiosPrivateCustomer from '../../hooks/useAxiosPrivateCustomer';
import { cld } from "../../Cloudinary/Cloudinary";
import { AdvancedImage } from "@cloudinary/react";

interface Product {
  description: string;
  name: string;
  price: number;
  product_id: number;
  variation_1?: string;
  variation_2?: string;
  quantity: number;
  sku: string,
  orders_date?: string;
  shipment_created?: string;
  shipment_delivered?: string
  orders_product_id?: number;
  image_url?: string;
}


interface Props {
  deliveredOrders: Product[];
  getAll: () => void;
}


const ViewDelivered = ({ deliveredOrders, getAll }: Props) => {

  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const buttonHandler = async (orders_product_id: number) => {
    try {
      const result = await axiosPrivateCustomer.get(`/customer/received/${orders_product_id}`)
      getAll();
    } catch (err: any) {
      console.log(err);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="mb-8 text-4xl font-bold">Delivered Orders</h1>
      {deliveredOrders.map((order: Product) => (

        <div key={order.sku} className="mb-8 border border-gray-300 rounded p-4 w-4/5">
          <AdvancedImage cldImg={cld.image(order.image_url)} />
          <Link to={`/productDetailsWithReviews/${order.product_id}`} className="text-blue-500 hover:underline">
            {order.name}
          </Link>
          <p className="mb-2">{order.description}</p>
          <p>Price of Product: {order.price}</p>
          <p>Amount Bought: {order.quantity}</p>
          <h2 className="text-2xl">Total Price: {order.price * order.quantity}</h2>
          <div className="mt-4">
            <p className="font-bold">The Variation You Bought</p>
            <p>
              {order.variation_1 && order.variation_2
                ? `${order.variation_1} and ${order.variation_2}`
                : order.variation_1
                  ? order.variation_1
                  : order.variation_2
                    ? order.variation_2
                    : "No Variation"}
            </p>
            <h3 className="mt-2 text-lg">Shipment was received on {convertUtcToLocal(order.shipment_created!)}</h3>
            <button color="primary" onClick={() => { buttonHandler(order.orders_product_id!) }}>Order Received</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ViewDelivered

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
