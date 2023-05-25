import React, { useState, useEffect } from "react";
import { cld } from "../../Cloudinary/Cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Rating from '@mui/material/Rating';
import Loader from "../Loader/Loader";
import { Product } from "./CustomerSellerProfilePage";
import axios from "../../api/axios";

interface CategoryProductsProps {
    seller_id: number;
    category_id: number;
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({ seller_id, category_id }) => {
    const [productData, setProductData] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get(`/sellerProducts/${seller_id}/category/${category_id}`)
            .then((res) => {
                setProductData(res.data.sellerProductsByCategory);
                setIsLoading(false);
            }
            );
    }, [category_id, seller_id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
                <Loader />
            </div>
        );
    } else {
        return (
            <div className="flex flex-wrap justify-around">
                {productData.map((product) => (
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4 px-2" key={product.product_id}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardActionArea>
                                <AdvancedImage cldImg={cld.image(product.image_url)} />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ${product.price}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <Rating name="half-rating-read" defaultValue={product.rating} precision={0.5} readOnly />
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </div>
                ))}
            </div>
        );
    }
};

export default CategoryProducts;