import React, { useEffect, useState } from "react";
import useCustomer from "../../hooks/UseCustomer";
import noImage from "../../img/product/No_Image_Available.jpg";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import "./UserCart.css";
import { Link, useNavigate } from "react-router-dom";
import PayPal from "../PayPal/PayPal";
import Select from "react-select";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../../Cloudinary/Cloudinary";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VoucherModal from "./VoucherModal";

import Button from "@mui/material/Button";

export default function cartPage(): JSX.Element {
  const { customer, setCustomer } = useCustomer();
  const customer_id = customer.customer_id;
  const navigate = useNavigate();

  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  interface userCart {
    customer_id: number;
    role: string;
    coins: number;
    cartItems: Array<cartItem>;
  }
  interface cartItem {
    seller_id: number;
    sku: string;
    product_id: number;
    name: string;
    quantity: number;
    price: number;
    image_url: string;
    variation_1: string;
    variation_2: string;
    stock: number;
    shop_name: String;
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
  interface voucher {
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

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [userAddresses, setUserAddresses] = useState<userAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<userAddress>();
  const [customerVouchers, setCustomerVouchers] = useState<voucher[]>([]);
  const [groupItems, setGroupItems] = useState<{ [key: string]: cartItem[] }>(
    {}
  );
  const [wasAVVoucherClaimed, setWasAVVoucherClaimed] =
    useState<boolean>(false);
  const [lastClaimedVoucher, setLastClaimedVoucher] = useState<voucher>();
  const [groupItemsPrice, setGroupItemsPrice] = useState<{
    [key: string]: number;
  }>({});
  const [userCart, setUserCart] = useState<cartItem[]>([]);
  const [prodQuantity, setProdQuantity] = useState<number>(0);
  const [changedSKU, setChangedSKU] = useState<string>("");
  const [paypalCN, setPaypalCN] = useState<string>(
    "pointer-events-none opacity-50"
  );
  const [claimedVouchers, setClaimedVouchers] = useState<{
    [key: string]: { [key: number]: boolean };
  }>({});

  const [changedQuantState, setChangedQuantState] = useState<boolean>(false);

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
        `/customer/cart/getUserCoins/${customer_id}`
      );
    } catch (err: any) {
      console.log(err);
    }
  };
  const getUserCart = async () => {
    try {
      return await axiosPrivateCustomer
        .get(`/customer/cart/getCart/${customer_id}`)
        .then((res) => {
          if (res.data.length === 0) {
            setIsInputDisabled(true);
            setPaypalCN("pointer-events-none opacity-50");
            setUserCart([]);
            setGroupItems({});
          }

          if (res.data.length > 0) {
            const tempGroupedItems: { [key: string]: cartItem[] } = {};
            res.data.forEach((item: cartItem) => {
              const seller_id = item.seller_id;
              const seller_key: string = `${item.seller_id}_${item.shop_name}`;
              if (!tempGroupedItems[seller_key]) {
                tempGroupedItems[seller_key] = [];
              }
              tempGroupedItems[seller_key].push(item);
            });
            setGroupItems(tempGroupedItems);
            setUserCart(res.data);
          }
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
  const getCustomerVouchers = async () => {
    try {
      return await axiosPrivateCustomer.get(
        `/customer/vouchers/wallet/${customer_id}`
      );
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleQuantityChange = (item: cartItem, change: number) => {
    const updatedGroupedCart = Object.keys(groupItems).map((sellerKey) => {
      // const [sellerId, shopName] = sellerKey.split("_");
      // const items = groupItems[sellerKey];
      const updatedItems = groupItems[sellerKey].map((cartItem: cartItem) => {
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
      return { [sellerKey]: updatedItems }; // Return the updated items within an object
    });
    setGroupItems(Object.assign({}, ...updatedGroupedCart)); // Merge the updated items into a single object
  };

  const getAll = async () => {
    try {
      const result: any = await Promise.all([
        getCoins(),
        getUserCart(),
        getAddress(),
        getCustomerVouchers(),
      ]);
      if (result[0].data.result < 10) {
        setIsInputDisabled(true);
      }
      setUserCoins(result[0].data.result);
      if (result[2].data.length === 0) {
        setIsInputDisabled(true);
      }
      setUserAddresses(result[2].data);

      setCustomerVouchers(result[3].data.vouchers);
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
            claimedVouchers: claimedVouchers,
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
            claimedVouchers: claimedVouchers,
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
        await axiosPrivateCustomer.put("/customer/cart/alterQuantCart", {
          customer_id,
          sku: changedSKU,
          quantity: prodQuantity,
        });

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

  useEffect(() => {
    let sum = 0;
    Object.keys(groupItems).map((sellerKey) => {
      const sumOfSeller = groupItems[sellerKey].reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      sum += sumOfSeller;
      setGroupItemsPrice((prevState) => {
        return {
          ...prevState,
          [sellerKey]: Number(sumOfSeller.toFixed(2)),
        };
      });
    });
    setTotalAmt({
      subTotal: Number(sum),
      shippingFee:
        sum == 0
          ? 0
          : Number((Math.round((8.95 + sum * 0.1) * 100) / 100).toFixed(2)),

      total: sum == 0 ? 0 : Number(Number(sum + (8.95 + sum * 0.1)).toFixed(2)),
      coins: Number(Math.ceil(sum * 0.1)),
    });
  }, [groupItems]);

  useEffect(() => {
    if (totalAmt.subTotal < 0) {
      setTotalAmt({
        ...totalAmt,
        subTotal: 0,
      });
    }
    if (totalAmt.total < 0) {
      setTotalAmt({
        ...totalAmt,
        total: 0,
      });
    }
  }, [totalAmt]);

  useEffect(() => {
    if (lastClaimedVoucher !== null) {
      const voucher = lastClaimedVoucher;
      const key = `${voucher?.seller_id}_${voucher?.shop_name}`;
      if (voucher) {
        if (wasAVVoucherClaimed) {
          switch (voucher.voucher_category) {
            case "Shipping": {
              if (voucher.number_amount) {
                const discAmt = voucher.number_amount;

                setTotalAmt((prevState) => ({
                  ...prevState,
                  shippingFee: Number(
                    (prevState.shippingFee - Number(discAmt)).toFixed(2)
                  ),

                  total: Number((prevState.total - Number(discAmt)).toFixed(2)),
                }));
              } else {
                setTotalAmt((prevState) => {
                  const newShippingAmt =
                    prevState.shippingFee *
                    (1 - Number(voucher.percentage_amount));

                  return {
                    ...prevState,
                    shippingFee: Number(newShippingAmt.toFixed(2)),

                    total: Number(
                      (
                        prevState.total - Number(newShippingAmt.toFixed(2))
                      ).toFixed(2)
                    ),
                  };
                });
              }
              break;
            }
            case "Coins": {
              const discAmt = voucher.number_amount;
              setTotalAmt((prevState) => ({
                ...prevState,
                coins: Number((prevState.coins + Number(discAmt)).toFixed(2)),
              }));
              break;
            }
            case "Price": {
              if (voucher.number_amount) {
                const discAmt = voucher.number_amount;

                setGroupItemsPrice((prevState) => ({
                  ...prevState,
                  [key]:
                    Number((prevState[key] - Number(discAmt)).toFixed(2)) || 0,
                }));
                setTotalAmt((prevState) => {
                  return {
                    ...prevState,
                    subTotal: Number(
                      (prevState.subTotal - Number(discAmt)).toFixed(2)
                    ),
                    total: Number(
                      (prevState.total - Number(discAmt)).toFixed(2)
                    ),
                  };
                });
              } else {
                let discAmt = 0;
                setGroupItemsPrice((prevState) => {
                  const newTotalPriceAmt =
                    prevState[key] * (1 - Number(voucher.percentage_amount));
                  discAmt = prevState[key] * Number(voucher.percentage_amount);
                  return {
                    ...prevState,
                    [key]: Number(newTotalPriceAmt.toFixed(2)),
                  };
                });
                setTotalAmt((prevState) => {
                  return {
                    ...prevState,
                    subTotal: Number(
                      (prevState.subTotal - Number(discAmt)).toFixed(2)
                    ),
                    total: Number(
                      (prevState.total - Number(discAmt)).toFixed(2)
                    ),
                  };
                });
              }
              break;
            }
            default: {
              console.log("Voucher Update (Insertion) Error");
            }
          }
        } else {
          switch (voucher.voucher_category) {
            case "Shipping": {
              if (voucher.number_amount) {
                const discAmt = 1 - Number(voucher.number_amount);

                setTotalAmt((prevState) => ({
                  ...prevState,
                  shippingFee: Number(
                    (prevState.shippingFee + discAmt).toFixed(2)
                  ),

                  total: Number((prevState.total + discAmt).toFixed(2)),
                }));
              } else {
                setTotalAmt((prevState) => {
                  const newShippingAmt = Number(
                    Number(prevState.shippingFee) /
                      (1 - Number(voucher.percentage_amount))
                  );

                  return {
                    ...prevState,
                    shippingFee: Number(newShippingAmt.toFixed(2)),

                    total: Number(
                      (
                        prevState.subTotal + Number(newShippingAmt.toFixed(2))
                      ).toFixed(2)
                    ),
                  };
                });
              }
              break;
            }
            case "Coins": {
              const discAmt = voucher.number_amount;
              setTotalAmt((prevState) => ({
                ...prevState,
                coins: Number((prevState.coins - Number(discAmt)).toFixed(2)),
              }));
              break;
            }
            case "Price": {
              if (voucher.number_amount) {
                const discAmt = voucher.number_amount;
                setGroupItemsPrice((prevState) => ({
                  ...prevState,
                  [key]: Number((prevState[key] + Number(discAmt)).toFixed(2)),
                }));
                setTotalAmt((prevState) => {
                  return {
                    ...prevState,
                    subTotal: Number(
                      (prevState.subTotal + Number(discAmt)).toFixed(2)
                    ),
                    total: Number(
                      (prevState.total + Number(discAmt)).toFixed(2)
                    ),
                  };
                });
              } else {
                let difference = 0;
                setGroupItemsPrice((prevState) => {
                  let nowPercentage = 1 - Number(voucher.percentage_amount);
                  let previousPrice = prevState[voucher.seller_id];
                  const newTotalPriceAmt = Number(
                    prevState[key] / Number(nowPercentage)
                  );
                  difference = Number(newTotalPriceAmt) - Number(previousPrice);
                  return {
                    ...prevState,
                    [key]: Number(newTotalPriceAmt.toFixed(2)),
                  };
                });
                setTotalAmt((prevState) => {
                  let subtotalAmt = Number(
                    (prevState.subTotal + Number(difference)).toFixed(2)
                  );
                  return {
                    ...prevState,
                    subTotal: Number(subtotalAmt.toFixed(2)),
                    total: Number(
                      (prevState.total + Number(difference)).toFixed(2)
                    ),
                  };
                });
              }
              break;
            }
            default: {
              console.log("Voucher Update (Removal) Error");
            }
          }
        }
      }
    }
  }, [claimedVouchers]);

  return (
    <div className="container flex">
      <div className="w-2/3 bg-white rounded-lg shadow-lg p-2">
        {groupItems && (
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
        {userCart.length == 0 && (
          <div className="font-bold text-xl text-gray-300 flex justify-center h-full items-center">
            No cart items to retrieve.
          </div>
        )}
        {Object.keys(groupItems).map((sellerKey) => (
          <div key={sellerKey} className="border-b-2 mb-2">
            <div className="storeName flex-row flex m-3">
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
            {groupItems[sellerKey].map((item: cartItem) => (
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
                    className="text-sm border px-1 py-0.5 mx-2"
                    onClick={(event) => {
                      event.preventDefault();
                      handleQuantityChange(item, -1);
                    }}
                  >
                    -
                  </button>
                  {item.quantity}
                  <button
                    className="text-sm border  px-2 py-1 mx-2"
                    onClick={(event) => {
                      event.preventDefault();
                      if (item.quantity >= item.stock) {
                        toast.warn("Max Stock reached", {
                          position: "top-center",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                        });
                      } else {
                        handleQuantityChange(item, 1);
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </Link>
            ))}
            <div className="justify-between flex border-t-2 font-semibold">
              {claimedVouchers[sellerKey] ? (
                <div className="font-bold text-xs text-center pt-1">
                  * Discount Applied
                </div>
              ) : (
                <div></div>
              )}
              ${groupItemsPrice[sellerKey]}
            </div>
          </div>
        ))}
      </div>
      <div className="w-1/3 p-5 bg-softerPurple">
        <div className="text-xl font-bold text-white mb-7">Order Summary</div>

        <div className=" text-sm summary">
          <div className="subTotal flex justify-between">
            <div className=" text-white">Subtotal</div>
            <div className="text-white">${totalAmt.subTotal.toFixed(2)}</div>
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
            <Button onClick={handleOpen}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="24"
                height="24"
                className="walletsvg"
              >
                <path
                  fill="#ffff"
                  d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                />
              </svg>
            </Button>
            <div className="showCoins text-xs text-white ">
              Coins Available: <span className="font-bold ">{userCoins}</span>
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
          <div className="flex-col items-center justify-center">
            {userAddresses.length != 0 && (
              <Select
                placeholder="Select Address.."
                className="mb-5"
                value={
                  selectedAddress
                    ? {
                        value: selectedAddress,
                        label: `${selectedAddress.street_name}, ${selectedAddress.block}, ${selectedAddress.postal_code}`,
                        address: selectedAddress,
                      }
                    : null
                }
                styles={{
                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                }}
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
            {userAddresses.length == 0 && (
              <div className="my-4 ">
                <Link
                  to={"/profile"}
                  className="flex  items-center justify-center bg-white hover:bg-transparent hover:border-2 hover:box-border text-center hover:border-white hover:text-white text-softerPurple font-bold py-2 px-4 rounded mx-auto"
                >
                  Add an Address..
                </Link>
              </div>
            )}
            <div className={paypalCN}>
              <PayPal amount={totalAmt.total} setSuccess={setSuccess} />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-left"
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

      {open && (
        <VoucherModal
          vouchers={customerVouchers}
          open={open}
          setOpen={setOpen}
          totalAmt={totalAmt}
          claimedVouchers={claimedVouchers}
          setClaimedVouchers={setClaimedVouchers}
          groupItems={groupItems}
          getUserCart={getUserCart}
          setWasAVVoucherClaimed={setWasAVVoucherClaimed}
          setLastClaimedVoucher={setLastClaimedVoucher}
          groupItemsPrice={groupItemsPrice}
        />
      )}
    </div>
  );
}

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
