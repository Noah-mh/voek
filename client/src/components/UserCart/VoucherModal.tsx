import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

interface Voucher {
  seller_id: number;
  shop_name: string;
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
  setWasAVVoucherClaimed: (bool: boolean) => void;
  setLastClaimedVoucher: (voucher: Voucher) => void;
  groupItemsPrice: any;
}

const VoucherModal = ({
  vouchers,
  open,
  setOpen,
  totalAmt,
  claimedVouchers,
  setClaimedVouchers,
  groupItems,
  setWasAVVoucherClaimed,
  setLastClaimedVoucher,
  groupItemsPrice,
}: // getUserCart,
VoucherModalProps) => {
  const [groupedVouchers, setGroupedVouchers] = useState<{
    [key: string]: Voucher[];
  }>({});

  useEffect(() => {
    //if have time, get seller username and display it instead of the id
    console.log("VoucherModal vouchers: ", vouchers);
    if (vouchers.length > 0) {
      const tempGroupedVouchers: { [key: string]: Voucher[] } = {};
      vouchers.forEach((voucher: Voucher) => {
        const seller_id = voucher.seller_id;
        const key = `${voucher.seller_id}_${voucher.shop_name}`;
        if (!tempGroupedVouchers[key]) {
          tempGroupedVouchers[key] = [];
        }
        tempGroupedVouchers[key].push(voucher);
      });
      setGroupedVouchers(tempGroupedVouchers);
    }
    console.log(groupedVouchers);
  }, [vouchers]);

  const voucherClaimed = (voucher: Voucher, sellerKey: string) => () => {
    console.log("voucher claimed: ", voucher);
    const key = `${voucher.seller_id}_${voucher.shop_name}`;
    setLastClaimedVoucher(voucher);
    setWasAVVoucherClaimed(false);
    if (
      claimedVouchers[key] &&
      claimedVouchers[key]?.[voucher.customer_voucher_id]
    ) {
      const {
        [voucher.customer_voucher_id]: removedVoucher,
        ...updatedVouchers
      } = claimedVouchers[key];

      setClaimedVouchers({
        ...claimedVouchers,
        [key]: updatedVouchers,
      });

      if (Object.keys(updatedVouchers).length === 0) {
        // If there are no more vouchers claimed for this seller, remove the seller from claimedVouchers
        const { [key]: _, ...updatedClaimedVouchers } = claimedVouchers;
        setClaimedVouchers(updatedClaimedVouchers);
        toast.warn("Voucher has been unclaimed.", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // getUserCart();
        return;
      }
    } else {
      // Voucher is being claimed, mark it as claimed in claimedVouchers
      setClaimedVouchers({
        ...claimedVouchers,
        [key]: {
          ...(claimedVouchers[key] || {}),
          [voucher.customer_voucher_id]: true,
        },
      });
      setWasAVVoucherClaimed(true);
      toast.success("Voucher claimed!", {
        position: "top-left",
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

  const showVoucherError = (message: string) => {
    toast.warn(message, {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
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
              Object.keys(groupedVouchers).map((sellerKey) => (
                <div key={sellerKey} className=" border-2 rounded-lg p-2 mb-4">
                  <div className="storeName flex-row flex ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                      />
                    </svg>

                    <h1 className="text-l font-bold text-purpleAccent ml-2">
                      {getUsernameFromSellerKey(sellerKey)}
                    </h1>
                  </div>
                  {groupedVouchers[sellerKey].map((voucher, index) => (
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
                              Get {voucher.percentage_amount * 100}% off
                            </h2>
                          )
                        ) : voucher.number_amount ? (
                          <h2 className="text-lg mb">
                            Get ${voucher.number_amount} off
                          </h2>
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
                      !groupItems.hasOwnProperty(sellerKey) ||
                      (voucher.number_amount > groupItemsPrice[sellerKey] &&
                        !claimedVouchers[sellerKey]?.[
                          voucher.customer_voucher_id
                        ]) ? (
                        <div
                          className="flex flex-col justify-center font-bold"
                          onClick={() => {
                            let errorMessage;

                            if (voucher.min_spend > totalAmt.subTotal) {
                              errorMessage = "You did not hit the min. spend.";
                            } else if (
                              voucher.number_amount > groupItemsPrice[sellerKey]
                            ) {
                              errorMessage =
                                "Total is too low for discount to be applied.";
                            } else {
                              errorMessage =
                                "The store is not available in your cart.";
                            }

                            showVoucherError(errorMessage);
                          }}
                        >
                          <button className="opacity-40" disabled>
                            <span className="bg-purpleAccent  p-2 px-4 font-Barlow font-semibold uppercase text-white rounded-sm text-xs">
                              Claim
                            </span>
                          </button>
                        </div>
                      ) : (
                        <button
                          className={
                            claimedVouchers[sellerKey]?.[
                              voucher.customer_voucher_id
                            ]
                              ? "opacity-40"
                              : ""
                          }
                          onClick={voucherClaimed(voucher, sellerKey)}
                        >
                          <span className="bg-purpleAccent  p-2 px-4 font-Barlow font-semibold uppercase text-white rounded-sm text-xs">
                            {claimedVouchers[sellerKey]?.[
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
const getUsernameFromSellerKey = (sellerKey: string): string => {
  const separatorIndex = sellerKey.indexOf("_");
  if (separatorIndex !== -1) {
    return sellerKey.substring(separatorIndex + 1);
  }
  return "";
};

const getIdFromSellerKey = (sellerKey: string): string => {
  const separatorIndex = sellerKey.indexOf("_");
  if (separatorIndex !== -1) {
    return sellerKey.substring(0, separatorIndex);
  }
  return "";
};

export default VoucherModal;
