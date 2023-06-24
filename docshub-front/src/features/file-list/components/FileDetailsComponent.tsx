import { Collection, Image, Button, Card, Text, Heading } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import { S3ProviderListOutputItem } from '@aws-amplify/storage';
import { useEffect, useState } from 'react';
import S3Service from '../../../services/S3Service';
import FileUploadModal from "../../file-upload/components/FileUploadModal";
import FileDetailsComponentCSS from "./FileDetailsComponent.module.css"
import FileDownloadService from "../services/FileDownloadService";

function FileDetailsComponent(props : {selectedFile : any}) {

    return (
        <div className={FileDetailsComponentCSS.component}>
            <Image src="/types/application.png" className={FileDetailsComponentCSS.image} alt="app" />
            {/* {props.selectedFile.type === "image" &&
                <Image src={item} className={FileDetailsComponentCSS.image} alt="image" />
            }
            {fileTypes[index] === "application" &&
                <Image src="/types/application.png" className={FileDetailsComponentCSS.image} alt="app" />
            }
            {fileTypes[index] === "video" &&
                <Image src="/types/video.png" className={FileDetailsComponentCSS.image} alt="vid" />
            }
            {fileTypes[index] === "audio" &&
                <Image src="/types/audio.png" className={FileDetailsComponentCSS.image} alt="aud" />
            }
            {fileTypes[index] === "text" &&
                <Image src="/types/text.png" className={FileListPageCSS.image} alt="txt" />
            } */}
            {/* <Text>{imageKeys[index + 1]?.key}</Text> */}
            <Text className={FileDetailsComponentCSS.title}>Ime datoteke</Text>

            <div className={FileDetailsComponentCSS.details}>
                <div className={FileDetailsComponentCSS.detailItem}>
                    <Text>Datum kreiranja</Text>
                    <Text>25.05.2023.</Text>
                </div>
                <div className={FileDetailsComponentCSS.detailItem}>
                    <Text>Velicina datoteke</Text>
                    <Text>85000</Text>
                </div>
                <div className={FileDetailsComponentCSS.detailItem}>
                    <Text>Datum poslednje izmene</Text>
                    <Text>25.05.2023.</Text>
                </div>
            </div>
            <div className={FileDetailsComponentCSS.tags}>
                <Text>Tagovi</Text>
                <Text>Macici, nemacici</Text>
            </div>
            <Text className={FileDetailsComponentCSS.description}>Opis datoteke</Text>
            
        </div>
    )
}

export default FileDetailsComponent;