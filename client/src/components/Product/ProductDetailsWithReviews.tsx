import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faCartPlus,
    faHeartCircleXmark,
    faHeartCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
    product_id: number;
    name: string;
    quantity: number;
    price: string;
    image_url: string;
    variation_1: string | null;
    variation_2: string | null;
    getProduct: () => Promise<object[]>;
}



const ProductDetails: React.FC = () => {



    return (
        <>
            <div>ProductDetails</div></>
    )
}

export default ProductDetails