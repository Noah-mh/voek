import { useEffect, useState } from "react";
import useCustomer from "../../hooks/UseCustomer";
import noImage from "../../img/product/No_Image_Available.jpg";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import "./UserCart.css";

export default function cartPage(): JSX.Element {
  const { customer } = useCustomer();
  const customer_id = customer.customer_id;

  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  interface userCart {
    customer_id: number;
    role: string;
    cartItems: Array<cartItem>;
  }
  interface cartItem {
    product_id: number;
    name: string;
    quantity: number;
    price: string;
    image_url: string;
    variation_1: string;
    variation_2: string;
    stock: number;
  }
  const [errMsg, setErrMsg] = useState<string>("");
  const [userCart, setUserCart] = useState<cartItem[]>([]);
  const [prodQuantity, setProdQuantity] = useState<number>(0);

  useEffect(() => {
    const getUserCart = async () => {
      return axiosPrivateCustomer
        .post("/getCart", JSON.stringify({ customer_id }), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
          setUserCart(response.data);
          console.log(userCart);
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
    getUserCart();
  }, []);
  const handleQuantityChange = (item: cartItem, newQuantity: number) => {
    const updatedCart = userCart.map((cartItem) => {
      if (cartItem.product_id === item.product_id) {
        return {
          ...cartItem,
          quantity: Math.max(0, Math.min(newQuantity, cartItem.stock)),
        };
      }
      return cartItem;
    });

    setUserCart(updatedCart);
  };
  useEffect(() => {
    axiosPrivateCustomer
      .post("/alterCart", JSON.stringify({ customer_id }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        setUserCart(response.data);
        console.log(userCart);
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
  }, [userCart]);

  return (
    <div className="container flex">
      <div className="w-2/3 bg-white rounded-lg shadow-lg p-2">
        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-2 sm:col-span-1"></div>
          <div className="col-span-2 sm:col-span-1">Name</div>
          <div className="col-span-2 sm:col-span-1">Price</div>
          <div className="col-span-2 sm:col-span-1">Variations</div>
          <div className="col-span-4 sm:col-span-1">Quantity</div>
        </div>

        {userCart.map((item: cartItem) => (

          <div className="grid grid-cols-6 gap-4 py-4" key={item.product_id}>
            <div className="col-span-2 sm:col-span-1">
              <img src={noImage} className="productImage" />
            </div>
            <div className="col-span-2 sm:col-span-1">{item.name}</div>
            <div className="col-span-2 sm:col-span-1">${item.price}</div>
            <div className="col-span-2 sm:flex-row sm:col-span-1">
              <div className="mr-4">
                {item.variation_1 ? item.variation_1 : "-"}
              </div>
              <div>{item.variation_2 ? item.variation_2 : null}</div>
            </div>
            <div className="col-span-4 sm:col-span-1">
              <button
                className="text-sm border px-2 py-1 mx-2"
                onClick={() => handleQuantityChange(item, - 1)}
                disabled={item.quantity <= 0}
              >
                -
              </button>
              {item.quantity}
              <button
                className="text-sm border  px-2 py-1 mx-2"
                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
              >
                {" "}
                +{" "}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="right w-1/3 bg-softerPurple"></div>
    </div>
  );
}

// const smsSentHandler = async (e: React.MouseEvent<HTMLAnchorElement>) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/customer/auth/SMS/OTP",
//         JSON.stringify({ phoneNumber: phone_number, customer_id }),
//         {
//           headers: { 'Content-Type': 'application/json' },
//           withCredentials: true
//         })
//       setModalEmail(false);
//       setModalSMS(true);
//     } catch (err: any) {
//       if (!err?.response) {
//         setErrMsg('No Server Response');
//       } else {
//         setErrMsg("Server Error");
//       }
//     }
//   }
