import React, { useState , useEffect} from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Product, ProductVariation, Review, Customer } from './ProductDetailsWithReviews';
import { cld } from "../../Cloudinary/Cloudinary";
import Select from 'react-select';

interface ProductDetailProps {
    productData: Product[];
    productReview: Review[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productData, productReview }) => {
    const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [price, setPrice] = useState<number | null>(productData[0].variations![0].price || null);

    useEffect(() => {
        if (selectedVariation) {
            const selectedProduct = productData.find(product =>
                product.variations?.some(
                    variation => {
                        const combinedKey = variation.variation_2
                            ? `${variation.variation_1} / ${variation.variation_2}`
                            : variation.variation_1;

                        return combinedKey === selectedVariation;
                    }
                )
            );

            const selectedProductVariation = selectedProduct?.variations?.find(
                variation => {
                    const combinedKey = variation.variation_2
                        ? `${variation.variation_1} / ${variation.variation_2}`
                        : variation.variation_1;

                    return combinedKey === selectedVariation;
                }
            );

            if (selectedProductVariation?.price) {
                setPrice(selectedProductVariation.price);
            }
        }
    }, [selectedVariation, productData]);
    // Flattening the variations array
    const allVariations = productData
        .filter(product => product.variations !== null)
        .reduce((acc: ProductVariation[], curr: Product) => [...acc, ...(curr.variations || [])], []);

    // Checking if there's at least one variation_1 that's not null
    const hasValidVariation = allVariations.some(variation => variation.variation_1 !== null);

    const handleAddToCart = ()=>{

    }

    return (
        <div className="container">


            {productData.map((pData, index: React.Key | null | undefined) => (
                <div key={index}>
                    <h1>{pData.name}</h1>
                    {pData.image_urls && (
                        <Carousel showThumbs={false}>
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
                    <h2>Price: {price}</h2>
                    <div>
                        {hasValidVariation && (
                            <Select
                                value={selectedVariation ? { label: selectedVariation, value: selectedVariation } : null}
                                onChange={(option) => setSelectedVariation(option?.value || null)}
                                options={pData.variations!.reduce<{ label: string; value: string; }[]>((options, variation: ProductVariation) => {
                                    if (variation.variation_1) {
                                        const compoundKey = variation.variation_2
                                            ? `${variation.variation_1} / ${variation.variation_2}`
                                            : variation.variation_1;

                                        options.push({ value: compoundKey, label: compoundKey });
                                    }

                                    return options;
                                }, [])}
                            />
                        )}
                    </div>


                </div>
            ))}
            <div className="flex items-center justify-center space-x-2">
                Quantity
                <button
                    onClick={() => setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1))}
                    className="bg-gray-200 text-black py-1 px-3 rounded-lg focus:outline-none hover:bg-gray-300"
                >
                    -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                    onClick={() => setQuantity(prevQuantity => prevQuantity + 1)}
                    className="bg-gray-200 text-black py-1 px-3 rounded-lg focus:outline-none hover:bg-gray-300"
                >
                    +
                </button>
            </div>
            <button
                onClick={handleAddToCart}
                className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Add to Cart
            </button>
            {productReview.map((pReview, index: React.Key | null | undefined) => (
                <div key={index}>
                    <h3>Rating: {pReview.rating}</h3>

                    <h3>Reviews:</h3>
                    {pReview.image_urls && (
                        <Carousel showThumbs={false}>
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
