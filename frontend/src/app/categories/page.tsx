'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface Category {
  id: number;
  name: string;
  namePl?: string;
  description: string;
  descriptionPl?: string;
  slug: string;
  imageUrl: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              'categories.page.title': 'Jewelry Categories',
              'categories.page.subtitle': 'Discover our exquisite collection of handcrafted four-leaf clover jewelry, each piece designed to bring you luck and elegance.',
              'categories.loading': 'Loading categories...',
              'categories.errorTitle': 'Error Loading Categories',
              'categories.tryAgain': 'Try Again',
              'categories.noCategories': 'No Categories Found',
              'categories.noCategoriesMessage': 'Categories will appear here once they are added.',
              'categories.viewProducts': 'View Products',
              'categories.ctaTitle': 'Can\'t Find What You\'re Looking For?',
              'categories.ctaSubtitle': 'Browse all our products or contact us for custom jewelry designs.',
              'categories.viewAllProducts': 'View All Products',
              'categories.contactUs': 'Contact Us',
              // Category name translations
              'category.Rings': 'Rings',
              'category.Necklaces': 'Necklaces',
              'category.Earrings': 'Earrings',
              'category.Bracelets': 'Bracelets',
              'category.Pendants': 'Pendants',
              'category.Sets': 'Sets',
              // Category description translations
              'category.desc.Rings': 'Four-leaf clover rings for luck and style',
              'category.desc.Necklaces': 'Beautiful four-leaf clover necklaces',
              'category.desc.Earrings': 'Elegant four-leaf clover earrings',
              'category.desc.Bracelets': 'Charming four-leaf clover bracelets',
              'category.desc.Pendants': 'Lucky four-leaf clover pendants',
              'category.desc.Sets': 'Complete four-leaf clover jewelry sets'
            },
            pl: {
              'categories.page.title': 'Kategorie biżuterii',
              'categories.page.subtitle': 'Odkryj naszą wyjątkową kolekcję ręcznie robionych biżuterii z czterolistną koniczyną, każda sztuka zaprojektowana, aby przynieść Ci szczęście i elegancję.',
              'categories.loading': 'Ładowanie kategorii...',
              'categories.errorTitle': 'Błąd ładowania kategorii',
              'categories.tryAgain': 'Spróbuj ponownie',
              'categories.noCategories': 'Nie znaleziono kategorii',
              'categories.noCategoriesMessage': 'Kategorie pojawią się tutaj po ich dodaniu.',
              'categories.viewProducts': 'Zobacz produkty',
              'categories.ctaTitle': 'Nie możesz znaleźć tego, czego szukasz?',
              'categories.ctaSubtitle': 'Przeglądaj wszystkie nasze produkty lub skontaktuj się z nami w sprawie niestandardowych projektów biżuterii.',
              'categories.viewAllProducts': 'Zobacz wszystkie produkty',
              'categories.contactUs': 'Skontaktuj się z nami',
              // Category name translations
              'category.Rings': 'Pierścionki',
              'category.Necklaces': 'Naszyjniki',
              'category.Earrings': 'Kolczyki',
              'category.Bracelets': 'Bransoletki',
              'category.Pendants': 'Wisiorki',
              'category.Sets': 'Komplety',
              // Category description translations
              'category.desc.Rings': 'Pierścionki z czterolistną koniczyną na szczęście i styl',
              'category.desc.Necklaces': 'Piękne naszyjniki z czterolistną koniczyną',
              'category.desc.Earrings': 'Eleganckie kolczyki z czterolistną koniczyną',
              'category.desc.Bracelets': 'Urocze bransoletki z czterolistną koniczyną',
              'category.desc.Pendants': 'Szczęśliwe wisiorki z czterolistną koniczyną',
              'category.desc.Sets': 'Kompletne zestawy biżuterii z czterolistną koniczyną'
            }
          };

          setTranslations(staticTranslations[savedLang as keyof typeof staticTranslations] || staticTranslations.en);
          setLang(savedLang);
          setTranslationsReady(true);
        } catch (error) {
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
      let currentLang = localStorage.getItem('variavaria-language') || 'en';
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
      return fallback;
    }
  };

  // Helper function to translate category names
  const translateCategoryName = (categoryName: string) => {
    try {
      const key = `category.${categoryName}`;
      return tr(key, categoryName);
    } catch (error) {
      return categoryName;
    }
  };

  // Helper function to translate category descriptions
  const translateCategoryDescription = (categoryName: string, originalDescription: string) => {
    try {
      const key = `category.desc.${categoryName}`;
      return tr(key, originalDescription || '');
    } catch (error) {
      return originalDescription || '';
    }
  };

  // Prefer DB-provided Polish fields when language is Polish
  const getDisplayName = (category: Category) => {
    if (lang === 'pl') {
      return category.namePl?.trim() || translateCategoryName(category.name);
    }
    return category.name;
  };

  const getDisplayDescription = (category: Category) => {
    if (lang === 'pl') {
      return category.descriptionPl?.trim() || translateCategoryDescription(category.name, category.description);
    }
    return category.description || '';
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-max section-padding py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-neutral-600">{tr('categories.loading', 'Loading categories...')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-max section-padding py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">{tr('categories.errorTitle', 'Error Loading Categories')}</h1>
            <p className="text-neutral-600 mb-8">{error}</p>
            <button
              onClick={fetchCategories}
              className="btn-primary"
            >
              {tr('categories.tryAgain', 'Try Again')}
            </button>
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
              {tr('categories.page.title', 'Jewelry Categories')}
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              {tr('categories.page.subtitle', 'Discover our exquisite collection of handcrafted four-leaf clover jewelry, each piece designed to bring you luck and elegance.')}
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container-max section-padding py-16">
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">{tr('categories.noCategories', 'No Categories Found')}</h2>
            <p className="text-neutral-600">{tr('categories.noCategoriesMessage', 'Categories will appear here once they are added.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group"
              >
                <div className="card hover-lift overflow-hidden">
                  <div className="aspect-w-16 aspect-h-12 bg-neutral-100">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={getDisplayName(category)}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                        <SparklesIcon className="w-10 h-10 text-primary-500" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {getDisplayName(category)}
                    </h3>
                    {(getDisplayDescription(category)) && (
                      <p className="text-neutral-600 line-clamp-3">
                        {getDisplayDescription(category)}
                      </p>
                    )}
                    <div className="mt-4 flex items-center text-primary-600 font-medium">
                      {tr('categories.viewProducts', 'View Products')}
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-500 text-white">
        <div className="container-max section-padding py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              {tr('categories.ctaTitle', 'Can\'t Find What You\'re Looking For?')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {tr('categories.ctaSubtitle', 'Browse all our products or contact us for custom jewelry designs.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-secondary bg-white text-primary-600 hover:bg-primary-50">
                {tr('categories.viewAllProducts', 'View All Products')}
              </Link>
              <Link href="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
                {tr('categories.contactUs', 'Contact Us')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 