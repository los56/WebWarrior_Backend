import { ResultCode } from "./codes";

export interface ResponsePayload {
    success: boolean;
    code: number | ResultCode;
    message: string;
}

export interface LoginResponsePayload extends ResponsePayload {
    accessToken: string;
}

export interface DataResponsePayload<T> extends ResponsePayload {
    data: T;
}

export const makeResponsePayload = (success?: boolean, code?: ResultCode, msg?: string) => {
    const _p: ResponsePayload = {
        success: success ? success : false,
        code: code ? code : ResultCode.UNKNOWN,
        message: msg ? msg : '',
    };

    // If success is true code must be success
    if (success === true) {
        _p.code = ResultCode.SUCCESS;
    }

    return _p;
};
