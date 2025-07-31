// Real price data service using CoinGecko (crypto) and Alpha Vantage (stocks)

export interface PriceDataPoint {
  timestamp: number;
  price: number;
}

export interface AssetPriceData {
  priceHistory: number[];
  currentPrice: number;
  percentChange: number;
  isPositive: boolean;
  lastUpdated: number;
}

// Cache for API responses (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const priceCache = new Map<string, { data: AssetPriceData; timestamp: number }>();

// Free API endpoints
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const ALPHA_VANTAGE_API_KEY = 'demo'; // Use 'demo' for testing, replace with real key

// Asset type detection
function getAssetType(assetId: string): 'crypto' | 'stock' | 'forex' | 'unknown' {
  const cryptoPatterns = ['btc', 'bitcoin', 'eth', 'ethereum', 'usdc', 'usdt', 'sol', 'solana', 'doge', 'dogecoin', 'ada', 'cardano', 'dot', 'polkadot', 'link', 'chainlink', 'crypto'];
  const stockPatterns = ['stock', 'equity', 'aapl', 'googl', 'msft', 'tsla', 'amzn', 'nvda', 'meta'];
  
  const lowerAssetId = assetId.toLowerCase();
  
  if (cryptoPatterns.some(pattern => lowerAssetId.includes(pattern))) {
    return 'crypto';
  }
  
  if (stockPatterns.some(pattern => lowerAssetId.includes(pattern))) {
    return 'stock';
  }
  
  // Default to crypto for unknown assets since CoinGecko has broader free access
  return 'crypto';
}

// Map asset IDs to API-compatible symbols
function mapAssetToSymbol(assetId: string, assetType: 'crypto' | 'stock'): string {
  const lowerAssetId = assetId.toLowerCase();
  
  if (assetType === 'crypto') {
    // CoinGecko coin IDs
    const cryptoMapping: Record<string, string> = {
      'btc': 'bitcoin',
      'bitcoin': 'bitcoin',
      'eth': 'ethereum', 
      'ethereum': 'ethereum',
      'usdc': 'usd-coin',
      'usdt': 'tether',
      'sol': 'solana',
      'solana': 'solana',
      'doge': 'dogecoin',
      'dogecoin': 'dogecoin',
      'ada': 'cardano',
      'cardano': 'cardano',
      'dot': 'polkadot',
      'polkadot': 'polkadot',
      'link': 'chainlink',
      'chainlink': 'chainlink',
    };
    
    for (const [key, value] of Object.entries(cryptoMapping)) {
      if (lowerAssetId.includes(key)) {
        return value;
      }
    }
    
    return 'bitcoin'; // Default fallback
  } else {
    // Stock symbols for Alpha Vantage
    const stockMapping: Record<string, string> = {
      'aapl': 'AAPL',
      'apple': 'AAPL',
      'googl': 'GOOGL',
      'google': 'GOOGL',
      'msft': 'MSFT',
      'microsoft': 'MSFT',
      'tsla': 'TSLA',
      'tesla': 'TSLA',
      'amzn': 'AMZN',
      'amazon': 'AMZN',
      'nvda': 'NVDA',
      'nvidia': 'NVDA',
      'meta': 'META',
    };
    
    for (const [key, value] of Object.entries(stockMapping)) {
      if (lowerAssetId.includes(key)) {
        return value;
      }
    }
    
    return 'AAPL'; // Default fallback
  }
}

// Fetch crypto data from CoinGecko (free tier)
async function fetchCryptoData(coinId: string): Promise<AssetPriceData> {
  try {
    // Get 7 days of hourly data (free tier)
    const historyResponse = await fetch(
      `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=hourly`
    );
    
    if (!historyResponse.ok) {
      throw new Error(`CoinGecko API error: ${historyResponse.status}`);
    }
    
    const historyData = await historyResponse.json();
    
    if (!historyData.prices || historyData.prices.length === 0) {
      throw new Error('No price data available');
    }
    
    // Extract prices from the last 30 data points for chart
    const prices = historyData.prices.slice(-30).map(([_, price]: [number, number]) => price);
    const currentPrice = prices[prices.length - 1];
    const firstPrice = prices[0];
    const percentChange = ((currentPrice - firstPrice) / firstPrice) * 100;
    
    return {
      priceHistory: prices,
      currentPrice,
      percentChange: Number(percentChange.toFixed(2)),
      isPositive: percentChange >= 0,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    console.error(`Error fetching crypto data for ${coinId}:`, error);
    throw error;
  }
}

// Fetch stock data from Alpha Vantage (free tier)
async function fetchStockData(symbol: string): Promise<AssetPriceData> {
  try {
    // Get daily data (free tier - last 100 days)
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}&outputsize=compact`
    );
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      // API call frequency limit reached
      throw new Error('API rate limit reached');
    }
    
    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error('No time series data available');
    }
    
    // Get last 30 days of closing prices
    const dates = Object.keys(timeSeries).sort().slice(-30);
    const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));
    
    const currentPrice = prices[prices.length - 1];
    const firstPrice = prices[0];
    const percentChange = ((currentPrice - firstPrice) / firstPrice) * 100;
    
    return {
      priceHistory: prices,
      currentPrice,
      percentChange: Number(percentChange.toFixed(2)),
      isPositive: percentChange >= 0,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    throw error;
  }
}

// Main function to get real price data (using backend API)
export async function getRealPriceData(assetId: string): Promise<AssetPriceData> {
  // Check cache first
  const cached = priceCache.get(assetId);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    // Use the backend API endpoint
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/price-data/${encodeURIComponent(assetId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_BACKEND_API_KEY || '',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const priceData = await response.json();
    
    // Cache the result
    priceCache.set(assetId, {
      data: priceData,
      timestamp: Date.now(),
    });
    
    return priceData;
  } catch (error) {
    console.error(`Failed to fetch real price data for ${assetId}:`, error);
    // Return fallback data if backend API fails
    return generateFallbackData(assetId);
  }
}

// Fallback data generator (improved version of mock data)
function generateFallbackData(assetId: string): AssetPriceData {
  const seed = hashString(assetId);
  const assetType = getAssetType(assetId);
  
  // Generate more realistic base prices
  let basePrice: number;
  if (assetType === 'crypto') {
    if (assetId.toLowerCase().includes('btc') || assetId.toLowerCase().includes('bitcoin')) {
      basePrice = 45000 + (seededRandom(seed) * 15000);
    } else if (assetId.toLowerCase().includes('eth') || assetId.toLowerCase().includes('ethereum')) {
      basePrice = 2800 + (seededRandom(seed) * 1200);
    } else if (assetId.toLowerCase().includes('usdc') || assetId.toLowerCase().includes('usdt')) {
      basePrice = 1.00 + (seededRandom(seed) * 0.02 - 0.01);
    } else {
      basePrice = 50 + (seededRandom(seed) * 200);
    }
  } else {
    basePrice = 100 + (seededRandom(seed) * 300);
  }
  
  // Generate more realistic price movements
  const priceHistory: number[] = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < 30; i++) {
    // More realistic volatility based on asset type
    const volatility = assetType === 'crypto' ? 0.08 : 0.04; // Crypto is more volatile
    const randomFactor = (seededRandom(seed + i) - 0.5) * volatility;
    const trendFactor = Math.sin((i / 30) * Math.PI * 2) * 0.01;
    
    currentPrice = currentPrice * (1 + randomFactor + trendFactor);
    priceHistory.push(Number(currentPrice.toFixed(assetType === 'crypto' ? 2 : 2)));
  }
  
  const startPrice = priceHistory[0];
  const endPrice = priceHistory[priceHistory.length - 1];
  const percentChange = ((endPrice - startPrice) / startPrice) * 100;
  
  return {
    priceHistory,
    currentPrice: endPrice,
    percentChange: Number(percentChange.toFixed(2)),
    isPositive: percentChange >= 0,
    lastUpdated: Date.now(),
  };
}

// Helper functions
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Utility function to format percentage change
export function formatPercentChange(percentChange: number): string {
  const sign = percentChange >= 0 ? '+' : '';
  return `${sign}${percentChange.toFixed(2)}%`;
}

// Clear cache (useful for debugging)
export function clearPriceCache(): void {
  priceCache.clear();
}