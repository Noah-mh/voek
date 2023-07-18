// import React, { useCallback, useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import axios from 'axios';

// const CloudinaryUpload: React.FC = () => {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);

//     const onDrop = useCallback((acceptedFiles: File[]) => {
//         setSelectedFile(acceptedFiles[0]);
//     }, []);

//     const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//     const handleUpload = async () => {
//         if (selectedFile) {
//             const formData = new FormData();
//             formData.append('file', selectedFile);
//             formData.append('upload_preset', 'vesexyvh');

//             try {
//                 const response = await axios.post(
//                     `https://api.cloudinary.com/v1_1/dgheg6ml5/image/upload`,
//                     formData
//                 );

//                 console.log('Successful upload', response.data);
//                 setSelectedFile(null); // clear the file input after successful upload
//             } catch (error) {
//                 console.error('Upload failed', error);
//             }
//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center bg-gray-10 p-10">
//             <div {...getRootProps()} className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-10 rounded-md space-y-3">
//                 <input {...getInputProps()} className="bg-transparent focus:outline-none" />
//                 {selectedFile ? <img src={URL.createObjectURL(selectedFile)} alt="preview" className="mt-5 w-40 h-40 object-cover rounded-lg" /> :
//                     isDragActive ?
//                         <p className="text-gray-500">Drop the files here ...</p> :
//                         <p className="text-gray-500">Drag 'n' drop some files here, or click to select files</p>
//                 }
//             </div>
//             <button type="button"
//                 className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow" onClick={handleUpload}>Upload</button>
//         </div>
//     );
// };

// export default CloudinaryUpload;
import React, { ChangeEvent } from 'react';
import axios from 'axios';

interface CloudinaryUploadProps {
    onSuccess: (resultInfo: any) => void;
    caption: string;
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({ onSuccess, caption }) => {

    const handleUpload = async (file: File | null) => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'vesexyvh');

            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/dgheg6ml5/image/upload`,
                    formData
                );
                onSuccess(response.data);
            } catch (error) {
                console.error('Upload failed', error);
            }
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        handleUpload(file);
    };

    return (
        <div className="flex flex-col items-center justify-center py-10">
            <input id="file-upload" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="hidden" />
            <label htmlFor="file-upload" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                {caption}
            </label>
        </div>
    );
};

export default CloudinaryUpload;
