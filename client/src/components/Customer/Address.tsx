import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Customer } from './CustomerProfile';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import AddressModal from './AddressModel';
import useCustomer from "../../hooks/UseCustomer";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//Noah's code
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
    getAll: () => void;

}

type AddressKey = 'block' | 'country' | 'unit_no' | 'postal_code' | 'street_name';


const AddressDisplay: React.FC<AddressDisplayProps> = ({ customerData, getAll }) => {
    const { customer } = useCustomer();
    const customer_id = customer.customer_id;
    const axiosPrivateCustomer = useAxiosPrivateCustomer();
    const [noAddress, setNoAddress] = useState<boolean>(false);
    const [countries, setCountries] = useState([]);
    const { addresses } = customerData;

    const getCountries = async () => {
        try {
            const response = await axios.get("https://restcountries.com/v3.1/all");
            const names = response.data.map((country: { name: { common: string } }) => country.name.common);
            names.sort();
            setCountries(names);
        } catch (error) {
            console.error('Failed to fetch countries', error);
        }
    };
    useEffect(() => {
        getCountries();
    }, []);

    useEffect(() => {
        const allPropsNull = Object.values(addresses[0]).every(val => val === null);
        setNoAddress(allPropsNull);
    }, [addresses])

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

    const hasAddressChanged = (original: Address, updated: Address) => {
        return (
            original.block !== updated.block ||
            original.unit_no !== updated.unit_no ||
            original.street_name !== updated.street_name ||
            original.postal_code !== updated.postal_code ||
            original.country !== updated.country
        );
    };

    const handleSave = async (index: number) => {
        const currentAddress = addressUpdates[index];
        const originalAddress = initialAddressUpdates[index];
        const newAddressUpdates = [...addressUpdates];
        if (!hasAddressChanged(originalAddress, currentAddress)) {
            newAddressUpdates[index].editing = false;
            setAddressUpdates(newAddressUpdates);
            return;
        }

        newAddressUpdates[index].editing = false;
        setAddressUpdates(newAddressUpdates);
        try {
            const response = await axiosPrivateCustomer.put(`/customer/updateAddress/${customer_id}`,
                {
                    address_id: addressUpdates[index].address_id,
                    block: addressUpdates[index].block,
                    unit_no: addressUpdates[index].unit_no,
                    street_name: addressUpdates[index].street_name,
                    postal_code: addressUpdates[index].postal_code,
                    country: addressUpdates[index].country
                });
            if (response) {
                toast.success("Successfully updated Address", {
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
        } catch (error) {
            console.error(error);
            toast.error("Error updating Address", {
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

    const handleUpdate = (index: number, key: AddressKey, value: string) => {
        const newAddressUpdates = [...addressUpdates];
        newAddressUpdates[index][key] = value;
        setAddressUpdates(newAddressUpdates);
    };
    const handleSelectChange = (index: number, event: SelectChangeEvent) => {
        const newAddressUpdates = [...addressUpdates];
        newAddressUpdates[index]['country'] = event.target.value as string;
        setAddressUpdates(newAddressUpdates);
    };

    const handleDelete = async (index: number) => {
        const newAddressUpdates = [...addressUpdates];
        newAddressUpdates.splice(index, 1);
        setAddressUpdates(newAddressUpdates);
        try {
            const response = await axiosPrivateCustomer.delete(`/customer/${customer_id}/deleteAddress/${addressUpdates[index].address_id}`);
            if (response) {
                toast.success("Successfully deleted Address", {
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
        } catch (error) {
            console.error(error);
            toast.error("Error deleting Address", {
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

    const addAddress = (newAddress: any) => {
        setAddressUpdates((prevAddresses) => {
            if (prevAddresses.length === 1 && Object.values(prevAddresses[0]).some(val => val === '' || val === null)) {
                return [{ ...newAddress, editing: false }];
            } else {
                return [...prevAddresses, { ...newAddress, editing: false }];
            }
        });
    };

    useEffect(() => {
        getAll();
    }, [addressUpdates]);


    if (noAddress) return (
        <div className="flex justify-center p-5 ">
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
                <ToastContainer />
                <div className="flex justify-center item-center">
                    <AddressModal getAll={getAll} addAddress={addAddress} countries={countries} />
                </div>
            </Box>
        </div>
    )
    else {

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
                                sx={{ m: 2 }}
                            />
                            <TextField
                                id={`outlined-unit-no-${index}`}
                                label="Unit No"
                                variant="outlined"
                                value={address.unit_no}
                                onChange={(e) => handleUpdate(index, 'unit_no', e.target.value)}
                                disabled={!address.editing}
                                fullWidth
                                sx={{ m: 2 }}
                            />
                            <TextField
                                id={`outlined-street-name-${index}`}
                                label="Street Name"
                                variant="outlined"
                                value={address.street_name}
                                onChange={(e) => handleUpdate(index, 'street_name', e.target.value)}
                                disabled={!address.editing}
                                fullWidth
                                sx={{ m: 2 }}
                            />
                            <TextField
                                id={`outlined-postal-code-${index}`}
                                label="Postal Code"
                                variant="outlined"
                                value={address.postal_code}
                                onChange={(e) => handleUpdate(index, 'postal_code', e.target.value)}
                                disabled={!address.editing}
                                fullWidth
                                sx={{ m: 2 }}
                            />
                            <FormControl variant="outlined" fullWidth margin="normal" disabled={!address.editing} sx={{ m: 2 }}>
                                <InputLabel id="country-label">Country</InputLabel>
                                <Select
                                    labelId="country-label"
                                    id="country-select"
                                    value={address.country}
                                    onChange={(event) => handleSelectChange(index, event)}
                                    name="country"
                                    label="Country"
                                >
                                    {countries.map((country, index) => (
                                        <MenuItem key={index} value={country}>{country}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {address.editing ? (
                                <div className="flex justify-center">
                                    <Button onClick={() => handleSave(index)} variant="contained" color="primary" sx={{ margin: '16px' }} >
                                        Save
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex justify-center">
                                    <Button onClick={() => handleEdit(index)} variant="contained" color="primary" sx={{ margin: '16px' }} >
                                        Edit
                                    </Button>
                                    <Button onClick={() => handleDelete(index)} variant="contained" sx={{ margin: '16px', backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}>
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                    <ToastContainer />

                    <div className="flex justify-center"> <AddressModal getAll={getAll} addAddress={addAddress} countries={countries} /></div>

                </Box>
            </div>
        );
    }
};

export default AddressDisplay;
