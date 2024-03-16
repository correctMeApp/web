import { stripe } from '@/utils/stripe/config';
import { getURL, getErrorRedirect } from '@/utils/helpers';
import { cookies } from 'next/headers';

export async function createStripePortal(currentPath: string, user: { email: string, stripeCustomerId?: string }) {
  try {
    let customer: string;
      try {
        customer = await createOrRetrieveCustomer({
          email: user?.email || '',
          stripeCustomerId: user?.stripeCustomerId || ''
        });
      } catch (err) {
        throw new Error('Unable to access customer record.' );
      }

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL('/account')
      });
      if (!url) {
        throw new Error('Could not create billing portal');
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error('Could not create billing portal');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return getErrorRedirect(
        currentPath,
        error.message,
        'Please try again later or contact a system administrator.'
      );
    } else {
      return getErrorRedirect(
        currentPath,
        'An unknown error occurred.',
        'Please try again later or contact a system administrator.'
      );
    }
  }
}

export async function createCustomerInStripe(email: string) {
  const customerData = { email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error('Stripe customer creation failed.');

  return newCustomer.id;
};

export async function createOrRetrieveCustomer({ email, stripeCustomerId }: { email: string; stripeCustomerId: string; }) {
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

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = existingStripeCustomerId
      ? existingStripeCustomerId
      : await createCustomerInStripe(email);
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

  if (existingStripeCustomerId) {
    // If user exists on stripe but doesn't match the user in db, update user in db
    if (existingStripeCustomerId !== stripeCustomerId) {
      await updateStripeCustomerId(email, existingStripeCustomerId);
    }
    return existingStripeCustomerId;
  } else {
    // If user doesn't exist on Stripe, use the newly created stripe customer's id to update user in db
    await updateStripeCustomerId(email, stripeIdToInsert);
    return stripeIdToInsert;
  }
};

async function updateStripeCustomerId(email: string, stripeCustomerId: string) {
  const accessToken = cookies().get('accessToken')?.value;
  const response = await fetch(getURL('/api/user/updateStripeId'), {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': `accessToken=${accessToken};` 
    },
    body: JSON.stringify({
      email: email,
      stripeCustomerId: stripeCustomerId
    }),
    credentials: 'include'
  });

  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(`User record update failed: ${responseData.error}`);
  }
}