'use client'

import Logo from '@/components/icons/Logo';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import EntryForm from '@/components/ui/AuthForms/EntryForm';
import Separator from '@/components/ui/AuthForms/Separator';
import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn';
import { useState } from 'react';
import { getBackendURL, postData, getErrorRedirect } from '@/utils/helpers';
import { setTokens } from '@/utils/auth-helpers/tokenHandling';

export default function SignIn({
  searchParams
}: {
  searchParams: { disable_button: boolean };
}) {
  const redirectMethod = getRedirectMethod();
  const { isOtpGenerated, setIsOtpGenerated, requestOtp, verifyOtp } = useOtp();
  const [email, setEmail] = useState('');

  const handleEmailSubmit = async (e: any, router: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email')?.toString() ?? '';
    setEmail(email);

    try {
      await requestOtp(formData);
      setIsOtpGenerated(true);
    } catch (error) {
      setIsOtpGenerated(false);
      router.replace(
        getErrorRedirect(
          '/signin',
          'Oops! Something went wrong.',
          'Please request a new OTP to your email'
        )
      );
    }
  };

  const handleOtpSubmit = async (e: any, router: any) => {
    const formData = new FormData(e.currentTarget);
    formData.append('email', email);
    e.preventDefault();
    try {
      const result = await verifyOtp(formData);
      router.replace(result);
    } catch (error) {
      setIsOtpGenerated(false);
      router.replace(
        getErrorRedirect(
          '/signin',
          'Oops! Something went wrong.',
          'Please request a new OTP to your email'
        )
      );
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

  const requestOtp = async (formData: FormData) => {
    const email = formData.get('email');
    const response = await postData({
      url: getBackendURL('/auth/request-otp'),
      data: { email: email },
      authenticated: false,
    });
    if (response.status !== 204) {
      throw new Error('Failed to generate OTP');
    }
  };

  const verifyOtp = async (formData: FormData) => {
    const email = formData.get('email');
    const otp = formData.get('otp');

    const response = await postData({
      url: getBackendURL('/auth/verify-otp'),
      data: { email: email, otp: otp },
      authenticated: false,
    });

    console.log('response:', response.data, response.status);

    if (response.status === 200 && response.data) {
      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      return '/';
    } else {
      throw new Error('Failed to verify OTP');
    }
  };

  return { isOtpGenerated, setIsOtpGenerated, requestOtp, verifyOtp };
}