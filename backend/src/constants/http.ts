const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const UNPROCESSABLE_CONTENT = 422;
const TOO_MANY_REQUESTS = 429;
const INTERNAL_SERVER_ERROR = 500;

module.exports = {
  OK,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  UNPROCESSABLE_CONTENT,
  TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR,
};

// Only for types, you can still use export type:
export type HttpStatusCode =
  | typeof OK
  | typeof CREATED
  | typeof BAD_REQUEST
  | typeof UNAUTHORIZED
  | typeof FORBIDDEN
  | typeof NOT_FOUND
  | typeof CONFLICT
  | typeof UNPROCESSABLE_CONTENT
  | typeof TOO_MANY_REQUESTS
  | typeof INTERNAL_SERVER_ERROR;