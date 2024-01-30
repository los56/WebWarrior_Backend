import express, { NextFunction, Request, Response } from 'express';
import auth from '../middlewares/auth';
import { CreateReplyData } from '../types/datas';
import SimpleDI from '../utils/SimpleDI';
import { ResultCode } from '../types/codes';
import { DataResponsePayload, makeResponsePayload } from '../types/payloads';
import Reply from '../dto/Reply';

const replyRouter = express.Router();

type ReplyWriteRequest = Request<{}, {}, {contents: string, post_id: number}, {}>;
replyRouter.post('/write', auth, async (req: ReplyWriteRequest, res: Response, next: NextFunction) => {
    const data: Reply = {
        id: -1,
        create_date: '',
        writer: res.locals.userData.id,
        ...req.body,
    }

    try {
        const replyService = SimpleDI.getReplyService();
        const result = await replyService.writeReply(data);

        if(result.code !== ResultCode.SUCCESS) {
            return res.status(403).json(makeResponsePayload(false, result.code));
        }

        return res.status(200).json(makeResponsePayload(true));
    } catch(e) {
        next(e);
    }
});

type PostIdRequest = Request<{}, {}, {}, {postId: number}>;

replyRouter.get('/', async (req: PostIdRequest, res: Response, next: NextFunction) => {
    const postId = req.query.postId;

    try {
        const replyService = SimpleDI.getReplyService();
        const result = await replyService.getReply(postId);

        if(result.code !== ResultCode.SUCCESS || !result.data) {
            return res.status(403).json(makeResponsePayload(false, result.code));
        }

        const _p: DataResponsePayload<Reply[]> = {
            success: true,
            code: ResultCode.SUCCESS,
            message: '',
            data: result.data
        }

        return res.status(200).json(_p)
    } catch(e) {
        next(e);
    }
});

export default replyRouter;