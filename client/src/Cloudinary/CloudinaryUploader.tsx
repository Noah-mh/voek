import React, { useEffect, useCallback, useState } from 'react';
//Noah's code 
//Every getting , rendering and uploading image is done by Noah
interface CloudinaryUploaderProps {
    onSuccess: (resultInfo: any) => void;
    caption:String;
}

const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({ onSuccess, caption }) => {
    const [myWidget, setMyWidget] = useState<any>(null);
    useEffect(() => {
        if ((window as any).cloudinary) {
            setMyWidget((window as any).cloudinary.createUploadWidget({
                cloudName: "dgheg6ml5",
                uploadPreset: "vesexyvh",
            }, (error: any, result: any) => {
                if (!error && result && result.event === 'success') {
                    onSuccess(result.info);
                }
            }))

            // You can remove this line if you don't want the widget to open automatically
        }
    }, [onSuccess]);
    const handleUploadClick = useCallback(() => {
        myWidget?.open();
    }, [myWidget]);


    return (
        <div>
            <button className="cloudinary-button" onClick={handleUploadClick}>
               {caption}
            </button>

        </div>
    );
};

export default CloudinaryUploader;
