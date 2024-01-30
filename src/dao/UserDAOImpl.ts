import Database from "../config/Database";
import User from "../dto/User";
import WWError from "../types/WWError";
import UserDAO from "./interfaces/UserDAO";

//Do not return QueryResult, Do not check something (Check logic => Service, Frontend)
//Must declare return type
//Models return only Legacy types and Plain objects
export default class UserDAOImpl implements UserDAO {
    async save(data: User): Promise<User> {
        const insertSql = `INSERT INTO users(username, password, nickname, email, create_date, password_change_date) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`;

        try {
            const client = await Database.getClient();

            // if same username, nickname, email in db, this query failed
            const insertResult = await client.query(insertSql, [data.username, data.password, data.nickname, data.email]);
            await client.release();

            return insertResult.rows[0];
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }

    async getUserByUsername(username: string): Promise<User>{
        const sql = 'SELECT * FROM users WHERE LOWER(username) = LOWER($1)';

        try {
            const client = await Database.getClient();
            const result = await client.query(sql, [username]);
            await client.release();

            return result.rows[0];
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }

    async getUserByNickname(nickname: string): Promise<User> {
        const sql = 'SELECT * FROM users WHERE LOWER(nickname) = LOWER($1)';

        try {
            const client = await Database.getClient();
            const result = await client.query(sql, [nickname]);
            await client.release();
    
            return result.rows[0];
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        const sql = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';

        try {
            const client = await Database.getClient();
            const result = await client.query(sql, [email]);
            await client.release();
    
            return result.rows[0];
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async updateLastLogin(userId: number): Promise<string> {
        const sql = 'UPDATE users SET last_login = NOW() WHERE id = $1 RETURNING last_login';

        try {
            const client = await Database.getClient();
            const result = await client.query(sql, [userId]);
            await client.release();

            return result.rows[0];
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }
}
