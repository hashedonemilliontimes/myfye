import { useDispatch } from 'react-redux';
import { getFirestore, collection, addDoc, setDoc, getDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import { setPrincipalInvested, mergePrincipalInvestedHistory, 
    setinitialInvestmentDate, setinitialPrincipal, 
    settotalInvestingValue } from '../redux/userWalletData';
import { valueAtTime } from '../helpers/growthPercentage';


export const saveNewDeposit = async (pubKey: string, amount: number, 
    currentInvestmentValue: number, dispatch: Function): Promise<boolean> => {
    
    const db = getFirestore();
    const currentDateInSeconds = Date.now()/1000;

    const pubKeyDocRef = doc(db, 'pubKeys', pubKey);

    try {
    const docSnapshot = await getDoc(pubKeyDocRef);

    let principalChanges: Record<string, number> = {};
    let newPrincipalBalance: number = 0;
    let firstTimeInvesting = false;

    const data = docSnapshot.data();

    if (data) {
        console.log('got the investment data')
        if (data.initialInvestmentDate) {
            newPrincipalBalance = Number((currentInvestmentValue + amount).toFixed(8));
            principalChanges[currentDateInSeconds] = newPrincipalBalance;

            console.log('saving investment balance: ', principalChanges)
            const updateDatabase = setDoc(pubKeyDocRef, {
                principalBalance: newPrincipalBalance,
                principalChanges: principalChanges
              }, { merge: true });
          
              await Promise.all([updateDatabase]);
          
              return true;

              
        } else {

            firstTimeInvesting = true;

            // Save to Redux
            dispatch(setPrincipalInvested(amount));
    
            dispatch(setinitialInvestmentDate(Date.now()/1000));
        
            dispatch(setinitialPrincipal(amount));
            
            const currentValue = valueAtTime(Date.now()/1000, amount, 
            amount, principalChanges)
        
            dispatch(settotalInvestingValue(currentValue))
            
            const updateDatabase = setDoc(pubKeyDocRef, {
                principalBalance: Number((amount).toFixed(4)),
                initialPrincipal: Number((amount).toFixed(4)),
                initialInvestmentDate: currentDateInSeconds,
              }, { merge: true });
          
              await Promise.all([updateDatabase]);
    
              return true;

        }
    } else {
        firstTimeInvesting = true;

        // Save to redux
        dispatch(setPrincipalInvested(amount));
    
        dispatch(setinitialInvestmentDate(Date.now()/1000));
    
        dispatch(setinitialPrincipal(amount));
        
        const currentValue = valueAtTime(Date.now()/1000, amount, 
        amount, principalChanges)
    
        dispatch(settotalInvestingValue(currentValue))

        const updateDatabase = setDoc(pubKeyDocRef, {
            principalBalance: Number((amount).toFixed(4)),
            initialPrincipal: Number((amount).toFixed(4)),
            initialInvestmentDate: currentDateInSeconds,
          }, { merge: true });
      
          await Promise.all([updateDatabase]);

          return true;
    }
} catch {
    console.log('Error getting investing data');
    return false;
}

};








