'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'pl';

export interface TranslationKeys {
  // Navigation
  'nav.products': string;
  'nav.categories': string;
  'nav.about': string;
  'nav.contact': string;
  'nav.account': string;
  'nav.cart': string;
  'nav.search': string;
  
  // Hero Section
  'hero.title': string;
  'hero.subtitle': string;
  'hero.description': string;
  'hero.shopNow': string;
  'hero.ourStory': string;
  'hero.customers': string;
  'hero.rating': string;
  'hero.handcrafted': string;
  
  // Products
  'products.title': string;
  'products.subtitle': string;
  'products.loading': string;
  'products.search': string;
  'products.filter.all': string;
  'products.filter.featured': string;
  'products.filter.sale': string;
  'products.addToCart': string;
  'products.outOfStock': string;
  'products.viewDetails': string;
  'products.featured.title': string;
  'products.featured.subtitle': string;
  'products.featured.viewAll': string;
  'products.featured.browseAll': string;
  'products.featured.noProducts': string;
  'products.featured.badge': string;
  'products.onlyLeft': string;
  'products.loadError': string;
  'products.imageError': string;
  'products.noImage': string;
  'products.page.title': string;
  'products.page.subtitle': string;
  'products.searchPlaceholder': string;
  'products.searchButton': string;
  'products.featuredOnly': string;
  'products.allCategories': string;
  'products.minPrice': string;
  'products.maxPrice': string;
  'products.sort.newest': string;
  'products.sort.name': string;
  'products.sort.price': string;
  'products.sort.descending': string;
  'products.sort.ascending': string;
  'products.clearFilters': string;
  'products.productsFound': string;
  'products.productsFoundPlural': string;
  'products.errorTitle': string;
  'products.tryAgain': string;
  'products.noProductsTitle': string;
  'products.noProductsMessage': string;
  'products.viewAllProducts': string;
  'products.previous': string;
  'products.next': string;
  
  // Categories
  'categories.title': string;
  'categories.subtitle': string;
  'categories.rings': string;
  'categories.necklaces': string;
  'categories.earrings': string;
  'categories.bracelets': string;
  'categories.pendants': string;
  'categories.sets': string;
  
  // Cart
  'cart.title': string;
  'cart.empty': string;
  'cart.emptyMessage': string;
  'cart.continueShopping': string;
  'cart.checkout': string;
  'cart.total': string;
  'cart.subtotal': string;
  'cart.shipping': string;
  'cart.tax': string;
  'cart.freeShipping': string;
  'cart.promoCode': string;
  'cart.applyCode': string;
  'cart.secureCheckout': string;
  'cart.clearCart': string;
  'cart.quantity': string;
  'cart.remove': string;
  
  // Features
  'features.quality.title': string;
  'features.quality.description': string;
  'features.shipping.title': string;
  'features.shipping.description': string;
  'features.handcrafted.title': string;
  'features.handcrafted.description': string;
  'features.lucky.title': string;
  'features.lucky.description': string;
  
  // Admin
  'admin.dashboard': string;
  'admin.welcome': string;
  'admin.logout': string;
  'admin.viewStore': string;
  'admin.verifying': string;
  
  // Common
  'common.loading': string;
  'common.error': string;
  'common.save': string;
  'common.cancel': string;
  'common.edit': string;
  'common.delete': string;
  'common.close': string;
  'common.yes': string;
  'common.no': string;
  'common.currency': string;
}

const translations: Record<Language, TranslationKeys> = {
  en: {
    // Navigation
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.account': 'My Account',
    'nav.cart': 'Shopping Cart',
    'nav.search': 'Search',
    
    // Hero Section
    'hero.title': 'Handcrafted Lucky Jewelry',
    'hero.subtitle': 'Lucky Jewelry',
    'hero.description': 'Discover our beautiful collection of four-leaf clover jewelry, carefully handcrafted to bring you luck, style, and elegance.',
    'hero.shopNow': 'Shop Now',
    'hero.ourStory': 'Our Story',
    'hero.customers': 'Happy Customers',
    'hero.rating': 'Average Rating',
    'hero.handcrafted': 'Handcrafted',
    
    // Products
    'products.title': 'VariaVaria Jewelry',
    'products.subtitle': 'Discover our complete collection of handcrafted jewelry featuring the lucky four-leaf clover symbol.',
    'products.loading': 'Loading products...',
    'products.search': 'Search products...',
    'products.filter.all': 'All Products',
    'products.filter.featured': 'Featured',
    'products.filter.sale': 'On Sale',
    'products.addToCart': 'Add to Cart',
    'products.outOfStock': 'Out of Stock',
    'products.viewDetails': 'View Details',
    'products.featured.title': 'Featured Products',
    'products.featured.subtitle': 'Discover our most popular four-leaf clover jewelry pieces, each one handcrafted with love and attention to detail.',
    'products.featured.viewAll': 'View All Products',
    'products.featured.browseAll': 'Browse All Products',
    'products.featured.noProducts': 'No featured products available at the moment.',
    'products.featured.badge': 'Featured',
    'products.onlyLeft': 'Only {count} left',
    'products.loadError': 'Unable to load featured products. Please try again later.',
    'products.imageError': 'Image failed to load',
    'products.noImage': 'No image',
    'products.page.title': 'VariaVaria Jewelry',
    'products.page.subtitle': 'Discover our complete collection of handcrafted jewelry featuring the lucky four-leaf clover symbol.',
    'products.searchPlaceholder': 'Search products...',
    'products.searchButton': 'Search',
    'products.featuredOnly': 'Featured Only',
    'products.allCategories': 'All Categories',
    'products.minPrice': 'Min Price',
    'products.maxPrice': 'Max Price',
    'products.sort.newest': 'Newest',
    'products.sort.name': 'Name',
    'products.sort.price': 'Price',
    'products.sort.descending': 'Descending',
    'products.sort.ascending': 'Ascending',
    'products.clearFilters': 'Clear Filters',
    'products.productsFound': '{count} product found',
    'products.productsFoundPlural': '{count} products found',
    'products.errorTitle': 'Error Loading Products',
    'products.tryAgain': 'Try Again',
    'products.noProductsTitle': 'No Products Found',
    'products.noProductsMessage': 'Try adjusting your search terms or filters to find what you\'re looking for.',
    'products.viewAllProducts': 'View All Products',
    'products.previous': 'Previous',
    'products.next': 'Next',
    
    // Categories
    'categories.title': 'Shop by Category',
    'categories.subtitle': 'Find the perfect piece for every occasion',
    'categories.rings': 'Rings',
    'categories.necklaces': 'Necklaces',
    'categories.earrings': 'Earrings',
    'categories.bracelets': 'Bracelets',
    'categories.pendants': 'Pendants',
    'categories.sets': 'Jewelry Sets',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyMessage': 'Discover our beautiful collection of handcrafted four-leaf clover jewelry and start filling your cart with luck and elegance.',
    'cart.continueShopping': 'Continue Shopping',
    'cart.checkout': 'Secure Checkout',
    'cart.total': 'Total',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.tax': 'Tax',
    'cart.freeShipping': 'FREE',
    'cart.promoCode': 'Promo Code',
    'cart.applyCode': 'Apply',
    'cart.secureCheckout': 'Secure Checkout',
    'cart.clearCart': 'Clear Cart',
    'cart.quantity': 'Quantity',
    'cart.remove': 'Remove',
    
    // Features
    'features.quality.title': 'Premium Quality',
    'features.quality.description': 'All our jewelry comes with a lifetime quality guarantee',
    'features.shipping.title': 'Free Shipping',
    'features.shipping.description': 'Free shipping on orders over $100 worldwide',
    'features.handcrafted.title': 'Handcrafted',
    'features.handcrafted.description': 'Each piece is carefully handcrafted by skilled artisans',
    'features.lucky.title': 'Lucky Charm',
    'features.lucky.description': 'Bring good luck and positive energy into your life',
    
    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.welcome': 'Welcome',
    'admin.logout': 'Logout',
    'admin.viewStore': 'View Store',
    'admin.verifying': 'Verifying admin access...',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.currency': '$',
  },
  pl: {
    // Navigation
    'nav.products': 'Produkty',
    'nav.categories': 'Kategorie',
    'nav.about': 'O nas',
    'nav.contact': 'Kontakt',
    'nav.account': 'Moje konto',
    'nav.cart': 'Koszyk',
    'nav.search': 'Szukaj',
    
    // Hero Section
    'hero.title': 'Ręcznie robiona biżuteria szczęścia',
    'hero.subtitle': 'Biżuteria szczęścia',
    'hero.description': 'Odkryj naszą piękną kolekcję biżuterii z czterolistną koniczyną, starannie wykonaną ręcznie, aby przynieść Ci szczęście, styl i elegancję.',
    'hero.shopNow': 'Kup teraz',
    'hero.ourStory': 'Nasza historia',
    'hero.customers': 'Zadowoleni klienci',
    'hero.rating': 'Średnia ocena',
    'hero.handcrafted': 'Ręcznie robione',
    
    // Products
    'products.title': 'Biżuteria VariaVaria',
    'products.subtitle': 'Odkryj naszą kompletną kolekcję ręcznie robionych biżuterii z symbolem szczęśliwej czterolistnej koniczyny.',
    'products.loading': 'Ładowanie produktów...',
    'products.search': 'Szukaj produktów...',
    'products.filter.all': 'Wszystkie produkty',
    'products.filter.featured': 'Polecane',
    'products.filter.sale': 'W promocji',
    'products.addToCart': 'Dodaj do koszyka',
    'products.outOfStock': 'Brak w magazynie',
    'products.viewDetails': 'Zobacz szczegóły',
    'products.featured.title': 'Polecane produkty',
    'products.featured.subtitle': 'Odkryj nasze najpopularniejsze biżuterie z czterolistną koniczyną, każda wykonana ręcznie z miłością i dbałością o szczegóły.',
    'products.featured.viewAll': 'Zobacz wszystkie produkty',
    'products.featured.browseAll': 'Przeglądaj wszystkie produkty',
    'products.featured.noProducts': 'Brak polecanych produktów w tym momencie.',
    'products.featured.badge': 'Polecane',
    'products.onlyLeft': 'Tylko {count} sztuk',
    'products.loadError': 'Nie można załadować polecanych produktów. Spróbuj ponownie później.',
    'products.imageError': 'Nie udało się załadować obrazu',
    'products.noImage': 'Brak obrazu',
    'products.page.title': 'Biżuteria VariaVaria',
    'products.page.subtitle': 'Odkryj naszą kompletną kolekcję ręcznie robionych biżuterii z symbolem szczęśliwej czterolistnej koniczyny.',
    'products.searchPlaceholder': 'Szukaj produktów...',
    'products.searchButton': 'Szukaj',
    'products.featuredOnly': 'Tylko polecane',
    'products.allCategories': 'Wszystkie kategorie',
    'products.minPrice': 'Cena min',
    'products.maxPrice': 'Cena max',
    'products.sort.newest': 'Najnowsze',
    'products.sort.name': 'Nazwa',
    'products.sort.price': 'Cena',
    'products.sort.descending': 'Malejąco',
    'products.sort.ascending': 'Rosnąco',
    'products.clearFilters': 'Wyczyść filtry',
    'products.productsFound': 'Znaleziono {count} produkt',
    'products.productsFoundPlural': 'Znaleziono {count} produktów',
    'products.errorTitle': 'Błąd ładowania produktów',
    'products.tryAgain': 'Spróbuj ponownie',
    'products.noProductsTitle': 'Nie znaleziono produktów',
    'products.noProductsMessage': 'Spróbuj dostosować wyszukiwane hasła lub filtry, aby znaleźć to, czego szukasz.',
    'products.viewAllProducts': 'Zobacz wszystkie produkty',
    'products.previous': 'Poprzednia',
    'products.next': 'Następna',
    
    // Categories
    'categories.title': 'Kupuj według kategorii',
    'categories.subtitle': 'Znajdź idealny element na każdą okazję',
    'categories.rings': 'Pierścionki',
    'categories.necklaces': 'Naszyjniki',
    'categories.earrings': 'Kolczyki',
    'categories.bracelets': 'Bransoletki',
    'categories.pendants': 'Wisiorki',
    'categories.sets': 'Zestawy biżuterii',
    
    // Cart
    'cart.title': 'Koszyk zakupowy',
    'cart.empty': 'Twój koszyk jest pusty',
    'cart.emptyMessage': 'Odkryj naszą piękną kolekcję ręcznie robionych biżuterii z czterolistną koniczyną i zacznij wypełniać swój koszyk szczęściem i elegancją.',
    'cart.continueShopping': 'Kontynuuj zakupy',
    'cart.checkout': 'Bezpieczna płatność',
    'cart.total': 'Razem',
    'cart.subtotal': 'Suma częściowa',
    'cart.shipping': 'Wysyłka',
    'cart.tax': 'Podatek',
    'cart.freeShipping': 'GRATIS',
    'cart.promoCode': 'Kod promocyjny',
    'cart.applyCode': 'Zastosuj',
    'cart.secureCheckout': 'Bezpieczna płatność',
    'cart.clearCart': 'Wyczyść koszyk',
    'cart.quantity': 'Ilość',
    'cart.remove': 'Usuń',
    
    // Features
    'features.quality.title': 'Najwyższa jakość',
    'features.quality.description': 'Cała nasza biżuteria jest objęta dożywotnią gwarancją jakości',
    'features.shipping.title': 'Darmowa wysyłka',
    'features.shipping.description': 'Darmowa wysyłka przy zamówieniach powyżej 400 zł na całym świecie',
    'features.handcrafted.title': 'Ręcznie robione',
    'features.handcrafted.description': 'Każda sztuka jest starannie wykonana ręcznie przez doświadczonych rzemieślników',
    'features.lucky.title': 'Talisman szczęścia',
    'features.lucky.description': 'Przynieś szczęście i pozytywną energię do swojego życia',
    
    // Admin
    'admin.dashboard': 'Panel administracyjny',
    'admin.welcome': 'Witaj',
    'admin.logout': 'Wyloguj',
    'admin.viewStore': 'Zobacz sklep',
    'admin.verifying': 'Weryfikacja dostępu administratora...',
    
    // Common
    'common.loading': 'Ładowanie...',
    'common.error': 'Błąd',
    'common.save': 'Zapisz',
    'common.cancel': 'Anuluj',
    'common.edit': 'Edytuj',
    'common.delete': 'Usuń',
    'common.close': 'Zamknij',
    'common.yes': 'Tak',
    'common.no': 'Nie',
    'common.currency': 'zł',
  }
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationKeys) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('variavaria-language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'pl')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('variavaria-language', lang);
  };

  const t = (key: keyof TranslationKeys): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export { translations }; 