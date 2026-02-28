'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
    MagnifyingGlassIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import CartWidget, { CartIcon } from '@/components/CartWidget';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SearchModal from '@/components/SearchModal';
import { useI18n } from '@/lib/i18n';

export default function Navbar() {
    const { t } = useI18n();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 glass-effect border-b border-neutral-200">
            <div className="container-max section-padding">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="relative w-10 h-10">
                            <Image
                                src="/varia-varia-logo.jpg"
                                alt="VariaVaria Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-xl font-serif font-semibold text-black">
                            VariaVaria
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/products" className="text-neutral-700 hover:text-primary-600 transition-colors">
                            {t('nav.products')}
                        </Link>
                        <Link href="/categories" className="text-neutral-700 hover:text-primary-600 transition-colors">
                            {t('nav.categories')}
                        </Link>
                        <Link href="/about" className="text-neutral-700 hover:text-primary-600 transition-colors">
                            {t('nav.about')}
                        </Link>
                        <Link href="/contact" className="text-neutral-700 hover:text-primary-600 transition-colors">
                            {t('nav.contact')}
                        </Link>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-2 relative">
                        <button
                            className="p-2 text-neutral-700 hover:text-primary-600 transition-colors"
                            title={t('nav.search')}
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </button>
                        <Link
                            href="/account"
                            className="p-2 text-neutral-700 hover:text-primary-600 transition-colors"
                            title={t('nav.account')}
                        >
                            <UserIcon className="h-5 w-5" />
                        </Link>
                        <LanguageSwitcher />
                        <div className="relative">
                            <CartIcon onClick={() => setIsCartOpen(!isCartOpen)} />
                            <CartWidget
                                isOpen={isCartOpen}
                                onClose={() => setIsCartOpen(false)}
                                className="absolute right-0 top-12 z-50"
                            />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-neutral-200 mt-4">
                        <nav className="flex flex-col space-y-3">
                            <Link href="/products" className="text-neutral-700 hover:text-primary-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                {t('nav.products')}
                            </Link>
                            <Link href="/categories" className="text-neutral-700 hover:text-primary-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                {t('nav.categories')}
                            </Link>
                            <Link href="/about" className="text-neutral-700 hover:text-primary-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                {t('nav.about')}
                            </Link>
                            <Link href="/contact" className="text-neutral-700 hover:text-primary-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                {t('nav.contact')}
                            </Link>
                            <hr className="border-neutral-200" />
                            <button
                                onClick={() => {
                                    setIsSearchOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="text-left text-neutral-700 hover:text-primary-600 transition-colors"
                            >
                                {t('nav.search')}
                            </button>
                            <Link href="/account" className="text-neutral-700 hover:text-primary-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                {t('nav.account')}
                            </Link>
                            <Link href="/cart" className="text-neutral-700 hover:text-primary-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                {t('nav.cart')}
                            </Link>
                            <hr className="border-neutral-200" />
                            <div className="px-2">
                                <LanguageSwitcher variant="inline" />
                            </div>
                        </nav>
                    </div>
                )}
            </div>

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </header>
    );
}
