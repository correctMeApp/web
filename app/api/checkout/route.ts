import Stripe from 'stripe';
import { stripe } from '@/utils/stripe/config';
import { getURL, calculateTrialEndUnixTimestamp } from '@/utils/helpers';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function createCustomerInStripe(uuid: string, email: string) {
    const customerData = { metadata: { supabaseUUID: uuid }, email: email };
    const newCustomer = await stripe.customers.create(customerData);
    if (!newCustomer) throw new Error('Stripe customer creation failed.');
  
    return newCustomer.id;
  };
  
async function createOrRetrieveCustomer({ uuid, email, stripeCustomerId }: { uuid: string; email: string; stripeCustomerId: string; }) {
    var existingStripeCustomerId;
    // Retrieve the Stripe customer ID using the uuid, with email fallback
    if (stripeCustomerId) {
        const existingStripeCustomer = await stripe.customers.retrieve(stripeCustomerId);
        existingStripeCustomerId = existingStripeCustomer.id;
    } else {
        // If Stripe ID is missing from the user, try to retrieve Stripe customer ID by email
        const stripeCustomers = await stripe.customers.list({ email: email });
        existingStripeCustomerId =
        stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
    }

    console.log('existingStripeCustomerId', existingStripeCustomerId);

    // If still no stripeCustomerId, create a new customer in Stripe
    const stripeIdToInsert = existingStripeCustomerId
        ? existingStripeCustomerId
        : await createCustomerInStripe(uuid, email);
    if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

    if (existingStripeCustomerId) {
        // If user exists doesn't match Stripe, update user
        if (existingStripeCustomerId !== stripeCustomerId) {
            console.log('user does not match Stripe, updating user');
            const accessToken = cookies().get('accessToken')?.value
            const response = await fetch(getURL('/api/user/updateStripeId'), {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie': `accessToken=${accessToken};` 
                },
                body: JSON.stringify({
                email: email,
                stripeCustomerId: existingStripeCustomerId
                }),
                credentials: 'include'
            });
          
          if (!response.ok) {
            const responseData = await response.json();
            throw new Error(`User record update failed: ${responseData.error}`);
          }
        }
        return existingStripeCustomerId;
    } else {
        throw new Error('User not exist.');
    }
};

export async function POST(req: NextRequest, res: NextResponse) {
    try {
      const reqBody = await req.json();
      const { user, price, redirectPath } = reqBody;

      console.log('price', price);
      console.log('user', user);
  
      let customer: string;
      try {
        customer = await createOrRetrieveCustomer({
          uuid: user?.id || '',
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
        line_items: [
          {
            price: price.id,
            quantity: 1
          }
        ],
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