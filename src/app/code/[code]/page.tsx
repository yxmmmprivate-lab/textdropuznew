import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { RetrieveSection } from '@/components/RetrieveSection'
import { ToastProvider } from '@/components/Toast'

interface Props {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  return {
    title: `Code ${code.toUpperCase()} — Textdrop`,
    description: 'Retrieve text shared via Textdrop.',
    robots: { index: false },
  }
}

export default async function CodePage({ params }: Props) {
  const { code } = await params
  const upperCode = code.toUpperCase()

  return (
    <ToastProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            gap: '24px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Retrieving code
            </p>
            <p
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '36px',
                fontWeight: 500,
                letterSpacing: '0.3em',
                color: 'var(--text-primary)',
              }}
            >
              {upperCode}
            </p>
          </div>

          <RetrieveSection initialCode={upperCode} />

          <a
            href="/"
            className="back-link"
            style={{
              fontSize: '13px',
              color: 'var(--text-tertiary)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
          >
            ← Back to Textdrop
          </a>
        </main>
      </div>
    </ToastProvider>
  )
}
