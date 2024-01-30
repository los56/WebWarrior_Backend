import CharacterDAOImpl from "../dao/CharacterDAOImpl";
import PostDAOImpl from "../dao/PostDAOImpl";
import ReplyDAOImpl from "../dao/ReplyDAOImpl";
import UserDAOImpl from "../dao/UserDAOImpl";
import CharacterService from "../service/CharacterService";
import PostService from "../service/PostService";
import ReplyService from "../service/ReplyService";
import UserService from "../service/UserService";

class SimpleDI {
    private static _userSerivce: UserService;
    private static _postService: PostService;
    private static _replyService: ReplyService;
    private static _characterService: CharacterService;

    static getUserService() {
        if(!this._userSerivce) {
            this._userSerivce = new UserService(new UserDAOImpl());
        }
        
        return this._userSerivce
    }

    static getPostService() {
        if(!this._postService) {
            this._postService = new PostService(new PostDAOImpl());
        }

        return this._postService;
    }

    static getReplyService() {
        if(!this._replyService) {
            this._replyService = new ReplyService(new ReplyDAOImpl());
        }

        return this._replyService;
    }
    
    static getCharacterService() {
        if(!this._characterService) {
            this._characterService = new CharacterService(new CharacterDAOImpl());
        }

        return this._characterService;
    }
}

export default SimpleDI;