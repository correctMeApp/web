'use client';

import Button from '@/components/ui/Button';
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { getURL } from '@/utils/helpers';

type OAuthProviders = {
  name: string;
  displayName: string;
  icon: JSX.Element;
};

type OAuthSignInProps = {
  initialIsSubmitting?: boolean;
  redirectPath?: string
};

export default function OauthSignIn({ initialIsSubmitting = false, redirectPath = '/' }: OAuthSignInProps) {
  const oAuthProviders: OAuthProviders[] = [
    {
      name: 'google',
      displayName: 'Continue with Google',
      icon: <FcGoogle className="h-5 w-5" />
    }
  ];
  const [isSubmitting, setIsSubmitting] = useState(initialIsSubmitting);

  const handleSignIn = (providerName: string) => {
    setIsSubmitting(true);signIn(providerName, { callbackUrl: getURL(`/auth/signin?googleSignIn=true&redirect=${redirectPath}`) });
  };

  return (
  <div className="mt-8">
    {oAuthProviders.map((provider) => (
      <Button
        key={provider.name}
        variant="slim"
        type="button"
        className="w-full pb-2"
        onClick={() => handleSignIn(provider.name)}
        loading={isSubmitting}
      >
        <span className="mr-2">{provider.icon}</span>
        <span>{provider.displayName}</span>
      </Button>
    ))}
  </div>
);
}
