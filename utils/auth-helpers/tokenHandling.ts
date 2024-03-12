// utils/auth-helpers/tokenHandling.ts

import { serialize } from 'cookie';

export function setTokens(accessToken: string, refreshToken: string) {
  const accessTokenCookie = serialize('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(Date.now() + 60 * 60 * 1000),
    path: '/',
  });

  const refreshTokenCookie = serialize('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    path: '/',
  });

  return [accessTokenCookie, refreshTokenCookie];
}

export function clearTokens() {
  const accessTokenCookie = serialize('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });

  const refreshTokenCookie = serialize('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });

  return [accessTokenCookie, refreshTokenCookie];
}