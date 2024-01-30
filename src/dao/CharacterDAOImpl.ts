import Database from "../config/Database";
import Character from "../dto/Character";
import WWError from "../types/WWError";
import CharacterDAO from "./interfaces/CharacterDAO";

export default class CharacterDAOImpl implements CharacterDAO {
    async save(character: Character): Promise<Character> {
        const sql = `INSERT INTO characters(name, level, exp, atk, magic_atk, def, magic_def, stat_point, create_date, owner) VALUES ($1, 1, 0, 4, 4, 2, 2, 0, NOW(), $2) RETURNING *`

        try {
            const client = await Database.getClient();
            const result = await client.query(sql, [character.name, character.owner]);
            await client.release();

            return result.rows[0];
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async getCharactersByOwnerId(owner: number): Promise<Character[]> {
        const sql = `SELECT * FROM characters WHERE owner = $1`;

        try {
            const client = await Database.getClient();
            const result = await client.query(sql, [owner]);
            await client.release();

            return result.rows;
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async getCharacter(id: number, owner: number): Promise<Character> {
        const sql = `SELECT * FROM characters WHERE id = $1 AND owner = $2`;

        try {
            const client = await Database.getClient();
            const result = await client.query(sql, [id, owner]);
            await client.release();

            return result.rows[0];
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }
}