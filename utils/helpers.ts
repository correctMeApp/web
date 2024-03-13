import { NextRequest } from "next/server";
import { cookies } from 'next/headers';

export const getURL = (path: string = '') => {
  // Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL &&
    process.env.NEXT_PUBLIC_SITE_URL.trim() !== ''
      ? process.env.NEXT_PUBLIC_SITE_URL
      : // If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
        process?.env?.NEXT_PUBLIC_VERCEL_URL &&
          process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''
        ? process.env.NEXT_PUBLIC_VERCEL_URL
        : // If neither is set, default to localhost for local development.
          'http://localhost:3000/';

  // Trim the URL and remove trailing slash if exists.
  url = url.replace(/\/+$/, '');
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Ensure path starts without a slash to avoid double slashes in the final URL.
  path = path.replace(/^\/+/, '');

  // Concatenate the URL and the path.
  return path ? `${url}/${path}` : url;
};

export const getBackendURL = (path: string = '') => {
  let url = process.env.NEXT_PUBLIC_BACKEND_URL as string

  // Trim the URL and remove trailing slash if exists.
  url = url.replace(/\/+$/, '');
  // Ensure path starts without a slash to avoid double slashes in the final URL.
  path = path.replace(/^\/+/, '');

  // Concatenate the URL and the path.
  return path ? `${url}/${path}` : url;
};

// Function to apply common headers
const getCommonHeaders = () => {
  return new Headers({ 'Content-Type': 'application/json', 'x-client-type': 'web'});
};

const refreshToken = async (req: NextRequest) => {
  const currentRefreshToken = cookies().get('refreshToken')?.value

  console.log('refreshToken', refreshToken)

  try {
    const response = await postData({
      url: getBackendURL('/auth/refresh'),
      data: { token: currentRefreshToken },
      authenticated: false,
      req,
    });

    const { accessToken, refreshToken } = response.data;

    return new Response(null, {
      status: 204,
      headers: {
        ...cookies().set('accessToken', accessToken, { path: '/', httpOnly: true, sameSite: 'strict' }),
        ...cookies().set('refreshToken', refreshToken, { path: '/', httpOnly: true, sameSite: 'strict' }),
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }),
       {status: 500,
        headers: { 'Content-Type': 'application/json' ,
        ...cookies().set('accessToken', '', { path: '/', expires: new Date(0) }),
        ...cookies().set('refreshToken', '', { path: '/', expires: new Date(0) })
        }})
    }
    // If it's not an Error object, return a generic error message
    return new Response(JSON.stringify({ message: 'An error occurred while refreshing tokens' }),  
    {status: 500,
      headers: { 'Content-Type': 'application/json' ,
      ...cookies().set('accessToken', '', { path: '/', expires: new Date(0) }),
      ...cookies().set('refreshToken', '', { path: '/', expires: new Date(0) })
      }})
  }
};

export const postData = async ({
  url,
  data,
  authenticated = true,
  req
}: {
  url: string;
  data?: Record<string, unknown>;
  authenticated?: boolean;
  req?: NextRequest;
}) => {
  const headers = getCommonHeaders();

  // If authenticated, add the accessToken from cookies to the headers
  if (authenticated && req) {

    const accessToken = cookies().get('accessToken')?.value
    console.log(`postdata accessToken: ${accessToken}`);

    Object.entries(cookies).forEach(([name, value]) => {
      console.log(`postdata Cookie name: ${name}, Cookie value: ${value}`);
    });

    // Check if the access token exists and if it's in the correct format
    if (accessToken && accessToken.split('.').length === 3) {
      headers.append('Authorization', `Bearer ${accessToken}`);
    } else {
      throw new Error('Invalid or expired access token');
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
    credentials: 'same-origin',
  });

  if (res.status === 401 && req) {
    // Refresh the token
    await refreshToken(req);

    // Retry the request with the new token from cookies
    const accessToken = cookies().get('accessToken')?.value

    // Check if the access token exists and if it's in the correct format
    if (accessToken && accessToken.split('.').length === 3) {
      headers.append('Authorization', `Bearer ${accessToken}`);
    } else {
      throw new Error('Invalid or expired access token');
    }

    const retryRes = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
      credentials: 'same-origin',
    });

    if (!retryRes.ok) {
      const errorData = await retryRes.json();
      throw new Error(errorData.error || 'An error occurred');
    }

    const retryData = retryRes.status === 204 ? null : await retryRes.json();
    return { status: retryRes.status, data: retryData };
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'An error occurred');
  }

  const resData = res.status === 204 ? null : await res.json();
  return { status: res.status, data: resData };
};

export const calculateTrialEndUnixTimestamp = (
  trialPeriodDays: number | null | undefined
) => {
  // Check if trialPeriodDays is null, undefined, or less than 2 days
  if (
    trialPeriodDays === null ||
    trialPeriodDays === undefined ||
    trialPeriodDays < 2
  ) {
    return undefined;
  }

  const currentDate = new Date(); // Current date and time
  const trialEnd = new Date(
    currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000
  ); // Add trial days
  return Math.floor(trialEnd.getTime() / 1000); // Convert to Unix timestamp in seconds
};

const toastKeyMap: { [key: string]: string[] } = {
  status: ['status', 'status_description'],
  error: ['error', 'error_description']
};

const getToastRedirect = (
  path: string,
  toastType: string,
  toastName: string,
  toastDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
): string => {
  const [nameKey, descriptionKey] = toastKeyMap[toastType];

  let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`;

  if (toastDescription) {
    redirectPath += `&${descriptionKey}=${encodeURIComponent(toastDescription)}`;
  }

  if (disableButton) {
    redirectPath += `&disable_button=true`;
  }

  if (arbitraryParams) {
    redirectPath += `&${arbitraryParams}`;
  }

  return redirectPath;
};

export const getStatusRedirect = (
  path: string,
  statusName: string,
  statusDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
) =>
  getToastRedirect(
    path,
    'status',
    statusName,
    statusDescription,
    disableButton,
    arbitraryParams
  );

export const getErrorRedirect = (
  path: string,
  errorName: string,
  errorDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
) =>
  getToastRedirect(
    path,
    'error',
    errorName,
    errorDescription,
    disableButton,
    arbitraryParams
  );
