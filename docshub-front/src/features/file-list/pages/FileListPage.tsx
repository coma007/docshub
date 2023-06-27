import { Collection, Image, Button, Card, Text, Heading } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import { S3ProviderListOutputItem } from '@aws-amplify/storage';
import { useEffect, useState } from 'react';
import S3Service from '../../../services/S3Service';
import FileUploadModal from "../../file-upload/components/FileUploadModal";
import FileListPageCSS from "./FileListPage.module.css"
import FileDownloadService from "../services/FileDownloadService";
import FileDetailsComponent from "../components/FileDetailsComponent";
import FileDeleteService from "../services/FileDeleteService";
import AlbumCreateModal from "../../album-create/components/AlbumCreateModal";
import { AlbumMetadata } from "../../../types/AlbumMetadata"
import { getCurrentSessionSub } from "../../../utils/session";
import FileSharingModal from "../../file-sharing/components/FileSharingModal";

function FileListPage(props: { option: string }) {

    const [imageKeys, setImageKeys] = useState<S3ProviderListOutputItem[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [fileTypes, setFileTypes] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined);
    const [selectedImageSrc, setSelectedImageSrc] = useState<string | undefined>(undefined);

    const [albumStack, setAlbumStack] = useState<AlbumMetadata[]>();

    useEffect(() => {
        const setAlbum = async () => {
            if (albumStack === undefined) {
                let currentSub = await getCurrentSessionSub();
                let album: AlbumMetadata = {
                    albumId: currentSub + "/",
                    albumName: "root",
                    parentAlbumId: undefined
                }
                setAlbumStack([album]);
            }
        };
        setAlbum();
    }, [])

    useEffect(() => {
        if (albumStack !== undefined) {
            fetchImages();
        }
    }, [albumStack])

    const fetchImages = async () => {
        const results = await S3Service.getAllFiles(albumStack?.at(-1)?.albumId);
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

    const [isOpenFileUploadModal, setOpenFileUploadModal] = useState(false);
    const [isOpenAlbumCreateModal, setOpenAlbumCreateModal] = useState(false);
    const [isOpenFileShareModal, setOpenFileShareModal] = useState(false);

    const handleAddFile = () => {
        setOpenFileUploadModal(true);
    };

    const closeFileUploadModal = () => {
        setOpenFileUploadModal(false);
    };

    const handleAlbumCreate = () => {
        setOpenAlbumCreateModal(true);
    };

    const closeAlbumCreateModal = () => {
        setOpenAlbumCreateModal(false);
        fetchImages()
    };

    const handleFileShareModal = () => {
        setOpenFileShareModal(true);
    };

    const closeFileShareModal = () => {
        setOpenFileShareModal(false);
    };


    function handleItemClick(index: number, item: string) {
        if (fileTypes[index] === "directory") {
            let album: AlbumMetadata = {
                albumId: imageKeys[index + 1].key!,
                albumName: getFileName(getFileName(imageKeys[index + 1]?.key!)),
                parentAlbumId: albumStack?.at(-1)?.albumId
            }
            setAlbumStack([...albumStack!, album])
        }
        setSelectedFile(imageKeys[index + 1].key);
        setSelectedImageSrc(item);
    }

    function exitAlbum() {
        setAlbumStack(albumStack?.slice(0, -1))
    }

    function getFileType(type: string): string {
        if (type.split("/")[1].includes("directory")) {
            return "directory"
        }
        return type.split("/")[0];
    }

    const getFileName = (filePath: string): string => {
        if (filePath === undefined) {
            return ""
        }
        let segments = filePath.split("/")
        if (segments.at(-1) == "") {
            segments.pop()
        }
        return segments.at(-1)!
    }

    const downloadFile = (fileKey: string) => {
        FileDownloadService.download_file(fileKey);
    }

    const deleteFile = (fileKey: string) => {
        FileDeleteService.delete_image(fileKey);
    }

    return (
        <div>
            {props.option == "owned" &&
                <>
                    <FileUploadModal
                        isOpenModal={isOpenFileUploadModal}
                        closeModal={closeFileUploadModal}
                        fetchImages={fetchImages}></FileUploadModal>
                    <AlbumCreateModal
                        isOpenModal={isOpenAlbumCreateModal}
                        closeModal={closeAlbumCreateModal}
                        currentAlbumId={albumStack?.at(-1)?.albumId}></AlbumCreateModal>
                    <FileSharingModal
                        isOpenModal={isOpenFileShareModal}
                        closeModal={closeFileShareModal}
                        selectedFile={selectedFile}></FileSharingModal>
                </>
            }
            <div className={FileListPageCSS.content}>
                <div className={FileListPageCSS.list}>
                    <div className={FileListPageCSS.navigation}>
                        <Heading className={FileListPageCSS.title} level={5}>
                            Album explorer
                            <span className={FileListPageCSS.currentAlbum}>
                                {" ~ " + albumStack?.at(-1)?.albumName}
                            </span>
                            {albumStack?.at(-1)?.parentAlbumId != null &&
                                <button className={FileListPageCSS.buttonicon} onClick={() => exitAlbum()}>
                                    <Image className={FileListPageCSS.image} alt="bck" src="/actions/back.png" />
                                </button>
                            }
                        </Heading>
                        {props.option == "owned" && <>
                            <Button className={FileListPageCSS.accent} onClick={handleAddFile}>New file</Button>
                            <Button className={FileListPageCSS.space} onClick={handleAlbumCreate}>New album</Button>
                        </>
                        }
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
                            <Card key={index} onClick={() => {
                                handleItemClick(index, item);
                            }}
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
                                    {fileTypes[index] === "directory" &&
                                        <Image src="/types/directory.png" className={FileListPageCSS.image} alt="dir" />
                                    }
                                </span>

                                <Text>{getFileName(imageKeys[index + 1]?.key!)}</Text>
                                {props.option != "owned" && <><div></div><div></div></>}
                                {fileTypes[index] != "directory" ?
                                    <button className={FileListPageCSS.buttonicon} onClick={() => downloadFile(imageKeys[index + 1]?.key!)}>
                                        <Image className={FileListPageCSS.image} alt="get" src="/actions/download.png" />
                                    </button>
                                    :
                                    <div></div>
                                }
                                {props.option == "owned" && <>
                                    <button className={FileListPageCSS.buttonicon} onClick={handleFileShareModal}>
                                        <Image className={FileListPageCSS.image} alt="shr" src="/actions/share.png" />
                                    </button>
                                    <button className={FileListPageCSS.buttonicon} onClick={() => deleteFile(imageKeys[index + 1]?.key!)}>
                                        <Image className={FileListPageCSS.image} alt="del" src="/actions/delete.png" />
                                    </button>
                                </>
                                }
                            </Card>
                        )}
                    </Collection>
                </div>
                <div className={FileListPageCSS.details}>
                    <FileDetailsComponent selectedFile={selectedFile} selectedImage={selectedImageSrc} />
                </div>
            </div>
        </div >
    );

}

export default FileListPage;
