export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers }, credentials: 'include', cache: 'no-store', signal: options.signal ?? AbortSignal.timeout(60_000) });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    throw new ApiError('Unable to reach ResolvePay. Check your connection and try again.', 0);
  }
  if (!res.ok) {
    let message = res.status >= 500 ? 'The service is temporarily unavailable. Please try again.' : `Request failed (${res.status}). Please try again.`;
    try { const body = await res.json(); if (body.message) message = Array.isArray(body.message) ? body.message.join('. ') : body.message; } catch {}
    if (res.status === 401 && !url.includes('/auth/') && typeof window !== 'undefined') window.dispatchEvent(new Event('resolvepay:unauthorized'));
    throw new ApiError(message, res.status);
  }
  return res.status === 204 ? undefined as T : await res.json() as T;
}
