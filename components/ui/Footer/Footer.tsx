import Link from 'next/link';
import { FaSlack } from 'react-icons/fa';
import s from './Footer.module.css';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const styleClass = isHomePage ? s.homeRoot : s.subpageRoot;
  const linkClass = isHomePage ? s.homeLink : s.subpageLink;
  const headlineClass = isHomePage ? s.homeHeadline : s.subpageHeadline;
  const linkButtonClass = isHomePage ? s.homeLinkButton : s.subpageLinkButton;
  const bgClass = isHomePage ? 'bg-slate-100' : 'bg-slate-950';
  const bgSecondaryClass = isHomePage ? 'bg-slate-100' : 'bg-slate-950';

  return (
    <footer className={`${styleClass} mx-auto max-w-[1920px] z-0`}>
    <hr className="border-t border-slate-300"/>
      <div className={`${bgClass} px-6 grid grid-cols-1 gap-2 py-6 lg:grid-cols-6`}>
        <div className="col-span-2 lg:col-span-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className={`${headlineClass}`}>
                LEGAL
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/privacy"
                className={`${linkClass}`}
              >
                Privacy Policy
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/terms"
                className={`${linkClass}`}
              >
                Terms of Use
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/imprint"
                className={`${linkClass}`}
              >
                Imprint
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-6 lg:col-start-12 text-right">
          <div className="mb-4">
            <p className={`${headlineClass}`}>
              Feedback & questions?
            </p>
            <div>
            <a href="mailto:hi@useduckit.app" className={`${linkClass}`}>
              hi@useduckit.app
            </a>
          </div>
          </div>
          <div className="flex justify-between mb-4">
          <div className="flex-grow"></div>
          <a href="https://join.slack.com/t/duck-it-workspace/shared_invite/zt-2fsu1ji02-ESBGtpjm2JLJgtWgq2M~QA" className={`${linkButtonClass} px-4 py-2 flex items-center transition duration-150 ease-in-out`}>
            <span>Join our community!</span>
            <FaSlack size={24} className="ml-2" />
          </a>
        </div>
        <div>
          <span className={`${headlineClass}`} >
            &copy; {new Date().getFullYear()} Duck it! All rights reserved.
          </span>
        </div>
        </div>
      </div>
    </footer>
  );
}