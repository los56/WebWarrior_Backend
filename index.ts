import express, {Request, Response, ErrorRequestHandler, NextFunction} from "express";
import dotenv from 'dotenv';

import bodyParser from "body-parser";
import userRouter from "./src/routes/UserRouter";
import {ErrorCode, ResponsePayload} from "./src/types/types";

const app = express();
const PORT = 3000;

dotenv.config();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/user', userRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    const payload: ResponsePayload = {
        success: false,
        code: ErrorCode.UNKNOWN,
        message: 'Internal Server Error'
    }

    console.log(err);
    return res.status(500).json(payload);
})

app.listen(3000, () => {
    console.log(`LISTEN | PORT: ${PORT}`);
});
