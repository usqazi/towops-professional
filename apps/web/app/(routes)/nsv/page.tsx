'use client'
import { useState } from 'react'
import { FREE_TIER_LIMITS, UsageTracker } from '../../../lib/free-tier'

export default function NSVPage() {
  const [payload, setPayload] = useState<any>({ 
    ownerName:'', 
    vin:'', 
    plate:'', 
    storageLocation:'', 
    date: new Date().toISOString().split('T')[0] 
  })
  const [qa, setQa] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
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

  async function runQA() {
    // Check free tier limits
    if (usage.nsv_documents_this_month >= FREE_TIER_LIMITS.MAX_NSV_DOCUMENTS_PER_MONTH) {
      setShowUpgradeModal(true)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/nsv/qa', { 
        method:'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      setQa(data)
      
      // Update usage tracking
      const newUsage = { ...usage, nsv_documents_this_month: usage.nsv_documents_this_month + 1 }
      setUsage(newUsage)
      localStorage.setItem('towops_usage', JSON.stringify(newUsage))
    } catch (error) {
      setQa({ valid: false, errors: ['Failed to validate'], suggestions: ['Please try again'] })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{maxWidth: 800, margin: '0 auto'}}>
      <h2>Notice of Stored Vehicle (NSV) QA</h2>
      
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20}}>
        <section>
          <h3>NSV Data Entry</h3>
          {['ownerName','vin','plate','storageLocation','date'].map(k=>(
            <div key={k} style={{marginBottom: 12}}>
              <label style={{display: 'block', fontSize: 14, fontWeight: 'bold', marginBottom: 4}}>
                {k === 'ownerName' ? 'Owner Name' : 
                 k === 'vin' ? 'VIN' :
                 k === 'plate' ? 'License Plate' :
                 k === 'storageLocation' ? 'Storage Location' :
                 'Date'}
              </label>
              <input 
                type={k === 'date' ? 'date' : 'text'}
                value={payload[k]||''} 
                onChange={e=>setPayload({...payload,[k]:e.target.value})}
                style={{width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4}}
                placeholder={k === 'vin' ? '17-character VIN' : 
                           k === 'plate' ? 'License plate number' :
                           k === 'storageLocation' ? 'Complete address' : ''}
              />
            </div>
          ))}
          <button 
            onClick={runQA} 
            disabled={isLoading}
            style={{
              background: '#2563eb', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: 4,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Validating...' : 'Validate NSV'}
          </button>
        </section>

        <section>
          <h3>Validation Results</h3>
          {qa ? (
            <div style={{border: '1px solid #ddd', padding: 16, borderRadius: 4}}>
              <div style={{marginBottom: 12}}>
                <span style={{
                  background: qa.valid ? '#10b981' : '#ef4444',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 'bold'
                }}>
                  {qa.valid ? '✓ VALID' : '✗ INVALID'}
                </span>
              </div>
              
              {qa.errors && qa.errors.length > 0 && (
                <div style={{marginBottom: 12}}>
                  <h4 style={{color: '#ef4444', fontSize: 14, marginBottom: 8}}>Errors:</h4>
                  <ul style={{margin: 0, paddingLeft: 16}}>
                    {qa.errors.map((error: string, i: number) => (
                      <li key={i} style={{color: '#ef4444', fontSize: 13}}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {qa.suggestions && qa.suggestions.length > 0 && (
                <div style={{marginBottom: 12}}>
                  <h4 style={{color: '#2563eb', fontSize: 14, marginBottom: 8}}>Suggestions:</h4>
                  <ul style={{margin: 0, paddingLeft: 16}}>
                    {qa.suggestions.map((suggestion: string, i: number) => (
                      <li key={i} style={{color: '#2563eb', fontSize: 13}}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {qa.aiAnalysis && (
                <div>
                  <h4 style={{fontSize: 14, marginBottom: 8}}>AI Analysis:</h4>
                  <p style={{fontSize: 13, color: '#374151', lineHeight: 1.4}}>{qa.aiAnalysis}</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{border: '1px solid #ddd', padding: 16, borderRadius: 4, color: '#6b7280'}}>
              Enter NSV data and click "Validate NSV" to see results
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
