"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const REFRESH_PATH = '/auth/refresh';
const secure = process.env.NODE_ENV !== "development";
const { fifteenMinutesFromNow, thirtyDaysFromNow } = require('./date');
const defaults = {
    sameSite: "strict",
    httpOnly: true,
    secure
};
const getAccessTokenCookieOptions = () => ({
    ...defaults,
    expires: fifteenMinutesFromNow()
});
const getRefreshTokenCookieOptions = () => ({
    ...defaults,
    expires: thirtyDaysFromNow(),
    path: REFRESH_PATH
});
const setAuthCookies = ({ res, accessToken, refreshToken }) => res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
const clearAuthCookies = (res) => res.clearCookie("accessToken").clearCookie('refreshToken', {
    path: REFRESH_PATH
});
module.exports = { setAuthCookies, clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, REFRESH_PATH };
//# sourceMappingURL=cookies.js.map