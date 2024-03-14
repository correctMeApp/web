// app/api/user/profile/route.ts

import { getBackendURL } from '@/utils/helpers';
import { getData } from '@/utils/httpOperations';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const result = await getData({
      url: getBackendURL('/user/profile'),
      authenticated: true,
      req,
    });

    return new Response(JSON.stringify(result.data), {status: 200,})
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {status: 500, headers: { 'Content-Type': 'application/json' }})
    }
    // If it's not an Error object, return a generic error message
    return new Response(JSON.stringify({ message: 'An error occurred while requesting OTP' }), {status: 500, headers: { 'Content-Type': 'application/json' }})
  }
}