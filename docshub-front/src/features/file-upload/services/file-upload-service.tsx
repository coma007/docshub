import axios from 'axios';
import { upload_url } from '../../../api';
import { FileMetadata } from '../../../types/file-metadata';

const FileUploadService = {

    upload_image: function (data: FileMetadata) {
        axios.post(upload_url, data)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }
}

export default FileUploadService;