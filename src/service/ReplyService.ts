import ReplyDAO from "../dao/ReplyDAOImpl";
import WWError from "../types/WWError";
import { ResultCode } from "../types/codes";
import { makeResponsePayload } from "../types/payloads";
import WWModel from "../types/WWModel";
import Reply from "../dto/Reply"

export default class ReplyService {
    private replyDAO: ReplyDAO;

    constructor(replyDAO: ReplyDAO) {
        this.replyDAO = replyDAO;
    }

    async writeReply(data: Reply): Promise<WWModel<any>> {
        if(!data) {
            return { code: ResultCode.NEED_BODY };
        }

        try {
            const result = await this.replyDAO.save(data);
            
            if(!result) {
                return makeResponsePayload(false, ResultCode.UNKNOWN);
            }

            return makeResponsePayload(true);
        } catch(e) {
            throw WWError.handlingError(e);
        }
    }

    async getReply(postId: number): Promise<WWModel<Reply[]>> {
        if(!postId) {
            return { code: ResultCode.NEED_PARAMETER }
        }

        try {
            const result = await this.replyDAO.getReplyByPostId(postId);

            if(!result) {
                return makeResponsePayload(false, ResultCode.UNKNOWN);
            }

            return {
                code: ResultCode.SUCCESS,
                data: result
            };
        } catch (e) {
            throw WWError.handlingError(e);
        }
    }
}