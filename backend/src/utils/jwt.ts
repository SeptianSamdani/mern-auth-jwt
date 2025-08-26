import type { SignOptions, VerifyOptions } from "jsonwebtoken";
import jwt = require("jsonwebtoken");
const SessionDocument = require("../models/session.model");
const UserDocument = require("../models/user.model");
const { JWT_SECRET, JWT_REFRESH_SECRET } = require("../constants/env");

type SessionDocument = typeof SessionDocument[keyof typeof SessionDocument];
type UserDocument = typeof UserDocument[keyof typeof UserDocument];

export type RefreshTokenPayload = {
  sessionId: SessionDocument["_id"];
};

export type AccessTokenPayload = {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
};

type SignOptionsAndSecret = SignOptions & { secret: string };

const defaults: SignOptions = { audience: "user" };
const defaultsVerify: Omit<VerifyOptions, "audience"> = {};

const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_SECRET,
};

const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret
) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, { ...defaults, ...signOpts });
};

const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: Partial<VerifyOptions> & { secret?: string }
) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      ...defaultsVerify,
      ...verifyOpts,
    }) as TPayload;
    return { payload };
  } catch (error: any) {
    return { error: error.message };
  }
};

module.exports = {
  refreshTokenSignOptions,
  signToken,
  verifyToken,
};
