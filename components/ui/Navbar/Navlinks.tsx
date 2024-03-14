'use client';

import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { useRouter } from 'next/navigation';
import s from './Navbar.module.css';
import { useAuth } from '@/app/authContext';

export default function Navlinks() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleSignOut = async ()=> {
    try {
    await fetch('/api/logout', {  
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      });
      if (window.location.pathname === '/') {
        window.location.reload();
      } else {
        router.replace('/');
      }
      
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
      <div className="flex items-center flex-1">
        <Link href="/" className={s.logo} aria-label="Logo">
          <Logo />
        </Link>
        <nav className="ml-6 space-x-2 lg:block">
          <Link href="/pricing" className={s.link}>
            Pricing
          </Link>
        </nav>
      </div>
      <div className="flex justify-end space-x-8">
        <Link href="/account" className={s.link}>
          Account
        </Link>
        {isLoggedIn && (
          <button onClick={handleSignOut} className={s.link}>
          Sign out
        </button>
        )}
      </div>
    </div>
  );
}
