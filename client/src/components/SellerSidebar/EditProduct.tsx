import { useLocation } from 'react-router-dom';

import { axiosPrivateSeller } from '../../api/axios.tsx';
// import useSeller from '../../hooks/useSeller.tsx';

import SellerSidebar from "../SellerSidebar/SellerSidebar.js";
import ProductForm from "./ProductForm.tsx";
// import { useState, useEffect } from 'react';
import Product from '../Header/Product.tsx';

// interface ProductVariations {
//   name: string;
//   var1: string;
//   var2: string;
//   price: number;
//   quantity: number;
//   sku: string;
// }

interface Product {
  productId: number;
  active: boolean;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string[];
  sku: string;
  subRows: Array<Product>;
  
  // optional properties
  // product only
  // showSubrows?: boolean;
  description?: string;
  categoryId?: number;
  category?: string;

  // product variations only
  variation1?: string;
  variation2?: string;
}

const EditProduct = () => {

  let { state } = useLocation();
  
  let product: Product = state;
  console.log(product);

  const currentProduct: Product = (Object.values(product)[0]);

  // useEffect(() => {
  //   if (product) {
  //     setCurrentProduct(Object.values(product)[0]);
  //   }
  // }, [])

  // let productWithoutSku = {
  //   productId: product.productId,
  //   active: product.active,
  //   name: product.name,
  //   price: product.price,
  //   quantity: product.quantity,
  //   subRows: product.subRows,
  
  //   // optional properties
  //   // product only
  //   // showSubrows?: product.showSubrows,
  //   description: product.description,
  //   categoryId: product.categoryId,
  //   category: product.category,
  // }

  // const { seller } = useSeller();
  // const sellerId = seller.seller_id;

  const handleSubmit = async (e: any) => {
    console.log(e);
    console.log(e.variations);

    let columns: string[] = [];
    let values: string[] = [];

    if (product.name != e.name) {
      columns.push("name");
      values.push(e.name);
    }

    if (product.description != e.description) {
      columns.push("description");
      values.push(e.description);
    }

    if (product.categoryId != e.categoryId) {
      columns.push("category_id");
      values.push(e.categoryId);
    }

    // e.variations.forEach.find(())
    // product.subRows.find(
    //   (variation) =>
    //     variation.var1 === var1 && variation.var2 === var2
    // );

    // console.log("e.variations", e.variations)
    // console.log("current", currentProduct)
    // console.log("current sub", currentProduct.subRows)

    let existingVariation;
    
    e.variations.forEach((variation: any) => {
      // console.log("variation", variation)
      // console.log(variation.var1)
      // console.log(variation.var2)
      // variation.var2 ? console.log("yes") : console.log("no")

      existingVariation = currentProduct.subRows.find(
        (existingVar: any) => {
          // console.log("test", existingVar.variation1 === variation.var1 && (variation.var2 ? existingVar.variation2 === variation.var2 : true));
          return existingVar.variation1 === variation.var1 && (variation.var2 ? existingVar.variation2 === variation.var2 : true);
        }
      );

      // console.log("existing", existingVariation)
      if (existingVariation) {
        variation.sku = existingVariation.sku
      } else variation.sku = "";
      // console.log("sku", variation.sku)
    });    

    console.log("col", columns)
    console.log("val", values)
    console.log("var", e.variations)

    const editProduct = async () => {
      try {
        await axiosPrivateSeller.post(
          `/editProduct/${currentProduct.productId}`,
          {
            columns: columns,
            values: values,
            variations: e.variations,
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
      <SellerSidebar />

      <div className="flex flex-col w-max">
        <div>Edit Product</div>

        <ProductForm 
          product={product}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};


export default EditProduct