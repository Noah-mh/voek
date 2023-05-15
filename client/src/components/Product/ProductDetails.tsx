// ProductDetail.tsx
import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { Product, ProductVariation, Review, Customer } from './ProductDetailsWithReviews'; // make sure the path is correct

const cld = new Cloudinary({
    cloud: {
        cloudName: "dgheg6ml5",
    },
});

interface ProductDetailProps {
    productData: Product[];
    productReview: Review[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productData, productReview }) => {
    return (
        <div className="container">


            {productData.map((pData) => (
                <>
                    <h1>{pData.name}</h1>
                    {pData.image_urls &&
                        pData.image_urls.map(
                            (imageUrl: string | undefined, index: React.Key | null | undefined) => (
                                <div className="image-container" key={index}>
                                    <AdvancedImage cldImg={cld.image(imageUrl)} />
                                </div>
                            )
                        )}
                    <h3>Description: {pData.description}</h3>
                    <div className="variation">
                        {Object.values((JSON.parse(pData.variations!) as ProductVariation)).map(v => <p>{v}</p>)}
                    </div>
                </>
            ))}

            {productReview.map((pReview) => (
                <>
                    <h3>Rating: {pReview.rating}</h3>

                    <h3>Reviews:</h3>
                    {pReview.image_urls &&
                        pReview.image_urls.map(
                            (image_url: string | undefined, index: React.Key | null | undefined) => (
                                <div className="image-container" key={index}>
                                    <AdvancedImage cldImg={cld.image(image_url)} />
                                </div>
                            )
                        )}

                    {pReview.reviews &&
                        pReview.reviews.map((review: Customer, index: React.Key | null | undefined) => (
                            <div className="review" key={index}>
                                <h4>{review.customerName}</h4>
                                <p>{review.comment}</p>
                            </div>
                        ))}
                </>
            ))}

        </div>
    );
}

export default ProductDetail;
