import { loadStripe } from '@stripe/stripe-js'

// Load Stripe (client-side)
export const getStripe = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) return null
  return loadStripe(key)
}

// Check if app requires payment
export function isPaidApp(stripeProductId?: string): boolean {
  return !!stripeProductId
}
