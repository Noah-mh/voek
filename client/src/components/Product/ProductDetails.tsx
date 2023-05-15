// ProductDetail.tsx
import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Product, ProductVariation, Review, Customer } from './ProductDetailsWithReviews'; // make sure the path is correct
import { cld } from '../../cloudinary';

interface ProductDetailProps {
    productData: Product[];
    productReview: Review[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productData, productReview }) => {
    return (
        <div className="container">


            {productData.map((pData, index: React.Key | null | undefined) => (
                <div key={index}>
                    <h1>{pData.name}</h1>
                    {pData.image_urls && (
                        <Carousel>
                            {pData.image_urls.map(
                                (imageUrl: string | undefined, index: React.Key | null | undefined) => (
                                    <div className="image-container" key={index}>
                                        <AdvancedImage cldImg={cld.image(imageUrl)} />
                                    </div>
                                )
                            )}
                        </Carousel>
                    )}
                    <h3>Description: {pData.description}</h3>
                    <div className="variation">
                        <h3>Variation:</h3>
                        {pData.variations && pData.variations.map((variation: ProductVariation, index: number) => {
                            return (
                                <div className="variation" key={index}>
                                    <p>{variation.variation_1}</p>
                                    <p>{variation.variation_2}</p>
                                </div>
                            );
                        })}
                    </div>

                </div>
            ))}

            {productReview.map((pReview, index: React.Key | null | undefined) => (
                <div key={index}>
                    <h3>Rating: {pReview.rating}</h3>

                    <h3>Reviews:</h3>
                    {pReview.image_urls && (
                        <Carousel>
                            {pReview.image_urls.map(
                                (imageUrl: string | undefined, index: React.Key | null | undefined) => (
                                    <div className="image-container" key={index}>
                                        <AdvancedImage cldImg={cld.image(imageUrl)} />
                                    </div>
                                )
                            )}
                        </Carousel>
                    )}

                    {pReview.reviews &&
                        pReview.reviews.map((review: Customer, index: React.Key | null | undefined) => (
                            <div className="review" key={index}>
                                <h4>{review.customerName}</h4>
                                <p>{review.comment}</p>
                            </div>
                        ))}
                </div>
            ))}

        </div>
    );
}

export default ProductDetail;
