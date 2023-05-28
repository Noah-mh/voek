import { useState } from "react";
import Modal from "@mui/material/Modal";
import "./css/SellerVoucherModal.css";
import useSeller from "../../hooks/useSeller.js";
import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller";

interface Voucher {
  voucherId: number;
  name: string;
  amount?: number;
  percentage?: number;
  category: number;
  minSpend: number;
  expiryDate: string;
  redemptionsAvailable: number;
  active: number;
}

interface SellerVoucherModalProps {
  voucher: Voucher;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  setDeleteVoucherStatus: (status: number) => void;
}

const SellerDeleteVoucherModal = ({
  voucher,
  openModal,
  setOpenModal,
  setDeleteVoucherStatus,
}: SellerVoucherModalProps) => {
  const axiosPrivateSeller = useAxiosPrivateSeller();

  const deleteVoucher = () => {
    axiosPrivateSeller
      .delete(`/deleteVoucher/${voucher.voucherId}`)
      .then((response) => {
        console.log(response);
        setDeleteVoucherStatus(response.status);
        setOpenModal(false);
      });
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="sellerVoucherModalBox">
          <div className="sellerVoucherModalBox__header flex-col">
            <h2 className="sellerVoucherModalBox__header__title">
              Are you sure you want
            </h2>
            <h2 className="sellerVoucherModalBox__header__title">
              to delete{" "}
              <span className="text-softerPurple font-semibold">
                "{voucher.name}"
              </span>{" "}
              voucher?
            </h2>
          </div>

          <div className="z-0 w-full mb-6 group flex">
            <button
              type="submit"
              className="block w-full py-3 px-4 m-2 text-sm font-medium text-center text-white bg-purpleAccent border border-transparent rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-softerPurple"
              onClick={deleteVoucher}
            >
              Yes!
            </button>
            <button
              type="submit"
              className="block w-full py-3 px-4 m-2 text-sm font-medium text-center text-white bg-softerPurple border border-transparent rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-softerPurple"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SellerDeleteVoucherModal;
