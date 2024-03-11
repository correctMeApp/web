'use client';

import Button from '@/components/ui/Button';
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';

type OAuthProviders = {
  name: string;
  displayName: string;
  icon: JSX.Element;
};

export default function OauthSignIn() {
  const oAuthProviders: OAuthProviders[] = [
    {
      name: 'google',
      displayName: 'Continue with Google',
      icon: <FcGoogle className="h-5 w-5" />
    }
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = (providerName: string) => {
    setIsSubmitting(true);
    signIn('google', { callbackUrl: 'http://localhost:3000/api/auth/callback/google' });
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
