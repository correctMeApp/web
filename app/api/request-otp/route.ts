// pages/api/request-otp/route.ts

import { getBackendURL } from '@/utils/helpers';
import { postData } from '@/utils/postData';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const email = reqBody.email;

  try {
    await postData({
      url: getBackendURL('/auth/request-otp'),
      data: { email },
      authenticated: false,
      req,
    });

    return new Response(null, {status: 204,})
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {status: 500, headers: { 'Content-Type': 'application/json' }})
    }
    // If it's not an Error object, return a generic error message
    return new Response(JSON.stringify({ message: 'An error occurred while requesting OTP' }), {status: 500, headers: { 'Content-Type': 'application/json' }})
  }
}