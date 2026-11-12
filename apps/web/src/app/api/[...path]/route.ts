import { NextRequest, NextResponse } from 'next/server';
import http from 'node:http';
import https from 'node:https';

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host',
]);

async function handleProxy(req: NextRequest, params: { path: string[] }) {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    const origin = req.headers.get('origin');
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const allowedOrigin = host ? `${proto}://${host}` : req.nextUrl.origin;
    if (req.headers.get('sec-fetch-site') === 'cross-site' || (origin && origin !== req.nextUrl.origin && origin !== allowedOrigin)) {
      return NextResponse.json({ message: 'Request origin is not allowed.' }, { status: 403 });
    }
  }

  const apiBase =
    process.env.API_INTERNAL_URL ||
    'https://resolvepay-api.politetree-c3c2d975.centralindia.azurecontainerapps.io';
  const pathname = `/api/${params.path.join('/')}`;
  const search = req.nextUrl.search;
  const targetUrl = new URL(`${apiBase}${pathname}${search}`);

  const forwardHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      forwardHeaders[key.toLowerCase()] = value;
    }
  });

  const clientHost = req.headers.get('host');
  if (clientHost) {
    forwardHeaders['x-forwarded-host'] = clientHost;
  }

  let bodyBuffer: Buffer | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const ab = await req.arrayBuffer();
    if (ab.byteLength > 0) {
      bodyBuffer = Buffer.from(ab);
      forwardHeaders['content-length'] = String(bodyBuffer.byteLength);
    }
  }

  const transport = targetUrl.protocol === 'https:' ? https : http;

  return new Promise<NextResponse>((resolve) => {
    const proxyReq = transport.request(
      targetUrl,
      {
        method: req.method,
        headers: forwardHeaders,
      },
      (proxyRes) => {
        const chunks: Buffer[] = [];
        proxyRes.on('data', (chunk) => chunks.push(chunk));
        proxyRes.on('end', () => {
          const resBody = Buffer.concat(chunks);
          const resHeaders = new Headers();

          for (const [key, value] of Object.entries(proxyRes.headers)) {
            if (!value || HOP_BY_HOP_HEADERS.has(key.toLowerCase())) continue;
            if (key.toLowerCase() === 'set-cookie') {
              if (Array.isArray(value)) {
                value.forEach((c) => resHeaders.append('set-cookie', c));
              } else {
                resHeaders.append('set-cookie', value);
              }
            } else {
              resHeaders.set(key, Array.isArray(value) ? value.join(', ') : value);
            }
          }

          resHeaders.set('Cache-Control', 'private, no-store');

          resolve(
            new NextResponse(resBody, {
              status: proxyRes.statusCode || 200,
              statusText: proxyRes.statusMessage || 'OK',
              headers: resHeaders,
            }),
          );
        });
      },
    );

    proxyReq.on('error', (err) => {
      console.error('[Web API Gateway Proxy Error]:', err);
      resolve(
        NextResponse.json(
          { message: 'API Gateway Connection Error', error: err.message },
          { status: 502 },
        ),
      );
    });

    if (bodyBuffer) {
      proxyReq.write(bodyBuffer);
    }
    proxyReq.end();
  });
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
