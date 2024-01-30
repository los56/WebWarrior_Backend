import express, {NextFunction, Request, Response} from 'express';
import User from '../dto/User';
import { makeResponsePayload } from "../types/payloads";
import { AuthUserData } from "../types/datas";
import { ResultCode } from "../types/codes";
import UserService from '../service/UserService';
import UserDAO from '../dao/UserDAOImpl';

const userService = new UserService(new UserDAO());

const auth = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) {
        const _p = makeResponsePayload(false, ResultCode.NEED_TOKEN, 'Need access token in header.authorization');

        return res.status(401).json(_p);
    }

    const splitedToken = req.headers.authorization.split(' ');
    let realToken: string;

    // Maybe headers.authorization starts 'Bearer ~~~'
    if(splitedToken.length < 2) { 
        // case: Without type
        realToken = splitedToken[0];
    } else { 
        // case: with type
        realToken = splitedToken[1];
    }  

    const validateResult = await userService.verifyToken(realToken);

    if(validateResult.code !== ResultCode.SUCCESS) {
        const _p = makeResponsePayload(false, validateResult.code, errorMessages[validateResult.code]);
        
        return res.status(401).json(_p);
    }
    
    res.locals.userData =  validateResult.data;
    next();
};

const errorMessages: string[] = [];
errorMessages[ResultCode.INVALID_TOKEN] = 'Access token is invalid';
errorMessages[ResultCode.EXPIRED_TOKEN] = 'Access token is expired';

export default auth;