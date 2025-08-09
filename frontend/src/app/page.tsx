'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ShoppingBagIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  StarIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import CartWidget, { CartIcon } from '@/components/CartWidget'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import SearchModal from '@/components/SearchModal'
import { useI18n } from '@/lib/i18n'

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

interface Category {
  id: number;
  name: string;
  namePl?: string;
  slug: string;
  description?: string;
  descriptionPl?: string;
  imageUrl?: string;
}

function Header() {
  const { t } = useI18n()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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
              <Link href="/account" className="text-neutral-700 hover:text-primary-600 transition-colors">
                {t('nav.account')}
              </Link>
              <Link href="/cart" className="text-neutral-700 hover:text-primary-600 transition-colors">
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
  )
}

function Hero() {
  const { t } = useI18n()
  
  return (
    <section className="hero-gradient py-20 lg:py-32">
      <div className="container-max section-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-serif font-bold text-neutral-900 leading-tight">
                {t('hero.title').split(' ').slice(0, -2).join(' ')} 
                <span className="text-gradient block">{t('hero.subtitle')}</span>
              </h1>
              <p className="text-xl text-neutral-600 leading-relaxed">
                {t('hero.description')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="btn-primary">
                {t('hero.shopNow')}
              </Link>
              <Link href="/about" className="btn-secondary">
                {t('hero.ourStory')}
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">500+</div>
                <div className="text-sm text-neutral-600">{t('hero.customers')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">4.9</div>
                <div className="text-sm text-neutral-600">{t('hero.rating')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">100%</div>
                <div className="text-sm text-neutral-600">{t('hero.handcrafted')}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600"
                alt="Beautiful four-leaf clover necklace"
                fill
                className="object-cover"
                priority
              />
            </div>
            <Link 
              href="/products?featured=true" 
              className="absolute -top-4 -left-4 bg-accent-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-accent-600 transition-colors cursor-pointer"
            >
              ✨ {t('hero.featured')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { t } = useI18n()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()
  
  // Translation system for category names
  const [translationsReady, setTranslationsReady] = useState(false);
  const [translations, setTranslations] = useState<any>({});
  
  // Initialize translations safely
  useEffect(() => {
    try {
      const loadTranslations = async () => {
        try {
          const savedLang = localStorage.getItem('variavaria-language') || 'en';
          
          const staticTranslations = {
            en: {
              'category.Rings': 'Rings',
              'category.Necklaces': 'Necklaces',
              'category.Earrings': 'Earrings',
              'category.Bracelets': 'Bracelets',
              'category.Pendants': 'Pendants',
              'category.Sets': 'Sets'
            },
            pl: {
              'category.Rings': 'Pierścionki',
              'category.Necklaces': 'Naszyjniki',
              'category.Earrings': 'Kolczyki',
              'category.Bracelets': 'Bransoletki',
              'category.Pendants': 'Wisiorki',
              'category.Sets': 'Komplety'
            }
          };
          
          setTranslations(staticTranslations[savedLang as keyof typeof staticTranslations] || staticTranslations.en);
          setTranslationsReady(true);
        } catch (error) {
          setTranslations({});
          setTranslationsReady(true);
        }
      };
      
      loadTranslations();
      
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'variavaria-language') {
          loadTranslations();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      let currentLang = localStorage.getItem('variavaria-language') || 'en';
      const checkLanguage = () => {
        const newLang = localStorage.getItem('variavaria-language') || 'en';
        if (newLang !== currentLang) {
          currentLang = newLang;
          loadTranslations();
        }
      };
      
      const interval = setInterval(checkLanguage, 1000);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    } catch (error) {
      setTranslations({});
      setTranslationsReady(true);
    }
  }, []);
  
  // Helper function for category name translation
  const translateCategoryName = (categoryName: string) => {
    if (!translationsReady) return categoryName;
    try {
      const key = `category.${categoryName}`;
      const translation = translations[key];
      return translation || categoryName;
    } catch (error) {
      return categoryName;
    }
  };

  const getImageSrc = (imageUrl: string) => {
    return imageUrl;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div 
      className="product-card hover-lift cursor-pointer group" 
      onClick={handleCardClick}
    >
      {/* Image Section - About half height */}
      <div className="h-48 relative overflow-hidden bg-neutral-100">
        {product.primaryImage && !imageError ? (
          <img
            src={getImageSrc(product.primaryImage.url)}
            alt={product.primaryImage.alt || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
            <span className="text-neutral-500 text-sm">
              {imageError ? t('products.imageError') : t('products.noImage')}
            </span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="bg-accent-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {t('products.featured.badge')}
            </span>
          )}
          {product.quantityAvailable === 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {t('products.outOfStock')}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
          onClick={handleWishlistClick}
        >
          {isWishlisted ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-neutral-600" />
          )}
        </button>

        {/* Hover overlay with "View Details" text */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full">
            {t('products.viewDetails')}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-neutral-900 line-clamp-2">
          {product.name}
        </h3>
        
        {product.category && (
          <p className="text-sm text-neutral-500">
            {translateCategoryName(product.category.name)}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-neutral-900">
              {product.price.toFixed(2)} {t('common.currency')}
            </span>
          </div>
          {product.quantityAvailable > 0 && product.quantityAvailable <= 5 && (
            <span className="text-sm font-medium text-orange-600">
              {(() => {
                try {
                  const translation = t('products.onlyLeft') || 'Only {count} left';
                  return translation.replace('{count}', product.quantityAvailable?.toString() || '0');
                } catch (error) {
                  return `Only ${product.quantityAvailable || 0} left`;
                }
              })()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function FeaturedProducts() {
  const { t } = useI18n()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?featured=true&limit=4`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }
        
        const data = await response.json();
        setFeaturedProducts(data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container-max section-padding">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900">
              {t('products.featured.title')}
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {t('products.featured.subtitle')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-neutral-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="container-max section-padding">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900">
              {t('products.featured.title')}
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {t('products.featured.subtitle')}
            </p>
          </div>
          <div className="text-center text-neutral-600">
            <p>{t('products.loadError')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container-max section-padding">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900">
            {t('products.featured.title')}
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {t('products.featured.subtitle')}
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/products" className="btn-secondary">
                {t('products.featured.viewAll')}
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center text-neutral-600">
            <p>{t('products.featured.noProducts')}</p>
            <div className="mt-6">
              <Link href="/products" className="btn-secondary">
                {t('products.featured.browseAll')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function Categories() {
  const { t } = useI18n()
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Translation system for category names and descriptions
  const [translationsReady, setTranslationsReady] = useState(false);
  const [translations, setTranslations] = useState<any>({});
  const [lang, setLang] = useState<'en' | 'pl'>('en');
  
  // Initialize translations safely
  useEffect(() => {
    try {
      const loadTranslations = async () => {
        try {
          const savedLang = (localStorage.getItem('variavaria-language') as 'en' | 'pl') || 'en';
          
          const staticTranslations = {
            en: {
              'category.Rings': 'Rings',
              'category.Necklaces': 'Necklaces',
              'category.Earrings': 'Earrings',
              'category.Bracelets': 'Bracelets',
              'category.Pendants': 'Pendants',
              'category.Sets': 'Sets',
              'category.desc.Rings': 'Four-leaf clover rings for luck and style',
              'category.desc.Necklaces': 'Beautiful four-leaf clover necklaces',
              'category.desc.Earrings': 'Elegant four-leaf clover earrings',
              'category.desc.Bracelets': 'Charming four-leaf clover bracelets',
              'category.desc.Pendants': 'Lucky four-leaf clover pendants',
              'category.desc.Sets': 'Complete four-leaf clover jewelry sets'
            },
            pl: {
              'category.Rings': 'Pierścionki',
              'category.Necklaces': 'Naszyjniki',
              'category.Earrings': 'Kolczyki',
              'category.Bracelets': 'Bransoletki',
              'category.Pendants': 'Wisiorki',
              'category.Sets': 'Komplety',
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
          setTranslations({});
          setTranslationsReady(true);
        }
      };
      
      loadTranslations();
      
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'variavaria-language') {
          loadTranslations();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      let currentLang = (localStorage.getItem('variavaria-language') as 'en' | 'pl') || 'en';
      const checkLanguage = () => {
        const newLang = (localStorage.getItem('variavaria-language') as 'en' | 'pl') || 'en';
        if (newLang !== currentLang) {
          currentLang = newLang;
          loadTranslations();
        }
      };
      
      const interval = setInterval(checkLanguage, 1000);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    } catch (error) {
      setTranslations({});
      setTranslationsReady(true);
    }
  }, []);
  
  // Helper functions for translation
  const tr = (key: string, fallback: string) => {
    if (!translationsReady) return fallback;
    try {
      const translation = translations[key];
      return translation || fallback;
    } catch (error) {
      return fallback;
    }
  };

  const translateCategoryName = (categoryName: string) => {
    try {
      const key = `category.${categoryName}`;
      return tr(key, categoryName);
    } catch (error) {
      return categoryName;
    }
  };

  const translateCategoryDescription = (categoryName: string, originalDescription: string) => {
    try {
      const key = `category.desc.${categoryName}`;
      return tr(key, originalDescription || `Browse ${categoryName.toLowerCase()}`);
    } catch (error) {
      return originalDescription || `Browse ${categoryName.toLowerCase()}`;
    }
  };

  const getDisplayName = (category: Category) => {
    if (lang === 'pl') {
      return category.namePl?.trim() || translateCategoryName(category.name);
    }
    return category.name;
  };

  const getDisplayDescription = (category: Category) => {
    if (lang === 'pl') {
      return category.descriptionPl?.trim() || translateCategoryDescription(category.name, category.description || '');
    }
    return category.description || '';
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/categories`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container-max section-padding">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900">
              {t('categories.title')}
            </h2>
            <p className="text-lg text-neutral-600">
              {t('categories.subtitle')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-neutral-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="container-max section-padding">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900">
              {t('categories.title')}
            </h2>
            <p className="text-lg text-neutral-600">
              {t('categories.subtitle')}
            </p>
          </div>
          <div className="text-center text-neutral-600">
            <p>Unable to load categories. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900">
            {t('categories.title')}
          </h2>
          <p className="text-lg text-neutral-600">
            {t('categories.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            
            // Fallback images for each category type
            const getFallbackImage = (slug: string) => {
              const fallbacks: Record<string, string> = {
                'rings': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop',
                'necklaces': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop',
                'earrings': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop',
                'bracelets': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop',
                'pendants': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
                'sets': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop&sepia=20'
              };
              return fallbacks[slug] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop';
            };

            const imageUrl = category.imageUrl || getFallbackImage(category.slug);

            return (
              <Link 
                key={category.slug} 
                href={`/products?category=${category.slug}`}
                className="block group"
              >
                <div 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  style={{ minHeight: '300px' }}
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={imageUrl}
                      alt={getDisplayName(category)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white text-xl font-bold text-center px-4">
                        {getDisplayName(category)}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm text-center">
                      {getDisplayDescription(category)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
      </div>
    </section>
  )
}

function Features() {
  const { t } = useI18n()
  
  const features = [
    {
      icon: ShieldCheckIcon,
      title: t('features.quality.title'),
      description: t('features.quality.description')
    },
    {
      icon: TruckIcon,
      title: t('features.shipping.title'),
      description: t('features.shipping.description')
    },
    {
      icon: HeartIcon,
      title: t('features.handcrafted.title'),
      description: t('features.handcrafted.description')
    },
    {
      icon: SparklesIcon,
      title: t('features.lucky.title'),
      description: t('features.lucky.description')
    }
  ]

  return (
    <section className="py-20 hero-gradient">
      <div className="container-max section-padding">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-soft">
                <feature.icon className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">
                {feature.title}
              </h3>
              <p className="text-neutral-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { t } = useI18n();
  
  // Translation system for category names in footer
  const [translationsReady, setTranslationsReady] = useState(false);
  const [translations, setTranslations] = useState<any>({});
  
  // Initialize translations safely
  useEffect(() => {
    try {
      const loadTranslations = async () => {
        try {
          const savedLang = localStorage.getItem('variavaria-language') || 'en';
          
          const staticTranslations = {
            en: {
              'category.Rings': 'Rings',
              'category.Necklaces': 'Necklaces',
              'category.Earrings': 'Earrings',
              'category.Bracelets': 'Bracelets'
            },
            pl: {
              'category.Rings': 'Pierścionki',
              'category.Necklaces': 'Naszyjniki',
              'category.Earrings': 'Kolczyki',
              'category.Bracelets': 'Bransoletki'
            }
          };
          
          setTranslations(staticTranslations[savedLang as keyof typeof staticTranslations] || staticTranslations.en);
          setTranslationsReady(true);
        } catch (error) {
          setTranslations({});
          setTranslationsReady(true);
        }
      };
      
      loadTranslations();
      
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'variavaria-language') {
          loadTranslations();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      let currentLang = localStorage.getItem('variavaria-language') || 'en';
      const checkLanguage = () => {
        const newLang = localStorage.getItem('variavaria-language') || 'en';
        if (newLang !== currentLang) {
          currentLang = newLang;
          loadTranslations();
        }
      };
      
      const interval = setInterval(checkLanguage, 1000);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    } catch (error) {
      setTranslations({});
      setTranslationsReady(true);
    }
  }, []);
  
  // Helper function for category name translation
  const translateCategoryName = (categoryName: string) => {
    if (!translationsReady) return categoryName;
    try {
      const key = `category.${categoryName}`;
      const translation = translations[key];
      return translation || categoryName;
    } catch (error) {
      return categoryName;
    }
  };

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container-max section-padding py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8">
                <Image
                  src="/varia-varia-logo.jpg"
                  alt="VariaVaria Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-serif font-semibold text-white">
                VariaVaria
              </span>
            </div>
            <p className="text-neutral-400">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t('footer.shop')}</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="hover:text-white transition-colors">{t('footer.allProducts')}</Link></li>
              <li><Link href="/categories/rings" className="hover:text-white transition-colors">{translateCategoryName('Rings')}</Link></li>
              <li><Link href="/categories/necklaces" className="hover:text-white transition-colors">{translateCategoryName('Necklaces')}</Link></li>
              <li><Link href="/categories/earrings" className="hover:text-white transition-colors">{translateCategoryName('Earrings')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t('footer.customerCare')}</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('footer.contactUs')}</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">{t('footer.shippingInfo')}</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">{t('footer.returns')}</Link></li>
              <li><Link href="/size-guide" className="hover:text-white transition-colors">{t('footer.sizeGuide')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition-colors">{t('footer.aboutUs')}</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">{t('footer.careers')}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t('footer.termsOfService')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <Categories />
        <Features />
      </main>
      <Footer />
    </div>
  )
} 