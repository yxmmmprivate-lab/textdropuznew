import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '72px',
          fontWeight: 300,
          color: 'var(--text-tertiary)',
          lineHeight: 1,
        }}
      >
        404
      </p>
      <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>
        Page not found
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.6 }}>
        This page doesn't exist. If you're looking for a text code, head back to the homepage.
      </p>
      <Link
        href="/"
        style={{
          marginTop: '8px',
          padding: '11px 22px',
          backgroundColor: 'var(--accent)',
          color: 'var(--accent-text)',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        Go to Textdrop
      </Link>
    </div>
  )
}
