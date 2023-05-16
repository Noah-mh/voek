import React from 'react';
import CloudinaryUploader from './cloudinaryUploadTest';

const SomeComponent: React.FC = () => {
    const handleUploadSuccess = (resultInfo: any) => {
        console.log('Successfully uploaded:', resultInfo.public_id);
        
    };

    return (
        <div>
            <CloudinaryUploader onSuccess={handleUploadSuccess} />
        </div>
    );
};

export default SomeComponent;
