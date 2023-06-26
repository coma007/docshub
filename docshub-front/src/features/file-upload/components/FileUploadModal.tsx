import { S3ProviderListOutputItem } from '@aws-amplify/storage'
import { Button, FileUploader, TextAreaField, TextField } from '@aws-amplify/ui-react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Modal from "react-modal"
import S3Service from '../../../services/S3Service'
import { FileMetadata, FileMetadataWithFile } from '../../../types/FileMetadata'
import FileUploadService from '../services/FileUploadService'
import FileUploadModalCSS from "./FileUploadModal.module.css"
import { TagsInput } from "react-tag-input-component";

const FileUploadModal = (props: { isOpenModal: boolean, closeModal: any, fetchImages: any }) => {

    const [description, setDescription] = useState<string>("");
    const [imageTags, setImageTags] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [selectedFileBase64, setSelectedFileBase64] = useState<string>();

    const handleDescriptionChange = (event: any) => {
        setDescription(event.target.value);
    };

    const handleTagsChange = (tags: any) => {
        setImageTags(tags)
    }

    const onFileChanged = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files![0])
        setSelectedFile(e.target.files![0]);
    }

    useEffect(() => {
        const reader = new FileReader();

        if (selectedFile !== undefined) {
            reader.onloadend = (e) => {
                let base64 = e.target?.result as string;
                let tokens = base64.split(",");
                if (tokens.length >= 2) {
                    setSelectedFileBase64(tokens[1]);
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    }, [selectedFile]);

    const proccessData = async () => {
        // TODO validate types
        // if(selectedFile?.type){

        // }

        const data: FileMetadataWithFile = {
            albumId: "ALBUM",
            fileSize: selectedFile!.size,
            fileName: selectedFile!.name,
            fileType: selectedFile!.type,
            description: description,
            dateOfCreation: new Date(selectedFile!.lastModified),
            tags: imageTags,
            file: selectedFileBase64!
        };

        FileUploadService.upload(data)
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
    }

    const onSubmit = async () => {
        proccessData();
    }

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
                <div className={FileUploadModalCSS.content}>
                    <div>
                        <div className={FileUploadModalCSS.uploader}>
                            <input
                                type="file"
                                accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
                                onChange={(event) => { onFileChanged(event) }}
                            />
                        </div>
                        <TextField className={FileUploadModal.name}
                            placeholder='Input file name... '
                            label='File name [required]:'
                            value={selectedFile?.name} />
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
                </div>
                <Button onClick={onSubmit} className={FileUploadModalCSS.submit}>Add file</Button>
            </div>
        </Modal>
    );
}
export default FileUploadModal;