import express, {NextFunction, Request, Response} from 'express';
import auth from '../middlewares/auth';
import { DataResponsePayload, makeResponsePayload } from '../types/payloads';
import { ResultCode } from '../types/codes';
import SimpleDI from '../utils/SimpleDI';
import Character from '../dto/Character';
import PayloadBuilder from '../utils/PayloadBuilder';

const characterRouter = express.Router();

characterRouter.get('/', auth, async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = res.locals.userData.id;

    // 미들웨어 오류에도 실행되는 것 방지
    if(!ownerId) {
        return res.status(401).json(makeResponsePayload(false, ResultCode.UNKNOWN));
    }

    try {
        const service = SimpleDI.getCharacterService();

        const result = await service.getCharactersByOwnerId(ownerId);
        if(result.code !== ResultCode.SUCCESS || !result.data) {
            return res.status(404).json(new PayloadBuilder().success(false).build());
        }

        const _p = new PayloadBuilder().success(true).data<Character[]>(result.data).build();

        return res.status(200).json(_p);
    } catch(e) {
        next(e)
    }
});


type CreateRequest = Request<{}, {}, {name: string}, {}>
characterRouter.post('/create', auth, async (req: CreateRequest, res: Response, next: NextFunction) => {
    const ownerId = res.locals.userData.id;
    const name = req.body.name;

    // 미들웨어 오류에도 실행되는 것 방지
    if(!ownerId) {
        return res.status(401).json(new PayloadBuilder().build());
    }
    
    try {
        const service = SimpleDI.getCharacterService();
        const result = await service.createCharacter({
            id: -1,
            name: name,
            level: 1,
            exp: 0,
            atk: 0,
            magic_atk: 0,
            def: 0,
            magic_def: 0,
            stat_point: 0,
            owner: 0,
        });

        if(result.code != ResultCode.SUCCESS || !result.data) {
            return res.status(500).json(new PayloadBuilder().success(false)); 
        }

        return res.status(200).json(new PayloadBuilder().success(true).data<Character>(result.data))
    } catch(e) {
        next(e);
    }
});