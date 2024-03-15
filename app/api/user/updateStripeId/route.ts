// app/api/user/updateStripeId/route.ts

import { getBackendURL } from '@/utils/helpers';
import { putData } from '@/utils/httpOperations';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const { email, stripeCustomerId } = reqBody;
  try {
    const result = await putData({
      url: getBackendURL('/user/updateStripeId'),
      authenticated: true,
      data: { stripeCustomerId: stripeCustomerId, email: email },
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