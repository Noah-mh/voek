import { useState } from 'react';
import { axiosPrivateSeller } from '../../api/axios.tsx';
import useSeller from '../../hooks/useSeller.tsx';

import ProductForm from "./ProductForm.tsx";

const AddProduct = () => {

  const { seller } = useSeller();
  const sellerId = seller.seller_id;
  const [duplicateExists, setDuplicateExists] = useState<string>("");

  const handleSubmit = async (e: any) => {
    console.log(e);
    console.log(e.variations);

    const addProduct = async () => {
      try {
        const response = await axiosPrivateSeller.post(
          `/addProduct/${sellerId}`,
          e
        );
        console.log("duplicate", duplicateExists)
        console.log("response", response)

        if (response.data === 0) {
          setDuplicateExists("Product could not be created as it already exists.");
        }
        console.log("duplicate", duplicateExists)
      } catch (err) {
        console.log(err);
      }
    }

    addProduct();
  }

  return (
    <div className="flex flex-row">

      <div className="flex flex-col w-max">
        <div>AddProduct</div>

        <ProductForm 
          onSubmit={handleSubmit}
        />

        {duplicateExists}
      </div>
    </div>
  )
}

export default AddProduct