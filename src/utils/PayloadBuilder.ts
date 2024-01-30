import { ResultCode } from "../types/codes";
import { ResponsePayload, DataResponsePayload } from "../types/payloads";

export default class PayloadBuilder {
    private payload: ResponsePayload;

    constructor() {
        this.payload = {
            success: false,
            code: ResultCode.UNKNOWN,
            message: ''
        }
    }

    success(success: boolean) {
        this.payload.success = success;
        if(success) {
            this.payload.code = ResultCode.SUCCESS;
        }

        return this;
    }

    code(code: number | ResultCode) {
        this.payload.code = code;
        return this;
    }

    message(message: string) {
        this.payload.message = message;
        return this;
    }

    data<T>(data: T) {
        const casted = this.payload as DataResponsePayload<T>;
        if(casted) {
            casted.data = data;
        }

        return this;
    }

    build() {
        if(this.payload.success && this.payload.code != ResultCode.SUCCESS) {
            throw new Error("Conflict success value and result code");
        }

        return this.payload;
    }
}