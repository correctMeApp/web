// utils/auth-helpers/tokenHandling.ts
import { cookies } from 'next/headers';

export function setTokens(accessToken: string, refreshToken: string) {
  cookies().set('accessToken', accessToken, {
    maxAge: 60 * 60, // one hour
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false, // prevent client-side access
    sameSite: 'lax', // prevent cross-site requests
  });

  cookies().set('refreshToken', refreshToken, {
    maxAge: 60 * 60 * 24 * 5, // 5 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false, // prevent client-side access
    sameSite: 'lax', // prevent cross-site requests
  });

  // const accessTokenCookie = serialize('accessToken', accessToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   sameSite: 'lax',
  //   expires: new Date(Date.now() + 60 * 60 * 1000),
  //   path: '/',
  // });

  // const refreshTokenCookie = serialize('refreshToken', refreshToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   sameSite: 'lax',
  //   expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  //   path: '/',
  // });
}

export function clearTokens() {
  cookies().delete('accessToken');
  cookies().delete('refreshToken');
}