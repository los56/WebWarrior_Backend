export enum ResultCode {
    // COMMON (0 ~ 9)
    SUCCESS = 0,
    NOT_FOUND,
    NEED_PARAMETER,
    NEED_BODY,
    MISMATCH,
    // USER (1X ~ 2X)
    CONFLICT_USERNAME = 10,
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
    NEED_TOKEN,
    INVALID_TOKEN,
    EXPIRED_TOKEN,
    // POST (3X)
    TOO_SHORT_TITLE = 30,
    TOO_LONG_TITLE,
    EMPTY_CONTENTS,
    EMPTY_WRITER,
    CONTENTS_NOT_JSON,
    // EXCEPTION
    UNKNOWN = 99
}