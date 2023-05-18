import { useState, useEffect } from 'react'
import SellerSidebar from "../SellerSidebar/SellerSidebar.js";
import useSeller from '../../hooks/useSeller.js';
import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";
import ViewSellerOrders from './ViewSellerOrders.js';
import ViewSellerShipped from './ViewSellerShipped.js';
import ViewSellerDelivered from './ViewSellerDelivered.js';

interface Order {
  orders_id: number;
  customer_id: number;
  username: string;
  email: string;
  quantity: number;
  product_id: number;
  orders_product_id: number;
  variation_1?: string;
  variation2?: string;
  orders_date?: string;
  shipment_created?: string;
  shipment_delivered?: string;
  total_price: number; 
}

const ManageOrders = () => {

  const axiosPrivateSeller = useAxiosPrivateSeller();
  const { seller } = useSeller();


  const [orders, setOrders] = useState<Order[]>([])
  const [shippedOrders, setShippedOrders] = useState<Order[]>([])
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([])

  const getOrders = async () => {
    try {
      return await axiosPrivateSeller.get(`/seller/orders/${seller.seller_id}`);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getShippedOrders = async () => {
    try {
      return await axiosPrivateSeller.get(`/seller/orders/shipped/${seller.seller_id}`);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getDeliveredOrders = async () => {
    try {
      return await axiosPrivateSeller.get(`/seller/orders/delivered/${seller.seller_id}`);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getAll = async () => {
    try {
      const result: any = await Promise.all([getOrders(), getShippedOrders(), getDeliveredOrders()])
      setOrders(result[0].data.orders)
      setShippedOrders(result[1].data.shipped)
      setDeliveredOrders(result[2].data.delivered)
    } catch (err: any) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAll()
  }, [])


  return (
    <div className="flex flex-row">
      <SellerSidebar />
      <div>ManageOrders</div>
      <div>
        <div>
          <ViewSellerOrders orders={orders} />
          <ViewSellerShipped shippedOrders={shippedOrders} />
          <ViewSellerDelivered deliveredOrders={deliveredOrders} />
        </div>
      </div>
    </div>
  )
}

export default ManageOrders