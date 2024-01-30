import CharacterDAO from "../dao/interfaces/CharacterDAO";
import Character from "../dto/Character";
import WWError from "../types/WWError";
import WWModel from "../types/WWModel";
import { ResultCode } from "../types/codes";

export default class CharacterService {
    private characterDAO: CharacterDAO;

    constructor(dao: CharacterDAO) {
        this.characterDAO = dao
    }

    async createCharacter(data: Character): Promise<WWModel<Character>> {    
        try {
            const result = await this.characterDAO.save(data);
            if(!result) {
                return { code: ResultCode.NOT_FOUND }
            }

            return { code: ResultCode.SUCCESS, data: result };
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async getCharacter(id: number, owner: number): Promise<WWModel<Character>> {
        try {
            const result = await this.characterDAO.getCharacter(id, owner);
            if(!result) {
                return { code: ResultCode.NOT_FOUND, status: 500 }
            }

            return { code: ResultCode.SUCCESS, data: result }
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async getCharactersByOwnerId(owner: number): Promise<WWModel<Character[]>> {
        try {
            const result = await this.characterDAO.getCharactersByOwnerId(owner);
            if(!result) {
                return { code: ResultCode.UNKNOWN }
            }

            if(result.length < 1) {
                return { code: ResultCode.NOT_FOUND }
            }

            return { code: ResultCode.SUCCESS, data: result }
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }
}