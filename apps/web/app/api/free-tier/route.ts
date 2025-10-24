import { NextRequest, NextResponse } from 'next/server'
import { FREE_TIER_LIMITS, UsageTracker } from '../../../lib/free-tier'

export async function POST(request: NextRequest) {
  try {
    const { action, usage } = await request.json()
    
    // Validate free tier limits
    const limits = {
      trucks: usage.trucks <= FREE_TIER_LIMITS.MAX_TRUCKS,
      dispatches: usage.dispatches_this_month <= FREE_TIER_LIMITS.MAX_DISPATCHES_PER_MONTH,
      sms: usage.sms_this_month <= FREE_TIER_LIMITS.MAX_SMS_PER_MONTH,
      storage: usage.storage_used_gb <= FREE_TIER_LIMITS.MAX_STORAGE_GB,
      api_calls: usage.api_calls_this_month <= FREE_TIER_LIMITS.MAX_API_CALLS_PER_MONTH,
      users: usage.users <= FREE_TIER_LIMITS.MAX_USERS,
      reports: usage.reports_this_month <= FREE_TIER_LIMITS.MAX_REPORTS_PER_MONTH,
      nsv_documents: usage.nsv_documents_this_month <= FREE_TIER_LIMITS.MAX_NSV_DOCUMENTS_PER_MONTH
    }

    const exceededLimits = Object.entries(limits).filter(([_, withinLimit]) => !withinLimit)
    
    if (exceededLimits.length > 0) {
      return NextResponse.json({
        allowed: false,
        exceeded_limits: exceededLimits.map(([limit, _]) => limit),
        upgrade_required: true,
        message: `Free tier limit exceeded for: ${exceededLimits.map(([limit, _]) => limit).join(', ')}`,
        upgrade_url: '/upgrade'
      }, { status: 403 })
    }

    // Log usage for analytics
    console.log('Free tier usage:', {
      action,
      usage,
      timestamp: new Date().toISOString(),
      limits_respected: true
    })

    return NextResponse.json({
      allowed: true,
      usage_tracked: true,
      remaining_limits: {
        trucks: FREE_TIER_LIMITS.MAX_TRUCKS - usage.trucks,
        dispatches: FREE_TIER_LIMITS.MAX_DISPATCHES_PER_MONTH - usage.dispatches_this_month,
        sms: FREE_TIER_LIMITS.MAX_SMS_PER_MONTH - usage.sms_this_month,
        storage: FREE_TIER_LIMITS.MAX_STORAGE_GB - usage.storage_used_gb,
        api_calls: FREE_TIER_LIMITS.MAX_API_CALLS_PER_MONTH - usage.api_calls_this_month,
        users: FREE_TIER_LIMITS.MAX_USERS - usage.users,
        reports: FREE_TIER_LIMITS.MAX_REPORTS_PER_MONTH - usage.reports_this_month,
        nsv_documents: FREE_TIER_LIMITS.MAX_NSV_DOCUMENTS_PER_MONTH - usage.nsv_documents_this_month
      }
    })

  } catch (error) {
    console.error('Free tier validation error:', error)
    return NextResponse.json({
      allowed: false,
      error: 'Free tier validation failed'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return current free tier limits and features
    return NextResponse.json({
      limits: FREE_TIER_LIMITS,
      features: {
        basic_dispatch: true,
        mobile_app: true,
        simple_reports: true,
        nsv_qa: true,
        ai_support: true,
        gps_tracking: true,
        local_storage: true,
        basic_analytics: true
      },
      restrictions: {
        unlimited_trucks: false,
        unlimited_dispatches: false,
        unlimited_sms: false,
        cloud_storage: false,
        advanced_analytics: false,
        api_access: false,
        white_label: false,
        priority_support: false,
        insurance_integration: false,
        marketplace_access: false
      }
    })

  } catch (error) {
    console.error('Free tier info error:', error)
    return NextResponse.json({ error: 'Failed to get free tier info' }, { status: 500 })
  }
}
