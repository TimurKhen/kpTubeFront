import { ProfilePreview } from "../profile/preview";

export interface Commentry {
    author: ProfilePreview,
    content: string,
    publishDate: Date
}
