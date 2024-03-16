'use client';

import Button from '@/components/ui/Button';
import { getStripe } from '@/utils/stripe/client';
import { getErrorRedirect } from '@/utils/helpers';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Price, Product, PricingPlanInterval } from '@/app/types/models';
import { useAuth } from '@/app/authContext';

interface Props {
  product: Product;
  prices: Price[];
}

export default function Pricing({ product, prices }: Props) {
  const { isLoggedIn } = useAuth();

  const intervals = Array.from(
    new Set(
      prices.map(price => price.interval)
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<PricingPlanInterval>(PricingPlanInterval.Year);
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
  
    if (!isLoggedIn) {
      setPriceIdLoading(undefined);
      return router.replace('/auth/signin?redirect=pricing');
    }

    const userResponse = await fetch('/api/user/profile', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const user = await userResponse.json();

    if (userResponse.status !== 200) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'Failed to fetch the user',
          'Please try again later.'
        )
      );
    }
  
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, price, redirectPath: currentPath }),
      credentials: 'include'
    });
  
    const { sessionId } = await response.json();
  
    if (!sessionId || response.status !== 200) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'Failed to create stripe session',
          'Please try again later.'
        )
      );
    }
  
    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });
  
    setPriceIdLoading(undefined);
  };

  if (!product) {
    return (
      <section className="bg-slate-900">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
      </section>
    );
  } else {
    return (
      <section className="bg-slate-900">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
              Pricing
            </h1>
            <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
              Start trying for free, supercharge your writing immediately.
            </p>
            <div className="relative self-center mt-6 bg-slate-950 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
              {intervals.includes(PricingPlanInterval.Month) && (
                <button
                  onClick={() => setBillingInterval(PricingPlanInterval.Month)}
                  type="button"
                  className={`${
                    billingInterval === 'month'
                      ? 'relative w-1/2 bg-gray-800 border-zinc-800 shadow-sm text-white'
                      : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                >
                  Monthly
                </button>
              )}
              {intervals.includes(PricingPlanInterval.Year) && (
                <button
                  onClick={() => setBillingInterval(PricingPlanInterval.Year)}
                  type="button"
                  className={`${
                    billingInterval === 'year'
                      ? 'relative w-1/2 bg-gray-800 border-zinc-800 shadow-sm text-white'
                      : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                >
                  Yearly
                </button>
              )}
            </div>
          </div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
            {prices.map((price) => {
              if (price.interval !== billingInterval) return null;
              if (price.product_id !== product.id) return null;
              const priceAmount = price?.unit_amount || 0;
              const formattedPriceAmount = billingInterval === PricingPlanInterval.Year ? priceAmount / 12 : priceAmount;

              const priceString = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: price.currency!,
                minimumFractionDigits: 0
              }).format(formattedPriceAmount / 100);
              return (
                <div
                  key={product.id}
                  className={cn(
                    'flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-gray-800',
                    'flex-1', // This makes the flex item grow to fill the space
                    'basis-1/3', // Assuming you want each card to take up roughly a third of the container's width
                    'max-w-xs' // Sets a maximum width to the cards to prevent them from getting too large
                  )}
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold leading-6 text-white">
                      {product.name}
                    </h2>
                    <p className="mt-4 text-zinc-300">{product.description}</p>
                    <p className="mt-8">
                      <span className="text-5xl font-extrabold white">
                        {priceString}
                      </span>
                      <span className="text-base font-medium text-zinc-100">
                        /month
                      </span>
                    </p>
                    <Button
                      variant="slim"
                      type="button"
                      loading={priceIdLoading === price.id}
                      onClick={() => handleStripeCheckout(price)}
                      className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
                    >
                      {'Try for free'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
}
