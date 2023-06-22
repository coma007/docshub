import { FileUploader, Collection, Image, Button, useAuthenticator } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import { S3ProviderListOutputItem } from '@aws-amplify/storage';
import { useEffect, useState } from 'react';
import { FileMetadata } from '../../../types/FileMetadata';
import FileUploadService from '../../file-upload/services/FileUploadService';
import S3Service from '../../../services/S3Service';
import FileUploadModal from "../../file-upload/components/FileUploadModal";

function FileUploadPage() {

    const [imageKeys, setImageKeys] = useState<S3ProviderListOutputItem[]>([]);
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        fetchImages();
    }, [])

    const fetchImages = async () => {
        const results = await S3Service.getAllFiles();
        setImageKeys(results);
        const s3Images = await Promise.all(
            results.map(
                async file => await S3Service.getFile(file.key!)
            )
        );
        setImages(s3Images);
    }

    const [isOpenModal, setOpenModal] = useState(false);

    const handleAddFile = () => {
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
    };

    return (
        <div>
            <Button onClick={handleAddFile}>Add file</Button>
            <FileUploadModal isOpenModal={isOpenModal} closeModal={closeModal} fetchImages={fetchImages}></FileUploadModal>

            <Collection
                items={images}
                type="grid"
                templateColumns={{
                    base: 'minimax(0, 500px)',
                    medium: 'repat(2, minimax(0, 1fr))',
                    large: 'repeat(3, minimax(0, 1fr))',
                }}
            >
                {(item, index) => (
                    <div key={index}>
                        <Image src={item} alt="" />
                    </div>
                )}
            </Collection>
        </div>
    );

}

export default FileUploadPage;
