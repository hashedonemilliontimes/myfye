import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { AbstractedAsset, Asset, AssetGroup, AssetsState } from "./types";
import { RootState } from "@/redux/store";
import { getAssetsBalanceUSDByGroup, getAssetsByGroup } from "./utils";

import btcIcon from "@/assets/icons/assets/crypto/Bitcoin.svg";
import solIcon from "@/assets/icons/assets/crypto/Solana.svg";
import usDollarIcon from "@/assets/icons/assets/cash/US Dollar.svg";
import euroIcon from "@/assets/icons/assets/cash/Euro.svg";
import usDollarYieldIcon from "@/assets/icons/assets/earn/US Dollar Yield.svg";
import xrpIcon from "@/assets/icons/assets/crypto/Ripple.svg";
import dogeIcon from "@/assets/icons/assets/crypto/Dogecoin.svg";
import suiIcon from "@/assets/icons/assets/crypto/Sui.svg";
import APPLIcon from "@/assets/icons/assets/stocks/Apple, Inc..svg";
import MSFTIcon from "@/assets/icons/assets/stocks/Microsoft Corporation.svg";
import GOOGLIcon from "@/assets/icons/assets/stocks/Alphabet, Inc..svg";
import NFLXIcon from "@/assets/icons/assets/stocks/Netflix, Inc..svg";
import AMZNIcon from "@/assets/icons/assets/stocks/Amazon.com, Inc..svg";
import SQIcon from "@/assets/icons/assets/stocks/Block, Inc..svg";
import DISIcon from "@/assets/icons/assets/stocks/Walt Disney Company.svg";
import TSLAIcon from "@/assets/icons/assets/stocks/Tesla, Inc..svg";
import AMDIcon from "@/assets/icons/assets/stocks/Advanced Micro Devices.svg";
import MSTRIcon from "@/assets/icons/assets/stocks/MicroStrategy, Inc..svg";
import KOIcon from "@/assets/icons/assets/stocks/The Coca-Cola Company.svg";
import AMCIcon from "@/assets/icons/assets/stocks/AMC Entertainment Holdings, Inc..svg";
import GMEIcon from "@/assets/icons/assets/stocks/Gamestop Corp. Class A, Inc..svg";

const initialState: AssetsState = {
  assetIds: [
    // Stocks
    "APPL.d_base",
    "MSFT.d_base",
    "GOOGL.d_base",
    "NFLX.d_base",
    "AMZN.d_base",
    "SQ.d_base",
    "DIS.d_base",
    "TSLA.d_base",
    "AMD.d_base",
    "SPY.d_base",
    "MSTR.d_base",
    "IAU.d_base",
    "KO.d_base",
    "AMC.d_base",
    "GME.d_base",
    // Crypto
    "btc_sol",
    "sol",
    "xrp_sol",
    "doge_sol",
    "sui_sol",
    // Cash
    "usdt_sol",
    "usdc_sol",
    "usdc_base",
    "eurc_sol",
    // Earn
    "usdy_sol",
  ],
  abstractedAssetIds: [
    // Stocks
    "APPL",
    "MSFT",
    "GOOGL",
    "NFLX",
    "AMZN",
    "SQ",
    "DIS",
    "TSLA",
    "AMD",
    "SPY",
    "MSTR",
    "IAU",
    "KO",
    "AMC",
    "GME",
    // Crypto
    "btc",
    "sol",
    "xrp",
    "doge",
    "sui",
    // Cash
    "us_dollar",
    "euro",
    // Earn
    "us_dollar_yield",
  ],
  groupIds: ["stocks", "earn", "cash", "crypto"],
  dashboardIds: ["stocks", "cash", "crypto"],
  assets: {
    // Stocks
    "APPL.d_base": {
      id: "APPL.d_base",
      label: "Apple, Inc.",
      symbol: "APPL",
      fiatCurrency: "usd",
      abstractedAssetId: "stock",
      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: APPLIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "MSFT.d_base": {
      id: "MSFT.d_base",
      label: "Microsoft Corporation",
      symbol: "MSFT",

      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
      abstractedAssetId: "stock",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: MSFTIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "GOOGL.d_base": {
      id: "GOOGL.d_base",
      label: "Alphabet, inc.",
      symbol: "GOOGL",
      abstractedAssetId: "stock",
      fiatCurrency: "usd",
      groupId: "stocks",

      dashboardId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: GOOGLIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "NFLX.d_base": {
      id: "NFLX.d_base",
      label: "Netflix, Inc.",
      symbol: "NFLX",
      abstractedAssetId: "stock",
      fiatCurrency: "usd",
      groupId: "stocks",

      dashboardId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: NFLXIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "AMZN.d_base": {
      id: "AMZN.d_base",
      label: "Amazon.com, Inc.",
      symbol: "AMZN",
      abstractedAssetId: "stock",
      fiatCurrency: "usd",

      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: AMZNIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "SQ.d_base": {
      id: "SQ.d_base",
      label: "Block, Inc.",
      symbol: "SQ",
      abstractedAssetId: "stock",
      fiatCurrency: "usd",
      groupId: "stocks",

      dashboardId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: SQIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "DIS.d_base": {
      id: "DIS.d_base",
      label: "Walt Disney Company",
      symbol: "DIS",
      abstractedAssetId: "stock",
      fiatCurrency: "usd",

      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: DISIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "TSLA.d_base": {
      id: "TSLA.d_base",
      label: "Tesla, Inc.",
      symbol: "TSLA",
      abstractedAssetId: "stock",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: TSLAIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "AMD.d_base": {
      id: "AMD.d_base",
      label: "Advanced Micro Devices",
      symbol: "AMD",
      abstractedAssetId: "stock",
      fiatCurrency: "usd",
      groupId: "stocks",

      dashboardId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: AMDIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "SPY.d_base": {
      id: "SPY.d_base",
      label: "SPDR S&P 500 ETF Trust",
      symbol: "SPY",
      abstractedAssetId: "stock",
      fiatCurrency: "usd",
      groupId: "stocks",

      dashboardId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: "SPY",
        type: "text",
        color: "#fff",
        backgroundColor: "#273f33",
      },
      overlay: {
        isOpen: false,
      },
    },
    "MSTR.d_base": {
      id: "MSTR.d_base",
      label: "MicroStrategy, Inc.",
      symbol: "MSTR",
      abstractedAssetId: "stock",
      fiatCurrency: "usd",

      dashboardId: "stocks",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: MSTRIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "IAU.d_base": {
      id: "IAU.d_base",
      label: "iShares Gold Trust",
      symbol: "IAU",
      abstractedAssetId: "stock",
      fiatCurrency: "usd",
      groupId: "stocks",

      dashboardId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: "IAU",
        type: "text",
        color: "#fff",
        backgroundColor: "#dc7e00",
      },
      overlay: {
        isOpen: false,
      },
    },
    "KO.d_base": {
      id: "KO.d_base",
      label: "Coca-Cola Company",
      symbol: "KO",
      abstractedAssetId: "stock",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: KOIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "AMC.d_base": {
      id: "AMC.d_base",
      label: "AMC Entertainment Holdings, Inc.",
      symbol: "AMC",
      abstractedAssetId: "stock",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: AMCIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    "GME.d_base": {
      id: "GME.d_base",
      label: "GameStop Corp. Class A, Inc.",
      symbol: "GME",
      abstractedAssetId: "stock",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: GMEIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    // Crypto
    btc_sol: {
      id: "btc_sol",
      label: "Bitcoin",
      abstractedAssetId: "btc",
      symbol: "CBBTC",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: btcIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    sol: {
      id: "sol",
      label: "Solana",
      abstractedAssetId: "sol",
      symbol: "SOL",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: solIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    xrp_sol: {
      id: "xrp_sol",
      label: "Ripple",
      abstractedAssetId: "xrp",
      symbol: "XRP",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: xrpIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    doge_sol: {
      id: "doge_sol",
      label: "Dogecoin",
      abstractedAssetId: "doge",
      symbol: "DOGE",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: dogeIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    sui_sol: {
      id: "sui_sol",
      label: "Sui",
      abstractedAssetId: "sui",
      symbol: "SUI",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: suiIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    // Cash
    usdt_sol: {
      id: "usdt_sol",
      label: "US Dollar",
      abstractedAssetId: "us_dollar",
      symbol: "USDT",
      dashboardId: "cash",
      fiatCurrency: "usd",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 1,
      icon: {
        content: usDollarIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    usdc_sol: {
      id: "usdc_sol",
      label: "US Dollar",
      abstractedAssetId: "us_dollar",
      symbol: "USDC",
      dashboardId: "cash",
      fiatCurrency: "usd",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 1,
      icon: {
        content: usDollarIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    usdc_base: {
      id: "usdc_base",
      label: "US Dollar",
      abstractedAssetId: "us_dollar",
      symbol: "USDC",
      dashboardId: "cash",
      fiatCurrency: "usd",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 1,
      icon: {
        content: usDollarIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    eurc_sol: {
      id: "eurc_sol",
      label: "Euro",
      abstractedAssetId: "euro",
      symbol: "EURC",
      dashboardId: "cash",
      fiatCurrency: "eur",
      groupId: "cash",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: euroIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    // Earn
    usdy_sol: {
      id: "usdy_sol",
      label: "US Dollar Yield",
      abstractedAssetId: "us_dollar_yield",
      symbol: "USDY",
      dashboardId: "cash",
      fiatCurrency: "usd",
      groupId: "earn",
      balance: 0,
      exchangeRateUSD: 0,
      icon: {
        content: usDollarYieldIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
  },
  groups: {
    stocks: {
      id: "stocks",
      label: "Stocks",
      percentChange: 0,
      overlay: { isOpen: false },
    },
    cash: {
      id: "cash",
      label: "Cash",
      percentChange: 0,
      overlay: { isOpen: false },
    },
    crypto: {
      id: "crypto",
      label: "Crypto",
      percentChange: 0,
      overlay: { isOpen: false },
    },
    earn: {
      id: "earn",
      label: "Earn",
      percentChange: 0,
      overlay: { isOpen: false },
    },
  },
  abstractedAssets: {
    // Stocks
    APPL: {
      id: "APPL",
      assetIds: ["APPL.d_base"],
      label: "Apple, Inc.",
      symbol: "APPL",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      dashboardId: "stocks",
      groupId: "stocks",
      icon: {
        content: APPLIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    MSFT: {
      id: "MSFT",
      assetIds: ["MSFT.d_base"],
      label: "Microsoft Corporation",
      symbol: "MSFT",
      color: "var(--clr-surface-lowered)",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
      icon: {
        content: MSFTIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    GOOGL: {
      id: "GOOGL",
      assetIds: ["GOOGL.d_base"],
      label: "Alphabet, inc.",
      symbol: "GOOGL",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: GOOGLIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    NFLX: {
      id: "NFLX",
      assetIds: ["NFLX.d_base"],
      label: "Netflix, Inc.",
      symbol: "NFLX",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: NFLXIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    AMZN: {
      id: "AMZN",
      assetIds: ["AMZN.d_base"],
      label: "Amazon.com, Inc.",
      symbol: "AMZN",
      fiatCurrency: "usd",
      color: "var(--clr-surface-lowered)",

      dashboardId: "stocks",
      groupId: "stocks",
      icon: {
        content: AMZNIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    SQ: {
      id: "SQ",
      assetIds: ["SQ.d_base"],
      label: "Block, Inc.",
      color: "var(--clr-surface-lowered)",
      symbol: "SQ",
      fiatCurrency: "usd",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: SQIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    DIS: {
      id: "DIS",
      assetIds: ["DIS.d_base"],
      label: "Walt Disney Company",
      symbol: "DIS",
      fiatCurrency: "usd",

      dashboardId: "stocks",
      groupId: "stocks",
      color: "var(--clr-surface-lowered)",
      icon: {
        content: DISIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    TSLA: {
      id: "TSLA",
      assetIds: ["TSLA.d_base"],
      label: "Tesla, Inc.",
      symbol: "TSLA",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      color: "var(--clr-surface-lowered)",
      groupId: "stocks",
      icon: {
        content: TSLAIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    AMD: {
      id: "AMD",
      assetIds: ["AMD.d_base"],
      label: "Advanced Micro Devices",
      symbol: "AMD",
      fiatCurrency: "usd",
      color: "var(--clr-surface-lowered)",
      groupId: "stocks",

      dashboardId: "stocks",
      icon: {
        content: AMDIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    SPY: {
      id: "SPY",
      assetIds: ["SPY.d_base"],
      label: "SPDR S&P 500 ETF Trust",
      symbol: "SPY",
      fiatCurrency: "usd",
      groupId: "stocks",

      color: "var(--clr-surface-lowered)",
      dashboardId: "stocks",
      icon: {
        content: "SPY",
        type: "text",
        color: "#fff",
        backgroundColor: "#273f33",
      },
      overlay: {
        isOpen: false,
      },
    },
    MSTR: {
      id: "MSTR",
      assetIds: ["MSTR.d_base"],
      label: "MicroStrategy, Inc.",
      symbol: "MSTR",
      color: "var(--clr-surface-lowered)",
      fiatCurrency: "usd",

      dashboardId: "stocks",
      groupId: "stocks",
      icon: {
        content: MSTRIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    IAU: {
      id: "IAU",
      label: "iShares Gold Trust",
      symbol: "IAU",
      fiatCurrency: "usd",
      color: "var(--clr-surface-lowered)",
      groupId: "stocks",
      assetIds: ["IAU.d_base"],
      dashboardId: "stocks",
      icon: {
        content: "IAU",
        type: "text",
        color: "#fff",
        backgroundColor: "#dc7e00",
      },
      overlay: {
        isOpen: false,
      },
    },
    KO: {
      id: "KO",
      assetIds: ["KO.d_base"],
      label: "Coca-Cola Company",
      symbol: "KO",
      fiatCurrency: "usd",
      color: "var(--clr-surface-lowered)",
      groupId: "stocks",
      dashboardId: "stocks",
      icon: {
        content: KOIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    AMC: {
      id: "AMC",
      assetIds: ["AMC.d_base"],
      label: "AMC Entertainment Holdings, Inc.",
      symbol: "AMC",
      fiatCurrency: "usd",
      groupId: "stocks",
      color: "var(--clr-surface-lowered)",
      dashboardId: "stocks",
      icon: {
        content: AMCIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    GME: {
      id: "GME",
      assetIds: ["GME.d_base"],
      label: "GameStop Corp. Class A, Inc.",
      symbol: "GME",
      dashboardId: "stocks",
      fiatCurrency: "usd",
      groupId: "stocks",
      color: "var(--clr-surface-lowered)",
      icon: {
        content: GMEIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    us_dollar: {
      id: "us_dollar",
      label: "US Dollar",
      symbol: "USD",
      dashboardId: "cash",
      fiatCurrency: "usd",
      groupId: "cash",
      color: "var(--clr-green-400)",
      assetIds: ["usdc_sol", "usdt_sol", "usdc_base"],
      icon: {
        content: usDollarIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    us_dollar_yield: {
      id: "us_dollar_yield",
      label: "US Dollar Yield",
      assetIds: ["usdy_sol"],
      symbol: "USD",
      dashboardId: "cash",
      fiatCurrency: "usd",
      groupId: "earn",
      color: "var(--clr-purple-400)",
      icon: {
        content: usDollarYieldIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    euro: {
      id: "euro",
      label: "Euro",
      assetIds: ["eurc_sol"],
      symbol: "EUR",
      dashboardId: "cash",
      fiatCurrency: "eur",
      groupId: "cash",
      color: "var(--clr-blue-400)",
      icon: {
        content: euroIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    sol: {
      id: "sol",
      label: "Solana",
      assetIds: ["sol"],
      symbol: "SOL",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      color: "var(--clr-purple-400)",
      icon: {
        content: solIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    btc: {
      id: "btc",
      label: "Bitcoin",
      assetIds: ["btc_sol"],
      symbol: "BTC",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      color: "orange",
      icon: {
        content: btcIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    xrp: {
      id: "xrp",
      label: "Ripple",
      assetIds: ["xrp_sol"],
      symbol: "XRP",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      color: "var(--clr-surface-lowered)",
      icon: {
        content: xrpIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    doge: {
      id: "doge",
      label: "Dogecoin",
      assetIds: ["doge_sol"],
      symbol: "DOGE",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      color: "var(--clr-surface-lowered)",
      icon: {
        content: dogeIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
    sui: {
      id: "sui",
      label: "Sui",
      assetIds: ["sui_sol"],
      symbol: "SUI",
      dashboardId: "crypto",
      fiatCurrency: "usd",
      groupId: "crypto",
      color: "var(--clr-surface-lowered)",
      icon: {
        content: suiIcon,
        type: "svg",
      },
      overlay: {
        isOpen: false,
      },
    },
  },
};

export const selectAsset = (state: RootState, asset: string) =>
  state.assets.assets[asset];
export const selectAbstractedAsset = (
  state: RootState,
  abstractedAssetId: AbstractedAsset["id"]
) => state.assets.abstractedAssets[abstractedAssetId];
export const selectAssets = (state: RootState) => state.assets;
export const selectAssetGroupId = (_: RootState, groupId: AssetGroup["id"]) =>
  groupId;
export const selectAssetDashboardId = (
  _: RootState,
  dashboardId: Asset["dashboardId"]
) => dashboardId;
export const selectAbstractedAssetId = (
  _: RootState,
  abstractedAssetId: Asset["abstractedAssetId"]
) => abstractedAssetId;

export const selectAssetsArray = createSelector([selectAssets], (assets) =>
  assets.assetIds.map((assetId) => assets.assets[assetId])
);

export const selectAssetsGroupsArray = createSelector(
  [selectAssets],
  (assets) => assets.groupIds.map((groupId) => assets.groups[groupId])
);

export const selectAssetsByGroup = createSelector(
  [selectAssets, selectAssetGroupId],
  (assets, groupId) => getAssetsByGroup(assets, groupId)
);
export const selectAssetsBalanceUSDByGroup = createSelector(
  [selectAssets, selectAssetGroupId],
  (assets, groupId) => getAssetsBalanceUSDByGroup(assets, groupId)
);

export const selectAssetsByDashboardId = createSelector(
  [selectAssets, selectAssetDashboardId],
  (assets, dashboardId) => {
    const assetsArr = assets.assetIds.map((assetId) => assets.assets[assetId]);
    const labelledAssets = assetsArr.filter(
      (asset) => asset.dashboardId === dashboardId
    );
    return labelledAssets;
  }
);
export const selectAssetsBalanceUSDByDashboardId = createSelector(
  [selectAssets, selectAssetDashboardId],
  (assets, dashboardId) => {
    const assetsArr = assets.assetIds.map((assetId) => assets.assets[assetId]);
    const labelledAssets = assetsArr.filter(
      (asset) => asset.dashboardId === dashboardId
    );
    return labelledAssets.reduce(
      (acc, val) => acc + val.balance * val.exchangeRateUSD,
      0
    );
  }
);

export const selectAssetsBalanceUSD = createSelector(
  [selectAssets],
  (assets) => {
    const allAssets = assets.assetIds.map((assetId) => assets.assets[assetId]);
    return allAssets.reduce(
      (acc, val) => acc + val.balance * val.exchangeRateUSD,
      0
    );
  }
);

export const selectAbstractedAssetsWithBalance = createSelector(
  [selectAssets],
  (assets) => {
    // find assets
    const abstractedAssetsArr = assets.abstractedAssetIds.map((id) => {
      return assets.abstractedAssets[id];
    });
    return abstractedAssetsArr.map((abstractedAsset) => {
      // get assets
      const filteredAssets = abstractedAsset.assetIds.map(
        (id) => assets.assets[id]
      );
      const balance = filteredAssets.reduce((acc, val) => acc + val.balance, 0);
      let balanceUSD = filteredAssets.reduce(
        (acc, val) => acc + val.balance * val.exchangeRateUSD,
        0
      );
      balanceUSD = Math.floor(balanceUSD * 100) / 100;
      return { ...abstractedAsset, balance, balanceUSD };
    });
  }
);

export const selectAbstractedAssetsBalanceUSD = createSelector(
  [selectAssets],
  (assets) => {
    // find assets
    const abstractedAssetsArr = assets.abstractedAssetIds.map((id) => {
      return assets.abstractedAssets[id];
    });
    const balanceArr = abstractedAssetsArr.map((abstractedAsset) => {
      // get assets
      const mappedAssets = abstractedAsset.assetIds.map(
        (id) => assets.assets[id]
      );
      const balance = mappedAssets.reduce(
        (acc, val) => acc + val.balance * val.exchangeRateUSD,
        0
      );
      return Math.floor(balance * 100) / 100;
    });
    return balanceArr.reduce((acc, val) => acc + val, 0);
  }
);

export const selectAbstractedAssetWithBalance = createSelector(
  [selectAbstractedAssetsWithBalance, selectAbstractedAssetId],
  (abstractedAssetsWithBalance, abstractedAssetId) => {
    // find assets
    const [result] = abstractedAssetsWithBalance.filter(
      (asset) => asset.id === abstractedAssetId
    );
    return result;
  }
);

export const selectAbstractedAssetBalanceUSD = createSelector(
  [selectAssets, selectAbstractedAssetId],
  (assets, assetId) => {
    // find assets
    const abstractedAsset = assets.abstractedAssets[assetId];
    // get assets
    const mappedAssets = abstractedAsset.assetIds.map(
      (id) => assets.assets[id]
    );

    const balance = mappedAssets.reduce(
      (acc, val) => acc + val.balance * val.exchangeRateUSD,
      0
    );
    return Math.floor(balance * 100) / 100;
  }
);

export const selectAbstractedAssetsWithBalanceByGroup = createSelector(
  [selectAbstractedAssetsWithBalance, selectAssetGroupId],
  (abstractedAssetsWithBalance, groupId) => {
    // find assets
    return abstractedAssetsWithBalance.filter(
      (asset) => asset.groupId === groupId
    );
  }
);

export const selectAbstractedAssetsWithBalanceByDashboard = createSelector(
  [selectAbstractedAssetsWithBalance, selectAssetDashboardId],
  (abstractedAssetsWithBalance, dashboardId) => {
    // find assets
    return abstractedAssetsWithBalance.filter(
      (asset) => asset.dashboardId === dashboardId
    );
  }
);

export const selectAssetBalanceUSD = createSelector(
  [selectAsset],
  (asset) => Math.floor(asset.balance * asset.exchangeRateUSD * 100) / 100
);

export const assetsSlice = createSlice({
  name: "assets",
  initialState: initialState,
  reducers: {
    toggleAssetOverlay: (
      state,
      action: PayloadAction<{ assetId: Asset["id"]; isOpen: boolean }>
    ) => {
      state.assets[action.payload.assetId].overlay.isOpen =
        action.payload.isOpen;
    },
    toggleGroupOverlay: (
      state,
      action: PayloadAction<{ groupId: AssetGroup["id"]; isOpen: boolean }>
    ) => {
      state.groups[action.payload.groupId].overlay.isOpen =
        action.payload.isOpen;
    },
    updateBalance: (
      state,
      action: PayloadAction<{ assetId: Asset["id"]; balance: number }>
    ) => {
      state.assets[action.payload.assetId].balance = action.payload.balance;
    },
    updateExchangeRateUSD: (
      state,
      action: PayloadAction<{ assetId: Asset["id"]; exchangeRateUSD: number }>
    ) => {
      state.assets[action.payload.assetId].exchangeRateUSD =
        action.payload.exchangeRateUSD;
    },
  },
});

export const {
  toggleAssetOverlay,
  toggleGroupOverlay,
  updateBalance,
  updateExchangeRateUSD,
} = assetsSlice.actions;

export default assetsSlice.reducer;
