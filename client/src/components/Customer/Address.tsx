import React from 'react';
import { Customer } from './CustomerProfile';
export interface Address {
    block: string;
    country: string;
    unit_no: string;
    address_id: number;
    postal_code: string;
    street_name: string;
}

interface AddressDisplayProps {
    customerData: Customer;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({ customerData }) => {
    const {addresses} = customerData;

    return (
        <div>
            <h2>Addresses:</h2>
            {addresses.map((address, index) => (
                <div key={index}>
                    <p>Block: {address.block}</p>
                    <p>Country: {address.country}</p>
                    <p>Unit No: {address.unit_no}</p>
                    <p>Postal Code: {address.postal_code}</p>
                    <p>Street Name: {address.street_name}</p>
                </div>
            ))}
        </div>
    );
};

export default AddressDisplay;
