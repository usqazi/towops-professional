import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        valid: false,
        errors: ["AI validation not configured. Manual review required."],
        suggestions: []
      })
    }

    const systemPrompt = `You are a Notice of Stored Vehicle (NSV) validation expert. 
    
Validate the following NSV payload and check for:
1. Required fields completeness
2. Data format accuracy (VIN format, date format, etc.)
3. Legal compliance issues
4. Common errors

Required fields: ownerName, vin, plate, storageLocation, date
VIN should be 17 characters, plate should follow state format, date should be valid.

Respond with validation results and specific suggestions for corrections.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `NSV Payload: ${JSON.stringify(payload)}` }
      ],
      max_tokens: 400,
      temperature: 0.3,
    })

    const aiResponse = completion.choices[0]?.message?.content || "Unable to validate"

    // Basic validation rules
    const errors = []
    const suggestions = []

    if (!payload.ownerName || payload.ownerName.trim().length < 2) {
      errors.push("Owner name is required and must be at least 2 characters")
      suggestions.push("Enter the vehicle owner's full legal name")
    }

    if (!payload.vin || payload.vin.length !== 17) {
      errors.push("VIN must be exactly 17 characters")
      suggestions.push("Verify the VIN is complete and accurate")
    }

    if (!payload.plate || payload.plate.trim().length < 2) {
      errors.push("License plate is required")
      suggestions.push("Enter the complete license plate number")
    }

    if (!payload.storageLocation || payload.storageLocation.trim().length < 5) {
      errors.push("Storage location must be specific")
      suggestions.push("Provide complete address including street, city, state")
    }

    if (!payload.date || isNaN(Date.parse(payload.date))) {
      errors.push("Valid date is required")
      suggestions.push("Use format: YYYY-MM-DD")
    }

    return NextResponse.json({
      valid: errors.length === 0,
      errors,
      suggestions,
      aiAnalysis: aiResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('NSV QA error:', error)
    return NextResponse.json({
      valid: false,
      errors: ["Validation service error"],
      suggestions: ["Manual review required"],
      aiAnalysis: "Service unavailable"
    }, { status: 500 })
  }
}
