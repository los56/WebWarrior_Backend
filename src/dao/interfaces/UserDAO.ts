import User from "../../dto/User";

export default interface UserDAO {
    save(user: User): Promise<User>;
    getUserByUsername(username: string): Promise<User>;
    getUserByNickname(nickname: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    updateLastLogin(userId: number): Promise<string>;
}