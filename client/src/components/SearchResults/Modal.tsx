import { useEffect, useState } from "react";
import axios from "../../api/axios";

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

  useEffect(() => {
    console.log("productId: ", product.product_id);
    axios
      .get(`/getProductVariations/${product.product_id}`)
      .then((response: any) => response.data)
      .then((data: Array<object>) => {
        console.log("data: ", data);
        setStatus(true);
        setVariations(data);
      })
      .catch((err: any) => {
        console.log(err);
        setStatus(false);
      });
  }, []);

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
        <div
          className="relative z-10 bg-white rounded-lg w-80"
          onBlur={() => {
            setModalOpen(false);
          }}
        >
          <div className="flex justify-end p-4">
            <button
              className="px-4 py-2 mr-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Yes
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-150 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
