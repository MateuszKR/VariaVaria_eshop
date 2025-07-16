'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n, Language } from '@/lib/i18n';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const languages = [
  {
    code: 'en' as Language,
    name: 'English',
    flag: 'GB',
    nativeName: 'English'
  },
  {
    code: 'pl' as Language,
    name: 'Polish',
    flag: 'PL',
    nativeName: 'Polski'
  }
];

// Flag component to render actual flag images
const FlagIcon = ({ countryCode, className = '' }: { countryCode: string; className?: string }) => {
  return (
    <span 
      className={`inline-block w-6 h-4 rounded-sm overflow-hidden shadow-sm ${className}`}
      style={{
        backgroundImage: `url(https://flagcdn.com/w40/${countryCode.toLowerCase()}.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      title={countryCode === 'GB' ? 'English' : 'Polish'}
    />
  );
};

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'inline';
}

export default function LanguageSwitcher({ 
  className = '',
  variant = 'dropdown'
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${
              lang.code === language
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg transform scale-105'
                : 'text-neutral-600 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 border border-transparent hover:border-primary-200 hover:shadow-md'
            }`}
          >
            <FlagIcon 
              countryCode={lang.flag} 
              className={`group-hover:scale-110 transition-transform duration-200 ${
                lang.code === language ? 'animate-bounce' : ''
              }`}
            />
            <span className="hidden sm:block">{lang.nativeName}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2.5 text-neutral-700 hover:text-primary-600 transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 border border-transparent hover:border-primary-200 hover:shadow-md group"
        aria-label="Switch language"
      >
        <FlagIcon countryCode={currentLanguage.flag} className="drop-shadow-sm" />
        <span className="hidden sm:block text-sm font-semibold">
          {currentLanguage.nativeName}
        </span>
        <ChevronDownIcon 
          className={`h-4 w-4 transition-all duration-300 group-hover:text-primary-500 ${
            isOpen ? 'rotate-180 text-primary-600' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-14 z-50 w-52 bg-white rounded-2xl shadow-2xl border border-neutral-200/50 py-3 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-neutral-100">
              <div className="flex items-center space-x-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                <GlobeAltIcon className="h-4 w-4 text-primary-500" />
                <span>Language / Język</span>
              </div>
            </div>
            
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 transition-all duration-200 group ${
                  lang.code === language ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 border-r-4 border-primary-500' : 'text-neutral-700'
                }`}
              >
                <FlagIcon 
                  countryCode={lang.flag} 
                  className="drop-shadow-sm group-hover:scale-110 transition-transform duration-200 w-8 h-6"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{lang.nativeName}</div>
                  <div className="text-xs text-neutral-500 group-hover:text-neutral-600">{lang.name}</div>
                </div>
                {lang.code === language && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-primary-600">Active</span>
                  </div>
                )}
              </button>
            ))}
            
            {/* Four leaf clover decoration */}
            <div className="px-4 py-3 border-t border-neutral-100 bg-gradient-to-r from-primary-25 to-accent-25">
              <div className="text-center text-xs font-medium text-neutral-500">
                <span className="inline-flex items-center space-x-1">
                  <span className="text-primary-500">🍀</span>
                  <span>VariaVaria Jewelry</span>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 