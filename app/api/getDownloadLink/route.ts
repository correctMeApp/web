// app/api/request-otp/route.ts

import { isValidEmail } from '@/utils/auth-helpers/server';
import { getBackendURL } from '@/utils/helpers';
import { postData } from '@/utils/httpOperations';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const email = reqBody.email;

  console.log(await isValidEmail(email))

  if (!(await isValidEmail(email))) {
    return new Response(JSON.stringify({ message: 'Invalid email' }), {status: 400,
         headers: { 'Content-Type': 'application/json' }});
  }

  try {
    await postData({
      url: getBackendURL('/metadata/downloadLink'),
      data: { email },
      authenticated: false,
      req,
    });

    return new Response('ok', {status: 200,})
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {status: 500, headers: { 'Content-Type': 'application/json' }})
    }
    // If it's not an Error object, return a generic error message
    return new Response(JSON.stringify({ message: 'An error occurred while sending the download link' }), {status: 500, headers: { 'Content-Type': 'application/json' }})
  }
}