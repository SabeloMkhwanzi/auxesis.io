import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const ONEINCH_API_BASE = 'https://api.1inch.dev';
const HISTORY_API_VERSION = 'history/v2.0';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { params } = req.query;
    
    if (!params || !Array.isArray(params)) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    // Extract wallet address and endpoint from params
    const [walletAddress, endpoint] = params;
    
    if (!walletAddress || !endpoint) {
      return res.status(400).json({ error: 'Missing wallet address or endpoint' });
    }
    
    // Build the correct API path based on endpoint
    let apiPath = '';
    if (endpoint === 'events') {
      apiPath = `${walletAddress}/events`;
    } else if (endpoint === 'metrics') {
      apiPath = `${walletAddress}/metrics`;
    } else {
      return res.status(400).json({ error: 'Invalid endpoint. Use "events" or "metrics"' });
    }
    
    const queryParams = { ...req.query };
    delete queryParams.params;

    const fullUrl = `${ONEINCH_API_BASE}/${HISTORY_API_VERSION}/${apiPath}`;
    console.log('🔍 History API request:', { fullUrl, queryParams, endpoint });

    const response = await axios.get(fullUrl, {
      params: queryParams,
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ONEINCH_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('History API proxy error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    res.status(500).json({ 
      error: 'Failed to fetch history data',
      details: error.response?.data || error.message 
    });
  }
}
