import { 
    setsolValue,
    setusdcSolValue, 
    setusdtSolValue, 
    setpyusdSolValue,
    seteurcSolValue,
    setbtcSolValue,
    setusdySolValue,
    setRecentlyUsedSolanaAddresses,
    setCurrentUserKYCVerified,
    setcurrentUserEmail,
    setWalletPubKey,
    setPassKeyState
    } from '../redux/userWalletData.tsx';
import { 
    getFirestore, 
    getDoc, 
    doc
    } from 'firebase/firestore';
import { 
    PublicKey, 
    Connection, 
    } from "@solana/web3.js";
import {useLoginWithPasskey} from '@privy-io/react-auth';

const HandleUserLogIn = async (user: any, dispatch: Function): Promise<{ success: boolean;}> => {

    console.log('user', user)

    console.log('user wallet', user.wallet)

    // Set some user data
    dispatch(setcurrentUserEmail(user.email.address))
    dispatch(setWalletPubKey(user.wallet.address))
    
    // Check if the user has set up a pass key
    for (const linkedAccount of user.linkedAccounts) {
      if (linkedAccount.type === 'passkey') {
        await UpdatePasskey(dispatch);
      }
    }
    
    try {
        await Promise.all([
          getUserBalances(user.wallet.address, dispatch),
          getUserData(user.wallet.address, dispatch),
        ]);
        console.log('User balances and data fetched successfully');
        return { success: true };
      } catch (e) {
        console.error('Error fetching user data or balances:', e);
        return { success: false };
      }
    
}

export const getUserData = async (pubKey: string, 
    dispatch: Function): Promise<boolean> => {
    
    const db = getFirestore();
    const pubKeyDocRef = doc(db, 'pubKeys', pubKey);

    const docSnapshot = await getDoc(pubKeyDocRef);
    const data = docSnapshot.data();

    if (data) {
        if (data.recentlyUsedAddresses) {
            dispatch(setRecentlyUsedSolanaAddresses(data.recentlyUsedAddresses))
        }
        if (data.KYCverified) {
            dispatch(setCurrentUserKYCVerified(data.KYCverified));
        }
    }
    return true
};

const getUserBalances = async (pubKey: string, dispatch: Function) => {
    
    try {
        const [
          tokenBalances,
          solanaBalance
        ] = await Promise.all([
            TokenBalances(pubKey),
            SolanaBalance(pubKey)
        ]);
    
          dispatch(setusdcSolValue(Number(tokenBalances.usdc)));
          dispatch(setusdtSolValue(Number(tokenBalances.usdt)));
          dispatch(setusdySolValue(Number(tokenBalances.usdy)));
          dispatch(setpyusdSolValue(Number(tokenBalances.pyusd)));
          dispatch(seteurcSolValue(Number(tokenBalances.eurc)));
          dispatch(setbtcSolValue(Number(tokenBalances.btc)));
          dispatch(setsolValue(Number(solanaBalance)));
        } catch (e) {
            console.error('Error fetching user balances');
            return false
        }
}



export const TokenBalances = async (address: string): Promise<{
    success: boolean;
    usdc: number;
    usdt: number;
    usdy: number;
    pyusd: number;
    eurc: number;
    btc: number;
  }> => {
    let balances = {
      success: false, // default to false
      usdc: 0,
      usdt: 0,
      usdy: 0,
      pyusd: 0,
      eurc: 0,
      btc: 0,
    };
  
    const QUICKNODE_RPC = 'https://attentive-wispy-borough.solana-mainnet.discover.quiknode.pro/580b0865bae2f3f5904e56150ea7b41069fd06cd/';
    const connection = new Connection(QUICKNODE_RPC);
  
    const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; 
    const USDT_MINT_ADDRESS = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'; 
    const USDY_MINT_ADDRESS = 'A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6';
    const PYUSD_MINT_ADDRESS = '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo';
    const EURC_MINT_ADDRESS = 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr';
    const BTC_MINT_ADDRESS = "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij";


    try {
      const publicKey = new PublicKey(address);
  
      // Fetch all SPL token accounts owned by the wallet address
      const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') // SPL Token program ID
      });
  
      for (const account of parsedTokenAccounts.value) {
        const mintAddress = account.account.data.parsed.info.mint;
  
        // Check if the mint address matches that of USDC
        if (mintAddress === USDC_MINT_ADDRESS) {
          const usdcBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
          balances.usdc = usdcBalance;
        }
        if (mintAddress === BTC_MINT_ADDRESS) {
            const btcBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
            balances.btc = btcBalance;
        }
        if (mintAddress === PYUSD_MINT_ADDRESS) {
            const pyusdBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
            balances.pyusd = pyusdBalance;
        }
        if (mintAddress === EURC_MINT_ADDRESS) {
            const eurcBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
            balances.eurc = eurcBalance
        }
        if (mintAddress === USDT_MINT_ADDRESS) {
            const usdtBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
            balances.usdt = usdtBalance
        }
        if (mintAddress === USDY_MINT_ADDRESS) {
            const usdyBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
            balances.usdy = usdyBalance
        }
      }
      balances.success = true
      return balances;
    } catch (err) {
      console.error(`Failed to fetch balance: ${err}`);
      balances.success = false
      return balances;
    }
  };
  
  export const SolanaBalance = async (address: string): Promise<number> => {
    const QUICKNODE_RPC = 'https://attentive-wispy-borough.solana-mainnet.discover.quiknode.pro/580b0865bae2f3f5904e56150ea7b41069fd06cd/';
    const connection = new Connection(QUICKNODE_RPC);
  
    try {
      const publicKey = new PublicKey(address);
      
      // Fetch native SOL balance
      const balanceInLamports = await connection.getBalance(publicKey);
      
      // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
      const balanceInSol = balanceInLamports / 1e9;
  
      // console.log(`Balance of ${address}: ${balanceInSol} SOL`);
      return balanceInSol;
    } catch (err) {
      console.error(`Failed to fetch balance: ${err}`);
      return 0;
    }
  };


const UpdatePasskey = async (dispatch: Function) => {

  dispatch(setPassKeyState('done'));

}

export { HandleUserLogIn, UpdatePasskey }