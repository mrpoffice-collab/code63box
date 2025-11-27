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
    slug: 'polite-fury',
    title: 'Polite Fury',
    icon: '🔥',
    color: '#c2ffc4',
    embedUrl: 'https://polite-fury.vercel.app/',
    category: 'utility',
    createdAt: '2025-11-27',
    status: 'mvp',
  },
  {
    slug: 'firefly-grove',
    title: 'FireFly Grove',
    icon: '🌳',
    color: '#c79a30',
    embedUrl: 'https://fireflygrove.app/',
    category: 'utility',
    createdAt: '2025-11-27',
    status: 'mvp',
  },
  {
    slug: 'cardulary',
    title: 'Cardulary',
    icon: '📪',
    color: '#f2f7ff',
    embedUrl: 'https://cardulary.com/',
    category: 'productivity',
    createdAt: '2025-11-27',
    status: 'building',
  },
  {
    slug: 'whispering-art-cards',
    title: 'Whispering Art Cards',
    icon: '💌',
    color: '#e0d4ce',
    embedUrl: 'https://whispering-art.vercel.app/',
    category: 'productivity',
    createdAt: '2025-11-27',
    status: 'building',
  },
  {
    slug: 'journal-maker',
    title: 'Journal Maker',
    icon: '📜',
    color: '#614ee9',
    embedUrl: 'https://whisper-journals.vercel.app',
    category: 'productivity',
    createdAt: '2025-11-27',
    status: 'testing',
  },
  {
    slug: 'track-my-client',
    title: 'Track My Client',
    icon: '🛠️',
    color: '#017403',
    embedUrl: 'https://track-my-client.vercel.app/',
    category: 'productivity',
    createdAt: '2025-11-27',
    status: 'building',
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
