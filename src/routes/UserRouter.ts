import express, {NextFunction, Request, Response} from "express";
import UserService from "../services/UserService";
import {UserModel} from "../models/UserModel";
import {ErrorCode, LoginResponsePayload, makeResponsePayload} from "../types/types";

const userRouter = express.Router();

//Declare query type
type ValueRequest = Request<{}, {}, {}, {value: string}>;
const userService = new UserService(new UserModel());

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    try {
        const result = await userService.login({username: username, password: password});
        if(result.code !== ErrorCode.SUCCESS || !result.data) {
            return res.status(403).json(makeResponsePayload(false, result.code, errorMessages[result.code]));
        }

        const _p: LoginResponsePayload = {
            success: true,
            code: ErrorCode.SUCCESS,
            message: '',
            accessToken: result.data.token,
        }

        return res.status(200).json(_p);
    } catch (e) {
        next(e);
    }
});

userRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, nickname, email } = req.body;

    try {
        const result = await userService.register({username: username, password: password, email: email, nickname: nickname});
        if(result.code !== ErrorCode.SUCCESS) {
            // Can't catch duplicate, Because input invalid value pg throw error
            return res.status(409).json(makeResponsePayload(false, result.code, errorMessages[result.code]));
        }
        return res.status(200).json(makeResponsePayload(true));
    } catch (e) {
        next(e);
    }
});

userRouter.get('/checkUsername', async (req: ValueRequest, res: Response, next: NextFunction) => {
    const { value } = req.query;

    //I think query is null that wrong request
    if(!value) {
        return res.status(404).json(makeResponsePayload(false, ErrorCode.NEED_PARAMETER, 'Need value query'));
    }

    try {
        const checkResult = await userService.checkUsername(value);
        const code = checkResult.code;

        // Success
        if(code === ErrorCode.SUCCESS) {
            return res.status(200).json(makeResponsePayload(true));
        }

        return res.status(409).json(makeResponsePayload(false, code, errorMessages[code]));
    } catch (e) {
        next(e);
    }
});

userRouter.get('/checkNickname', async (req: ValueRequest, res: Response, next: NextFunction) => {
    const { value } = req.query;
    if(!value) {
        return res.status(404).json(makeResponsePayload(false, ErrorCode.NEED_PARAMETER, 'Need value query'));
    }
    try {
        const checkResult = await userService.checkNickname(value);
        const code: ErrorCode = checkResult.code;

        // Success
        if(code === ErrorCode.SUCCESS) {
            return res.status(200).json(makeResponsePayload(true));
        }

        return res.status(409).json(makeResponsePayload(false, code, errorMessages[code]));
    } catch (e) {
        next(e);
    }
});

userRouter.get('/checkEmail', async (req: ValueRequest, res: Response, next: NextFunction) => {
    const { value } = req.query;
    if(!value) {
        return res.status(404).json(makeResponsePayload(false, ErrorCode.NEED_PARAMETER, 'Need value query'));
    }

    try {
        const checkResult = await userService.checkEmail(value);
        const code = checkResult.code;

        // Success
        if(code === ErrorCode.SUCCESS) {
            return res.status(200).json(makeResponsePayload(true));
        }

        return res.status(409).json(makeResponsePayload(false, code, errorMessages[code]));
    } catch (e) {
        next(e);
    }
});

userRouter.post('/verifyToken', async (req: ValueRequest, res: Response, next: NextFunction) => {
    const { value } = req.query;
    if(!value) {
        return res.status(404).json(makeResponsePayload(false, ErrorCode.NEED_PARAMETER, 'Need value query'));
    }

    try {
        const result = await userService.verifyToken(value);
        if(result.code !== ErrorCode.SUCCESS) {
            return res.status(403).json(makeResponsePayload(false, ErrorCode.INVALID_TOKEN));
        }

        return res.status(200).json(makeResponsePayload(true))
    } catch(e) {
        next(e);
    }
})


const errorMessages: string[] = [];
errorMessages[ErrorCode.CONFLICT_NICKNAME] = 'This username is already in use';
errorMessages[ErrorCode.TOO_SHORT_USERNAME] = 'Username too short';
errorMessages[ErrorCode.TOO_LONG_USERNAME] = 'Username too long';
errorMessages[ErrorCode.CONFLICT_NICKNAME] = 'This nickname is already in use';
errorMessages[ErrorCode.TOO_SHORT_NICKNAME] = 'Nickname too short';
errorMessages[ErrorCode.TOO_LONG_NICKNAME] = 'Nickname too long';
errorMessages[ErrorCode.CONFLICT_EMAIL] = 'This email is already in use';
errorMessages[ErrorCode.INVALID_EMAIL] = 'Invalid email';
errorMessages[ErrorCode.MISMATCH] = 'Mismatch username or password';


export default userRouter;
