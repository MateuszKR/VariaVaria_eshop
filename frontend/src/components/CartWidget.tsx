'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { 
  ShoppingBagIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface CartWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

function CartWidgetItem({ item }: { item: any }) {
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
    <div className="flex items-start space-x-3 p-3 hover:bg-neutral-50 transition-colors">
      {/* Product Image */}
      <div className="flex-shrink-0 w-16 h-16 relative">
        {item.image && !imageError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover rounded-lg"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-primary-500" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-neutral-900 truncate text-sm">
              {item.name}
            </h4>
            {item.category && (
              <p className="text-xs text-neutral-500 mt-1">{item.category}</p>
            )}
          </div>
          <button
            onClick={handleRemove}
            className="p-1 text-neutral-400 hover:text-red-500 transition-colors ml-2"
            title="Remove item"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-1 hover:bg-neutral-200 rounded transition-colors"
              disabled={item.quantity <= 1}
            >
              <MinusIcon className="w-3 h-3" />
            </button>
            <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1 hover:bg-neutral-200 rounded transition-colors"
              disabled={item.maxQuantity && item.quantity >= item.maxQuantity}
            >
              <PlusIcon className="w-3 h-3" />
            </button>
          </div>
          
          <div className="text-right">
            <div className="font-semibold text-neutral-900 text-sm">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartWidget({ isOpen = false, onClose, className = '' }: CartWidgetProps) {
  const { state } = useCart();
  const [mounted, setMounted] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close widget when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!mounted) {
    return null; // Prevent hydration issues
  }

  return (
    <div
      ref={widgetRef}
      className={`cart-widget ${className} ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      } transition-all duration-200 w-96 max-w-sm`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center space-x-2">
          <ShoppingBagIcon className="w-5 h-5 text-primary-600" />
          <h3 className="font-serif font-semibold text-neutral-900">
            Shopping Cart
          </h3>
          <span className="text-sm text-neutral-500">({state.totalItems})</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="max-h-80 overflow-y-auto">
        {state.items.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mb-3">
              <ShoppingBagIcon className="w-8 h-8 text-primary-500" />
            </div>
            <div className="text-2xl mb-2">🍀</div>
            <p className="text-neutral-600 text-sm">Your cart is empty</p>
            <Link 
              href="/products" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
              onClick={onClose}
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {state.items.map((item) => (
              <CartWidgetItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {state.items.length > 0 && (
        <div className="border-t border-neutral-200 p-4 space-y-3">
          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-serif font-semibold text-neutral-900">Total:</span>
            <span className="font-serif font-bold text-lg text-gradient">
              ${state.totalPrice.toFixed(2)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Link
              href="/cart"
              onClick={onClose}
              className="w-full btn-secondary text-center inline-block"
            >
              View Cart
            </Link>
            <button
              onClick={() => {
                toast.success('Proceeding to checkout...');
                onClose?.();
              }}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <span>Checkout</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Message */}
          {state.totalPrice < 100 && (
            <div className="text-xs text-center text-neutral-500 bg-accent-50 p-2 rounded">
              🚚 Add ${(100 - state.totalPrice).toFixed(2)} more for free shipping!
            </div>
          )}
          {state.totalPrice >= 100 && (
            <div className="text-xs text-center text-green-600 bg-green-50 p-2 rounded font-medium">
              🎉 You qualify for free shipping!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Cart Icon Component for Header
export function CartIcon({ onClick, className = '' }: { onClick?: () => void; className?: string }) {
  const { state } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-neutral-700 hover:text-primary-600 transition-colors ${className}`}
    >
      <ShoppingBagIcon className="h-5 w-5" />
      {mounted && state.totalItems > 0 && (
        <span className="cart-badge animate-bounce-gentle">
          {state.totalItems > 99 ? '99+' : state.totalItems}
        </span>
      )}
    </button>
  );
} 