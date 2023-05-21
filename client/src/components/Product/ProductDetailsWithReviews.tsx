// ProductDetailWithReview.tsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios, { axiosPrivateCustomer } from "../../api/axios";
import Loader from "../Loader/Loader";
import "./ProductDetailsWithReviews.css";
import ProductDetail from "./ProductDetails"; // make sure the path is correct
import CustomerContext from "../../context/CustomerProvider";

export interface ProductVariation {
  variation_1: string | null;
  variation_2: string | null;
  price: number | null;
  sku: string;
  quantity: number | null;
}

export interface Review {
  rating: number;
  reviews: Customer[];
}

export interface Customer {
  sku: string;
  review_id: number;
  customer_id: number;
  customerName: string;
  comment: string;
  image_urls: string[];
}

export interface Product {
  product_id: number;
  image_urls: string[] | null;
  name: string;
  description: string | null;
  variations: ProductVariation[] | null;
}

const ProductDetailWithReview: React.FC = () => {
  const params = useParams();
  const { product_id } = params;
  const [productData, setProductData] = useState<Product[] | null>(null);
  const [productReview, setProductReview] = useState<Review[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { customer } = useContext(CustomerContext);
  const customerId = customer.customer_id;

  useEffect(() => {
    // Noah
    axios
      .get(`/productDetailsWithoutReviews/${product_id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        setProductData(response.data.products);
        return axios.get(`/productReviews/${product_id}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      })
      .then((response) => {
        setProductReview(response.data.reviews);
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });

    // Nhat Tien :D
    console.log("customerId", customerId);
    if (customerId != undefined) {
      axiosPrivateCustomer
        .get(`/getProductCat/${product_id}`)
        .then((response) => {
          return response.data[0].categoryId;
        })
        .then((categoryId) => {
          const productId = product_id;
          axiosPrivateCustomer.post(
            `/insertLastViewedProduct`,
            JSON.stringify({ productId, categoryId, customerId }),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          axiosPrivateCustomer.put(
            `/updateCustomerLastViewedCat`,
            JSON.stringify({ categoryId, customerId }),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [product_id]);

  if (isLoading || !productData || !productReview) {
    return <Loader />;
  } else {
    return (
      <ProductDetail productData={productData} productReview={productReview} />
    );
  }
};

export default ProductDetailWithReview;
