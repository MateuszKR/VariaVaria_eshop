'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  categoryId: number;
  categoryName: string;
  material: string;
  weightGrams: number;
  dimensions: string;
  careInstructions: string;
  isActive: boolean;
  isFeatured: boolean;
  primaryImage: {
    url: string;
    alt: string;
  } | null;
  totalImages: number;
  quantityAvailable: number;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  namePl?: string;
  slug: string;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  
  // Ultra-safe translation system with complete isolation
  const [translationsReady, setTranslationsReady] = useState(false);
  const [translations, setTranslations] = useState<any>({});
  const [lang, setLang] = useState<'en' | 'pl'>('en');
  
  // Initialize translations safely
  useEffect(() => {
    try {
      // Try to get translations without using the hook directly in render
      const loadTranslations = async () => {
        try {
          // Get the current language from localStorage
          const savedLang = (localStorage.getItem('variavaria-language') as 'en' | 'pl') || 'en';
          
          // Static translations object
          const staticTranslations = {
            en: {
              'products.page.title': 'VariaVaria Jewelry',
              'products.page.subtitle': 'Discover our complete collection of handcrafted jewelry featuring the lucky four-leaf clover symbol.',
              'products.searchPlaceholder': 'Search products...',
              'products.searchButton': 'Search',
              'products.featuredOnly': 'Featured Only',
              'products.allCategories': 'All Categories',
              'products.clearFilters': 'Clear Filters',
              'products.productsFound': '{count} product found',
              'products.productsFoundPlural': '{count} products found',
              'products.errorTitle': 'Error Loading Products',
              'products.tryAgain': 'Try Again',
              'products.noProductsTitle': 'No Products Found',
              'products.noProductsMessage': 'Try adjusting your search terms or filters to find what you\'re looking for.',
              'products.viewAllProducts': 'View All Products',
              'products.loading': 'Loading products...',
              'products.onlyLeft': 'Only {count} left',
              'products.outOfStock': 'Out of Stock',
              'common.currency': '$'
            },
            pl: {
              'products.page.title': 'Biżuteria VariaVaria',
              'products.page.subtitle': 'Odkryj naszą kompletną kolekcję ręcznie robionych biżuterii z symbolem szczęśliwej czterolistnej koniczyny.',
              'products.searchPlaceholder': 'Szukaj produktów...',
              'products.searchButton': 'Szukaj',
              'products.featuredOnly': 'Tylko polecane',
              'products.allCategories': 'Wszystkie kategorie',
              'products.clearFilters': 'Wyczyść filtry',
              'products.productsFound': 'Znaleziono {count} produkt',
              'products.productsFoundPlural': 'Znaleziono {count} produktów',
              'products.errorTitle': 'Błąd ładowania produktów',
              'products.tryAgain': 'Spróbuj ponownie',
              'products.noProductsTitle': 'Nie znaleziono produktów',
              'products.noProductsMessage': 'Spróbuj dostosować wyszukiwane hasła lub filtry, aby znaleźć to, czego szukasz.',
              'products.viewAllProducts': 'Zobacz wszystkie produkty',
              'products.loading': 'Ładowanie produktów...',
              'products.onlyLeft': 'Tylko {count} sztuk',
              'products.outOfStock': 'Brak w magazynie',
              'common.currency': 'zł'
            }
          };
          
          setTranslations(staticTranslations[savedLang as keyof typeof staticTranslations] || staticTranslations.en);
          setLang(savedLang);
          setTranslationsReady(true);
        } catch (error) {
          console.warn('Error loading translations:', error);
          setTranslations({}); // Empty object as fallback
          setTranslationsReady(true); // Still mark as ready to proceed
        }
      };
      
      loadTranslations();
      
      // Listen for language changes in localStorage
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'variavaria-language') {
          loadTranslations();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      // Also listen for manual language changes within the same window
      let currentLang = (localStorage.getItem('variavaria-language') as 'en' | 'pl') || 'en';
      const checkLanguage = () => {
        const newLang = (localStorage.getItem('variavaria-language') as 'en' | 'pl') || 'en';
        if (newLang !== currentLang) {
          currentLang = newLang;
          loadTranslations();
        }
      };
      
      const interval = setInterval(checkLanguage, 1000); // Check every second
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    } catch (error) {
      console.warn('Critical translation error:', error);
      setTranslations({});
      setTranslationsReady(true);
    }
  }, []);
  
  // Safe translation function with fallback
  const tr = (key: string, fallback: string) => {
    if (!translationsReady) return fallback;
    try {
      const translation = translations[key];
      return translation || fallback;
    } catch (error) {
      console.warn('Translation lookup error:', key, error);
      return fallback;
    }
  };
  
  // Ultra-safe string replacement function
  const trWithReplace = (key: string, fallback: string, replacements: Record<string, string | number>) => {
    try {
      let text = tr(key, fallback);
      if (!text || typeof text !== 'string') {
        text = fallback || '';
      }
      
      // Ultra-safe replacement
      if (replacements && typeof replacements === 'object') {
        Object.entries(replacements).forEach(([placeholder, value]) => {
          try {
            if (text && typeof text === 'string' && placeholder && (value !== undefined && value !== null)) {
              const safeValue = String(value);
              const searchPattern = `{${placeholder}}`;
              if (text.includes(searchPattern)) {
                text = text.replace(searchPattern, safeValue);
              }
            }
          } catch (replaceError) {
            console.warn('String replacement error:', placeholder, value, replaceError);
            // Continue with original text
          }
        });
      }
      
      return text || fallback || '';
    } catch (error) {
      console.warn('Translation with replacement error:', key, error);
      return fallback || '';
    }
  };
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('featured') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 12;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('limit', String(limit));
      if (searchTerm && searchTerm.trim()) params.set('search', searchTerm.trim());
      if (selectedCategory && selectedCategory.trim()) params.set('category', selectedCategory.trim());
      if (featuredOnly) params.set('featured', 'true');
      if (minPrice && minPrice.trim()) params.set('minPrice', minPrice.trim());
      if (maxPrice && maxPrice.trim()) params.set('maxPrice', maxPrice.trim());
      if (sortBy) params.set('sortBy', sortBy);
      if (sortOrder) params.set('sortOrder', sortOrder);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products || []);
      setTotalProducts(data.pagination?.total ?? (data.products?.length || 0));
      setTotalPages(data.pagination?.pages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, searchTerm, selectedCategory, featuredOnly, minPrice, maxPrice, sortBy, sortOrder]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setFeaturedOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('created_at');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-max section-padding py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-neutral-600">{tr('products.loading', 'Loading products...')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white shadow-soft">
        <div className="container-max section-padding py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              {tr('products.page.title', 'VariaVaria Jewelry')}
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              {tr('products.page.subtitle', 'Discover our complete collection of handcrafted jewelry featuring the lucky four-leaf clover symbol.')}
            </p>
          </div>
        </div>
      </div>

      <div className="container-max section-padding py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={tr('products.searchPlaceholder', 'Search products...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field"
                />
              </div>
              <button type="submit" className="btn-primary px-8">
                {tr('products.searchButton', 'Search')}
              </button>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => {
                      setFeaturedOnly(e.target.checked);
                      handleFilterChange();
                    }}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-neutral-700">{tr('products.featuredOnly', 'Featured Only')}</span>
                </label>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  handleFilterChange();
                }}
                className="input-field"
              >
                <option value="">{tr('products.allCategories', 'All Categories')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {lang === 'pl' ? (category.namePl || category.name) : category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={clearFilters}
                className="text-neutral-600 hover:text-neutral-900 underline"
              >
                {tr('products.clearFilters', 'Clear Filters')}
              </button>
              <p className="text-neutral-600">
                {totalProducts === 1 
                  ? trWithReplace('products.productsFound', '{count} product found', { count: String(totalProducts || 0) })
                  : trWithReplace('products.productsFoundPlural', '{count} products found', { count: String(totalProducts || 0) })
                }
              </p>
            </div>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-red-800 mb-2">{tr('products.errorTitle', 'Error Loading Products')}</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={fetchProducts} className="btn-primary">
              {tr('products.tryAgain', 'Try Again')}
            </button>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 && !loading ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">{tr('products.noProductsTitle', 'No Products Found')}</h2>
            <p className="text-neutral-600 mb-8">
              {tr('products.noProductsMessage', 'Try adjusting your search terms or filters to find what you\'re looking for.')}
            </p>
            <button onClick={clearFilters} className="btn-primary">
              {tr('products.viewAllProducts', 'View All Products')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="product-card group">
                  <div className="aspect-w-1 aspect-h-1 bg-neutral-100 overflow-hidden">
                    {product.primaryImage?.url ? (
                      <img
                        src={product.primaryImage.url}
                        alt={product.primaryImage.alt || product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                        <span className="text-6xl">🍀</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    {product.shortDescription && (
                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                        {product.shortDescription}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        {product.price.toFixed(2)} {tr('common.currency', '$')}
                      </span>
                      {product.quantityAvailable <= 5 && product.quantityAvailable > 0 && (
                        <span className="text-xs text-amber-600 font-medium">
                          {trWithReplace('products.onlyLeft', 'Only {count} left', { count: String(product.quantityAvailable || 0) })}
                        </span>
                      )}
                      {product.quantityAvailable === 0 && (
                        <span className="text-xs text-red-600 font-medium">
                          {tr('products.outOfStock', 'Out of Stock')}
                        </span>
                      )}
                    </div>
                    {product.material && (
                      <p className="text-xs text-neutral-500 mt-2">
                        {product.material}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  // Safe fallback for Suspense that doesn't use translations
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="container-max section-padding py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading products...</p>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPageSimple() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductsContent />
    </Suspense>
  );
} 