import { Storage } from 'aws-amplify';

const S3Service = {

    getAllFiles: async function () {
        const { results } = await Storage.list("", { level: "public" });
        return results;
    },

    getFile: async function (fileId: string) {
        return await Storage.get(fileId, { level: "public" })
    },

    getFileMetadata: async function (fileId: string) {
        const { results } = await Storage.list(fileId, { level: 'public' });
        const object = results[0] as { size: number, lastModified: Date, key: string };
        let contentType = await this.getContentType(fileId);
        return { ...object, contentType };
    },

    getContentType: async function (fileId: string) {
        let contentType;
        await Storage.get(fileId, { download: true })
            .then(response => {
                contentType = response.ContentType;
            })
            .catch(error => {
                console.log('Error:', error);
            });
        return contentType;
    },

    removeFile: async function (fileId: string) {
        try {
            await Storage.remove(fileId, { level: 'public' });
            console.log('File removed successfully');
            return true;
        } catch (error) {
            console.log('Error removing file:', error);
            return false;
        }
    }
}

export default S3Service;