import React, { useState } from 'react';
import CloudinaryUploader from "../../Cloudinary/CloudinaryUploader";
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../../Cloudinary/Cloudinary';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string, image_url: string) => void;
}

const ModalComponent: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [image_url, setImage_url] = useState<string>("");
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
    const handleUploadSuccess = (resultInfo: any) => {
        console.log('Successfully uploaded:', resultInfo.public_id);
        setImage_url(resultInfo.public_id);
        setUploadedImageUrl(resultInfo.public_id);
    };

    const handleSubmit = () => {
        onSubmit(rating, comment, image_url);
        onClose();
        setComment("");
        setRating(0);
        setImage_url("");
    };

    if (!isOpen) {
        return null;
    }

    const handleRatingChange = (rating: number) => {
        setRating(rating);
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
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
                <div className='flex justify-center border-2 border-dashed p-2'>
                    <CloudinaryUploader onSuccess={handleUploadSuccess} caption = {"Add Photo"}/>
                    {uploadedImageUrl && <div className="w-20 h-20"> <AdvancedImage cldImg={cld.image(uploadedImageUrl)} /></div>}
                </div>
                <div className="flex justify-between mt-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md transition-colors duration-300" onClick={handleSubmit}>Submit</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md transition-colors duration-300" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );


};

export default ModalComponent;
