// const url = "http://localhost:5000/api/"
const url = "https://95dxj4ei9c.execute-api.eu-central-1.amazonaws.com/test/api/"

export const GET_FILE_METADA = () => url + "get-file-metadata";
export const UPLOAD_FILE_URL = () => url + "upload-file";
export const UPLOAD_FILE_FILE_URL = () => url + "upload";
export const CREATE_ALBUM_URL = () => url + "create-album";
export const DELETE_FILE_URL = () => url + "delete-file";
export const DELETE_ALBUM_URL = () => url + "delete-album";
export const DOWNLOAD_FILE_URL = () => url + "download-file";
export const GET_USERS_WITH_ACCESS = () => url + "get-users-with-access";
export const UPDATE_FILE_URL = () => url + "update";
export const REMOVE_USER_ACCESS = () => url + "remove-user-access";
