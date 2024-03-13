// pages/api/isLoggedIn.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  if (cookies().get('accessToken')?.value) {
    console.log('User is logged in');
    return new Response(JSON.stringify({ isLoggedIn: true }));
  } else {
    console.log('User is not logged in');
    return new Response(JSON.stringify({ isLoggedIn: false }));
  }
}