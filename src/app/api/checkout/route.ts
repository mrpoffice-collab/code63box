import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY not configured')
  return new Stripe(key)
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const { priceId, appSlug } = await request.json()

    if (!priceId || !appSlug) {
      return NextResponse.json({ error: 'Missing priceId or appSlug' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // or 'subscription' for recurring
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/app/${appSlug}?purchased=true`,
      cancel_url: `${request.nextUrl.origin}/app/${appSlug}?cancelled=true`,
      metadata: {
        appSlug,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
