import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { get } from "http";

interface Voucher {
  seller_id: number;
  voucher_id: string;
  voucher_name: string;
  number_amount: number;
  percentage_amount: number;
  voucher_category: string;
  min_spend: number;
  customer_voucher_id: number;
  active: boolean;
}

interface VoucherModalProps {
  vouchers: any;
  open: boolean;
  setOpen: (bool: boolean) => void;
  totalAmt: {
    subTotal: number;
    shippingFee: number;
    coins: number;
    total: number;
  };
  claimedVouchers: { [key: string]: { [key: number]: boolean } }; // Updated type definition
  setClaimedVouchers: (claimedVouchers: {
    [key: string]: { [key: number]: boolean };
  }) => void; // Updated type definition
  groupItems: any;
  getUserCart: () => void;
}

const VoucherModal = ({
  vouchers,
  open,
  setOpen,
  totalAmt,
  claimedVouchers,
  setClaimedVouchers,
  groupItems,
  getUserCart,
}: VoucherModalProps) => {
  const [groupedVouchers, setGroupedVouchers] = useState<{
    [key: number]: Voucher[];
  }>({});

  useEffect(() => {
    //if have time, get seller username and display it instead of the id
    console.log("VoucherModal vouchers: ", vouchers);
    if (vouchers.length > 0) {
      const tempGroupedVouchers: { [key: number]: Voucher[] } = {};
      vouchers.forEach((voucher: Voucher) => {
        const seller_id = voucher.seller_id;
        if (!tempGroupedVouchers[seller_id]) {
          tempGroupedVouchers[seller_id] = [];
        }
        tempGroupedVouchers[seller_id].push(voucher);
      });
      setGroupedVouchers(tempGroupedVouchers);
    }
    console.log(groupedVouchers);
  }, [vouchers]);

  const voucherClaimed = (voucher: Voucher, sellerId: number) => () => {
    console.log("voucher claimed: ", voucher);
    if (
      claimedVouchers[sellerId] &&
      claimedVouchers[sellerId]?.[voucher.customer_voucher_id]
    ) {
      const {
        [voucher.customer_voucher_id]: removedVoucher,
        ...updatedVouchers
      } = claimedVouchers[sellerId];

      setClaimedVouchers({
        ...claimedVouchers,
        [sellerId]: updatedVouchers,
      });

      if (Object.keys(updatedVouchers).length === 0) {
        // If there are no more vouchers claimed for this seller, remove the seller from claimedVouchers
        const { [sellerId]: _, ...updatedClaimedVouchers } = claimedVouchers;
        setClaimedVouchers(updatedClaimedVouchers);
        toast.warn("Voucher has been unclaimed.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        getUserCart();
        return;
      }
    } else {
      // Voucher is being claimed, mark it as claimed in claimedVouchers
      setClaimedVouchers({
        ...claimedVouchers,
        [sellerId]: {
          ...(claimedVouchers[sellerId] || {}),
          [voucher.customer_voucher_id]: true,
        },
      });
      toast.success("Voucher claimed!", {
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
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modalBox">
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-purpleAccent font-Barlow font-extrabold  "
          >
            Voucher Wallet:
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            className="modalBoxValues"
          >
            {vouchers.length > 0 ? (
              Object.keys(groupedVouchers).map((sellerId) => (
                <div key={sellerId} className=" border-2 rounded-lg p-2 mb-4">
                  <Typography
                    variant="subtitle1"
                    component="h3"
                    className="text-purpleAccent font-Barlow font-bold border-b-2"
                  >
                    Seller ID: {sellerId}
                  </Typography>
                  {groupedVouchers[parseInt(sellerId)].map((voucher, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-4 border-b-2 pb-2 p-3"
                    >
                      <div className="col-span-2">
                        <h1 className="font-bold">
                          {index + 1}. {voucher.voucher_name}
                        </h1>
                        <h2 className="text-sm text-gray-500">
                          {voucher.voucher_category}
                        </h2>
                        {voucher.voucher_category === "Coins" ? (
                          <h2 className="text-lg mb">
                            Get {voucher.number_amount} coins after your
                            purchase!
                          </h2>
                        ) : voucher.voucher_category === "Price" ? (
                          voucher.number_amount ? (
                            <h2 className="text-lg mb">
                              Get ${voucher.number_amount} off
                            </h2>
                          ) : (
                            <h2 className="text-lg mb">
                              Get {voucher.percentage_amount * 100} off
                            </h2>
                          )
                        ) : (
                          <h2 className="text-lg mb">
                            Get{" "}
                            {voucher.percentage_amount &&
                              voucher.percentage_amount * 100}
                            % off
                          </h2>
                        )}

                        <div className="font-sans text-black">
                          Min. spend of ${voucher.min_spend}
                        </div>
                      </div>
                      {voucher.min_spend > totalAmt.subTotal ||
                      !groupItems.hasOwnProperty(voucher.seller_id) ? (
                        <button className="opacity-40" disabled>
                          <span className="bg-purpleAccent  p-2 px-4 font-Barlow font-semibold uppercase text-white rounded-sm text-xs">
                            Claim
                          </span>
                        </button>
                      ) : (
                        <button
                          className={
                            claimedVouchers[voucher.seller_id]?.[
                              voucher.customer_voucher_id
                            ]
                              ? "opacity-40"
                              : ""
                          }
                          onClick={voucherClaimed(voucher, parseInt(sellerId))}
                        >
                          <span className="bg-purpleAccent  p-2 px-4 font-Barlow font-semibold uppercase text-white rounded-sm text-xs">
                            {claimedVouchers[voucher.seller_id]?.[
                              voucher.customer_voucher_id
                            ]
                              ? "Claimed"
                              : "Claim"}
                          </span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <span>You have no vouchers redeemed at the moment</span>
            )}
          </Typography>
        </Box>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default VoucherModal;
