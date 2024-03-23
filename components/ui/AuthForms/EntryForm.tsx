'use client';

import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface EntryFormProps {
  redirectMethod: string;
  disableButton?: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>, router: any) => void;
  inputLabel: string;
  inputPlaceholder: string;
  inputType: string;
  inputName: string;
  ctaLabel: string;
}

export default function EntryForm({
  redirectMethod,
  disableButton,
  onSubmit,
  inputLabel,
  inputPlaceholder,
  inputType,
  inputName,
  ctaLabel
}: EntryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    await onSubmit(e, router);
    setIsSubmitting(false);
  };

  return (
    <div className="my-4">
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor={inputName}>{inputLabel}</label>
            <input
              id={inputName}
              placeholder={inputPlaceholder}
              type={inputType}
              name={inputName}
              autoCapitalize="none"
              autoComplete={inputName}
              autoCorrect="off"
              className="w-full p-3 rounded-md bg-gray-800"
            />
          </div>
          <Button
            variant="slim"
            type="submit"
            className="mt-1"
            loading={isSubmitting}
            disabled={disableButton}
          >
            {ctaLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}