import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { billingData, period } = await request.json()
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        anomalies: [],
        summary: "AI analysis not configured. Manual review recommended.",
        confidence: 0
      })
    }

    // Calculate basic statistics
    const amounts = billingData.map((item: any) => item.amount || 0)
    const total = amounts.reduce((sum: number, amount: number) => sum + amount, 0)
    const average = total / amounts.length
    const max = Math.max(...amounts)
    const min = Math.min(...amounts)

    const systemPrompt = `You are a billing anomaly detection expert for a towing company.
    
Analyze the billing data and identify:
1. Unusually high or low charges
2. Patterns that deviate from normal operations
3. Potential billing errors or fraud
4. Seasonal or temporal anomalies

Consider normal towing rates, storage fees, and operational patterns.
Flag anything that seems suspicious or requires human review.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Billing data for ${period}:
Total: $${total.toFixed(2)}
Average: $${average.toFixed(2)}
Max: $${max.toFixed(2)}
Min: $${min.toFixed(2)}

Data: ${JSON.stringify(billingData.slice(0, 10))}${billingData.length > 10 ? '...' : ''}` }
      ],
      max_tokens: 500,
      temperature: 0.3,
    })

    const aiAnalysis = completion.choices[0]?.message?.content || "Unable to analyze"

    // Basic anomaly detection
    const anomalies = []
    
    // Flag unusually high charges (>3x average)
    const highThreshold = average * 3
    const highCharges = billingData.filter((item: any) => item.amount > highThreshold)
    if (highCharges.length > 0) {
      anomalies.push({
        type: 'high_charge',
        description: `${highCharges.length} charges exceed $${highThreshold.toFixed(2)}`,
        severity: 'high',
        items: highCharges.slice(0, 5)
      })
    }

    // Flag unusually low charges (<0.1x average)
    const lowThreshold = average * 0.1
    const lowCharges = billingData.filter((item: any) => item.amount < lowThreshold && item.amount > 0)
    if (lowCharges.length > 0) {
      anomalies.push({
        type: 'low_charge',
        description: `${lowCharges.length} charges below $${lowThreshold.toFixed(2)}`,
        severity: 'medium',
        items: lowCharges.slice(0, 5)
      })
    }

    // Flag zero charges
    const zeroCharges = billingData.filter((item: any) => item.amount === 0)
    if (zeroCharges.length > 0) {
      anomalies.push({
        type: 'zero_charge',
        description: `${zeroCharges.length} zero-amount charges`,
        severity: 'medium',
        items: zeroCharges.slice(0, 5)
      })
    }

    return NextResponse.json({
      anomalies,
      summary: aiAnalysis,
      statistics: {
        total,
        average,
        max,
        min,
        count: billingData.length
      },
      confidence: 0.8,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Billing anomaly error:', error)
    return NextResponse.json({
      anomalies: [],
      summary: "Analysis service error",
      statistics: null,
      confidence: 0
    }, { status: 500 })
  }
}
