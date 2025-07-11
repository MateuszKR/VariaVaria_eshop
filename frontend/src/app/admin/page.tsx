'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
  XCircleIcon
} from '@heroicons/react/24/outline'

// Mock data - would come from API calls in real implementation
const mockProducts = [
  {
    id: 1,
    name: 'Sterling Silver Four-Leaf Clover Ring',
    sku: 'RING-001',
    price: 89.99,
    category: 'Rings',
    stock: 25,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Rose Gold Clover Necklace',
    sku: 'NECK-001',
    price: 129.99,
    category: 'Necklaces',
    stock: 30,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100',
    createdAt: '2024-01-14'
  },
  {
    id: 3,
    name: 'Gold-Filled Clover Earrings',
    sku: 'EAR-001',
    price: 79.99,
    category: 'Earrings',
    stock: 5,
    status: 'low_stock',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100',
    createdAt: '2024-01-13'
  },
  {
    id: 4,
    name: 'Silver Clover Charm Bracelet',
    sku: 'BRAC-001',
    price: 99.99,
    category: 'Bracelets',
    stock: 0,
    status: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=100',
    createdAt: '2024-01-12'
  }
]

const mockOrders = [
  {
    id: 1,
    orderNumber: 'CLV-2024-001',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    total: 219.98,
    status: 'pending',
    items: 2,
    createdAt: '2024-01-16 10:30'
  },
  {
    id: 2,
    orderNumber: 'CLV-2024-002',
    customer: 'Mike Chen',
    email: 'mike@example.com',
    total: 89.99,
    status: 'shipped',
    items: 1,
    createdAt: '2024-01-15 14:20'
  },
  {
    id: 3,
    orderNumber: 'CLV-2024-003',
    customer: 'Emma Wilson',
    email: 'emma@example.com',
    total: 159.98,
    status: 'delivered',
    items: 2,
    createdAt: '2024-01-14 09:15'
  }
]

function DashboardStats() {
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
      value: '48',
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

function ProductManagement() {
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'low_stock': return 'text-yellow-600 bg-yellow-100'
      case 'out_of_stock': return 'text-red-600 bg-red-100'
      default: return 'text-neutral-600 bg-neutral-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'low_stock': return 'Low Stock'
      case 'out_of_stock': return 'Out of Stock'
      default: return status
    }
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Product Management</h2>
            <p className="text-neutral-600">Manage your jewelry inventory</p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
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
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left py-3 px-6 font-medium text-neutral-900">Product</th>
              <th className="text-left py-3 px-6 font-medium text-neutral-900">SKU</th>
              <th className="text-left py-3 px-6 font-medium text-neutral-900">Category</th>
              <th className="text-left py-3 px-6 font-medium text-neutral-900">Price</th>
              <th className="text-left py-3 px-6 font-medium text-neutral-900">Stock</th>
              <th className="text-left py-3 px-6 font-medium text-neutral-900">Status</th>
              <th className="text-left py-3 px-6 font-medium text-neutral-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-50">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">{product.name}</div>
                      <div className="text-sm text-neutral-500">Added {product.createdAt}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-neutral-900">{product.sku}</td>
                <td className="py-4 px-6 text-neutral-600">{product.category}</td>
                <td className="py-4 px-6 font-medium text-neutral-900">${product.price}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-neutral-900">{product.stock}</span>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="text-yellow-600 text-sm">⚠️</span>
                    )}
                    {product.stock === 0 && (
                      <span className="text-red-600 text-sm">❌</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                    {getStatusText(product.status)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-neutral-600 hover:text-blue-600 transition-colors">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-neutral-600 hover:text-green-600 transition-colors">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-neutral-600 hover:text-red-600 transition-colors">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    setOrders(prev => prev.map(order => 
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

      <div className="overflow-x-auto">
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
                      <div className="font-medium text-neutral-900">{order.customer}</div>
                      <div className="text-sm text-neutral-500">{order.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-neutral-600">{order.items} items</td>
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
  )
}

function QuickActions() {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="btn-primary flex items-center justify-center space-x-2 py-4">
          <PlusIcon className="h-5 w-5" />
          <span>Add Product</span>
        </button>
        <button className="btn-secondary flex items-center justify-center space-x-2 py-4">
          <ChartBarIcon className="h-5 w-5" />
          <span>View Reports</span>
        </button>
        <button className="btn-accent flex items-center justify-center space-x-2 py-4">
          <CubeIcon className="h-5 w-5" />
          <span>Manage Stock</span>
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-4 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
          <UserGroupIcon className="h-5 w-5" />
          <span>View Customers</span>
        </button>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
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
                Four Leaf Clover Jewelry
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-secondary">
                View Store
              </button>
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats />
        
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <ProductManagement />
            <OrderManagement />
          </div>
          <div className="space-y-6">
            <QuickActions />
            
            {/* Low Stock Alert */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Low Stock Alert</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <div className="font-medium text-neutral-900">Gold Clover Earrings</div>
                    <div className="text-sm text-neutral-600">5 items left</div>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Restock
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-neutral-900">Silver Bracelet</div>
                    <div className="text-sm text-neutral-600">Out of stock</div>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Restock
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 