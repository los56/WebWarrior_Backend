export type User = {
    id: number;
    username: string;
    password: string;
    nickname: string;
    email: string;
    create_date: string;
    password_change_date: string;
    last_login?: string;
};

export type ServiceResult<T> = {
    code: ErrorCode,
    data?: T
}

export type ResponsePayload = {
    success: boolean;
    code: number | ErrorCode;
    message: string;
}

export type LoginRequestPayload = {
    username: string;
    password: string;
};

export type LoginResponsePayload = ResponsePayload & {
    accessToken: string;
}

export type RegisterRequestPayload = {
    username: string;
    password: string;
    nickname: string;
    email: string;
}

export enum ErrorCode {
    SUCCESS,
    CONFLICT_USERNAME,
    CONFLICT_NICKNAME,
    CONFLICT_EMAIL,
    INVALID_USERNAME,
    TOO_SHORT_USERNAME,
    TOO_LONG_USERNAME,
    TOO_SHORT_NICKNAME,
    TOO_LONG_NICKNAME,
    INVALID_EMAIL,
    INVALID_PASSWORD,
    WEAK_PASSWORD,
    TOO_SHORT_PASSWORD,
    TOO_LONG_PASSWORD,
    NOT_FOUND,
    NEED_PARAMETER,
    MISMATCH,
    INVALID_TOKEN,
    UNKNOWN = 99,
}

export const makeResponsePayload = (success?: boolean, code?: ErrorCode, msg?: string) => {
    const _p: ResponsePayload = {
        success: success ? success : false,
        code: code ? code : ErrorCode.UNKNOWN,
        message: msg ? msg : ''
    }

    // If success is true code must be success
    if(success === true) {
        _p.code = ErrorCode.SUCCESS
    }

    return _p;
}
