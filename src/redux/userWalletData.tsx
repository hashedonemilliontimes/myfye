import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import crypto from '../helpers/cryptoDataType';  // Assuming cryptoDataType exports a type named CryptoType

interface UserWalletDataState {
  isConnected: boolean;
  type: string;
  pubKey: string;
  cryptoList: crypto[];  // Replacing addressBalances with cryptoList
  principalInvested: number;
  principalInvestedHistory: Record<string, number>;
  initialPrincipal: number,
  initialInvestmentDate: number,
  totalInvestingValue: number,
}

const initialUserWalletData: UserWalletDataState = {
  isConnected: false,
  type: '',
  pubKey: '',
  cryptoList: [],  // Initial empty list
  principalInvested: 0,
  principalInvestedHistory: {},
  initialPrincipal: 0,
  initialInvestmentDate: 0,
  totalInvestingValue: 0,
};


export const userWalletDataSlice = createSlice({
  name: 'userWalletData',
  initialState: initialUserWalletData,
  reducers: {
    setWalletConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setWalletType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setWalletPubKey: (state, action: PayloadAction<string>) => {
      state.pubKey = action.payload;
    },
    // New reducer to set a single crypto object
    setCrypto: (state, action: PayloadAction<crypto[]>) => {
      state.cryptoList.push(...action.payload);  // Add the new crypto objects to cryptoList
    },
    // New reducer to set all crypto objects
    setAllCryptos: (state, action: PayloadAction<crypto[]>) => {
      state.cryptoList = action.payload;
    },
    updateUSDCBalance: (state, action: PayloadAction<number>) => {
      state.cryptoList[0].balanceUSD = action.payload;
      state.cryptoList[0].balanceNative = action.payload;
    },
    setPrincipalInvested: (state, action: PayloadAction<number>) => {
      state.principalInvested = action.payload;
    },
    setPrincipalInvestedHistory: (state, action: PayloadAction<Record<number, number>>) => {
      state.principalInvestedHistory = action.payload;
    },
    mergePrincipalInvestedHistory: (state, action: PayloadAction<Record<number, number>>) => {
      state.principalInvestedHistory = {
        ...state.principalInvestedHistory,
        ...action.payload
      };
    },
    setinitialPrincipal: (state, action: PayloadAction<number>) => {
      state.initialPrincipal = action.payload;
    },
    setinitialInvestmentDate: (state, action: PayloadAction<number>) => {
      state.initialInvestmentDate = action.payload;
    },
    settotalInvestingValue: (state, action: PayloadAction<number>) => {
      state.totalInvestingValue = action.payload;
    },
  },
});

export const { setCrypto, setAllCryptos, setWalletConnected, 
  setWalletType, setWalletPubKey, updateUSDCBalance, 
  setPrincipalInvested, setPrincipalInvestedHistory, 
  setinitialPrincipal, setinitialInvestmentDate, 
  settotalInvestingValue, mergePrincipalInvestedHistory} = userWalletDataSlice.actions;

export default userWalletDataSlice.reducer;


