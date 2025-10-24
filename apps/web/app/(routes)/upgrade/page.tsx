export default function UpgradePage() {
  const plans = [
    {
      name: "Starter",
      price: 29,
      period: "month",
      description: "Perfect for small tow operations",
      features: [
        "Up to 5 trucks",
        "200 dispatches/month",
        "500 SMS/month",
        "Basic reports",
        "Email support",
        "Local storage"
      ],
      limitations: [
        "No API access",
        "No advanced analytics",
        "No insurance integration"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: 99,
      period: "month", 
      description: "Most popular for growing businesses",
      features: [
        "Up to 25 trucks",
        "Unlimited dispatches",
        "Unlimited SMS",
        "Advanced analytics",
        "API access",
        "Priority support",
        "Cloud storage",
        "Insurance integration"
      ],
      limitations: [],
      popular: true
    },
    {
      name: "Enterprise",
      price: 299,
      period: "month",
      description: "For large operations and franchises",
      features: [
        "Unlimited trucks",
        "Unlimited everything",
        "White-label solution",
        "Custom integrations",
        "Dedicated support",
        "Advanced AI features",
        "Marketplace access",
        "Multi-location support"
      ],
      limitations: [],
      popular: false
    }
  ]

  return (
    <div style={{maxWidth: 1200, margin: '0 auto', padding: '20px'}}>
      <div style={{textAlign: 'center', marginBottom: 40}}>
        <h1 style={{fontSize: 36, marginBottom: 16}}>Upgrade Your Plan</h1>
        <p style={{fontSize: 18, color: '#6b7280'}}>
          Choose the perfect plan for your tow operation
        </p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24}}>
        {plans.map((plan, index) => (
          <div 
            key={plan.name}
            style={{
              border: plan.popular ? '2px solid #2563eb' : '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 24,
              background: plan.popular ? '#eff6ff' : 'white',
              position: 'relative'
            }}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#2563eb',
                color: 'white',
                padding: '4px 16px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 'bold'
              }}>
                MOST POPULAR
              </div>
            )}
            
            <h3 style={{fontSize: 24, margin: '0 0 8px 0'}}>{plan.name}</h3>
            <p style={{color: '#6b7280', margin: '0 0 16px 0'}}>{plan.description}</p>
            
            <div style={{marginBottom: 24}}>
              <span style={{fontSize: 48, fontWeight: 'bold'}}>${plan.price}</span>
              <span style={{color: '#6b7280'}}>/{plan.period}</span>
            </div>

            <ul style={{listStyle: 'none', padding: 0, margin: '0 0 24px 0'}}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{marginBottom: 8, display: 'flex', alignItems: 'center'}}>
                  <span style={{color: '#10b981', marginRight: 8}}>✅</span>
                  {feature}
                </li>
              ))}
              {plan.limitations.map((limitation, i) => (
                <li key={i} style={{marginBottom: 8, display: 'flex', alignItems: 'center', color: '#9ca3af'}}>
                  <span style={{marginRight: 8}}>❌</span>
                  {limitation}
                </li>
              ))}
            </ul>

            <button style={{
              width: '100%',
              background: plan.popular ? '#2563eb' : '#10b981',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 'bold'
            }}>
              {plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade Now'}
            </button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div style={{marginTop: 60}}>
        <h3 style={{textAlign: 'center', marginBottom: 30}}>Feature Comparison</h3>
        <div style={{overflow: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb'}}>
            <thead>
              <tr style={{background: '#f9fafb'}}>
                <th style={{padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Feature</th>
                <th style={{padding: 12, textAlign: 'center', borderBottom: '1px solid #e5e7eb'}}>Free</th>
                <th style={{padding: 12, textAlign: 'center', borderBottom: '1px solid #e5e7eb'}}>Starter</th>
                <th style={{padding: 12, textAlign: 'center', borderBottom: '1px solid #e5e7eb'}}>Professional</th>
                <th style={{padding: 12, textAlign: 'center', borderBottom: '1px solid #e5e7eb'}}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Trucks', free: '2', starter: '5', professional: '25', enterprise: 'Unlimited' },
                { feature: 'Dispatches/Month', free: '60', starter: '200', professional: 'Unlimited', enterprise: 'Unlimited' },
                { feature: 'SMS/Month', free: '120', starter: '500', professional: 'Unlimited', enterprise: 'Unlimited' },
                { feature: 'Storage', free: '5GB', starter: '10GB', professional: '100GB', enterprise: 'Unlimited' },
                { feature: 'API Access', free: '❌', starter: '❌', professional: '✅', enterprise: '✅' },
                { feature: 'Advanced Analytics', free: '❌', starter: '❌', professional: '✅', enterprise: '✅' },
                { feature: 'Insurance Integration', free: '❌', starter: '❌', professional: '✅', enterprise: '✅' },
                { feature: 'White Label', free: '❌', starter: '❌', professional: '❌', enterprise: '✅' },
                { feature: 'Priority Support', free: '❌', starter: '❌', professional: '✅', enterprise: '✅' }
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{padding: 12, borderBottom: '1px solid #e5e7eb', fontWeight: 'bold'}}>{row.feature}</td>
                  <td style={{padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'center'}}>{row.free}</td>
                  <td style={{padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'center'}}>{row.starter}</td>
                  <td style={{padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'center'}}>{row.professional}</td>
                  <td style={{padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'center'}}>{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{marginTop: 60}}>
        <h3 style={{textAlign: 'center', marginBottom: 30}}>Frequently Asked Questions</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20}}>
          <div>
            <h4>Can I change plans anytime?</h4>
            <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div>
            <h4>What happens if I exceed my limits?</h4>
            <p>We'll notify you when you're approaching limits and offer upgrade options. No service interruption.</p>
          </div>
          <div>
            <h4>Is there a free trial?</h4>
            <p>Yes! Start with our free tier and upgrade when you're ready. No credit card required.</p>
          </div>
          <div>
            <h4>Do you offer custom plans?</h4>
            <p>Yes! Contact us for Enterprise custom solutions tailored to your specific needs.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
