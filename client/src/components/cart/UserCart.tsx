import { useEffect, useState } from "react";
import useCustomer from "../../hooks/UseCustomer";
import noImage from "../../img/product/No_Image_Available.jpg";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
// import ConfirmModal from "./ConfirmModal";
import "./UserCart.css";
import { Link, useNavigate } from "react-router-dom";
import PayPal from "../PayPal/PayPal";
import Select from "react-select";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../../Cloudinary/Cloudinary";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function cartPage(): JSX.Element {
  const { customer, setCustomer } = useCustomer();
  const customer_id = customer.customer_id;
  const navigate = useNavigate();

  const axiosPrivateCustomer = useAxiosPrivateCustomer();
  // setCustomer((prevState: any) => { return { ...prevState, checkOut: []}})

  interface userCart {
    customer_id: number;
    role: string;
    coins: number;
    cartItems: Array<cartItem>;
  }
  interface cartItem {
    sku: string;
    product_id: number;
    name: string;
    quantity: number;
    price: number;
    image_url: string;
    variation_1: string;
    variation_2: string;
    stock: number;
  }
  interface totalCart {
    subTotal: number;
    shippingFee: number;
    coins: number;
    total: number;
  }
  interface userAddress {
    address_id: string;
    postal_code: string;
    block: string;
    street_name: string;
    country: string;
    unit_no: string;
  }
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [userAddresses, setUserAddresses] = useState<userAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<userAddress>();
  const [errMsg, setErrMsg] = useState<string>("");
  const [userCart, setUserCart] = useState<cartItem[]>([]);
  const [prodQuantity, setProdQuantity] = useState<number>(0);
  const [changedSKU, setChangedSKU] = useState<string>("");
  const [paypalCN, setPaypalCN] = useState<string>(
    "pointer-events-none opacity-50"
  );
  const [changedQuantState, setChangedQuantState] = useState<boolean>(false);
  const [cartisEmpty, setCartisEmpty] = useState<boolean>(false);

  const [totalAmt, setTotalAmt] = useState<totalCart>({
    subTotal: 0,
    shippingFee: 0,
    coins: 0,
    total: 0,
  });
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      checkOut();
    }
  }, [success]);

  const getCoins = async () => {
    try {
      return await axiosPrivateCustomer.get(
        `/customer/getUserCoins/${customer_id}`
      );
    } catch (err: any) {
      console.log(err);
    }
  };
  const getUserCart = async () => {
    try {
      return await axiosPrivateCustomer
        .get(`/customer/getCart/${customer_id}`)
        .then((res) => {
          const sum = res.data
            .reduce((acc: number, item: cartItem) => {
              return acc + item.price * item.quantity;
            }, 0)

            .toFixed(2);
          if (res.data.length === 0) {
            setCartisEmpty(true);
            setIsInputDisabled(true);
          }
          setTotalAmt({
            subTotal: Number(sum),
            shippingFee:
              sum == 0
                ? 0
                : Number(
                    (Math.round((8.95 + sum * 0.1) * 100) / 100).toFixed(2)
                  ),

            total:
              sum == 0
                ? 0
                : Number(
                    (
                      Math.round(Number(sum) * 100) / 100 +
                      Math.round((8.95 + sum * 0.1) * 100) / 100
                    ).toFixed(2)
                  ),
            coins: Number(Math.ceil(sum * 0.1)),
          });

          setUserCart(res.data);
        });
    } catch (err: any) {
      console.log(err);
    }
  };
  const getAddress = async () => {
    try {
      return await axiosPrivateCustomer.get(
        `/customer/getUserAddress/${customer_id}`
      );
    } catch (err: any) {
      console.log(err);
    }
  };
  const handleQuantityChange = (item: cartItem, change: number) => {
    const updatedCart = userCart.map((cartItem) => {
      if (cartItem.sku === item.sku) {
        const newItem: cartItem = {
          ...cartItem,
          quantity: cartItem.quantity + change,
        };
        setChangedSKU(newItem.sku);
        setProdQuantity(newItem.quantity);
        setChangedQuantState(true);
        return newItem;
      }
      return cartItem;
    });
    setUserCart(updatedCart);
  };

  const getAll = async () => {
    try {
      const result: any = await Promise.all([
        getCoins(),
        getUserCart(),
        getAddress(),
      ]);
      if (result[0].data.result < 10) {
        setIsInputDisabled(true);
      }

      setUserCoins(result[0].data.result);
      setUserAddresses(result[2].data);
    } catch (err: any) {
      console.log(err);
    }
  };

  const checkOut = async () => {
    if (isChecked) {
      setCustomer((prevState: any) => {
        return {
          ...prevState,
          cart: {
            totalAmt: totalAmt, //subtotal , total, coins, shipping
            cartItems: userCart, // sku, product_id, name, quantity, price, image_url, variation_1, variation_2, stock
            coinsRedeemed: userCoins, //coins existing in user
            addressSelected: selectedAddress,
          },
        };
      });
    } else {
      setCustomer((prevState: any) => {
        return {
          ...prevState,
          cart: {
            totalAmt: totalAmt,
            cartItems: userCart,
            coinsRedeemed: 0,
            addressSelected: selectedAddress,
          },
        };
      });
    }
    navigate("/customer/checkout");
  };

  // page onload
  useEffect(() => {
    getAll();
  }, []);

  //when cartQuant state changes
  useEffect(() => {
    if (changedQuantState == false) return;
    if (prodQuantity <= 0) {
      toast.success("Item removed from cart. 🤡", {
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
    const alterQuantFnc = async () => {
      try {
        const result = await axiosPrivateCustomer.post(
          "/customer/alterQuantCart",
          {
            customer_id,
            sku: changedSKU,
            quantity: prodQuantity,
          }
        );

        setChangedQuantState(false);
        getUserCart();
      } catch (err: any) {
        console.log(err);
      }
    };
    alterQuantFnc();
  }, [changedQuantState]);

  //when redeemcoins is checked
  useEffect(() => {
    const discAmt = Math.floor(userCoins / 10);
    if (isChecked) {
      setTotalAmt({
        ...totalAmt,
        total: Number((totalAmt.total - discAmt).toFixed(2)),
      });
    } else {
      setTotalAmt({
        ...totalAmt,
        total: Number((totalAmt.total + discAmt).toFixed(2)),
      });
    }
  }, [isChecked]);

  return (
    <div className="container flex">
      <div className="w-2/3 bg-white rounded-lg shadow-lg p-2">
        {!cartisEmpty && (
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-2 sm:col-span-1"></div>
            <div className="col-span-2 sm:col-span-1 font-semibold">Name</div>
            <div className="col-span-2 sm:col-span-1 font-semibold">
              Variations
            </div>
            <div className="col-span-2 sm:col-span-1 font-semibold">Price</div>
            <div className="col-span-3 sm:col-span-1 font-semibold">
              Quantity
            </div>
          </div>
        )}
        {cartisEmpty && (
          <div className="font-bold text-xl text-gray-300 flex justify-center h-full items-center">
            No cart items to retrieve.
          </div>
        )}

        {userCart.map((item: cartItem) => (
          <Link
            to={"/productDetailsWithReviews/" + item.product_id}
            className="grid grid-cols-5 gap-4 py-4 prodCont"
            key={item.sku}
          >
            <div className="col-span-2 sm:col-span-1">
              {item.image_url == null ? (
                <img src={noImage} alt="product Image" />
              ) : (
                <AdvancedImage
                  cldImg={cld.image(item.image_url)}
                  alt="product image"
                  draggable={false}
                  className="rounded-xl object-cover cartImg"
                />
              )}
            </div>
            <div className="col-span-2 sm:col-span-1">{item.name}</div>
            <div className="col-span-2 sm:flex-row sm:col-span-1">
              <div className="mr-4">
                {item.variation_1 ? item.variation_1 : "-"}
              </div>
              <div>{item.variation_2 ? item.variation_2 : "-"}</div>
            </div>
            <div className="col-span-2 sm:col-span-1">${item.price}</div>
            <div className="col-span-3 sm:col-span-1">
              <button
                className="text-sm border px-2 py-1 mx-2"
                onClick={(event) => {
                  setErrMsg("");
                  event.preventDefault();
                  handleQuantityChange(item, -1);
                }}
                disabled={item.quantity <= 0}
              >
                -
              </button>
              {item.quantity}
              <button
                className="text-sm border  px-2 py-1 mx-2"
                onClick={(event) => {
                  setErrMsg("");
                  event.preventDefault();
                  if (item.quantity >= item.stock) {
                    setErrMsg("Max stock reached");
                  } else {
                    handleQuantityChange(item, 1);
                  }
                }}
              >
                +
              </button>
              {errMsg.length != 0 && (
                <div className="errorMessage text-red-600 text-sm">
                  {errMsg}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="right w-1/3 p-5 bg-softerPurple">
        <div className="text-xl font-bold text-white mb-7">Order Summary</div>

        <div className=" text-sm summary">
          <div className="subTotal flex justify-between">
            <div className=" text-white">Subtotal</div>
            <div className="text-white">${totalAmt.subTotal}</div>
          </div>
          <div className="total flex justify-between">
            <div className=" text-white">Shipping</div>
            <div className="text-white">${totalAmt.shippingFee}</div>
          </div>
          <div className="points flex justify-between">
            <div className=" text-white">Coins To Earn</div>
            <div className="text-white">{totalAmt.coins}</div>
          </div>
          <div className="total flex text-base font-bold justify-between mb-5">
            <div className=" text-white">Total</div>
            <div className="text-white">${totalAmt.total}</div>
          </div>
          <div className="activateCoins flex justify-between border-t-2 pt-3">
            <div className="showCoins text-xs text-white">
              Coins Available: <span className="font-bold">{userCoins}</span>
            </div>
            <label className="relative inline-flex items-center mb-5 cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                disabled={isInputDisabled}
                onChange={() => {
                  isChecked ? setIsChecked(false) : setIsChecked(true);
                }}
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex-col justify-center">
            <div className={paypalCN}>
              <PayPal amount={totalAmt.total} setSuccess={setSuccess} />
            </div>
            {userAddresses.length != 0 && (
              <Select
                value={
                  selectedAddress
                    ? {
                        value: selectedAddress,
                        label: `${selectedAddress.street_name}, ${selectedAddress.block}, ${selectedAddress.postal_code}`,
                        address: selectedAddress,
                      }
                    : null
                }
                onChange={(option) => {
                  setSelectedAddress(option?.value || userAddresses[0]);
                  if (totalAmt.total != 0) {
                    setPaypalCN("opacity-100 cursor-pointer");
                  }
                }}
                options={userAddresses.map((address) => ({
                  value: address,
                  label: `${address.street_name}, ${address.block}, ${address.postal_code}`,
                  address: address,
                }))}
              />
            )}

            {/* <button className=" w-full bg-white hover:bg-transparent hover:border-2 hover:border-white text-softerPurple hover:text-white font-bold py-2 px-4 rounded ">
              Checkout
            </button> */}
          </div>
        </div>
      </div>
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
    </div>
  );
}
