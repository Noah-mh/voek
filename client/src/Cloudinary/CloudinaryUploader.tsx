import React, { useEffect, useCallback, useState } from 'react';

interface CloudinaryUploaderProps {
    onSuccess: (resultInfo: any) => void;
}

const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({ onSuccess }) => {
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
                Add Photo
            </button>

        </div>
    );
};

export default CloudinaryUploader;
