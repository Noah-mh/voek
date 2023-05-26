import React from 'react';

import SellerSidebar from "../SellerSidebar/SellerSidebar.js";
import ProductForm from "./ProductForm.tsx";
import { axiosPrivateSeller } from '../../api/axios.tsx';
import useSeller from '../../hooks/useSeller.tsx';

// type Props = {}

// interface SubmitVariationsInterface {
//   var1: string; 
//   var2: string;
//   price: number;
//   quantity: number;
// }

// interface SubmitInterface {
// name: string;
// description: string;
// price: number;
// quantity: number;
// categoryId: number;
// category: string;
// variations: Array<SubmitVariationsInterface>;

// // optional properties
// // edit product only
// productId?: number;
// sku?: string;
// }

const AddProduct = () => {

  const { seller } = useSeller();
  const sellerId = seller.seller_id;

  const handleSubmit = async (e: any) => {
    console.log(e);
    console.log(e.variations);

    const addProduct = async () => {
      try {
        await axiosPrivateSeller.post(
          `/addProduct/${sellerId}`,
          e
        )
      } catch (err) {
        console.log(err);
      }
    }

    addProduct();
  }

  return (
    <div className="flex flex-row">
      <SellerSidebar />

      <div className="flex flex-col w-max">
        <div>AddProduct</div>

        <ProductForm 
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default AddProduct