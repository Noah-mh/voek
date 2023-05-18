// ProductDetailWithReview.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../../api/axios";
import Loader from '../Loader/Loader';
import './ProductDetailsWithReviews.css';
import ProductDetail from './ProductDetails'; // make sure the path is correct

export interface ProductVariation {
    variation_1: string | null;
    variation_2: string | null;
    price: number | null;
}

export interface Review {
    rating: number;
    image_urls: string[];
    reviews: Customer[];
}

export interface Customer {
    customerName: string;
    comment: string;
}

export interface Product {
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

    useEffect(() => {
        axios.get(`/productDetailsWithoutReviews/${product_id}`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
            .then((response) => {
                console.log('Product Details:', response.data.products);
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
    }, [product_id]);

    if (isLoading || !productData || !productReview) {
        return <Loader />;
    } else {
        return <ProductDetail productData={productData} productReview={productReview} />;
    }
};

export default ProductDetailWithReview;
