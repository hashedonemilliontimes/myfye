import { useDispatch } from 'react-redux';
import { getFirestore, collection, addDoc, setDoc, getDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import { setPrincipalInvested, setPrincipalInvestedHistory, 
    setinitialInvestmentDate, setinitialPrincipal, setUpdatingBalance,
    settotalInvestingValue, setHotBalanceUSDY,
    setPriceOfUSDYinUSDC } from '../redux/userWalletData';
import { valueAtTime } from './growthPercentage';

export const getUserData = async (pubKey: string, dispatch: Function): Promise<boolean> => {
    
    const db = getFirestore();
    const pubKeyDocRef = doc(db, 'pubKeys', pubKey);

    const docSnapshot = await getDoc(pubKeyDocRef);

    const data = docSnapshot.data();

    if (data) {

        if (data.updatingBalance) {
            dispatch(setUpdatingBalance(data.updatingBalance))
        } else {
            dispatch(setUpdatingBalance(false))
        }

        if (data.hotBalanceUSDY) {
            dispatch(setHotBalanceUSDY(data.hotBalanceUSDY))
        } else {
            dispatch(setHotBalanceUSDY(0))
        }

        if (data.principalChanges) {
            dispatch(setPrincipalInvestedHistory(data.principalChanges));
        }

        if (data.principalBalance) {
            dispatch(setPrincipalInvested(data.principalBalance));
        }
        if (data.initialInvestmentDate) {
            dispatch(setinitialInvestmentDate(data.initialInvestmentDate));
        }
        if (data.initialPrincipal) {
            dispatch(setinitialPrincipal(data.initialPrincipal));
            
            const currentValue = valueAtTime(Date.now()/1000, data.initialPrincipal, 
            data.initialInvestmentDate, data.principalChanges)

            dispatch(settotalInvestingValue(currentValue))
        }

        const quote = await getSwapQuote()

        dispatch(setPriceOfUSDYinUSDC(quote.outAmount/1000000))
    }


    async function getSwapQuote() {

        const outputMintAddress = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        const inputMintAddress = 'A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6';
  
        const quoteResponse = await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMintAddress}&amount=${1* 1000000}&slippageBps=50`
        ).then(response => response.json());
        
        return quoteResponse
      }


    return true
};





