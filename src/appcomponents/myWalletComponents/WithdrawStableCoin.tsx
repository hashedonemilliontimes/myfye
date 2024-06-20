import React, { useState, useEffect } from 'react';
import menuIcon from '../../assets/menuIcon.png';
import { useSelector, useDispatch } from 'react-redux';
import backButton from '../../assets/backButton3.png';
import usdcSol from '../../assets/usdcSol.png';
import usdtSol from '../../assets/usdtSol.png';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { requestNewSolanaTransaction2 } from '../../helpers/web3Manager';
import { setShowWithdrawStablecoinPage } from '../../redux/userWalletData';

function WithdrawStableCoin() {
  const showWithdrawStablecoinPage = useSelector((state: any) => state.userWalletData.showWithdrawStablecoinPage);
  const [errorMessage, setErrorMessage] = useState('');
    const [currencySelected, setcurrencySelected] = useState('usdcSol');
    const { primaryWallet, user } = useDynamicContext();
    const [addressCopied, setaddressCopied] = useState(false); 
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const [Message, setMessage] = useState('');
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const [SubmitButtonActive, setSubmitButtonActive] = useState(false);
    const connectedWallets = useSelector((state: any) => state.userWalletData.connectedWallets);
    const [menuPosition, setMenuPosition] = useState('-110vh'); 
    const usdcSolBalance = useSelector((state: any) => state.userWalletData.usdcSolBalance);
    const usdtSolBalance = useSelector((state: any) => state.userWalletData.usdtSolBalance);
    const usdyBalance = useSelector((state: any) => state.userWalletData.usdySolBalance);
    const walletName = useSelector((state: any) => state.userWalletData.type);
    const [selectedPortion, setselectedPortion] = useState('');
    const [balanceSelectedInUSD, setbalanceSelectedInUSD] = useState(0);
    const dispatch = useDispatch();
    const [withdrawalButtonActive, setWithdrawalButtonActive] = useState(false);
    const [withdrawalInProgress, setWithdrawalInProgress] = useState(false);
    const [addressText, setAddressText] = useState('');
    const [amountText, setAmountText] = useState('');



    useEffect(() => {

        setbalanceSelectedInUSD(usdcSolBalance)
      }, [usdcSolBalance, usdtSolBalance]);

      

    useEffect(() => {
        if (showWithdrawStablecoinPage) {
          setMenuPosition('0'); // Bring the menu into view
        } else {
          setMenuPosition('-100vh'); // Move the menu off-screen
        }
      }, [showWithdrawStablecoinPage]);
    
      const handleMenuClick = () => {
        dispatch(setShowWithdrawStablecoinPage(false));
      };

      const handleCurrencySelection = (selection: string) => {
        // Add your logic here for what happens when the menu is clicked

        setcurrencySelected(selection)
        if (selection == 'usdcSol') {
            setbalanceSelectedInUSD(usdcSolBalance);
        } else {
            setbalanceSelectedInUSD(usdtSolBalance);
        }

      };


      const handleQuarterButtonClick = () => {
        console.log("Handling quarter button click", balanceSelectedInUSD);
        if (balanceSelectedInUSD>0.0001) {
          const newDeposit = (0.25 * balanceSelectedInUSD);
          console.log("Setting deposit to:", newDeposit); // Added logging
        setAmountText("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
        checkForValidInput(addressText, String(newDeposit));
        } else {
            setAmountText("$ 0.0")
        }
        setselectedPortion('25%');
      };
      
      const handleHalfButtonClick = () => {
        console.log("Handling quarter button click", balanceSelectedInUSD);
        if (balanceSelectedInUSD>0.0001) {
          const newDeposit = (0.5 * balanceSelectedInUSD);
          console.log("Setting deposit to:", newDeposit); // Added logging
          setAmountText("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
          checkForValidInput(addressText, String(newDeposit));
        }else {
            setAmountText("$ 0.0")
        }
        setselectedPortion('50%');
      };
      
      const handleTwoThirdsButtonClick = () => {
        console.log("Handling quarter button click", balanceSelectedInUSD);
        if (balanceSelectedInUSD>0.0001) {
          const newDeposit = (0.75 * balanceSelectedInUSD);
          console.log("Setting deposit to:", newDeposit); // Added logging
          setAmountText("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
          checkForValidInput(addressText, String(newDeposit));
        } else {
            setAmountText("$ 0.0")
        }
        setselectedPortion('75%');
      };
      
      const handleAllButtonClick = () => {
        console.log("Handling quarter button click", balanceSelectedInUSD);
        if (balanceSelectedInUSD>0.0001) {
          const newDeposit = (1.0 * balanceSelectedInUSD);
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
    
        const isValidSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(cleanedAddress);
    
        if (!isValidSolanaAddress || cleanedAmount === '' || cleanedAddress === '') {
            setWithdrawalButtonActive(false);
        } else if (!isNaN(amountToNumber) && amountToNumber > 0.00001 && 
        (amountToNumber <= balanceSelectedInUSD)) {
            setWithdrawalButtonActive(true);
        } else {
            setWithdrawalButtonActive(false);
        }
    }
    


    const handleWithdrawalButtonClick = async () => {
        if (withdrawalButtonActive) {
          const cleanedAddress = removeWhitespace(addressText)
          const cleanedAmount = amountText.replace(/[\s$,!#%&*()A-Za-z]/g, '');
          const amountToNumber = Number(cleanedAmount);
          if (isNaN(amountToNumber)) {
            setErrorMessage('Invalid amount');
          } else if (amountToNumber > balanceSelectedInUSD) {
            setErrorMessage('Insufficient balance');
          } else if (amountToNumber < 0.001) {
            setErrorMessage('Minimum: $0.001');
          } else {
            setAmountText('');
            setAddressText('')
            setWithdrawalInProgress(true);
            setErrorMessage('Check your wallet');
            const convertToSmallestDenomination = amountToNumber* 10 *10 *10 *10 *10 *10;
            setWithdrawalButtonActive(false); // Deactivate button here

            console.log('connectedWallets', connectedWallets)
            console.log('walletName: ', walletName)

            console.log('Requesting new transaction')
          
            const transactionSuccess = await requestNewSolanaTransaction2(publicKey, 
                cleanedAddress, convertToSmallestDenomination, currencySelected, 
                primaryWallet, walletName);
            
            console.log('Got transaction status: ', transactionSuccess)

            if (transactionSuccess) {

              if (connectedWallets[0].chain == 'solana' || connectedWallets[0].chain == 'Solana' ||
              connectedWallets[0].chain == 'SOL') {

              setWithdrawalInProgress(false);
              setErrorMessage('');
              // this is a rough workaround to save the change to redux and reload the page
              setTimeout(() =>  dispatch(setShowWithdrawStablecoinPage(false)), 10);

              
            } else {
              setWithdrawalInProgress(false);
              setErrorMessage('Sorry, there was an error with your transaction. Please try again later')
            }
          } else {
            setWithdrawalInProgress(false);
            setErrorMessage('Sorry, there was an error with your transaction. Please try again later')
          }
        }
      };
    }


    const errorLabelText = () => {
        if (errorMessage) {
          const color = errorMessage === ('Check your wallet' || 
          'Sending transaction') ? '#60A05B' : ('#FF3B30');
          return (

            <div>
{withdrawalInProgress && ( 
<div style={{display: 'flex', justifyContent: 'center' }}>

            </div>
            )}

            <label
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
                marginTop: '0px',
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

    return (
        <div style={{ backgroundColor: 'white' }}>

{ showWithdrawStablecoinPage && (
<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      padding: '15px',
      cursor: 'pointer',
      zIndex: 7    
    }}>

            <img style={{width: 'auto', height: '45px', background: 'white'}} src={ showWithdrawStablecoinPage ? (
                 backButton) : menuIcon }
            onClick={handleMenuClick} alt="Exit" />
            </div>)}



      <div style={{
        position: 'absolute',
        top: menuPosition,
        left: 0, // Use state variable for position
        padding: '15px',
        height: '90vh',
        backgroundColor: 'white',
        width: '92vw',
        transition: 'top 0.5s ease', // Animate the left property
        overflowY: 'hidden',
        zIndex: 6
      }}>


<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<div style={{marginTop: '0px', fontSize: '35px', color: '#222222'}}>Withdraw</div>
</div>

<div>




<div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
    
<div style={{ display: 'flex', alignItems: 'center', 
                background: (currencySelected == 'usdcSol') ? '#444444' : '#ffffff', 
                color: (currencySelected == 'usdcSol') ? '#ffffff' : '#000000',  
padding: '10px', borderRadius: '10px', border: '1px solid black',  }} onClick={() => handleCurrencySelection('usdcSol')}>
                    <img id="usdcSolIcon" src={usdcSol} style={{ width: '50px', height: 'auto' }} />
                    <div id="usdcSolTicker" style={{ marginLeft: '15px' }}>USDC</div> {/* Adjust marginLeft as needed */}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', 
                background: (currencySelected == 'usdtSol') ? '#444444' : '#ffffff', 
                color: (currencySelected == 'usdtSol') ? '#ffffff' : '#000000', 
                padding: '10px', borderRadius: '10px', 
                border: '1px solid black', }} onClick={() => handleCurrencySelection('usdtSol')}>
                    <img  src={usdtSol} style={{ width: '50px', height: 'auto' }} ></img>
                    <div style={{ marginLeft: '15px' }}>USDT</div> {/* Adjust marginLeft as needed */}
                    
                </div>
                </div>

</div>

<div style={{marginTop: '20px', fontSize: '20px', marginLeft: '20px'}}>Balance: {balanceSelectedInUSD}</div>


<div
    style={{
        width: '90%',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '40px',
        maxWidth: '500px',
        height: '82vh'
    }}
    >


        <div style={{ marginTop: '30px'}}>
  <div style={{marginBottom: '15px', display: 'flex', flexDirection: 'column', opacity: withdrawalInProgress ? '0' : '1' }}>
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
      placeholder="Solana Address"
    />
  </div>
  <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', opacity: withdrawalInProgress ? '0' : '1' }}>
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
<div style={{opacity: withdrawalInProgress ? '0' : '1'}}>
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
        backgroundColor: withdrawalButtonActive ? '#03A9F4' : '#D1E5F4',
        color: withdrawalButtonActive ? '#222222': '#CCCCCC',
        opacity: withdrawalInProgress ? '0' : '1',
        display: 'inline-block',
        padding: '10px 20px',
        fontSize: '25px',
        marginTop: '5px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: '10px',
        border: '1px solid transparent',
        cursor: 'pointer',
        width: '100%'
      }} onClick={handleWithdrawalButtonClick}>Send

      </button>


      </div>


      </div>
</div>

                  </div> 


        </div>
    )
}
export default WithdrawStableCoin;