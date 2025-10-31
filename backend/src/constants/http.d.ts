declare const OK = 200;
declare const CREATED = 201;
declare const BAD_REQUEST = 400;
declare const UNAUTHORIZED = 401;
declare const FORBIDDEN = 403;
declare const NOT_FOUND = 404;
declare const CONFLICT = 409;
declare const UNPROCESSABLE_CONTENT = 422;
declare const TOO_MANY_REQUESTS = 429;
declare const INTERNAL_SERVER_ERROR = 500;
export type HttpStatusCode = typeof OK | typeof CREATED | typeof BAD_REQUEST | typeof UNAUTHORIZED | typeof FORBIDDEN | typeof NOT_FOUND | typeof CONFLICT | typeof UNPROCESSABLE_CONTENT | typeof TOO_MANY_REQUESTS | typeof INTERNAL_SERVER_ERROR;
export {};
//# sourceMappingURL=http.d.ts.map