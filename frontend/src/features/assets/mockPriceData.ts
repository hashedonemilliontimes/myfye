export interface AssetPriceData {
  priceHistory: number[];
  currentPrice: number;
  percentChange: number;
  isPositive: boolean;
}

/**
 * Generates mock price data for an asset based on its ID
 * This simulates realistic price movements with some randomness
 */
export function generateMockPriceData(assetId: string, days: number = 30): AssetPriceData {
  // Use asset ID as seed for consistent data per asset
  const seed = hashString(assetId);
  
  // Generate base price based on asset type
  const basePrice = getBasePriceForAsset(assetId);
  
  // Generate price history
  const priceHistory: number[] = [];
  let currentPrice = basePrice;
  
  // Generate realistic price movements
  for (let i = 0; i < days; i++) {
    // Add some randomness but keep it realistic (-5% to +5% daily change max)
    const randomFactor = (seededRandom(seed + i) - 0.5) * 0.1; // -0.05 to +0.05
    const trendFactor = Math.sin((i / days) * Math.PI * 2) * 0.02; // Subtle trend
    
    currentPrice = currentPrice * (1 + randomFactor + trendFactor);
    priceHistory.push(Number(currentPrice.toFixed(2)));
  }
  
  // Calculate percentage change
  const startPrice = priceHistory[0];
  const endPrice = priceHistory[priceHistory.length - 1];
  const percentChange = ((endPrice - startPrice) / startPrice) * 100;
  
  return {
    priceHistory,
    currentPrice: endPrice,
    percentChange: Number(percentChange.toFixed(2)),
    isPositive: percentChange >= 0,
  };
}

/**
 * Simple hash function to convert string to number (for seeding)
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Seeded random number generator
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Get base price for different asset types
 */
function getBasePriceForAsset(assetId: string): number {
  // Simulate different price ranges for different asset types
  if (assetId.includes('btc') || assetId.includes('bitcoin')) {
    return 45000 + (seededRandom(hashString(assetId)) * 10000);
  } else if (assetId.includes('eth') || assetId.includes('ethereum')) {
    return 2500 + (seededRandom(hashString(assetId)) * 1000);
  } else if (assetId.includes('usdc') || assetId.includes('usdt') || assetId.toLowerCase().includes('usd')) {
    return 1.00 + (seededRandom(hashString(assetId)) * 0.02 - 0.01); // $0.99 - $1.01
  } else if (assetId.includes('stock') || assetId.includes('equity')) {
    return 100 + (seededRandom(hashString(assetId)) * 400); // $100 - $500
  } else {
    // Default for other assets
    return 10 + (seededRandom(hashString(assetId)) * 90); // $10 - $100
  }
}

/**
 * Get color based on performance
 */
export function getPriceChangeColor(percentChange: number): string {
  if (percentChange > 0) {
    return '#22c55e'; // green
  } else if (percentChange < 0) {
    return '#ef4444'; // red
  } else {
    return '#6b7280'; // gray
  }
}

/**
 * Format percentage change for display
 */
export function formatPercentChange(percentChange: number): string {
  const sign = percentChange >= 0 ? '+' : '';
  return `${sign}${percentChange.toFixed(2)}%`;
}