import { S3ProviderListOutputItem } from '@aws-amplify/storage'
import { Button, FileUploader, TextAreaField, TextField } from '@aws-amplify/ui-react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Modal from "react-modal"
import S3Service from '../../../services/S3Service'
import { FileMetadata, FileMetadataWithFile } from '../../../types/FileMetadata'
import FileUpdateModalCSS from "./FileUpdateModal.module.css"
import { TagsInput } from "react-tag-input-component";
import { getCurrentSessionSub } from '../../../utils/session'
import FileUpdateService from '../services/FileUpdateService'
import FileMetadataService from '../../file-list/services/FileMetadataService'

const FileUpdateModal = (props: { selectedFile:string, isOpenModal: boolean, closeModal: any}) => {

    const [description, setDescription] = useState<string>("");
    const [imageTags, setImageTags] = useState<string[]>([]);

    const [data, setData] = useState<FileMetadata | undefined>();

    useEffect(() => {
        if (props.selectedFile !== undefined) {
            if (props.selectedFile.split("/").at(-1) != "") {
                FileMetadataService.get_file_metadata(props.selectedFile)
                    .then(response => {
                        setDescription(response.description);
                        setImageTags(response.tags);
                        setData(response);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
    }, [props.selectedFile]);

    const handleDescriptionChange = (event: any) => {
        setDescription(event.target.value);
    };

    const handleTagsChange = (tags: any) => {
        setImageTags(tags)
    }


    const proccessData = async () => {
        // TODO validate types
        // if(selectedFile?.type){

        // }
        getCurrentSessionSub().then(async result =>{
            let tmpData: any = {...data};
            tmpData.description = description;
            tmpData.tags = imageTags;
            
    
            FileUpdateService.Update(tmpData)
                .then(async result => {
                    if (result !== true) {
                        console.log(result);
                        // setSele
                    }
                })
                .catch(error => {
                    console.log("error:", error)
                })
            props.closeModal();
        }).catch(e => console.log(e));
    }

    const onSubmit = async () => {
        proccessData();
    }

    Modal.setAppElement('#root')
    return (
        <Modal style={{
            content: {
                width: '40%',
                height: `87%`,
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
            <div className={FileUpdateModalCSS.window}>
                <button className={FileUpdateModalCSS.close}
                    onClick={props.closeModal}
                >✖</button>
                <h2>Edit file</h2>
                <div className={FileUpdateModalCSS.content}>
                    <div className={FileUpdateModalCSS.form}>
                        <h3>Additional file information</h3>
                        <TextAreaField
                            className={FileUpdateModalCSS.description}
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
                <Button onClick={onSubmit} className={FileUpdateModalCSS.submit}>Update</Button>
            </div>
        </Modal>
    );
}
export default FileUpdateModal;