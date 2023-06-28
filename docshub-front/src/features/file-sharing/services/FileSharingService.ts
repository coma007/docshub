import axios from 'axios';
import { Buffer } from 'buffer';
import { ADD_USER_ACCESS, GET_USERS_WITH_ACCESS, GET_USER_ACCESS, REMOVE_USER_ACCESS } from '../../../api';
import { FileMetadata } from '../../../types/FileMetadata';
import { Permission } from '../types/Permission';
import { getToken } from '../../../utils/session';

const FileSharingService = {

    get_users_with_access: async function (fileKey: string): Promise<Permission[]> {
        const token = await getToken()
        console.log(token)
        return axios.get(GET_USERS_WITH_ACCESS(), {headers: {"Authorization": "Bearer " + token}, params: { fileName: fileKey } })
            .then(response => {
                return response.data
            })
            .catch(error => {
                console.log(error)
                return error;
            });
    },

    add_permission: async function (users: string[], fileKey: string): Promise<string[]> {
        const token = await getToken()
        console.log(token)
        return axios.post(ADD_USER_ACCESS(),  {users: users, fileKey: fileKey }, {headers: {"Authorization": "Bearer " + token}})
            .then(response => {
                return response.data
            })
            .catch(error => {
                console.log(error)
                return error;
            });
    },

    remove_permission: async function (permission: Permission): Promise<string[]> {
        const token = await getToken()
        console.log(token)
        return axios.delete(REMOVE_USER_ACCESS(), {headers: {"Authorization": "Bearer " + token}, data: { permission: permission } })
            .then(response => {
                return response.data
            })
            .catch(error => {
                console.log(error)
                return error;
            });
    },

    get_user_permissions: async function (username: string): Promise<Permission[]> {
        console.log(username)
        const token = await getToken()
        console.log(token)
        return axios.get(GET_USER_ACCESS(), {headers: {"Authorization": "Bearer " + token}, params: { username: username } })
            .then(response => {
                return response.data
            })
            .catch(error => {
                console.log(error)
                return error;
            });
    },
}

export default FileSharingService;