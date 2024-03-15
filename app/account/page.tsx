'use client'
import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/ui/AccountForms/EmailForm';
import NameForm from '@/components/ui/AccountForms/NameForm';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/authContext';
import { useEffect, useState } from 'react';
import { retrieveSubscription } from '@/utils/stripe/server';
import Stripe from 'stripe';

export default function Account() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Stripe.Subscription | null>(null);
  const [user, setUser] = useState<{ 
    email: string,
    name?: string,
    subscription: { stripdeId?: string },
    stripeCustomerId?: String | null
     } | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth/signin');
    } else {

      // Fetch user profile
      fetch('/api/user/profile')
      .then(response => response.json())
      .then((user) => {
        setUser(user);
        if (user.subscription?.stripeId) {
          // Fetch subscription from Stripe
          retrieveSubscription(user.subscription.stripeId)
            .then(subscription => setSubscription(subscription))
            .catch(error => console.error('Failed to retrieve subscription: ', error));
        }
      })
      .catch(error => console.error('Failed to fetch user profile: ', error));
  }
  }, [isLoggedIn, router]);

  return (
    <section className="mb-32 bg-slate-900">
      { isLoggedIn && (
        <>
        <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
          <div className="sm:align-center sm:flex sm:flex-col">
            <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
              Account
            </h1>
            <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
              We partnered with Stripe for a simplified billing.
            </p>
          </div>
        </div>
        <div className="p-4">
          {user && <CustomerPortalForm subscription={subscription} user={user} />}
          <NameForm userName={user?.name ?? ''} />
          <EmailForm userEmail={user?.email} />
        </div>
      </>
      )}
    </section>
  );
}
