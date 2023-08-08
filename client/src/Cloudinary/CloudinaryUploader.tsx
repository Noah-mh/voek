import React, { useEffect, useCallback, useState } from 'react';
import { defaultPreset, cloudName } from './Cloudinary';
//Noah's code 
//Every getting , rendering and uploading image is done by Noah
interface CloudinaryUploaderProps {
    onSuccess: (resultInfo: any) => void;
    caption: String;
}

const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({ onSuccess, caption }) => {
    const [myWidget, setMyWidget] = useState<any>(null);
    useEffect(() => {
        if ((window as any).cloudinary) {
            setMyWidget((window as any).cloudinary.createUploadWidget({
                cloudName: cloudName,
                uploadPreset: defaultPreset,
            }, (error: any, result: any) => {
                if (!error && result && result.event === 'success') {
                    onSuccess(result.info);
                }
            }))
        }
    }, [onSuccess]);
    const handleUploadClick = useCallback(() => {
        myWidget?.open();
    }, [myWidget]);


    return (
        <div>
            <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
                onClick={handleUploadClick}>
                {caption}
            </button>
        </div>

    );
};

export default CloudinaryUploader;
