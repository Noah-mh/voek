import React from "react";

import "./css/HowToPlay.css";

interface HowToPlayModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const HowToPlayModal = ({ open, setOpen }: HowToPlayModalProps) => (
  <div className="modal-backgroundGame flex items-center justify-center">
    <div className="modal-contentGame p-6 bg-white rounded shadow-xl w-3/4 md:w-1/2">
      <h1 className="text-2xl font-bold font-Barlow mb-4">How To Play</h1>
      <p>
        Click on the circle as fast as you can. Keep your progress bar from
        depleting!
      </p>
      <br />
      <p className="text-softerPurple font-bold font-Barlow">
        Score: 1 Coin Per Point
      </p>
      <button
        className="mt-4 bg-red-500 text-white rounded p-2"
        onClick={() => setOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
);

export default HowToPlayModal;
