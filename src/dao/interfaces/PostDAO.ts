import Post from "../../dto/Post";

export default interface PostDAO {
    save(post: Post): Promise<Post>;
    getPostById(id: number): Promise<Post>;
    getCount(): Promise<number>;
    getPostsByFilter(offset: number, count: number, order: 'ASC' | 'DESC'): Promise<Post[]>;
    deletePost(id: number, writer: number): Promise<boolean>;
}