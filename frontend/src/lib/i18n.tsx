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
  
  // Footer
  'footer.description': string;
  'footer.shop': string;
  'footer.allProducts': string;
  'footer.customerCare': string;
  'footer.contactUs': string;
  'footer.shippingInfo': string;
  'footer.returns': string;
  'footer.sizeGuide': string;
  'footer.company': string;
  'footer.aboutUs': string;
  'footer.careers': string;
  'footer.privacyPolicy': string;
  'footer.termsOfService': string;
  'footer.copyright': string;
  
  // Hero
  'hero.featured': string;
  
  // About Page
  'about.title': string;
  'about.subtitle': string;
  'about.ourStory.title': string;
  'about.ourStory.paragraph1': string;
  'about.ourStory.paragraph2': string;
  'about.ourStory.paragraph3': string;
  'about.ourStory.quote': string;
  'about.ourStory.team': string;
  'about.values.title': string;
  'about.values.subtitle': string;
  'about.values.quality.title': string;
  'about.values.quality.description': string;
  'about.values.authenticity.title': string;
  'about.values.authenticity.description': string;
  'about.values.sustainability.title': string;
  'about.values.sustainability.description': string;
  'about.values.meaning.title': string;
  'about.values.meaning.description': string;
  'about.craftsmanship.title': string;
  'about.craftsmanship.paragraph1': string;
  'about.craftsmanship.paragraph2': string;
  'about.craftsmanship.paragraph3': string;
  'about.craftsmanship.excellence.title': string;
  'about.craftsmanship.excellence.description': string;
  'about.statistics.title': string;
  'about.statistics.subtitle': string;
  'about.statistics.customers': string;
  'about.statistics.designs': string;
  'about.statistics.years': string;
  'about.statistics.craftspeople': string;
  'about.symbolism.title': string;
  'about.symbolism.subtitle': string;
  'about.symbolism.faith.title': string;
  'about.symbolism.faith.description': string;
  'about.symbolism.hope.title': string;
  'about.symbolism.hope.description': string;
  'about.symbolism.love.title': string;
  'about.symbolism.love.description': string;
  'about.symbolism.luck.title': string;
  'about.symbolism.luck.description': string;
  'about.cta.title': string;
  'about.cta.subtitle': string;
  'about.cta.shopCollection': string;
  'about.cta.browseCategories': string;
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
    'hero.featured': 'Featured',
    
    // About Page
    'about.title': 'About VariaVaria',
    'about.subtitle': 'Crafting luck, love, and timeless beauty through handmade jewelry featuring the enchanting four-leaf clover symbol.',
    'about.ourStory.title': 'Our Story',
    'about.ourStory.paragraph1': 'Founded with a passion for bringing luck and beauty into everyday life, Four Leaf Clover Jewelry began as a small artisan workshop dedicated to creating unique, handcrafted pieces that celebrate the magic of the legendary four-leaf clover.',
    'about.ourStory.paragraph2': 'Each piece in our collection is meticulously crafted by skilled artisans who understand that jewelry is more than just an accessory—it\'s a symbol of hope, love, and the extraordinary moments that make life special.',
    'about.ourStory.paragraph3': 'The four-leaf clover has been a symbol of good luck for centuries, with each leaf representing faith, hope, love, and luck. We\'ve woven this timeless symbolism into every design, creating jewelry that not only looks beautiful but also carries deep meaning.',
    'about.ourStory.quote': 'Every piece we create is infused with intention, crafted with care, and designed to bring a touch of magic to your everyday life.',
    'about.ourStory.team': '— The Four Leaf Clover Team',
    'about.values.title': 'Our Values',
    'about.values.subtitle': 'The principles that guide everything we do',
    'about.values.quality.title': 'Quality',
    'about.values.quality.description': 'We use only the finest materials and traditional craftsmanship techniques to ensure each piece is built to last.',
    'about.values.authenticity.title': 'Authenticity',
    'about.values.authenticity.description': 'Every piece is genuinely handcrafted, making each item unique and special to its owner.',
    'about.values.sustainability.title': 'Sustainability',
    'about.values.sustainability.description': 'We\'re committed to ethical sourcing and environmentally responsible practices in all aspects of our business.',
    'about.values.meaning.title': 'Meaning',
    'about.values.meaning.description': 'Each design carries symbolism and intention, creating jewelry that tells a story and holds personal significance.',
    'about.craftsmanship.title': 'The Art of Craftsmanship',
    'about.craftsmanship.paragraph1': 'Our jewelry is created using time-honored techniques passed down through generations of skilled artisans. From the initial design sketch to the final polish, every step is performed with meticulous attention to detail.',
    'about.craftsmanship.paragraph2': 'We source our materials from trusted suppliers who share our commitment to quality and ethical practices. Whether it\'s sterling silver, gold, or precious gemstones, we ensure that every component meets our high standards.',
    'about.craftsmanship.paragraph3': 'The four-leaf clover motif is carefully incorporated into each design, whether subtly engraved, prominently featured, or artfully integrated into the overall composition. This attention to symbolic detail is what makes our jewelry truly special.',
    'about.craftsmanship.excellence.title': 'Handcrafted Excellence',
    'about.craftsmanship.excellence.description': 'Our master craftspeople spend years perfecting their techniques, ensuring that every piece meets our exacting standards for beauty and durability.',
    'about.statistics.title': 'Our Journey in Numbers',
    'about.statistics.subtitle': 'A testament to our commitment to excellence',
    'about.statistics.customers': 'Happy Customers',
    'about.statistics.designs': 'Unique Designs',
    'about.statistics.years': 'Years of Excellence',
    'about.statistics.craftspeople': 'Master Craftspeople',
    'about.symbolism.title': 'The Four-Leaf Clover Legend',
    'about.symbolism.subtitle': 'Understanding the deep symbolism behind our signature motif',
    'about.symbolism.faith.title': 'Faith',
    'about.symbolism.faith.description': 'The first leaf represents faith in oneself and in the journey ahead.',
    'about.symbolism.hope.title': 'Hope',
    'about.symbolism.hope.description': 'The second leaf symbolizes hope for a bright and prosperous future.',
    'about.symbolism.love.title': 'Love',
    'about.symbolism.love.description': 'The third leaf represents love in all its forms—romantic, familial, and self-love.',
    'about.symbolism.luck.title': 'Luck',
    'about.symbolism.luck.description': 'The fourth leaf brings good fortune and positive energy to the wearer.',
    'about.cta.title': 'Ready to Find Your Lucky Piece?',
    'about.cta.subtitle': 'Explore our collection and discover the perfect piece of jewelry to bring luck, love, and beauty into your life.',
    'about.cta.shopCollection': 'Shop Our Collection',
    'about.cta.browseCategories': 'Browse Categories',
    
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
    
    // Footer
    'footer.description': 'Handcrafted jewelry with four-leaf clover designs, bringing luck and elegance to your style.',
    'footer.shop': 'Shop',
    'footer.allProducts': 'All Products',
    'footer.customerCare': 'Customer Care',
    'footer.contactUs': 'Contact Us',
    'footer.shippingInfo': 'Shipping Info',
    'footer.returns': 'Returns',
    'footer.sizeGuide': 'Size Guide',
    'footer.company': 'Company',
    'footer.aboutUs': 'About Us',
    'footer.careers': 'Careers',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.termsOfService': 'Terms of Service',
    'footer.copyright': '© 2024 VariaVaria Jewelry. All rights reserved.',
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
    'hero.featured': 'Polecane',
    
    // About Page
    'about.title': 'O VariaVaria',
    'about.subtitle': 'Tworzenie szczęścia, miłości i ponadczasowego piękna poprzez ręcznie robioną biżuterię z motywem czarującej czterolistnej koniczyny.',
    'about.ourStory.title': 'Nasza historia',
    'about.ourStory.paragraph1': 'Założona z pasją do przynoszenia szczęścia i piękna do codziennego życia, Biżuteria Czterolistnej Koniczyny rozpoczęła się jako mały warsztat rzemieślniczy poświęcony tworzeniu unikalnych, ręcznie robionych elementów, które celebrują magię legendarnej czterolistnej koniczyny.',
    'about.ourStory.paragraph2': 'Każda sztuka w naszej kolekcji jest starannie wykonana przez doświadczonych rzemieślników, którzy rozumieją, że biżuteria to coś więcej niż tylko dodatek — to symbol nadziei, miłości i niezwykłych chwil, które czynią życie wyjątkowym.',
    'about.ourStory.paragraph3': 'Czterolistna koniczyna była symbolem szczęścia przez wieki, przy czym każdy liść reprezentuje wiarę, nadzieję, miłość i szczęście. Wpleliśmy ten ponadczasowy symbolizm w każdy projekt, tworząc biżuterię, która nie tylko wygląda pięknie, ale także niesie głębokie znaczenie.',
    'about.ourStory.quote': 'Każda sztuka, którą tworzymy, jest nasycona intencją, wykonana z troską i zaprojektowana, aby przynieść odrobinę magii do Twojego codziennego życia.',
    'about.ourStory.team': '— Zespół Czterolistnej Koniczyny',
    'about.values.title': 'Nasze wartości',
    'about.values.subtitle': 'Zasady, które kierują wszystkim, co robimy',
    'about.values.quality.title': 'Jakość',
    'about.values.quality.description': 'Używamy tylko najwyższej jakości materiałów i tradycyjnych technik rzemieślniczych, aby zapewnić, że każda sztuka jest zbudowana na długie lata.',
    'about.values.authenticity.title': 'Autentyczność',
    'about.values.authenticity.description': 'Każda sztuka jest prawdziwie ręcznie robiona, czyniąc każdy element unikalnym i specjalnym dla jego właściciela.',
    'about.values.sustainability.title': 'Zrównoważony rozwój',
    'about.values.sustainability.description': 'Jesteśmy zaangażowani w etyczne pozyskiwanie i odpowiedzialne praktyki środowiskowe we wszystkich aspektach naszej działalności.',
    'about.values.meaning.title': 'Znaczenie',
    'about.values.meaning.description': 'Każdy projekt niesie symbolizm i intencję, tworząc biżuterię, która opowiada historię i ma osobiste znaczenie.',
    'about.craftsmanship.title': 'Sztuka rzemiosła',
    'about.craftsmanship.paragraph1': 'Nasza biżuteria jest tworzona przy użyciu sprawdzonych technik przekazywanych przez pokolenia doświadczonych rzemieślników. Od początkowego szkicu projektu do końcowego polerowania, każdy krok jest wykonywany z drobiazgową dbałością o szczegóły.',
    'about.craftsmanship.paragraph2': 'Pozyskujemy nasze materiały od zaufanych dostawców, którzy dzielą nasze zaangażowanie w jakość i etyczne praktyki. Czy to srebro próby 925, złoto czy kamienie szlachetne, zapewniamy, że każdy komponent spełnia nasze wysokie standardy.',
    'about.craftsmanship.paragraph3': 'Motyw czterolistnej koniczyny jest starannie włączany w każdy projekt, czy to subtelnie grawerowany, prominentnie prezentowany, czy artystycznie zintegrowany w ogólnej kompozycji. Ta dbałość o symboliczne szczegóły jest tym, co czyni naszą biżuterię naprawdę wyjątkową.',
    'about.craftsmanship.excellence.title': 'Ręcznie robiona doskonałość',
    'about.craftsmanship.excellence.description': 'Nasi mistrzowie rzemieślnicy spędzają lata doskonaląc swoje techniki, zapewniając, że każda sztuka spełnia nasze wymagające standardy piękna i trwałości.',
    'about.statistics.title': 'Nasza podróż w liczbach',
    'about.statistics.subtitle': 'Świadectwo naszego zaangażowania w doskonałość',
    'about.statistics.customers': 'Zadowoleni klienci',
    'about.statistics.designs': 'Unikalne projekty',
    'about.statistics.years': 'Lat doskonałości',
    'about.statistics.craftspeople': 'Mistrzowie rzemieślnicy',
    'about.symbolism.title': 'Legenda czterolistnej koniczyny',
    'about.symbolism.subtitle': 'Zrozumienie głębokiego symbolizmu za naszym charakterystycznym motywem',
    'about.symbolism.faith.title': 'Wiara',
    'about.symbolism.faith.description': 'Pierwszy liść reprezentuje wiarę w siebie i w podróż, która przed nami.',
    'about.symbolism.hope.title': 'Nadzieja',
    'about.symbolism.hope.description': 'Drugi liść symbolizuje nadzieję na jasną i prosperującą przyszłość.',
    'about.symbolism.love.title': 'Miłość',
    'about.symbolism.love.description': 'Trzeci liść reprezentuje miłość we wszystkich jej formach — romantyczną, rodzinną i miłość do siebie.',
    'about.symbolism.luck.title': 'Szczęście',
    'about.symbolism.luck.description': 'Czwarty liść przynosi dobre szczęście i pozytywną energię noszącemu.',
    'about.cta.title': 'Gotowy znaleźć swój szczęśliwy element?',
    'about.cta.subtitle': 'Odkryj naszą kolekcję i znajdź idealną biżuterię, która przyniesie szczęście, miłość i piękno do Twojego życia.',
    'about.cta.shopCollection': 'Kup naszą kolekcję',
    'about.cta.browseCategories': 'Przeglądaj kategorie',
    
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
    
    // Footer
    'footer.description': 'Ręcznie robiona biżuteria z motywami czterolistnej koniczyny, przynosząca szczęście i elegancję do Twojego stylu.',
    'footer.shop': 'Sklep',
    'footer.allProducts': 'Wszystkie produkty',
    'footer.customerCare': 'Obsługa klienta',
    'footer.contactUs': 'Skontaktuj się z nami',
    'footer.shippingInfo': 'Informacje o wysyłce',
    'footer.returns': 'Zwroty',
    'footer.sizeGuide': 'Przewodnik rozmiarów',
    'footer.company': 'Firma',
    'footer.aboutUs': 'O nas',
    'footer.careers': 'Kariera',
    'footer.privacyPolicy': 'Polityka prywatności',
    'footer.termsOfService': 'Warunki korzystania',
    'footer.copyright': '© 2024 Biżuteria VariaVaria. Wszystkie prawa zastrzeżone.',
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