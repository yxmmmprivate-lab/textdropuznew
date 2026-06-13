'use client'

import React, { useState, useRef, useCallback } from 'react'
import { useToast } from './Toast'

const MAX_CHARS = 50_000

type State = 'idle' | 'loading' | 'success'

interface SuccessData {
  code: string
}

export function CreateSection() {
  const [text, setText] = useState('')
  const [state, setState] = useState<State>('idle')
  const [result, setResult] = useState<SuccessData | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  const handleGenerate = useCallback(async () => {
    const trimmed = text.trim()
    if (!trimmed) {
      setError('Please enter some text first.')
      textareaRef.current?.focus()
      return
    }
    if (trimmed.length > MAX_CHARS) {
      setError(`Text is too long. Max ${MAX_CHARS.toLocaleString()} characters.`)
      return
    }

    setError(null)
    setState('loading')

    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate code.')
      }

      setResult({ code: data.code })
      setState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setState('idle')
    }
  }, [text])

  const handleCopyCode = useCallback(async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.code)
      setCopied(true)
      toast('Code copied!', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast('Failed to copy.', 'error')
    }
  }, [result, toast])

  const handleCopyLink = useCallback(async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/code/${result.code}`)
      toast('Link copied!', 'success')
    } catch {
      toast('Failed to copy.', 'error')
    }
  }, [result, toast])

  const handleCreateNew = useCallback(() => {
    setText('')
    setResult(null)
    setState('idle')
    setError(null)
    setCopied(false)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleGenerate()
      }
    },
    [handleGenerate]
  )

  const charCount = text.length
  const isOverLimit = charCount > MAX_CHARS
  const charPercent = Math.min((charCount / MAX_CHARS) * 100, 100)

  if (state === 'success' && result) {
    return (
      <div className="animate-fade-in-scale" style={{ width: '100%', maxWidth: '520px' }}>
        {/* Success card */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center',
          }}
        >
          {/* Success icon */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'var(--success)',
              fontSize: '20px',
            }}
          >
            ✓
          </div>

          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-tertiary)',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Your code
          </p>

          {/* The code display */}
          <div
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '52px',
              fontWeight: 500,
              letterSpacing: '0.25em',
              color: 'var(--code-text)',
              backgroundColor: 'var(--code-bg)',
              padding: '20px 32px',
              borderRadius: 'var(--radius)',
              marginBottom: '8px',
              userSelect: 'all',
              cursor: 'text',
            }}
          >
            {result.code}
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '28px' }}>
            Share this code to retrieve your text on any device
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' }}>
            <button
              onClick={handleCopyCode}
              style={{
                padding: '11px 22px',
                backgroundColor: copied ? 'var(--success-bg)' : 'var(--accent)',
                color: copied ? 'var(--success)' : 'var(--accent-text)',
                border: copied ? '1px solid var(--success-border)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                fontFamily: 'inherit',
              }}
            >
              {copied ? '✓ Copied!' : '⎘ Copy Code'}
            </button>

            <button
              onClick={handleCopyLink}
              style={{
                padding: '11px 22px',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.backgroundColor = 'var(--bg-secondary)'
                el.style.borderColor = 'var(--border-strong)'
                el.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.backgroundColor = 'transparent'
                el.style.borderColor = 'var(--border)'
                el.style.color = 'var(--text-secondary)'
              }}
            >
              ↗ Copy Link
            </button>
          </div>

          <button
            onClick={handleCreateNew}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)'
            }}
          >
            + Create new
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: '680px' }}>
      {/* Textarea card */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => {
            setText(e.target.value)
            if (error) setError(null)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Paste your text here — any content, any length..."
          autoFocus
          style={{
            width: '100%',
            minHeight: '220px',
            padding: '24px',
            fontSize: '15px',
            lineHeight: '1.7',
            color: 'var(--text-primary)',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'DM Sans, sans-serif',
          }}
        />

        {/* Footer bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          {/* Character counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '80px',
                height: '3px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${charPercent}%`,
                  backgroundColor: isOverLimit
                    ? 'var(--error)'
                    : charPercent > 75
                    ? '#f59e0b'
                    : 'var(--success)',
                  borderRadius: '2px',
                  transition: 'width 0.1s ease, background-color 0.2s ease',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '12px',
                color: isOverLimit ? 'var(--error)' : 'var(--text-tertiary)',
                fontFamily: 'DM Mono, monospace',
              }}
            >
              {charCount.toLocaleString()}
              {isOverLimit && ` / ${MAX_CHARS.toLocaleString()}`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
              ⌘↵ to generate
            </span>
            <button
              onClick={handleGenerate}
              disabled={state === 'loading' || isOverLimit}
              style={{
                padding: '9px 20px',
                backgroundColor: state === 'loading' ? 'var(--accent-hover)' : 'var(--accent)',
                color: 'var(--accent-text)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: state === 'loading' || isOverLimit ? 'not-allowed' : 'pointer',
                opacity: isOverLimit ? 0.5 : 1,
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                if (state !== 'loading' && !isOverLimit) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.opacity = '0.88'
                  el.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.opacity = isOverLimit ? '0.5' : '1'
                el.style.transform = 'translateY(0)'
              }}
            >
              {state === 'loading' ? (
                <>
                  <Spinner />
                  Generating...
                </>
              ) : (
                'Generate Code →'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: '12px',
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
          {error}
        </div>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <span
      style={{
        width: '14px',
        height: '14px',
        border: '2px solid var(--accent-text)',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  )
}
