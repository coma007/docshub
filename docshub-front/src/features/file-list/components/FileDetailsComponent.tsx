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

function FileDetailsComponent(props: { selectedFile: string | undefined, selectedImage: string | undefined }) {

    const [data, setData] = useState<FileMetadata | undefined>();

    useEffect(() => {
        if (props.selectedFile !== undefined) {
            FileMetadataService.get_file_metadata(props.selectedFile)
                .then(response => {
                    setData(response);
                    console.log(data)
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [props.selectedFile]);

    return (
        <div className={FileDetailsComponentCSS.component}>
            {props.selectedFile !== undefined ?
                <div>
                    
                    {data?.fileType?.includes("image") &&
                        <Image src={props.selectedImage} className={FileDetailsComponentCSS.image} alt="image" />
                    }
                    {data?.fileType?.includes("application") &&
                        <Image src="/types/application.png" className={FileDetailsComponentCSS.image} alt="app" />
                    }
                    {data?.fileType?.includes("video") &&
                        <Image src="/types/video.png" className={FileDetailsComponentCSS.image} alt="vid" />
                    }
                    {data?.fileType?.includes("audio") &&
                        <Image src="/types/audio.png" className={FileDetailsComponentCSS.image} alt="aud" />
                    }
                    {data?.fileType?.includes("text") &&
                        <Image src="/types/text.png" className={FileDetailsComponentCSS.image} alt="txt" />
                    }

                    <Text className={FileDetailsComponentCSS.title}>
                        {data?.fileName}</Text>
                    <div className={FileDetailsComponentCSS.tags}>
                        {data?.tags.map((item, index) => (
                            <span className={FileDetailsComponentCSS.tag} key={index}>{item}</span>
                        ))}
                    </div>
                    <div className={FileDetailsComponentCSS.details}>
                        <div className={FileDetailsComponentCSS.detailItem}>
                            <Text>Last modified</Text>
                            <Text>{data?.dateOfCreation.toString()}</Text>
                        </div>
                        <div className={FileDetailsComponentCSS.detailItem}>
                            <Text>Content type</Text>
                            <Text>{data?.fileType}</Text>
                        </div>
                    </div>
                    <Text className={FileDetailsComponentCSS.description}>Opis datoteke</Text>
                </div>
                :
                <div className={FileDetailsComponentCSS.nofile}>No file selected</div>
            }
        </div>
    )
}

export default FileDetailsComponent;