'use client'

import Logo from '@/components/icons/Logo';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import EntryForm from '@/components/ui/AuthForms/EntryForm';
import Separator from '@/components/ui/AuthForms/Separator';
import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn';
import { useState } from 'react';
import { getBackendURL, postData } from '@/utils/helpers';

export default function SignIn({
  searchParams
}: {
  searchParams: { disable_button: boolean };
}) {
  const redirectMethod = getRedirectMethod();
  const { isOtpGenerated, setIsOtpGenerated, requestOtp, verifyOtp } = useOtp();
  const [email, setEmail] = useState('');

  // Use handleRequest to handle form submission and redirection
  const handleEmailSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email')?.toString() ?? '';
    setEmail(email);
    const result = await requestOtp(formData);
    if (result && result.success) {
      setIsOtpGenerated(true);
    } else {
      // Handle error (you could show a message to the user, for example)
    }
  };

  const handleOtpSubmit = async (e: any, router: any) => {
    const formData = new FormData(e.currentTarget);
    formData.append('email', email);
    e.preventDefault();
    setEmail(email);
    const result = await verifyOtp(formData);
    result && typeof result === 'string' ? router.push(result) : null;
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
            inputPlaceholder="Enter OTP code sent to your email"
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
    try {
      const response = await postData({
        url: getBackendURL('/auth/request-otp'),
        data: { email: email },
      });
      if (response.status === 204) {
        setIsOtpGenerated(true);
        return { success: true };
      } else {
        throw new Error('Failed to generate OTP');
      }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
    }
  };

  const verifyOtp = async (formData: FormData) => {
    const email = formData.get('email');
    const otp = formData.get('otp');
    console.log('email:', email, 'otp:', otp);
    try {
      const data = await postData({
        url: getBackendURL('/auth/verify-otp'),
        data: { email: email, otp: otp },
      });
      if (data.error) {
        throw new Error(data.error);
      }
      return '/dashboard'; // Return the redirect URL
    } catch (error) {
      return '/error'; // Return the error page URL
    }
  };

  return { isOtpGenerated, setIsOtpGenerated, requestOtp, verifyOtp };
}