// import { useState } from "react";
import SellerSidebar from "../SellerSidebar/SellerSidebar.js";
// import useSeller from "../../hooks/useSeller.js";



// interface Product {
//   product_id: number;
//   name: string;
//   description: string;
//   category: number;
//   price: number;
// }

const HomepageSeller = () => {

  // const { seller } = useSeller();
  // const sellerId = seller.seller_id;


  return (
    <div className="flex flex-row">
      <SellerSidebar />
      <div>HomepageSeller</div>

      
    </div>
  )
}

export default HomepageSeller