import React, { useState } from 'react';
import { Customer } from './CustomerProfile';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import AddressModal from './AddressModel';
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

type AddressKey = 'block' | 'country' | 'unit_no' | 'postal_code' | 'street_name';


const AddressDisplay: React.FC<AddressDisplayProps> = ({ customerData }) => {
    const { addresses } = customerData;

    // Create initial state for address updates
    const initialAddressUpdates = addresses.map(address => ({
        ...address,
        editing: false,
    }));

    const [addressUpdates, setAddressUpdates] = useState(initialAddressUpdates);

    const handleEdit = (index: number) => {
        const newAddressUpdates = [...addressUpdates];
        newAddressUpdates[index].editing = true;
        setAddressUpdates(newAddressUpdates);
    };

    const handleSave = (index: number) => {
        const newAddressUpdates = [...addressUpdates];
        newAddressUpdates[index].editing = false;
        setAddressUpdates(newAddressUpdates);
        console.log(addressUpdates[index])
    };

    const handleUpdate = (index: number, key: AddressKey, value: string) => {
        const newAddressUpdates = [...addressUpdates];
        newAddressUpdates[index][key] = value;
        setAddressUpdates(newAddressUpdates);
    };


    return (
        <div className="flex justify-between p-5 ">
            <Box
                className="flex-1"
                component="form"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
                noValidate
                autoComplete="off"
            >
                {addressUpdates.map((address, index) => (
                    <div key={index}>
                        <TextField
                            id={`outlined-block-${index}`}
                            label="Block"
                            variant="outlined"
                            value={address.block}
                            onChange={(e) => handleUpdate(index, 'block', e.target.value)}
                            disabled={!address.editing}
                            fullWidth
                            sx={{ m: 2 }} // Apply padding
                        />
                        <TextField
                            id={`outlined-unit-no-${index}`}
                            label="Unit No"
                            variant="outlined"
                            value={address.unit_no}
                            onChange={(e) => handleUpdate(index, 'unit_no', e.target.value)}
                            disabled={!address.editing}
                            fullWidth
                            sx={{ m: 2 }} // Apply padding
                        />
                        <TextField
                            id={`outlined-street-name-${index}`}
                            label="Street Name"
                            variant="outlined"
                            value={address.street_name}
                            onChange={(e) => handleUpdate(index, 'street_name', e.target.value)}
                            disabled={!address.editing}
                            fullWidth
                            sx={{ m: 2 }} // Apply padding
                        />
                        <TextField
                            id={`outlined-postal-code-${index}`}
                            label="Postal Code"
                            variant="outlined"
                            value={address.postal_code}
                            onChange={(e) => handleUpdate(index, 'postal_code', e.target.value)}
                            disabled={!address.editing}
                            fullWidth
                            sx={{ m: 2 }} // Apply padding
                        />
                        <TextField
                            id={`outlined-country-${index}`}
                            label="Country"
                            variant="outlined"
                            value={address.country}
                            onChange={(e) => handleUpdate(index, 'country', e.target.value)}
                            disabled={!address.editing}
                            fullWidth
                            sx={{ m: 2 }} // Apply padding
                        />
                        {address.editing ? (
                            <div className="flex justify-center">
                                <Button onClick={() => handleSave(index)} variant="contained" color="primary">
                                    Save
                                </Button>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <Button onClick={() => handleEdit(index)} variant="contained" color="primary">
                                    Edit
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
                <div className="flex justify-center"> <AddressModal /></div>

            </Box>
        </div>
    );

};

export default AddressDisplay;
