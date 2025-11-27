'use client'

import Link from 'next/link'
import { App, STATUS_CONFIG, isNewApp, isUpdatedApp } from '@/config/apps'

type AppTileProps = {
  app: App
}

export default function AppTile({ app }: AppTileProps) {
  const statusConfig = STATUS_CONFIG[app.status]
  const isNew = isNewApp(app.createdAt)
  const isUpdated = isUpdatedApp(app)
  const showStatusIcon = app.status !== 'shipped'

  // Determine update badge text and color
  const getUpdateBadge = () => {
    if (!isUpdated) return null
    if (app.updateType === 'fixed') {
      return { text: 'UPDATED', color: 'bg-orange-500' }
    }
    if (app.updateType === 'features') {
      return { text: 'NEW STUFF', color: 'bg-green-500' }
    }
    return null
  }
  const updateBadge = getUpdateBadge()

  return (
    <Link
      href={`/app/${app.slug}`}
      className="group flex flex-col items-center gap-2 p-2 rounded-2xl transition-transform hover:scale-105 active:scale-95"
    >
      {/* App Icon */}
      <div
        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg transition-shadow group-hover:shadow-xl"
        style={{ backgroundColor: app.color }}
        title={statusConfig.label}
      >
        {app.icon}

        {/* Status badge */}
        {showStatusIcon && (
          <span
            className="absolute -top-1 -right-1 text-sm bg-white/90 rounded-full w-6 h-6 flex items-center justify-center shadow-md"
            title={statusConfig.label}
          >
            {statusConfig.icon}
          </span>
        )}

        {/* Badges container - stacks vertically on left side */}
        <div className="absolute -left-1 -top-1 flex flex-col gap-0.5">
          {isNew && (
            <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
              NEW
            </span>
          )}
          {updateBadge && (
            <span className={`${updateBadge.color} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md`}>
              {updateBadge.text}
            </span>
          )}
        </div>
      </div>

      {/* App Name */}
      <span className="text-white text-xs sm:text-sm font-medium text-center truncate w-full max-w-[80px]">
        {app.title}
      </span>
    </Link>
  )
}
