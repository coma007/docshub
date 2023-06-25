import axios from 'axios';
import { UPLOAD_FILE_FILE_URL, UPLOAD_FILE_URL } from '../../../api';
import { FileMetadata, FileMetadataWithFile } from '../../../types/FileMetadata';

const getFileSize = (base64: string) => {
    let stringLength = base64.length;
    let sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
    let sizeInKb=sizeInBytes/1000;
    let sizeInMb=sizeInKb/1000;
    return sizeInMb;
}

const validateFile = (data: FileMetadataWithFile) => {
    if(getFileSize(data.file) > 10 || (data.fileSize/1000)/1000 > 6){
        return false;
    }

    let isRightType = ["image/", "application/", "text/", 'video/', "audio"].some(substr => data.fileType?.startsWith(substr));
    if(!isRightType)
        return false;
    return true;
}

const FileUploadService = {

    upload: async function (data: FileMetadataWithFile): Promise<boolean> {
        try {
            if(!validateFile(data))
                return false;
            const response = await axios.post(UPLOAD_FILE_FILE_URL(), 
            {
                input: JSON.stringify({
                    body: {...data}}),
                stateMachineArn: 'arn:aws:states:eu-central-1:852459778358:stateMachine:Upload',
            });
            console.log(response);
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}

export default FileUploadService;