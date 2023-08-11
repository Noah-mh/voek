import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';
import axios from 'axios';
import { cloudName, defaultPreset } from './Cloudinary';
import useAxiosPrivateCustomer from "../hooks/useAxiosPrivateCustomer";
import useCustomer from "../hooks/UseCustomer";
interface CloudinaryUploadProps {
    onSuccess: (resultInfo: any) => void;
    caption: string;
    image_url: string;
}

const CloudinaryUploader: React.FC<CloudinaryUploadProps> = ({ onSuccess, caption, image_url }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploaded, setIsUploaded] = useState(false);
    const axiosPrivateCustomer = useAxiosPrivateCustomer();
    const { customer } = useCustomer();

    const handleUpload = useCallback(async () => {
        console.log("customer ", customer);
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('upload_preset', defaultPreset);

            try {
                if (image_url !== "test/blank-profile-picture-973460_1280_tj6oeb" && image_url !== "") {
    await axiosPrivateCustomer.delete(
        `/customer/${customer.customer_id}/deleteImage?image_url=${encodeURIComponent(image_url)}`
    );
}

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    formData
                );
                onSuccess(response.data);
                setIsUploaded(true);
            } catch (error) {
                console.error('Upload failed', error);
            }
        }
    }, [selectedFile, onSuccess]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setSelectedFile(file);
        setIsUploaded(false); // Reset the upload status whenever the file changes
    };

    useEffect(() => {
        if (selectedFile && !isUploaded) {
            handleUpload();
        }
    }, [selectedFile, handleUpload, isUploaded]);

    return (
        <div className="flex flex-col items-center justify-center py-10">
            <input id="file-upload" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="hidden" />
            <label htmlFor="file-upload" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                {caption}
            </label>
        </div>
    );
};

export default CloudinaryUploader;




