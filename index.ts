import express, {Request, Response, ErrorRequestHandler, NextFunction} from "express";
import dotenv from 'dotenv';
import morgan from "morgan";
import * as rfs from 'rotating-file-stream';
import * as path from 'path';

import bodyParser from "body-parser";
import { ResponsePayload } from "./src/types/payloads";
import { ResultCode } from "./src/types/codes";
import rootRouter from "./src/RootRouter";

const app = express();
const PORT = 3000;

dotenv.config();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const today = new Date();
const logFileStream = rfs.createStream(`log_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}.log`, {
    interval: '1d',
    path: path.join(__dirname, 'log')
});
app.use(morgan('combined', { stream: logFileStream }));
app.use(morgan('dev'));


app.use('/api', rootRouter);
app.use('/public', express.static('./public'));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    const payload: ResponsePayload = {
        success: false,
        code: ResultCode.UNKNOWN,
        message: 'Internal Server Error'
    }

    console.log(err);
    return res.status(500).json(payload);
})

app.listen(3000, () => {
    console.log(`LISTEN | PORT: ${PORT}`);
});
