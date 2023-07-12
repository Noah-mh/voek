import React, { useState, useEffect } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Product, ProductVariation, Review } from "./ProductDetailsWithReviews";
import { cld } from "../../Cloudinary/Cloudinary";
import Select from "react-select";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import useCustomer from "../../hooks/UseCustomer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillHeart, AiOutlineHeart, AiFillDelete } from "react-icons/ai";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import { AiOutlineShop } from "react-icons/ai";

//Noah's code

interface ProductDetailProps {
  productData: Product[];
  productReview: Review[];
  sellerData: seller[];
  getAllData: () => void;
  diffInMonths: number;
}
interface CartItem {
  cart_id: number;
  quantity: number;
  customer_id: number;
  product_id: number;
  sku: string;
}

interface seller {
  seller_id: number;
  shop_name: string;
  image_url: string;
  total_products: number;
  total_reviews: number;
  date_created: Date;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  productData,
  productReview,
  sellerData,
  getAllData,
  diffInMonths,
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

  return (
    <div className="flex flex-col my-8 items-center justify-center">
      <div className="flex sm:flex-col xl:flex-row  justify-center space-x-12">
        <div className="flex flex-col justify-center items-center">
          <div className="">
            <div className="xl:w-[300px] sm:w-[300px] xl:h-[300px] sm:h-[300px] border border-lighterGreyAccent flex justify-center items-center overflow-hidden mb-3">
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
              // style={{ position: "static" }}
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
            <h1 className="text-2xl font-500 text-purpleAccent">
              ${price?.toFixed(2)}
            </h1>
          </div>
          <h1 className="text-greyAccent text-sm text-normal mb-[30px] leading-7">
            {productData[0].description}
          </h1>
          <div className="mb-[30px]">
            {hasValidVariation ? (
              <>
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
              </>
            ) : null}
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
                className="text-[#FFFFEA] bg-[#222222] text-sm font-semibold w-auto px-7 h-full"
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

      <div className="w-auto mt-24  pb-[60px] my-8">
        <div className="w-full min-h-[400px]">
          <div className="mx-auto">
            <div className="w-full">
              <div className="w-full bg-[#FAF8FF] flex p-6 content-between items-center overflow-visible shadow-sm">
                <div className="pr-10 box-border border-r border-gray-200 flex max-w-[27.5rem] justify-center items-center">
                  <Link
                    to={`/customerSellerProfile/${sellerData[0].seller_id}`}
                    className="flex-shrink-0 mr-5 relative overflow-visible outline-0"
                  >
                    <div className="w-20 h-20">
                      <AdvancedImage
                        cldImg={cld.image(sellerData[0].image_url)}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </Link>
                  <div className="grow flex flex-col content-center overflow-hidden">
                    <Link
                      to={`/customerSellerProfile/${sellerData[0].seller_id}`}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {sellerData[0].shop_name}
                    </Link>
                    <div className="mt-2 flex space-x-2">
                      {/* <Link
                        to={`/customerSellerProfile/${sellerData[0].seller_id}`}
                        className="outline-0 border border-opacity-10 relative overflow-visible h-9 px-4"
                      >
                        Chat Now
                      </Link> */}
                      <Link
                        to={`/customerSellerProfile/${sellerData[0].seller_id}`}
                        className="outline-0 border border-opacity-10 relative overflow-visible h-9 px-4 flex justify-center items-center"
                      >
                        <AiOutlineShop /> View Shop
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="grow grid grid-cols-3 gap-x-10 gap-y-20 pl-10 text-gray-400">
                  <div className="flex justify-between relative overflow-visible">
                    <h1>Total Products:</h1>{" "}
                    <h1 className="text-pink">
                      {sellerData[0].total_products}
                    </h1>
                  </div>
                  <div className="flex justify-between relative overflow-visible">
                    <h1>Total Ratings:</h1>{" "}
                    <h1 className="text-pink">{sellerData[0].total_reviews}</h1>
                  </div>
                  <div className="flex justify-between relative overflow-visible">
                    <h1>Joined:</h1>{" "}
                    <h1 className="text-pink">
                      {diffInMonths}{" "}
                      {diffInMonths === 1 || diffInMonths === 0 ? (
                        <span>month</span>
                      ) : (
                        <span>months</span>
                      )}{" "}
                      ago
                    </h1>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h1 className="text-[18px] font-medium my-4 ml-10">Reviews</h1>
                <div className="w-full">
                  <div className="w-full mb-[60px]">
                    <div className="w-full px-10 mb-[60px]">
                      {productReview[0].reviews?.length != null ? (
                        productReview[0].reviews.map((review, reviewIndex) => (
                          <div
                            key={reviewIndex}
                            className="bg-gray-50 px-10 py-[32px] mb-2.5"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10" >
                                  <AdvancedImage
                                    cldImg={cld.image(review.customerImage).resize(fill().width(250).height(250).gravity(focusOn(FocusOn.faces())))}
                                    className="object-cover rounded-lg"
                                  />
                                </div>
                                <h1 className="text-[18px] font-medium break-words">
                                  {review.customerName}
                                </h1>
                              </div>
                              <div>
                                {review.customer_id === customer_id ? (
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
                                ) : null}
                              </div>
                            </div>

                            <div className="mb-[30px]">
                              <h1 className="text-[15px] text-grey-400 leading-7 text-normal break-words">
                                {review.comment}
                              </h1>
                              {review.image_urls && (
                                <div className="flex space-x-2">
                                  {review.image_urls.map(
                                    (imageUrl, imageIndex) => (
                                      <div
                                        className="w-16 h-16"
                                        key={imageIndex}
                                      >
                                        <AdvancedImage
                                          cldImg={cld.image(imageUrl)}
                                          className="object-cover w-full h-full"
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col mt-6 justify-center items-center">
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
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProductDetail;
