import { Collection, Image, Button, Card, Text, Heading } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import { S3ProviderListOutputItem } from '@aws-amplify/storage';
import { useEffect, useState } from 'react';
import S3Service from '../../../services/S3Service';
import FileUploadModal from "../../file-upload/components/FileUploadModal";
import FileListPageCSS from "./FileListPage.module.css"
import FileDownloadService from "../services/FileDownloadService";

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

    const downloadFile = (fileKey: string) => {
        console.log(fileKey)
        FileDownloadService.download_file(fileKey);
    }

    return (
        <div>
            <FileUploadModal isOpenModal={isOpenModal} closeModal={closeModal} fetchImages={fetchImages}></FileUploadModal>
            <div className={FileListPageCSS.content}>
                <div className={FileListPageCSS.list}>
                    <div className={FileListPageCSS.navigation}>
                        <Heading className={FileListPageCSS.title} level={5}>Album explorer</Heading>
                        <Button className={FileListPageCSS.accent} onClick={handleAddFile}>New file</Button>
                        <Button className={FileListPageCSS.space} onClick={handleAddFile}>New album</Button>
                    </div>
                    <Card key="header"
                        className={FileListPageCSS.header}>
                        <span></span>
                        <Text>title</Text>
                        <span ></span>
                    </Card>
                    <Collection
                        items={images}
                        type="list"
                        gap="5px"
                    >
                        {(item, index) => (
                            <Card key={index}
                                className={FileListPageCSS.item}>
                                <span className={FileListPageCSS.image}>
                                    {fileTypes[index] === "image" &&
                                        <Image src={item} className={FileListPageCSS.image} alt="image" />
                                    }
                                    {fileTypes[index] === "application" &&
                                        <Image src="/types/application.png" className={FileListPageCSS.image} alt="app" />
                                    }
                                    {fileTypes[index] === "video" &&
                                        <Image src="/types/video.png" className={FileListPageCSS.image} alt="vid" />
                                    }
                                    {fileTypes[index] === "audio" &&
                                        <Image src="/types/audio.png" className={FileListPageCSS.image} alt="aud" />
                                    }
                                    {fileTypes[index] === "text" &&
                                        <Image src="/types/text.png" className={FileListPageCSS.image} alt="txt" />
                                    }
                                </span>
                                <Text>{imageKeys[index + 1]?.key}</Text>
                                <button className={FileListPageCSS.buttonicon} onClick={() => downloadFile(imageKeys[index + 1]?.key!)}>
                                    <Image className={FileListPageCSS.image} alt="get" src="/actions/download.png" />
                                </button>
                                <button className={FileListPageCSS.buttonicon}>
                                    <Image className={FileListPageCSS.image} alt="del" src="/actions/delete.png" />
                                </button>
                            </Card>
                        )}
                    </Collection>
                </div>
                <div className={FileListPageCSS.details}>

                </div>
            </div>
        </div >
    );

}

export default FileListPage;
