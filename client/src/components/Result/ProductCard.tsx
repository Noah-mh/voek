import { useEffect, useState } from "react";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../../Cloudinary/Cloudinary";
import axios from "../../api/axios";

interface ProductCardProps {
  product: {
    product_id: number;
    name: string;
    description: string;
    image: string;
    rating: number;
  };
}

interface Pricing {
  lowestPrice: number;
  highestPrice: number;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [pricingRange, setPricingRange] = useState<Pricing>();
  const [imageUrl, setImageUrl] = useState<string>("");

  const getPricingAndImage = () => {
    const pricingRange = axios.get(
      `/getProductVariationsPricing/${product.product_id}`
    );
    const image = axios.get(`/getProductImage/${product.product_id}`);
    const rating = axios.get(`/getProductRating/${product.product_id}`);
    Promise.all([pricingRange, image, rating]).then((responses) => {
      if (responses[1].data[0] === undefined) {
        setImageUrl("/test/No_Image_Available_hyxfvc.jpg");
      } else {
        setImageUrl(responses[1].data[0].imageURL);
      }
      product.rating = responses[2].data[0].rating;
      setPricingRange(responses[0].data[0]);
    });
  };

  useEffect(() => {
    getPricingAndImage();
  }, []);

  useEffect(() => {
    getPricingAndImage();
  }, [product]);

  return (
    <div>
      <div className="w-full max-w-sm bg-gray-50 border rounded-lg shadow-xl p-2 m-2">
        <Link to={`/productDetailsWithReviews/${product.product_id}`}>
          <AdvancedImage
            className="p-8 rounded-t-lg hover:cursor-pointer w-full h-80 object-contain"
            cldImg={cld.image(imageUrl)}
            alt="product image"
          />
        </Link>
        <div className="px-5 pb-5">
          <Link to={`/productDetailsWithReviews/${product.product_id}`}>
            <h5 className="text-xl text-ellipsis overflow-hidden whitespace-nowrap w-full font-semibold tracking-tight text-greyAccent hover:text-gray-800 hover:cursor-pointer">
              {product.name}
            </h5>
          </Link>
          <div className="flex items-center mt-2.5 mb-5">
            <span className="bg-softerPurple text-lighterGreyAccent text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ml-3">
              {product.rating === null ? 0 : product.rating}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-greyAccent">
              $
              {pricingRange?.lowestPrice === pricingRange?.highestPrice
                ? pricingRange?.lowestPrice
                : pricingRange?.lowestPrice +
                  " - $" +
                  pricingRange?.highestPrice}
            </span>
            <div
              className="text-white bg-purpleAccent hover:bg-softerPurple focus:ring-4 focus:outline-none focus:ring-softerPurple font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:cursor-pointer"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Add to cart
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <Modal
          setModalOpen={setModalOpen}
          product={product}
          pricingRange={pricingRange}
        />
      )}
    </div>
  );
};

export default ProductCard;
