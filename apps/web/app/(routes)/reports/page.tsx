export default function ReportsPage() {
  return (
    <div style={{maxWidth: 1000, margin: '0 auto'}}>
      <h2>Reports Dashboard</h2>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 20}}>
        <div style={{border: '1px solid #ddd', padding: 16, borderRadius: 4}}>
          <h4 style={{margin: 0, color: '#6b7280'}}>Active Calls</h4>
          <p style={{fontSize: 24, margin: '8px 0 0 0', fontWeight: 'bold'}}>12</p>
        </div>
        <div style={{border: '1px solid #ddd', padding: 16, borderRadius: 4}}>
          <h4 style={{margin: 0, color: '#6b7280'}}>Exceptions</h4>
          <p style={{fontSize: 24, margin: '8px 0 0 0', fontWeight: 'bold', color: '#ef4444'}}>3</p>
        </div>
        <div style={{border: '1px solid #ddd', padding: 16, borderRadius: 4}}>
          <h4 style={{margin: 0, color: '#6b7280'}}>Weekly Revenue</h4>
          <p style={{fontSize: 24, margin: '8px 0 0 0', fontWeight: 'bold', color: '#10b981'}}>$1,220.00</p>
        </div>
        <div style={{border: '1px solid #ddd', padding: 16, borderRadius: 4}}>
          <h4 style={{margin: 0, color: '#6b7280'}}>Avg Charge</h4>
          <p style={{fontSize: 24, margin: '8px 0 0 0', fontWeight: 'bold'}}>$152.50</p>
        </div>
      </div>

      <div style={{marginTop: 40}}>
        <h3>Billing & Invoice Features</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20}}>
          <div style={{border: '1px solid #ddd', padding: 20, borderRadius: 4}}>
            <h4>📊 Invoice Generation</h4>
            <p>Automated weekly invoice creation with detailed breakdowns</p>
            <button style={{
              background: '#2563eb',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}>
              Generate Invoice
            </button>
          </div>
          
          <div style={{border: '1px solid #ddd', padding: 20, borderRadius: 4}}>
            <h4>🔍 Anomaly Detection</h4>
            <p>AI-powered billing anomaly detection and analysis</p>
            <button style={{
              background: '#10b981',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}>
              Analyze Billing
            </button>
          </div>
          
          <div style={{border: '1px solid #ddd', padding: 20, borderRadius: 4}}>
            <h4>📈 Revenue Reports</h4>
            <p>Comprehensive revenue tracking and reporting</p>
            <button style={{
              background: '#7c3aed',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}>
              View Reports
            </button>
          </div>
          
          <div style={{border: '1px solid #ddd', padding: 20, borderRadius: 4}}>
            <h4>💰 Payment Tracking</h4>
            <p>Track payments, outstanding balances, and collections</p>
            <button style={{
              background: '#dc2626',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}>
              Track Payments
            </button>
          </div>
        </div>
      </div>

      <div style={{marginTop: 40, padding: 20, background: '#f9fafb', borderRadius: 4}}>
        <h3>Recent Activity</h3>
        <div style={{marginTop: 16}}>
          <div style={{padding: 12, borderBottom: '1px solid #e5e7eb'}}>
            <strong>Invoice #INV-001</strong> - Generated for Week of Jan 15-21, 2024
            <span style={{float: 'right', color: '#10b981'}}>$1,220.00</span>
          </div>
          <div style={{padding: 12, borderBottom: '1px solid #e5e7eb'}}>
            <strong>Payment Received</strong> - ABC Insurance Co.
            <span style={{float: 'right', color: '#10b981'}}>$850.00</span>
          </div>
          <div style={{padding: 12, borderBottom: '1px solid #e5e7eb'}}>
            <strong>Anomaly Detected</strong> - High charge for heavy duty tow
            <span style={{float: 'right', color: '#f59e0b'}}>Review Required</span>
          </div>
          <div style={{padding: 12}}>
            <strong>Outstanding Balance</strong> - XYZ Towing Services
            <span style={{float: 'right', color: '#ef4444'}}>$370.00</span>
          </div>
        </div>
      </div>
    </div>
  )
}