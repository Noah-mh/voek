import { useEffect, useState } from "react";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Id } from "react-toastify";
interface WishlistButtonProps {
  productID: any;
  customerID: any;
  setHeart: any;
  heart: any;
  toast: any;
}

const WishlistButton = ({
  productID,
  customerID,
  setHeart,
  heart,
  toast,
}: WishlistButtonProps) => {
  const axiosPrivateCustomer = useAxiosPrivateCustomer();
  const [toastId, setToastId] = useState<Id | undefined>(undefined);
  useEffect(() => {
    // Nhat Tien (Wishlist) :D
    const checkWishlistProductExistence = async () => {
      if (customerID != undefined) {
        try {
          const response = await axiosPrivateCustomer.get(
            `/checkWishlistProductExistence/?customerId=${customerID}&productId=${productID}`
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
      toast.dismiss(toastId);

      const id = toast.warn("Please Log in to add into wishlist", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setToastId(id);
      return;
    } else {
      axiosPrivateCustomer
        .post(
          "/insertWishlistedProduct",
          JSON.stringify({
            customerId: customerID,
            productId: productID,
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
            toast.dismiss(toastId);

            const id = toast.success("Item Added to Wishlist! 😊", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setToastId(id);
          }
        })
        .catch((error) => {
          // Handle error here
          console.error(error);
          toast.dismiss(toastId);

          const id = toast.error("Error! Adding to wishlist failed", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setToastId(id);
        });
    }
  };

  const handleRemoveFromWishlist = () => {
    if (customerID == undefined) {
      toast.dismiss(toastId);

      const id = toast.warn("Please Log in to use the wishlist", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setToastId(id);
    } else {
      axiosPrivateCustomer
        .delete(
          `/deleteWishlistedProduct?customer_id=${customerID}&product_id=${productID}`
        )
        .then((response) => {
          if (response.status === 200) {
            setHeart(false);
            toast.dismiss(toastId);

            const id = toast.success("Item Removed from Wishlist! 😊", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setToastId(id);
          }
        })
        .catch((error) => {
          // Handle error here
          console.error(error);
          toast.dismiss(toastId);

          const id = toast.error("Error! Removing from wishlist failed", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setToastId(id);
        });
    }
  };

  return (
    <>
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
    </>
  );
};

export default WishlistButton;
