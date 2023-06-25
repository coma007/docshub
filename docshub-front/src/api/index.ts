// const url = "http://localhost:5000/api/"
const url = "https://95dxj4ei9c.execute-api.eu-central-1.amazonaws.com/test/api/"

export const GET_FILE_METADA = (key: string) => url + "get-file-metadata/" + key;
export const UPLOAD_FILE_URL = () => url + "upload-file";
export const UPLOAD_FILE_FILE_URL = () => url + "upload";
export const DOWNLOAD_FILE_URL = () => url + "download-file";