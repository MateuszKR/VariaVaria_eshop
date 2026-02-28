'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

// Pages that have their own header/nav — exclude our global Navbar from these
const EXCLUDED_PATHS = ['/admin'];

export default function NavbarWrapper() {
    const pathname = usePathname();

    const isExcluded = EXCLUDED_PATHS.some(
        (excluded) => pathname === excluded || pathname.startsWith(excluded + '/')
    );

    if (isExcluded) return null;

    return <Navbar />;
}
