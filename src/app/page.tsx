import { Header } from '@/components/Header'
import { CreateSection } from '@/components/CreateSection'
import { RetrieveSection } from '@/components/RetrieveSection'
import { ToastProvider } from '@/components/Toast'

export default function HomePage() {
  return (
    <ToastProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        <main style={{ flex: 1 }}>
          {/* Hero */}
          <section
            style={{
              padding: '80px 24px 72px',
              textAlign: 'center',
            }}
          >
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              {/* Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 14px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '100px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  marginBottom: '28px',
                  letterSpacing: '0.01em',
                }}
              >
                <span style={{ color: 'var(--success)', fontSize: '8px' }}>●</span>
                No accounts · No login · No friction
              </div>

              <h1
                style={{
                  fontSize: 'clamp(36px, 6vw, 64px)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-primary)',
                  marginBottom: '20px',
                }}
              >
                Paste once.
                <br />
                <span style={{ color: 'var(--text-tertiary)' }}>Access anywhere.</span>
              </h1>

              <p
                style={{
                  fontSize: 'clamp(16px, 2.5vw, 19px)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  maxWidth: '500px',
                  margin: '0 auto 56px',
                  fontWeight: 400,
                }}
              >
                Turn any text into a 5-character code. Retrieve it instantly from any device, anywhere.
              </p>

              {/* Main create area */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CreateSection />
              </div>
            </div>
          </section>

          {/* Divider with label */}
          <div
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '48px',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', fontWeight: 500 }}>
              or retrieve with a code
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
          </div>

          {/* Retrieve section */}
          <section style={{ padding: '0 24px 80px', display: 'flex', justifyContent: 'center' }}>
            <RetrieveSection />
          </section>

          {/* How it works */}
          <section
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border)',
              padding: '72px 24px',
            }}
          >
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2
                style={{
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '48px',
                }}
              >
                How it works
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '32px',
                }}
              >
                {[
                  {
                    step: '01',
                    title: 'Paste your text',
                    desc: 'Paste or type any content — passwords, addresses, code snippets, notes.',
                  },
                  {
                    step: '02',
                    title: 'Get a short code',
                    desc: 'Receive a unique 5-character code instantly. No account needed.',
                  },
                  {
                    step: '03',
                    title: 'Access anywhere',
                    desc: 'Enter the code on any device to retrieve your text immediately.',
                  },
                ].map(item => (
                  <div key={item.step} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span
                      style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '12px',
                        color: 'var(--text-tertiary)',
                        fontWeight: 400,
                      }}
                    >
                      {item.step}
                    </span>
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Business Inquiries */}
        <section
          style={{
            borderTop: '1px solid var(--border)',
            padding: '64px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <h2
              style={{
                fontSize: 'clamp(20px, 3vw, 26px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                marginBottom: '14px',
              }}
            >
              Interested in Acquiring or Collaborating?
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                marginBottom: '24px',
              }}
            >
              Looking to purchase this project, integrate the technology, invest, or collaborate on future development?
            </p>
            <a
              href="mailto:yxmmm.private@gmail.com"
              className="contact-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M1 4.5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              yxmmm.private@gmail.com
            </a>
            <p
              style={{
                marginTop: '16px',
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                lineHeight: 1.6,
              }}
            >
              Open to acquisition offers, partnerships, licensing opportunities, and business collaborations.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid var(--border)',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Textdrop.uz</span>
            {' '}— Codes expire after 30 days · All text stored securely
          </p>
        </footer>
      </div>
    </ToastProvider>
  )
}
