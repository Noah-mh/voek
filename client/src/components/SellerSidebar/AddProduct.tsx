import { useState } from 'react';
import { axiosPrivateSeller } from '../../api/axios.tsx';
import useSeller from '../../hooks/useSeller.tsx';

import ProductForm from "./ProductForm.tsx";
import Box from '@mui/material/Box';
import { ToastContainer, toast, Id } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {

  const { seller } = useSeller();
  const sellerId = seller.seller_id;
  const [toastId, setToastId] = useState<Id | undefined>(undefined);

  const handleSubmit = async (e: any) => {
    console.log("event", e);
    const addProduct = async () => {
      try {
        const response = await axiosPrivateSeller.post(
          `/addProduct/${sellerId}`,
          e
        );
        console.log("addProduct response", response)
        if (response.data.productId === 0) {
          toast.dismiss(toastId);

          const id = toast.error(e.name + " could not be created as it already exists.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setToastId(id);
        } else {
          toast.dismiss(toastId);

          const id = toast.success("Successfully added " + e.name, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setToastId(id);
        }
      } catch (err) {
        console.log(err);
        toast.dismiss(toastId);

        const id = toast.error("Error adding " + e.name, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setToastId(id);
      }
    }

    addProduct();
  }

  return (
    <div className="flex flex-row grow">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1
        }}
      >
        <h1 className="text-xl font-medium mb-2">Add Product</h1>

        <ToastContainer />
        <ProductForm
          onSubmit={handleSubmit}
        />
      </Box>
    </div>
  )
}

export default AddProduct