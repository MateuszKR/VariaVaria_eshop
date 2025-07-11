'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
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

// Sample data - would come from API in real implementation
const featuredProducts = [
  {
    id: 1,
    name: 'Sterling Silver Four-Leaf Clover Ring',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isSale: true
  },
  {
    id: 2,
    name: 'Rose Gold Clover Necklace',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
    rating: 4.9,
    reviews: 89,
    isNew: false,
    isSale: false
  },
  {
    id: 3,
    name: 'Gold-Filled Clover Earrings',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
    rating: 4.7,
    reviews: 67,
    isNew: true,
    isSale: false
  },
  {
    id: 4,
    name: 'Silver Clover Charm Bracelet',
    price: 99.99,
    originalPrice: 139.99,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
    rating: 4.8,
    reviews: 156,
    isNew: false,
    isSale: true
  }
]

const categories = [
  { name: 'Rings', slug: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300' },
  { name: 'Necklaces', slug: 'necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300' },
  { name: 'Earrings', slug: 'earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300' },
  { name: 'Bracelets', slug: 'bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300' }
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-neutral-200">
      <div className="container-max section-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <SparklesIcon className="h-8 w-8 clover-icon" />
            <span className="text-xl font-serif font-semibold text-gradient">
              Four Leaf Clover
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-neutral-700 hover:text-primary-600 transition-colors">
              Products
            </Link>
            <Link href="/categories" className="text-neutral-700 hover:text-primary-600 transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-neutral-700 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-neutral-700 hover:text-primary-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-neutral-700 hover:text-primary-600 transition-colors">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            <Link href="/account" className="p-2 text-neutral-700 hover:text-primary-600 transition-colors">
              <UserIcon className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="p-2 text-neutral-700 hover:text-primary-600 transition-colors relative">
              <ShoppingBagIcon className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
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
                Products
              </Link>
              <Link href="/categories" className="text-neutral-700 hover:text-primary-600 transition-colors">
                Categories
              </Link>
              <Link href="/about" className="text-neutral-700 hover:text-primary-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-neutral-700 hover:text-primary-600 transition-colors">
                Contact
              </Link>
              <hr className="border-neutral-200" />
              <Link href="/account" className="text-neutral-700 hover:text-primary-600 transition-colors">
                My Account
              </Link>
              <Link href="/cart" className="text-neutral-700 hover:text-primary-600 transition-colors">
                Shopping Cart
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero-gradient py-20 lg:py-32">
      <div className="container-max section-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-serif font-bold text-neutral-900 leading-tight">
                Handcrafted 
                <span className="text-gradient block">Lucky Jewelry</span>
              </h1>
              <p className="text-xl text-neutral-600 leading-relaxed">
                Discover our beautiful collection of four-leaf clover jewelry, 
                carefully handcrafted to bring you luck, style, and elegance.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="btn-primary">
                Shop Now
              </Link>
              <Link href="/about" className="btn-secondary">
                Our Story
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">500+</div>
                <div className="text-sm text-neutral-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">4.9</div>
                <div className="text-sm text-neutral-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">100%</div>
                <div className="text-sm text-neutral-600">Handcrafted</div>
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
            <div className="absolute -top-4 -left-4 bg-accent-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              ✨ Featured
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: any }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <div className="product-card hover-lift">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              New
            </span>
          )}
          {product.isSale && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          {isWishlisted ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-neutral-600" />
          )}
        </button>

        {/* Quick Actions */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full btn-primary py-2 text-sm">
            Quick Add to Cart
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-medium text-neutral-900 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) 
                    ? 'text-accent-500 fill-current' 
                    : 'text-neutral-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-neutral-500">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-neutral-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-neutral-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {product.isSale && product.originalPrice && (
            <span className="text-sm font-medium text-red-600">
              Save ${(product.originalPrice - product.price).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function FeaturedProducts() {
  return (
    <section className="py-20">
      <div className="container-max section-padding">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900">
            Featured Products
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover our most popular four-leaf clover jewelry pieces, 
            each one handcrafted with love and attention to detail.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products" className="btn-secondary">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section className="py-20 bg-white">
      <div className="container-max section-padding">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900">
            Shop by Category
          </h2>
          <p className="text-lg text-neutral-600">
            Find the perfect four-leaf clover jewelry for every occasion
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/categories/${category.slug}`}
              className="group"
            >
              <div className="card hover-lift overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-xl font-serif font-semibold">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Quality Guarantee',
      description: 'All our jewelry comes with a lifetime quality guarantee'
    },
    {
      icon: TruckIcon,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $100 worldwide'
    },
    {
      icon: HeartIcon,
      title: 'Handcrafted',
      description: 'Each piece is carefully handcrafted by skilled artisans'
    },
    {
      icon: SparklesIcon,
      title: 'Lucky Charm',
      description: 'Authentic four-leaf clover designs for good luck'
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
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container-max section-padding py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-serif font-semibold text-white">
                Four Leaf Clover
              </span>
            </div>
            <p className="text-neutral-400">
              Handcrafted jewelry with four-leaf clover designs, 
              bringing luck and elegance to your style.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/categories/rings" className="hover:text-white transition-colors">Rings</Link></li>
              <li><Link href="/categories/necklaces" className="hover:text-white transition-colors">Necklaces</Link></li>
              <li><Link href="/categories/earrings" className="hover:text-white transition-colors">Earrings</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Customer Care</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-400">
          <p>&copy; 2024 Four Leaf Clover Jewelry. All rights reserved.</p>
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