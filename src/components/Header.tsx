'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'var(--text-primary)',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'var(--accent)',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="var(--accent-text)" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="var(--accent-text)" opacity="0.5" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="var(--accent-text)" opacity="0.5" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="var(--accent-text)" opacity="0.25" />
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '-0.01em' }}>
            Textdrop
          </span>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              fontWeight: 400,
              fontFamily: 'DM Mono, monospace',
            }}
          >
            .uz
          </span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all 0.15s ease',
                fontSize: '15px',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.backgroundColor = 'var(--bg-secondary)'
                el.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.backgroundColor = 'transparent'
                el.style.color = 'var(--text-secondary)'
              }}
            >
              {theme === 'dark' ? '☀' : '◐'}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
