import Cookies from "js-cookie";
import { setTokens, wipeTokens, isUserLoggedIn } from "./auth-helpers/tokenHandling";

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

const refreshToken = async () => {
  const refreshUrl = getBackendURL('/auth/refresh');
  const refreshToken = Cookies.get('refreshToken');

  try {
    const res = await fetch(refreshUrl, {
      method: 'POST',
      headers: getCommonHeaders(),
      body: JSON.stringify({ token: refreshToken })
    });

    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);

    return data;
  } catch (error) {
    wipeTokens();
    throw error;
  }
};

export const postData = async ({
  url,
  data,
  authenticated = true
}: {
  url: string;
  data?: Record<string, unknown>;
  authenticated?: boolean;
}) => {
  const headers = getCommonHeaders();

  // If authenticated, add the accessToken from cookies to the headers
  if (authenticated) {
    if (!isUserLoggedIn()) {
      // redirect to login page
      throw new Error('User is not logged in');
    }

    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      headers.append('Authorization', `Bearer ${accessToken}`);
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  });

  if (res.status === 401) {
    // Refresh the token
    const refreshedTokens = await refreshToken();

    // Retry the request with the refreshed token
    headers.set('Authorization', `Bearer ${refreshedTokens.accessToken}`);
    const retryRes = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    const retryData = retryRes.status === 204 ? null : await retryRes.json();
    return { status: retryRes.status, data: retryData };
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
