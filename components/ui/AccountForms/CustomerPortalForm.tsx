'use client';

import Button from '@/components/ui/Button';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '@/utils/stripe/server';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Stripe from 'stripe';

interface Props {
  subscription: Stripe.Subscription | null,
  user: { email: string, name?: string, subscription: { stripdeId?: string } }
}

export default function CustomerPortalForm({ user, subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.items.data[0].price.currency.toUpperCase(),
      minimumFractionDigits: 0
    }).format((subscription?.items?.data[0].price.unit_amount || 0) / 100);

    const handleStripePortalRequest = () => {
      setIsSubmitting(true);
      createStripePortal(currentPath, user)
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
        subscription
          ? 'Manage your subscription on Stripe Customer Portal'
          : 'You are not currently subscribed to any plan.'
      }
      footer={
        subscription ? (
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
