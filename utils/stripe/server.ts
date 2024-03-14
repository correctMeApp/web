import { stripe } from '@/utils/stripe/config';
import { createClient } from '@/utils/supabase/server';
import {
  getURL,
  getErrorRedirect
} from '@/utils/helpers';


export async function createStripePortal(currentPath: string) {
  try {
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      if (error) {
        console.error(error);
      }
      throw new Error('Could not get user session.');
    }

    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || ''
      });
    } catch (err) {
      console.error(err);
      throw new Error('Unable to access customer record.');
    }

    if (!customer) {
      throw new Error('Could not get customer.');
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

const createOrRetrieveCustomer = async ({
  email,
  uuid,
  stripeCustomerId
}: {
  email: string;
  uuid: string;
  stripeCustomerId?: string | null;
}) => {

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
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingStripeCustomerId !== stripeCustomerId) {
      const response = await fetch('/api/updateStripeId', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      console.warn(
        `User record mismatched Stripe ID. User record updated.`
      );
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return existingStripeCustomerId;
  } else {
    console.warn(
      `Supabase customer record was missing. A new record was created.`
    );

    console.log('stripeIdToInsert', stripeIdToInsert);

    // If Supabase has no record, create a new record and return Stripe customer ID
    // const upsertedStripeCustomer = await upsertCustomerToSupabase(
    //   uuid,
    //   stripeIdToInsert
    // );
    // if (!upsertedStripeCustomer)
    //   throw new Error('Supabase customer record creation failed.');

    return stripeIdToInsert;
  }
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error('Stripe customer creation failed.');

  return newCustomer.id;
};