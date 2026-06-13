import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCode } from '@/lib/codes'
import { rateLimit } from '@/lib/rateLimit'

const MAX_CONTENT_LENGTH = 50_000 // 50KB

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1'

    // Rate limiting
    const limit = rateLimit(ip, 'create')
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(limit.resetAt),
            'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          },
        }
      )
    }

    // Parse body
    const body = await request.json().catch(() => null)
    if (!body || typeof body.text !== 'string') {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const text = body.text.trim()

    // Validation
    if (!text) {
      return NextResponse.json({ error: 'Text cannot be empty.' }, { status: 400 })
    }

    if (text.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `Text too long. Maximum ${MAX_CONTENT_LENGTH.toLocaleString()} characters.` },
        { status: 400 }
      )
    }

    // Generate unique code with retry
    let code: string | null = null
    let attempts = 0
    const MAX_ATTEMPTS = 10

    while (attempts < MAX_ATTEMPTS) {
      const candidate = generateCode()
      const existing = await prisma.text.findUnique({ where: { code: candidate } })
      if (!existing) {
        code = candidate
        break
      }
      attempts++
    }

    if (!code) {
      return NextResponse.json(
        { error: 'Failed to generate unique code. Please try again.' },
        { status: 500 }
      )
    }

    // Store in database
    const record = await prisma.text.create({
      data: {
        code,
        content: text,
        // Optional: expire after 30 days
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    return NextResponse.json(
      { code: record.code, createdAt: record.createdAt },
      {
        status: 201,
        headers: {
          'X-RateLimit-Remaining': String(limit.remaining),
        },
      }
    )
  } catch (error) {
    console.error('[CREATE ERROR]', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
