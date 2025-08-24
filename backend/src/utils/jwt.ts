const SessionDocument = require('../models/session.model');
const UserDocument = require('../models/user.model');


type SessionDocument = typeof SessionDocument[keyof typeof SessionDocument];
type UserDocument = typeof UserDocument[keyof typeof UserDocument];

type RefreshTokenPayload = {
    sessionId: SessionDocument['_id'];
}

type AccessTokenPayload = {
    userId: UserDocument['_id'];
    sessionId: SessionDocument['_id'];
}

const signToken = {
    payload: 
}

module.exports = { signToken };