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
}

interface Props {
  orders: Product[];
}

const ViewOrders = ({ orders }: Props) => {
  const [orderedOrders, setOrderedOrders] = useState<any>();

  useEffect(() => {
    const orderOrders = () => {
      const updatedOrders: any = {};

      orders.forEach((order) => {
        const { orders_id, seller_id } = order;

        // Create a key that combines orders_id and seller_id
        const key = `${orders_id}_${seller_id}`;

        // Initialize the array if it doesn't exist yet
        if (!updatedOrders[key]) {
          updatedOrders[key] = [];
        }

        // Add the order to the array
        updatedOrders[key].push(order);
      });

      const orderedOrdersArray = Object.values(updatedOrders);
      setOrderedOrders(orderedOrdersArray);
    };

    orderOrders();
  }, [orders]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="mb-8 text-4xl font-bold">Orders</h1>
      {orderedOrders?.map((ordersArray: any) => (
        <div
          key={uuidv4()}
          className="mb-8 border w-full border-gray-300 rounded p-4"
        >
          {ordersArray.map((order: Product) => (
            <div
              key={order.sku}
              className="mb-8 border border-gray-300 rounded p-4 "
            >
              <div className="flex">
                <div className="mr-3 w-2/6 m-2">
                  {" "}
                  <AdvancedImage
                    className="aspect-square w-full rounded"
                    cldImg={cld.image(order.image_url)}
                  />
                </div>
                <div className="block w-full">
                  <Link
                    to={`/productDetailsWithReviews/${order.product_id}`}
                    className="text-softerPurple hover:underline text-md font-bold"
                  >
                    {order.name}
                  </Link>
                  {/* <p className="mb-2 text-xs text-purpleAccent font-Barlow font-semibold">
                  {order.description}
                </p> */}
                  <div className="flex flex-row justify-between w-full">
                    <p className="text-gray-400 text-xs font-bold">
                      {order.variation_1 && order.variation_2
                        ? `${order.variation_1} and ${order.variation_2}`
                        : order.variation_1
                        ? order.variation_1
                        : order.variation_2
                        ? order.variation_2
                        : "No Variation"}
                    </p>
                    <div className="block">
                      <p className="font-bold text-gray-700 font-Barlow">
                        x{order.quantity}
                      </p>
                      ${order.price}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-y border-gray-300 flex justify-between text-md font-bold">
                <p className="text-xs text-gray-300">
                  {" "}
                  {convertUtcToLocal(order.orders_date!)}
                </p>
                <p className="text-md font-bold font-Barlow text-softerPurple">
                  ${order.price * order.quantity}
                </p>
              </div>

              {/* <div className="mt-4">
{/* <p className="font-bold">The Variation You Bought</p> 

<h3 className="mt-2 text-lg">
  Order was made on {convertUtcToLocal(order.orders_date!)}
</h3>
</div>
 */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ViewOrders;

function convertUtcToLocal(utcTime: string): string {
  // Convert UTC time to local time
  const localTime = new Date(utcTime);

  // Get the local date components
  const day = localTime.getDate();
  const month = localTime.getMonth() + 1; // Months are zero-based
  const year = localTime.getFullYear();

  // Format the local time as DD/MM/YYYY
  const formattedLocalTime = `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;

  return formattedLocalTime;
}
