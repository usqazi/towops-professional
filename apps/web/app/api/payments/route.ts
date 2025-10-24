import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { amount, customerId, description } = await request.json()
    
    // Create payment intent for tow services
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      customer: customerId,
      description: description,
      metadata: {
        service_type: 'towing',
        dispatch_id: request.headers.get('dispatch-id') || 'unknown'
      }
    })

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_id: paymentIntent.id
    })

  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 })
  }
}

// Subscription management
export async function PUT(request: NextRequest) {
  try {
    const { customerId, planId } = await request.json()
    
    // Create or update subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    })

    return NextResponse.json({
      subscription_id: subscription.id,
      client_secret: subscription.latest_invoice.payment_intent.client_secret
    })

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
