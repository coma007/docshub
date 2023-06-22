import { Tag } from "./Tag";

export interface FileMetadata {
    albumId: string,
    fileName: string,
    fileType?: string,
    fileSize: number,
    description: string,
    dateOfCreation: Date,
    tags: string[]
}