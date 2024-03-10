import Cookies from 'js-cookie';

export const setTokens = (accessToken: string, refreshToken: string) => {
  const isSecureContext = process.env.REACT_APP_ENV === 'prod';

  Cookies.set('accessToken', accessToken, { secure: isSecureContext,
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 60 * 60 * 1000) });
  Cookies.set('refreshToken', refreshToken, { secure: isSecureContext, 
    httpOnly: true,
    sameSite: 'strict', 
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)});
};

export const wipeTokens = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};

export const isUserLoggedIn = () => {
  const accessToken = Cookies.get('accessToken');
  return !!accessToken;
};