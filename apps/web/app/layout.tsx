import ChatWidget from '../components/ChatWidget'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AuthProvider } from '../lib/auth'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f9fafb'
      }}>
        <AuthProvider>
          <Header />
          <main style={{
            flex: 1,
            padding: '20px',
            maxWidth: 1200,
            margin: '0 auto',
            width: '100%'
          }}>
            {children}
          </main>
          <Footer />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  )
}
