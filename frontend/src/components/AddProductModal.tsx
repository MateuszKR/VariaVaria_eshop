'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PhotoIcon, LinkIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductImage {
  id?: number;
  url: string;
  alt: string;
  isPrimary: boolean;
  isUploading?: boolean;
  file?: File; // Store the actual file for uploads
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export default function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<ProductImage[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    sku: '',
    price: '',
    categoryId: '',
    material: '',
    weightGrams: '',
    dimensions: '',
    careInstructions: '',
    quantityAvailable: '0',
    isActive: true,
    isFeatured: false,
  });

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Clear any previous errors
    setError('');

    // Process all selected files
    const newImages: ProductImage[] = [];
    let hasErrors = false;

    Array.from(files).forEach((file, index) => {
      if (!file.type.startsWith('image/')) {
        setError(`File "${file.name}" is not an image. Please select only image files.`);
        hasErrors = true;
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError(`File "${file.name}" is too large. Please select images under 5MB.`);
        hasErrors = true;
        return;
      }

      const tempImage: ProductImage = {
        url: URL.createObjectURL(file),
        alt: file.name,
        isPrimary: images.length === 0 && index === 0, // First image of first upload is primary
        isUploading: false, // Set to false since we're just staging for upload
        file: file // Store the file object
      };

      newImages.push(tempImage);
    });

    if (!hasErrors && newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
      // Reset the input so the same files can be selected again if needed
      event.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch {
      setError('Please enter a valid image URL');
      return;
    }

    const newImage: ProductImage = {
      url: imageUrl,
      alt: 'Product image',
      isPrimary: images.length === 0 // First image is primary by default
    };

    setImages(prev => [...prev, newImage]);
    setImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // If we removed the primary image, make the first remaining image primary
      if (prev[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      return newImages;
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages(prev => 
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    );
  };

  const uploadImageToProduct = async (productId: number, image: ProductImage, file?: File) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    if (file) {
      // Upload file
      const formData = new FormData();
      formData.append('image', file);
      formData.append('altText', image.alt);
      formData.append('isPrimary', image.isPrimary.toString());

      const response = await fetch(`/api/admin/products/${productId}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
    } else {
      // Add by URL
      const response = await fetch(`/api/admin/products/${productId}/images/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl: image.url,
          altText: image.alt,
          isPrimary: image.isPrimary,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add image URL');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Prepare the data for submission
      const productData: any = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        sku: formData.sku,
        price: parseFloat(formData.price),
        material: formData.material,
        dimensions: formData.dimensions,
        careInstructions: formData.careInstructions,
        quantityAvailable: parseInt(formData.quantityAvailable),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
      };

      // Only add optional fields if they have values
      if (formData.categoryId) {
        productData.categoryId = parseInt(formData.categoryId);
      }
      if (formData.weightGrams) {
        productData.weightGrams = parseFloat(formData.weightGrams);
      }

      // Create the product first
      const response = await fetch(`/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const productId = result.product.id;

      // Upload images if any
      if (images.length > 0) {
        for (const image of images) {
          try {
            if (image.file) {
              // This is a file upload
              await uploadImageToProduct(productId, image, image.file);
            } else {
              // This is a URL-based image
              await uploadImageToProduct(productId, image);
            }
          } catch (imageError) {
            console.error('Failed to upload image:', imageError);
            // Continue with other images even if one fails
          }
        }
      }

      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        sku: '',
        price: '',
        categoryId: '',
        material: '',
        weightGrams: '',
        dimensions: '',
        careInstructions: '',
        quantityAvailable: '0',
        isActive: true,
        isFeatured: false,
      });
      setImages([]);
      setImageUrl('');
      
      onProductAdded(); // Refresh the product list
      onClose(); // Close the modal

    } catch (err) {
      console.error('Error creating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      sku: '',
      price: '',
      categoryId: '',
      material: '',
      weightGrams: '',
      dimensions: '',
      careInstructions: '',
      quantityAvailable: '0',
      isActive: true,
      isFeatured: false,
    });
    setImages([]);
    setImageUrl('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">Add New Product</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Product Details */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Sterling Silver Clover Ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    required
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., RING-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Brief one-line description"
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="input-field"
                    placeholder="Detailed product description..."
                  />
                </div>
              </div>

              {/* Pricing and Category */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900">Pricing & Category</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Category
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900">Product Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Material
                    </label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g., Sterling Silver"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Weight (grams)
                    </label>
                    <input
                      type="number"
                      name="weightGrams"
                      min="0"
                      step="0.1"
                      value={formData.weightGrams}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 15mm x 12mm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Care Instructions
                  </label>
                  <textarea
                    name="careInstructions"
                    value={formData.careInstructions}
                    onChange={handleInputChange}
                    rows={3}
                    className="input-field"
                    placeholder="How to care for this product..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Initial Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantityAvailable"
                    required
                    min="0"
                    value={formData.quantityAvailable}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="0"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Number of items available in stock</p>
                </div>
              </div>

              {/* Status Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900">Status</h3>
                
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="rounded border-neutral-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-neutral-700">Active (visible on store)</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="rounded border-neutral-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-neutral-700">Featured product</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900">Product Images</h3>
                
                {/* File Upload */}
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors">
                  <PhotoIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-sm font-medium text-primary-600 hover:text-primary-500">
                      Upload image files
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      multiple
                    />
                  </label>
                  <p className="text-xs text-neutral-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>

                {/* URL Input */}
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Or enter image URL..."
                      className="input-field"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span>Add URL</span>
                  </button>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-neutral-900">Preview ({images.length} images)</h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-3 p-3 border rounded-lg ${
                            image.isPrimary ? 'border-primary-500 bg-primary-50' : 'border-neutral-200'
                          }`}
                        >
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-neutral-100">
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEw0NCA0NEwyMCA0NFYyMFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
                              }}
                            />
                            {image.isUploading && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                              </div>
                            )}
                            {image.isPrimary && (
                              <div className="absolute top-1 right-1 bg-primary-500 text-white text-xs px-1 rounded">
                                Primary
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">{image.alt}</p>
                            <p className="text-xs text-neutral-500 truncate">{image.url}</p>
                          </div>

                          <div className="flex items-center space-x-2">
                            {!image.isPrimary && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(index)}
                                className="text-xs text-primary-600 hover:text-primary-700"
                              >
                                Set Primary
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 