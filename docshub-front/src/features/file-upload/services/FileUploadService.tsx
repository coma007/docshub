import axios from 'axios';
import { upload_url } from '../../../api';
import { FileMetadata } from '../../../types/FileMetadata';

const FileUploadService = {

    upload_image: function (data: FileMetadata): Promise<boolean> {
        return axios.post(upload_url, data)
            .then(response => {
                return response.status === 200;
            })
            .catch(error => {
                return false;
            });
    }
}

export default FileUploadService;