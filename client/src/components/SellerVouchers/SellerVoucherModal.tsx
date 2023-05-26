import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import "./css/SellerVoucherModal.css";

interface Voucher {
  name: string;
  amount?: string | number | null;
  percentage?: string | number | null;
  minSpend?: number;
  expiryDate?: string;
  redemptionsAvailable?: number;
  category?: number;
}

interface SellerVoucherModalProps {
  voucher: Voucher | undefined;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

const SellerVoucherModal = ({
  voucher,
  openModal,
  setOpenModal,
}: SellerVoucherModalProps) => {
  const [editedVoucher, setEditedVoucher] = useState<Voucher | undefined>(
    voucher
  );

  useEffect(() => {
    console.log("editedVoucher: ", editedVoucher);
  }, [editedVoucher]);

  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="sellerVoucherModalBox">
          <h2 id="modal-modal-title">Editing "{voucher?.name}" Voucher</h2>
          <form>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="email"
                name="floating_email"
                id="floating_email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                placeholder=" "
                value={editedVoucher?.name}
                onChange={(text) => {
                  console.log("text: ", text.target.value);
                  setEditedVoucher({
                    ...editedVoucher,
                    name: text.target.value,
                  });
                }}
              />
              <label
                htmlFor="floating_email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Name
              </label>
            </div>
            {editedVoucher && editedVoucher.amount !== null && (
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="email"
                  name="floating_email"
                  id="floating_email"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                  placeholder=" "
                  value={editedVoucher?.amount}
                  onChange={(text) => {
                    let number: number | string = parseInt(text.target.value);
                    console.log("number: ", number);
                    if (isNaN(number)) {
                      if (text.target.value !== "") {
                        return;
                      }
                      number = "";
                    }
                    setEditedVoucher({
                      ...editedVoucher,
                      amount: number,
                    });
                  }}
                />
                <label
                  htmlFor="floating_email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Amount
                </label>
              </div>
            )}
            {editedVoucher && editedVoucher.percentage !== null && (
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="email"
                  name="floating_email"
                  id="floating_email"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-softerPurple peer"
                  placeholder=" "
                  value={editedVoucher?.percentage}
                  onChange={(text) => {
                    let number: number | string = parseInt(text.target.value);
                    console.log("number: ", number);
                    if (isNaN(number)) {
                      if (text.target.value !== "") {
                        return;
                      }
                      number = "";
                    }
                    if (
                      parseInt(number as string) < 100 &&
                      parseInt(number as string) > 0
                    ) {
                      setEditedVoucher({
                        ...editedVoucher,
                        percentage: number,
                      });
                    }
                  }}
                />
                <label
                  htmlFor="floating_email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-softerPurple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Percent
                </label>
              </div>
            )}
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SellerVoucherModal;
