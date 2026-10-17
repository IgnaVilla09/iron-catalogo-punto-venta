import { NextRequest } from 'next/server';

const BACKEND_CATALOG_PATH = '/api/v1/catalog/public';

async function proxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    return Response.json({ success: false, message: 'Configuración de API incompleta' }, { status: 500 });
  }

  const { path } = await params;
  const backendUrl = new URL(`${BACKEND_CATALOG_PATH}/${path.map(encodeURIComponent).join('/')}`, apiUrl);
  backendUrl.search = request.nextUrl.search;

  try {
    const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();
    const response = await fetch(backendUrl, {
      method: request.method,
      headers: request.headers.has('content-type') ? { 'Content-Type': request.headers.get('content-type')! } : undefined,
      body,
      cache: 'no-store',
    });

    return new Response(response.body, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('content-type') ?? 'application/json' },
    });
  } catch {
    return Response.json({ success: false, message: 'No se pudo conectar con la API' }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
