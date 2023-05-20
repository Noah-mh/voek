import React from 'react';
import { Address } from './Address';
import { cld } from '../../Cloudinary/Cloudinary';
import { AdvancedImage } from '@cloudinary/react';
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
}

const CustomerProfile: React.FC<CustomerDisplayProps> = ({ customerData }) => {
    const {
        username,
        email,
        phone_number,
        image_url,
    } = customerData;

    return (
        <div>
            <h1>{username}</h1>
            <p>Email: {email}</p>
            <p>Phone number: {phone_number}</p>
            <img src={image_url} alt="Profile" />
        </div>
    );
};

export default CustomerProfile;
