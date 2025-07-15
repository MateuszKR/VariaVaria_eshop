'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { 
  PlusIcon, 
  MinusIcon, 
  TrashIcon, 
  ShoppingBagIcon,
  ArrowLeftIcon,
  HeartIcon,
  SparklesIcon,
  CreditCardIcon,
  LockClosedIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

function Header() {
  const { t } = useI18n()
  
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-neutral-200">
      <div className="container-max section-padding">
        <div className="flex items-center justify-between h-16">
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
            <span className="text-xl font-serif font-semibold text-gradient">
              VariaVaria
            </span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/products" className="text-neutral-700 hover:text-primary-600 transition-colors">
              {t('cart.continueShopping')}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function CartItem({ item }: { item: any }) {
  const { updateQuantity, removeItem } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(item.id);
      toast.success('Item removed from cart');
    } else if (item.maxQuantity && newQuantity > item.maxQuantity) {
      toast.error(`Maximum quantity available: ${item.maxQuantity}`);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
    toast.success('Item removed from cart');
  };

  return (
    <div className="cart-item-card group">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0 w-24 h-24 relative">
          {item.image && !imageError ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-primary-500" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-serif font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                <Link href={`/products/${item.id}`} className="hover:underline">
                  {item.name}
                </Link>
              </h3>
              {item.category && (
                <p className="text-sm text-neutral-500 mt-1">{item.category}</p>
              )}
              {item.sku && (
                <p className="text-xs text-neutral-400 mt-1">SKU: {item.sku}</p>
              )}
            </div>
            <button
              onClick={handleRemove}
              className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
              title="Remove item"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Quantity and Price */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  className="p-2 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                  disabled={item.quantity <= 1}
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  className="p-2 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                  disabled={item.maxQuantity && item.quantity >= item.maxQuantity}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              {item.maxQuantity && item.quantity >= item.maxQuantity && (
                <span className="text-xs text-orange-600">Max available</span>
              )}
            </div>
            
            <div className="text-right">
              <div className="font-serif font-bold text-lg text-neutral-900">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <div className="text-sm text-neutral-500">
                ${item.price.toFixed(2)} each
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartSummary() {
  const { state, clearCart } = useCart();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = state.totalPrice;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax - discount;

  const handlePromoCode = () => {
    // Simple promo code logic - in real app this would call an API
    if (promoCode.toLowerCase() === 'lucky') {
      setDiscount(subtotal * 0.1); // 10% discount
      toast.success('Promo code applied! 10% discount');
    } else if (promoCode.toLowerCase() === 'clover') {
      setDiscount(15); // $15 off
      toast.success('Promo code applied! $15 off');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handleCheckout = () => {
    // In a real app, this would integrate with a payment processor
    toast.success('Proceeding to checkout...');
    // router.push('/checkout');
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  return (
    <div className="cart-summary-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold text-neutral-900">
          Order Summary
        </h2>
        <div className="text-4xl">🍀</div>
      </div>

      {/* Promo Code */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Promo Code
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code (try 'LUCKY')"
            className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            onClick={handlePromoCode}
            className="btn-secondary whitespace-nowrap"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal ({state.totalItems} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-neutral-600">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-neutral-600">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        {subtotal > 100 && shipping === 0 && (
          <div className="text-sm text-green-600 font-medium">
            🎉 Free shipping on orders over $100!
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 pt-4 mb-6">
        <div className="flex justify-between items-center text-xl font-serif font-bold">
          <span>Total</span>
          <span className="text-gradient">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          className="w-full btn-primary flex items-center justify-center space-x-2 py-4"
        >
          <LockClosedIcon className="w-5 h-5" />
          <span>Secure Checkout</span>
        </button>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-neutral-500">
          <div className="flex items-center space-x-1">
            <CreditCardIcon className="w-4 h-4" />
            <span>Secure payments</span>
          </div>
          <div className="flex items-center space-x-1">
            <TruckIcon className="w-4 h-4" />
            <span>Fast shipping</span>
          </div>
        </div>

        <button
          onClick={handleClearCart}
          className="w-full text-neutral-500 hover:text-red-500 transition-colors text-sm py-2"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBagIcon className="w-12 h-12 text-primary-500" />
        </div>
        <div className="text-6xl mb-4">🍀</div>
        <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-neutral-600 max-w-md mx-auto">
          Discover our beautiful collection of handcrafted four-leaf clover jewelry 
          and start filling your cart with luck and elegance.
        </p>
      </div>
      
      <div className="space-y-4">
        <Link href="/products" className="btn-primary inline-flex items-center space-x-2">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Continue Shopping</span>
        </Link>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products?featured=true" className="btn-secondary">
            ✨ Featured Items
          </Link>
          <Link href="/categories" className="btn-secondary">
            🏷️ Browse Categories
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { state } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration issues
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Header />
      
      <div className="container-max section-padding py-8">
        {state.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div>
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-4">
                Shopping Cart
              </h1>
              <p className="text-lg text-neutral-600">
                Review your lucky finds and complete your order
              </p>
            </div>

            {/* Cart Content */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-serif font-semibold text-neutral-900">
                    Cart Items ({state.totalItems})
                  </h2>
                  <Link href="/products" className="text-primary-600 hover:text-primary-700 flex items-center space-x-1">
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
                
                {state.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <CartSummary />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 