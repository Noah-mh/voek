import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useCustomer from "../../hooks/UseCustomer";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Noah's code
interface AddressModalProps {
    getAll: () => void;

}

const AddressModal :React.FC<AddressModalProps>=({ getAll })=> {
    const { customer } = useCustomer();
    const customer_id = customer.customer_id;
    const axiosPrivateCustomer = useAxiosPrivateCustomer();

    const [open, setOpen] = useState(false);
    const [address, setAddress] = useState({
        block: '',
        unit_no: '',
        street_name: '',
        postal_code: '',
        country: ''
    });
    const [error, setError] = useState({
        block: false,
        unit_no: false,
        street_name: false,
        postal_code: false,
        country: false
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setAddress({
            block: '',
            unit_no: '',
            street_name: '',
            postal_code: '',
            country: ''
        });
        setError({
            block: false,
            unit_no: false,
            street_name: false,
            postal_code: false,
            country: false
        });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({
            ...address,
            [event.target.name]: event.target.value
        });
        setError({
            ...error,
            [event.target.name]: !event.target.value
        });
    };

    const handleSave = async () => {
        const hasError = Object.values(address).some((value) => !value);
        if (hasError) {
            setError({
                block: !address.block,
                unit_no: !address.unit_no,
                street_name: !address.street_name,
                postal_code: !address.postal_code,
                country: !address.country
            });
            return;
        }
        console.log(address);
        handleClose();
        try {
            const response = await axiosPrivateCustomer.post(`/customer/addAddress/${customer_id}`,
                {
                    block: address.block,
                    unit_no: address.unit_no,
                    street_name: address.street_name,
                    postal_code: address.postal_code,
                    country: address.country
                });
            console.log(response);
            toast.success("Added New Address", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            getAll();
        } catch (error) {
            console.error(error);
            toast.error("Error Uploading Photo", {
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

    const body = (
        <Box sx={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
        }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Enter Address
            </Typography>

            <TextField error={error.block} name="block" label="Block *" variant="outlined" fullWidth margin="normal" value={address.block} onChange={handleChange} />
            <TextField error={error.unit_no} name="unit_no" label="Unit No *" variant="outlined" fullWidth margin="normal" value={address.unit_no} onChange={handleChange} />
            <TextField error={error.street_name} name="street_name" label="Street Name *" variant="outlined" fullWidth margin="normal" value={address.street_name} onChange={handleChange} />
            <TextField error={error.postal_code} name="postal_code" label="Postal Code *" variant="outlined" fullWidth margin="normal" value={address.postal_code} onChange={handleChange} />
            <TextField error={error.country} name="country" label="Country *" variant="outlined" fullWidth margin="normal" value={address.country} onChange={handleChange} />
            <Typography id="modal-modal-description" sx={{ m: 2 }}>
                * means required
            </Typography>
            <div className="flex justify-between">
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClose} style={{ marginLeft: '10px' }}>
                    Cancel
                </Button>
            </div>

        </Box>
    );

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>
                Add New Address
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex justify-center items-center"
            >
                {body}
            </Modal>
        </div>
    );
}

export default AddressModal;