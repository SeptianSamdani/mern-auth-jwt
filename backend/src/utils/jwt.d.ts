declare const SessionDocument: any;
declare const UserDocument: any;
type SessionDocument = typeof SessionDocument[keyof typeof SessionDocument];
type UserDocument = typeof UserDocument[keyof typeof UserDocument];
export type RefreshTokenPayload = {
    sessionId: SessionDocument["_id"];
};
export type AccessTokenPayload = {
    userId: UserDocument["_id"];
    sessionId: SessionDocument["_id"];
};
export {};
//# sourceMappingURL=jwt.d.ts.map