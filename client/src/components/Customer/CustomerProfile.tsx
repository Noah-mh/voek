import React, { useState, useEffect } from "react";
import { Address } from "./Address";
import { cld } from "../../Cloudinary/Cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import CloudinaryUploader from "../../Cloudinary/CloudinaryUploader";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import useCustomer from "../../hooks/UseCustomer";
import ReferralLink from '../ReferralLink/ReferralLink';
import { AiFillDelete } from 'react-icons/ai';
import Loader from "../Loader/Loader";


//Noah's code + Kang Rui
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

const CustomerProfile: React.FC<CustomerDisplayProps> = ({
  customerData,
  getAll
}) => {
  const { customer_id, username, email, phone_number, image_url } =
    customerData;
  const axiosPrivateCustomer = useAxiosPrivateCustomer();
  const { customer } = useCustomer();
  const [editing, setEditing] = useState(false);
  const [updateUsername, setUpdateUsername] = useState(username);
  const [updateEmail, setUpdateEmail] = useState(email);
  const [updatePhoneNumber, setUpdatePhoneNumber] = useState(phone_number);
  const [updateImage, setUpdateImage] = useState(image_url);
  const [newPassword, setNewPassword] = useState<string>();
  const [errMsg, setErrMsg] = useState<string>();
  const [sendEmailVerification, setSendEmailVerification] =
    useState<boolean>(false);
  const [save, setSave] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>();
  const [modal, setModal] = useState<boolean>(false);
  const [disabledModal, setDisabledModal] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getActiveStatus = async () => {
    try {
      const response = await axiosPrivateCustomer.get(
        `/customer/status/${customer.customer_id}`
      );
      setStatus(response.data.status);
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deactivateAccount = async () => {
    try {
      await axiosPrivateCustomer.put(
        `/customer/deactivate/${customer.customer_id}`
      );
      setStatus(false);
    } catch (err: any) {
      console.log(err);
    }
  };

  const activateAccount = async () => {
    try {
      await axiosPrivateCustomer.put(
        `/customer/activate/${customer.customer_id}`
      );
      setStatus(true);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    getActiveStatus();
  }, []);

  useEffect(() => {
    getAll();
  }, [updateImage]);

  const handleEdit = () => {
    setEditing(true);
  };

  useEffect(() => {
    if (
      !updateUsername?.trim() ||
      !updateEmail?.trim() ||
      !updatePhoneNumber?.trim()
    ) {
      setErrMsg("Please fill in all fields");
      setEditing(true);
      setSave(true);
    } else {
      setErrMsg("");
      setSave(false);
    }
  }, [
    !updateUsername?.trim(),
    !updateEmail?.trim(),
    !updatePhoneNumber?.trim(),
  ]);

  const handleUpload = async (resultInfo: any) => {
    setUpdateImage(resultInfo.public_id);
    try {
      const response: number = await axiosPrivateCustomer.put(
        `/customer/profile/edit/photo/${customer_id}`,
        {
          image_url: resultInfo.public_id,
        }
      );
      if (response === 200) {
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
      }
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

  const handleDelete = async () => {
    setUpdateImage("test/blank-profile-picture-973460_1280_tj6oeb");
    try {
      const response: number = await axiosPrivateCustomer.put(
        `/customer/profile/edit/photo/${customer_id}`,
        {
          image_url: "test/blank-profile-picture-973460_1280_tj6oeb",
        }
      );
      if (response === 200) {
        toast.success("Photo deleted", {
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
      }
    } catch (error) {
      console.error(error);
      toast.error("Error Deleting Photo", {
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
  }

  const handleSave = async () => {
    try {
      // Make the Axios PUT request to update the user's profile
      const response = await axiosPrivateCustomer.put(
        `/customer/profile/edit/${customer_id}`,
        {
          username: updateUsername,
          email: updateEmail,
          phone_number: updatePhoneNumber,
          password: newPassword,
        }
      );

      if (response.data?.emailChange) {
        response.data?.emailChange && setSendEmailVerification(true);
        setEditing(false);
        setNewPassword("");
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
      } else if (response.data?.duplicateEmail) {
        response.data?.duplicateEmail && setErrMsg("Email already exists");
      } else {
        setEditing(false);
        setNewPassword("");
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
      }

      // Handle success and update UI accordin
    } catch (error) {
      // Handle error and display appropriate message
      console.error(error);
      toast.error("Updating failed", {
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
        width={750}
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
        {sendEmailVerification && (
          <p className="text-red-500">
            Please verify your email. Email Has Been Sent
          </p>
        )}
        <TextField
          id="outlined-phone-number"
          label="Phone Number"
          variant="outlined"
          value={updatePhoneNumber}
          onChange={(e) => setUpdatePhoneNumber(e.target.value)}
          disabled={!editing}
          fullWidth
        />
        <TextField
          id="outlined-password"
          label="New Password"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={!editing}
          fullWidth
        />
        <p>{errMsg}</p>
        {editing ? (
          <div className="flex justify-center">
            <Button
              disabled={save}
              onClick={handleSave}
              variant="contained"
              color="primary"
            >
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
        {
          !isLoading ?
            <><div className="flex">
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
                    !status ? activateAccount() : setModal(true);
                  }}
                  className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                ></div>
              </label>
              {status ? (
                <p className="text-green-600">Active</p>
              ) : (
                <p className="text-red-600">Inactive</p>
              )}
            </div>
              <ReferralLink /></> :
            <Loader />
        }
      </Box>
      <div className="flex flex-col items-center ml-9 relative">
        <div className="w-40 h-40 mb-5 relative">
          <AdvancedImage cldImg={cld.image(image_url)} />
          {image_url != "test/blank-profile-picture-973460_1280_tj6oeb" && (<button
            className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            onClick={handleDelete}
          >
            <AiFillDelete />
          </button>)}
        </div>
        <CloudinaryUploader onSuccess={handleUpload} caption={"Upload New"} />
      </div>

      <ToastContainer />
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
                  e.target.value === "Deactivate"
                    ? setDisabledModal(false)
                    : setDisabledModal(true);
                }}
              />
              <div className="flex justify-around w-full">
                <button
                  onClick={() => {
                    deactivateAccount();
                    setModal(false);
                  }}
                  disabled={disabledModal}
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                >
                  Deactivate
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-150 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300"
                  onClick={() => {
                    setModal(false);
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
  );
};

export default CustomerProfile;
