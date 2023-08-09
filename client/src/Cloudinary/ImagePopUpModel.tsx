import React from 'react';
import { cld } from './Cloudinary';
import { AdvancedImage } from '@cloudinary/react';
//Noah's code
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    image_url: string;
}


const ImagePopUpModel: React.FC<ModalProps> = ({ isOpen, onClose, image_url }) => {

    if (!isOpen) {
        return null;
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 transition-all duration-300" onClick={onClose}>
            <div className="relative bg-white p-3 rounded-md z-20">
                <AdvancedImage cldImg={cld.image(image_url)} className="w-[1000px] h-[600px] object-fit" />
            </div>

        </div>
    );
};

export default ImagePopUpModel;
