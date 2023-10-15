import { useDispatch } from 'react-redux';
import { Token } from '@solana/spl-token';
import { getFirestore, collection, addDoc, setDoc, getDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import { setPrincipalInvested, setPrincipalInvestedHistory, 
    setinitialInvestmentDate, setinitialPrincipal, 
    settotalInvestingValue } from '../redux/userWalletData';
import { valueAtTime } from '../helpers/growthPercentage';

export const getPrincipalInvested = async (pubKey: string, dispatch: Function): Promise<boolean> => {
    
    const db = getFirestore();
    const pubKeyDocRef = doc(db, 'pubKeys', pubKey);

    const docSnapshot = await getDoc(pubKeyDocRef);

    const data = docSnapshot.data();


    if (data) {
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

        
    }



    return true
};





