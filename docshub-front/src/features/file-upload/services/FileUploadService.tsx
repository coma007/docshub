import axios from 'axios';
import { UPLOAD_FILE_FILE_URL, UPLOAD_FILE_URL } from '../../../api';
import { FileMetadata, FileMetadataWithFile } from '../../../types/FileMetadata';

const FileUploadService = {

    upload: async function (data: FileMetadataWithFile): Promise<boolean> {
        try {
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