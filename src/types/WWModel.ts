// In code(Services, DAO... ) use Data
// In network(Response) use Payload

import { ResultCode } from "./codes";

export default interface WWModel<T> {
    code: ResultCode,
    data?: T
    status?: number
}