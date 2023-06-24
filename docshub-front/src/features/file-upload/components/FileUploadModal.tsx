import { S3ProviderListOutputItem } from '@aws-amplify/storage'
import { Button, FileUploader, TextAreaField, TextField } from '@aws-amplify/ui-react'
import React, { useState } from 'react'
import Modal from "react-modal"
import S3Service from '../../../services/S3Service'
import { FileMetadata, FileMetadataWithFile } from '../../../types/FileMetadata'
import FileUploadService from '../services/FileUploadService'
import FileUploadModalCSS from "./FileUploadModal.module.css"
import { TagsInput } from "react-tag-input-component";

import {decode as base64_decode, encode as base64_encode} from 'base-64';

const FileUploadModal = (props: { isOpenModal: boolean, closeModal: any, fetchImages: any }) => {

    const [description, setDescription] = useState<string>("");
    const [imageTags, setImageTags] = useState<string[]>([])
    const [selectedFile, setSelectedFile] = useState<File>()

    const handleDescriptionChange = (event: any) => {
        setDescription(event.target.value);
    };

    const handleTagsChange = (tags: any) => {
        setImageTags(tags)
    }

    const getBase64 = (file: Blob) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const onSubmit = () => {
        const data: FileMetadataWithFile = {
            albumId: "ALBUM",
            fileSize: 123,
            fileName: "Sqwdq",
            fileType: "dqwdq",
            description: description,
            dateOfCreation: new Date(),
            tags: imageTags,
            file: "asdq"
        };
        FileUploadService.upload(data);
    }

    const onSuccess = async (event: { key: string }) => {
        let object = await S3Service.getFileMetadata(event.key);
        const data: FileMetadata = {
            albumId: "ALBUM",
            fileSize: object.size,
            fileName: object.key,
            fileType: object.contentType,
            description: description,
            dateOfCreation: new Date(object.lastModified),
            tags: imageTags
        };

        FileUploadService.upload_image(data)
            .then(async result => {
                if (result !== true) {
                    await S3Service.removeFile(data.fileName)
                }
            })
            .catch(error => {
                console.log("error:", error)
            })
        await props.fetchImages();
        props.closeModal();
    };

    Modal.setAppElement('#root')
    return (
        <Modal style={{
            content: {
                width: '70%',
                height: `83%`,
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
            <div className={FileUploadModalCSS.window}>
                                <button className={FileUploadModalCSS.close}
                    onClick={props.closeModal}
                >✖</button>
                <h2>Add file to your gallery</h2>
                <form className={FileUploadModalCSS.content}>
                    <div className={"uploader"}>
                        <input
                            // onChange={undefined}
                            accept='image/*,audio/*,video/*,text/*,application/*'                          
                        />
                    </div>
                    <div className={FileUploadModalCSS.form}>
                        <h3>Additional file information</h3>
                        <TextAreaField
                            className={FileUploadModalCSS.description}
                            label="File description [optional]:"
                            placeholder='Add description...'
                            rows={6}
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                        <p>Tags [optional]:</p>
                        <TagsInput
                            value={imageTags}
                            onChange={handleTagsChange}
                            placeHolder="Add tags..."
                        />
                        <em>press enter to add new tag</em>
                    </div>
                    <button type='submit' onClick={onSubmit}>Submit</button>
                </form>
            </div>
        </Modal>
    )
}

export default FileUploadModal