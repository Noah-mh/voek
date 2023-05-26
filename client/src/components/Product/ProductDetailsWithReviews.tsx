// ProductDetailWithReview.tsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import Loader from "../Loader/Loader";
import { cld } from "../../Cloudinary/Cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import Typography from '@mui/material/Typography';
import { AiOutlineShop } from "react-icons/ai";
import "./ProductDetailsWithReviews.css";
import ProductDetail from "./ProductDetails";
import CustomerContext from "../../context/CustomerProvider";
import moment from "moment";
import tz from "moment-timezone";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import { Link } from "react-router-dom";
//Noah's code
interface seller {
  seller_id: number;
  shop_name: string;
  image_url: string;
  total_product: number;
}

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

const timezone = tz.tz.guess();
const currentDate = moment().format("YYYY-MM-DD");

const ProductDetailWithReview: React.FC = () => {
  const params = useParams();
  const { product_id } = params;
  const [sellerData, setSellerData] = useState<seller[]>([]);
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
  }
  const getProductData = async () => {
    try {
      return await axios.get(`/productDetailsWithoutReviews/${product_id}`);
    } catch (err: any) {
      console.log(err);
    }
  }
  const getProductReviews = async () => {
    try {
      return await axios.get(`/productReviews/${product_id}`);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getALlData = async () => {
    try {
      const result: any = await Promise.all([getSellerData(), getProductData(), getProductReviews()]);
      setSellerData(result[0].data.sellerDetailsByProductId);
      setProductData(result[1].data.products);
      setProductReview(result[2].data.reviews);
      setIsLoading(false);
    } catch (err: any) {
      console.log(err);
    }
  }

  useEffect(() => {
    // Noah
    getALlData();

    // Nhat Tien :D
    console.log("customerId", customerId);

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
          console.log("Data...", response.data);
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

  if (isLoading || !productData || !productReview) {
    return <Loader />;
  } else {
    return (
      <div>
        <Link to={`/customerSellerProfile/${sellerData[0].seller_id}`} className="text-blue-500 hover:underline">
          <div className="flex justify-center items-center">
            <div className="w-40 h-40 mb-5 mr-5">
              <AdvancedImage cldImg={cld.image(sellerData[0].image_url)} />
            </div>
            <div className="flex flex-col justify-center">
              <Typography gutterBottom variant="h5" component="div">
                {sellerData[0].shop_name}
              </Typography>
              <div className="flex">
                <AiOutlineShop />
                <Typography variant="body2" color="text.primary">
                  Products: {sellerData[0].total_product}
                </Typography>
              </div>
            </div>
          </div>
        </Link>
        <ProductDetail productData={productData} productReview={productReview} seller_id={sellerData[0].seller_id} getAllData={getALlData} />
      </div>

    );
  }
};

export default ProductDetailWithReview;
