import { useState, useEffect } from 'react'
import SellerSidebar from "../SellerSidebar/SellerSidebar.js";

import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";

type Props = {}

const ManageOrders = (props: Props) => {

  const axiosPrivateSeller = useAxiosPrivateSeller();

  return (
    <div className="flex flex-row">
        <SellerSidebar />
        <div>ManageOrders</div>

    </div>
  )
}

export default ManageOrders