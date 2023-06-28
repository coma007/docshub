import axios from 'axios';
import {  UPDATE_FILE_URL } from '../../../api';
import { FileMetadata, FileMetadataWithFile } from '../../../types/FileMetadata';
import { getToken } from '../../../utils/session';

const getFileSize = (base64: string) => {
    let stringLength = base64.length;
    let sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
    let sizeInKb=sizeInBytes/1000;
    let sizeInMb=sizeInKb/1000;
    return sizeInMb;
}

const validateFile = (data: FileMetadata) => {
    if(data.albumId.trim() === ""){
        return false;
    }
    if(data.fileId.trim() === ""){
        return false;
    }
    if(data.fileName.trim() === ""){
        return false;
    }
    return true;
}

const FileUpdateService = {

    Update: async function (data: FileMetadata): Promise<boolean> {
        try {
            if(!validateFile(data))
                return false;
            const token = await getToken()
            console.log(token)
            const response = await axios.patch(UPDATE_FILE_URL(), 
            {
                body: {...data}
            },
            {
                headers: {"Authorization": "Bearer " + token}
            });
            console.log(response);
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}

export default FileUpdateService;