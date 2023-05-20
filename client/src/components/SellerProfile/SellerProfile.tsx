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

    const getSellerDetails = async () => {
        try {
            const response = await axiosPrivateSeller.get(`/seller/${seller?.seller_id}`)
            setSellerDetails(response.data.sellerDetails[0])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getSellerDetails()
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
            setDisabled(true)
            setSaveButton(true);
        } else {
            setDisabled(false)
            console.log('here')
        }
    }

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
        </div>
    )
}

export default SellerProfile