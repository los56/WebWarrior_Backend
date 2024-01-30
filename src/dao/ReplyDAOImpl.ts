import Database from "../config/Database";
import WWError from "../types/WWError";
import Reply from "../dto/Reply";
import ReplyDAO from "./interfaces/ReplyDAO";

export default class ReplyDAOImpl implements ReplyDAO {
    async save(data: Reply): Promise<Reply> {
        const insertQuery = `INSERT INTO replies(contents, create_date, post_id, writer, parent_id) VALUES($1, NOW(), $2, $3, $4) RETURNING *`;

        try {
            const client = await Database.getClient();
            const queryResult = await client.query(insertQuery, [data.contents, data.post_id, data.writer, data.parent_id]);

            await client.release();
            
            return queryResult.rows[0];
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async getReplyByPostId(postId: number): Promise<Reply[]> {
        const getQuery = `SELECT A.*, B.nickname FROM replies A INNER JOIN users B ON A.post_id = $1 AND A.writer = B.id`;

        try {
            const client = await Database.getClient();
            const queryResult = await client.query(getQuery, [postId]);

            await client.release();

            return queryResult.rows;
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async deleteReply(replyId: number, writer: number): Promise<boolean> {
        const sql = "DELETE FROM replies WHERE id = $1 AND writer = $2 RETURNING id";

        try {
            const client = await Database.getClient();
            const result = await client.query(sql, [replyId, writer]);

            await client.release();

            return (result.rows.length > 0);
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }
}