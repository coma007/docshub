import axios from 'axios';
import { DELETE_ALBUM_URL, DELETE_FILE_URL } from '../../../api';
import { FileMetadata } from '../../../types/FileMetadata';
import { getToken } from '../../../utils/session';

const FileDeleteService = {

    delete_image: async function (data: string): Promise<boolean> {
        const token = await getToken()
        console.log(token)
        try {
            const response = await axios.delete(DELETE_FILE_URL(), {headers: {Authorization: "Bearer " + token}, data : {fileKey : data}});
            return response.status === 204;
        } catch (error) {
            return false;
        }
    },

    delete_album: async function (data: string): Promise<boolean> {
        const token = await getToken()
        console.log(token)
        try {
            data = data.substring(0, data.length - 1)
            const response = await axios.delete(DELETE_ALBUM_URL(), {headers: {Authorization: "Bearer " + token}, data : {albumPath : data}});
            return response.status === 204;
        } catch (error) {
            return false;
        }
    }
}

export default FileDeleteService;