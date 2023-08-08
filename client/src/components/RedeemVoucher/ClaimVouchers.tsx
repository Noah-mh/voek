import { useEffect, useState } from 'react'
import axios from '../../api/axios'
import { Link, useNavigate } from "react-router-dom";
import { CiChat1 } from "react-icons/ci";
import { AiOutlineShop } from "react-icons/ai";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../../Cloudinary/Cloudinary";
import useAxiosPrivateCustomer from '../../hooks/useAxiosPrivateCustomer';
import useCustomer from "../../hooks/UseCustomer";
import { ToastContainer, toast } from "react-toastify";
import RedeemVoucher from './RedeemVoucher';

interface Seller {
    seller_id: number;
    shop_name: string;
    image_url: string;
}

const ClaimVouchers = () => {

    const axiosPrivateCustomer = useAxiosPrivateCustomer();
    const navigate = useNavigate();

    const { customer } = useCustomer();

    const [sellers, setSellers] = useState<Seller[]>([])

    const getSellers = async () => {
        try {
            const { data } = await axios.get(`/sellers`)
            setSellers(data.sellers)
        } catch (err: any) {
            console.log(err)
        }
    }

    useEffect(() => {
        getSellers()
    }, [])

    const handleOnClickChat = (seller_id: number) => {
        if (!customer.customer_id) {
            toast.warn("Please Log in to chat with the seller", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        } else {
            axiosPrivateCustomer
                .post(
                    "/createDMRoom",
                    JSON.stringify({
                        customerID: customer.customer_id,
                        sellerID: seller_id,
                    }),
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                )
                .then((response) => {
                    console.log("response", response);
                    if (response.status === 201 || response.status === 200) {
                        navigate("/chat");
                    } else {
                        toast.error("Error!", {
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
                })
                .catch((error) => {
                    // Handle error here
                    console.error(error);
                    toast.error("Error!", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                });
        }
    };
    return (
        <div>
            <ToastContainer />
            <div>
                <h1 className="p-6 text-3xl font-bold mb-4">Claim Vouchers</h1>
                {
                    sellers.map((seller: Seller) => (
                        <div className='p-10 box-border border border-gray-200 mx-5 my-6'>
                            <div className="pr-12 mb-3 flex justify-center items-center">
                                <Link
                                    to={`/customerSellerProfile/${seller.seller_id}`}
                                    className="flex-shrink-0 mr-5 relative overflow-visible outline-0"
                                >
                                    <div className="w-20 h-20">
                                        <AdvancedImage
                                            cldImg={cld.image(seller.image_url)}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                </Link>
                                <div className="grow flex flex-col content-center overflow-hidden">
                                    <Link
                                        to={`/customerSellerProfile/${seller.seller_id}`}
                                        className="overflow-hidden text-ellipsis whitespace-nowrap"
                                    >
                                        {seller.shop_name}
                                    </Link>
                                    <div className="mt-2 flex space-x-2">
                                        <div
                                            onClick={() => handleOnClickChat(seller.seller_id)}
                                            className="outline-0 border border-purpleAccent bg-pink bg-opacity-10 relative overflow-visible h-9 px-4 flex justify-center items-center hover:cursor-pointer"
                                        >
                                            <CiChat1 /> <h1 className="ml-2">Chat</h1>
                                        </div>
                                        <Link
                                            to={`/customerSellerProfile/${seller.seller_id}`}
                                            className="outline-0 border border-opacity-10 relative overflow-visible h-9 px-4 flex justify-center items-center"
                                        >
                                            <AiOutlineShop /> <h1 className="ml-2">Shop</h1>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <RedeemVoucher seller_id={seller.seller_id} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ClaimVouchers