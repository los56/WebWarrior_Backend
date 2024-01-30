import express, {NextFunction, Request, Response} from "express";
import UserService from "../service/UserService";
import { makeResponsePayload } from "../types/payloads";
import { LoginResponsePayload } from "../types/payloads";
import { ResultCode } from "../types/codes";
import SimpleDI from "../utils/SimpleDI";

const userRouter = express.Router();

//Declare query type
type ValueRequest = Request<{}, {}, {}, {value: string}>;

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const userService = SimpleDI.getUserService();

    try {
        const result = await userService.login({username: username, password: password});
        if(result.code !== ResultCode.SUCCESS || !result.data) {
            return res.status(403).json(makeResponsePayload(false, result.code, errorMessages[result.code]));
        }

        const _p: LoginResponsePayload = {
            success: true,
            code: ResultCode.SUCCESS,
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
    const userService = SimpleDI.getUserService();

    try {
        const result = await userService.register({username: username, password: password, email: email, nickname: nickname});
        if(result.code !== ResultCode.SUCCESS) {
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
    const userService = SimpleDI.getUserService();

    //I think query is null that wrong request
    if(!value) {
        return res.status(404).json(makeResponsePayload(false, ResultCode.NEED_PARAMETER, 'Need value query'));
    }

    try {
        const checkResult = await userService.checkUsername(value);
        const code = checkResult.code;

        // Success
        if(code === ResultCode.SUCCESS) {
            return res.status(200).json(makeResponsePayload(true));
        }

        return res.status(409).json(makeResponsePayload(false, code, errorMessages[code]));
    } catch (e) {
        next(e);
    }
});

userRouter.get('/checkNickname', async (req: ValueRequest, res: Response, next: NextFunction) => {
    const { value } = req.query;
    const userService = SimpleDI.getUserService();

    if(!value) {
        return res.status(404).json(makeResponsePayload(false, ResultCode.NEED_PARAMETER, 'Need value query'));
    }
    try {
        const checkResult = await userService.checkNickname(value);
        const code: ResultCode = checkResult.code;

        // Success
        if(code === ResultCode.SUCCESS) {
            return res.status(200).json(makeResponsePayload(true));
        }

        return res.status(409).json(makeResponsePayload(false, code, errorMessages[code]));
    } catch (e) {
        next(e);
    }
});

userRouter.get('/checkEmail', async (req: ValueRequest, res: Response, next: NextFunction) => {
    const { value } = req.query;
    const userService = SimpleDI.getUserService();    

    if(!value) {
        return res.status(404).json(makeResponsePayload(false, ResultCode.NEED_PARAMETER, 'Need value query'));
    }

    try {
        const checkResult = await userService.checkEmail(value);
        const code = checkResult.code;

        // Success
        if(code === ResultCode.SUCCESS) {
            return res.status(200).json(makeResponsePayload(true));
        }

        return res.status(409).json(makeResponsePayload(false, code, errorMessages[code]));
    } catch (e) {
        next(e);
    }
});

userRouter.post('/verifyToken', async (req: ValueRequest, res: Response, next: NextFunction) => {
    const { value } = req.query;
    const userService = SimpleDI.getUserService();

    if(!value) {
        return res.status(404).json(makeResponsePayload(false, ResultCode.NEED_PARAMETER, 'Need value query'));
    }

    try {
        const result = await userService.verifyToken(value);
        if(result.code !== ResultCode.SUCCESS) {
            return res.status(403).json(makeResponsePayload(false, result.code));
        }

        return res.status(200).json(makeResponsePayload(true))
    } catch(e) {
        next(e);
    }
})


const errorMessages: string[] = [];
errorMessages[ResultCode.CONFLICT_NICKNAME] = 'This username is already in use';
errorMessages[ResultCode.TOO_SHORT_USERNAME] = 'Username too short';
errorMessages[ResultCode.TOO_LONG_USERNAME] = 'Username too long';
errorMessages[ResultCode.CONFLICT_NICKNAME] = 'This nickname is already in use';
errorMessages[ResultCode.TOO_SHORT_NICKNAME] = 'Nickname too short';
errorMessages[ResultCode.TOO_LONG_NICKNAME] = 'Nickname too long';
errorMessages[ResultCode.CONFLICT_EMAIL] = 'This email is already in use';
errorMessages[ResultCode.INVALID_EMAIL] = 'Invalid email';
errorMessages[ResultCode.MISMATCH] = 'Mismatch username or password';


export default userRouter;
