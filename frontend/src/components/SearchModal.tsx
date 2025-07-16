'use client';

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  material: string;
  weightGrams: number | null;
  dimensions: string;
  careInstructions: string;
  isActive: boolean;
  isFeatured: boolean;
  category: {
    name: string;
    slug: string;
  } | null;
  primaryImage: {
    url: string;
    alt: string;
  } | null;
  quantityAvailable: number;
  createdAt: string;
  updatedAt: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(term)}&limit=8`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.products || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.id}`);
    onClose();
  };

  const handleViewAllResults = () => {
    router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleViewAllResults();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="fixed inset-x-4 top-4 mx-auto max-w-2xl bg-white rounded-lg shadow-2xl border border-neutral-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">
            {t('nav.search')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="p-4 border-b border-neutral-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder={t('products.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
        </form>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-2 text-neutral-600">{t('common.loading')}</p>
            </div>
          ) : hasSearched ? (
            searchResults.length > 0 ? (
              <div>
                {/* Results */}
                <div className="p-4 space-y-3">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
                    >
                      {/* Product Image */}
                      <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.primaryImage ? (
                          <img
                            src={product.primaryImage.url}
                            alt={product.primaryImage.alt || product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                            <span className="text-neutral-400 text-xs">📷</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-neutral-900 truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-neutral-500 truncate">
                          {product.category?.name} • {product.price.toFixed(2)} {t('common.currency')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Results */}
                <div className="p-4 border-t border-neutral-200">
                  <button
                    onClick={handleViewAllResults}
                    className="w-full py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    {t('products.viewAllProducts')} ({searchResults.length}+)
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-neutral-600 mb-4">
                  {t('products.noProductsMessage')}
                </p>
                                 <button
                   onClick={() => router.push('/products')}
                   className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                 >
                   {t('products.featured.browseAll')}
                 </button>
              </div>
            )
          ) : (
            <div className="p-8 text-center text-neutral-500">
              <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
              <p>{t('products.searchPlaceholder')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 