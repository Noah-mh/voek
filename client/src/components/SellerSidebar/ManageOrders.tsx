import { useState, useEffect } from 'react'
import SellerSidebar from "../SellerSidebar/SellerSidebar.js";
import useSeller from '../../hooks/useSeller.js';
import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";

interface Order {
  orders_id: number;
  customer_id: number;
  quantity: number;
  product_id: number;
  orders_product_id: number;
  variation_1?: string;
  variation2?: string;
  orders_date: string;
}

const ManageOrders = () => {

  const { seller } = useSeller();
  const axiosPrivateSeller = useAxiosPrivateSeller();

  const getOrders = async () => {
    try {
      return await axiosPrivateSeller.get(`/seller/orders/${seller.seller_id}`);
    } catch (err: any) {
      console.log(err);
    }
  }



  return (
    <div className="flex flex-row">
      <SellerSidebar />
      <div>ManageOrders</div>

    </div>
  )
}

export default ManageOrders