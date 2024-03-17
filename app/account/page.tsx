'use client'
import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/ui/AccountForms/EmailForm';
import NameForm from '@/components/ui/AccountForms/NameForm';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/authContext';
import { useEffect, useState } from 'react';

export default function Account() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<{ 
    email: string,
    name?: string,
    subscription: { stripeId?: string, expirationDate?: string, type: string }
     } | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      return router.replace('/auth/signin?redirect=account');
    } else {

      // Fetch user profile
      fetch('/api/user/profile')
      .then(response => response.json())
      .then((user) => {
        setUser(user);
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
          {user && <CustomerPortalForm user={user} />}
          <NameForm userName={user?.name ?? ''}/>
          <EmailForm userEmail={user?.email ?? ''} />
        </div>
      </>
      )}
    </section>
  );
}
