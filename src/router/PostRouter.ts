import express, {Request, Response, NextFunction} from 'express';
import auth from '../middlewares/auth';
import Post from '../dto/Post';
import { makeResponsePayload } from "../types/payloads";
import { DataResponsePayload } from "../types/payloads";
import { CreatePostData, PostListData } from "../types/datas";
import SimpleDI from '../utils/SimpleDI';
import { ResultCode } from '../types/codes';
import PayloadBuilder from '../utils/PayloadBuilder';

const postRouter = express.Router();

postRouter.get('/view', async (req: Request<{},{},{}, {postId: string}>, res: Response, next: NextFunction) => {
    const { postId } = req.query;

    if(!postId || !parseInt(postId)) {
        return res.status(404).json(makeResponsePayload(false, ResultCode.UNKNOWN));
    }

    try {
        const postService = SimpleDI.getPostService();
        const result = await postService.viewPost(parseInt(postId));
        
        if(result.code !== ResultCode.SUCCESS || !result.data) {
            return res.status(403).json(makeResponsePayload(false, result.code, errorMessages[result.code]));
        }
         
        const _p = new PayloadBuilder().success(true).data<Post>(result.data).build();
        
        return res.status(200).json(_p);
    } catch(e) {
        next(e);
    }
});

interface ListQuery {
    page: number;
    count: number;
    order: string;
}

postRouter.get('/list', async(req: Request<{},{},{}, ListQuery>, res: Response, next: NextFunction) => {
    let { page, count, order } = req.query;

    //Set default parameter
    page = (page) ? page : 1;
    count = (count) ? count : 30;
    order = (order) ? order : 'DESC';

    try {
        const postService = SimpleDI.getPostService();
        const result = await postService.getPostList(page, count, order);

        if(result.code !== ResultCode.SUCCESS || !result.data) {
            return res.status(404).json(makeResponsePayload(false, result.code, errorMessages[result.code]));
        }

        const _p = new PayloadBuilder().success(true).data<PostListData>(result.data).build();

        return res.status(200).json(_p)
    } catch(e) {
        next(e);
    }
})

postRouter.post('/write', auth, async (req: Request, res: Response, next: NextFunction) => {
    const { title, contents } = req.body;
    const { id } = res.locals.userData;
    const data: Post = {
        id: -1,
        title: title,
        contents: contents,
        writer: id,
        create_date: ''
    };

    try {
        const postService = SimpleDI.getPostService();
        const result = await postService.writePost(data);
        if(result.code !== ResultCode.SUCCESS || !result.data) {
            return res.status(403).json(makeResponsePayload(false, result.code, errorMessages[result.code]));
        }

        const _p = new PayloadBuilder().success(true).data<number>(result.data.id).build();

        return res.status(200).json(_p);
    } catch(e) {
        next(e);
    }
});

const errorMessages: string[] = [];
errorMessages[ResultCode.NOT_FOUND] = 'Post not found';
errorMessages[ResultCode.NEED_PARAMETER] = 'Need PostId';
errorMessages[ResultCode.TOO_SHORT_TITLE] = 'Title too short';
errorMessages[ResultCode.TOO_LONG_TITLE] = 'Title too long';
errorMessages[ResultCode.NEED_BODY] = 'Need body';
errorMessages[ResultCode.EMPTY_WRITER] = 'Wrong writer';
errorMessages[ResultCode.CONTENTS_NOT_JSON] = 'Contents not json type';

export default postRouter;
