import React, { ChangeEvent, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cloudName, defaultPreset } from '../../Cloudinary/Cloudinary';
import axios from 'axios';
import { RiDeleteBin5Fill } from "react-icons/ri";
//Noah's code
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (orders_product_id: number | undefined, customer_id: number, rating: number, comment: string, image_urls: string[]) => void;
    orders_product_id: number | undefined;
    customer_id: number;
}


const ModalComponent: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, orders_product_id, customer_id }) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        setFilesToUpload(prevFiles => [...prevFiles, ...files]);
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prevUrls => [...prevUrls, ...urls]);
    };

    const [error, setError] = useState({
        rating: false,
        comment: false
    });

    const handleSubmit = async () => {
        const hasError = !rating || !comment;
        if (hasError) {
            setError({
                rating: !rating,
                comment: !comment
            });
            console.log(error);
            toast.error("Error! Cannot add rating", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        const responses = await Promise.all(filesToUpload.map(file => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', defaultPreset);

            return axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData
            );
        }));

        const uploadedImageUrls = responses.map(response => response.data.public_id);

        onSubmit(orders_product_id, customer_id, rating, comment, uploadedImageUrls);

        // Clearing states
        onClose();
        setComment("");
        setRating(0);
        setFilesToUpload([]);
        setPreviewUrls([]);

        toast.success("Rating success", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

    };


    if (!isOpen) {
        return null;
    }

    const handleRatingChange = (rating: number) => {
        setRating(rating);
        setError({
            ...error,
            rating: rating === 0 // Set error true if rating is 0
        });
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
        setError({
            ...error,
            [event.target.name]: !event.target.value
        });
    };

    const handleDelete = (indexToDelete: number) => {
        // Remove the selected file based on its index
        setFilesToUpload(prevFiles => prevFiles.filter((_, index) => index !== indexToDelete));

        // Remove the preview URL based on its index
        setPreviewUrls(prevUrls => prevUrls.filter((_, index) => index !== indexToDelete));
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 transition-all duration-300">
            <div className="bg-white p-5 rounded-md min-w-96! w-auto z-20">
                <h2 className="text-center">Rate the product</h2>
                <div className="flex justify-center cursor-pointer mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} onClick={() => handleRatingChange(star)} className={`text-xl mx-1 ${star <= rating ? 'text-yellow-500' : ''}`}>
                            {star <= rating ? '★' : '☆'}
                        </span>
                    ))}
                </div>
                <textarea className="w-full p-2 mt-2 rounded-md" onChange={handleCommentChange} value={comment} placeholder="Leave your comment" />
                <div className="flex flex-col items-center border-2 border-dashed p-2 mt-4">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex justify-center mt-4">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="relative m-2">
                                    <img src={url} alt="Preview" className="w-40 h-40 object-cover rounded" />
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        <RiDeleteBin5Fill />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <label htmlFor="file-upload" className="mt-6 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                            Add Photo
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                            className="hidden"
                            multiple
                        />

                    </div>
                </div>
                <div className="flex justify-between mt-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md transition-colors duration-300" onClick={handleSubmit}>Submit</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md transition-colors duration-300" onClick={onClose}>Close</button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );


};

export default ModalComponent;
