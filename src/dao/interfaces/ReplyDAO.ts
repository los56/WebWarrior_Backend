import Reply from "../../dto/Reply";

export default interface ReplyDAO {
    save(data: Reply): Promise<Reply>;
    getReplyByPostId(postId: number): Promise<Reply[]>; 
    deleteReply(replyId: number, writer: number): Promise<boolean>;
}