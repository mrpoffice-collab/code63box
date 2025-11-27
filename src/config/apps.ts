export type AppStatus = 'idea' | 'building' | 'testing' | 'mvp' | 'shipped'

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
  stripeProductId?: string
  stripePriceId?: string
  price?: string
}

export const STATUS_CONFIG: Record<AppStatus, { icon: string; label: string; visible: boolean }> = {
  idea: { icon: '💡', label: 'Idea', visible: false },
  building: { icon: '🧪', label: 'Building', visible: false },
  testing: { icon: '🔬', label: 'Testing', visible: true },
  mvp: { icon: '⚛️', label: 'MVP', visible: true },
  shipped: { icon: '🚀', label: 'Shipped', visible: true },
}

export const apps: App[] = [
  {
    slug: 'color-picker',
    title: 'Colors',
    icon: '🎨',
    color: '#E91E63',
    embedUrl: 'https://example.com/colors',
    category: 'utility',
    createdAt: '2025-01-20',
    status: 'testing',
  },
  {
    slug: 'tip-calculator',
    title: 'Tips',
    icon: '💰',
    color: '#FF9800',
    embedUrl: 'https://example.com/tips',
    category: 'finance',
    createdAt: '2025-01-10',
    status: 'mvp',
    stripePriceId: 'price_xxxxx',
    price: '$5',
  },
  {
    slug: 'timer',
    title: 'Timer',
    icon: '⏱️',
    color: '#2196F3',
    embedUrl: 'https://example.com/timer',
    category: 'productivity',
    createdAt: '2025-11-20',
    updatedAt: '2025-11-26',
    updateType: 'features',
    status: 'shipped',
  },
  {
    slug: 'notes',
    title: 'Notes',
    icon: '📝',
    color: '#9C27B0',
    embedUrl: 'https://example.com/notes',
    category: 'productivity',
    createdAt: '2025-01-18',
    status: 'building',
  },
  {
    slug: 'converter',
    title: 'Convert',
    icon: '🔄',
    color: '#00BCD4',
    embedUrl: 'https://example.com/converter',
    category: 'utility',
    createdAt: '2025-01-22',
    status: 'testing',
  },
  {
    slug: 'dice-roller',
    title: 'Dice',
    icon: '🎲',
    color: '#F44336',
    embedUrl: 'https://example.com/dice',
    category: 'fun',
    createdAt: '2025-01-05',
    status: 'shipped',
  },
  {
    slug: 'calculator',
    title: 'Calc',
    icon: '📐',
    color: '#607D8B',
    embedUrl: 'https://example.com/calc',
    category: 'utility',
    createdAt: '2025-01-01',
    updatedAt: '2025-11-25',
    updateType: 'fixed',
    status: 'shipped',
  },
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
}
