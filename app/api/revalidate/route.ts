import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return handleRevalidation(request)
}

export async function POST(request: NextRequest) {
  return handleRevalidation(request)
}

async function handleRevalidation(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path') || '/'

    // Revalidate the sanity tag
    revalidateTag('sanity', { expire: 0 })

    // Revalidate paths
    revalidatePath('/', 'page')
    revalidatePath('/work', 'page')
    if (path && path !== '/') {
      revalidatePath(path, 'page')
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: 'Cache successfully purged and revalidated',
    })
  } catch (err) {
    return NextResponse.json(
      {
        revalidated: false,
        error: err instanceof Error ? err.message : 'Error revalidating',
      },
      { status: 500 }
    )
  }
}
