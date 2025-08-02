import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { addresses, chain_id, timerange, use_cache } = req.query;

    if (!addresses || !chain_id) {
      return res.status(400).json({ error: 'Missing required parameters: addresses, chain_id' });
    }

    const apiKey = process.env.NEXT_PUBLIC_ONEINCH_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Build the 1inch API URL
    const addressesParam = Array.isArray(addresses) ? addresses.join(',') : addresses as string;
    const params = new URLSearchParams({
      addresses: addressesParam,
      chain_id: chain_id as string,
      timerange: (timerange as string) || '1day',
      use_cache: (use_cache as string) || 'true'
    });

    console.log('Portfolio Chart API request:', {
      addresses: addressesParam,
      chain_id: chain_id as string,
      timerange: (timerange as string) || '1day',
      use_cache: (use_cache as string) || 'true'
    });

    const apiUrl = `https://api.1inch.dev/portfolio/portfolio/v5.0/general/chart?${params}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('1inch Portfolio Chart API error:', {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      return res.status(response.status).json({ 
        error: `1inch API error: ${response.status}`,
        details: errorText,
        url: apiUrl
      });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Portfolio Chart API proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
