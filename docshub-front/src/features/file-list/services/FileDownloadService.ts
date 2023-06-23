import axios from 'axios';
import { DOWNLOAD_FILE_URL } from '../../../api';
import { Buffer } from 'buffer';

const FileDownloadService = {

    download_file: async function (fileKey: string): Promise<boolean> {
        return axios.post(DOWNLOAD_FILE_URL(), { fileKey: fileKey })
            .then(response => {
                const data = response.data.body
                const contentType = response.data["headers"]["Content-Type"]
                this.handle_download(fileKey, data, contentType)
                return response.status === 200;
            })
            .catch(error => {
                console.log(error)
                return false;
            });
    },

    handle_download: function (filename: string, data: any, contentType: string) {
        const file = Buffer.from(data, "base64");
        const blob = new Blob([file], { type: contentType });
        const urlObject = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = urlObject;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(urlObject);
    }
}

export default FileDownloadService;