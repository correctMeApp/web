// pages/api/verify-otp/route.ts

import { getBackendURL, postData } from '@/utils/helpers';
import { setTokens } from '@/utils/auth-helpers/tokenHandling'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const { email, otp } = reqBody;

  try {
    const response = await postData({
      url: getBackendURL('/auth/verify-otp'),
      data: { email, otp },
      authenticated: false,
      req,
    });

    const { accessToken, refreshToken } = response.data;

    const cookies = setTokens(accessToken, refreshToken);
    const headers = new Headers();
    cookies.forEach(cookie => headers.append('Set-Cookie', cookie));

    return new Response(null, {
      status: 204,
      headers,
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {status: 500, headers: { 'Content-Type': 'application/json' }})
    }
    // If it's not an Error object, return a generic error message
    return new Response(JSON.stringify({ message: 'An error occurred while verifying OTP' }), {status: 500, headers: { 'Content-Type': 'application/json' }})
  }
}