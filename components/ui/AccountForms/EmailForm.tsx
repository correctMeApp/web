'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EmailForm({
  userEmail
}: {
  userEmail: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newValue = e.currentTarget.newEmail.value;
    console.log('newValue:', newValue);
    if (newValue === userEmail || newValue === '') {
      setIsSubmitting(false);
      return;
    }

    handleEmailUpdate(userEmail, newValue);
  };

  const handleEmailUpdate = (currentEmail: string, newEmail: string) => {
    fetch('/api/user/updateEmail', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentEmail, newEmail }),
      credentials: 'include',
    })
    .then(response => {
      setIsSubmitting(false);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to update email');
      }
    })
    .then(_ => {
      router.refresh();
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <Card
      title="Your Email"
      description="Please enter the email address you want to use to login."
    >
      <form id="emailForm" onSubmit={(e) => handleSubmit(e)}>
        <div className="flex items-center justify-between mt-8 mb-4">
          <input
            type="text"
            name="newEmail"
            className="w-1/2 p-3 text-xl font-semibold rounded-md bg-zinc-800"
            defaultValue={userEmail ?? ''}
            placeholder="Your email"
            maxLength={64}
          />
          <div className="w-4"></div> {/* This is the spacer */}
          <Button
            variant="slim"
            type="submit"
            loading={isSubmitting}
          >
            Update Email
          </Button>
        </div>
      </form>
    </Card>
  );
}
