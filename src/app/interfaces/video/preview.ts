import { ProfilePreview } from "../profile/preview";

export interface VideoPreview {
    id: string,
    title: string,
    preview: string,
    // videoPreview: string,
    author: ProfilePreview,
    views: number,
    uploadDate: Date
}
