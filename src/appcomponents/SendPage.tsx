import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import xIcon from '../assets/xIconGray2.png';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import LoadingAnimation from '../components/loadingAnimation';
import backButton from '../assets/backButton3.png';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getFirestore, doc, collection, setDoc } from 'firebase/firestore';
import { setShowSendPage } from '../redux/userWalletData';

function SendPage() {

    const functions = getFunctions();
    const db = getFirestore();
    const [errorMessage, setErrorMessage] = useState('');
    const showSendPage = useSelector((state: any) => state.userWalletData.showSendPage);
    
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

    const dispatch = useDispatch();


    useEffect(() => {
      if (usdtSolBalance > usdcSolBalance) {
        setStableCoinBalance(usdtSolBalance)
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

        const transactionSuccess = false
        /*
        const transactionSuccess = await requestNewSolanaTransaction2(publicKey, 
            cleanedAddress, convertToSmallestDenomination, currency, 
            primaryWallet, walletName);
        */
        
        console.log('Got transaction status: ', transactionSuccess)
        if (transactionSuccess) {
          setSendInProgress(false);
          setErrorMessage('');
          // this is a rough workaround to save the change to redux and reload the page
          setTimeout(() =>  setErrorMessage(`Success, sent USD to ${addressText}`), 10);
      } else {
        setSendInProgress(false);
        setErrorMessage('Sorry, there was an error with your transaction. Please try again later')
      }
    }
  };
}

const getEmailPublicKey = async () => {
  
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

{ showSendPage && (
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
        width: '97vw',
        transition: 'top 0.5s ease', // Animate the left property
        zIndex: 4,
        overflow: 'hidden'
      }}>

<div style={{ width: '80vw', marginTop: '80px'}}>

<div style={{marginTop: '10px', fontSize: '45px', color: '#222222'}}>Send</div>




<div style={{ marginTop: '30px'}}>
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
      type="text"
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
        backgroundColor: sendButtonActive ? '#2E7D32' : '#BBD5BD',
        color: sendButtonActive ? '#ffffff': '#888888',
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


                  </div> 

                  </div>
    )
}

export default SendPage;

