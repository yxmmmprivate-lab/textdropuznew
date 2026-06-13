'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useToast } from './Toast'

type State = 'idle' | 'loading' | 'success' | 'error'

interface RetrieveSectionProps {
  initialCode?: string
}

export function RetrieveSection({ initialCode }: RetrieveSectionProps) {
  const [code, setCode] = useState(initialCode || '')
  const [state, setState] = useState<State>('idle')
  const [retrievedText, setRetrievedText] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [viewCount, setViewCount] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleRetrieve = useCallback(
    async (overrideCode?: string) => {
      const targetCode = (overrideCode ?? code).trim().toUpperCase()
      if (!targetCode) {
        inputRef.current?.focus()
        return
      }

      setState('loading')
      setErrorMsg(null)
      setRetrievedText(null)

      try {
        const res = await fetch('/api/retrieve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: targetCode }),
        })

        const data = await res.json()

        if (!res.ok) {
          setErrorMsg(data.error || 'Something went wrong.')
          setState('error')
          return
        }

        setRetrievedText(data.text)
        setViewCount(data.viewCount)
        setState('success')
      } catch {
        setErrorMsg('Network error. Please try again.')
        setState('error')
      }
    },
    [code]
  )

  // Auto-retrieve if initialCode provided
  useEffect(() => {
    if (initialCode) {
      handleRetrieve(initialCode)
    }
  }, [initialCode]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 5)
    setCode(val)
    if (state === 'error') {
      setState('idle')
      setErrorMsg(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleRetrieve()
  }

  const handleCopy = async () => {
    if (!retrievedText) return
    try {
      await navigator.clipboard.writeText(retrievedText)
      setCopied(true)
      toast('Text copied!', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast('Failed to copy.', 'error')
    }
  }

  const handleReset = () => {
    setCode('')
    setState('idle')
    setRetrievedText(null)
    setErrorMsg(null)
    setCopied(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        boxShadow: 'var(--shadow-md)',
        width: '100%',
        maxWidth: '480px',
      }}
    >
      <p
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--text-tertiary)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        Retrieve Text
      </p>

      {/* Code input row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: state === 'success' || state === 'error' ? '16px' : '0' }}>
        <input
          ref={inputRef}
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          placeholder="K7M4P"
          maxLength={5}
          style={{
            flex: 1,
            padding: '11px 16px',
            fontFamily: 'DM Mono, monospace',
            fontSize: '20px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            backgroundColor: 'var(--bg-secondary)',
            border: `1px solid ${state === 'error' ? 'var(--error-border)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
            textAlign: 'center',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={e => {
            if (state !== 'error') {
              e.currentTarget.style.borderColor = 'var(--border-strong)'
            }
          }}
          onBlur={e => {
            if (state !== 'error') {
              e.currentTarget.style.borderColor = 'var(--border)'
            }
          }}
        />

        <button
          onClick={() => handleRetrieve()}
          disabled={state === 'loading' || code.length === 0}
          style={{
            padding: '11px 20px',
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-text)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: state === 'loading' || code.length === 0 ? 'not-allowed' : 'pointer',
            opacity: code.length === 0 ? 0.5 : 1,
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          {state === 'loading' ? (
            <>
              <Spinner />
              <span>Fetching</span>
            </>
          ) : (
            'Retrieve →'
          )}
        </button>
      </div>

      {/* Retrieved text */}
      {state === 'success' && retrievedText !== null && (
        <div className="animate-slide-up">
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              marginBottom: '12px',
              maxHeight: '220px',
              overflowY: 'auto',
            }}
          >
            <pre
              style={{
                margin: 0,
                fontSize: '13.5px',
                lineHeight: '1.7',
                color: 'var(--text-primary)',
                fontFamily: 'DM Mono, monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {retrievedText}
            </pre>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={handleCopy}
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: copied ? 'var(--success-bg)' : 'var(--accent)',
                color: copied ? 'var(--success)' : 'var(--accent-text)',
                border: copied ? '1px solid var(--success-border)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
            >
              {copied ? '✓ Copied!' : '⎘ Copy Text'}
            </button>

            <button
              onClick={handleReset}
              style={{
                padding: '10px 14px',
                backgroundColor: 'transparent',
                color: 'var(--text-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.color = 'var(--text-primary)'
                el.style.borderColor = 'var(--border-strong)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.color = 'var(--text-tertiary)'
                el.style.borderColor = 'var(--border)'
              }}
            >
              ↺ New
            </button>
          </div>

          {viewCount !== null && (
            <p style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
              Retrieved {viewCount} {viewCount === 1 ? 'time' : 'times'}
            </p>
          )}
        </div>
      )}

      {/* Error state */}
      {state === 'error' && errorMsg && (
        <div
          className="animate-fade-in"
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--error-bg)',
            border: '1px solid var(--error-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--error)',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>⚠</span>
          {errorMsg}
        </div>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <span
      style={{
        width: '13px',
        height: '13px',
        border: '2px solid var(--accent-text)',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  )
}
