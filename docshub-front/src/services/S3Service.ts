import { Storage } from 'aws-amplify';
import { getCurrentSession, getCurrentSessionSub } from '../utils/session';

const S3Service = {

    getAllFiles: async function (album?: string) {
        let sub = getCurrentSessionSub()
        if (album === undefined) {
            album = "macke"
        }
        const { results } = await Storage.list(sub + "/" + album, { level: "public" });
        return this.filterResults(sub + "/" + album, results);
    },

    filterResults: function (rootPath: string, paths: any[]): any[] {
        let length = rootPath.split("/").length
        if (rootPath.split("/").at(-1) == "") {
            length -= 1;
        }
        let filterResults = paths.filter(
            item => {
                let segments = item.key.split('/');
                if (segments.at(-1) == "") {
                    segments.pop()
                }
                return this.isDirectFolder(segments, length) || this.isDirectFile(segments, length)
            })
        return filterResults
    },

    isDirectFolder: function (pathSegments: string[], length: number) {
        return pathSegments.length == length + 1
    },

    isDirectFile: function (pathSegments: string[], length: number) {
        return pathSegments.length == length
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
    },
}

export default S3Service;