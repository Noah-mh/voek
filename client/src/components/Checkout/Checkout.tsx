import { useEffect, useState } from "react";
import useCustomer from "../../hooks/UseCustomer";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";

export default function CheckOutPage(): JSX.Element {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { customer, setCustomer } = useCustomer();
  const axiosPrivateCustomer = useAxiosPrivateCustomer();
  const customer_id = customer.customer_id;
  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(customer.cart).length === 0) {
      //cart is empty, redirect to homepage
      navigate("/");
    } else {
      const coinsRedeemed = customer.cart.coinsRedeemed;
      const coinsEarned = customer.cart.totalAmt.coins;
      const address_id = customer.cart.addressSelected.address_id;
      const claimedVouchers = customer.cart.claimedVouchers;
      const insertOrder = async () => {
        try {
          const resPaymentId = await axiosPrivateCustomer.post(
            `/customer/order/insertPayment`,
            {
              customer_id: customer_id,
              amount: customer.cart.totalAmt.total,
            }
          );
          const resOrderId = await axiosPrivateCustomer.post(
            `/customer/order/insertOrder`,
            {
              customer_id: customer_id,
              payment_id: resPaymentId.data,
              discount_applied: 0,
              coins_redeemed: coinsRedeemed,
              address_id: address_id,
            }
          );

          await Promise.all(
            customer.cart.cartItems.map(async (item: any) => {
              const resOrderProductIDs = await axiosPrivateCustomer.post(
                `/customer/order/insertOrderProduct`,
                {
                  orders_id: resOrderId.data,
                  product_id: item.product_id,
                  sku: item.sku,
                  totalPrice: (item.quantity * item.price).toFixed(2),
                  quantity: item.quantity,
                }
              );

              return resOrderProductIDs.data;
            })
          );
          await Promise.all(
            Object.keys(claimedVouchers).map(async (sellerId: any) => {
              Object.keys(claimedVouchers[sellerId]).map(
                async (customer_voucher_id: any) => {
                  const claimedVoucherID = await axiosPrivateCustomer.put(
                    `/customer/order/redeemVoucher`,
                    {
                      order_id: resOrderId.data,
                      customer_voucher_id: customer_voucher_id,
                    }
                  );
                  return claimedVoucherID;
                }
              );
            })
          );

          await Promise.all(
            customer.cart.cartItems.map(async (item: any) => {
              const resUpdateStock = await axiosPrivateCustomer.put(
                `/customer/order/updateProductStock`,
                {
                  quantityDeduct: item.quantity,
                  sku: item.sku,
                }
              );

              return resUpdateStock.data;
            })
          );

          await axiosPrivateCustomer.put(
            `/customer/order/updateCustomerCoins`,
            {
              customer_id: customer_id,
              coins: coinsRedeemed == 0 ? coinsEarned : -coinsRedeemed,
            }
          );
          setPaymentSuccess(true);
        } catch (err) {
          console.log(err);
          setPaymentSuccess(false);
        }
      };

      insertOrder();
    }
  }, []);

  useEffect(() => {
    if (paymentSuccess) {
      setCustomer((prevState: any) => {
        return {
          ...prevState,
          cart: {},
        };
      });
      axiosPrivateCustomer.put(`/customer/order/clearCart`, {
        customer_id: customer_id,
      });
    }
  }, [paymentSuccess]);

  return (
    <div>
      {paymentSuccess && (
        <div className="bg-gray-100 h-screen">
          <div className="bg-white p-6  md:mx-auto">
            <svg
              viewBox="0 0 24 24"
              className="text-green-600 w-16 h-16 mx-auto my-6"
            >
              <path
                fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
              ></path>
            </svg>
            <div className="text-center">
              <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                Payment Done!
              </h3>
              <p className="text-gray-600 my-2">
                Thank you for completing your secure online payment.
              </p>
              <p> Have a great day! </p>
              <div className="py-10 text-center">
                <Link
                  to="/customer/cart"
                  className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
                >
                  GO BACK
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {!paymentSuccess && (
        <div className="bg-gray-100 h-screen">
          <div className="bg-white p-6  md:mx-auto">
            <svg
              viewBox="0 0 550 500"
              className="text-red-600 w-16 h-16 mx-auto my-6"
            >
              <path
                fill="currentColor"
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
              />
            </svg>
            <div className="text-center">
              <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                Payment Failed.
              </h3>
              <p className="text-gray-600 my-2">
                Something went wrong with the payment.
              </p>
              <p> Please try again.</p>
              <div className="py-10 text-center">
                <Link
                  to="/customer/cart"
                  className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
                >
                  GO BACK
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
