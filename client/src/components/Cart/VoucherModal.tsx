import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";

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
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "hidden",
};

const VoucherModal = ({ vouchers, open, setOpen }: VoucherModalProps) => {
  // const groupedVouchers: { [key: number]: Voucher[] } = {};

  const [groupedVouchers, setGroupedVouchers] = useState<{
    [key: number]: Voucher[];
  }>({});

  useEffect(() => {
    console.log("VoucherModal vouchers: ", vouchers);
    if (vouchers.vouchers.length > 0) {
      const tempGroupedVouchers: { [key: number]: Voucher[] } = {};
      vouchers.vouchers.forEach((voucher: Voucher) => {
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
            className="text-purpleAccent font-Barlow font-extrabold "
          >
            Voucher Wallet:
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            className="modalBoxValues"
          >
            hello
            {vouchers.vouchers.length > 0 ? (
              Object.keys(groupedVouchers).map((sellerId) => (
                <div key={sellerId} className="shadow-md rounded-lg p-2">
                  <Typography
                    variant="subtitle1"
                    component="h3"
                    className="text-purpleAccent font-Barlow font-bold border-b-2"
                  >
                    Seller ID: {sellerId}
                  </Typography>
                  {groupedVouchers[parseInt(sellerId)].map((voucher, index) => (
                    <div key={index} className="p-3">
                      <h1 className="font-bold">
                        {index + 1}. {voucher.voucher_name}
                      </h1>
                      <h2 className="text-md text-gray-500">
                        {voucher.voucher_category}
                      </h2>
                      {voucher.number_amount ? (
                        <h2 className="text-lg mb-3">
                          Get ${voucher.number_amount} off
                        </h2>
                      ) : (
                        <h2 className="text-lg mb-3">
                          Get{" "}
                          {voucher.percentage_amount &&
                            voucher.percentage_amount * 100}
                          % off
                        </h2>
                      )}
                      {/* <div className="font-semibold">
                        {voucher.percentage_amount && (
                          <div>
                            Get {voucher.number_amount * 100}% off your order!
                          </div>
                        )}
                        {voucher.number_amount && (
                          <div>
                            Earn {voucher.number_amount} more coins from your
                            order!
                          </div>
                        )}
                      </div> */}
                      <div className="">Min. spend of ${voucher.min_spend}</div>
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
    </>
  );
};

export default VoucherModal;
