import { Tag } from "./Tag";

export interface FileMetadata {
    albumId: string,
    fileId: string,
    fileName: string,
    fileType?: string,
    fileSize: number,
    description: string,
    dateOfCreation: Date,
    tags: string[]
}

export interface FileMetadataWithFile {
    albumId: string,
    fileName: string,
    fileType?: string,
    fileSize: number,
    description: string,
    dateOfCreation: Date,
    tags: string[],
    file: string
}
