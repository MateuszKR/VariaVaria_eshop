'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import AddProductModal from '@/components/AddProductModal'
import CategoriesManager from '@/components/CategoriesManager'
import EditProductModal from '@/components/EditProductModal'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  CubeIcon,
  UserGroupIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightOnRectangleIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface Product {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  price: number;
  categoryId?: number;
  categoryName?: string;
  material?: string;
  weightGrams?: number;
  dimensions?: string;
  careInstructions?: string;
  quantityAvailable: number;
  isActive: boolean;
  isFeatured?: boolean;
  primaryImage?: {
    url: string;
    alt: string;
  };
  images?: Array<{
    id: number;
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  createdAt: string;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  itemCount: number;
  createdAt: string;
}

const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'CLV-2024-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    total: 219.98,
    status: 'pending',
    itemCount: 2,
    createdAt: '2024-01-16 10:30'
  },
  {
    id: 2,
    orderNumber: 'CLV-2024-002',
    customerName: 'Mike Chen',
    customerEmail: 'mike@example.com',
    total: 89.99,
    status: 'shipped',
    itemCount: 1,
    createdAt: '2024-01-15 14:20'
  },
  {
    id: 3,
    orderNumber: 'CLV-2024-003',
    customerName: 'Emma Wilson',
    customerEmail: 'emma@example.com',
    total: 159.98,
    status: 'delivered',
    itemCount: 2,
    createdAt: '2024-01-14 09:15'
  }
]

function DashboardStats({ productsCount }: { productsCount: number }) {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,540',
      change: '+12.5%',
      icon: BanknotesIcon,
      color: 'text-green-600'
    },
    {
      title: 'Total Orders',
      value: '154',
      change: '+8.2%',
      icon: ShoppingBagIcon,
      color: 'text-blue-600'
    },
    {
      title: 'Products',
      value: productsCount.toString(),
      change: '+3',
      icon: CubeIcon,
      color: 'text-purple-600'
    },
    {
      title: 'Customers',
      value: '1,247',
      change: '+15.3%',
      icon: UserGroupIcon,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">{stat.title}</p>
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              <p className={`text-sm ${stat.color}`}>{stat.change}</p>
            </div>
            <div className="p-3 bg-neutral-100 rounded-lg">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProductManagement({ 
  onAddProductClick, 
  onEditProductClick 
}: { 
  onAddProductClick: () => void;
  onEditProductClick: (product: Product) => void;
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`/api/admin/products?limit=1000`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, []) // This will be triggered by the key prop change

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesStatus = true
    if (statusFilter === 'active') {
      matchesStatus = product.isActive && product.quantityAvailable > 0
    } else if (statusFilter === 'inactive') {
      matchesStatus = !product.isActive
    } else if (statusFilter === 'low_stock') {
      matchesStatus = product.isActive && product.quantityAvailable <= 5 && product.quantityAvailable > 0
    } else if (statusFilter === 'out_of_stock') {
      matchesStatus = product.quantityAvailable === 0
    }
    
    return matchesSearch && matchesStatus
  })

  const getProductStatus = (product: Product) => {
    if (!product.isActive) return { status: 'inactive', color: 'text-neutral-600 bg-neutral-100' }
    if (product.quantityAvailable === 0) return { status: 'out_of_stock', color: 'text-red-600 bg-red-100' }
    if (product.quantityAvailable <= 5) return { status: 'low_stock', color: 'text-yellow-600 bg-yellow-100' }
    return { status: 'active', color: 'text-green-600 bg-green-100' }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'low_stock': return 'Low Stock'
      case 'out_of_stock': return 'Out of Stock'
      case 'inactive': return 'Inactive'
      default: return status
    }
  }

  const deleteProduct = async (productId: number, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      // Refresh the products list
      fetchProducts()
    } catch (err) {
      alert('Failed to delete product: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchProducts} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Product Management</h2>
            <p className="text-neutral-600">Manage your jewelry inventory ({products.length} products)</p>
          </div>
          <button 
            onClick={onAddProductClick}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="input-field sm:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-visible" style={{ transform: 'rotateX(180deg)' }}>
        <div className="inline-block min-w-full align-middle" style={{ transform: 'rotateX(180deg)' }}>
        <table className="w-full min-w-[1000px]">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-neutral-900 w-80">Product</th>
              <th className="text-left py-3 px-3 font-medium text-neutral-900 w-32">SKU</th>
              <th className="text-left py-3 px-3 font-medium text-neutral-900 w-32">Category</th>
              <th className="text-left py-3 px-3 font-medium text-neutral-900 w-24">Price</th>
              <th className="text-left py-3 px-3 font-medium text-neutral-900 w-20">Stock</th>
              <th className="text-left py-3 px-3 font-medium text-neutral-900 w-28">Status</th>
              <th className="text-left py-3 px-4 font-medium text-neutral-900 w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 px-6 text-center text-neutral-500">
                  {searchTerm || statusFilter !== 'all' ? 'No products match your filters' : 'No products found'}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const productStatus = getProductStatus(product)
                return (
                  <tr key={product.id} className="hover:bg-neutral-50">
                    <td className="py-4 px-4 w-80">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                          {product.primaryImage ? (
                            <img
                              src={product.primaryImage.url}
                              alt={product.primaryImage.alt}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <CubeIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-neutral-900 truncate">{product.name}</div>
                          <div className="text-xs text-neutral-500">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-neutral-900 text-sm w-32 truncate">{product.sku}</td>
                    <td className="py-4 px-3 text-neutral-600 text-sm w-32 truncate">{product.categoryName || 'Uncategorized'}</td>
                    <td className="py-4 px-3 font-medium text-neutral-900 text-sm w-24">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-3 w-20">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-neutral-900 text-sm">{product.quantityAvailable}</span>
                        {product.quantityAvailable <= 5 && product.quantityAvailable > 0 && (
                          <span className="text-yellow-600 text-xs">⚠️</span>
                        )}
                        {product.quantityAvailable === 0 && (
                          <span className="text-red-600 text-xs">❌</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-3 w-28">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${productStatus.color}`}>
                        {getStatusText(productStatus.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 w-32">
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => window.open(`/products/${product.id}`, '_blank')}
                          className="p-1.5 text-neutral-600 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onEditProductClick(product)}
                          className="p-1.5 text-neutral-600 hover:text-green-600 transition-colors rounded hover:bg-green-50"
                          title="Edit Product"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id, product.name)}
                          className="p-1.5 text-neutral-600 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                          title="Delete Product"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}

function OrderManagement() {
  const [orders, setOrders] = useState(mockOrders)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'confirmed': return 'text-blue-600 bg-blue-100'
      case 'shipped': return 'text-purple-600 bg-purple-100'
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-neutral-600 bg-neutral-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return ClockIcon
      case 'delivered': return CheckCircleIcon
      case 'cancelled': return XCircleIcon
      default: return ClockIcon
    }
  }

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Recent Orders</h2>
            <p className="text-neutral-600">Manage customer orders and fulfillment</p>
          </div>
          <button className="btn-secondary flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto" style={{ transform: 'rotateX(180deg)' }}>
        <div style={{ transform: 'rotateX(180deg)' }}>
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left py-3 px-6 font-medium text-neutral-900">Order</th>
              <th className="text-left py-3 px-6 font-medium text-neutral-900">Customer</th>
              <th className="text-left py-3 px-6 font-medium text-neutral-900">Items</th>
              <th className="text-left py-3 px-6 font-medium text-neutral-900">Total</th>
              <th className="text-left py-3 px-6 font-medium text-neutral-900">Status</th>
              <th className="text-left py-3 px-6 font-medium text-neutral-900">Date</th>
              <th className="text-left py-3 px-6 font-medium text-neutral-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status)
              return (
                <tr key={order.id} className="hover:bg-neutral-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-neutral-900">{order.orderNumber}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-neutral-900">{order.customerName}</div>
                      <div className="text-sm text-neutral-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-neutral-600">{order.itemCount} items</td>
                  <td className="py-4 px-6 font-medium text-neutral-900">${order.total}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="h-4 w-4" />
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-neutral-600">{order.createdAt}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-neutral-600 hover:text-blue-600 transition-colors">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <select 
                        className="text-sm border border-neutral-300 rounded px-2 py-1"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}

function QuickActions({ onAddProductClick }: { onAddProductClick: () => void }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button 
          onClick={onAddProductClick}
          className="btn-primary flex items-center justify-center space-x-2 py-3 w-full"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Product</span>
        </button>
        <button className="btn-secondary flex items-center justify-center space-x-2 py-3 w-full">
          <ChartBarIcon className="h-5 w-5" />
          <span>View Reports</span>
        </button>
        <button className="btn-accent flex items-center justify-center space-x-2 py-3 w-full">
          <CubeIcon className="h-5 w-5" />
          <span>Manage Stock</span>
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 w-full">
          <UserGroupIcon className="h-5 w-5" />
          <span>View Customers</span>
        </button>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, adminUser, logout } = useAdminAuth()
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productsCount, setProductsCount] = useState(0)
  const [productsKey, setProductsKey] = useState(0)
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')

  // Fetch products count for dashboard stats
  useEffect(() => {
    const fetchProductsCount = async () => {
      try {
        const response = await fetch(`/api/products?limit=1`)
        if (response.ok) {
          const data = await response.json()
          setProductsCount(data.pagination?.totalItems || 0)
        }
      } catch (err) {
        console.error('Failed to fetch products count:', err)
      }
    }

    if (isAuthenticated) {
      fetchProductsCount()
    }
  }, [isAuthenticated])

  const handleAddProductClick = () => {
    setIsAddProductModalOpen(true)
  }

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product)
    setIsEditProductModalOpen(true)
  }

  const handleProductAdded = () => {
    // Close the modal first
    setIsAddProductModalOpen(false)
    
    // Force ProductManagement component to refresh its products list
    setProductsKey(prev => prev + 1)
  }

  const handleProductUpdated = () => {
    // Close the modal first
    setIsEditProductModalOpen(false)
    setEditingProduct(null)
    
    // Force ProductManagement component to refresh its products list
    // We'll use a key prop to force re-render
    setProductsKey(prev => prev + 1)
  }

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, the useAdminAuth hook will redirect to login
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-serif font-bold text-neutral-900">
                Admin Dashboard
              </h1>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                VariaVaria Jewelry
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Admin User Info */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <UserIcon className="h-4 w-4" />
                  <span>Welcome, {adminUser?.firstName || 'Admin'}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors px-3 py-1 rounded-lg hover:bg-neutral-100"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
              <button className="btn-secondary">
                View Store
              </button>
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">{adminUser?.firstName?.charAt(0) || 'A'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats productsCount={productsCount} />

        {/* Admin Tabs */}
        <div className="mb-6">
          <div className="inline-flex rounded-lg border border-neutral-200 bg-white overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'products' ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-l border-neutral-200 ${activeTab === 'categories' ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </button>
          </div>
        </div>

        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-8">
            <div className="lg:col-span-5">
              <ProductManagement 
                key={productsKey}
                onAddProductClick={handleAddProductClick}
                onEditProductClick={handleEditProductClick}
              />
            </div>
            <div className="lg:col-span-1">
              <QuickActions onAddProductClick={handleAddProductClick} />
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <CategoriesManager />
          </div>
        )}

        <OrderManagement />
      </main>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onProductAdded={handleProductAdded}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={isEditProductModalOpen}
        onClose={() => setIsEditProductModalOpen(false)}
        onProductUpdated={handleProductUpdated}
        product={editingProduct}
      />
    </div>
  )
} 