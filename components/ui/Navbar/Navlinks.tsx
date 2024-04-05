'use client';

import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import s from './Navbar.module.css';
import { useAuth } from '@/app/authContext';

export default function Navlinks() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isHomePage = pathname === '/';
  const linkClass = isHomePage ? s.homeLink : s.subpageLink;

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
    <div className={`relative flex flex-row justify-between py-4 align-center md:py-6`}>
      <div className="flex items-center flex-1">
        {!isHomePage && (
          <Link href="/" className={s.logo} aria-label="Logo">
            <Logo/>
          </Link>
        )}
        <nav className="ml-6 space-x-4 lg:block">
          {/* <Link href="/pricing"  */}
          <Link href="/pricing"
          className={`${linkClass} active:text-opacity-50`}>
            Pricing
          </Link>
          {/* <Link href="/Duck_it.dmg" 
            download  */}
          <Link href="/#download"
            className={`${linkClass} px-4 py-2`}>
            Download
          </Link>
        </nav>
      </div>
      <div className="flex justify-end space-x-8">
        <Link href="/account" className={`${linkClass} active:text-opacity-50`}>
            Account
        </Link>
        {isLoggedIn && (
          <button onClick={handleSignOut} className={`${linkClass} active:text-opacity-50`}>
          Sign out
          </button>
        )}
      </div>
    </div>
  );
}
