import { useState } from 'react';
import { axiosPrivateSeller } from '../../api/axios.tsx';
import useSeller from '../../hooks/useSeller.tsx';

import ProductForm from "./ProductForm.tsx";
import Box from '@mui/material/Box';

const AddProduct = () => {

  const { seller } = useSeller();
  const sellerId = seller.seller_id;
  const [duplicateExists, setDuplicateExists] = useState<string>("");

  const handleSubmit = async (e: any) => {
    console.log("event", e);
    const addProduct = async () => {
      try {
        const response = await axiosPrivateSeller.post(
          `/addProduct/${sellerId}`,
          e
        );

        if (response.data.productId === 0) {
          setDuplicateExists("Product could not be created as it already exists.");
        }
      } catch (err) {
        console.log(err);
      }
    }

    addProduct();
  }

  return (
    <div className="flex flex-row grow">

      {/* <div className="flex flex-col w-max"> */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1
        }}
      >
        <h1 className="text-xl font-medium mb-2">Add Product</h1>

        <ProductForm
          onSubmit={handleSubmit}
        />

        {duplicateExists}
      </Box>
      {/* </div> */}
    </div>
  )
}

export default AddProduct