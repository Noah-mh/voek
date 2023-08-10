import React, { useState, useCallback, ChangeEvent } from 'react';
import axios from 'axios';
import { cloudName, defaultPreset } from './Cloudinary';
interface CloudinaryUploadProps {
    onSuccess: (resultInfo: any) => void;
    caption: string;
}

const CloudinaryMultipleUploader: React.FC<CloudinaryUploadProps> = ({ onSuccess, caption }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploaded, setIsUploaded] = useState<boolean[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleUpload = useCallback(async () => {
        const responses = await Promise.all(selectedFiles.map(file => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', defaultPreset);

            return axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData
            );
        }));

        const data = responses.map(response => response.data);
        onSuccess(data);
        setIsUploaded(new Array(selectedFiles.length).fill(true));

    }, [selectedFiles, onSuccess]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files ? Array.from(event.target.files) : [];
        const updatedFiles = [...selectedFiles, ...newFiles];
        setSelectedFiles(updatedFiles);

        const newIsUploadedStatus = new Array(newFiles.length).fill(false);
        setIsUploaded([...isUploaded, ...newIsUploadedStatus]);

        const newUrls = newFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls([...previewUrls, ...newUrls]);
    };


    return (
        <div className="flex flex-col items-center justify-center py-10">
            {selectedFiles.length > 0 && !isUploaded.every(val => val) && (
                <>
                    {previewUrls.map((url, index) => (
                        <img key={index} src={url} alt="Preview" className="mb-2 w-40 h-40 object-cover rounded" />
                    ))}
                    <button
                        type="button"
                        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        onClick={handleUpload}
                    >
                        Upload
                    </button>
                    <button
                        type="button"
                        className="mt-4 ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        onClick={() => { setSelectedFiles([]); setIsUploaded([]); setPreviewUrls([]); }}
                    >
                        Clear All
                    </button>
                </>
            )}
            <label htmlFor="file-upload" className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                {caption}
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

    );
};

export default CloudinaryMultipleUploader;
