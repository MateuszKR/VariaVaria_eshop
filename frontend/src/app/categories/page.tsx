'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTS_SERVICE_URL}/categories`);
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
            <p className="mt-4 text-neutral-600">Loading categories...</p>
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
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">Error Loading Categories</h1>
            <p className="text-neutral-600 mb-8">{error}</p>
            <button
              onClick={fetchCategories}
              className="btn-primary"
            >
              Try Again
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
              Jewelry Categories
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Discover our exquisite collection of handcrafted four-leaf clover jewelry, 
              each piece designed to bring you luck and elegance.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container-max section-padding py-16">
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">No Categories Found</h2>
            <p className="text-neutral-600">Categories will appear here once they are added.</p>
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
                        alt={category.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                        <span className="text-4xl">🍀</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-neutral-600 line-clamp-3">
                        {category.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center text-primary-600 font-medium">
                      View Products
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
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Browse all our products or contact us for custom jewelry designs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-secondary bg-white text-primary-600 hover:bg-primary-50">
                View All Products
              </Link>
              <Link href="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 