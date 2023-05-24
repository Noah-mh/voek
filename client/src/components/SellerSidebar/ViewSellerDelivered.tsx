import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Order {
  orders_id: number;
  customer_id: number;
  username: string;
  email: string;
  quantity: number;
  product_id: number;
  orders_product_id: number;
  variation_1?: string;
  variation_2?: string;
  orders_date?: string;
  shipment_created?: string;
  shipment_delivered?: string;
  total_price: number;
  name: string;
}

interface Props {
  deliveredOrders: Order[];
}

const ViewSellerDelivered = ({ deliveredOrders }: Props) => {

  const [orderedOrders, setOrderedOrders] = useState<any>()


  useEffect(() => {
    const orderOrders = () => {
      const updatedOrders: any = {}

      deliveredOrders.forEach(order => {
        const { orders_id } = order;

        if (updatedOrders[orders_id]) {
          updatedOrders[orders_id].push(order);
        } else {
          updatedOrders[orders_id] = [order];
        }
      });

      const orderedOrdersArray = Object.values(updatedOrders);
      setOrderedOrders(orderedOrdersArray)
    };
  orderOrders()
  }, [deliveredOrders])

  const getTotalAmt = (order: any) => {
    let totalAmt = 0;
    order.forEach((order: Order) => {
      totalAmt += order.total_price * order.quantity
    })
    return totalAmt
  }

  return (
    <div>
      <h1>View All Delivered Orders</h1>
      <section className="container mx-auto p-6 font-mono">
        <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Received Date</th>
                  <th className="px-4 py-3">Order Details</th>
                </tr>
              </thead>
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
                      <td className="px-4 py-3 text-ms font-semibold border">{convertUtcToLocal(order[0].shipment_delivered)}</td>
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
                          <button className="font-bold text-sm bg-cyan-dark-blue py-2">
                            View Order Detail
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ViewSellerDelivered

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