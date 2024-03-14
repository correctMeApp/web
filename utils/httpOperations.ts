'use server'
import { NextRequest } from "next/server";
import { cookies } from 'next/headers';
import { getBackendURL } from "./helpers";
import { ok } from "assert";

const getCommonHeaders = () => {
  return new Headers({ 'Content-Type': 'application/json', 'x-client-type': 'web'});
};

const refreshToken = async (req: NextRequest) => {
  const currentRefreshToken = cookies().get('refreshToken')?.value

  try {
    const response = await postData({
      url: getBackendURL('/auth/refresh'),
      data: { token: currentRefreshToken },
      authenticated: false,
      req,
    });

    const { accessToken, refreshToken } = response.data;

    return new Response('ok', {
      status: 204,
      headers: {
        ...cookies().set('accessToken', accessToken, { path: '/', httpOnly: true, sameSite: 'strict' }),
        ...cookies().set('refreshToken', refreshToken, { path: '/', httpOnly: true, sameSite: 'strict' }),
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }),
       {status: 500,
        headers: { 'Content-Type': 'application/json' ,
        ...cookies().set('accessToken', '', { path: '/', expires: new Date(0) }),
        ...cookies().set('refreshToken', '', { path: '/', expires: new Date(0) })
        }})
    }
    // If it's not an Error object, return a generic error message
    return new Response(JSON.stringify({ message: 'An error occurred while refreshing tokens' }),  
    {status: 500,
      headers: { 'Content-Type': 'application/json' ,
      ...cookies().set('accessToken', '', { path: '/', expires: new Date(0) }),
      ...cookies().set('refreshToken', '', { path: '/', expires: new Date(0) })
      }})
  }
};

export const postData = async ({
  url,
  data,
  authenticated = true,
  req
}: {
  url: string;
  data?: Record<string, unknown>;
  authenticated?: boolean;
  req?: NextRequest;
}) => {
  const headers = getCommonHeaders();

  // If authenticated, add the accessToken from cookies to the headers
  if (authenticated && req) {

    const accessToken = cookies().get('accessToken')?.value

    // Check if the access token exists and if it's in the correct format
    if (accessToken && accessToken.split('.').length === 3) {
      headers.append('Authorization', `Bearer ${accessToken}`);
    } else {
      throw new Error('Invalid or expired access token');
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (res.status === 401 && req) {
    // Refresh the token
    const refreshRes = await refreshToken(req);

    if (!refreshRes.ok) {
      return { status: 401, data: null };
    }

    // Retry the request with the new token from cookies
    const accessToken = cookies().get('accessToken')?.value

    // Check if the access token exists and if it's in the correct format
    if (accessToken && accessToken.split('.').length === 3) {
      headers.append('Authorization', `Bearer ${accessToken}`);
    } else {
      throw new Error('Invalid or expired access token');
    }

    const retryRes = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!retryRes.ok) {
      const errorData = await retryRes.json();
      throw new Error(errorData.error || 'An error occurred');
    }

    const retryData = retryRes.status === 204 ? null : await retryRes.json();
    return { status: retryRes.status, data: retryData };
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'An error occurred');
  }

  const resData = res.status === 204 ? null : await res.json();
  return { status: res.status, data: resData };
};

export const getData = async ({
  url,
  authenticated = true,
  req
}: {
  url: string;
  authenticated?: boolean;
  req?: NextRequest;
}) => {
  const headers = getCommonHeaders();

  // If authenticated, add the accessToken from cookies to the headers
  if (authenticated && req) {
    const accessToken = cookies().get('accessToken')?.value

    // Check if the access token exists and if it's in the correct format
    if (accessToken && accessToken.split('.').length === 3) {
      headers.append('Authorization', `Bearer ${accessToken}`);
    } else {
      console.log('Invalid or expired access token');
      throw new Error('Invalid or expired access token');
    }
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: headers,
    credentials: 'include',
  });

  if (res.status === 401 && req) {
    // Refresh the token
    await refreshToken(req);

    // Retry the request with the new token from cookies
    const accessToken = cookies().get('accessToken')?.value

    // Check if the access token exists and if it's in the correct format
    if (accessToken && accessToken.split('.').length === 3) {
      headers.append('Authorization', `Bearer ${accessToken}`);
    } else {
      throw new Error('Invalid or expired access token');
    }

    const retryRes = await fetch(url, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    });

    if (!retryRes.ok) {
      const errorData = await retryRes.json();
      throw new Error(errorData.error || 'An error occurred');
    }

    const retryData = retryRes.status === 204 ? null : await retryRes.json();
    return { status: retryRes.status, data: retryData };
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'An error occurred');
  }

  const resData = res.status === 204 ? null : await res.json();
  return { status: res.status, data: resData };
};