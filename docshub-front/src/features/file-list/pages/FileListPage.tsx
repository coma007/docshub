import { Collection, Image, Button, Card, Text } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import { S3ProviderListOutputItem } from '@aws-amplify/storage';
import { useEffect, useState } from 'react';
import S3Service from '../../../services/S3Service';
import FileUploadModal from "../../file-upload/components/FileUploadModal";

function FileListPage() {

    const [imageKeys, setImageKeys] = useState<S3ProviderListOutputItem[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [fileTypes, setFileTypes] = useState<string[]>([]);

    useEffect(() => {
        fetchImages();
    }, [])

    const fetchImages = async () => {
        const results = await S3Service.getAllFiles();
        setImageKeys(results);
        let s3Images = await Promise.all(
            results.map(
                async file => await S3Service.getFile(file.key!)
            )
        );
        let types = await Promise.all(
            results.map(
                async file => getFileType((await S3Service.getFileMetadata(file.key!)).contentType!)
            )
        )
        s3Images = s3Images.slice(1);
        types = types.slice(1);
        setImages(s3Images);
        setFileTypes(types);

    }

    const [isOpenModal, setOpenModal] = useState(false);

    const handleAddFile = () => {
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
    };

    async function getFileType(type: string): Promise<string> {
        return type.split("/")[0];
    }

    return (
        <div>
            <Button onClick={handleAddFile}>Add file</Button>
            <FileUploadModal isOpenModal={isOpenModal} closeModal={closeModal} fetchImages={fetchImages}></FileUploadModal>

            <Collection
                items={images}
                type="grid"
                templateColumns="1fr 1fr 1fr 1fr"
                columnGap="20px"
                rowGap="20px"
            >

                {(item, index) => (
                    <Card key={index} padding="0px" height="300px">
                        {fileTypes[index] === "image" &&
                            <Image src={item} height="300px" width="100%" alt="" objectFit="cover" />
                        }
                        {fileTypes[index] === "application" &&
                            <span>application</span>
                        }
                        {fileTypes[index] === "video" &&
                            <span>application</span>
                        }
                        {fileTypes[index] === "audio" &&
                            <span>application</span>
                        }
                        {fileTypes[index] === "text" &&
                            <span>application</span>
                        }
                        <a href={item}>Download</a>
                        <Text>{imageKeys[index + 1]?.key}</Text>
                    </Card>
                )}
            </Collection>
        </div>
    );

}

export default FileListPage;
