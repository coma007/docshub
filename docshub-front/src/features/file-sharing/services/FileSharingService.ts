import axios from 'axios';
import { Buffer } from 'buffer';
import { GET_USERS_WITH_ACCESS, REMOVE_USER_ACCESS } from '../../../api';
import { FileMetadata } from '../../../types/FileMetadata';
import { Permission } from '../types/Permission';

const FileSharingService = {

    get_users_with_access: async function (fileKey: string): Promise<Permission[]> {
        return axios.get(GET_USERS_WITH_ACCESS(), { params: { fileName: fileKey } })
            .then(response => {
                return response.data
            })
            .catch(error => {
                console.log(error)
                return error;
            });
    },

    remove_permission: async function (permission: Permission): Promise<string[]> {
        return axios.delete(REMOVE_USER_ACCESS(), { data: { permission: permission } })
            .then(response => {
                console.log("aaaaaaaaaaa")
                console.log(response)
                return response.data
            })
            .catch(error => {
                console.log(error)
                return error;
            });
    },
}

export default FileSharingService;