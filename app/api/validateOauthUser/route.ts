// pages/api/validateOauthUser/route.ts
import { getBackendURL, postData } from '@/utils/helpers';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const { email, name, idToken, provider } = reqBody;

  try {
    const response = await postData({
      url: getBackendURL('/auth/token'),
      data: { name, email, idToken, provider },
      authenticated: false,
      req,
    });

    const { accessToken, refreshToken } = response.data;

    return new Response('ok', {
      status: 200,
      headers: {
        ...cookies().set('accessToken', accessToken, { path: '/', httpOnly: true, sameSite: 'strict' }),
        ...cookies().set('refreshToken', refreshToken, { path: '/', httpOnly: true, sameSite: 'strict' }),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {status: 500, headers: { 'Content-Type': 'application/json' }})
    }
    // If it's not an Error object, return a generic error message
    return new Response(JSON.stringify({ message: 'An error occurred while verifying OTP' }), {status: 500, headers: { 'Content-Type': 'application/json' }})
  }
}