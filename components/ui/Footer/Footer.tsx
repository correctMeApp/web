import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { FaSlack } from 'react-icons/fa'; // import the slack icon

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] bg-slate-900">
      <div className="px-6 grid grid-cols-1 gap-2 py-12 text-white transition-colors duration-150 border-b lg:grid-cols-6 border-zinc-600 bg-slate-950">
        <div className="col-span-1 lg:col-span-1">
          <Link
            href="/"
            className="flex items-center flex-initial font-bold"
          >
            <span className="mr-2 border rounded-full border-zinc-700">
              <Logo />
            </span>
            <span>Duck it!</span>
          </Link>
        </div>
        <div className="col-span-1 lg:col-span-1 lg:col-start-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className="font-bold text-white transition duration-150 ease-in-out hover:text-zinc-200">
                LEGAL
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/privacy"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                Privacy Policy
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/terms"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                Terms of Use
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/imprint"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                Imprint
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-6 lg:col-start-12  text-right">
          <div className="mb-4">
            <p className="font-bold text-white transition duration-150 ease-in-out hover:text-zinc-200">
              Feedback & questions?
            </p>
            <a href="mailto:hi@useduckit.app" className="text-white transition duration-150 ease-in-out hover:text-zinc-200">
              hi@useduckit.app
            </a>
          </div>
        <div>
          <a href="https://join.slack.com/t/duck-it-workspace/shared_invite/zt-2fsu1ji02-ESBGtpjm2JLJgtWgq2M~QA" className="px-4 py-2 bg-slate-800 rounded-full active:text-opacity-50 flex items-center text-white transition duration-150 ease-in-out hover:text-zinc-200">
            <span>Join our community!</span>
            <FaSlack size={24} className="ml-2" />
          </a>
        </div>
      </div>
      </div>
      <div className="px-6 flex flex-col items-center justify-between py-12 space-y-4 md:flex-row bg-slate-950">
        <div>
          <span>
            &copy; {new Date().getFullYear()} Duck it! All rights reserved.
          </span>
        </div>
        <div className="flex items-center">
        </div>
      </div>
    </footer>
  );
}