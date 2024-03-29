import Stripe from 'stripe';
import { stripe } from '@/utils/stripe/config';
import { getURL, calculateTrialEndUnixTimestamp } from '@/utils/helpers';
import { NextRequest, NextResponse } from 'next/server';
import { createOrRetrieveCustomer } from '@/utils/stripe/server';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
      const reqBody = await req.json();
      const { user, price, redirectPath } = reqBody;
  
      let customer: string;
      try {
        customer = await createOrRetrieveCustomer({
          email: user?.email || '',
          stripeCustomerId: user?.stripeCustomerId
        });
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: 'Unable to access customer record.' }), {status: 500, headers: { 'Content-Type': 'application/json' }})
      }
  
      let params: Stripe.Checkout.SessionCreateParams = {
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        customer,
        customer_update: {
          address: 'auto'
        },
        consent_collection: {
          terms_of_service: 'required'
        },
        line_items: [
          {
            price: price.id,
            quantity: 1
          }
        ],
        payment_method_collection: 'if_required',
        automatic_tax: {
          enabled: true
        },
        subscription_data: {
          trial_period_days: price.trial_period_days,
          trial_settings: {
            end_behavior: {
              missing_payment_method: 'pause'
            }
          }
        },
        cancel_url: getURL(),
        success_url: getURL(redirectPath)
      };
  
      if (price.type === 'recurring') {
        params = {
          ...params,
          mode: 'subscription',
          subscription_data: {
            trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days)
          }
        };
      } else if (price.type === 'one_time') {
        params = {
          ...params,
          mode: 'payment'
        };
      }
  
      let session;
      try {
        session = await stripe.checkout.sessions.create(params);
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: 'Unable to create checkout session.' }), {status: 500, headers: { 'Content-Type': 'application/json' }})
      }
  
      if (session) {
        return new Response(JSON.stringify({ sessionId: session.id }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
      } else {
        return new Response(JSON.stringify({ message: 'Unable to create checkout session.' }), {status: 500, headers: { 'Content-Type': 'application/json' }})
      }
    } catch (error) {
      if (error instanceof Error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500, headers: { 'Content-Type': 'application/json' }})
      } else {
        return new Response(JSON.stringify({ message: 'An unknown error occurred.' }), {status: 500, headers: { 'Content-Type': 'application/json' }})
      }
    }
  }