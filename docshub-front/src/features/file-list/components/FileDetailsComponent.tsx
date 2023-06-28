import { Collection, Image, Button, Card, Text, Heading } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import { S3ProviderListOutputItem } from '@aws-amplify/storage';
import { useEffect, useState } from 'react';
import S3Service from '../../../services/S3Service';
import FileUploadModal from "../../file-upload/components/FileUploadModal";
import FileDetailsComponentCSS from "./FileDetailsComponent.module.css"
import FileDownloadService from "../services/FileDownloadService";
import FileMetadataService from "../services/FileMetadataService";
import { FileMetadata } from "../../../types/FileMetadata";
import { formatDateTime, formatFileSize } from "../../../utils/fomaters";

function FileDetailsComponent(props: { selectedFile: string | undefined, selectedImage: string | undefined }) {

    const [data, setData] = useState<FileMetadata | undefined>();

    useEffect(() => {
        if (props.selectedFile !== undefined) {
            if (props.selectedFile.split("/").at(-1) != "") {
                FileMetadataService.get_file_metadata(props.selectedFile)
                    .then(response => {
                        setData(response);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
    }, [props.selectedFile]);

    return (
        <div className={FileDetailsComponentCSS.component}>
            {(props.selectedFile !== undefined && data?.fileId !== undefined) ?
                <div>

                    {data?.fileType?.includes("image") &&
                        <Image src={props.selectedImage} className={FileDetailsComponentCSS.image} alt="image" />
                    }
                    {data?.fileType?.includes("application") &&
                        <Image src="/types/application.png" alt="app" />
                    }
                    {data?.fileType?.includes("video") &&
                        <Image src="/types/video.png" alt="vid" />
                    }
                    {data?.fileType?.includes("audio") &&
                        <Image src="/types/audio.png" alt="aud" />
                    }
                    {data?.fileType?.includes("text") &&
                        <Image src="/types/text.png" alt="txt" />
                    }

                    <Text className={FileDetailsComponentCSS.title}>
                        {data?.fileName}</Text>
                    <div className={FileDetailsComponentCSS.tags}>
                        {data?.tags?.map((item, index) => (
                            <span className={FileDetailsComponentCSS.tag} key={index}>{item}</span>
                        ))}
                    </div>
                    <div className={FileDetailsComponentCSS.details}>
                        <div className={FileDetailsComponentCSS.detailItem}>
                            <Text className={FileDetailsComponentCSS.label}>Last modified</Text>
                            <Text>{formatDateTime(data?.dateOfCreation?.toString()!)}</Text>
                        </div>
                        <div className={FileDetailsComponentCSS.detailItem}>
                            <Text className={FileDetailsComponentCSS.label}>Content type</Text>
                            <Text>{data?.fileType!}</Text>
                        </div>
                        <div className={FileDetailsComponentCSS.detailItem}>
                            <Text className={FileDetailsComponentCSS.label}>Size</Text>
                            <Text>{formatFileSize(data?.fileSize!)}</Text>
                        </div>
                    </div>
                    <Text className={FileDetailsComponentCSS.description}>
                        <div className={FileDetailsComponentCSS.label}>Description</div>
                        <div>{data?.description!}</div>
                    </Text>
                </div>
                :
                <div className={FileDetailsComponentCSS.nofile}>No file selected</div>
            }
        </div >
    )
}

export default FileDetailsComponent;