import axios from 'axios';
import { DELETE_ALBUM_URL, DELETE_FILE_URL } from '../../../api';
import { FileMetadata } from '../../../types/FileMetadata';

const FileDeleteService = {

    delete_image: async function (data: string): Promise<boolean> {
        try {
            const response = await axios.delete(DELETE_FILE_URL(), {data : {fileKey : data}});
            return response.status === 204;
        } catch (error) {
            return false;
        }
    },

    delete_album: async function (data: string): Promise<boolean> {
        try {
            data = data.substring(0, data.length - 1)
            const response = await axios.delete(DELETE_ALBUM_URL(), {data : {albumPath : data}});
            console.log(response)
            return response.status === 204;
        } catch (error) {
            return false;
        }
    }
}

export default FileDeleteService;