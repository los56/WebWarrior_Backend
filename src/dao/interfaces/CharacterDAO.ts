import Character from "../../dto/Character";

export default interface CharacterDAO {
    save(character: Character): Promise<Character>;
    getCharacter(id: number, owner: number): Promise<Character>;
    getCharactersByOwnerId(owner: number): Promise<Character[]>;
}