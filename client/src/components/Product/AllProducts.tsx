import React from "react";
import { cld } from "../../Cloudinary/Cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Rating from '@mui/material/Rating';
import { Product } from "./CustomerSellerProfilePage";



interface AllProductProps {
    productData: Product[];
}

const AllProducts: React.FC<AllProductProps> = ({ productData }) => {

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
};

export default AllProducts;