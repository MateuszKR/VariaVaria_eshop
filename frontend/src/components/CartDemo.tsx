'use client';

import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';

const sampleProducts = [
  {
    id: 1,
    name: "Lucky Clover Necklace",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop",
    category: "Necklaces",
    sku: "NC-001",
    maxQuantity: 5
  },
  {
    id: 2,
    name: "Four Leaf Ring",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop",
    category: "Rings",
    sku: "RG-001",
    maxQuantity: 3
  },
  {
    id: 3,
    name: "Clover Charm Bracelet",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop",
    category: "Bracelets",
    sku: "BR-001",
    maxQuantity: 4
  }
];

export default function CartDemo() {
  const { addItem, state } = useCart();

  const handleAddSampleItem = (product: typeof sampleProducts[0]) => {
    addItem(product);
    toast.success(`Added ${product.name} to cart! 🍀`);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft">
      <h3 className="text-xl font-serif font-bold text-neutral-900 mb-4">
        Cart Demo - Add Sample Items
      </h3>
      <p className="text-neutral-600 mb-6">
        Click the buttons below to test the cart functionality with sample jewelry items.
      </p>
      
      <div className="grid gap-4">
        {sampleProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
            <div>
              <h4 className="font-medium text-neutral-900">{product.name}</h4>
              <p className="text-sm text-neutral-500">{product.category} • ${product.price}</p>
            </div>
            <button
              onClick={() => handleAddSampleItem(product)}
              className="btn-primary"
            >
              Add to Cart 🍀
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-primary-50 rounded-lg">
        <p className="text-sm text-neutral-700">
          <strong>Cart Status:</strong> {state.totalItems} items, ${state.totalPrice.toFixed(2)} total
        </p>
      </div>
    </div>
  );
} 