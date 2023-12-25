import {UserModel} from "../models/UserModel";
import {ErrorCode, LoginRequestPayload, RegisterRequestPayload, ServiceResult, User} from "../types/types";
import WWError from "../types/WWError";

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// username can only use upper / lowercase alphabets, digits and underscore
const usernameExp = /[\w-]+/;
const emailExp = /[\w-\.]+@([\w-]+\.)[\w-]+/;

export default class UserService {
    private userModel: UserModel;

    constructor(userModel: UserModel) {
        this.userModel = userModel;
    }

    async login(payload: LoginRequestPayload): Promise<ServiceResult<{ token: string }>> {
        try {
            const user = await this.userModel.getUserByUsername(payload.username);

            if(!user) {
                return { code: ErrorCode.MISMATCH };
            }

            if(!bcrypt.compareSync(payload.password, user.password)) {
                return { code: ErrorCode.MISMATCH };
            }

            const privateKey = process.env.PRIVATE_KEY;
            if(!privateKey) {
                throw new Error('Need PRIVATE KEY');
            }

            const token = jwt.sign({id: user.id, username: user.username, nickname: user.nickname},
                privateKey, { algorithm: 'HS256', expiresIn: '1h', issuer: 'webwarrior'});

            return { code: ErrorCode.SUCCESS, data: {token: token} };
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }

    async verifyToken(token: string): Promise<ServiceResult<any>> {
        try {
            const privateKey = process.env.PRIVATE_KEY;
            if(!privateKey) {
                throw new Error('Need PRIVATE KEY');
            }

            const decoded = jwt.verify(token, privateKey);
            return { code: ErrorCode.SUCCESS };
        } catch (e) {
            if(e instanceof jwt.JsonWebTokenError) {
                return { code: ErrorCode.INVALID_TOKEN };
            }
            throw WWError.handlingError(e);
        }
    }

    async register(payload: RegisterRequestPayload): Promise<ServiceResult<User>> {
        // Check validations
        const validations: ErrorCode[] = [];
        validations.push(this.isValidUsername(payload.username));
        validations.push(this.isValidPassword(payload.password));
        validations.push(this.isValidNickname(payload.nickname));
        validations.push(this.isValidEmail(payload.email));

        for(let i of validations) {
            if(i !== ErrorCode.SUCCESS) {
                return { code: i };
            }
        }

        // username not case-sensitive & Password encrypting
        payload.username = payload.username.toLowerCase();
        payload.password = bcrypt.hashSync(payload.password, 10);

        try {
            const user = await this.userModel.addUser(payload);
            if(!user) {
                return {
                    code: ErrorCode.UNKNOWN
                }
            }

            return {
                code: ErrorCode.SUCCESS,
                data: user
            }
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }

    async checkUsername(username: string): Promise<ServiceResult<any>> {
        const checkValidation = this.isValidUsername(username);
        if(checkValidation !== ErrorCode.SUCCESS) {
            return { code: checkValidation };
        }

        try {
            const user = await this.userModel.getUserByUsername(username);
            if(!user) {
                return {
                    code: ErrorCode.SUCCESS
                }
            }

            return {
                code: ErrorCode.CONFLICT_USERNAME
            }
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }

    async checkNickname(nickname: string): Promise<ServiceResult<any>> {
        const validation = this.isValidNickname(nickname);
        if(validation !== ErrorCode.SUCCESS) {
            return { code: validation };
        }

        try{
            const user = await this.userModel.getUserByNickname(nickname);

            if(!user) {
                return { code: ErrorCode.SUCCESS };
            }

            return { code: ErrorCode.CONFLICT_NICKNAME };
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }

    async checkEmail(email: string): Promise<ServiceResult<any>> {
        const validation = this.isValidEmail(email);
        if(validation !== ErrorCode.SUCCESS) {
            return { code: validation };
        }

        try {
            const user = await this.userModel.getUserByEmail(email);
            if(!user) {
                return { code: ErrorCode.SUCCESS };
            }

            return { code: ErrorCode.CONFLICT_EMAIL };
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }

    private isValidUsername(username: string): ErrorCode {
        if(!username) {
            return ErrorCode.INVALID_USERNAME;
        }

        if(!usernameExp.exec(username)) {
            return ErrorCode.INVALID_USERNAME;
        }

        if(username.length < 4) {
            return ErrorCode.TOO_SHORT_USERNAME;
        }

        if(username.length > 25) {
            return ErrorCode.TOO_LONG_USERNAME;
        }

        return ErrorCode.SUCCESS;
    }

    private isValidPassword(password: string): ErrorCode {
        if(!password) {
            return ErrorCode.INVALID_PASSWORD;
        }

        if(password.length < 8) {
            return ErrorCode.TOO_SHORT_PASSWORD;
        }

        if(password.length > 255) {
            return ErrorCode.TOO_LONG_PASSWORD;
        }

        return ErrorCode.SUCCESS;
    }

    private isValidNickname(nickname: string): ErrorCode {
        if(!nickname || nickname.length < 4) {
            return ErrorCode.TOO_SHORT_NICKNAME;
        }

        if(nickname.length > 15) {
            return ErrorCode.TOO_LONG_NICKNAME;
        }

        return ErrorCode.SUCCESS;
    }

    private isValidEmail(email: string): ErrorCode {
        if(!email || !emailExp.exec(email)) {
            return ErrorCode.INVALID_EMAIL;
        }

        return ErrorCode.SUCCESS;
    }
}
