// Free Tier Limits and Enforcement
export const FREE_TIER_LIMITS = {
  MAX_TRUCKS: 2,
  MAX_DISPATCHES_PER_MONTH: 60,
  MAX_SMS_PER_MONTH: 120,
  MAX_STORAGE_GB: 5,
  MAX_API_CALLS_PER_MONTH: 1000,
  MAX_USERS: 2,
  MAX_REPORTS_PER_MONTH: 10,
  MAX_NSV_DOCUMENTS_PER_MONTH: 50
}

export const FREE_TIER_FEATURES = {
  BASIC_DISPATCH: true,
  MOBILE_APP: true,
  SIMPLE_REPORTS: true,
  NSV_QA: true,
  AI_SUPPORT: true,
  GPS_TRACKING: true,
  LOCAL_STORAGE: true,
  BASIC_ANALYTICS: true
}

export const PREMIUM_FEATURES = {
  UNLIMITED_TRUCKS: false,
  UNLIMITED_DISPATCHES: false,
  UNLIMITED_SMS: false,
  CLOUD_STORAGE: false,
  ADVANCED_ANALYTICS: false,
  API_ACCESS: false,
  WHITE_LABEL: false,
  PRIORITY_SUPPORT: false,
  INSURANCE_INTEGRATION: false,
  MARKETPLACE_ACCESS: false
}

// Usage tracking
export interface UsageTracker {
  trucks: number
  dispatches_this_month: number
  sms_this_month: number
  storage_used_gb: number
  api_calls_this_month: number
  users: number
  reports_this_month: number
  nsv_documents_this_month: number
}

export function checkFreeTierLimit(usage: UsageTracker, limit: keyof typeof FREE_TIER_LIMITS): boolean {
  const currentUsage = usage[limit.replace('MAX_', '').toLowerCase() as keyof UsageTracker] as number
  const limitValue = FREE_TIER_LIMITS[limit]
  
  return currentUsage < limitValue
}

export function getUpgradePrompt(usage: UsageTracker, limit: keyof typeof FREE_TIER_LIMITS): string {
  const currentUsage = usage[limit.replace('MAX_', '').toLowerCase() as keyof UsageTracker] as number
  const limitValue = FREE_TIER_LIMITS[limit]
  const percentage = (currentUsage / limitValue) * 100
  
  if (percentage >= 90) {
    return `⚠️ You've used ${currentUsage}/${limitValue} ${limit.toLowerCase()}. Upgrade to Professional for unlimited access!`
  } else if (percentage >= 75) {
    return `📊 You've used ${currentUsage}/${limitValue} ${limit.toLowerCase()}. Consider upgrading soon.`
  }
  
  return ''
}
