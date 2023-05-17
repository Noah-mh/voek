import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { macbook } from "./images";
import Loader from "../Loader/Loader";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ModalProps {
  setModalOpen: (modalOpen: boolean) => void;
  product: {
    product_id: number;
    name: string;
    price: number;
    description: string;
    image: string;
  };
}

const Modal = ({ setModalOpen, product }: ModalProps) => {
  const [status, setStatus] = useState<boolean>(false);
  const [variations, setVariations] = useState<Array<object>>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [stock, setStock] = useState<number>(0);
  const [chosenSKU, setChosenSKU] = useState<string>("");
  const [notificationStatus, setNotificationStatus] = useState<boolean>(false);

  const [customerId, setCustomerId] = useState<number>(1);

  const addToCart = () => {
    axios
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
      .then((data: Array<object>) => {
        setStatus(true);
        setVariations(data);
      })
      .catch((err: any) => {
        console.log(err);
        setStatus(false);
      });
  }, []);

  useEffect(() => {
    setQuantity(1);
    variations.map((variation: any) => {
      if (variation.sku === chosenSKU) {
        setStock(variation.quantity);
      }
    });
  }, [chosenSKU]);

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
                <img src={macbook} className="rounded-sm" />
              </div>
              <div className="text-greyAccent font-semibold text-2xl mx-2">
                <h1>{product.name}</h1>
                <h1 className="text-purpleAccent mt-3">${product.price}</h1>
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
                        setChosenSKU("");
                      } else {
                        setChosenSKU(variation.sku);
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
