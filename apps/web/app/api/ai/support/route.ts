import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        response: "AI support is not configured. Please contact support directly.",
        actions: [],
        confidence: 0
      })
    }

    const systemPrompt = `You are a TowOps support assistant. You can help with:
- Password resets
- Resending NSV notices
- Exporting reports
- Basic account questions

You can ONLY perform these safe actions:
- reset_password
- resend_nsv
- export_report
- schedule_callback

Respond with helpful information and suggest appropriate actions. Be concise and professional.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Context: ${JSON.stringify(context)}\n\nUser message: ${message}` }
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your request."

    // Determine suggested actions based on the message
    const actions = []
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('password') || lowerMessage.includes('login')) {
      actions.push({ type: 'reset_password', label: 'Reset Password' })
    }
    if (lowerMessage.includes('nsv') || lowerMessage.includes('notice')) {
      actions.push({ type: 'resend_nsv', label: 'Resend NSV Notice' })
    }
    if (lowerMessage.includes('report') || lowerMessage.includes('export')) {
      actions.push({ type: 'export_report', label: 'Export Report' })
    }
    if (actions.length === 0) {
      actions.push({ type: 'schedule_callback', label: 'Schedule Callback' })
    }

    return NextResponse.json({
      response,
      actions,
      confidence: 0.8
    })

  } catch (error) {
    console.error('AI Support error:', error)
    return NextResponse.json({
      response: "I'm experiencing technical difficulties. Please try again or contact support directly.",
      actions: [{ type: 'schedule_callback', label: 'Schedule Callback' }],
      confidence: 0
    }, { status: 500 })
  }
}
