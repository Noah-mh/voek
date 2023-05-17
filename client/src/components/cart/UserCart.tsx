import { useEffect, useState } from "react";
import useCustomer from "../../hooks/UseCustomer";
import noImage from "../../img/product/No_Image_Available.jpg";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import { ToggleSlider } from "react-toggle-slider";
// import ConfirmModal from "./ConfirmModal";

import "./UserCart.css";
import { Link } from "react-router-dom";

export default function cartPage(): JSX.Element {
  const { customer } = useCustomer();
  const customer_id = customer.customer_id;
  //const coins = customer.coins;

  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  interface userCart {
    customer_id: number;
    role: string;
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
  // const [toggle, setToggle] = useState<boolean>(false);

  // const useCoins = async () => {
  //   console.log(coins);
  //   if (coins <= 10) {
  //     setToggle(false);
  //   }
  // };

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
        setTotalAmt({
          subTotal: Math.round(Number(sum) * 100) / 100,
          shippingFee: Math.round((8.95 + sum * 0.1) * 100) / 100,

          total:
            Math.round(Number(sum) * 100) / 100 +
            Math.round((8.95 + sum * 0.1) * 100) / 100,
          coins: Math.ceil(
            (Math.round(Number(sum) * 100) / 100 +
              Math.round((8.95 + sum * 0.1) * 100) / 100) *
              0.1
          ),
        });
      })
      .then(() => {})
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
      if (cartItem.product_id === item.product_id) {
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
                // disabled={item.quantity >= item.stock}
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
          {/* <ToggleSlider
            barHeight={18}
            draggable={false}
            active={toggle}
            onToggle={useCoins}
          /> */}
          <button className="bg-white text-softerPurple text-sm font-bold px-4 py-2 rounded-lg mt-4 w-full">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
