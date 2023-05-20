import React, { useState, useEffect } from 'react';
import { Address } from './Address';
import { cld } from '../../Cloudinary/Cloudinary';
import { AdvancedImage } from '@cloudinary/react';
import CloudinaryUploader from "../../Cloudinary/CloudinaryUploader";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from "react-toastify";
export interface Customer {
    customer_id: number;
    username: string;
    password: string;
    email: string;
    referred_by: number | null;
    coins: number;
    referral_id: string;
    phone_number: string;
    last_viewed_cat_id: number;
    refresh_token: string;
    date_created: string;
    active: number;
    image_url: string;
    addresses: Address[];
}

interface CustomerDisplayProps {
    customerData: Customer;
    getAll: () => void;
}

const CustomerProfile: React.FC<CustomerDisplayProps> = ({ customerData, getAll }) => {
    const {
        customer_id,
        username,
        email,
        phone_number,
        image_url,
    } = customerData;
    const axiosPrivateCustomer = useAxiosPrivateCustomer();
    const [editing, setEditing] = useState(false);
    const [updateUsername, setUpdateUsername] = useState(username);
    const [updateEmail, setUpdateEmail] = useState(email);
    const [updatePhoneNumber, setUpdatePhoneNumber] = useState(phone_number);
    const [updateImage, setUpdateImage] = useState(image_url);

    useEffect(() => { getAll() }, [updateImage])

    const handleEdit = () => {
        setEditing(true);
    };

    const handleUpload = async (resultInfo: any) => {
        console.log('Successfully uploaded:', resultInfo.public_id);
        setUpdateImage(resultInfo.public_id);
        try {
            const response = await axiosPrivateCustomer.put(`/customer/profile/edit/photo/${customer_id}`, {
                image_url: resultInfo.public_id
            })
            console.log(response.data);
            toast.success("Photo updated", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (error) {
            console.error(error);
            toast.error("Error! Adding to cart failed", {
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
    };


    const handleSave = async () => {
        console.log(updateUsername, updateEmail, updatePhoneNumber);
        setEditing(false);
        try {
            // Make the Axios PUT request to update the user's profile
            const response = await axiosPrivateCustomer.put(`/customer/profile/edit/${customer_id}`, {
                username: updateUsername,
                email: updateEmail,
                phone_number: updatePhoneNumber
            });

            // Handle success and update UI accordingly
            console.log('Profile updated:', response.data);
            toast.success("Profile updated", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        } catch (error) {
            // Handle error and display appropriate message
            console.error(error);
            toast.error("Error! Adding to cart failed", {
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
    };
    return (
        <div className="flex justify-between p-5">

            <Box
                className="flex-1"
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="outlined-username"
                    label="Username"
                    variant="outlined"
                    value={updateUsername}
                    onChange={(e) => setUpdateUsername(e.target.value)}
                    disabled={!editing}
                    fullWidth
                />
                <TextField
                    id="outlined-email"
                    label="Email"
                    variant="outlined"
                    value={updateEmail}
                    onChange={(e) => setUpdateEmail(e.target.value)}
                    disabled={!editing}
                    fullWidth
                />
                <TextField
                    id="outlined-phone-number"
                    label="Phone Number"
                    variant="outlined"
                    value={updatePhoneNumber}
                    onChange={(e) => setUpdatePhoneNumber(e.target.value)}
                    disabled={!editing}
                    fullWidth
                />
                {editing ? (
                    <div className="flex justify-center">
                        <Button onClick={handleSave} variant="contained" color="primary">
                            Save
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <Button onClick={handleEdit} variant="contained" color="primary">
                            Edit
                        </Button>
                    </div>
                )}
            </Box>
            <div className="flex flex-col items-center ml-9">
                <div className="w-40 h-40 mb-5">
                    <AdvancedImage cldImg={cld.image(image_url)} />
                </div>
                <CloudinaryUploader onSuccess={handleUpload} caption={"Upload New"} />
            </div>
            <ToastContainer />

        </div >
    );
};

export default CustomerProfile;
