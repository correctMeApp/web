'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NameFormProps {
  userName: string;
}

export default function NameForm({ userName }: NameFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newValue = e.currentTarget.fullName.value;
    if (newValue === userName || newValue === '') {
      setIsSubmitting(false);
      return;
    }

    handleNameUpdate(userName, newValue);
  };

  const handleNameUpdate = (currentName: string, newName: string) => {
    fetch('/api/user/updateName', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentName, newName }),
      credentials: 'include',
    })
    .then(response => {
      setIsSubmitting(false);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to update name');
      }
    })
    .then(_ => {
      router.refresh();
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <Card
      title="Your Name"
      description="Please enter your full name, or a display name you are comfortable with."
    >
      <form id="nameForm" onSubmit={(e) => handleFormSubmit(e)}>
        <div className="flex items-center justify-between mt-8 mb-4">
          <input
            type="text"
            name="fullName"
            className="w-1/2 p-3 text-xl font-semibold rounded-md bg-zinc-800"
            defaultValue={userName}
            placeholder="Your name"
            maxLength={64}
          />
          <div className="w-4"></div> {/* This is the spacer */}
          <Button
            variant="slim"
            type="submit"
            loading={isSubmitting}
          >
            Update Name
          </Button>
        </div>
      </form>
    </Card>
  );
}
