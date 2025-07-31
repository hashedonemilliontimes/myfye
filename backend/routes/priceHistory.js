const express = require('express');
const router = express.Router();

// Environment variables for API keys
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

// Cache for API responses (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const priceCache = new Map();

// Asset type detection
function getAssetType(assetId) {
  const cryptoPatterns = ['btc', 'bitcoin', 'eth', 'ethereum', 'usdc', 'usdt', 'sol', 'solana', 'doge', 'dogecoin', 'ada', 'cardano', 'dot', 'polkadot', 'link', 'chainlink', 'crypto'];
  const stockPatterns = ['stock', 'equity', 'aapl', 'googl', 'msft', 'tsla', 'amzn', 'nvda', 'meta'];
  
  const lowerAssetId = assetId.toLowerCase();
  
  if (cryptoPatterns.some(pattern => lowerAssetId.includes(pattern))) {
    return 'crypto';
  }
  
  if (stockPatterns.some(pattern => lowerAssetId.includes(pattern))) {
    return 'stock';
  }
  
  return 'crypto'; // Default to crypto
}

// Map asset IDs to API-compatible symbols
function mapAssetToSymbol(assetId, assetType) {
  const lowerAssetId = assetId.toLowerCase();
  
  if (assetType === 'crypto') {
    const cryptoMapping = {
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
    const stockMapping = {
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

// Fetch crypto data from CoinGecko
async function fetchCryptoData(coinId) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=hourly`
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.prices || data.prices.length === 0) {
      throw new Error('No price data available');
    }
    
    // Extract prices from the last 30 data points for chart
    const prices = data.prices.slice(-30).map(([_, price]) => price);
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

// Fetch stock data from Alpha Vantage
async function fetchStockData(symbol) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}&outputsize=compact`
    );
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
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

// Generate fallback data
function generateFallbackData(assetId) {
  // Simple hash function for seeding
  let hash = 0;
  for (let i = 0; i < assetId.length; i++) {
    const char = assetId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const seed = Math.abs(hash);
  
  const assetType = getAssetType(assetId);
  
  // Generate base price
  let basePrice;
  if (assetType === 'crypto') {
    if (assetId.toLowerCase().includes('btc')) {
      basePrice = 45000 + (Math.sin(seed) * 15000);
    } else if (assetId.toLowerCase().includes('eth')) {
      basePrice = 2800 + (Math.sin(seed) * 1200);
    } else {
      basePrice = 50 + (Math.sin(seed) * 200);
    }
  } else {
    basePrice = 100 + (Math.sin(seed) * 300);
  }
  
  // Generate price history
  const priceHistory = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < 30; i++) {
    const volatility = assetType === 'crypto' ? 0.08 : 0.04;
    const randomFactor = (Math.sin(seed + i) - 0.5) * volatility;
    const trendFactor = Math.sin((i / 30) * Math.PI * 2) * 0.01;
    
    currentPrice = currentPrice * (1 + randomFactor + trendFactor);
    priceHistory.push(Number(currentPrice.toFixed(2)));
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

// Main endpoint
router.get('/price-data/:assetId', async (req, res) => {
  try {
    const { assetId } = req.params;
    
    if (!assetId) {
      return res.status(400).json({ error: 'Asset ID is required' });
    }
    
    // Check cache first
    const cached = priceCache.get(assetId);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return res.json(cached.data);
    }
    
    const assetType = getAssetType(assetId);
    const symbol = mapAssetToSymbol(assetId, assetType);
    
    let priceData;
    
    try {
      if (assetType === 'crypto') {
        priceData = await fetchCryptoData(symbol);
      } else {
        priceData = await fetchStockData(symbol);
      }
    } catch (apiError) {
      console.log(`API failed for ${assetId}, using fallback data:`, apiError.message);
      priceData = generateFallbackData(assetId);
    }
    
    // Cache the result
    priceCache.set(assetId, {
      data: priceData,
      timestamp: Date.now(),
    });
    
    res.json(priceData);
  } catch (error) {
    console.error('Price data endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;