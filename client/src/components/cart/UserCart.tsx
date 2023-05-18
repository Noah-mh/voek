import { useEffect, useState } from "react";
import useCustomer from "../../hooks/UseCustomer";
import noImage from "../../img/product/No_Image_Available.jpg";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
// import ConfirmModal from "./ConfirmModal";
import "flowbite";

import "./UserCart.css";
import { Link } from "react-router-dom";
import PayPal from "../PayPal/PayPal";

export default function cartPage(): JSX.Element {
  const { customer } = useCustomer();
  const customer_id = customer.customer_id;

  const axiosPrivateCustomer = useAxiosPrivateCustomer();

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
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [checkCoinsRedeem, setCheckCoinsRedeem] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [userCart, setUserCart] = useState<cartItem[]>([]);
  const [prodQuantity, setProdQuantity] = useState<number>(0);
  const [changedSKU, setChangedSKU] = useState<string>("");
  const [changedQuantState, setChangedQuantState] = useState<boolean>(false);
  const [totalAmt, setTotalAmt] = useState<totalCart>({
    subTotal: 0,
    shippingFee: 0,
    coins: 0,
    total: 0,
  });

  const getCoins = async () => {
    axiosPrivateCustomer
      .get("/getUserCoins/" + customer_id, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        setUserCoins(response.data.result);
        if (response.data.result < 10) {
          setIsInputDisabled(true);
        }
      })
      .catch((err) => {
        console.log(err);

        if (!err?.response) {
          setErrMsg("No Server Response");
          console.log("no resp");
        } else {
          setErrMsg("Server Error");
          console.log("server error");
        }
      });
    return 0;
  };
  const getUserCart = async () => {
    return axiosPrivateCustomer
      .post("/getCart", JSON.stringify({ customer_id }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        setUserCart(response.data);
        const sum = response.data
          .reduce((acc: number, item: cartItem) => {
            return acc + item.price * item.quantity;
          }, 0)
          .toFixed(2);
        console.log(sum);
        setTotalAmt({
          subTotal: Number(sum),
          shippingFee: Number(
            (Math.round((8.95 + sum * 0.1) * 100) / 100).toFixed(2)
          ),

          total: Number(
            (
              Math.round(Number(sum) * 100) / 100 +
              Math.round((8.95 + sum * 0.1) * 100) / 100
            ).toFixed(2)
          ),
          coins: Number(Math.ceil(sum * 0.1)),
        });
      })
      .catch((err) => {
        if (!err?.response) {
          setErrMsg("No Server Response");
          console.log("no resp");
        } else {
          setErrMsg("Server Error");
          console.log("server error");
        }
      });
  };
  const handleQuantityChange = (item: cartItem, change: number) => {
    const updatedCart = userCart.map((cartItem) => {
      if (cartItem.sku === item.sku) {
        const newItem: cartItem = {
          ...cartItem,
          quantity: cartItem.quantity + change,
        };
        setChangedSKU(newItem.sku);
        setChangedQuantState(true);
        setProdQuantity(newItem.quantity);

        return newItem;
      }
      return cartItem;
    });
    setUserCart(updatedCart);
  };

  // page onload
  useEffect(() => {
    getUserCart();
    getCoins();
  }, []);

  //when cartQuant state changes
  useEffect(() => {
    if (changedQuantState === false) return;

    axiosPrivateCustomer
      .post(
        "/alterQuantCart",
        JSON.stringify({
          customer_id,
          sku: changedSKU,
          quantity: prodQuantity,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
        if (!err?.response) {
          setErrMsg("No Server Response");
          console.log("no resp");
        } else {
          setErrMsg("Server Error");
          console.log("server error");
        }
      })
      .finally(() => {
        setChangedQuantState(false);
        getUserCart();
      });
  }, [changedQuantState]);

  useEffect(() => {
    const discAmt = Math.floor(totalAmt.coins / 10);
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
        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-2 sm:col-span-1"></div>
          <div className="col-span-2 sm:col-span-1">Name</div>
          <div className="col-span-2 sm:col-span-1">Variations</div>
          <div className="col-span-2 sm:col-span-1">Price</div>
          <div className="col-span-3 sm:col-span-1">Quantity</div>
        </div>

        {userCart.map((item: cartItem) => (
          <Link
            to={"/productDetailsWithReviews/" + item.product_id}
            className="grid grid-cols-5 gap-4 py-4 prodCont"
            key={item.sku}
          >
            <div className="col-span-2 sm:col-span-1">
              <img src={noImage} className="productImage" />
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
                onClick={() => setCheckCoinsRedeem(true)}
                onChange={() => {
                  isChecked ? setIsChecked(false) : setIsChecked(true);
                }}
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <PayPal amount={totalAmt.total} />
        </div>
      </div>
    </div>
  );
}
