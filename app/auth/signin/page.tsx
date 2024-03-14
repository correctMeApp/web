'use client'

import Logo from '@/components/icons/Logo';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import EntryForm from '@/components/ui/AuthForms/EntryForm';
import Separator from '@/components/ui/AuthForms/Separator';
import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/Toasts/use-toast';
import { useSession } from 'next-auth/react';
import { getURL } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

type ToastParams = {
  title: string;
  description: string;
  variant: 'destructive' | 'default' | null;
};

export default function SignIn({
  searchParams
}: {
  searchParams: { disable_button: boolean, googleSignIn: boolean};
}) {
  const redirectMethod = getRedirectMethod();
  const { isOtpGenerated, setIsOtpGenerated, requestOtp, verifyOtp } = useOtp();
  const [email, setEmail] = useState('');
  const [toastParams, setToastParams] = useState<ToastParams | null>(null);
  const [hasValidatedUser, setHasValidatedUser] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (toastParams) {
      toast(toastParams);
    }

    if (searchParams.googleSignIn && session && !hasValidatedUser) {
      setHasValidatedUser(true);
      fetch(getURL('/api/validateOauthUser'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          idToken: session?.id_token,
          name: session?.user?.name,
          provider: 'google'
        }),
        credentials: 'same-origin',
      })
      .then(response => {
        if (response.ok) {
          router.push('/');
        } else {
          console.log('Failed to validate user');
          setToastParams({
            title: 'Oops! Something went wrong.',
            description: 'Please sign in again with Google',
            variant: 'destructive'
          });
          router.replace('/auth/signin');
        }
      });
    }
  }, [toastParams, session]);

  const handleEmailSubmit = async (e: any, router: any) => {
    e.preventDefault();
    const email = e.currentTarget.elements.email.value;
    setEmail(email);

    try {
      await requestOtp({ email });
      setIsOtpGenerated(true);
    } catch (error) {
      setIsOtpGenerated(false);
      setToastParams({
        title: 'Oops! Something went wrong.',
        description: 'Please request a new OTP to your email',
        variant: 'destructive'
      });
      router.replace('/auth/signin');
    }
  };

  const handleOtpSubmit = async (e: any, router: any) => {
    e.preventDefault();
    const otp = e.currentTarget.elements.otp.value;
    try {
      const result = await verifyOtp({ email, otp });
      router.replace(result);
    } catch (error) {
      setIsOtpGenerated(false);
      setToastParams({
        title: 'Oops! Something went wrong.',
        description: 'Please request a new OTP to your email',
        variant: 'destructive'
      });
      router.replace('/auth/signin');
    }
  };

  return (
    <div className="justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-md p-3 m-auto w-100 ">
        <div className="flex justify-center pb-12 ">
          <Logo width="64px" height="64px" />
        </div>
        {!isOtpGenerated ? (
          <>
          <div className="mb-4">
            <OauthSignIn/>
          </div>
          <Separator
              text="or continue with a one-time password" />
          <EntryForm
              redirectMethod={redirectMethod}
              disableButton={searchParams.disable_button}
              onSubmit={handleEmailSubmit}
              inputLabel="Email"
              inputPlaceholder="Enter your email"
              inputType="email"
              inputName="email"
              ctaLabel="Continue" />
          </>
      ) : (
        <>
          <EntryForm
            redirectMethod={redirectMethod}
            disableButton={searchParams.disable_button}
            onSubmit={handleOtpSubmit}
            inputLabel="One Time Password Verification"
            inputPlaceholder="Enter the OTP code sent to your email"
            inputType="text"
            inputName="otp"
            ctaLabel="Verify OTP"
          />
          <button style={{textAlign: 'left'}} className="font-light text-sm text-left" onClick={() => setIsOtpGenerated(false)}>
            Choose a different method to continue ?
          </button>
        </>
      )}
      </div>
    </div>
  );
}


function useOtp() {
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);

  const requestOtp = async ({ email }: { email: string }) => {

    const response = await fetch('/api/request-otp', {  
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
      });
  
    if (response.status !== 204) {
      throw new Error('Failed to generate OTP');
    }
  };

  const verifyOtp = async ({ email, otp }: { email: string; otp: string }) => {

    const response = await fetch('/api/verify-otp', {  
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
      });

    if (!response.ok) {
      throw new Error('Failed to verify OTP');
    }
  
    return '/';
  };

  return { isOtpGenerated, setIsOtpGenerated, requestOtp, verifyOtp };
}