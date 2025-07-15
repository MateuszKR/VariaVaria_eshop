'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n, Language } from '@/lib/i18n';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const languages = [
  {
    code: 'en' as Language,
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English'
  },
  {
    code: 'pl' as Language,
    name: 'Polish',
    flag: '🇵🇱',
    nativeName: 'Polski'
  }
];

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
      <div className={`flex items-center space-x-2 ${className}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              lang.code === language
                ? 'bg-primary-100 text-primary-700 border border-primary-200'
                : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-100'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.nativeName}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-neutral-700 hover:text-primary-600 transition-colors duration-200 rounded-lg hover:bg-neutral-100"
        aria-label="Switch language"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:block text-sm font-medium">
          {currentLanguage.nativeName}
        </span>
        <ChevronDownIcon 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-12 z-50 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2">
            <div className="px-3 py-2 border-b border-neutral-100">
              <div className="flex items-center space-x-2 text-xs text-neutral-500">
                <GlobeAltIcon className="h-4 w-4" />
                <span>Language / Język</span>
              </div>
            </div>
            
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-neutral-50 transition-colors duration-150 ${
                  lang.code === language ? 'bg-primary-50 text-primary-700' : 'text-neutral-700'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-neutral-500">{lang.name}</div>
                </div>
                {lang.code === language && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                )}
              </button>
            ))}
            
            {/* Four leaf clover decoration */}
            <div className="px-3 py-2 border-t border-neutral-100">
              <div className="text-center text-xs text-neutral-400">
                🍀 VariaVaria
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 