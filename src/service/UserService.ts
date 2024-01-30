import UserDAO from "../dao/UserDAOImpl";
import WWModel from "../types/WWModel";
import User from "../dto/User";
import { RegisterRequestData } from "../types/datas";
import { LoginRequestData } from "../types/datas";
import { AuthUserData } from "../types/datas";
import { ResultCode } from "../types/codes";
import WWError from "../types/WWError";

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// username can only use upper / lowercase alphabets, digits and underscore
const usernameExp = /[\w-]+/;
const emailExp = /[\w-\.]+@([\w-]+\.)[\w-]+/;

export default class UserService {
    private userDAO: UserDAO;

    constructor(userModel: UserDAO) {
        this.userDAO = userModel;
    }

    async login(payload: LoginRequestData): Promise<WWModel<{ token: string }>> {
        try {
            const user = await this.userDAO.getUserByUsername(payload.username);

            if(!user) {
                return { code: ResultCode.MISMATCH };
            }

            if(!bcrypt.compareSync(payload.password, user.password)) {
                return { code: ResultCode.MISMATCH };
            }

            const privateKey = process.env.PRIVATE_KEY;
            if(!privateKey) {
                throw new Error('Need PRIVATE KEY');
            }

            const token = jwt.sign({id: user.id, username: user.username, nickname: user.nickname},
                privateKey, { algorithm: 'HS256', expiresIn: '1h', issuer: 'webwarrior'});
            
            const updateLastLogin = this.userDAO.updateLastLogin(user.id);
                
            return { code: ResultCode.SUCCESS, data: {token: token} };
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }

    async verifyToken(token: string): Promise<WWModel<AuthUserData>> {
        try {
            const privateKey = process.env.PRIVATE_KEY;
            if(!privateKey) {
                throw new Error('Need PRIVATE KEY');
            }

            // jwt.verify type is jwt.JwtPayload => Can't get original data then set type any
            const decoded: any = jwt.verify(token, privateKey);
            const userData: AuthUserData = {
                id: decoded.id,
                username: decoded.username,
                nickname: decoded.nickname
            };

            return { code: ResultCode.SUCCESS, data: userData };
        } catch (e) {
            if(e instanceof jwt.TokenExpiredError) {
                return { code: ResultCode.EXPIRED_TOKEN };
            }

            if(e instanceof jwt.JsonWebTokenError) {
                return { code: ResultCode.INVALID_TOKEN };
            }

            throw WWError.handlingError(e);
        }
    }

    async register(payload: RegisterRequestData): Promise<WWModel<User>> {
        // Check validations
        const validations: ResultCode[] = [];
        validations.push(this.isValidUsername(payload.username));
        validations.push(this.isValidPassword(payload.password));
        validations.push(this.isValidNickname(payload.nickname));
        validations.push(this.isValidEmail(payload.email));

        for(let i of validations) {
            if(i !== ResultCode.SUCCESS) {
                return { code: i };
            }
        }

        const user: User = {
            id: -1,
            ...payload,
            create_date: '',
            password_change_date: ''
        };

        user.password = bcrypt.hashSync(user.password, 10);

        try {
            const result = await this.userDAO.save(user);
            if(!result) {
                return {
                    code: ResultCode.UNKNOWN
                }
            }

            return {
                code: ResultCode.SUCCESS,
                data: result
            }
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }

    async checkUsername(username: string): Promise<WWModel<any>> {
        const checkValidation = this.isValidUsername(username);
        if(checkValidation !== ResultCode.SUCCESS) {
            return { code: checkValidation };
        }

        try {
            const user = await this.userDAO.getUserByUsername(username);
            if(!user) {
                return {
                    code: ResultCode.SUCCESS
                }
            }

            return {
                code: ResultCode.CONFLICT_USERNAME
            }
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }

    async checkNickname(nickname: string): Promise<WWModel<any>> {
        const validation = this.isValidNickname(nickname);
        if(validation !== ResultCode.SUCCESS) {
            return { code: validation };
        }

        try{
            const user = await this.userDAO.getUserByNickname(nickname);

            if(!user) {
                return { code: ResultCode.SUCCESS };
            }

            return { code: ResultCode.CONFLICT_NICKNAME };
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }

    async checkEmail(email: string): Promise<WWModel<any>> {
        const validation = this.isValidEmail(email);
        if(validation !== ResultCode.SUCCESS) {
            return { code: validation };
        }

        try {
            const user = await this.userDAO.getUserByEmail(email);
            if(!user) {
                return { code: ResultCode.SUCCESS };
            }

            return { code: ResultCode.CONFLICT_EMAIL };
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }

    private isValidUsername(username: string): ResultCode {
        if(!username) {
            return ResultCode.INVALID_USERNAME;
        }

        if(!usernameExp.exec(username)) {
            return ResultCode.INVALID_USERNAME;
        }

        if(username.length < 4) {
            return ResultCode.TOO_SHORT_USERNAME;
        }

        if(username.length > 25) {
            return ResultCode.TOO_LONG_USERNAME;
        }

        return ResultCode.SUCCESS;
    }

    private isValidPassword(password: string): ResultCode {
        if(!password) {
            return ResultCode.INVALID_PASSWORD;
        }

        if(password.length < 8) {
            return ResultCode.TOO_SHORT_PASSWORD;
        }

        if(password.length > 255) {
            return ResultCode.TOO_LONG_PASSWORD;
        }

        return ResultCode.SUCCESS;
    }

    private isValidNickname(nickname: string): ResultCode {
        if(!nickname || nickname.length < 4) {
            return ResultCode.TOO_SHORT_NICKNAME;
        }

        if(nickname.length > 15) {
            return ResultCode.TOO_LONG_NICKNAME;
        }

        return ResultCode.SUCCESS;
    }

    private isValidEmail(email: string): ResultCode {
        if(!email || !emailExp.exec(email)) {
            return ResultCode.INVALID_EMAIL;
        }

        return ResultCode.SUCCESS;
    }
}
