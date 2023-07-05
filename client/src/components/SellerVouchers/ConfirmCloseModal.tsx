import { Dialog, DialogActions, DialogTitle } from "@mui/material";

interface confirmCloseModalProps {
  confirmCloseModal: boolean;
  handleCancel: any;
  handleConfirm: any;
}

interface buttonProps {
  children: string;
  onClick: () => void;
}

const Button = ({ children, onClick }: buttonProps) => {
  const buttonClass =
    children === "Cancel"
      ? "text-purpleAccent mx-2 text-lg hover:bg-softerPurple hover:bg-opacity-5"
      : "text-greyAccent mx-2 text-lg hover:bg-softerPurple hover:bg-opacity-5";

  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};

const ConfirmCloseModal = ({
  confirmCloseModal,
  handleCancel,
  handleConfirm,
}: confirmCloseModalProps) => {
  return (
    <Dialog open={confirmCloseModal} onClose={handleCancel}>
      <DialogTitle className="flex flex-col justify-center items-center">
        <h1>You have unsaved changes.</h1>
        <h1>Are you sure you want to close the modal?</h1>
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleConfirm}>Confirm</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmCloseModal;
