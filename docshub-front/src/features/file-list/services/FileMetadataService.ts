import axios from 'axios';
import { DOWNLOAD_FILE_URL, GET_FILE_METADA } from '../../../api';
import { Buffer } from 'buffer';
import { FileMetadata } from '../../../types/FileMetadata';

const FileMetadataService = {

    get_file_metadata: async function (fileKey: string): Promise<FileMetadata> {
        return axios.get(GET_FILE_METADA(), {params: {fileName: fileKey}})
            .then(response => {
                let data: FileMetadata = {
                    albumId: response.data["album_id"],
                    fileId: response.data["file_id"],
                    fileName: response.data["file_name"],
                    fileType: response.data["file_type"],
                    fileSize: response.data["file_size"],
                    description: response.data["description"],
                    dateOfCreation: response.data["last_change_date"],
                    tags: response.data["tags"]
                }
                return data;
            })
            .catch(error => {
                console.log(error)
                return error;
            });
    },
}

export default FileMetadataService;