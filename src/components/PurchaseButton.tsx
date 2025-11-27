'use client'

import { useState } from 'react'

type PurchaseButtonProps = {
  appSlug: string
  appTitle: string
  price: string
  stripePriceId: string
}

export default function PurchaseButton({ appSlug, appTitle, price, stripePriceId }: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: stripePriceId,
          appSlug,
        }),
      })

      const { url, error } = await response.json()
      if (error) throw new Error(error)
      if (url) window.location.href = url
    } catch (error) {
      console.error('Purchase error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-slate-800 rounded-2xl max-w-sm mx-auto">
      <div className="text-6xl">🔒</div>
      <h2 className="text-xl font-bold text-white">{appTitle}</h2>
      <p className="text-slate-400 text-center">
        This app requires a purchase to access.
      </p>
      <p className="text-2xl font-bold text-white">{price}</p>
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        {loading ? 'Loading...' : `Purchase ${appTitle}`}
      </button>
    </div>
  )
}
