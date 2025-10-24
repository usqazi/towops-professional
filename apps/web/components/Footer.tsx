'use client'
import { useState } from 'react'

export default function Footer() {
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send to a backend
    alert('Thank you for your message! We\'ll get back to you soon.')
    setContactForm({ name: '', email: '', company: '', message: '' })
    setShowContactForm(false)
  }

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
      color: 'white',
      padding: '40px 0 20px',
      marginTop: 'auto'
    }}>
      <div style={{maxWidth: 1200, margin: '0 auto', padding: '0 20px'}}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 32,
          marginBottom: 32
        }}>
          {/* Company Info */}
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
              <div style={{
                background: 'rgba(59,130,246,0.3)',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 24
              }}>
                🚛
              </div>
              <div>
                <h3 style={{margin: 0, fontSize: 20, fontWeight: 'bold'}}>TowOps</h3>
                <p style={{margin: 0, fontSize: 12, opacity: 0.8}}>Professional Dispatch System</p>
              </div>
            </div>
            <p style={{margin: '0 0 16px 0', opacity: 0.9, lineHeight: 1.6}}>
              The most advanced tow dispatch management system with real-time tracking, 
              AI-powered features, and enterprise-grade security.
            </p>
            <div style={{display: 'flex', gap: 12}}>
              <a href="#" style={{color: 'white', fontSize: 20, opacity: 0.7}}>📘</a>
              <a href="#" style={{color: 'white', fontSize: 20, opacity: 0.7}}>🐦</a>
              <a href="#" style={{color: 'white', fontSize: 20, opacity: 0.7}}>💼</a>
              <a href="#" style={{color: 'white', fontSize: 20, opacity: 0.7}}>📧</a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 style={{margin: '0 0 16px 0', fontSize: 16, fontWeight: 'bold'}}>Features</h4>
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              {[
                'Real-time GPS Tracking',
                'AI-Powered Dispatch',
                'Mobile Driver App',
                'Automated Billing',
                'NSV Document QA',
                'Live Reporting',
                'Insurance Integration',
                'Route Optimization'
              ].map((feature, i) => (
                <li key={i} style={{marginBottom: 8, opacity: 0.9}}>
                  ✅ {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing */}
          <div>
            <h4 style={{margin: '0 0 16px 0', fontSize: 16, fontWeight: 'bold'}}>Pricing Plans</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: 12,
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: 'bold'}}>Free Tier</span>
                  <span style={{color: '#10b981', fontWeight: 'bold'}}>$0/month</span>
                </div>
                <p style={{margin: '4px 0 0 0', fontSize: 12, opacity: 0.8}}>
                  2 trucks, 60 dispatches/month
                </p>
              </div>
              <div style={{
                background: 'rgba(59,130,246,0.2)',
                padding: 12,
                borderRadius: 6,
                border: '1px solid rgba(59,130,246,0.3)'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: 'bold'}}>Professional</span>
                  <span style={{color: '#3b82f6', fontWeight: 'bold'}}>$99/month</span>
                </div>
                <p style={{margin: '4px 0 0 0', fontSize: 12, opacity: 0.8}}>
                  25 trucks, unlimited dispatches
                </p>
              </div>
              <div style={{
                background: 'rgba(124,58,237,0.2)',
                padding: 12,
                borderRadius: 6,
                border: '1px solid rgba(124,58,237,0.3)'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: 'bold'}}>Enterprise</span>
                  <span style={{color: '#7c3aed', fontWeight: 'bold'}}>$299/month</span>
                </div>
                <p style={{margin: '4px 0 0 0', fontSize: 12, opacity: 0.8}}>
                  Unlimited everything
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{margin: '0 0 16px 0', fontSize: 16, fontWeight: 'bold'}}>Get Started</h4>
            <p style={{margin: '0 0 16px 0', opacity: 0.9}}>
              Ready to revolutionize your tow operations?
            </p>
            <button
              onClick={() => setShowContactForm(true)}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: 14,
                marginBottom: 16
              }}
            >
              Contact Sales
            </button>
            <div style={{fontSize: 12, opacity: 0.8}}>
              <p style={{margin: '4px 0'}}>📞 (555) 123-TOWS</p>
              <p style={{margin: '4px 0'}}>📧 sales@towops.com</p>
              <p style={{margin: '4px 0'}}>🌐 www.towops.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{display: 'flex', gap: 24, fontSize: 12, opacity: 0.8}}>
            <a href="#" style={{color: 'white', textDecoration: 'none'}}>Privacy Policy</a>
            <a href="#" style={{color: 'white', textDecoration: 'none'}}>Terms of Service</a>
            <a href="#" style={{color: 'white', textDecoration: 'none'}}>Support</a>
            <a href="#" style={{color: 'white', textDecoration: 'none'}}>API Docs</a>
          </div>
          <div style={{fontSize: 12, opacity: 0.8}}>
            © 2024 TowOps. All rights reserved.
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
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
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: 'white',
            padding: 32,
            borderRadius: 12,
            maxWidth: 500,
            width: '100%',
            color: '#1f2937'
          }}>
            <h3 style={{margin: '0 0 20px 0'}}>Contact Sales</h3>
            <form onSubmit={handleContactSubmit}>
              <div style={{marginBottom: 16}}>
                <label style={{display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold'}}>
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>
              <div style={{marginBottom: 16}}>
                <label style={{display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold'}}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>
              <div style={{marginBottom: 16}}>
                <label style={{display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold'}}>
                  Company
                </label>
                <input
                  type="text"
                  value={contactForm.company}
                  onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>
              <div style={{marginBottom: 20}}>
                <label style={{display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold'}}>
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    fontSize: 14,
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{display: 'flex', gap: 12}}>
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 14
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 'bold'
                  }}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  )
}
