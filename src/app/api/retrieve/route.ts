import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isValidCode } from '@/lib/codes'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1'

    const limit = rateLimit(ip, 'retrieve')
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body.code !== 'string') {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const code = body.code.trim().toUpperCase()

    if (!isValidCode(code)) {
      return NextResponse.json(
        { error: 'Invalid code format.' },
        { status: 400 }
      )
    }

    const record = await prisma.text.findUnique({
      where: { code },
      select: { content: true, createdAt: true, viewCount: true, expiresAt: true },
    })

    if (!record) {
      return NextResponse.json({ error: 'Code not found.' }, { status: 404 })
    }

    // Check expiry
    if (record.expiresAt && record.expiresAt < new Date()) {
      return NextResponse.json({ error: 'This code has expired.' }, { status: 410 })
    }

    // Increment view count (fire-and-forget)
    prisma.text
      .update({
        where: { code },
        data: { viewCount: { increment: 1 } },
      })
      .catch(console.error)

    return NextResponse.json({
      text: record.content,
      createdAt: record.createdAt,
      viewCount: record.viewCount + 1,
    })
  } catch (error) {
    console.error('[RETRIEVE ERROR]', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

// Also support GET for direct URL access
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.json({ error: 'Code required.' }, { status: 400 })
  }

  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ code }),
    })
  )
}
