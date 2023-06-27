import { S3ProviderListOutputItem } from '@aws-amplify/storage'
import { Button, FileUploader, TextAreaField, TextField } from '@aws-amplify/ui-react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Modal from "react-modal"
import S3Service from '../../../services/S3Service'
import { FileMetadata, FileMetadataWithFile } from '../../../types/FileMetadata'
import FileUploadService from '../services/AlbumCreateService'
import AlbumCreateModalCSS from "./AlbumCreateModal.module.css"
import { TagsInput } from "react-tag-input-component";
import { AlbumMetadata } from '../../../types/AlbumMetadata'
import AlbumCreateService from '../services/AlbumCreateService'

const AlbumCreateModal = (props: { isOpenModal: boolean, closeModal: any, fetchImages: any }) => {

    const [albumName, setAlbumName] = useState<string>("");
    
    const handleNameChange = (event: any) => {
        setAlbumName(event.target.value);
    };

    const proccessData = async () => {
        // TODO validate types
        // if(selectedFile?.type){

        // }

        const data: AlbumMetadata = {
            albumId: albumName,
            parentAlbumId: "ALBUM",
            albumName: albumName,
        };

        AlbumCreateService.create(data)
            .catch(error => {
                console.log("error:", error)
            })
        props.closeModal();
    }

    const onSubmit = async () => {
        proccessData();
    }

    Modal.setAppElement('#root')
    return (
        <Modal style={{
            content: {
                width: '43%',
                height: `42%`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '10px',
            },
            overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }
        }}
            isOpen={props.isOpenModal}
            onRequestClose={props.closeModal}
        >
            <div className={AlbumCreateModalCSS.window}>
                <button className={AlbumCreateModalCSS.close}
                    onClick={props.closeModal}
                >✖</button>
                <h2>Create album in your gallery</h2>
                <div className={AlbumCreateModalCSS.content}>
                    <div>
                        <TextField className={AlbumCreateModal.name}
                            placeholder='Input album name... '
                            label='Album name [required]:'
                            onChange={handleNameChange}
                            value={albumName} />
                    </div>
                </div>
                <Button onClick={onSubmit} className={AlbumCreateModalCSS.submit}>Add album</Button>
            </div>
        </Modal>
    );
}
export default AlbumCreateModal;