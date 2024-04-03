'use client';

import Button from '@/components/ui/Button';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import Card from '@/components/ui/Card';

interface Props {
  user: { email: string, name?: string, subscription: { stripeId?: string, expirationDate?: string, type: string, superRole?: string | undefined } }
}

export default function CustomerPortalForm({ user }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStripePortalRequest = () => {
      setIsSubmitting(true);
      fetch('/api/customerPortal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPath: currentPath,
          user,
        }),
        credentials: 'include',
      })
      .then(response => response.json())
      .then(redirectUrl => {
        setIsSubmitting(false);
        router.push(redirectUrl);
      })
        .catch(error => {
          setIsSubmitting(false);
          console.error('Failed to create Stripe portal: ', error);
        });
    };

  return (
    <Card
      title="Your Plan"
      description={ 
        user.subscription.superRole
        ? `You have to role "${user.subscription.superRole}" and currently have unlimited usage.`
        : user.subscription.stripeId
        ? `You have an ongoing ${user.subscription.type} subscription ${user.subscription.expirationDate ? ' & ending at ' + new Date(user.subscription.expirationDate).toLocaleDateString() : ''}.`
          : 'You are not currently subscribed to any plan.'
      }
      footer={
        user.subscription.stripeId ? (
          <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <p className="pb-4 sm:pb-0">Manage your subscription on Stripe.</p>
            <Button
              variant="slim"
              onClick={handleStripePortalRequest}
              loading={isSubmitting}
            >
              Open customer portal
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <p className="pb-4 sm:pb-0">See our pricing options</p>
            <Button
              variant="slim"
              onClick={() => router.push('/pricing')}
            >
              Choose your plan
            </Button>
          </div>
        )
      }
    >
      <></>
    </Card>
  );
}
