import { Link } from "react-router-dom";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import { cld } from "../../Cloudinary/Cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
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

interface Props {
  deliveredOrders: Product[];
  getAll: () => void;
}

type Order = {
  orders_id: number;
  seller_id: number;
  [key: string]: any;
};

const ViewDelivered = ({ deliveredOrders, getAll }: Props) => {
  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const [orderedDeliveredOrders, setDeliveredOrderedOrders] = useState<any>();

  useEffect(() => {
    const orderOrders = () => {
      const updatedOrders: Record<string, Record<string, Order[]>> = {};

      deliveredOrders.forEach((order: any) => {
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
      const orderedOrdersArray: Order[][][] = Object.values(updatedOrders).map(
        (orderGroup) => Object.values(orderGroup)
      );
      setDeliveredOrderedOrders(orderedOrdersArray);
    };

    orderOrders();
  }, [deliveredOrders]);

  const buttonHandler = async (orders_id: string, seller_id: string) => {
    var order_id = parseInt(orders_id);
    var sellers_id = parseInt(seller_id);

    try {
      await axiosPrivateCustomer.put(
        `/customer/received/${order_id}/${seller_id}`
      );
      getAll();
      toast.success("Order has been received", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="mb-8 text-4xl font-bold">Delivered Orders</h1>

      {orderedDeliveredOrders
        ?.map((ordersArray: any) => (
          <div key={uuidv4()} className="mb-8  shadow-md rounded p-4 w-full">
            <div className="flex flex-col"></div>
            {ordersArray.map((Orders: any) => (
              <div key={Orders.order_id}>
                <div className="storeName flex-row flex ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                    />
                  </svg>

                  <h1 className="text-l font-bold text-purpleAccent ml-2">
                    {Orders[0].shop_name}
                  </h1>
                </div>
                <div className="flex flex-col justify-between my-4">
                  {Orders.map((order: Product) => (
                    <div
                      key={order.sku}
                      className=" flex flex-col border-b-2 rounded pt-4 "
                    >
                      <div className="flex flex-row ">
                        <div className="orderImg">
                          {" "}
                          <AdvancedImage cldImg={cld.image(order.image_url)} />
                        </div>
                        <div className="flex flex-col pl-10 w-100 flex-grow">
                          <Link
                            to={`/productDetailsWithReviews/${order.product_id}`}
                            className="text-purpleAccent font-Barlow font-bold text-xl hover:underline"
                          >
                            {order.name}
                          </Link>
                          <p className=" opacity-50">{order.description}</p>
                          <div className="mt-1">
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
                      </div>

                      <div className="priceText flex flex-wrap justify-between border-t-2 border-b-2 p-1 mt-4">
                        <p className="font-bold font-Barlow text-xs">
                          x{order.quantity}
                        </p>
                        <p className="font-bold text-purpleAccent">
                          ${order.price * order.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="py-2 flex flex-end justify-end">
                  <button
                    onClick={() => {
                      buttonHandler(Orders[0].orders_id, Orders[0].seller_id);
                    }}
                    className="flex items-center text-xs justify-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                  >
                    Mark as Received
                  </button>
                </div>
              </div>
            ))}
            <h1 className="text-md font-bold opacity-40">
              Delivered Date: {getLocalDate(ordersArray[0][0].shipment_created)}{" "}
              {getLocalTime(ordersArray[0][0].shipment_created)}
            </h1>
          </div>
        ))
        .reverse()}
      {orderedDeliveredOrders?.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-32xl font-barlow opacity-30 font-bold">
          No orders delivered.
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ViewDelivered;

function getLocalTime(utcTime: string): string {
  const localTime = new Date(utcTime);
  const offsetInMinutes = localTime.getTimezoneOffset();
  localTime.setMinutes(localTime.getMinutes() - offsetInMinutes);
  const hours = localTime.getHours() % 12 || 12;
  const minutes = localTime.getMinutes();
  const period = localTime.getHours() >= 12 ? "PM" : "AM";
  const localTimeString = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;
  return localTimeString;
}

function getLocalDate(utcTime: string): string {
  const localTime = new Date(utcTime);
  const offsetInMinutes = localTime.getTimezoneOffset();
  localTime.setMinutes(localTime.getMinutes() - offsetInMinutes);
  const day = localTime.getDate();
  const month = localTime.getMonth() + 1;
  const year = localTime.getFullYear();
  const localDateString = `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;
  return localDateString;
}
