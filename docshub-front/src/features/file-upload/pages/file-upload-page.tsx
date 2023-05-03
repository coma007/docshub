import { FileUploader, Collection, Image, Button, useAuthenticator } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import { S3ProviderListOutputItem } from '@aws-amplify/storage';
import { useEffect, useState } from 'react';
import { FileMetadata } from '../../../types/file-metadata';
import FileUploadService from '../services/file-upload-service';
import S3Service from '../../../services/s3-service';

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

    const onSuccess = async (event: { key: string }) => {
        let object = await S3Service.getFileMetadata(event.key);
        const data: FileMetadata = {
            albumId: "ALBUM",
            fileSize: object.size,
            fileName: object.key,
            fileType: object.contentType,
            description: '',
            dateOfCreation: new Date(object.lastModified),
            tags: []
        };

        FileUploadService.upload_image(data);
        fetchImages();
    };

    return (
        <div>
            <FileUploader
                accessLevel='public'
                acceptedFileTypes={['image/*', 'audio/*', 'video/*', 'text/*', 'application/*']}
                variation='drop'
                onSuccess={onSuccess} />
            <Collection
                items={images}
                type="grid"
                templateColumns={{
                    base: "minimax(0, 500px)",
                    medium: "repat(2, minimax(0, 1fr))",
                    large: "repeat(3, minimax(0, 1fr))"
                }}>
                {(item, index) => (
                    <div key={index}>
                        <Image src={item} alt="" />
                    </div>
                )
                }
            </Collection>
        </div>
    );
}

export default FileUploadPage;
