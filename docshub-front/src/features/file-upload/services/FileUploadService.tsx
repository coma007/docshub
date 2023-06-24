import axios from 'axios';
import { UPLOAD_FILE_URL, UPLOAD_FILE_WITH_FILE_URL } from '../../../api';
import { FileMetadata, FileMetadataWithFile } from '../../../types/FileMetadata';

const FileUploadService = {

    upload_image: async function (data: FileMetadata): Promise<boolean> {
        try {
            const response = await axios.post(UPLOAD_FILE_URL(), data);
            return response.status === 200;
        } catch (error) {
            return false;
        }
    },

    upload: async function(data: FileMetadataWithFile): Promise<boolean>{
        try {
            const response = await axios.post(UPLOAD_FILE_WITH_FILE_URL(), data);
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}

export default FileUploadService;