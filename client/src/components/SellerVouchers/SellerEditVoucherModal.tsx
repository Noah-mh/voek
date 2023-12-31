import { useState } from "react";
import Modal from "@mui/material/Modal";
import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller";
import "./css/SellerVoucherModal.css";
import { ToastContainer, toast, Id } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmCloseModal from "./ConfirmCloseModal";

interface Voucher {
  voucherId: number;
  name: string;
  amount?: number;
  percentage?: number;
  category: number;
  minSpend?: number;
  expiryDate: string;
  redemptionsAvailable?: number;
  active: number;
}

interface Category {
  categoryId: number;
  category: string;
}

interface SellerVoucherModalProps {
  voucher: Voucher | undefined;
  category: Category | undefined;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

const SellerVoucherModal = ({
  voucher,
  category,
  openModal,
  setOpenModal,
}: SellerVoucherModalProps) => {
  const [editedVoucher, setEditedVoucher] = useState<Voucher>(
    voucher as Voucher
  );
  const [isDirty, setIsDirty] = useState(false);
  const [confirmCloseModal, setConfirmCloseModal] = useState(false);
  const [toastId, setToastId] = useState<Id | undefined>(undefined);

  const axiosPrivateSeller = useAxiosPrivateSeller();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (editedVoucher?.amount === 0) {
      toast.dismiss(toastId);

      const id = toast.warn("Discounted price cannot be $0!", {
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
    }

    if (editedVoucher?.percentage === 0) {
      toast.dismiss(toastId);

      const id = toast.warn("Discounted percentage cannot be 0%!", {
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
    }

    axiosPrivateSeller
      .put(`/updateVoucher/`, editedVoucher)
      .then((response) => {
        if (response.status === 204) {
          toast.dismiss(toastId);

          const id = toast.success("Voucher Updated! 😊", {
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
          setIsDirty(false);
        } else if (response.status === 400) {
          toast.dismiss(toastId);

          const id = toast.warn("Please Fill Up All The Text Fields!", {
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
          toast.dismiss(toastId);

          const id = toast.error("Uh-oh! Error! 😔", {
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
        console.error("error: ", error);
      });
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    // currentDate.setDate(currentDate.getDate() + 1);
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
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

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="sellerVoucherModalBox rounded-lg">
          <h2 id="modal-modal-title">Editing "{voucher?.name}" Voucher</h2>
          <form onSubmit={handleSubmit}>
            {/* name */}
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="floating_email"
                id="floating_email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                placeholder=" "
                required
                value={editedVoucher?.name}
                onChange={(text) => {
                  setEditedVoucher({
                    ...editedVoucher,
                    name: text.target.value,
                  });
                  setIsDirty(true);
                }}
              />
              <label
                htmlFor="floating_email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Name
              </label>
            </div>

            {/* amount or percentage */}
            {editedVoucher && editedVoucher.amount !== null && (
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                  placeholder=" "
                  required
                  step={0.01}
                  onKeyDown={(event) => {
                    if (["e", "E", "+", "-"].includes(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  value={
                    editedVoucher?.amount === 0
                      ? "0"
                      : editedVoucher?.amount || ""
                  }
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    if (inputValue.includes("e")) {
                      return;
                    }

                    const parsedValue = parseFloat(inputValue);
                    if (!isNaN(parsedValue)) {
                      setEditedVoucher({
                        ...editedVoucher,
                        amount: parsedValue,
                      });
                      setIsDirty(true);
                      return;
                    }

                    setEditedVoucher({
                      ...editedVoucher,
                      amount: undefined,
                    });
                    setIsDirty(true);
                  }}
                />
                <label
                  htmlFor="floating_email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Amount ($)
                </label>
              </div>
            )}
            {editedVoucher && editedVoucher.percentage !== null && (
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="number"
                  name="floating_email"
                  id="floating_email"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                  placeholder=" "
                  required
                  value={editedVoucher?.percentage}
                  onKeyDown={(event) => {
                    if (["e", "E", "+", "-"].includes(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={(text) => {
                    if (
                      parseInt(text.target.value) < 101 &&
                      parseInt(text.target.value) > -1
                    ) {
                      setEditedVoucher({
                        ...editedVoucher,
                        percentage: parseInt(text.target.value),
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
                  htmlFor="floating_email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Percent (%)
                </label>
              </div>
            )}

            {/* minSpend */}
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="number"
                name="minSpend"
                id="minSpend"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                placeholder=" "
                required
                value={
                  editedVoucher?.minSpend === 0
                    ? "0"
                    : editedVoucher?.minSpend || ""
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
                    setEditedVoucher({
                      ...editedVoucher,
                      minSpend: parsedValue,
                    });
                    setIsDirty(true);
                    return;
                  }

                  setEditedVoucher({
                    ...editedVoucher,
                    minSpend: undefined,
                  });
                  setIsDirty(true);
                }}
              />
              <label
                htmlFor="floating_email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Min-Spend ($)
              </label>
            </div>

            {/* expiryDate */}
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="date"
                name="floating_email"
                id="floating_email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                placeholder=""
                required
                value={editedVoucher?.expiryDate}
                min={getCurrentDate()}
                onChange={(text) => {
                  setEditedVoucher({
                    ...editedVoucher,
                    expiryDate: text.target.value,
                  });
                  setIsDirty(true);
                }}
              />
              <label
                htmlFor="floating_email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Expiry Date (yyyyMMdd)
              </label>
            </div>

            {/* redemptionsAvailable */}
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="number"
                name="floating_email"
                id="floating_email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                placeholder=" "
                required
                value={editedVoucher?.redemptionsAvailable}
                onKeyDown={(event) => {
                  if (["e", "E", "+", "-"].includes(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={(text) => {
                  let number: number = parseInt(text.target.value);
                  setEditedVoucher({
                    ...editedVoucher,
                    redemptionsAvailable: number,
                  });
                  setIsDirty(true);
                }}
              />
              <label
                htmlFor="floating_email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Redemptions Available
              </label>
            </div>

            {/* category */}
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="floating_email"
                id="floating_email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer"
                placeholder=" "
                required
                value={category?.category}
                readOnly
              />
              <label
                htmlFor="floating_email"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Category (Unmutable)
              </label>
            </div>

            {/* submit button */}
            <button
              type="submit"
              className="text-white bg-purpleAccent hover:bg-softerPurple focus:ring-4 focus:outline-none focus:ring-softerPurple font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center hover:cursor-pointer"
            >
              Change!
            </button>
          </form>
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

export default SellerVoucherModal;
