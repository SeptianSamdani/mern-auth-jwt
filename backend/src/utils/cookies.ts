import type { Response, CookieOptions } from "express";

const REFRESH_PATH = '/auth/refresh'; 
const secure = process.env.NODE_ENV !== "development"; 
const { fifteenMinutesFromNow, thirtyDaysFromNow } = require('./date'); 

const defaults: CookieOptions = {
    sameSite: "strict", 
    httpOnly: true, 
    secure
}

const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults, 
    expires: fifteenMinutesFromNow()
})

const getRefreshTokenCookieOptions = (): CookieOptions => ({
    ...defaults, 
    expires: thirtyDaysFromNow(), 
    path: REFRESH_PATH
})

type Params = {
    res: Response; 
    accessToken: string; 
    refreshToken: string; 
}

const setAuthCookies = ({ res, accessToken, refreshToken }:Params ) => 
    res
        .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
        .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions()); 

const clearAuthCookies = (res: Response) => 
    res.clearCookie("accessToken").clearCookie('refreshToken', {
        path: REFRESH_PATH
    })

module.exports = { setAuthCookies, clearAuthCookies }; 
