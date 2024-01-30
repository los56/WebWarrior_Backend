import Database from "../config/Database";
import WWError from "../types/WWError";
import Post from "../dto/Post";
import PostDAO from "./interfaces/PostDAO";
import { CreatePostData } from "../types/datas";

export default class PostDAOImpl implements PostDAO {
    async save(data: Post): Promise<Post> {
        const insertQuery = 'INSERT INTO posts(title, contents, create_date, writer) VALUES ($1, $2, NOW(), $3) RETURNING *';

        try {
            const client = await Database.getClient();
            
            const queryResult = await client.query(insertQuery, [data.title, data.contents, data.writer]);
            await client.release();

            return queryResult.rows[0];
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async getPostById(id: number): Promise<Post> {
        const getQuery = 'SELECT A.*, B.nickname FROM posts A INNER JOIN users B ON A.id = $1 AND A.writer = B.id';

        try {
            const client = await Database.getClient();

            const queryResult = await client.query(getQuery, [id]);
            await client.release();
            

            return queryResult.rows[0];
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async getCount(): Promise<number>{
        const getQuery = `SELECT COUNT(*) FROM posts`;

        try {
            const client = await Database.getClient();
            const queryResult = await client.query(getQuery);
            await client.release();

            return queryResult.rows[0].count;
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async getPostsByFilter(offset: number, count: number, order: 'ASC' | 'DESC'): Promise<Post[]> {
        const getQuery = `SELECT A.*, B.nickname FROM posts A INNER JOIN users B ON A.writer = B.id ORDER BY A.id ${order} LIMIT $1 OFFSET $2`;
        
        try {
            const client = await Database.getClient();
            const queryResult = await client.query(getQuery, [count, offset]);
            await client.release();

            return queryResult.rows;
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async getAllPosts(): Promise<Post[]> {
        const sql = `SELECT * FROM posts`;

        try {
            const client = await Database.getClient();
            const queryResult = await client.query(sql);

            await client.release();

            return queryResult.rows;
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }
    
    async deletePost(id: number, writer: number): Promise<boolean> {
        const sql = "DELETE FROM posts WHERE id = $1 AND writer = $2 RETURNING id";

        try {
            const client = await Database.getClient();
            const result = await client.query(sql, [id, writer]);

            await client.release();

            return (result.rows.length > 0)
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }
}