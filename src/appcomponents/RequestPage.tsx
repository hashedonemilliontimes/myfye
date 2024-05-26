import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import xIcon from '../assets/xIconGray2.png';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import backButton from '../assets/backButton3.png';
import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getFirestore, doc, collection, setDoc, getDoc } from 'firebase/firestore';
import { setShowRequestPage } from '../redux/userWalletData';
import usdcSol from '../assets/usdcSol.png';
import usdtSol from '../assets/usdtSol.png';
import { requestNewSolanaTransaction2 } from '../helpers/web3Manager';

function RequestPage() {

    const functions = getFunctions();
    const db = getFirestore();
    const [errorMessage, setErrorMessage] = useState('');
    const showRequestPage = useSelector((state: any) => state.userWalletData.showRequestPage);
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

    const dispatch = useDispatch();


    useEffect(() => {
      if (usdtSolBalance > usdcSolBalance) {
        setStableCoinBalance(usdtSolBalance)
        setcurrencySelected('usdtSol')
      } else {
        setStableCoinBalance(usdcSolBalance)
      }
    }, [usdcSolBalance, usdtSolBalance]);


    useEffect(() => {
      if (showRequestPage) {
        setMenuPosition('0'); // Bring the menu into view
      } else {
        setMenuPosition('-130vh'); // Move the menu off-screen
      }
    }, [showRequestPage]);
  
    const handleMenuClick = () => {
      dispatch(setShowRequestPage(!showRequestPage));
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
        const newDeposit = (1);
        console.log("Setting deposit to:", newDeposit); // Added logging
      setAmountText("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
      checkForValidInput(addressText, String(newDeposit));
      setselectedPortion('$1');
    };
    
    const handleHalfButtonClick = () => {
      console.log("Handling quarter button click", stableCoinBalance);
        const newDeposit = (10);
        console.log("Setting deposit to:", newDeposit); // Added logging
        setAmountText("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
        checkForValidInput(addressText, String(newDeposit));
        setselectedPortion('$10');
    };
    
    const handleTwoThirdsButtonClick = () => {
      console.log("Handling quarter button click", stableCoinBalance);
        const newDeposit = (100);
        console.log("Setting deposit to:", newDeposit); // Added logging
        setAmountText("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
        checkForValidInput(addressText, String(newDeposit));
      setselectedPortion('$100');
    };
    
    const handleAllButtonClick = () => {
      console.log("Handling quarter button click", stableCoinBalance);
        const newDeposit = (1000);
        console.log("Setting deposit to:", newDeposit); // Added logging
        setAmountText("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
        checkForValidInput(addressText, String(newDeposit));
      setselectedPortion('$1,000');
    };


    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newAddress = event.target.value;
      setAddressText(newAddress);
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
      } else if (amountToNumber > 10000) {
        setSendButtonActive(false);
        setErrorMessage('Maximum $10,000');
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
      } else if (amountToNumber > 10000) {
        setErrorMessage('Maximum $10,000');
      } else if (amountToNumber < 0.001) {
        setErrorMessage('Minimum: $0.001');
      } else {
        setAmountText('');
        setAddressText('')
        sendEmail(currentUserFirstName, cleanedAddress, amountToNumber)
        setErrorMessage(`Invoice sent to ${cleanedAddress}`)
    }
  };
}

const sendEmail = async (firstName: string, email: string, amount: number) => {

    const functions = getFunctions();
    const sendEmailFn = httpsCallable(functions, 
      'sendgridEmail');
      sendEmailFn({ emailAddress: email,
        firstName: firstName, 
        templateId: 'd-63ff86dad3f34b9d989842a7d5efc143',
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
            fontSize: '18px',
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
              fontSize: '18px',
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

{ showRequestPage && (
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

<div style={{ width: '93vw', marginTop: '20px'}}>



<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<div style={{marginTop: '10px', fontSize: '35px', color: '#222222'}}>Request</div>

</div>






{sendInProgress ? (

<div style={{ marginBottom: '15px', display: 'flex', 
flexDirection: 'column', marginTop: '-20px',
alignItems: 'center' }}>

{errorLabelText()}

<div style={{marginTop: '30px'}}>Please wait...</div>
</div>

) : (

<div>
<div style={{marginTop: '60px', fontSize: '23px'}}>

<div>Send an invoice to get paid</div>
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
    type="tel"
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
      <button style={selectedPortion === '$1' ? styles.selectedButton : styles.button} onClick={handleQuarterButtonClick}>$1</button>
      <button style={selectedPortion === '$10' ? styles.selectedButton : styles.button} onClick={handleHalfButtonClick}>$10</button>
      <button style={selectedPortion === '$100' ? styles.selectedButton : styles.button} onClick={handleTwoThirdsButtonClick}>$100</button>
      <button style={selectedPortion === '$1,000' ? styles.selectedButton : styles.button} onClick={handleAllButtonClick}>$1,000</button>
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
    }} onClick={handleSendButtonClick}>Invoice

    </button>


    </div>
    </div>
)}



    </div>


                  </div> 

                  </div>
    )
}

export default RequestPage;

