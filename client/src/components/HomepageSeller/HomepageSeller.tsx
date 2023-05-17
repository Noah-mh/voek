import { useState } from "react";
import SellerSidebar from "../SellerSidebar/SellerSidebar.js";



interface Product {
  product_id: number;
  name: string;
  description: string;
  category: number;
  price: number;
}

const HomepageSeller = () => {



  return (
    <div className="flex flex-row">
      <SellerSidebar />
      <div>HomepageSeller</div>

      
    </div>
  )
}

export default HomepageSeller