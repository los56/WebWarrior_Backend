import Post from "../dto/Post";

export interface AuthUserData {
    id: number;
    username: string;
    nickname: string;
}

export interface LoginRequestData {
    username: string;
    password: string;
}

export interface CreatePostData {
    title: string;
    contents: string;
    writer: number;
}

export interface CreateReplyData {
    contents: string;
    postId: number;
    writer?: number;
    parentId?: number;
}

export interface RegisterRequestData {
    username: string;
    password: string;
    nickname: string;
    email: string;
}

export interface PostListData {
    count: number;
    posts: Post[];
}