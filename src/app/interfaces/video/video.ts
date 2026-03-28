import { Commentry } from "../commentary/commentary";
import { ProfilePreview } from "../profile/preview";

export interface Video {
    id: string,
    title: string,
    description : string,
    preview: string,
    video: string,
    author: ProfilePreview,
    views: number,
    uploadDate: Date
    comments: Commentry[],
    likes: number,
    dislikes: number
}
