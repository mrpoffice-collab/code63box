'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { App } from '@/config/apps'
import { trackAppLaunch } from '@/lib/posthog'
import PurchaseButton from './PurchaseButton'

type AppViewerClientProps = {
  app: App
}

export default function AppViewerClient({ app }: AppViewerClientProps) {
  const searchParams = useSearchParams()
  const [hasPurchased, setHasPurchased] = useState(false)

  const isPaid = !!app.stripePriceId
  const justPurchased = searchParams.get('purchased') === 'true'

  useEffect(() => {
    // Track app launch
    trackAppLaunch(app.slug, app.title)

    // Check if user just purchased or has a stored purchase
    if (justPurchased) {
      // Store purchase in localStorage (simple approach)
      localStorage.setItem(`purchased_${app.slug}`, 'true')
      setHasPurchased(true)
    } else {
      // Check localStorage for previous purchase
      const purchased = localStorage.getItem(`purchased_${app.slug}`)
      if (purchased === 'true') {
        setHasPurchased(true)
      }
    }
  }, [app.slug, app.title, justPurchased])

  // Show purchase screen for paid apps that haven't been purchased
  if (isPaid && !hasPurchased) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <PurchaseButton
          appSlug={app.slug}
          appTitle={app.title}
          price={app.price || '$0'}
          stripePriceId={app.stripePriceId!}
        />
      </div>
    )
  }

  // Show the app
  return (
    <iframe
      src={app.embedUrl}
      className="flex-1 w-full border-0"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      title={app.title}
    />
  )
}
