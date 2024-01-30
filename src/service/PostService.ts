import PostDAO from "../dao/PostDAOImpl";
import WWError from "../types/WWError";
import WWModel from "../types/WWModel";
import Post from "../dto/Post";
import { CreatePostData, PostListData } from "../types/datas";
import { ResultCode } from "../types/codes";

export default class PostService {
    private postDAO: PostDAO;

    constructor(postDAO: PostDAO) {
        this.postDAO = postDAO;
    }

    async viewPost(postId: number): Promise<WWModel<Post>> {
        if(!postId) {
            return { code: ResultCode.NEED_PARAMETER }
        }

        try {
            const post = await this.postDAO.getPostById(postId);
            if(!post) {
                return { code: ResultCode.NOT_FOUND };
            }

            return { code: ResultCode.SUCCESS, data: post };
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async getPostList(page: number, count: number, order: string): Promise<WWModel<PostListData>> {
        if(!page || !count || !order) {
            return { code: ResultCode.NEED_PARAMETER };
        }

        // check order invalid input
        order = order.toUpperCase();
        let realOrder: 'ASC' | 'DESC' = 'DESC'

        if(order === 'ASC' || order === 'DESC') {
            realOrder = order;
        } else {
            realOrder = 'DESC';
        }

        const offset = count * (page - 1);

        try {
            const post = await this.postDAO.getPostsByFilter(offset, count, realOrder);
            const postCount = await this.postDAO.getCount();

            if(!post || !postCount) {
                return { code: ResultCode.UNKNOWN };
            }

            return { code: ResultCode.SUCCESS, data: {count: postCount, posts: post} };
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async writePost(data: Post): Promise<WWModel<Post>> {
        if(!data) {
            return { code: ResultCode.NEED_BODY }
        }
        
        const checkResult = this.isValidCreatePostPayload(data);

        if(checkResult !== true) {
            return { code: checkResult };
        }

        try {
            const post = await this.postDAO.save(data);
            if(!post) {
                return { code: ResultCode.UNKNOWN };
            }
            
            return { code: ResultCode.SUCCESS, data: post };
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    private isValidCreatePostPayload(payload: CreatePostData): true | ResultCode {
        if(payload.title.length < 1) {
            return ResultCode.TOO_SHORT_TITLE;
        }

        if(payload.title.length > 250) {
            return ResultCode.TOO_LONG_TITLE;
        }

        if(!payload.contents) {
            return ResultCode.EMPTY_CONTENTS;
        }
        
        if(!payload.writer) {
            // If I don't have mistake, Maybe this code not execute.
            return ResultCode.EMPTY_WRITER;
        }

        try {
            JSON.parse(payload.contents);
        } catch(e) {
            if(e instanceof SyntaxError) {
                return ResultCode.CONTENTS_NOT_JSON;
            }
        }

        return true;
    }
}