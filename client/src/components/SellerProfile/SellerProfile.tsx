import { useEffect, useState } from 'react'
import useAxiosPrivateSeller from '../../hooks/useAxiosPrivateSeller'
import useSeller from '../../hooks/useSeller'
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../../Cloudinary/Cloudinary";

interface SellerDetails {
    shop_name?: string;
    email?: string;
    image_url?: string;
    phone_number?: number
}

const SellerProfile = () => {

    const axiosPrivateSeller = useAxiosPrivateSeller();
    const { seller } = useSeller();
    const [sellerDetails, setSellerDetails] = useState<SellerDetails>()
    const [disabled, setDisabled] = useState<boolean>(true)
    const [errMsg, setErrMsg] = useState<string>()
    const [newPassword, setNewPassword] = useState<string>()
    const [saveButton, setSaveButton] = useState<boolean>(false)
    const [sendEmailVerification, setSendEmailVerification] = useState<boolean>(false)
    const [status, setStatus] = useState<boolean>();
    const [modal, setModal] = useState<boolean>(false);
    const [disabledModal, setDisabledModal] = useState<boolean>(true);

    const getSellerDetails = async () => {
        try {
            const response = await axiosPrivateSeller.get(`/seller/${seller?.seller_id}`)
            setSellerDetails(response.data.sellerDetails[0])
        } catch (error) {
            console.log(error)
        }
    }

    const getActiveStatus = async () => {
        try {
            const response = await axiosPrivateSeller.get(`/seller/status/${seller.seller_id}`)
            setStatus(response.data.status)
        } catch (err: any) {
            console.log(err)
        }
    }

    const deactivateAccount = async () => {
        try {
            await axiosPrivateSeller.put(`/seller/deactivate/${seller.seller_id}`)
            setStatus(false)
        } catch (err: any) {
            console.log(err)
        }
    }

    const activateAccount = async () => {
        try {
            await axiosPrivateSeller.put(`/seller/activate/${seller.seller_id}`)
            setStatus(true)
        } catch (err: any) {
            console.log(err)
        }
    }

    useEffect(() => {
        getSellerDetails()
        getActiveStatus();
    }, [])

    useEffect(() => {
        if (!sellerDetails?.email?.trim() || !sellerDetails?.shop_name?.trim() || !sellerDetails?.phone_number) {
            setSaveButton(false)
            setErrMsg('Please fill in all fields');
        } else {
            setSaveButton(true)
            setErrMsg('');
        }
    }, [sellerDetails])

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!disabled && saveButton) {
            const body = newPassword ? { password: newPassword, email: sellerDetails?.email, shop_name: sellerDetails?.shop_name, phone_number: sellerDetails?.phone_number } : { email: sellerDetails?.email, shop_name: sellerDetails?.shop_name, phone_number: sellerDetails?.phone_number }
            const result = await axiosPrivateSeller.put(`/seller/profile/${seller?.seller_id}`, body)
            if (result.data?.emailChange) {
                result.data?.emailChange && setSendEmailVerification(true);
                setDisabled(true);
                setSaveButton(true);
                setNewPassword('');
            } else if (result.data?.duplicateEmail) {
                result.data?.duplicateEmail && setErrMsg('Email already exists');
            } else {
                setDisabled(true);
                setSaveButton(true);
                setNewPassword('');
            }
        } else {
            setDisabled(false)
        }
    }



    // const updateSellerDetails = async () => {
    //     if (!disabled && saveButton) {
    //         const body = newPassword ? { password: newPassword, email: sellerDetails?.email, shop_name: sellerDetails?.shop_name, phone_number: sellerDetails?.phone_number } : { email: sellerDetails?.email, shop_name: sellerDetails?.shop_name, phone_number: sellerDetails?.phone_number }
    //         await axiosPrivateSeller.put(`/seller/profile/${seller?.seller_id}`, body)
    //         setDisabled(true)
    //         setSaveButton(true);
    //     } else {
    //         setDisabled(false)
    //         console.log('here')
    //     }
    // }

    return (
        <div className="p-8">
            <div className="flex items-center mb-4">
                <div>
                    <AdvancedImage cldImg={cld.image(sellerDetails?.image_url)} className="w-60" />
                </div>
                <div className="ml-4">
                    <h1 className="text-3xl font-bold">Seller Profile</h1>
                    <h2 className="text-xl">{sellerDetails?.shop_name}</h2>
                </div>
                <div className="flex">
                    Account Status: &nbsp;
                    <label className="inline-flex relative items-center mr-5 cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={status}
                            readOnly
                        />
                        <div
                            onClick={() => {
                                !status ? activateAccount() : setModal(true)
                            }}
                            className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                        ></div>
                    </label>
                    {status ? <p className="text-green-600">Active</p> : <p className="text-red-600">Inactive</p>}
                </div>
            </div>
            <div>
                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="block mb-2 font-bold" htmlFor="shopName">Shop Name</label>
                        <input
                            id="shopName"
                            type="text"
                            value={sellerDetails?.shop_name}
                            disabled={disabled}
                            onChange={(e) => {
                                setSellerDetails({ ...sellerDetails, shop_name: e.target.value })
                            }}
                            className="border border-gray-300 rounded px-4 py-2 w-full text-black"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-bold" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={sellerDetails?.email}
                            disabled={disabled}
                            onChange={(e) => {
                                setSellerDetails({ ...sellerDetails, email: e.target.value })
                            }}
                            className="border border-gray-300 rounded px-4 py-2 w-full text-black"
                        />
                        {sendEmailVerification && <p className="text-red-500">Please verify your email. Email Has Been Sent</p>}
                    </div>
                    <div>
                        <label className="block mb-2 font-bold" htmlFor="phoneNumber">Phone Number</label>
                        <input
                            id="phoneNumber"
                            type="number"
                            value={sellerDetails?.phone_number}
                            disabled={disabled}
                            onChange={(e) => {
                                setSellerDetails({ ...sellerDetails, phone_number: parseInt(e.target.value) })
                            }}
                            className="border border-gray-300 rounded px-4 py-2 w-full text-black"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-bold" htmlFor="newPassword">New Password</label>
                        <input
                            id="newPassword"
                            type="text"
                            value={newPassword}
                            disabled={disabled}
                            onChange={(e) => {
                                setNewPassword(e.target.value)
                            }}
                            className="border border-gray-300 rounded px-4 py-2 w-full text-black"
                        />
                    </div>
                    <p className="text-red-500 mb-4">{errMsg}</p>
                    <input
                        type="submit"
                        value={disabled && saveButton ? 'Edit' : 'Save'}
                        disabled={!saveButton}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                    />
                </form>
            </div>
            {modal && status ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full">
                    <div className="fixed inset-0 transition-opacity">
                        <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
                    </div>
                    <div className="relative z-10 bg-white rounded-lg w-80">
                        <div className="flex flex-col justify-center items-center p-4">
                            <p className="mb-2">Type "Deactivate" To Deactivate Account</p>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-4 py-2 w-full text-black mb-2"
                                onChange={(e) => {
                                    e.target.value === 'Deactivate'
                                        ? setDisabledModal(false)
                                        : setDisabledModal(true)
                                }}
                            />
                            <div className="flex justify-around w-full">
                                <button
                                    onClick={() => {
                                        deactivateAccount()
                                        setModal(false)
                                    }}
                                    disabled={disabledModal}
                                    className="bg-red-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                                >
                                    Deactivate
                                </button>
                                <button
                                    className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-150 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300"
                                    onClick={() => {
                                        setModal(false)
                                    }}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default SellerProfile