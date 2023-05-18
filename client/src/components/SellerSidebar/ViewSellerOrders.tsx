import { useEffect, useState } from "react";

interface Order {
  orders_id: number;
  customer_id: number;
  username: string;
  email: string;
  quantity: number;
  product_id: number
  orders_product_id: number;
  variation_1?: string;
  variation2?: string;
  orders_date?: string;
  shipment_created?: string;
  total_price: number;
  shipment_delivered?: string;
}

interface Props {
  orders: Order[];
}


const ViewSellerOrders = ({ orders }: Props) => {

  const [orderedOrders, setOrderedOrders] = useState<any>()

  const orderOrders = () => {
    const updatedOrders: any = {}

    orders.forEach(order => {
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


  useEffect(() => {
    orderOrders()
    console.log(orders)
    console.log(orderedOrders)
  }, [])

  return (
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
            <tbody className="bg-white">
              <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold text-black">Sufyan</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ms font-semibold border">22</td>
                <td className="px-4 py-3 text-xs border">
                  <div>
                    {
                      orderedOrders?.map((order: any) => (
                        <h1>Hello</h1>
                      ))
                    }
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default ViewSellerOrders