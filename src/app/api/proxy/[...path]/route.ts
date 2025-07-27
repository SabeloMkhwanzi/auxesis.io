import { NextRequest, NextResponse } from 'next/server';

const ONEINCH_API_BASE = 'https://api.1inch.dev';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Extract the path from the request
    const resolvedParams = await params;
    const apiPath = resolvedParams.path.join('/');
    
    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_ONEINCH_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);

    // Construct the full URL
    const oneInchUrl = `${ONEINCH_API_BASE}/${apiPath}?${queryParams.toString()}`;
    
    // Forward the request to 1inch API
    const response = await fetch(oneInchUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // Return the response with CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
    
    return NextResponse.json(
      { 
        error: 'Proxy error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
