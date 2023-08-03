import { useLocation } from 'react-router-dom';
import { axiosPrivateSeller } from '../../api/axios.tsx';
import ProductForm from "./ProductForm.tsx";
import SellerSidebar from "../SellerSidebar/SellerSidebar.js";
import { useState } from 'react';

interface SubmitVariationsInterface {
  name?: string;
  var1: string | null; 
  var2: string | null;
  price: number;
  quantity: number;
  imageUrl: string;
  sku?: string;
}

interface SubmitInterface {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  categoryId: number;
  category: string;
  variations: Array<SubmitVariationsInterface>;

  // optional properties
  // edit product only
  productId?: number;
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

  // let { state } = useLocation();
  
  // let product: Product = state;
  // let product: Product = prop;
  console.log("product", product)
  // const currentProduct: Product = JSON.parse(JSON.stringify(Object.values(product)[0]));
  const [currentProduct, setCurrentProduct] = useState<Product>(product);
  console.log("currentProduct", currentProduct);

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
        await axiosPrivateSeller.post(
          `/editProduct/${currentProduct.productId}`,
          {
            keys: keys,
            values: values,
            variations: e.variations.length === 0 ? noVariations : e.variations,
          }
        )
      } catch (err) {
        console.log(err);
      }
    }

    editProduct();
  }

  return (
    <div className="flex flex-row">

      <div className="flex flex-col w-max">
        <h1 className="text-xl font-medium mb-2">Edit Product</h1>

        <ProductForm 
          product={currentProduct}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};


export default EditProduct