'use client'

import { useState } from 'react'
import { apps as initialApps, App, AppStatus, STATUS_CONFIG } from '@/config/apps'

const STATUSES: AppStatus[] = ['idea', 'building', 'testing', 'mvp', 'shipped']

export default function AdminKanban() {
  const [appList, setAppList] = useState<App[]>(initialApps)
  const [draggedApp, setDraggedApp] = useState<App | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [editingApp, setEditingApp] = useState<App | null>(null)

  const getAppsByStatus = (status: AppStatus) =>
    appList.filter(app => app.status === status)

  const handleDragStart = (app: App) => {
    setDraggedApp(app)
  }

  const handleDrop = (newStatus: AppStatus) => {
    if (!draggedApp) return

    setAppList(prev => prev.map(app =>
      app.slug === draggedApp.slug
        ? { ...app, status: newStatus }
        : app
    ))
    setDraggedApp(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const addNewApp = (app: App) => {
    setAppList(prev => [...prev, app])
    setShowAddModal(false)
  }

  const updateApp = (updatedApp: App) => {
    setAppList(prev => prev.map(app =>
      app.slug === updatedApp.slug ? updatedApp : app
    ))
    setEditingApp(null)
  }

  const generateConfigCode = () => {
    const code = appList.map(app => `  {
    slug: '${app.slug}',
    title: '${app.title}',
    icon: '${app.icon}',
    color: '${app.color}',
    embedUrl: '${app.embedUrl}',${app.category ? `\n    category: '${app.category}',` : ''}
    createdAt: '${app.createdAt}',${app.updatedAt ? `\n    updatedAt: '${app.updatedAt}',` : ''}${app.updateType ? `\n    updateType: '${app.updateType}',` : ''}
    status: '${app.status}',${app.private ? `\n    private: true,` : ''}${app.stripePriceId ? `\n    stripePriceId: '${app.stripePriceId}',` : ''}${app.price ? `\n    price: '${app.price}',` : ''}
  }`).join(',\n')

    return `export type AppStatus = 'idea' | 'building' | 'testing' | 'mvp' | 'shipped'

export type UpdateType = 'fixed' | 'features'

export type App = {
  slug: string
  title: string
  icon: string
  color: string
  embedUrl: string
  category?: string
  createdAt: string
  updatedAt?: string
  updateType?: UpdateType
  status: AppStatus
  private?: boolean
  stripeProductId?: string
  stripePriceId?: string
  price?: string
}

export const STATUS_CONFIG: Record<AppStatus, { icon: string; label: string; visible: boolean }> = {
  idea: { icon: '💡', label: 'Idea', visible: true },
  building: { icon: '🧪', label: 'Building', visible: true },
  testing: { icon: '🔬', label: 'Testing', visible: true },
  mvp: { icon: '⚛️', label: 'MVP', visible: true },
  shipped: { icon: '🚀', label: 'Shipped', visible: true },
}

export const apps: App[] = [
${code},
]

function isWithinDays(dateStr: string, days: number): boolean {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  return diffDays <= days
}

export function isNewApp(createdAt: string, days: number = 14): boolean {
  return isWithinDays(createdAt, days)
}

export function isUpdatedApp(app: App, days: number = 14): boolean {
  if (!app.updatedAt) return false
  return isWithinDays(app.updatedAt, days)
}

export function getVisibleApps(showAll: boolean = false): App[] {
  if (showAll) return apps
  return apps.filter(app => STATUS_CONFIG[app.status].visible)
}`
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">App Kanban</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            + Add App
          </button>
          <button
            onClick={() => setShowExport(true)}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Export Config
          </button>
          <a
            href="/"
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            View Site
          </a>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map(status => (
          <div
            key={status}
            className="flex-shrink-0 w-64 bg-slate-800 rounded-xl p-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(status)}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{STATUS_CONFIG[status].icon}</span>
              <h2 className="text-white font-semibold capitalize">{status}</h2>
              <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full ml-auto">
                {getAppsByStatus(status).length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {getAppsByStatus(status).map(app => (
                <div
                  key={app.slug}
                  draggable
                  onDragStart={() => handleDragStart(app)}
                  className="bg-slate-700 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-slate-600 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: app.color }}
                    >
                      {app.icon}
                    </span>
                    <div className="flex-1">
                      <p className="text-white font-medium">{app.title}</p>
                      <p className="text-slate-400 text-xs">{app.category || 'No category'}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingApp(app)
                      }}
                      className="opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-300 p-1 transition-opacity"
                      title="Edit app"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm(`Delete ${app.title}?`)) {
                          setAppList(prev => prev.filter(a => a.slug !== app.slug))
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 transition-opacity"
                      title="Delete app"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {getAppsByStatus(status).length === 0 && (
                <div className="text-slate-500 text-sm text-center py-8 border-2 border-dashed border-slate-700 rounded-lg">
                  Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add App Modal */}
      {showAddModal && (
        <AddAppModal
          onClose={() => setShowAddModal(false)}
          onAdd={addNewApp}
        />
      )}

      {/* Edit App Modal */}
      {editingApp && (
        <EditAppModal
          app={editingApp}
          onClose={() => setEditingApp(null)}
          onSave={updateApp}
        />
      )}

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-bold text-white mb-4">Export Config</h2>
            <p className="text-slate-400 text-sm mb-4">
              1. Copy this <strong>entire</strong> code<br />
              2. Go to <a href="https://github.com/mrpoffice-collab/code63box/edit/main/src/config/apps.ts" target="_blank" className="text-blue-400 underline">apps.ts on GitHub</a><br />
              3. Select all (Ctrl+A) and paste (Ctrl+V)<br />
              4. Click "Commit changes"
            </p>
            <pre className="bg-slate-900 p-4 rounded-lg text-sm text-green-400 overflow-auto">
              {generateConfigCode()}
            </pre>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateConfigCode())
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowExport(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AddAppModal({ onClose, onAdd }: { onClose: () => void; onAdd: (app: App) => void }) {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    icon: '',
    color: '#4CAF50',
    embedUrl: '',
    category: '',
    status: 'idea' as AppStatus,
    private: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const today = new Date().toISOString().split('T')[0]
    onAdd({
      ...form,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
      createdAt: today,
      private: form.private || undefined,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-white mb-4">Add New App</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm">App Name</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-slate-300 text-sm">Icon (emoji)</label>
              <input
                type="text"
                required
                value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
                placeholder="📊"
              />
            </div>
            <div className="flex-1">
              <label className="text-slate-300 text-sm">Color (hex)</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={form.color}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2"
                  placeholder="#4CAF50"
                />
                <input
                  type="color"
                  value={form.color}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-10 h-10 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-slate-300 text-sm">App URL</label>
            <input
              type="url"
              required
              value={form.embedUrl}
              onChange={e => setForm(f => ({ ...f, embedUrl: e.target.value }))}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
              placeholder="https://my-app.vercel.app"
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
            >
              <option value="">Select...</option>
              <option value="utility">Utility</option>
              <option value="productivity">Productivity</option>
              <option value="fun">Fun</option>
              <option value="finance">Finance</option>
              <option value="health">Health</option>
            </select>
          </div>
          <div>
            <label className="text-slate-300 text-sm">Initial Status</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as AppStatus }))}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].icon} {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.private}
                onChange={e => setForm(f => ({ ...f, private: e.target.checked }))}
                className="w-5 h-5 rounded bg-slate-700 border-slate-600"
              />
              <span className="text-slate-300 text-sm">🔒 Private (for your use only)</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Add App
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditAppModal({ app, onClose, onSave }: { app: App; onClose: () => void; onSave: (app: App) => void }) {
  const [form, setForm] = useState({
    title: app.title,
    slug: app.slug,
    icon: app.icon,
    color: app.color,
    embedUrl: app.embedUrl,
    category: app.category || '',
    status: app.status,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt || '',
    updateType: app.updateType || '',
    private: app.private || false,
    stripePriceId: app.stripePriceId || '',
    price: app.price || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...form,
      category: form.category || undefined,
      updatedAt: form.updatedAt || undefined,
      updateType: (form.updateType as App['updateType']) || undefined,
      private: form.private || undefined,
      stripePriceId: form.stripePriceId || undefined,
      price: form.price || undefined,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Edit App</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm">App Name</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm">Slug</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-slate-300 text-sm">Icon (emoji)</label>
              <input
                type="text"
                required
                value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
                placeholder="📊"
              />
            </div>
            <div className="flex-1">
              <label className="text-slate-300 text-sm">Color (hex)</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={form.color}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2"
                  placeholder="#4CAF50"
                />
                <input
                  type="color"
                  value={form.color}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-10 h-10 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-slate-300 text-sm">App URL</label>
            <input
              type="url"
              required
              value={form.embedUrl}
              onChange={e => setForm(f => ({ ...f, embedUrl: e.target.value }))}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
              placeholder="https://my-app.vercel.app"
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
            >
              <option value="">Select...</option>
              <option value="utility">Utility</option>
              <option value="productivity">Productivity</option>
              <option value="fun">Fun</option>
              <option value="finance">Finance</option>
              <option value="health">Health</option>
            </select>
          </div>
          <div>
            <label className="text-slate-300 text-sm">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as AppStatus }))}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].icon} {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-slate-300 text-sm">Created At</label>
              <input
                type="date"
                value={form.createdAt}
                onChange={e => setForm(f => ({ ...f, createdAt: e.target.value }))}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-slate-300 text-sm">Updated At</label>
              <input
                type="date"
                value={form.updatedAt}
                onChange={e => setForm(f => ({ ...f, updatedAt: e.target.value }))}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-slate-300 text-sm">Update Type</label>
            <select
              value={form.updateType}
              onChange={e => setForm(f => ({ ...f, updateType: e.target.value }))}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
            >
              <option value="">None</option>
              <option value="fixed">Fixed (bug fix)</option>
              <option value="features">Features (new stuff)</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.private}
                onChange={e => setForm(f => ({ ...f, private: e.target.checked }))}
                className="w-5 h-5 rounded bg-slate-700 border-slate-600"
              />
              <span className="text-slate-300 text-sm">🔒 Private (for your use only)</span>
            </label>
          </div>
          <div className="border-t border-slate-600 pt-4">
            <p className="text-slate-400 text-xs mb-2">Payment (optional)</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-slate-300 text-sm">Stripe Price ID</label>
                <input
                  type="text"
                  value={form.stripePriceId}
                  onChange={e => setForm(f => ({ ...f, stripePriceId: e.target.value }))}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
                  placeholder="price_xxxxx"
                />
              </div>
              <div className="w-24">
                <label className="text-slate-300 text-sm">Price</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
                  placeholder="$5"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
