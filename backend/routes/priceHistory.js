const express = require('express');
const fetch = require('node-fetch');
const yahooFinance = require('yahoo-finance2').default;
const router = express.Router();

// Replace with your real API key or use env variable

const CMC_API_KEY = process.env.CMC_API_KEY || '77240ad2-582c-4575-91bd-901e98d1eb84';

// Only allow these symbols for price history (crypto, stocks, ETFs, fiat)
const SUPPORTED_SYMBOLS = [
  'AAPL', 'NVDA', 'TSLA', 'SPY', 'COIN', // stocks/ETF
  'BTC', 'ETH', 'SOL', 'USDC', 'USDT', 'DOGE', 'ADA', 'BNB', 'MATIC', 'XRP', // crypto
  'USD', 'EUR', 'USDY' // fiat and yield
];


router.get('/price-history', async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: 'Missing symbol' });

  // Normalize and check symbol
  const upperSymbol = String(symbol).toUpperCase();

  // Map symbols to Yahoo Finance tickers
  const yahooSymbolMap = {
    // Stocks/ETF
    AAPL: 'AAPL',
    NVDA: 'NVDA',
    TSLA: 'TSLA',
    SPY: 'SPY',
    COIN: 'COIN',
    // Crypto
    BTC: 'BTC-USD',
    ETH: 'ETH-USD',
    SOL: 'SOL-USD',
    USDC: 'USDC-USD',
    USDT: 'USDT-USD',
    DOGE: 'DOGE-USD',
    ADA: 'ADA-USD',
    BNB: 'BNB-USD',
    MATIC: 'MATIC-USD',
    XRP: 'XRP-USD',
    SUI: 'SUI-USD', 
    // Fiat (Yahoo uses currency pairs)
    // USD: 'USD=X', // USD=X is not a real ticker, so omit or handle gracefully
    EUR: 'EURUSD=X', // EUR to USD
    // US Dollar Yield (USDY): If this is a real ETF, use its ticker, otherwise handle gracefully
    // USDY: 'USDY', // If not found, will error
  };
  const ticker = yahooSymbolMap[upperSymbol];
  if (!ticker) {
    return res.status(400).json({ error: 'Price chart not available' });
  }

  try {
    // Fetch 7 days of daily close prices from Yahoo Finance
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 7);
    const result = await yahooFinance.historical(ticker, {
      period1: from,
      period2: today,
      interval: '1d',
    });
    if (!result || !Array.isArray(result) || result.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }
    // Return closing prices for each day (oldest to newest)
    const closingPrices = result.map(day => day.close).filter(Boolean);
    res.json({ prices: closingPrices });
  } catch (e) {
    console.error('Yahoo Finance fetch error', e);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

module.exports = router;
