import Database from "../config/Database";
import {ErrorCode, RegisterRequestPayload, User} from "../types/types";
import * as bcrypt from 'bcrypt';
import WWError from "../types/WWError";

//Do not return QueryResult, Do not check something (Check logic => Service, Frontend)
//Must declare return type
//Models return only Legacy types and Plain objects
export class UserModel {
    async addUser(payload: RegisterRequestPayload): Promise<User|undefined> {
        try {
            const client = await Database.getClient();

            // if same username, nickname, email in db, this query failed
            const insertSql = `INSERT INTO users(username, password, nickname, email, create_date, password_change_date) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`;
            const insertResult = await client.query(insertSql, [payload.username, payload.password, payload.nickname, payload.email]);

            return insertResult.rows[0];
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }

    async getUserByUsername(username: string): Promise<User|undefined>{
        try {
            const client = await Database.getClient();
            const sql = 'SELECT * FROM users WHERE LOWER(username) = LOWER($1)';

            const result = await client.query(sql, [username]);

            client.release();

            return result.rows[0];
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }

    async getUserByNickname(nickname: string): Promise<User|undefined> {
        const client = await Database.getClient();
        const sql = 'SELECT * FROM users WHERE LOWER(nickname) = LOWER($1)';

        const result = await client.query(sql, [nickname]);
        client.release();

        return result.rows[0];
    }

    async getUserByEmail(email: string): Promise<User|undefined> {
        const client = await Database.getClient();
        const sql = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';

        const result = await client.query(sql, [email]);
        client.release();

        return result.rows[0];
    }
}
