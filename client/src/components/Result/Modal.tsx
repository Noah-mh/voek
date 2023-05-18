import { useEffect, useState, useContext } from "react";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import axios from "../../api/axios";
import Loader from "../Loader/Loader";
<<<<<<< HEAD:client/src/components/SearchResults/Modal.tsx
import useCustomer from "../../hooks/UseCustomer";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
=======
import CustomerContext from "../../context/CustomerProvider";
>>>>>>> 38f45a63e7b8c241a2882160ae9177c851d7e7a9:client/src/components/Result/Modal.tsx

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../../Cloudinary/Cloudinary";

interface ModalProps {
  setModalOpen: (modalOpen: boolean) => void;
  product: {
    product_id: number;
    name: string;
    description: string;
    image: string;
  };
  pricingRange: Pricing | undefined;
}

<<<<<<< HEAD:client/src/components/SearchResults/Modal.tsx
const Modal = ({ setModalOpen, product }: ModalProps) => {
  const { customer } = useCustomer();
  const customerId = customer.customer_id;
  //const coins = customer.coins;

=======
interface Pricing {
  lowestPrice: number;
  highestPrice: number;
}

interface Variation {
  active: number;
  product_id: number;
  quantity: number;
  sku: string;
  price: number;
  variation_1: string | null;
  variation_2: string | null;
  image: string;
}

const Modal = ({ setModalOpen, product, pricingRange }: ModalProps) => {
>>>>>>> 38f45a63e7b8c241a2882160ae9177c851d7e7a9:client/src/components/Result/Modal.tsx
  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const [status, setStatus] = useState<boolean>(false);
  const [variations, setVariations] = useState<Array<Variation>>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [stock, setStock] = useState<number>(0);
  const [chosenSKU, setChosenSKU] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");

<<<<<<< HEAD:client/src/components/SearchResults/Modal.tsx
  // const [customerId, setCustomerId] = useState<number>(1);
=======
  const { customer } = useContext(CustomerContext);
  const customerId = customer.customer_id;
>>>>>>> 38f45a63e7b8c241a2882160ae9177c851d7e7a9:client/src/components/Result/Modal.tsx

  const addToCart = () => {
    axiosPrivateCustomer
      .post(
        `/insertCart`,
        JSON.stringify({
          quantity,
          customerId,
          productId: product.product_id,
          sku: chosenSKU,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((response) => response.status)
      .then((data) => {
        if (data === 200) {
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
        } else {
          toast.error("Uh-oh! Error! 😔", {
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
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(`/getProductVariations/${product.product_id}`)
      .then((response: any) => response.data)
      .then((data: Array<Variation>) => {
        const promises = data.map((variation) => {
          return axios
            .get(`/getProductVariationImage/${variation.sku}`)
            .then((response: any) => {
              return { variation: variation, data: response.data };
            });
        });
        return Promise.all(promises);
      })
      .then((responses: Array<any>) => {
        const variations = responses.map((response) => {
          response.variation.image = response.data[0].imageURL;
          return response.variation;
        });
        setVariations(variations);

        if (
          variations.length === 1 &&
          variations[0].variation_1 == null &&
          variations[0].variation_2 == null
        ) {
          setChosenSKU(variations[0].sku);
          setStock(variations[0].quantity);
        }

        let totalStock = 0;
        variations.forEach((variation: any) => {
          totalStock += variation.quantity;
        });
        setStock(totalStock);
        setImageUrl(variations[0].image);
        setStatus(true);
      })
      .catch((err: any) => {
        console.log(err);
        setStatus(false);
      });
  }, []);

  const updateSKU = (chosenSKU: string) => {
    setChosenSKU(chosenSKU);
    setQuantity(1);

    if (chosenSKU === "") {
      const totalStock = variations
        .map((variation) => variation.quantity)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      setStock(totalStock);
    } else {
      const variation = variations.find(
        (variation) => variation.sku === chosenSKU
      );
      if (variation) {
        setStock(variation.quantity);
        setPrice(variation.price);
        setImageUrl(variation.image);
      }
    }
  };

  return (
    <div>
      {status ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
          </div>
          <div className="relative z-10 bg-white rounded-lg w-96">
            <div className="flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="m-2 hover:cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  size="lg"
                  style={{ color: "#484848" }}
                />
              </button>
            </div>
            <div className="flex justify-center my-1">
              <div className="w-1/2 mx-2 flex justify-center items-center">
                <AdvancedImage
                  cldImg={cld.image(imageUrl)}
                  alt="product image"
                  className="rounded-sm"
                />
              </div>
              <div className="text-greyAccent font-semibold text-2xl mx-2">
                <h1>{product.name}</h1>
                <h1 className="text-purpleAccent mt-3">
                  $
                  {chosenSKU === ""
                    ? pricingRange?.lowestPrice === pricingRange?.highestPrice
                      ? pricingRange?.lowestPrice
                      : pricingRange?.lowestPrice +
                        " - $" +
                        pricingRange?.highestPrice
                    : price}
                </h1>
                <h1 className="text-lg">Stock: {stock}</h1>
              </div>
            </div>
            <div className="w-11/12 h-0.5 bg-gray-400 mx-auto rounded-md mb-2 mt-3"></div>
            <div className="flex flex-wrap">
              {variations.map((variation: any, index: number) => {
                return (
                  <div
                    className={
                      chosenSKU === variation.sku
                        ? "flex justify-between my-2 mx-5 bg-gray-200 rounded-md hover:cursor-pointer hover:bg-gray-300 ring-2 ring-softerPurple"
                        : "flex justify-between my-2 mx-5 bg-gray-200 rounded-md hover:cursor-pointer hover:bg-gray-300"
                    }
                    onClick={() => {
                      if (chosenSKU === variation.sku) {
                        updateSKU("");
                      } else {
                        updateSKU(variation.sku);
                      }
                    }}
                    key={index}
                  >
                    <div className="text-greyAccent font-semibold text-xl">
                      <h1>{variation.variation_1}</h1>
                      <h1>{variation.variation_2}</h1>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="w-11/12 h-0.5 bg-gray-400 mx-auto rounded-md my-2"></div>
            <div className="flex justify-end items-center my-2">
              <button
                className={
                  quantity === 1
                    ? "text-sm border px-2 py-1 mx-2 opacity-95"
                    : "text-sm border px-2 py-1 mx-2 bg-lighterGreyAccent"
                }
                onClick={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                  }
                }}
                disabled={quantity === 1}
              >
                -
              </button>
              {quantity}
              <button
                className={
                  quantity === stock
                    ? "text-sm border px-2 py-1 mx-2 opacity-95"
                    : "text-sm border px-2 py-1 mx-2 bg-lighterGreyAccent"
                }
                onClick={() => {
                  if (quantity < stock) {
                    setQuantity(quantity + 1);
                  }
                }}
                disabled={quantity === stock}
              >
                {" "}
                +{" "}
              </button>
            </div>
            <div className="w-11/12 h-0.5 bg-gray-400 mx-auto rounded-md my-2"></div>
            <div className="flex justify-center p-4">
              <button
                className={
                  chosenSKU === ""
                    ? "px-4 py-2 mr-2 text-sm font-medium text-white bg-purpleAccent rounded-md hover:bg-softerPurple focus:outline-none focus:ring focus:ring-softerPurple tracking-wider w-full opacity-25"
                    : "px-4 py-2 mr-2 text-sm font-medium text-white bg-purpleAccent rounded-md hover:bg-softerPurple focus:outline-none focus:ring focus:ring-softerPurple tracking-wider w-full"
                }
                onClick={() => {
                  addToCart();
                }}
                disabled={chosenSKU === "" ? true : false}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
          </div>
          <div className="relative z-10 bg-white rounded-lg w-80">
            <div className="flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="m-2 hover:cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  size="lg"
                  style={{ color: "#484848" }}
                />
              </button>
            </div>
            <div className="flex justify-center items-center my-1">
              <Loader />
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Modal;
