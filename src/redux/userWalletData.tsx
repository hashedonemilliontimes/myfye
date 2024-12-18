import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import crypto from '../helpers/cryptoDataType';  // Assuming cryptoDataType exports a type named CryptoType
import wallet from '../helpers/walletDataType';
import User from '../helpers/User';

interface UserWalletDataState {
  currentUserID: string;
  currentUserFirstName: string;
  currentUserLastName: string;
  currentUserEmail: string;
  isConnected: boolean;
  type: string;
  pubKey: string;
  cryptoList: crypto[];  // Replacing addressBalances with cryptoList
  principalInvested: number;
  principalInvestedHistory: Record<string, number>;
  initialPrincipal: number,
  initialInvestmentDate: number,
  totalInvestingValue: number,
  usdcSolBalance: number,
  usdtSolBalance: number,
  pyusdSolBalance: number,
  eurcSolBalance: number,
  busdSolBalance: number,
  usdySolBalance: number,
  btcSolBalance: number,
  usdcEthBalance: number,
  usdtEthBalance: number,
  busdEthBalance: number,
  connectedWallets: wallet[],
  currentUserKYCVerified: boolean,
  earnWithdrawTransactionStatus: string,
  earnDepositTransactionStatus: string,
  walletSwapTransactionStatus: string,
  updatingBalance: boolean,
  hotBalanceUSDY: number,
  shouldShowBottomNav: boolean,
  showPayPage: boolean,
  showContactsPage: boolean,
  showSendPage: boolean,
  showWithdrawStablecoinPage: boolean,
  showDepositStablecoinPage: boolean,
  showBanxaPopUp: boolean,
  showEarnPage: boolean,
  showCryptoPage: boolean,
  showWalletPage: boolean,
  showWalletDepositPage: boolean,
  showAccountHistory: boolean,
  newUserHasPreviousBalance: boolean,
  showRequestPage: boolean,
  showProfileMenu: boolean,
  showEarnWithdrawPage: boolean,
  showEarnDepositPage: boolean,
  priceOfUSDYinUSDC: number,
  contacts: (User | string)[],
  allUsers: User[],
  selectedContact: User | string,
  recentlyUsedSolanaAddresses: string[],
  showContactPopup: boolean,
  selectedLanguageCode: string,
  depositWithdrawProductType: string;
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
  usdcSolBalance: 0,
  usdtSolBalance: 0,
  pyusdSolBalance: 0,
  eurcSolBalance: 0,
  btcSolBalance: 0,
  usdySolBalance: 0,
  busdSolBalance: 0,
  usdcEthBalance: 0,
  usdtEthBalance: 0,
  busdEthBalance: 0,
  connectedWallets: [],
  currentUserKYCVerified: true, // true for Development, false for Deployment
  currentUserFirstName: '',
  currentUserLastName: '',
  currentUserEmail: '',
  earnWithdrawTransactionStatus: 'string',
  earnDepositTransactionStatus: 'string',
  walletSwapTransactionStatus: 'string',
  updatingBalance: false,
  hotBalanceUSDY: 0,
  shouldShowBottomNav: true,
  showPayPage: false,
  showContactsPage: false,
  showSendPage: false,
  showWithdrawStablecoinPage: false,
  showBanxaPopUp: false,
  showDepositStablecoinPage: false,
  showCryptoPage: false,
  showEarnPage: false,
  showWalletPage: false,
  showWalletDepositPage: false,
  showAccountHistory: false,
  newUserHasPreviousBalance: false,
  showRequestPage: false,
  showProfileMenu: false,
  showEarnWithdrawPage: false,
  showEarnDepositPage: false,
  priceOfUSDYinUSDC: 0,
  contacts: [],
  allUsers: [],
  selectedContact: '',
  recentlyUsedSolanaAddresses: [],
  showContactPopup: false,
  selectedLanguageCode: '',
  currentUserID: '',
  depositWithdrawProductType: 'Earn'
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

    setusdcSolValue: (state, action: PayloadAction<number>) => {
      state.usdcSolBalance = action.payload;
    },
    setusdtSolValue: (state, action: PayloadAction<number>) => {
      state.usdtSolBalance = action.payload;
    },
    setbusdSolValue: (state, action: PayloadAction<number>) => {
      state.busdSolBalance = action.payload;
    },
    setpyusdSolValue: (state, action: PayloadAction<number>) => {
      state.pyusdSolBalance = action.payload;
    },
    seteurcSolValue: (state, action: PayloadAction<number>) => {
      state.eurcSolBalance = action.payload;
    },
    setbtcSolValue: (state, action: PayloadAction<number>) => {
      state.btcSolBalance = action.payload;
    },
    setusdySolValue: (state, action: PayloadAction<number>) => {
      state.usdySolBalance = action.payload;
    },
    setusdcEthValue: (state, action: PayloadAction<number>) => {
      state.usdcEthBalance = action.payload;
    },
    setusdtEthValue: (state, action: PayloadAction<number>) => {
      state.usdtEthBalance = action.payload;
    },
    setbusdEthValue: (state, action: PayloadAction<number>) => {
      state.busdEthBalance = action.payload;
    },

    addConnectedWallets: (state, action: PayloadAction<wallet>) => {
      state.connectedWallets = [...state.connectedWallets, action.payload];
    },

    setCurrentUserKYCVerified: (state, action: PayloadAction<boolean>) => {
      state.currentUserKYCVerified = action.payload;
    },

    setcurrentUserID: (state, action: PayloadAction<string>) => {
      state.currentUserID = action.payload;
    },
  setcurrentUserFirstName: (state, action: PayloadAction<string>) => {
    state.currentUserFirstName = action.payload;
  },

  setcurrentUserLastName: (state, action: PayloadAction<string>) => {
    state.currentUserLastName = action.payload;
  },

  setcurrentUserEmail: (state, action: PayloadAction<string>) => {
    state.currentUserEmail = action.payload;
  },
  setEarnWithdrawTransactionStatus: (state, action: PayloadAction<string>) => {
    state.earnWithdrawTransactionStatus = action.payload;
  },
  setEarnDepositTransactionStatus: (state, action: PayloadAction<string>) => {
    state.earnDepositTransactionStatus = action.payload;
  },
  setWalletSwapTransactionStatus: (state, action: PayloadAction<string>) => {
    state.walletSwapTransactionStatus = action.payload;
  },
  setUpdatingBalance: (state, action: PayloadAction<boolean>) => {
    state.updatingBalance = action.payload;
  },
  setHotBalanceUSDY: (state, action: PayloadAction<number>) => {
    state.hotBalanceUSDY = action.payload;
  },
  setShouldShowBottomNav: (state, action: PayloadAction<boolean>) => {
    state.shouldShowBottomNav = action.payload;
  },
  setShowPayPage: (state, action: PayloadAction<boolean>) => {
    state.showPayPage = action.payload;
  },
  setShowContactsPage: (state, action: PayloadAction<boolean>) => {
    state.showContactsPage = action.payload;
  },
  setShowSendPage: (state, action: PayloadAction<boolean>) => {
    state.showSendPage = action.payload;
  },
  setShowRequestPage: (state, action: PayloadAction<boolean>) => {
    state.showRequestPage = action.payload;
  },
  setShowWithdrawStablecoinPage: (state, action: PayloadAction<boolean>) => {
    state.showWithdrawStablecoinPage = action.payload;
  },
  setShowBanxaPopUp: (state, action: PayloadAction<boolean>) => {
    state.showBanxaPopUp = action.payload;
  },
  setShowDepositStablecoinPage: (state, action: PayloadAction<boolean>) => {
    state.showDepositStablecoinPage= action.payload;
  },
  setShowEarnPage: (state, action: PayloadAction<boolean>) => {
    state.showEarnPage = action.payload;
  },
  setShowCryptoPage: (state, action: PayloadAction<boolean>) => {
    state.showCryptoPage = action.payload;
  },
  setShowWalletPage: (state, action: PayloadAction<boolean>) => {
    state.showWalletPage = action.payload;
  },
  setShowWalletDepositPage: (state, action: PayloadAction<boolean>) => {
    state.showWalletDepositPage = action.payload;
  },
  setShowAccountHistory: (state, action: PayloadAction<boolean>) => {
    state.showAccountHistory= action.payload;
  },
  setNewUserHasPreviousBalance: (state, action: PayloadAction<boolean>) => {
    state.newUserHasPreviousBalance = action.payload;
  },
  setShowProfileMenu: (state, action: PayloadAction<boolean>) => {
    state.showProfileMenu = action.payload;
  },
  setShowEarnWithdrawPage: (state, action: PayloadAction<boolean>) => {
    state.showEarnWithdrawPage = action.payload;
  },
  setShowEarnDepositPage: (state, action: PayloadAction<boolean>) => {
    state.showEarnDepositPage = action.payload;
  },
  setPriceOfUSDYinUSDC: (state, action: PayloadAction<number>) => {
    state.priceOfUSDYinUSDC = action.payload;
  },
  setContacts: (state, action: PayloadAction<(User | string)[]>) => {
    // Merge new contacts with existing contacts
    state.contacts = [...state.contacts, ...action.payload];
  },
  clearContacts: (state) => {
    // Clear all contacts
    state.contacts = [];
  },
  setSelectedContact: (state, action: PayloadAction<User | string>) => {
    state.selectedContact = action.payload;
  },
  setAllUsers: (state, action: PayloadAction<User[]>) => {
    // Set the state to the new payload directly, replacing the existing state
    state.allUsers = action.payload;
},
  setRecentlyUsedSolanaAddresses: (state, action: PayloadAction<string[]>) => {
    state.recentlyUsedSolanaAddresses = action.payload;
  },
  setShowContactPopup: (state, action: PayloadAction<boolean>) => {
    state.showContactPopup = action.payload;
  },
  setSelectedLanguageCode: (state, action: PayloadAction<string>) => {
    state.selectedLanguageCode= action.payload;
  },
  setDepositWithdrawProductType: (state, action: PayloadAction<string>) => {
    state.depositWithdrawProductType= action.payload;
  },
  
  
  },
});

export const { setCrypto, setAllCryptos, setWalletConnected, 
  setWalletType, setWalletPubKey, updateUSDCBalance, 
  setPrincipalInvested, setPrincipalInvestedHistory, 
  setinitialPrincipal, setinitialInvestmentDate, 
  settotalInvestingValue, mergePrincipalInvestedHistory,
  setusdcSolValue, setusdtSolValue, setpyusdSolValue, 
  seteurcSolValue, setbusdSolValue, setusdySolValue,
  setbtcSolValue,
  setusdcEthValue, setusdtEthValue, setbusdEthValue, 
  addConnectedWallets, setCurrentUserKYCVerified,
  setcurrentUserFirstName, setcurrentUserLastName,
  setcurrentUserEmail, setEarnDepositTransactionStatus,
  setEarnWithdrawTransactionStatus, setWalletSwapTransactionStatus,
   setUpdatingBalance,
  setShouldShowBottomNav, setShowPayPage, setShowSendPage,
  setShowWithdrawStablecoinPage, setShowBanxaPopUp,
  setShowDepositStablecoinPage, setShowEarnPage, setShowCryptoPage,
  setShowWalletPage, setShowWalletDepositPage, setShowAccountHistory,
  setNewUserHasPreviousBalance, setShowRequestPage,
  setShowProfileMenu, setShowEarnWithdrawPage,
  setShowEarnDepositPage, setHotBalanceUSDY,
  setPriceOfUSDYinUSDC, setContacts, clearContacts, 
  setSelectedContact, setRecentlyUsedSolanaAddresses, 
  setAllUsers, setShowContactPopup, setSelectedLanguageCode,
  setcurrentUserID, setDepositWithdrawProductType
  
} = userWalletDataSlice.actions;

export default userWalletDataSlice.reducer;


