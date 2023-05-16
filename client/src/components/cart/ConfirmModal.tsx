import React, { useState } from "react";
import "./ConfirmModal.css";

interface ConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  setConfirmationValue: (value: boolean) => void;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onCancel,
  setConfirmationValue,
}) => {
  const [modalOpen, setModalOpen] = useState(isOpen);

  const closeModal = (): void => {
    setModalOpen(false);
    onCancel();
  };

  const handleConfirm = (): void => {
    setModalOpen(false);
    setConfirmationValue(true);
    closeModal();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
      </div>
      <div className="relative z-10 bg-white rounded-lg w-80">
        <div className="px-10 py-4 text-center font-Barlow font-medium">
          Are you sure you want to delete this item from your cart?
        </div>
        <div className="flex justify-end px-2 p-3">
          <button
            className="px-4 py-2 mr-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            onClick={handleConfirm}
          >
            Yes
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-150 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300"
            onClick={closeModal}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
