import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export async function POST(request: NextRequest) {
  try {
    const { to, message, service_type, dispatch_id } = await request.json()
    
    // SMS pricing tiers
    const smsPricing = {
      customer_notification: 0.05, // $0.05 per SMS
      driver_update: 0.03,        // $0.03 per SMS  
      insurance_update: 0.08,     // $0.08 per SMS
      marketing_sms: 0.02         // $0.02 per SMS
    }

    const price = smsPricing[service_type] || 0.05
    
    // Send SMS via Twilio
    const messageResponse = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    })

    // Log for billing
    const billingRecord = {
      message_id: messageResponse.sid,
      dispatch_id: dispatch_id,
      service_type: service_type,
      price: price,
      timestamp: new Date().toISOString(),
      status: messageResponse.status
    }

    // Store billing record (in production, save to database)
    console.log('SMS Billing Record:', billingRecord)

    return NextResponse.json({
      message_id: messageResponse.sid,
      status: messageResponse.status,
      price: price,
      billing_record: billingRecord
    })

  } catch (error) {
    console.error('SMS error:', error)
    return NextResponse.json({ error: 'SMS failed' }, { status: 500 })
  }
}

// Bulk SMS for marketing campaigns
export async function PUT(request: NextRequest) {
  try {
    const { campaign_id, message, customer_list } = await request.json()
    
    const bulkSmsResponse = {
      campaign_id: campaign_id,
      total_messages: customer_list.length,
      price_per_message: 0.02,
      total_cost: customer_list.length * 0.02,
      estimated_revenue: customer_list.length * 0.15, // 15% conversion rate
      roi: ((customer_list.length * 0.15) - (customer_list.length * 0.02)) / (customer_list.length * 0.02)
    }

    return NextResponse.json(bulkSmsResponse)

  } catch (error) {
    console.error('Bulk SMS error:', error)
    return NextResponse.json({ error: 'Bulk SMS failed' }, { status: 500 })
  }
}
