import { useEffect, useState } from "react";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../../Cloudinary/Cloudinary";
import axios from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import useCustomer from "../../hooks/UseCustomer";
import { motion } from "framer-motion";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

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
  const [rating, setRating] = useState<number>(0);
  const [heart, setHeart] = useState<boolean>(false);

  const axiosPrivateCustomer = useAxiosPrivateCustomer();
  const { customer } = useCustomer();
  const customerID = customer.customer_id;

  // wishlist
  useEffect(() => {
    console.log("customerID: ", customerID);
    const checkWishlistProductExistence = async () => {
      if (customerID != undefined) {
        try {
          const response = await axiosPrivateCustomer.get(
            `/checkWishlistProductExistence/?customer_id=${customerID}&productId=${product.product_id}`
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
    if (customerID == undefined) {
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
            customerId: customerID,
            productId: product.product_id,
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
    if (customerID == undefined) {
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
          `/deleteWishlistedProduct?customer_id=${customerID}&product_id=${product.product_id}`
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

  // get image and pricing range for each product
  const getPricingAndImage = () => {
    const pricingRange = axios.get(
      `/getProductVariationsPricing/${product.product_id}`
    );
    const image = axios.get(`/getProductImage/${product.product_id}`);
    const rating = axios.get(`/getProductRating/${product.product_id}`);
    Promise.all([pricingRange, image, rating]).then((responses) => {
      setPricingRange(responses[0].data[0]);

      if (responses[1].data[0] === undefined) {
        setImageUrl("/test/No_Image_Available_hyxfvc.jpg");
      } else {
        setImageUrl(responses[1].data[0].imageURL);
      }

      setRating(responses[2].data[0].rating);
    });
  };

  useEffect(() => {
    getPricingAndImage();
  }, [product]);

  return (
    <div>
      <div className="w-96 max-w-sm bg-gray-50 border rounded-lg shadow-xl p-2 m-2">
        <Link to={`/productDetailsWithReviews/${product.product_id}`}>
          <AdvancedImage
            className="p-8 rounded-t-lg hover:cursor-pointer w-full h-80 object-contain"
            cldImg={cld.image(imageUrl)}
            alt="product image"
          />
        </Link>
        <div className="px-2 pb-5">
          <Link to={`/productDetailsWithReviews/${product.product_id}`}>
            <h5 className="text-xl text-ellipsis overflow-hidden whitespace-nowrap w-full font-semibold tracking-tight text-greyAccent hover:text-gray-800 hover:cursor-pointer">
              {product.name}
            </h5>
          </Link>
          <div className="flex items-center mt-2.5 mb-5">
            <span className="bg-softerPurple text-lighterGreyAccent text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ml-3">
              {rating === null ? "No Ratings" : rating}
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
            <div className="flex">
              <motion.button
                className="ml-3 mr-2"
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              >
                {heart ? (
                  <AiFillHeart
                    onClick={() => {
                      handleRemoveFromWishlist();
                    }}
                    color="pink"
                    size="1.75em"
                  />
                ) : (
                  <AiOutlineHeart
                    onClick={() => {
                      handleAddToWishlist();
                    }}
                    color="pink"
                    size="1.75em"
                  />
                )}
              </motion.button>
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
      </div>
      {modalOpen && (
        <Modal
          setModalOpen={setModalOpen}
          product={product}
          pricingRange={pricingRange}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default ProductCard;
