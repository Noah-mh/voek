import * as React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-10 ${
        isOpen ? "visible" : "hidden"
      }`}
      onClick={handleClickOutside}
    >
      <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Modal Content</h2>
        <p className="mb-4">This is the modal content.</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
