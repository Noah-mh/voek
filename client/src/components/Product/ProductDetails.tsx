import React, { useState, useEffect } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Product, ProductVariation, Review } from "./ProductDetailsWithReviews";
import { cld } from "../../Cloudinary/Cloudinary";
import Select from "react-select";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import useCustomer from "../../hooks/UseCustomer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface ProductDetailProps {
  productData: Product[];
  productReview: Review[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  productData,
  productReview,
}) => {
  const axiosPrivateCustomer = useAxiosPrivateCustomer();
  const { customer } = useCustomer();
  const customer_id = customer.customer_id;

  const [selectedVariation, setSelectedVariation] = useState<string | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number | null>(
    productData[0].variations![0].price || null
  );
  const [selectedSku, setSelectedSku] = useState<string | null>(
    productData[0].variations![0].sku || null
  );
  const [heart, setHeart] = useState<boolean>(false);

  useEffect(() => {
    if (selectedVariation) {
      const selectedProduct = productData.find((product) =>
        product.variations?.some((variation) => {
          const combinedKey = variation.variation_2
            ? `${variation.variation_1} / ${variation.variation_2}`
            : variation.variation_1;

          return combinedKey === selectedVariation;
        })
      );

      const selectedProductVariation = selectedProduct?.variations?.find(
        (variation) => {
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
    .filter((product) => product.variations !== null)
    .reduce(
      (acc: ProductVariation[], curr: Product) => [
        ...acc,
        ...(curr.variations || []),
      ],
      []
    );

  // Checking if there's at least one variation_1 that's not null
  const hasValidVariation = allVariations.some(
    (variation) => variation.variation_1 !== null
  );
  const increaseQuantity = (sku: string | null) => {
    const productVariation = allVariations.find(
      (variation) => variation.sku === sku
    );

    if (productVariation && quantity < productVariation.quantity!) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    } else {
      // Show notification
      toast.error("Cannot add more than the available quantity", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const handleAddToCart = () => {
    if (!customer_id) {
      toast.error("Please Log in to add into cart", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    } else {
      axiosPrivateCustomer
        .post(
          "/addToCart",
          JSON.stringify({
            product_id: productData[0].product_id,
            sku: selectedSku,
            quantity,
            customer_id,
          }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
        .then((response) => {
          // On successful addition to cart, show the popup
          console.log(response);
          toast.success("Item Added to Cart! 😊", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
        .catch((error) => {
          // Handle error here
          console.error(error);
          toast.error("Error! Adding to cart failed", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    }
  };

  return (
    <div className="container">
      {productData.map((pData, index: React.Key | null | undefined) => (
        <div key={index}>
          <h1>{pData.name}</h1>
          {pData.image_urls && (
            <Carousel showThumbs={false}>
              {pData.image_urls.map(
                (
                  imageUrl: string | undefined,
                  index: React.Key | null | undefined
                ) => (
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
                value={
                  selectedVariation
                    ? {
                        label: selectedVariation,
                        value: selectedVariation,
                        sku: "",
                      }
                    : null
                }
                onChange={(option) => {
                  setSelectedVariation(option?.value || null);
                  console.log("Selected option SKU: ", option?.sku || "No SKU");
                  setSelectedSku(option?.sku || null);
                }}
                options={pData.variations!.reduce<
                  { label: string; value: string; sku: string }[]
                >((options, variation: ProductVariation) => {
                  if (variation.variation_1) {
                    const compoundKey = variation.variation_2
                      ? `${variation.variation_1} / ${variation.variation_2}`
                      : variation.variation_1;

                    options.push({
                      value: compoundKey,
                      label: compoundKey,
                      sku: variation.sku,
                    });
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
          onClick={() => decreaseQuantity()}
          className="bg-gray-200 text-black py-1 px-3 rounded-lg focus:outline-none hover:bg-gray-300"
        >
          -
        </button>
        <span className="text-lg">{quantity}</span>
        <button
          onClick={() => increaseQuantity(selectedSku)}
          className="bg-gray-200 text-black py-1 px-3 rounded-lg focus:outline-none hover:bg-gray-300"
        >
          +
        </button>
      </div>
      <span>
        <button
          onClick={handleAddToCart}
          className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add to Cart
        </button>
        <button>
          {heart ? (
            <AiFillHeart onClick={() => setHeart(!heart)} />
          ) : (
            <AiOutlineHeart onClick={() => setHeart(!heart)} />
          )}
        </button>
      </span>

      {productReview.map((pReview, index) => (
        <div key={index}>
          <h3>Rating: {pReview.rating}</h3>
          <h3>Reviews:</h3>
          {pReview.reviews &&
            pReview.reviews.map((review, reviewIndex) => (
              <div key={reviewIndex}>
                <h4>{review.customerName}</h4>
                {review.image_urls && (
                  <Carousel showThumbs={false}>
                    {review.image_urls.map((imageUrl, imageIndex) => (
                      <div className="image-container" key={imageIndex}>
                        <AdvancedImage cldImg={cld.image(imageUrl)} />
                      </div>
                    ))}
                  </Carousel>
                )}{" "}
                <p>{review.comment}</p>
              </div>
            ))}
        </div>
      ))}

      <ToastContainer />
    </div>
  );
};

export default ProductDetail;
