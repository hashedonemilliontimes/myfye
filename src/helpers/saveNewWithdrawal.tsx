import { useDispatch } from 'react-redux';
import { Token } from '@solana/spl-token';
import { getFirestore, setDoc, getDoc, doc, collection, addDoc } from 'firebase/firestore';

export const saveNewWithdrawal = async (pubKey: string, amount: number, 
    currentInvestmentValue: number): Promise<boolean> => {
    
    const db = getFirestore();
    const currentDateInSeconds = Date.now()/1000;

    const pubKeyDocRef = doc(db, 'pubKeys', pubKey);
    const withdrawalsCollectionRef = collection(db, 'withdrawals');

    try {
    const docSnapshot = await getDoc(pubKeyDocRef);

    let principalChanges: Record<string, number> = {};
    let newPrincipalBalance: number = 0;

    const data = docSnapshot.data();

    // for a real time more robust solution we need to calculate all of the 
    // interest over time here but for now, we can assume that
    // if the amount is greater than the principal the user
    // is taking all of their money out and we should simply set
    // the principal to 0
    if (data && data.initialInvestmentDate) {

        newPrincipalBalance = Number((currentInvestmentValue - amount).toFixed(8));
        if (newPrincipalBalance < 0) {
            newPrincipalBalance = 0;
        }
        principalChanges[currentDateInSeconds] = newPrincipalBalance;

        const newWithdrawalData = {
            fulfilled: false,
            amount: amount,
            pubKey: pubKey,
            timestamp: (new Date(Date.now())).toLocaleString()
        };

        const updateWithdrawals = await addDoc(withdrawalsCollectionRef, newWithdrawalData);

        const updatePubKey = setDoc(pubKeyDocRef, {
            principalBalance: newPrincipalBalance,
            principalChanges: principalChanges
          }, { merge: true });

        
        
          await Promise.all([updateWithdrawals, updatePubKey]);
        
          return true;

    } else {
        return false;
    }
} catch {
    console.log('Error getting investing data');
    return false;
}

};


