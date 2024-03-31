import { usePathname } from 'next/navigation';
import s from './Navbar.module.css';
import Navlinks from './Navlinks';

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const styleClass = isHomePage ? s.homeRoot : s.subpageRoot;

  return (
    <nav className={`${styleClass}`}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className={`max-w-6xl px-6 mx-auto`}>
        <Navlinks/>
      </div>
    </nav>
  );
}
