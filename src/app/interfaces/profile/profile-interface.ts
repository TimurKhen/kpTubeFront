export interface ProfileInterface {
    id: number
    User_ID: string,
    avatar: string, 
    header: string, 
    username: string,
    subscribers: number,
    videos: string,
    history: string[],
    isEmailVerified: boolean,
    liked: {},
    name: string
}