import { NextRequest, NextResponse } from 'next/server';

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'content-length',
  'content-encoding',
  'host',
]);

async function handleProxy(req: NextRequest, params: { path: string[] }) {
  const apiBase =
    process.env.API_INTERNAL_URL ||
    'https://resolvepay-api.politetree-c3c2d975.centralindia.azurecontainerapps.io';
  const pathname = `/api/${params.path.join('/')}`;
  const search = req.nextUrl.search;
  const targetUrl = `${apiBase}${pathname}${search}`;

  const forwardHeaders = new Headers();
  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      forwardHeaders.set(key, value);
    }
  });

  // Ensure client IP / host are noted
  const clientHost = req.headers.get('host');
  if (clientHost) {
    forwardHeaders.set('x-forwarded-host', clientHost);
  }

  let body: BodyInit | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const arrayBuffer = await req.arrayBuffer();
    if (arrayBuffer.byteLength > 0) {
      body = arrayBuffer;
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body,
      redirect: 'manual',
    });

    const resHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
        resHeaders.set(key, value);
      }
    });

    // Node / Next.js getSetCookie support for multi-cookie preservation
    const getSetCookie = (response.headers as any).getSetCookie;
    if (typeof getSetCookie === 'function') {
      const cookies: string[] = getSetCookie.call(response.headers);
      if (cookies && cookies.length > 0) {
        resHeaders.delete('set-cookie');
        for (const cookie of cookies) {
          resHeaders.append('set-cookie', cookie);
        }
      }
    }

    const responseBody = await response.arrayBuffer();

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
  } catch (err: any) {
    console.error('[Web API Gateway Proxy Error]:', err);
    return NextResponse.json(
      { message: 'API Gateway Connection Error', error: err?.message },
      { status: 502 },
    );
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params);
}
