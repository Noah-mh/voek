import React, { useState } from 'react';
import CloudinaryUploader from "../../Cloudinary/CloudinaryUploader";
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../../Cloudinary/Cloudinary';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    const [image_urls, setImage_urls] = useState<string[]>([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
    const handleUploadSuccess = (resultInfo: any) => {
        const imageUrl = resultInfo.public_id;
        setImage_urls(previousImageUrls => [...previousImageUrls, imageUrl]);
        setUploadedImageUrls(previousImageUrls => [...previousImageUrls, imageUrl]);
    };

    const [error, setError] = useState({
        rating: false,
        comment: false
    });

    const handleSubmit = () => {
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
        onSubmit(orders_product_id, customer_id, rating, comment, image_urls);
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
        onClose();
        setComment("");
        setRating(0);
        setImage_urls([]);
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

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300">
            <div className="bg-white p-5 rounded-md w-72">
                <h2 className="text-center">Rate the product</h2>
                <div className="flex justify-center cursor-pointer mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} onClick={() => handleRatingChange(star)} className={`text-xl mx-1 ${star <= rating ? 'text-yellow-500' : ''}`}>
                            {star <= rating ? '★' : '☆'}
                        </span>
                    ))}
                </div>
                <textarea className="w-full p-2 mt-2 rounded-md" onChange={handleCommentChange} value={comment} placeholder="Leave your comment" />
                <div className="flex flex-col items-center border-2 border-dashed p-2">
                    <CloudinaryUploader onSuccess={handleUploadSuccess} caption={"Add Photo"} />
                    {uploadedImageUrls && uploadedImageUrls.map(uploadedImageUrl => (
                        <div className="w-20 h-20">
                            <AdvancedImage cldImg={cld.image(uploadedImageUrl)} />
                        </div>
                    ))}
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
