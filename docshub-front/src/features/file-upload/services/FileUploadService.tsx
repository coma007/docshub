import axios from 'axios';
import { UPLOAD_FILE_FILE_URL, UPLOAD_FILE_URL } from '../../../api';
import { FileMetadata, FileMetadataWithFile } from '../../../types/FileMetadata';
import { getCurrentSession, getCurrentSessionAttribbutes, getToken } from '../../../utils/session';
import { Auth, Cache, API } from 'aws-amplify';

const getFileSize = (base64: string) => {
    let stringLength = base64.length;
    let sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
    let sizeInKb=sizeInBytes/1000;
    let sizeInMb=sizeInKb/1000;
    return sizeInMb;
}

const validateFile = (data: FileMetadataWithFile) => {
    if(getFileSize(data.file) > 10 || (data.fileSize/1000)/1000 > 6){
        return false;
    }

    let isRightType = ["image/", "application/", "text/", 'video/', "audio"].some(substr => data.fileType?.startsWith(substr));
    if(!isRightType)
        return false;
    return true;
}

const FileUploadService = {

    upload: async function (data: FileMetadataWithFile): Promise<boolean> {
        try {
            if(!validateFile(data))
                return false;
            const token = await getToken()
            console.log(token)
            const response = await axios.post(UPLOAD_FILE_FILE_URL(), 
            {
                headers: {"Authorization": "Bearer " + token},
                input: JSON.stringify({
                    body: {...data}}),
                stateMachineArn: 'arn:aws:states:eu-central-1:852459778358:stateMachine:Upload',
            });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}

// axios.interceptors.request.use(
//     config => {
//       const token = getToken().then( (result) => {
//         if (result) {
//             config.headers['Authorization'] = result
//         }
//         console.log(result)
//         return config})
//     //   console.log(token)
//     //   if (token) {
//     //     config.headers!['Authorization'] = token
//     //   }
//       return config
//     },
//     error => {
//       Promise.reject(error)
//     }
//   )

// axios.interceptors.request.use(
//     async config => {
//         const token = await getToken()
//         if (token) {
//             config.headers!['Authorization'] = 'Bearer ' + token
//         }
//         console.log(token)
//         return config
//     },
//     error => {
//         Promise.reject(error)
//     }
// )

export default FileUploadService;