import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller";
import { toast } from "react-toastify";

interface Order {
  orders_id: number;
  customer_id: number;
  username: string;
  email: string;
  quantity: number;
  product_id: number
  orders_product_id: number;
  variation_1?: string;
  variation_2?: string;
  orders_date?: string;
  shipment_created?: string;
  total_price: number;
  shipment_delivered?: string;
  name: string;
}

interface Props {
  orders: Order[];
  getAll: () => void;
}


const ViewSellerOrders = ({ orders, getAll }: Props) => {

  const [orderedOrders, setOrderedOrders] = useState<any>();

  const axiosPrivateSeller = useAxiosPrivateSeller();

  const orderOrders = () => {
    const updatedOrders: any = {};
  
    orders.forEach((order) => {
      const { orders_id } = order;
  
      if (updatedOrders[orders_id]) {
        updatedOrders[orders_id].push(order);
      } else {
        updatedOrders[orders_id] = [order];
      }
    });
  
    const orderedOrdersArray = Object.values(updatedOrders);
  
    // Sort the array by date in descending order
    orderedOrdersArray.sort((a: any, b: any) => {
      const dateA = new Date(a[0].date);
      const dateB = new Date(b[0].date);
      return dateB.getTime() - dateA.getTime();
    });
    setOrderedOrders(orderedOrdersArray);
  };
  

  useEffect(() => {
    getAll()
    orderOrders()
  }, [orders])

  const getTotalAmt = (order: any) => {
    let totalAmt = 0;
    order.forEach((order: Order) => {
      totalAmt += order.total_price * order.quantity
    })
    return totalAmt
  }

  const onClickHandler = async (orders_id: number, customer_id: number) => {
    const orders_product_id: number[] = [];
    orderedOrders.forEach((orders: any) => {
      orders.forEach((order: Order) => {
        if (order.orders_id === orders_id) {
          orders_product_id.push(order.orders_product_id)
        }
      })
    })
    await axiosPrivateSeller.put('/seller/orders/shipped', { orders_product_id, customer_id });
    getAll();
    orderOrders();
    toast.success("Order has been packed and shipped to customer", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  return (
    <div>
      <h1>View Orders</h1>
      <section className="container mx-auto p-6 font-mono">
        <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Order Date</th>
                  <th className="px-4 py-3">Order Details</th>
                </tr>
              </thead>
              {orderedOrders?.length ?
                <tbody className="bg-white">
                  {
                    orderedOrders?.map((order: any) => (
                      <tr key={order[0].orders_id} className="text-gray-700">
                        <td className="px-4 py-3 border">
                          <div className="flex items-center text-sm">
                            <div>
                              <p className="font-semibold text-black">{order[0].username}</p>
                              <p className="font-semibold text-black">{order[0].email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-ms font-semibold border">{getLocalDate(order[0].orders_date)} <br />{getLocalTime(order[0].orders_date)}</td>
                        <td className="px-4 py-3 text-xs border">
                          {
                            order.map((order: Order) => (
                              <div key={order.orders_product_id} className="flex items-center text-sm mb-3">
                                <div>
                                  <h1>{order.name}</h1>
                                  {
                                    order.variation_1 || order.variation_2 ? (
                                      <p className="font-semibold text-black">Variation: {order.variation_1 ? order.variation_1 : null} {order.variation_2 ? '| ' + order.variation_2 : null}</p>
                                    ) : null
                                  }
                                  <p className="text-xs text-gray-600">${order.total_price} x Qty: {order.quantity}</p>
                                </div>
                              </div>
                            ))
                          }
                          <h1>Total Price ${getTotalAmt(order)}</h1>
                          <Link to={`/seller/orders?orders_id=${order[0].orders_id}`}>
                            <button className="font-bold text-sm bg-cyan-dark-blue py-2 my-4">
                              View Order Detail
                            </button>
                          </Link>
                          <button className="flex items-center text-xs justify-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" onClick={(e: any) => { e.preventDefault(); onClickHandler(order[0].orders_id, order[0].customer_id) }}>Pack And Ship</button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
                : <h1>No Orders</h1>
              }
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ViewSellerOrders

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

