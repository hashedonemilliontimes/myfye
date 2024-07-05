
import { getFirestore, doc, collection, setDoc, getDoc, } from 'firebase/firestore';
import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { setNewUserHasPreviousBalance } from '../redux/userWalletData';

export const checkUncreatedUserBalance = async (email: string, publicKey: string, dispatch: Function, phoneNumber: string | null = null) => {

  // check email
    const db = getFirestore()
    const contactCollectionRef = collection(db, 'uncreatedUserBalances');
    const userBalanceDocRef = doc(contactCollectionRef, email);  // Specify the document ID explicitly as email
  
    try {
      // Attempt to retrieve the existing document
      const docSnap = await getDoc(userBalanceDocRef);
  
      if (docSnap.exists()) {
        // If document exists, retrieve current amount and add the new amount
        const currentData = docSnap.data();

        if (currentData.amountInUSD >= 0.0001) {

            console.log('UNCREATED USER BALANCE')
            console.log('uncreatedUserBalance', currentData.amountInUSD)
            // Notify the user that they have a balance 
            dispatch(setNewUserHasPreviousBalance(true))
            // send the balance to the user
            // save the new balance

            console.log('Calling handleUncreatedUserBalance')
            const functions = getFunctions();

            const balanceDocRef = doc(db, 'uncreatedUserBalances', email);

            const updateBalance = setDoc(balanceDocRef, {
                amountInUSD: 0.0
              }, { merge: true });

            await Promise.all([updateBalance]);
            console.log("saveUncreatedUserBalance successfully updated!");

            const handleUncreatedUserBalanceFn = httpsCallable(functions, 
              'handleUncreatedUserBalance');
              handleUncreatedUserBalanceFn({ emailAddress: email,
                publicKey: publicKey,
                amountInUSD: currentData.amountInUSD })
              .then((result) => {
                  // Read result of the Cloud Function.
                  console.log(result);
              })
              .catch((error) => {
                  // Getting the Error details.
                  console.log(error);
              });
        }
      }
    } catch (error) {
      console.error("Error accessing or updating document: ", error);
    }


    if (phoneNumber) {
      // check phone
      const phoneCollectionRef = collection(db, 'uncreatedUserBalances');
      const userBalancePhoneDocRef = doc(phoneCollectionRef, phoneNumber);  // Specify the document ID explicitly as email
    
      try {
        // Attempt to retrieve the existing document
        const docSnap = await getDoc(userBalancePhoneDocRef);
    
        if (docSnap.exists()) {
          // If document exists, retrieve current amount and add the new amount
          const currentData = docSnap.data();
  
          if (currentData.amountInUSD >= 0.0001) {
  
              console.log('UNCREATED USER BALANCE')
              console.log('uncreatedUserBalance', currentData.amountInUSD)
              // Notify the user that they have a balance 
              dispatch(setNewUserHasPreviousBalance(true))
              // send the balance to the user
              // save the new balance
  
              console.log('Calling handleUncreatedUserBalance')
              const functions = getFunctions();
  
              const balanceDocRef = doc(db, 'uncreatedUserBalances', phoneNumber);
  
              const updateBalance = setDoc(balanceDocRef, {
                  amountInUSD: 0.0
                }, { merge: true });
  
              await Promise.all([updateBalance]);
              console.log("saveUncreatedUserBalance successfully updated!");
  
              // send it to the user's private key
              const handleUncreatedUserBalanceFn = httpsCallable(functions, 
                'handleUncreatedUserBalance');
                handleUncreatedUserBalanceFn({ emailAddress: email,
                  publicKey: publicKey,
                  amountInUSD: currentData.amountInUSD })
                .then((result) => {
                    // Read result of the Cloud Function.
                    console.log(result);
                })
                .catch((error) => {
                    // Getting the Error details.
                    console.log(error);
                });
          }
        }
      } catch (error) {
        console.error("Error accessing or updating document: ", error);
      }
    }
  };