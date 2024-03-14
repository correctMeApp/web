// pages/api/logout/route.ts

import { getBackendURL } from '@/utils/helpers';
import { postData } from '@/utils/postData';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await postData({
      url: getBackendURL('/auth/logout'),
      authenticated: true,
      req,
    });

    // clearTokens();

    return new Response(null, {
      status: 204,
      headers: {
        ...cookies().set('accessToken', '', { path: '/', expires: new Date(0) }),
        ...cookies().set('refreshToken', '', { path: '/', expires: new Date(0) }),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {status: 500, headers: { 'Content-Type': 'application/json' }})
    }
    // If it's not an Error object, return a generic error message
    return new Response(JSON.stringify({ message: 'An error occurred while logging out the user' }), {status: 500, headers: { 'Content-Type': 'application/json' }})
  }
}