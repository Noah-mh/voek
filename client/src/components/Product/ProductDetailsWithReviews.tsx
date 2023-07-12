// ProductDetailWithReview.tsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import Loader from "../Loader/Loader";
import "./ProductDetailsWithReviews.css";
import ProductDetail from "./ProductDetails";
import CustomerContext from "../../context/CustomerProvider";
import moment from "moment";
import tz from "moment-timezone";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
//Noah's code
interface seller {
  seller_id: number;
  shop_name: string;
  image_url: string;
  total_products: number;
  total_reviews: number;
  date_created: Date;
}

export interface ProductVariation {
  variation_1: string | null;
  variation_2: string | null;
  price: number | null;
  sku: string;
  quantity: number | null;
}

export interface Review {
  name: string;
  rating: number;
  total_reviews: number;
  reviews: Customer[];
}

export interface Customer {
  sku: string;
  review_id: number;
  customer_id: number;
  customerName: string;
  customerImage: string;
  comment: string;
  image_urls: string[];
}

export interface Product {
  product_id: number;
  image_urls: string[];
  name: string;
  description: string | null;
  variations: ProductVariation[] | null;
}

const timezone = tz.tz.guess();
const currentDate = moment().format("YYYY-MM-DD");

const ProductDetailWithReview: React.FC = () => {
  const params = useParams();
  const { product_id } = params;
  const [sellerData, setSellerData] = useState<seller[]>([]);
  const [diffInMonths, setDiffInMonths] = useState<number>(0);
  const [productData, setProductData] = useState<Product[] | null>(null);
  const [productReview, setProductReview] = useState<Review[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const { customer } = useContext(CustomerContext);
  const customerId = customer.customer_id;

  const getSellerData = async () => {
    try {
      return await axios.get(`/sellerDetails/byProduct/${product_id}`);
    } catch (err: any) {
      console.log(err);
    }
  };
  const getProductData = async () => {
    try {
      return await axios.get(`/productDetailsWithoutReviews/${product_id}`);
    } catch (err: any) {
      console.log(err);
    }
  };
  const getProductReviews = async () => {
    try {
      return await axios.get(`/productReviews/${product_id}`);
    } catch (err: any) {
      console.log(err);
    }
  };

  const getAllData = async () => {
    try {
      const result: any = await Promise.all([
        getSellerData(),
        getProductData(),
        getProductReviews(),
      ]);
      setSellerData(result[0].data.sellerDetailsByProductId);
      setProductData(result[1].data.products);
      setProductReview(result[2].data.reviews);
      setIsLoading(false);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Noah
    getAllData();
    // Nhat Tien :D
    if (customerId != undefined) {
      axiosPrivateCustomer
        .post(
          `/insertLastViewedProduct`,
          JSON.stringify({
            productId: product_id,
            customerId,
            currentDate,
            timezone,
          }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
        .then((response) => {
          axiosPrivateCustomer.put(
            `/updateCustomerLastViewedCat`,
            JSON.stringify({
              categoryId: response.data[0].categoryId,
              customerId,
            }),
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
  }, [product_id, customer]);
  useEffect(() => {
    if (sellerData.length > 0) {
      const date_created = moment(sellerData[0].date_created);

      const diffInMonths = moment().diff(date_created, "months");
      console.log(diffInMonths);
      console.log("review", productReview);
      setDiffInMonths(diffInMonths);
    }
  }, [sellerData]);
  if (isLoading || !productData || !productReview) {
    return <Loader />;
  } else {
    return (
      <div>
        <ProductDetail
          productData={productData}
          productReview={productReview}
          sellerData={sellerData}
          getAllData={getAllData}
          diffInMonths={diffInMonths}
        />
      </div>
    );
  }
};

export default ProductDetailWithReview;
