import { useDispatch } from 'react-redux';
import { getFirestore, collection, addDoc, setDoc, getDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import { setPrincipalInvested, setPrincipalInvestedHistory, 
    setinitialInvestmentDate, setinitialPrincipal, setUpdatingBalance,
    settotalInvestingValue, setHotBalanceUSDY,
    setPriceOfUSDYinUSDC, setContacts } from '../redux/userWalletData';
import { valueAtTime } from './growthPercentage';


export const getUserData = async (email: string, pubKey: string, dispatch: Function): Promise<boolean> => {
    
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

    }

    
    const contactDocRef = doc(db, 'contacts', email);
    // Fetch the document
    const contactDocSnapshot = await getDoc(contactDocRef);
    if (contactDocSnapshot.exists()) {
        // Access the 'emails' field in the document
        const emails = contactDocSnapshot.data().emails;
        dispatch(setContacts(emails))
    } else {
        console.log("No such document!");
    }


    return true
};




export const getUSDYPriceQuote = async (price: number, dispatch: Function): Promise<boolean> => {

    if (price <= 0.01) {
        const quote = await getSwapQuote()
        const priceInUSD = quote.outAmount/1000000
        console.log('quote.outAmount ', quote.outAmount)
        if (priceInUSD && priceInUSD>0.01) {
            dispatch(setPriceOfUSDYinUSDC(quote.outAmount/1000000))
            console.log('setting the price to ', quote.outAmount/1000000)
        } else {
            dispatch(setPriceOfUSDYinUSDC(1.04))
            console.log('setting the price to ', 1.04)
        }
        
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
}



