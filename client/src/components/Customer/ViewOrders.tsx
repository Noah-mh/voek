import { Link } from "react-router-dom";
import { cld } from "../../Cloudinary/Cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Product {
  description: string;
  name: string;
  price: number;
  product_id: number;
  variation_1?: string;
  variation_2?: string;
  quantity: number;
  sku: string;
  orders_date?: string;
  shipment_created?: string;
  shipment_delivered?: string;
  image_url?: string;
  orders_product_id?: number;
  seller_id: string;
  orders_id: string;
  shop_name: string;
}

type Order = {
  orders_id: number;
  seller_id: number;
  [key: string]: any;
};


interface Props {
  orders: Product[];
}

const ViewOrders = ({ orders }: Props) => {
  const [orderedOrders, setOrderedOrders] = useState<any>();

  useEffect(() => {
    const orderOrders = () => {
      const updatedOrders: Record<string, Record<string, Order[]>> = {};

      orders.forEach((order: any) => {
        const { orders_id, seller_id } = order;

        // Create two keys, one for orders_id and one for the combination of orders_id and seller_id
        const ordersKey = `orders_${orders_id}`;
        const combinedKey = `${orders_id}_${seller_id}`;

        // Initialize the array if it doesn't exist yet
        if (!updatedOrders[ordersKey]) {
          updatedOrders[ordersKey] = {};
        }

        // Initialize the array for the combination if it doesn't exist yet
        if (!updatedOrders[ordersKey][combinedKey]) {
          updatedOrders[ordersKey][combinedKey] = [];
        }

        // Add the order to the array
        updatedOrders[ordersKey][combinedKey].push(order);
      });

      // Convert the object to an array of arrays
      const orderedOrdersArray: Order[][][] = Object.values(updatedOrders).map((orderGroup) =>
        Object.values(orderGroup)
      );
      console.log(orderedOrdersArray)
      setOrderedOrders(orderedOrdersArray);
    };

    orderOrders();
  }, [orders]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="mb-8 text-4xl font-bold">Orders</h1>
      {orderedOrders?.map((ordersArray: any) => (
        <div key={uuidv4()} className="mb-8 border border-red-300 rounded p-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">
              Order Date: {getLocalDate(ordersArray[0][0].orders_date)} {getLocalTime(ordersArray[0][0].orders_date)}
            </h1>
          </div>
          {ordersArray.map((Orders: any) => (
            <div>
              <h1 className="text-xl font-bold">Seller: {Orders[0].shop_name}</h1>
              <div className="flex flex-row justify-between border border-blue-300">
                {
                  Orders.map((order: Product) => (
                    <div
                      key={order.sku}
                      className="mb-8 border border-gray-300 rounded p-4 "
                    >
                      <div className="w-64 h-64">
                        {" "}
                        <AdvancedImage cldImg={cld.image(order.image_url)} />
                      </div>
                      <Link
                        to={`/productDetailsWithReviews/${order.product_id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {order.name}
                      </Link>
                      <p className="mb-2">{order.description}</p>
                      <p>Price of Product: {order.price}</p>
                      <p>Amount Bought: {order.quantity}</p>
                      <h2 className="text-2xl">
                        Total Price: {order.price * order.quantity}
                      </h2>
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
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      ))
      }
    </div >
  );
};

export default ViewOrders;

function getLocalTime(utcTime: string): string {
  const localTime = new Date(utcTime);
  const offsetInMinutes = localTime.getTimezoneOffset();
  localTime.setMinutes(localTime.getMinutes() - offsetInMinutes);
  const hours = localTime.getHours() % 12 || 12;
  const minutes = localTime.getMinutes();
  const period = localTime.getHours() >= 12 ? 'PM' : 'AM';
  const localTimeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  return localTimeString;
}

function getLocalDate(utcTime: string): string {
  const localTime = new Date(utcTime);
  const offsetInMinutes = localTime.getTimezoneOffset();
  localTime.setMinutes(localTime.getMinutes() - offsetInMinutes);
  const day = localTime.getDate();
  const month = localTime.getMonth() + 1;
  const year = localTime.getFullYear();
  const localDateString = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  return localDateString;
}
