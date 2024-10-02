import { useDispatch } from 'react-redux';
import { getFirestore, collection, addDoc, setDoc, getDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import { setPrincipalInvested, setPrincipalInvestedHistory, 
    setinitialInvestmentDate, setinitialPrincipal, setUpdatingBalance,
    settotalInvestingValue, setHotBalanceUSDY,
    setPriceOfUSDYinUSDC, setContacts, setRecentlyUsedSolanaAddresses, 
    setAllUsers, setCurrentUserKYCVerified} from '../redux/userWalletData';
import { valueAtTime } from './growthPercentage';
import User from './User';
import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions';


export const getUserData = async (email: string, phoneNumber: string, 
    pubKey: string, dispatch: Function): Promise<boolean> => {
    
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

        if (data.recentlyUsedAddresses) {
            dispatch(setRecentlyUsedSolanaAddresses(data.recentlyUsedAddresses))
        }
        if (data.KYCverified) {
            dispatch(setCurrentUserKYCVerified(data.KYCverified));
        }
    }


    return true
};



export const getUserContacts = async (email: string, phoneNumber: string, 
    pubKey: string, dispatch: Function): Promise<boolean> => {


            const db = getFirestore();

    const contactsFromEmailDocRef = doc(db, 'contacts', email);
    // Fetch the document
    const contactsFromEmailDocSnapshot = await getDoc(contactsFromEmailDocRef);
    if (contactsFromEmailDocSnapshot.exists()) {
        // Access the 'emails' field in the document
        const emails = contactsFromEmailDocSnapshot.data().emails || [];
        const phoneNumbers = contactsFromEmailDocSnapshot.data().phoneNumbers || [];
        const emailsAndPhoneNumbers = [...emails, ...phoneNumbers];
        
        let user_list: (User | string)[] = [];

        async function processContacts(emails: string[], phoneNumbers: string[]) {
            // Process all emails
            if (Array.isArray(emails) && emails.length >= 1) {
            for (let email of emails) {
                try {
                    const users = await getDynamicUsers(email, 'email');
                    const locatedUser = await cleanDynamicUserDataWithEmail(users, email);
            
                    if (Array.isArray(locatedUser)) {
                        user_list.push(...locatedUser);
                    } else if (locatedUser) {
                        user_list.push(locatedUser);
                    } else {
                        user_list.push(email); // Use the email as a fallback
                    }
                } catch {
                    user_list.push(email); // Fallback to email in case of an error
                }
            }
            }
        
            // Process all phone numbers
            if (Array.isArray(phoneNumbers) && phoneNumbers.length >= 1) {
            for (let phoneNumber of phoneNumbers) {
                try {
                    const users = await getDynamicUsers(phoneNumber, 'phone'); // Correct the second parameter if needed
                    const locatedUser = await cleanDynamicUserDataWithPhone(users, phoneNumber);
            
                    if (Array.isArray(locatedUser)) {
                        user_list.push(...locatedUser);
                    } else if (locatedUser) {
                        user_list.push(locatedUser);
                    } else {
                        user_list.push(phoneNumber); // Use phoneNumber as a fallback
                    }
                } catch {
                    user_list.push(phoneNumber); // Fallback to phoneNumber in case of an error
                }
            }
        }
            // Dispatch only once per email and phone batch
            
            dispatch(setContacts(user_list));
            console.log(user_list);
        }
        
        processContacts(emails, phoneNumbers);
        

    } else {
        console.log("No contacts from email");
    }

    console.log('getting contacts for phone phoneNumber', phoneNumber)
    const contactsFromPhoneDocRef = doc(db, 'contacts', phoneNumber);
    // Fetch the document
    const contactsFromPhoneDocSnapshot = await getDoc(contactsFromPhoneDocRef);
    if (contactsFromPhoneDocSnapshot.exists()) {
        // Access the 'emails' field in the document
        const emails = contactsFromPhoneDocSnapshot.data().emails || [];
        const phoneNumbers = contactsFromPhoneDocSnapshot.data().phoneNumbers || [];
        const emailsAndPhoneNumbers = [...emails, ...phoneNumbers];
        
        let user_list: (User | string)[] = [];


        async function processContacts(emails: string[], phoneNumbers: string[]) {
            // Process all emails
            if (Array.isArray(emails) && emails.length >= 1) {
            for (let email of emails) {
                try {
                    const users = await getDynamicUsers(email, 'email');
                    const locatedUser = await cleanDynamicUserDataWithEmail(users, email);
            
                    if (Array.isArray(locatedUser)) {
                        user_list.push(...locatedUser);
                    } else if (locatedUser) {
                        user_list.push(locatedUser);
                    } else {
                        user_list.push(email); // Use the email as a fallback
                    }
                } catch {
                    user_list.push(email); // Fallback to email in case of an error
                }
            }
            }
        
            // Process all phone numbers
            if (Array.isArray(phoneNumbers) && phoneNumbers.length >= 1) {
            for (let phoneNumber of phoneNumbers) {
                try {
                    const users = await getDynamicUsers(phoneNumber, 'phone'); // Correct the second parameter if needed
                    const locatedUser = await cleanDynamicUserDataWithPhone(users, phoneNumber);
            
                    if (Array.isArray(locatedUser)) {
                        user_list.push(...locatedUser);
                    } else if (locatedUser) {
                        user_list.push(locatedUser);
                    } else {
                        user_list.push(phoneNumber); // Use phoneNumber as a fallback
                    }
                } catch {
                    user_list.push(phoneNumber); // Fallback to phoneNumber in case of an error
                }
            }
        }
            // Dispatch only once per email and phone batch
            dispatch(setContacts(user_list));
            console.log(user_list);
        }
        
        processContacts(emails, phoneNumbers);
        

    } else {
        console.log("No contacts from email");
    }
    return true;
    }

export const getAllDynamicUsers = async (dispatch: Function) => {
    const result = await getDynamicUsers('None', 'allUsers');
    const allDynamicUsers = result.users; // Accessing the array of users directly
    console.log('Got all dynamic users: ', allDynamicUsers)
    dispatch(setAllUsers(allDynamicUsers)); // Now passing only the array
}

const getDynamicUsers = async (receiverData: string, dataType: string) => {
    const functions = getFunctions();
    const getUserDataFn = httpsCallable(functions, 'getDynamicUsers');
  
    return getUserDataFn({receiverData: receiverData, dataType: dataType}).then((result) => {
      // Assuming the result follows the structure { data: { users: User[] } }
      const usersData = result as HttpsCallableResult<{ users: User[] }>;
      
      return usersData.data; // This returns { data: { users: User[] } }
    }).catch((error) => {
      console.error("Failed to fetch user data", error);
      throw error; // Rethrow to handle it outside or indicate failure
    });
  };
  
  export const getUserTransactionsEnabled = async (userID: string): Promise<boolean> => {
    try {
        const db = getFirestore();
      const pubKeyDocRef = doc(db, 'DisabledUserIDs', 'DisabledUserIDs');
      const docSnapshot = await getDoc(pubKeyDocRef);
  
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const idsArray = data?.DisabledUserIDsArray || [];
  
        console.log(userID, "is in disabled: ", !idsArray.includes(userID))
        // Check if the userID is in the DisabledUserIDsArray
        return !idsArray.includes(userID); // Return true if the user is enabled (not in the disabled list)
      } else {
        console.log('Document does not exist.');
        return true; // Assume enabled if the document does not exist
      }
    } catch (error) {
      console.error("Error fetching user transaction enable status: ", error);
      return true; // Return true (enabled) in case of an error
    }
  };
  
  
  const cleanDynamicUserDataWithEmail = async (data: { users: User[] }, sendToEmail: string) => {
    if (data && data.users) {
      for (const user of data.users) {
        const email = user.email ?? "No email provided";
        const walletPublicKey = user.walletPublicKey ?? "No public key provided";
        
        if (sendToEmail === email && walletPublicKey !== "No public key provided") {
          return user;  // This will return the walletPublicKey from the function
        }
      }
      console.log("No matching user found");
      return null;  // Optionally return null if no matching email is found
    } else {
      console.log("No user data available");
      return null;  // Return null if data or users array is not valid
    }
  };
  
  const cleanDynamicUserDataWithPhone = async (data: { users: User[] }, sendToPhoneNumber: string) => {
    if (data && data.users) {
      for (const user of data.users) {
        const phoneNumber = user.phoneNumber ?? "No email provided";
        const phoneCountryCode = user.phoneCountryCode ?? "No country code provided";
        const walletPublicKey = user.walletPublicKey ?? "No public key provided";
        if (sendToPhoneNumber === phoneNumber && walletPublicKey !== "No public key provided") {
          console.log(`phoneNumber: ${phoneNumber}, 
            Country code: ${phoneCountryCode}, 
            Wallet Public Key: ${walletPublicKey}`);
          return user;  // This will return the walletPublicKey from the function
        }
      }
      console.log("No matching user found");
      return null;  // Optionally return null if no matching email is found
    } else {
      console.log("No user data available");
      return null;  // Return null if data or users array is not valid
    }
  };

export const getUSDYPriceQuote = async (price: number, dispatch: Function): Promise<boolean> => {

    if (price <= 0.01) {
        const quote = await getSwapQuote()
        const priceInUSD = quote.outAmount/1000000
        if (priceInUSD && priceInUSD>0.01) {
            dispatch(setPriceOfUSDYinUSDC(quote.outAmount/1000000))
        } else {
            dispatch(setPriceOfUSDYinUSDC(1.05))
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



