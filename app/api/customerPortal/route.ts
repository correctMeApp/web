// pages/api/customerPortal.js
import { createStripePortal } from '@/utils/stripe/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    const reqBody = await req.json();
    const { currentPath, user } = reqBody;
    try {
        const redirectUrl = await createStripePortal(currentPath, user);
        return new Response(JSON.stringify(redirectUrl), {status: 200,})
    } catch (error) {
        if (error instanceof Error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500, headers: { 'Content-Type': 'application/json' }})
        }
        // If it's not an Error object, return a generic error message
        return new Response(JSON.stringify({ message: 'An error occurred while creating stripe customer portal' }), {status: 500, headers: { 'Content-Type': 'application/json' }})
    }
}