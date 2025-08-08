'use client'

import { useEffect, useMemo, useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, TagIcon, PhotoIcon, LinkIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Category {
  id: number
  name: string
  namePl?: string
  slug: string
  description?: string
  descriptionPl?: string
  imageUrl?: string
  createdAt?: string
}

interface CategoryForm {
  name: string
  namePl?: string
  slug: string
  description: string
  descriptionPl?: string
  imageUrl: string
}

function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  initial,
  mode,
  onRefresh,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: CategoryForm) => Promise<void>
  initial?: Partial<CategoryForm>
  mode: 'add' | 'edit'
  onRefresh: () => Promise<void>
}) {
  const [form, setForm] = useState<CategoryForm>({
    name: '',
    namePl: '',
    slug: '',
    description: '',
    descriptionPl: '',
    imageUrl: '',
  })
  const [error, setError] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initial?.name || '',
        namePl: (initial as any)?.namePl || '',
        slug: initial?.slug || '',
        description: initial?.description || '',
        descriptionPl: (initial as any)?.descriptionPl || '',
        imageUrl: initial?.imageUrl || '',
      })
      setError('')
    }
  }, [isOpen, initial])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!form.name.trim()) throw new Error('Name is required')
      if (!form.slug.trim()) throw new Error('Slug is required')
      await onSubmit({ ...form, name: form.name.trim(), slug: form.slug.trim() })
      // If there is a file selected, upload it to category
      if (file) {
        try {
          const token = localStorage.getItem('adminToken')
          if (!token) throw new Error('Authentication required')

          // We need the category id; onSubmit does not return it, so after creation or update
          // refetch latest categories and find by slug
          await fetch('/api/categories')
            .then(res => res.json())
            .then(async (data) => {
              const cat = (data.categories || []).find((c: any) => c.slug === form.slug)
              if (cat?.id) {
                const fd = new FormData()
                fd.append('image', file)
                const uploadRes = await fetch(`/api/admin/categories/${cat.id}/image`, {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${token}` },
                  body: fd,
                })
                if (!uploadRes.ok) {
                  console.warn('Category image upload failed')
                }
                // Update local list immediately using response if available
                // Response handled; refresh will update UI
              }
            })
        } catch (e) {
          // non-fatal
          console.error('Category image upload failed:', e)
        }
      }
      // Refresh categories to reflect updated image URL
      await onRefresh()
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl">
        <div className="flex items-center justify-between p-5 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">{mode === 'add' ? 'Add Category' : 'Edit Category'}</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-neutral-100">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Name (Polish)</label>
            <input className="input-field" value={form.namePl || ''} onChange={(e) => setForm({ ...form, namePl: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
            <input className="input-field" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            <p className="text-xs text-neutral-500 mt-1">Lowercase, URL-safe (e.g., bracelets, silver-rings)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description (Polish)</label>
            <textarea className="input-field" rows={3} value={form.descriptionPl || ''} onChange={(e) => setForm({ ...form, descriptionPl: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Image URL</label>
            <div className="flex gap-2">
              <input className="input-field flex-1" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
              <button type="button" className="btn-secondary flex items-center gap-1" onClick={() => form.imageUrl && setForm({ ...form, imageUrl: form.imageUrl })}>
                <LinkIcon className="h-4 w-4" />
                <span>Set</span>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Or Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-neutral-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
            />
            {file && (
              <div className="mt-2 flex items-center gap-3">
                <img src={URL.createObjectURL(file)} alt="preview" className="h-12 w-12 object-cover rounded border" />
                <button type="button" className="text-sm text-neutral-600 hover:text-red-600" onClick={() => setFile(null)}>Remove</button>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : (mode === 'add' ? 'Create' : 'Save Changes')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [editing, setEditing] = useState<Category | null>(null)

  const fetchCategories = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to fetch categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (err: any) {
      setError(err?.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const openAdd = () => { setIsAddOpen(true) }
  const openEdit = (cat: Category) => { setEditing(cat); setIsEditOpen(true) }

  const addCategory = async (payload: CategoryForm) => {
    const token = localStorage.getItem('adminToken')
    if (!token) throw new Error('Authentication required')
    const body: any = { name: payload.name, slug: payload.slug }
    if (payload.description && payload.description.trim()) body.description = payload.description.trim()
    if (payload.namePl && payload.namePl.trim()) body.namePl = payload.namePl.trim()
    if (payload.descriptionPl && payload.descriptionPl.trim()) body.descriptionPl = payload.descriptionPl.trim()
    if (payload.imageUrl && payload.imageUrl.trim()) body.imageUrl = payload.imageUrl.trim()
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Failed to create category')
    }
    await fetchCategories()
  }

  const updateCategory = async (id: number, payload: CategoryForm) => {
    const token = localStorage.getItem('adminToken')
    if (!token) throw new Error('Authentication required')
    const body: any = { name: payload.name, slug: payload.slug }
    if (payload.description && payload.description.trim()) body.description = payload.description.trim()
    if (payload.namePl && payload.namePl.trim()) body.namePl = payload.namePl.trim()
    if (payload.descriptionPl && payload.descriptionPl.trim()) body.descriptionPl = payload.descriptionPl.trim()
    if (payload.imageUrl && payload.imageUrl.trim()) body.imageUrl = payload.imageUrl.trim()
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Failed to update category')
    }
    await fetchCategories()
  }

  const deleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    const token = localStorage.getItem('adminToken')
    if (!token) { alert('Authentication required'); return }
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error || 'Failed to delete category')
      return
    }
    await fetchCategories()
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2"><TagIcon className="h-5 w-5"/> Category Management</h2>
          <p className="text-neutral-600">Add, edit, and remove product categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          <span>Add Category</span>
        </button>
      </div>

      {loading ? (
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
          </div>
        </div>
      ) : error ? (
        <div className="p-6">
          <div className="text-red-600 mb-4">{error}</div>
          <button onClick={fetchCategories} className="btn-secondary">Retry</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-neutral-900 w-64">Name</th>
                <th className="text-left py-3 px-3 font-medium text-neutral-900 w-48">Slug</th>
                <th className="text-left py-3 px-3 font-medium text-neutral-900 w-96">Description</th>
                <th className="text-left py-3 px-3 font-medium text-neutral-900 w-96">Name (PL)</th>
                <th className="text-left py-3 px-3 font-medium text-neutral-900 w-96">Description (PL)</th>
                <th className="text-left py-3 px-3 font-medium text-neutral-900 w-64">Image</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-900 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 px-6 text-center text-neutral-500">No categories found</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-neutral-50">
                    <td className="py-3 px-4 text-neutral-900">{cat.name}</td>
                    <td className="py-3 px-3 text-neutral-600">{cat.slug}</td>
                  <td className="py-3 px-3 text-neutral-600">{cat.description || '-'}</td>
                  <td className="py-3 px-3 text-neutral-600">{(cat as any).namePl || '-'}</td>
                  <td className="py-3 px-3 text-neutral-600">{(cat as any).descriptionPl || '-'}</td>
                    <td className="py-3 px-3">
                      {cat.imageUrl ? (
                        <img src={cat.imageUrl} alt={cat.name} className="h-12 w-12 object-cover rounded border border-neutral-200" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IiNFQ0VDRUMiLz48cGF0aCBkPSJNMjQgMTMgMjggMTggMTMgMzVIMzVMMjQgMTNaIiBmaWxsPSIjQkJCQkJCIi8+PC9zdmc+'; }} />
                      ) : (
                        <div className="h-12 w-12 flex items-center justify-center text-neutral-400 border border-dashed border-neutral-300 rounded">
                          <PhotoIcon className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-neutral-600 hover:text-green-600 rounded hover:bg-green-50" title="Edit" onClick={() => openEdit(cat)}>
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-neutral-600 hover:text-red-600 rounded hover:bg-red-50" title="Delete" onClick={() => deleteCategory(cat.id)}>
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CategoryModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={addCategory}
        mode="add"
        onRefresh={fetchCategories}
      />
      <CategoryModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditing(null) }}
        onSubmit={async (payload) => {
          if (!editing) return
          await updateCategory(editing.id, payload)
          // If file is selected inside modal, it will handle upload after update by slug
        }}
        initial={{
          name: editing?.name || '',
          slug: editing?.slug || '',
          description: editing?.description || '',
          imageUrl: editing?.imageUrl || '',
        }}
        mode="edit"
        onRefresh={fetchCategories}
      />
    </div>
  )
}


