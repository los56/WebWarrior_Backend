import express from 'express';
import userRouter from './router/UserRouter';
import postRouter from './router/PostRouter';
import replyRouter from './router/ReplyRouter';

const rootRouter = express.Router();

rootRouter.use('/user', userRouter);
rootRouter.use('/post', postRouter);
rootRouter.use('/reply', replyRouter)

export default rootRouter;