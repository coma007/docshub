import axios from 'axios';
import { CREATE_ALBUM_URL, UPLOAD_FILE_FILE_URL, UPLOAD_FILE_URL } from '../../../api';
import { FileMetadata, FileMetadataWithFile } from '../../../types/FileMetadata';
import { AlbumMetadata } from '../../../types/AlbumMetadata';
import { getToken } from '../../../utils/session';

const AlbumCreateService = {

    create: async function (data: AlbumMetadata): Promise<boolean> {
        const token = await getToken()
        console.log(token)
        try {
            const response = await axios.post(CREATE_ALBUM_URL(), {headers: {"Authorization": "Bearer " + token},
                data});
            console.log(response);
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}

export default AlbumCreateService;