import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { dispatchId, insuranceProvider, policyNumber, claimNumber } = await request.json()
    
    // Simulate insurance API integration
    const insuranceResponse = await fetch(`https://api.insurance-provider.com/claims/${claimNumber}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.INSURANCE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!insuranceResponse.ok) {
      return NextResponse.json({ 
        error: 'Insurance verification failed',
        fallback: 'Manual processing required'
      }, { status: 400 })
    }

    const claimData = await insuranceResponse.json()
    
    // Calculate insurance coverage and rates
    const coverage = {
      towing: claimData.coverage.towing || 0,
      storage: claimData.coverage.storage || 0,
      deductible: claimData.deductible || 0,
      copay_percentage: claimData.copay_percentage || 0
    }

    return NextResponse.json({
      verified: true,
      coverage,
      estimated_payment: calculateInsurancePayment(dispatchId, coverage),
      processing_fee: 25.00, // Revenue from insurance processing
      next_steps: [
        'Submit photos and documentation',
        'Process insurance payment',
        'Release vehicle upon payment'
      ]
    })

  } catch (error) {
    console.error('Insurance processing error:', error)
    return NextResponse.json({ 
      error: 'Insurance processing failed',
      manual_processing: true
    }, { status: 500 })
  }
}

function calculateInsurancePayment(dispatchId: string, coverage: any) {
  // Calculate payment based on dispatch type and coverage
  const baseRate = 150.00
  const storageRate = 25.00
  const processingFee = 25.00
  
  return {
    total: baseRate + storageRate + processingFee,
    insurance_pays: Math.min(coverage.towing, baseRate),
    customer_pays: Math.max(0, baseRate - coverage.towing) + storageRate + processingFee
  }
}
