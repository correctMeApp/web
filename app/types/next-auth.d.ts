import { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    id_token?: string;
  }
}