'use server';

import { redirect } from 'next/navigation';
import { getErrorRedirect } from 'utils/helpers';

function isValidEmail(email: string) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function updateEmail(formData: FormData) {
  // Get form data
  const newEmail = String(formData.get('newEmail')).trim();

  // Check that the email is valid
  if (!isValidEmail(newEmail)) {
    return getErrorRedirect(
      '/account',
      'Your email could not be updated.',
      'Invalid email address.'
    );
  }

  return '/'

  // const supabase = createClient();

  // const callbackUrl = getURL(
  //   getStatusRedirect('/account', 'Success!', `Your email has been updated.`)
  // );

  // const { error } = await supabase.auth.updateUser(
  //   { email: newEmail },
  //   {
  //     emailRedirectTo: callbackUrl
  //   }
  // );

  // if (error) {
  //   return getErrorRedirect(
  //     '/account',
  //     'Your email could not be updated.',
  //     error.message
  //   );
  // } else {
  //   return getStatusRedirect(
  //     '/account',
  //     'Confirmation emails sent.',
  //     `You will need to confirm the update by clicking the links sent to both the old and new email addresses.`
  //   );
  // }
}

export async function updateName(formData: FormData) {
  // Get form data
  const fullName = String(formData.get('fullName')).trim();

  return '/'

  // const supabase = createClient();
  // const { error, data } = await supabase.auth.updateUser({
  //   data: { full_name: fullName }
  // });

  // if (error) {
  //   return getErrorRedirect(
  //     '/account',
  //     'Your name could not be updated.',
  //     error.message
  //   );
  // } else if (data.user) {
  //   return getStatusRedirect(
  //     '/account',
  //     'Success!',
  //     'Your name has been updated.'
  //   );
  // } else {
  //   return getErrorRedirect(
  //     '/account',
  //     'Hmm... Something went wrong.',
  //     'Your name could not be updated.'
  //   );
  // }
}
