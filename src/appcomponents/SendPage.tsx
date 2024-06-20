import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import xIcon from '../assets/xIconGray2.png';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import LoadingAnimation from '../components/loadingAnimation';
import backButton from '../assets/backButton3.png';
import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getFirestore, doc, collection, setDoc, getDoc, addDoc } from 'firebase/firestore';
import { setShowSendPage } from '../redux/userWalletData';
import usdcSol from '../assets/usdcSol.png';
import usdtSol from '../assets/usdtSol.png';
import { requestNewSolanaTransaction2 } from '../helpers/web3Manager';

function SendPage() {

    const functions = getFunctions();
    const db = getFirestore();
    const [errorMessage, setErrorMessage] = useState('');
    const showSendPage = useSelector((state: any) => state.userWalletData.showSendPage);
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const { primaryWallet, user } = useDynamicContext();
    const [selectedPortion, setselectedPortion] = useState('');
    const [menuPosition, setMenuPosition] = useState('-130vh'); 
    const usdcSolBalance = useSelector((state: any) => state.userWalletData.usdcSolBalance);
    const usdtSolBalance = useSelector((state: any) => state.userWalletData.usdtSolBalance);
    const [sendButtonActive, setSendButtonActive] = useState(false);
    const [sendInProgress, setSendInProgress] = useState(false);
    const [addressText, setAddressText] = useState('');
    const [amountText, setAmountText] = useState('');
    const [stableCoinBalance, setStableCoinBalance] = useState(0);
    const currentUserFirstName = useSelector((state: any) => state.userWalletData.currentUserFirstName);
    const [currencySelected, setcurrencySelected] = useState('usdcSol');
    const walletName = useSelector((state: any) => state.userWalletData.type);
    const userEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);

    const dispatch = useDispatch();

    interface User {
      chain?: string;
      createdAt?: string;
      email?: string;
      firstName?: string;
      firstVisit?: string;
      id?: string;
      lastName?: string;
      lastVisit?: string;
      metadata?: Record<string, unknown>; // Or a more specific type if you know the structure
      oauthAccounts?: Array<unknown>; // Specify the type if you know what it contains
      projectEnvironmentId?: string;
      sessions?: Array<unknown>; // Specify the type if you know what it contains
      updatedAt?: string;
      wallet?: string;
      walletPublicKey?: string;
      wallets?: Array<unknown>; // Specify the type if you know what it contains
    }

    useEffect(() => {
      if (usdtSolBalance > usdcSolBalance) {
        setStableCoinBalance(usdtSolBalance)
        setcurrencySelected('usdtSol')
      } else {
        setStableCoinBalance(usdcSolBalance)
      }
    }, [usdcSolBalance, usdtSolBalance]);


    useEffect(() => {
      if (showSendPage) {
        setMenuPosition('0'); // Bring the menu into view
      } else {
        setMenuPosition('-130vh'); // Move the menu off-screen
      }
    }, [showSendPage]);
  
    const handleMenuClick = () => {
      dispatch(setShowSendPage(!showSendPage));
    };

    useEffect(() => {
      const preventPullToRefresh = (e: TouchEvent) => {
          if (e.touches && e.touches.length === 1 && e.touches[0].screenY > 50) {
              e.preventDefault();
          }
      };

      if (sendInProgress) {
          // Add the touchmove event listener when the function is running
          document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
      }

      return () => {
          // Remove the touchmove event listener when the function is not running
          document.removeEventListener('touchmove', preventPullToRefresh);
      };
  }, [sendInProgress]);

    const handleQuarterButtonClick = () => {
      console.log("Handling quarter button click", stableCoinBalance);
      if (stableCoinBalance>0.0001) {
        const newDeposit = (0.25 * stableCoinBalance);
        console.log("Setting deposit to:", newDeposit); // Added logging
      setAmountText("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
      checkForValidInput(addressText, String(newDeposit));
      } else {
          setAmountText("$ 0.0")
      }
      setselectedPortion('25%');
    };
    
    const handleHalfButtonClick = () => {
      console.log("Handling quarter button click", stableCoinBalance);
      if (stableCoinBalance>0.0001) {
        const newDeposit = (0.5 * stableCoinBalance);
        console.log("Setting deposit to:", newDeposit); // Added logging
        setAmountText("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
        checkForValidInput(addressText, String(newDeposit));
      }else {
          setAmountText("$ 0.0")
      }
      setselectedPortion('50%');
    };
    
    const handleTwoThirdsButtonClick = () => {
      console.log("Handling quarter button click", stableCoinBalance);
      if (stableCoinBalance>0.0001) {
        const newDeposit = (0.75 * stableCoinBalance);
        console.log("Setting deposit to:", newDeposit); // Added logging
        setAmountText("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
        checkForValidInput(addressText, String(newDeposit));
      } else {
          setAmountText("$ 0.0")
      }
      setselectedPortion('75%');
    };
    
    const handleAllButtonClick = () => {
      console.log("Handling quarter button click", stableCoinBalance);
      if (stableCoinBalance>0.0001) {
        const newDeposit = (1.0 * stableCoinBalance);
        console.log("Setting deposit to:", newDeposit); // Added logging
        setAmountText("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
        checkForValidInput(addressText, String(newDeposit));
      } else {
          setAmountText("$ 0.0")
      }
      setselectedPortion('100%');
    };


    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newAddress = event.target.value;
      setAddressText(newAddress.toLowerCase());
      checkForValidInput(newAddress, amountText);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newAmount = event.target.value;
      setAmountText(newAmount);
      checkForValidInput(addressText, newAmount);
      
    };

  const removeWhitespace = (str: string) => {
      return str.replace(/\s/g, '');
    };


    const checkForValidInput = (newAddress: string, newAmount: string) => {
      const preCleanedAmount = newAmount.replace(/[\s$,!#%&*()A-Za-z]/g, '');
      const cleanedAmount = removeWhitespace(preCleanedAmount);
      const amountToNumber = Number(cleanedAmount);
      const cleanedAddress = removeWhitespace(newAddress);
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      const isValidEmailAddress = regex.test(cleanedAddress);
  
      if (cleanedAmount === '' || cleanedAddress === '') {
          setSendButtonActive(false);
          setErrorMessage('Please fill in all fields');
      } else if (!isValidEmailAddress) {
        setSendButtonActive(false);
        setErrorMessage('Please enter a valid email address');
      } else if (isNaN(amountToNumber) && amountToNumber < 0.00001) {
        setSendButtonActive(false);
        setErrorMessage('Please enter a valid number');
      } else if (amountToNumber > stableCoinBalance) {
        setSendButtonActive(false);
        setErrorMessage('Insufficient balance');
      } else {
        setSendButtonActive(true);
        setErrorMessage('');
      }

  }


  const handleSendButtonClick = async () => {
    if (sendButtonActive) {
      const cleanedAddress = removeWhitespace(addressText)
      const cleanedAmount = amountText.replace(/[\s$,!#%&*()A-Za-z]/g, '');
      const amountToNumber = Number(cleanedAmount);
      if (isNaN(amountToNumber)) {
        setErrorMessage('Invalid amount');
      } else if (amountToNumber > stableCoinBalance) {
        setErrorMessage('Insufficient balance');
      } else if (amountToNumber < 0.001) {
        setErrorMessage('Minimum: $0.001');
      } else {
        setAmountText('');
        setAddressText('')
        setSendInProgress(true);
        setErrorMessage('Check your wallet');
        const convertToSmallestDenomination = amountToNumber* 10 *10 *10 *10 *10 *10;
        setSendButtonActive(false); // Deactivate button here
        console.log('Requesting new transaction')


        const users = await getDynamicUsers(cleanedAddress); // Get all the dynamic users on the SOL network
        const sendToDynamicUserPublicKey = await getUserInfoFromEmail(users, cleanedAddress);


        console.log('sendToPublicKey', sendToDynamicUserPublicKey)

        /*
        If there is a myfye user with this email, send to their public key, else
        send to the server address and send the user an email letting them
        know that they have money on MyFye. When the users comes to make an
        account, send them the money.
        */

        let sendToPublicKey 

        if (sendToDynamicUserPublicKey) {
          sendToPublicKey = sendToDynamicUserPublicKey
        } else {
          sendToPublicKey = 'DR5s8mAdygzmHihziLzDBwjuux1R131ydAG2rjYhpAmn'
        }
      
        const transactionSuccess = await requestNewSolanaTransaction2(publicKey, 
          sendToPublicKey, convertToSmallestDenomination, currencySelected, 
            primaryWallet, walletName);

        console.log('Got transaction status: ', transactionSuccess)
        if (transactionSuccess) {
          sendEmail(currentUserFirstName, cleanedAddress, amountToNumber)
          saveTransaction(amountToNumber, cleanedAddress);
          setSendInProgress(false);

          if (sendToPublicKey == 'DR5s8mAdygzmHihziLzDBwjuux1R131ydAG2rjYhpAmn') {
            // save the user's balance that doe not have an account yet
            saveUncreatedUserBalance(cleanedAddress, amountToNumber)
          }

          setErrorMessage('');
          // this is a rough workaround to save the change to redux and reload the page
          setTimeout(() =>  setErrorMessage(`Sent USD to ${addressText}`), 20);
      } else {
        setSendInProgress(false);
        setErrorMessage('Sorry, there was an error with your transaction. Please try again later')
      }
    }
  };
}

const getDynamicUsers = async (emailAddress: string) => {
  const functions = getFunctions();
  const getUserDataFn = httpsCallable(functions, 'getDynamicUsers');

  return getUserDataFn({emailAddress: emailAddress}).then((result) => {
    // Assuming the result follows the structure { data: { users: User[] } }
    const usersData = result as HttpsCallableResult<{ users: User[] }>;
    console.log("usersData", usersData);
    return usersData.data; // This returns { data: { users: User[] } }
  }).catch((error) => {
    console.error("Failed to fetch user data", error);
    throw error; // Rethrow to handle it outside or indicate failure
  });
};


const getUserInfoFromEmail = async (data: { users: User[] }, sendToEmail: string) => {
  if (data && data.users) {
    for (const user of data.users) {
      const email = user.email ?? "No email provided";
      const walletPublicKey = user.walletPublicKey ?? "No public key provided";
      console.log(`Email: ${email}, Wallet Public Key: ${walletPublicKey}`);
      if (sendToEmail === email && walletPublicKey !== "No public key provided") {
        return walletPublicKey;  // This will return the walletPublicKey from the function
      }
    }
    console.log("No matching user found");
    return null;  // Optionally return null if no matching email is found
  } else {
    console.log("No user data available");
    return null;  // Return null if data or users array is not valid
  }
};

const saveUncreatedUserBalance = async (email: string, amount: number) => {
  const contactCollectionRef = collection(db, 'uncreatedUserBalances');
  const userBalanceDocRef = doc(contactCollectionRef, email);  // Specify the document ID explicitly as email

  try {
    // Attempt to retrieve the existing document
    const docSnap = await getDoc(userBalanceDocRef);
    let newAmount = amount;

    if (docSnap.exists()) {
      // If document exists, retrieve current amount and add the new amount
      const currentData = docSnap.data();
      newAmount += currentData.amountInUSD;
      newAmount = parseFloat(newAmount.toFixed(6));
    }

    // Update or set the document with the new amount
    await setDoc(userBalanceDocRef, { amountInUSD: newAmount });

    console.log("saveUncreatedUserBalance successfully updated!");
  } catch (error) {
    console.error("Error accessing or updating document: ", error);
  }
};

const sendEmail = async (firstName: string, email: string, amount: number) => {

    const functions = getFunctions();
    const sendEmailFn = httpsCallable(functions, 
      'sendgridEmail');
      sendEmailFn({ emailAddress: email,
        firstName: firstName, 
        templateId: 'd-01416b6dc85446b7baf63c535e2950e8',
        amount: `$${amount}` })
      .then((result) => {
          // Read result of the Cloud Function.
          console.log(result);
      })
      .catch((error) => {
          // Getting the Error details.
          console.log(error);
      });
};

async function saveTransaction(amount: number, address: string) {
  const transactionsCollectionRef = collection(db, 'payTransactions');
  try {
      console.log('saving transaction');

      const docRef = await addDoc(transactionsCollectionRef, {
        type: 'deposit',
        time: new Date().toISOString(),
        amount: amount,
        currency: currencySelected,
        publicKey: publicKey,
        receiverEmail: address,
        senderEmail: userEmail
      });

      console.log("Saved to database!", docRef);
      return "Update saved successfully";  // Resolve with a message or useful data
      
  } catch (error) {
      console.log("Error saving update balance", error);
      throw new Error("Failed to save update: " + error);  // Reject the promise with an error
  }
}

  const styles = {
    tradeTimeframeButtonRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 10px',
      gap: '10px',
    },
    button: {
      flex: 1,
      padding: '5px',
      paddingTop: '12px',
      paddingBottom: '12px',
      backgroundColor: 'white',
      color: '#333333',
      border: '1px solid #333333',
      borderRadius: '4px',
      fontSize: '14px',
      cursor: 'pointer',
    },
    selectedButton: {
      flex: 1,
      padding: '5px',
      paddingTop: '12px',
      paddingBottom: '12px',
      backgroundColor: '#333333',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
    },
  };


  const errorLabelText = () => {
    if (errorMessage) {
      const color = '#000000'
      return (
        <div>
        <label
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
            marginTop: '15px',
            fontSize: '17px',
            color: color,
            textAlign: 'center'
          }}
        >
          {errorMessage}
        </label>
        </div>
      );
    } else {
      return (
        <div style={{ visibility: 'hidden' }}>
          <label
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto',
              marginTop: '15px',
              fontSize: '17px',
            }}
          >
            $
          </label>
        </div>
      );
    }
  };

    return (
        <div style={{ backgroundColor: 'white', overflowX: 'hidden' }}>

{ showSendPage && !sendInProgress && (
<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      marginTop: '15px',
      marginLeft: '15px',
      cursor: 'pointer',
      zIndex: 20,
      overflowX: 'hidden'     // Add some padding for spacing from the edges
    }}>

<img 
    style={{ width: 'auto', height: '45px', background: 'white' }} 
    src={backButton}
    onClick={handleMenuClick} 
    alt="Exit" 
  />
        
            </div>)}


      <div style={{
        position: 'absolute',
        top: menuPosition,
        left: 0, // Use state variable for position
        padding: '15px',
        height: '97vh',
        backgroundColor: 'white',
        transition: 'top 0.5s ease', // Animate the left property
        zIndex: 4,
        overflow: 'hidden'
      }}>

<div style={{ width: '93vw', marginTop: '0px'}}>



<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<div style={{marginTop: '0px', fontSize: '35px', color: '#222222'}}>Send</div>

</div>






{sendInProgress ? (

<div style={{ marginBottom: '15px', display: 'flex', 
flexDirection: 'column', marginTop: '-20px',
alignItems: 'center' }}>
<LoadingAnimation/>

{errorLabelText()}

<div style={{marginTop: '30px'}}>Please wait...</div>
</div>

) : (

<div>
<div style={{marginTop: '60px', fontSize: '25px'}}>

  {stableCoinBalance > 0.01 ? (
    <div style={{display: 'flex', justifyContent: 'space-between', width: '80vw'}}>
    <div>Balance: ${(stableCoinBalance.toFixed(2)).toLocaleString()}</div>
    {(usdtSolBalance > usdcSolBalance) ? (
      <div>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px'}}>
        <div style={{fontSize: '15px'}}>USDT</div>
        <img 
          style={{ width: 'auto', height: '30px', background: 'white' }} 
          src={usdtSol}
          onClick={handleMenuClick} 
          alt="Exit" 
        />
      </div>
    </div>
    ) : (
      <div>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px'}}>
          <div style={{fontSize: '15px'}}>USDC</div>
          <img 
            style={{ width: 'auto', height: '30px', background: 'white' }} 
            src={usdcSol}
            onClick={handleMenuClick} 
            alt="Exit" 
          />
        </div>
      </div>
    )}

    </div>
  ) : (
    <div>$0.00</div>
  )}
</div>

<div style={{ marginTop: '60px'}}>


<div style={{marginBottom: '15px', display: 'flex', flexDirection: 'column', opacity: sendInProgress ? '0' : '1' }}>

  <input
    id="SolanaAddress"
    type="text"
    value={addressText}
    onChange={handleAddressChange}
    onInput={handleAddressChange}
    style={{
      backgroundColor: '#EEEEEE', // Slightly lighter gray
      color: '#444444',
      fontSize: '20px',
      border: 'none', // Remove the border
      borderRadius: '5px', // Rounded edges
      padding: '10px 10px', // Adjust padding as needed
    }}
    placeholder="Email Address"
  />
</div>

<div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', opacity: sendInProgress ? '0' : '1' }}>

  <input
    id="USDAmount"
    type="number"
    value={amountText}
    onChange={handleAmountChange}
    onInput={handleAmountChange}
    style={{
      backgroundColor: '#EEEEEE', // Slightly lighter gray
      color: '#444444',
      fontSize: '20px',
      border: 'none', // Remove the border
      borderRadius: '5px', // Rounded edges
      padding: '10px 10px', // Adjust padding as needed
    }}
    placeholder="Amount"
  />
</div>

<div style={{opacity: sendInProgress ? '0' : '1'}}>
<div style={styles.tradeTimeframeButtonRow} >
      <button style={selectedPortion === '25%' ? styles.selectedButton : styles.button} onClick={handleQuarterButtonClick}>25%</button>
      <button style={selectedPortion === '50%' ? styles.selectedButton : styles.button} onClick={handleHalfButtonClick}>50%</button>
      <button style={selectedPortion === '75%' ? styles.selectedButton : styles.button} onClick={handleTwoThirdsButtonClick}>75%</button>
      <button style={selectedPortion === '100%' ? styles.selectedButton : styles.button} onClick={handleAllButtonClick}>100%</button>
    </div>
    </div>

    {errorLabelText()}

<button
  style={{
      backgroundColor: sendButtonActive ? '#03A9F4' : '#D1E5F4',
      color: sendButtonActive ? '#222222': '#CCCCCC',
      opacity: sendInProgress ? '0' : '1',
      display: 'inline-block',
      padding: '10px 20px',
      fontSize: '25px',
      marginTop: '30px',
      fontWeight: 'bold',
      textAlign: 'center',
      borderRadius: '10px',
      border: '1px solid transparent',
      cursor: 'pointer',
      width: '100%'
    }} onClick={handleSendButtonClick}>Send

    </button>


    </div>
    </div>
)}



    </div>


                  </div> 

                  </div>
    )
}

export default SendPage;

