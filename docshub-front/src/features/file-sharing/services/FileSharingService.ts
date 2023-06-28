import axios from 'axios';
import { Buffer } from 'buffer';
import { GET_USERS_WITH_ACCESS } from '../../../api';
import { FileMetadata } from '../../../types/FileMetadata';

const FileSharingService = {

    get_users_with_access: async function (fileKey: string): Promise<any> {
        console.log("usao")
        return axios.get(GET_USERS_WITH_ACCESS(), { params: { fileName: fileKey } })
            .then(response => {
                return response
            })
            .catch(error => {
                console.log(error)
                return error;
            });
    },
}

export default FileSharingService;