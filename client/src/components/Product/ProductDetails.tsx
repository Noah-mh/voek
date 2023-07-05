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
import { motion } from "framer-motion";
import { AiFillHeart, AiOutlineHeart, AiFillDelete } from "react-icons/ai";
import Rating from "@mui/material/Rating";
import RedeemVoucher from "../RedeemVoucher/RedeemVoucher";
//Noah's code

interface ProductDetailProps {
  productData: Product[];
  productReview: Review[];
  seller_id: number;
  getAllData: () => void;
}
interface CartItem {
  cart_id: number;
  quantity: number;
  customer_id: number;
  product_id: number;
  sku: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  productData,
  productReview,
  seller_id,
  getAllData,
}) => {
  const axiosPrivateCustomer = useAxiosPrivateCustomer();
  const { customer } = useCustomer();
  const customer_id = customer.customer_id;
  const [imageChosen, setImageChosen] = useState<string>(
    productData[0].image_urls[0]
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [price, setPrice] = useState<number | null>(
    productData[0].variations![0].price || null
  );
  const [selectedSku, setSelectedSku] = useState<string | null>(
    productData[0].variations![0].sku || null
  );
  const [heart, setHeart] = useState<boolean>(false);

  const options = productData[0].variations!.reduce<
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
  }, []);

  const [selectedVariation, setSelectedVariation] = useState(
    options[0]?.value || null
  );
  useEffect(() => {
    if (customer_id != undefined) {
      axiosPrivateCustomer
        .get(`getCartDetails/${customer_id}?sku=${selectedSku}`)
        .then((response) => {
          setCart(response.data.cartDetails);
        });
    }

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

  useEffect(() => {
    // Nhat Tien (Wishlist) :D
    const checkWishlistProductExistence = async () => {
      if (customer_id != undefined) {
        try {
          const response = await axiosPrivateCustomer.get(
            `/checkWishlistProductExistence/?customerId=${customer_id}&productId=${productData[0].product_id}`
          );
          if (response.data.length > 0) {
            setHeart(true);
          } else {
            setHeart(false);
          }
        } catch (err: any) {
          setHeart(false);
        }
      }
    };
    checkWishlistProductExistence();
  }, []);

  const handleAddToWishlist = () => {
    if (customer_id == undefined) {
      toast.warn("Please Log in to add into wishlist", {
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
          "/insertWishlistedProduct",
          JSON.stringify({
            customerId: customer_id,
            productId: productData[0].product_id,
          }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
        .then((response) => {
          // On successful addition to wishlist, show the popup
          if (response.status === 201) {
            setHeart(true);
            toast.success("Item Added to Wishlist! 😊", {
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
        })
        .catch((error) => {
          // Handle error here
          console.error(error);
          toast.error("Error! Adding to wishlist failed", {
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

  const handleRemoveFromWishlist = () => {
    if (customer_id == undefined) {
      toast.warn("Please Log in to use the wishlist", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      axiosPrivateCustomer
        .delete(
          `/deleteWishlistedProduct?customer_id=${customer_id}&product_id=${productData[0].product_id}`
        )
        .then((response) => {
          if (response.status === 200) {
            setHeart(false);
            toast.success("Item Removed from Wishlist! 😊", {
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
        })
        .catch((error) => {
          // Handle error here
          console.error(error);
          toast.error("Error! Removing from wishlist failed", {
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

  //Noah
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

    setQuantity((prevQuantity) => {
      if (
        cart.length == 0 &&
        productVariation &&
        prevQuantity < productVariation.quantity!
      ) {
        return prevQuantity + 1;
      } else if (
        productVariation &&
        prevQuantity + cart[0]?.quantity < productVariation.quantity!
      ) {
        return prevQuantity + 1;
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
        return prevQuantity; // Return the same quantity if it shouldn't be updated
      }
    });
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

  const handleDeleteReview = (review_id: number, sku: string) => {
    axiosPrivateCustomer
      .delete(`/deleteReview`, { data: { review_id, sku } })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Review Deleted! 😊", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          getAllData();
        }
      })
      .catch((error) => {
        // Handle error here
        console.error(error);
        toast.error("Error! Deleting review failed", {
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
  };

  useEffect(() => {
    console.log("productData", productData);
  }, []);

  return (
    <div className="flex flex-col my-8 mx-48">
      <div className="flex sm:flex-col xl:flex-row w-full justify-center space-x-12">
        <div className="flex flex-col">
          <div className="w-full">
            <div className="xl:w-[800px] sm:w-[400px] xl:h-[600px] sm:h-[300px] border border-lighterGreyAccent flex justify-center items-center overflow-hidden mb-3">
              <AdvancedImage
                className="object-contain"
                cldImg={cld.image(imageChosen)}
                alt="product image"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {productData[0].image_urls.map((image, index: number) => {
              const imageStyle =
                imageChosen === image
                  ? "w-full h-full object-contain"
                  : "w-full h-full object-contain opacity-50 hover:opacity-100";
              return (
                <div
                  className="w-[110px] h-[110px] p-[15px] border border-lighterGreyAccent cursor-pointer"
                  key={index}
                >
                  <AdvancedImage
                    className={imageStyle}
                    cldImg={cld.image(image)}
                    alt="product image"
                    onClick={() => setImageChosen(image)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full mt-10 xl:mt-0">
          <h1 className="text-xl font-medium text-black mb-4">
            {productData[0].name}
          </h1>
          <div className="flex space-x-[10px] items-center mb-6">
            <Rating
              name="half-rating-read"
              value={Number(productReview[0].rating)}
              precision={0.5}
              readOnly
            />
            <h1 className="text-[13px] font-normal">
              {productReview[0].reviews?.length != null
                ? productReview[0].reviews?.length
                : 0}{" "}
              <span className="ml-1">Reviews</span>
            </h1>
          </div>
          <div className="items-center mb-7">
            <h1 className="text-2xl font-500 text-purpleAccent">${price}</h1>
          </div>
          <h1 className="text-greyAccent text-sm text-normal mb-[30px] leading-7">
            {productData[0].description}
          </h1>
          <div className="mb-[30px]">
            <h1 className="text-sm font-normal uppercase text-greyAccent mb-[14px] inline-block">
              Variations
            </h1>
            <div className="flex space-x-4 items-center">
              {hasValidVariation && (
                <Select
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: "rgba(92, 68, 68, 0.3)",
                      primary: "#310d20",
                    },
                  })}
                  value={
                    selectedVariation
                      ? {
                          label: selectedVariation,
                          value: selectedVariation,
                          sku: selectedSku,
                        }
                      : null
                  }
                  onChange={(option) => {
                    setSelectedVariation(option?.value || null);
                    setSelectedSku(option?.sku || null);
                  }}
                  options={options}
                />
              )}
            </div>
          </div>
          <div className="w-full flex items-center h-[50px] space-x-[10px] mb-[30px]">
            <div className="w-[120px] h-full px-[26px] flex items-center border border-lighterGreyAccent">
              <div className="flex justify-between items-center w-full">
                <button
                  className="text-base text-gray-500 hover:text-purpleAccent"
                  onClick={() => decreaseQuantity()}
                >
                  -
                </button>
                <h1>{quantity}</h1>
                <button
                  className="text-base text-gray-500 hover:text-purpleAccent"
                  onClick={() => increaseQuantity(selectedSku)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="w-[60px] h-full flex justify-center items-center border border-lighterGreyAccent">
              <div className="hover:cursor-pointer">
                {heart ? (
                  <AiFillHeart
                    onClick={() => {
                      handleRemoveFromWishlist();
                    }}
                    color="pink"
                    size="2em"
                  />
                ) : (
                  <AiOutlineHeart
                    onClick={() => {
                      handleAddToWishlist();
                    }}
                    color="pink"
                    size="2em"
                  />
                )}
              </div>
            </div>
            <div className="flex-1 h-full">
              <button
                onClick={handleAddToCart}
                className="text-[#FFFFEA] bg-[#222222] text-sm font-semibold w-56 h-full"
              >
                Add To Cart
              </button>
            </div>
          </div>
          <div className="mb-[20px]">
            <h1 className="text-[13px] leading-7">
              SKU: <span className="text-gray-400">{selectedSku}</span>
            </h1>
          </div>
          <div className="mb-[20px]">
            {/* <RedeemVoucher seller_id={seller_id} /> */}
          </div>
        </div>
      </div>

      <div className="w-auto mt-28 relative pb-[60px] my-8 mx-48">
        <div className="w-full min-h-[400px]">
          <div className="mx-auto">
            <div className="w-full">
              <h1 className="text-[18px] font-medium my-4 ml-10">Reviews</h1>
              <div className="w-full">
                <div className="w-full reviews mb-[60px]">
                  <div className="w-full comments px-10 mb-[60px]">
                    {productReview[0].reviews?.length != null ? (
                      productReview[0].reviews.map((review, reviewIndex) => (
                        <div
                          key={reviewIndex}
                          className="bg-gray-50 px-10 py-[32px] mb-2.5"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h1 className="text-[18px] font-medium break-words">
                              {review.customerName}
                            </h1>
                            <div>
                              {review.customer_id === customer_id && (
                                <button
                                  className="justify-content-center align-item-center"
                                  onClick={() =>
                                    handleDeleteReview(
                                      review.review_id,
                                      review.sku
                                    )
                                  }
                                >
                                  <AiFillDelete />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="mb-[30px]">
                            <h1 className="text-[15px] text-grey-400 leading-7 text-normal break-words">
                              {review.comment}
                            </h1>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col mt-48 justify-center items-center">
                        <h1>There are no reviews for this product</h1>
                        <h1>Be the first one to review!</h1>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProductDetail;
