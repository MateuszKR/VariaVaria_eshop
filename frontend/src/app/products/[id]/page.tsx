'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeftIcon, 
  ShoppingCartIcon, 
  HeartIcon,
  ShareIcon,
  StarIcon,
  CheckIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface ProductImage {
  id: number;
  url: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Review {
  id: number;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  reviewerName: string;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  material: string;
  weightGrams: number;
  dimensions: string;
  careInstructions: string;
  isActive: boolean;
  isFeatured: boolean;
  category: Category | null;
  images: ProductImage[];
  inventory: {
    quantityAvailable: number;
    quantityReserved: number;
  };
  reviews: Review[];
  rating: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
  primaryImage?: ProductImage;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found');
        } else {
          throw new Error('Failed to fetch product');
        }
        return;
      }
      
      const data = await response.json();
      setProduct(data.product);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    
    try {
      // Add item to cart
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.primaryImage?.url || product.images[0]?.url,
        category: product.category?.name,
        sku: product.sku,
        maxQuantity: product.inventory.quantityAvailable
      });
      
      toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart! 🍀`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const getImageSrc = (imageUrl: string) => {
    if (imageUrl.startsWith('http://localhost:3002')) {
      return imageUrl.replace('http://localhost:3002', '');
    }
    return imageUrl;
  };

  const isOutOfStock = product && product.inventory.quantityAvailable === 0;
  const isLowStock = product && product.inventory.quantityAvailable <= 5 && product.inventory.quantityAvailable > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-max section-padding py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-max section-padding py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">Product Not Found</h1>
            <p className="text-neutral-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
            <Link href="/products" className="btn-primary">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="container-max section-padding py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-neutral-600 mb-8">
          <Link href="/products" className="hover:text-primary-600 transition-colors">
            Products
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary-600 transition-colors">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-neutral-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden">
              {product.primaryImage?.url || product.images.length > 0 ? (
                <img
                  src={getImageSrc(product.primaryImage?.url || product.images[selectedImageIndex]?.url || product.images[0]?.url)}
                  alt={product.primaryImage?.alt || product.images[selectedImageIndex]?.alt || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
                  <span className="text-8xl">🍀</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-primary-500' 
                        : 'border-transparent hover:border-neutral-300'
                    }`}
                  >
                    <img
                      src={getImageSrc(image.url)}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">{product.name}</h1>
              {product.shortDescription && (
                <p className="text-lg text-neutral-600">{product.shortDescription}</p>
              )}
            </div>

            {/* Rating */}
            {product.rating.count > 0 && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating.average) 
                          ? 'text-accent-500' 
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-600">
                  {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </span>
              {product.isFeatured && (
                <span className="bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {isOutOfStock ? (
                <span className="flex items-center space-x-2 text-red-600">
                  <XMarkIcon className="h-5 w-5" />
                  <span>Out of Stock</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2 text-green-600">
                  <CheckIcon className="h-5 w-5" />
                  <span>In Stock</span>
                  {isLowStock && (
                    <span className="text-amber-600 text-sm">
                      (Only {product.inventory.quantityAvailable} left)
                    </span>
                  )}
                </span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {!isOutOfStock && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-neutral-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-neutral-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inventory.quantityAvailable, quantity + 1))}
                    className="p-2 hover:bg-neutral-100 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="btn-primary flex items-center space-x-2 flex-1"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-neutral-600" />
                  )}
                </button>
              </div>
            )}

            {/* Product Details */}
            <div className="border-t border-neutral-200 pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-neutral-900">SKU:</span>
                  <span className="text-neutral-600 ml-2">{product.sku}</span>
                </div>
                {product.category && (
                  <div>
                    <span className="font-medium text-neutral-900">Category:</span>
                    <Link 
                      href={`/products?category=${product.category.slug}`}
                      className="text-primary-600 hover:text-primary-700 ml-2"
                    >
                      {product.category.name}
                    </Link>
                  </div>
                )}
                {product.material && (
                  <div>
                    <span className="font-medium text-neutral-900">Material:</span>
                    <span className="text-neutral-600 ml-2">{product.material}</span>
                  </div>
                )}
                {product.weightGrams && (
                  <div>
                    <span className="font-medium text-neutral-900">Weight:</span>
                    <span className="text-neutral-600 ml-2">{product.weightGrams}g</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="col-span-2">
                    <span className="font-medium text-neutral-900">Dimensions:</span>
                    <span className="text-neutral-600 ml-2">{product.dimensions}</span>
                  </div>
                )}
              </div>

              {product.careInstructions && (
                <div>
                  <h3 className="font-medium text-neutral-900 mb-2">Care Instructions</h3>
                  <p className="text-sm text-neutral-600">{product.careInstructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="bg-white rounded-xl shadow-soft p-8 mb-16">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Description</h2>
            <div className="prose prose-neutral max-w-none">
              <p className="text-neutral-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        )}

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <div className="bg-white rounded-xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarSolidIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-accent-500' : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-neutral-900">{review.reviewerName}</span>
                        {review.isVerifiedPurchase && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      {review.title && (
                        <h4 className="font-medium text-neutral-900">{review.title}</h4>
                      )}
                    </div>
                    <span className="text-sm text-neutral-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-neutral-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 