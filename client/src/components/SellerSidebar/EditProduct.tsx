import { axiosPrivateSeller } from '../../api/axios.tsx';
import ProductForm from "./ProductForm.tsx";
import { useState } from 'react';
import { ToastContainer, toast, Id } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SubmitVariationsInterface {
  name?: string;
  var1: string | null;
  var2: string | null;
  price: number;
  quantity: number;
  imageUrl: string;
  sku?: string;
}

interface Product {
  productId: number;
  active: boolean;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  sku: string;
  subRows: Array<Product>;

  // optional properties
  // product only
  // showSubrows?: boolean;
  description?: string;
  categoryId?: number;
  category?: string;

  // product variations only
  variation1?: string | null;
  variation2?: string | null;
}

// const EditProduct = ( prop: Product ) => {
const EditProduct: React.FC<{ product: Product }> = ({ product }) => {

  // console.log("product", product)
  // const [currentProduct, setCurrentProduct] = useState<Product>(product);
  // console.log("currentProduct", currentProduct);
  const currentProduct: Product = product;
  const [toastId, setToastId] = useState<Id | undefined>(undefined);

  const handleSubmit = async (e: any) => {
    console.log("event", e);
    let keys: string[] = [];
    let values: Array<string | number> = [];
    let noVariations: SubmitVariationsInterface = {
      var1: null,
      var2: null,
      price: e.price,
      quantity: e.quantity,
      imageUrl: e.imageUrl,
      sku: e?.sku
    }

    if (currentProduct.name !== e.name) {
      keys.push("name");
      values.push(e.name);
    }
    if (currentProduct.description !== e.description) {
      keys.push("description");
      values.push(e.description);
    }
    if (currentProduct.categoryId !== e.categoryId) {
      keys.push("category_id");
      values.push(e.categoryId);
    }

    const editProduct = async () => {
      try {
        const response = await axiosPrivateSeller.post(
          `/editProduct/${currentProduct.productId}`,
          {
            keys: keys,
            values: values,
            variations: e.variations.length === 0 ? noVariations : e.variations,
          }
        )
        if (response) {
          toast.dismiss(toastId);

          const id = toast.success("Successfully updated " + e.name, {
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

        const id = toast.error("Error updating " + e.name, {
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

    editProduct();
  }

  return (
    <div className="flex flex-row">

      <div className="flex flex-col w-max">
        <h1 className="text-xl font-medium mb-2">Edit Product</h1>

        <ToastContainer />
        <ProductForm
          product={currentProduct}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};


export default EditProduct