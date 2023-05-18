import { useState, useEffect } from "react";
import ViewOrders from "./ViewOrders";
import ViewReceived from "./ViewReceived";
import ViewDelivered from "./ViewDelivered";
import useCustomer from "../../hooks/UseCustomer";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";

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
  shipment_delivered?: string;
  image_url?: string;
  orders_product_id?: number;
}

const ViewMyOrders = () => {

  const { customer } = useCustomer();
  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const [orders, setOrders] = useState<Product[]>([])
  const [deliveredOrders, setDeliveredOrders] = useState<Product[]>([])
  const [receivedOrders, setReceivedOrders] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState('orders');
  const getOrders = async () => {
    try {
      return await axiosPrivateCustomer.get(`/customer/orders/${customer.customer_id}`)
    } catch (err: any) {
      console.log(err);
    }
  }

  const getDeliveredOrders = async () => {
    try {
      return await axiosPrivateCustomer.get(`/customer/delivered/orders/${customer.customer_id}`)
    } catch (err: any) {
      console.log(err);
    }
  }

  const getReceivedOrders = async () => {
    try {
      return await axiosPrivateCustomer.get(`/customer/received/orders/${customer.customer_id}`)
    } catch (err: any) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAll()
  }, [])

  const getAll = async () => {
    try {
      const result: any = await Promise.all([getOrders(), getDeliveredOrders(), getReceivedOrders()])
      setOrders(result[0].data.listedOrders)
      setDeliveredOrders(result[1].data.listedOrdersDelivered)
      setReceivedOrders(result[2].data.listedOrdersReceived)
    } catch (err: any) {
      console.log(err);
    }
  }

  return (
    <div>
      <button
        onClick={() => setActiveTab('orders')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Orders
      </button>
      <button
        onClick={() => setActiveTab('delivered')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Delivered Orders
      </button>
      <button
        onClick={() => setActiveTab('received')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Received Orders
      </button>
      {activeTab === 'orders' && <ViewOrders orders={orders} />}
      {activeTab === 'delivered' && <ViewDelivered deliveredOrders={deliveredOrders} getAll={getAll} />}
      {activeTab === 'received' && <ViewReceived receivedOrders={receivedOrders} />}
    </div>
  )
}

export default ViewMyOrders