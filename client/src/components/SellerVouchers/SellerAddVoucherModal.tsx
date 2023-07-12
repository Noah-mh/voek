import { useState } from "react";
import Modal from "@mui/material/Modal";
import "./css/SellerVoucherModal.css";
import useSeller from "../../hooks/useSeller.js";
import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmCloseModal from "./ConfirmCloseModal";

interface Voucher {
  name?: string;
  sellerId?: number;
  type?: number;
  amount?: number;
  Category?: number;
  minSpend?: number;
  expiryDate?: string;
  redemptionsAvailable?: number;
}

interface Category {
  categoryId: number;
  category: string;
}

interface SellerVoucherModalProps {
  categories: Category[];
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  setAddVoucherStatus: (status: number) => void;
}

const SellerAddVoucherModal = ({
  categories,
  openModal,
  setOpenModal,
  setAddVoucherStatus,
}: SellerVoucherModalProps) => {
  const [isDirty, setIsDirty] = useState(false);
  const [confirmCloseModal, setConfirmCloseModal] = useState(false);

  const { seller } = useSeller();
  const sellerId = seller.seller_id;

  const axiosPrivateSeller = useAxiosPrivateSeller();

  const [voucher, setVoucher] = useState<Voucher>({
    sellerId: sellerId,
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (voucher?.type === 1 && voucher?.amount === 0) {
      toast.warn("Discounted price cannot be $0!", {
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
    }

    axiosPrivateSeller
      .post(`/insertVoucher`, voucher)
      .then((response) => {
        setAddVoucherStatus(response.status);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
    setOpenModal(false);
  };

  const handleClose = () => {
    if (isDirty) {
      setConfirmCloseModal(true);
    } else {
      setOpenModal(false);
    }
  };

  const handleConfirm = async () => {
    setConfirmCloseModal(false);
    setOpenModal(false);
  };

  const handleCancel = () => {
    setConfirmCloseModal(false);
    setOpenModal(true);
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    // currentDate.setDate(currentDate.getDate() + 1);
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="sellerVoucherModalBox">
          <div className="sellerVoucherModalBox__header">
            <h2 className="sellerVoucherModalBox__header__title">
              Add Voucher
            </h2>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              {/* name */}
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                  placeholder=" "
                  required
                  value={voucher?.name || ""}
                  onChange={(text) => {
                    setVoucher({
                      ...voucher,
                      name: text.target.value,
                    });
                    setIsDirty(true);
                  }}
                />
                <label
                  htmlFor="name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Name
                </label>
              </div>

              {/* Type, Amount/ Percentage */}
              <div className="relative z-0 w-full mb-6 group">
                <select
                  id="type"
                  value={voucher?.type || ""}
                  onChange={(text) => {
                    setVoucher({
                      ...voucher,
                      type: parseInt(text.target.value),
                    });
                    setIsDirty(true);
                  }}
                  className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                >
                  <option value="" disabled selected hidden>
                    Select your Discount Type
                  </option>
                  <option value="1">Price (e.g., $10)</option>
                  <option value="2">Percentage (e.g., 10%)</option>
                </select>
              </div>

              {/* Amount */}
              {voucher?.type === 1 && (
                <div className="relative z-0 w-full mb-6 group">
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                    placeholder=" "
                    required
                    step={0.01}
                    value={voucher?.amount === 0 ? "0" : voucher?.amount || ""}
                    onKeyDown={(event) => {
                      if (["e", "E", "+", "-"].includes(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={(event) => {
                      const inputValue = event.target.value;
                      if (inputValue.includes("e")) {
                        return;
                      }

                      const parsedValue = parseFloat(inputValue);
                      if (!isNaN(parsedValue)) {
                        setVoucher({
                          ...voucher,
                          amount: parsedValue,
                        });
                        setIsDirty(true);
                        return;
                      }

                      setVoucher({
                        ...voucher,
                        amount: undefined,
                      });
                      setIsDirty(true);
                    }}
                  />
                  <label
                    htmlFor="amount"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Amount ($)
                  </label>
                </div>
              )}

              {/* Percentage */}
              {voucher?.type === 2 && (
                <div className="relative z-0 w-full mb-6 group">
                  <input
                    type="number"
                    name="percentage"
                    id="percentage"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                    placeholder=" "
                    required
                    value={voucher?.amount || ""}
                    onKeyDown={(event) => {
                      if (["e", "E", "+", "-"].includes(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={(text) => {
                      if (
                        parseInt(text.target.value) < 101 &&
                        parseInt(text.target.value) > 0
                      ) {
                        setVoucher({
                          ...voucher,
                          amount: parseInt(text.target.value),
                        });
                        setIsDirty(true);
                      } else {
                        toast.warn(
                          "Type Percentage Must be Between 0% and 101%",
                          {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                          }
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor="percentage"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Percentage (%)
                  </label>
                </div>
              )}

              {/* Category */}
              <div className="relative z-0 w-full mb-6 group">
                <select
                  id="countries"
                  className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                  placeholder=""
                  value={voucher?.Category || ""}
                  onChange={(text) => {
                    setVoucher({
                      ...voucher,
                      Category: parseInt(text.target.value),
                    });
                    setIsDirty(true);
                  }}
                >
                  <option value="" disabled selected hidden>
                    Select the Category
                  </option>
                  {categories.map((category: Category, index: number) => {
                    return (
                      <option key={index} value={category.categoryId}>
                        {category.category}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Min Spend */}
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="number"
                  name="minSpend"
                  id="minSpend"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                  placeholder=" "
                  required
                  value={
                    voucher?.minSpend === 0 ? "0" : voucher?.minSpend || ""
                  }
                  onKeyDown={(event) => {
                    if (["e", "E", "+", "-"].includes(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={(text) => {
                    const inputValue = text.target.value;
                    if (inputValue.includes("e")) {
                      return;
                    }

                    const parsedValue = parseFloat(inputValue);
                    if (!isNaN(parsedValue)) {
                      setVoucher({
                        ...voucher,
                        minSpend: parsedValue,
                      });
                      setIsDirty(true);
                      return;
                    }

                    setVoucher({
                      ...voucher,
                      minSpend: undefined,
                    });
                    setIsDirty(true);
                  }}
                />
                <label
                  htmlFor="minSpend"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Min Spend ($)
                </label>
              </div>

              {/* Expiry Date */}
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="date"
                  name="expiryDate"
                  id="expiryDate"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                  placeholder=" "
                  required
                  value={voucher?.expiryDate || ""}
                  min={getCurrentDate()}
                  onChange={(text) => {
                    setVoucher({
                      ...voucher,
                      expiryDate: text.target.value,
                    });
                    setIsDirty(true);
                  }}
                />
                <label
                  htmlFor="expiryDate"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Expiry Date
                </label>
              </div>

              {/* Redemptions Available */}
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="number"
                  name="redemptionsAvailable"
                  id="redemptionsAvailable"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                  placeholder=" "
                  required
                  value={voucher?.redemptionsAvailable || ""}
                  onKeyDown={(event) => {
                    if (["e", "E", "+", "-"].includes(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={(text) => {
                    setVoucher({
                      ...voucher,
                      redemptionsAvailable: parseInt(text.target.value),
                    });
                    setIsDirty(true);
                  }}
                />
                <label
                  htmlFor="redemptionsAvailable"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Redemptions Available
                </label>
              </div>

              {/* Submit Button */}
              <div className="relative z-0 w-full mb-6 group">
                <button
                  type="submit"
                  className="block w-full py-3 px-4 text-sm font-medium text-center text-white bg-softerPurple border border-transparent rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-softerPurple"
                >
                  Add Voucher!
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <ConfirmCloseModal
        confirmCloseModal={confirmCloseModal}
        handleCancel={handleCancel}
        handleConfirm={handleConfirm}
      />

      <ToastContainer />
    </div>
  );
};

export default SellerAddVoucherModal;
