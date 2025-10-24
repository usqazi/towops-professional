'use client'
import { useState, useEffect } from 'react'
import { FREE_TIER_LIMITS, FREE_TIER_FEATURES, PREMIUM_FEATURES, UsageTracker, checkFreeTierLimit, getUpgradePrompt } from '../../../lib/free-tier'

export default function FreeTierDashboard() {
  const [usage, setUsage] = useState<UsageTracker>({
    trucks: 0,
    dispatches_this_month: 0,
    sms_this_month: 0,
    storage_used_gb: 0,
    api_calls_this_month: 0,
    users: 1,
    reports_this_month: 0,
    nsv_documents_this_month: 0
  })

  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    // Load usage from localStorage
    const savedUsage = localStorage.getItem('towops_usage')
    if (savedUsage) {
      setUsage(JSON.parse(savedUsage))
    }
  }, [])

  const incrementUsage = (type: keyof UsageTracker) => {
    const newUsage = { ...usage, [type]: usage[type] + 1 }
    setUsage(newUsage)
    localStorage.setItem('towops_usage', JSON.stringify(newUsage))
    
    // Check if limit exceeded
    const limitKey = `MAX_${type.toUpperCase()}` as keyof typeof FREE_TIER_LIMITS
    if (!checkFreeTierLimit(newUsage, limitKey)) {
      setShowUpgradeModal(true)
    }
  }

  const getUsagePercentage = (type: keyof UsageTracker) => {
    const limitKey = `MAX_${type.toUpperCase()}` as keyof typeof FREE_TIER_LIMITS
    const limit = FREE_TIER_LIMITS[limitKey]
    return Math.min((usage[type] / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return '#ef4444'
    if (percentage >= 75) return '#f59e0b'
    return '#10b981'
  }

  return (
    <div style={{maxWidth: 1000, margin: '0 auto'}}>
      <h2>Free Tier Dashboard</h2>
      
      {/* Usage Overview */}
      <div style={{marginBottom: 30}}>
        <h3>Current Usage</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16}}>
          {Object.entries(usage).map(([key, value]) => {
            const percentage = getUsagePercentage(key as keyof UsageTracker)
            const limitKey = `MAX_${key.toUpperCase()}` as keyof typeof FREE_TIER_LIMITS
            const limit = FREE_TIER_LIMITS[limitKey]
            
            return (
              <div key={key} style={{border: '1px solid #ddd', padding: 16, borderRadius: 4}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                  <h4 style={{margin: 0, textTransform: 'capitalize'}}>
                    {key.replace('_', ' ')}
                  </h4>
                  <span style={{color: getUsageColor(percentage), fontWeight: 'bold'}}>
                    {value}/{limit}
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: 8,
                  background: '#e5e7eb',
                  borderRadius: 4,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: getUsageColor(percentage),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                {getUpgradePrompt(usage, limitKey) && (
                  <p style={{fontSize: 12, color: '#f59e0b', margin: '8px 0 0 0'}}>
                    {getUpgradePrompt(usage, limitKey)}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Feature Comparison */}
      <div style={{marginBottom: 30}}>
        <h3>Free vs Premium Features</h3>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
          <div style={{border: '1px solid #10b981', padding: 20, borderRadius: 4, background: '#f0fdf4'}}>
            <h4 style={{color: '#166534', margin: '0 0 16px 0'}}>✅ Free Tier Features</h4>
            <ul style={{margin: 0, paddingLeft: 20}}>
              {Object.entries(FREE_TIER_FEATURES).map(([feature, enabled]) => (
                <li key={feature} style={{marginBottom: 8, color: enabled ? '#166534' : '#9ca3af'}}>
                  {enabled ? '✅' : '❌'} {feature.replace('_', ' ')}
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{border: '1px solid #2563eb', padding: 20, borderRadius: 4, background: '#eff6ff'}}>
            <h4 style={{color: '#1d4ed8', margin: '0 0 16px 0'}}>🚀 Premium Features</h4>
            <ul style={{margin: 0, paddingLeft: 20}}>
              {Object.entries(PREMIUM_FEATURES).map(([feature, enabled]) => (
                <li key={feature} style={{marginBottom: 8, color: enabled ? '#1d4ed8' : '#9ca3af'}}>
                  {enabled ? '✅' : '🔒'} {feature.replace('_', ' ')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Test Usage Buttons */}
      <div style={{marginBottom: 30}}>
        <h3>Test Free Tier Limits</h3>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <button 
            onClick={() => incrementUsage('dispatches_this_month')}
            style={{
              background: '#10b981',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            +1 Dispatch
          </button>
          <button 
            onClick={() => incrementUsage('sms_this_month')}
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            +1 SMS
          </button>
          <button 
            onClick={() => incrementUsage('reports_this_month')}
            style={{
              background: '#7c3aed',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            +1 Report
          </button>
          <button 
            onClick={() => incrementUsage('nsv_documents_this_month')}
            style={{
              background: '#dc2626',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            +1 NSV Document
          </button>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: 30,
            borderRadius: 8,
            maxWidth: 500,
            width: '90%'
          }}>
            <h3 style={{margin: '0 0 16px 0'}}>🚀 Upgrade to Professional</h3>
            <p>You've reached your free tier limit! Upgrade to continue using TowOps with unlimited access.</p>
            
            <div style={{margin: '20px 0'}}>
              <h4>Professional Plan - $99/month</h4>
              <ul>
                <li>✅ Unlimited trucks</li>
                <li>✅ Unlimited dispatches</li>
                <li>✅ Unlimited SMS</li>
                <li>✅ Advanced analytics</li>
                <li>✅ API access</li>
                <li>✅ Priority support</li>
              </ul>
            </div>
            
            <div style={{display: 'flex', gap: 12}}>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Maybe Later
              </button>
              <button 
                onClick={() => {
                  setShowUpgradeModal(false)
                  // Redirect to upgrade page
                  window.open('/upgrade', '_blank')
                }}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
