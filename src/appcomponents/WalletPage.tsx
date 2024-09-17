import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import { useSelector, useDispatch } from 'react-redux';
import backButton from '../assets/backButton3.png';
import DepositStableCoin from './myWalletComponents/DepositStableCoin';
import WithdrawStableCoin from './myWalletComponents/WithdrawStableCoin';
import ShowBanxaPopUp from './myWalletComponents/ShowBanxaPopUp';
import QRCode from 'qrcode.react';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { setShouldShowBottomNav, setShowWithdrawStablecoinPage, 
  setShowBanxaPopUp, setShowDepositStablecoinPage,
setShowWalletPage, setShowWalletDepositPage } from '../redux/userWalletData';
import history from '../assets/history.png';
import WalletTransactions from './WalletTransactions';
import myfyeWallet from '../assets/myfyeWallet2.png';
import xIcon from '../assets/xIconGray2.png';
import usdcSol from '../assets/usdcSol.png';
import usdtSol from '../assets/usdtSol.png';
import eurcSol from '../assets/eurcSol.png';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { requestNewSolanaTransaction2 } from '../helpers/web3Manager';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import LoadingAnimation from '../components/loadingAnimation';

function WalletPage() {
    const showMenu = useSelector((state: any) => state.userWalletData.showWalletPage);
    const { primaryWallet, user } = useDynamicContext();
    const dispatch = useDispatch()
    const [swapButtonActive, setSwapButtonActive] = useState(true);
    const [currencySelected, setcurrencySelected] = useState('');
    const [showTransactionHistory, setshowTransactionHistory] = useState(false);
    const [menuPosition, setMenuPosition] = useState('-110vh'); 
    const [transactionStatus, setTransactionStatus] = useState(''); 
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const [Message, setMessage] = useState('');
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const [showQRCode, setshowQRCode] = useState(false);
    const updatingBalance = useSelector((state: any) => state.userWalletData.updatingBalance);
    const usdcSolBalance = useSelector((state: any) => state.userWalletData.usdcSolBalance);
    const usdtSolBalance = useSelector((state: any) => state.userWalletData.usdtSolBalance);
    const pyusdSolBalance = useSelector((state: any) => state.userWalletData.pyusdSolBalance);
    const eurcSolBalance = useSelector((state: any) => state.userWalletData.eurcSolBalance);
    const usdyBalance = useSelector((state: any) => state.userWalletData.usdySolBalance);
    const priceOfUSDYinUSDC = useSelector((state: any) => state.userWalletData.priceOfUSDYinUSDC);
    const [qrCodeURL, setqrCodeURL] = useState(''); 
    const [showWalletInfoPopup, setShowWalletInfoPopup] = useState(false); 
    const [showSwapPopup, setShowSwapPopup] = useState(false); 
    const [addressCopied, setAddressCopied] = useState(false);
    const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);
    const [transactionInProgress, setTransactionInProgress] = useState(false);
    const connectedWallets = useSelector((state: any) => state.userWalletData.connectedWallets);
    const walletName = useSelector((state: any) => state.userWalletData.type);
  const MYFYE_SERVER_ADDRESS = "DR5s8mAdygzmHihziLzDBwjuux1R131ydAG2rjYhpAmn"

    useEffect(() => {
      const baseUrl = "https://api.qrserver.com/v1/create-qr-code/";
      const params = new URLSearchParams({
        size: "150x150", // Size of the QR code
        data: publicKey, // Data to encode
      });
      setqrCodeURL(`${baseUrl}?${params.toString()}`);
    }, [publicKey]);

    const removeWhitespace = (str: string) => {
        return str.replace(/\s/g, '');
      };

    useEffect(() => {
        if (showMenu) {
          setMenuPosition('0'); // Bring the menu into view
        } else {
          setMenuPosition('-110vh'); // Move the menu off-screen
          setcurrencySelected('usd');
          if (usdcSolBalance>=1 || usdtSolBalance>=1) {
            setSwapButtonActive(true)
          }
        }
      }, [showMenu]);


      useEffect(() => {
        
        if (currencySelected == 'usd') {
          if (usdcSolBalance>=1 || usdtSolBalance>=1) {
            setSwapButtonActive(true)
            } else {
              setSwapButtonActive(false)
            }
        } else if (currencySelected == 'eur') {
          if (eurcSolBalance >= 1) {
            setSwapButtonActive(true)
            } else {
              setSwapButtonActive(false)
            }
        }

      }, [currencySelected]);

      const handleMenuClick = () => {
        if (showTransactionHistory) {
          toggleShowTransactionHistory()
        } else {
          if (showMenu) {
            dispatch(setShowWalletPage(false))
          }
        }
        
      };


      function copyWalletAddress() {
        navigator.clipboard.writeText(publicKey) // Assume publicKey is available in your component's scope
            .then(() => {
                setAddressCopied(true);
                setTimeout(() => {
                    setAddressCopied(false);
                }, 2000); // Set addressCopied to false after 2 seconds
            })
            .catch(err => {
                console.error('Failed to copy the address: ', err);
            });
    }

      const handleWithdrawButtonClick = () => {
        // Add your logic here for what happens when the menu is clicked
        dispatch(setShouldShowBottomNav(false));
        dispatch(setShowWithdrawStablecoinPage(true))
        
      };

      const handleDepositButtonClick = () => {
        // Add your logic here for what happens when the menu is clicked
        dispatch(setShouldShowBottomNav(false));
        dispatch(setShowWalletDepositPage(true))
        
      };
      
      const toggleShowWalletInfoPopup = () => {
        // Add your logic here for what happens when the menu is clicked
        setShowWalletInfoPopup(!showWalletInfoPopup)
        
      };

      const toggleShowSwapPopup = () => {
        // Add your logic here for what happens when the menu is clicked
        setShowSwapPopup(!showSwapPopup)
        
      };

      const toggleShowTransactionHistory = () => {
        console.log()
        if (!showTransactionHistory) {
          dispatch(setShouldShowBottomNav(false))
        } else {
          dispatch(setShouldShowBottomNav(true))
        }
        setshowTransactionHistory(!showTransactionHistory)

      };
      

      const handleWalletPortfolioClick = () => {
        const url = `https://app.step.finance/en/dashboard?watching=${publicKey}`;
        window.open(url, '_blank'); // Opens the link in a new tab
    };

    const handleWalletExplorerClick = () => {
      const url = `https://solscan.io/account/${publicKey}`;
      window.open(url, '_blank'); // Opens the link in a new tab
  };


  const handleSwapButtonClick = async () => {
    

    let amountSelected;
    let inputCurrency;
    let outputCurrency;
    
    if (currencySelected == 'usd') {
      outputCurrency = 'eurcSol';
      if (usdtSolBalance > usdcSolBalance) {
        inputCurrency = 'usdtSol';
        amountSelected = usdtSolBalance;
      } else {
        inputCurrency = 'usdcSol';
        amountSelected = usdcSolBalance;
      }
    } else if (currencySelected == 'eur') {
      outputCurrency = 'usdcSol';
      amountSelected = eurcSolBalance;
      inputCurrency = 'eurcSol';
    } else {
      setTransactionStatus('Error with swap please try again later.')
    }

    const convertToSmallestDenomination = amountSelected* 10 *10 *10 *10 *10 *10;
    setTransactionInProgress(true); 


    setTransactionStatus('Confirming Transaction...')

  
    const transactionSuccess = await requestNewSolanaTransaction2(publicKey, 
      MYFYE_SERVER_ADDRESS, convertToSmallestDenomination, inputCurrency!, 
        primaryWallet, walletName);
    
    console.log('Got transaction status: ', transactionSuccess)

    if (transactionSuccess) {
      setTransactionStatus('Confirmed! Your balance will update soon!')

      const functions = getFunctions();
      const sendSignedTransaction = httpsCallable(functions, 'swap');
      sendSignedTransaction({
        publicKey: publicKey,
        inputAmount: amountSelected,
        inputCurrency: inputCurrency,
        outputCurrency: outputCurrency
      })

      setTimeout(() => {
        setTransactionInProgress(false);
        setShowSwapPopup(false);
        setTransactionStatus('');
      }, 2500);

    } else {
      setTransactionStatus('Transaction failed, please try again.')
    }
      

  };

    return (
        <div style={{ backgroundColor: 'white', overflow: 'hidden' }}>

{ showMenu && (
<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      padding: '15px',
      cursor: 'pointer',
      zIndex: 4,
    }}>

            <img style={{width: 'auto', height: '35px', background: 'white'}} src={ showMenu ? (
                currencySelected ? backButton : showTransactionHistory ? backButton : backButton) : menuIcon }
            onClick={handleMenuClick} alt="Exit" />
            </div>)}



       <WithdrawStableCoin/>
       <ShowBanxaPopUp/>
       <DepositStableCoin/>
       
      <div style={{
        position: 'absolute',
        top: menuPosition,
        left: 0, // Use state variable for position
        height: '90vh',
        backgroundColor: 'white',
        width: '100vw',
        overflowX: 'hidden',
        overflowY: 'hidden',
        transition: 'top 0.5s ease', // Animate the left property
        zIndex: 3
      }}>





{showWalletInfoPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
          onClick={toggleShowWalletInfoPopup}
        >
          <div
            style={{
              backgroundColor: 'white',
              width: '75vw',
              height: '50vh',
              padding: '20px',
              background: '#ffffff',
              borderRadius: '20px',
              boxShadow: '4px 10px 30px rgba(0, 0, 0, 0.4), -4px 10px 30px rgba(0, 0, 0, 0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >



            <img src={xIcon} style={{width: '32px', height: 'auto'}}
            onClick={toggleShowWalletInfoPopup}></img>

<div style={{display: 'flex', flexDirection: 'column', 
  alignItems: 'center', height: '90%', 
  justifyContent: 'space-around', marginTop: '-20px'}}>
<div style={{width: '110px', height: '110px'}}>
<QRCode value={publicKey} size={110} level="H" />
</div>

<div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
           cursor: 'pointer',
           fontSize: '20px',
           padding: '9px',
           width: '180px',
           textAlign: 'center'
       }} onClick={copyWalletAddress}>
           {addressCopied ? (
<>Copied!</>
           ) : (
<>Copy Address</>
           )}
       </div>

       <div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
            padding: '9px',
           cursor: 'pointer',
           fontSize: '20px',     
           width: '180px',
           textAlign: 'center'
       }} onClick={handleWalletExplorerClick}>
           Wallet Explorer
       </div>

</div>
          </div>
        </div>
      )}




{showSwapPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
          onClick={toggleShowSwapPopup}
        >
          <div
            style={{
              backgroundColor: 'white',
              width: '80vw',
              height: '60vh',
              padding: '20px',
              background: '#ffffff',
              borderRadius: '20px',
              boxShadow: '8px 20px 60px rgba(0, 0, 0, 0.4), -4px 10px 30px rgba(0, 0, 0, 0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >

            <img src={xIcon} style={{width: '32px', height: 'auto'}}
            onClick={toggleShowSwapPopup}></img>

{transactionInProgress ? (
<div style={{marginTop: '10px', display: 'flex', 
  alignItems: 'center', gap: '20px', flexDirection: 'column'}}>

<div>
{transactionStatus == 'Confirmed! Your balance will update soon!' ? (
  <div style={{
  background: 'rgba(46, 125, 50, 0.3)', // Semi-transparent dark green background
  width: '125px',
  height: '125px',
  borderRadius: '50%', // Circular shape
  display: 'flex', // To center the checkmark
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative'
}}>
  <div style={{
    width: '50px', // Width of the checkmark
    height: '25px', // Height of the checkmark
    borderBottom: '5px solid #2E7D32', // Bottom part of the checkmark
    borderLeft: '5px solid #2E7D32', // Left part of the checkmark
    transform: 'rotate(-45deg)', // Rotate to form the checkmark
    position: 'absolute',
    bottom: '50px', // Positioning the checkmark correctly within the circle
    borderRadius: '4px'
  }}></div>
</div>
) : (
<LoadingAnimation/>
)}
</div>

<div style={{fontSize: '15px', color: '#222222'}}>{transactionStatus}</div>

</div>
) : (
  <div>
<div style={{marginTop: '20px', fontWeight: 'bold'}}>You pay</div>


<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '90%'}}>
<div style={{marginTop: '10px', fontSize: '30px', fontWeight: 'bold', width: '100px', paddingLeft: '2px'}}>

&nbsp;&nbsp;{currencySelected == 'usd' ? (usdcSolBalance > usdtSolBalance ? (usdcSolBalance) : (usdtSolBalance)).toFixed(2) : eurcSolBalance.toFixed(2)}


</div>

<img src={currencySelected == 'usd' ? (usdcSolBalance > usdtSolBalance ? (usdcSol) : (usdtSol)) : eurcSol}
style={{width: 'auto', height: '55px'}}/>
</div>


<div style={{marginTop: '20px', fontWeight: 'bold'}}>You receive</div>

<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '90%'}}>
<div style={{marginTop: '10px', fontSize: '30px', fontWeight: 'bold', width: '100px'}}>

  ~{currencySelected == 'usd' ? ((usdcSolBalance > usdtSolBalance ? (usdcSolBalance) : (usdtSolBalance))*0.89).toFixed(2) : (eurcSolBalance*1.096).toFixed(2)}
</div>

<img src={currencySelected == 'usd' ? eurcSol : usdcSol}
style={{width: 'auto', height: '55px'}}/>
</div>

<div style={{display: 'flex', marginTop: '20px',
  flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>

<div style={{
           color: '#ffffff', 
           background: swapButtonActive ? '#2E7D32' : 'rgba(46, 125, 50, 0.4)',
           borderRadius: '10px', 
           border: swapButtonActive ? '2px solid #2E7D32' : '',
           fontWeight: 'bold',
            padding: '9px',
           cursor: 'pointer',
           fontSize: '20px',     
           width: '200px',
           textAlign: 'center',
           marginTop: '10px',
           height: '27px'
       }} onClick={handleSwapButtonClick}>
    {selectedLanguageCode === 'en' && 'Swap'}
    {selectedLanguageCode === 'es' && `Intercambio`}
       </div>

       </div>
</div>
)}

          </div>
          
        </div>
      )}


{!showTransactionHistory ? (
<div>

<div style={{
        position: 'absolute', // Position it relative to the viewport
        top: 0,              // Align to the top of the viewport
        right: 0,            // Align to the right of the viewport
        padding: '15px',
        cursor: 'pointer',
        zIndex: 4    
}}>
{/*<img src={history} style={{height: '39px', width: '39px'}} onClick={toggleShowTransactionHistory}/>*/}
</div>




<div>



<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<img style={{ width: '180px', height: 'auto', marginTop: '15px',}}src={myfyeWallet}/>
</div>

<div style={{
display: 'flex', alignItems: 'center', 
justifyContent: 'space-around', 
width: '100vw', height: '65vh', flexDirection: 'column', marginTop: '30px'}}>


<div style={{
      background: '#ffffff',
      borderRadius: '0 0 20px 20px',
      boxShadow: '2px 5px 15px rgba(0, 0, 0, 0.2), -2px 5px 15px rgba(0, 0, 0, 0.2), 0px -32px 48px rgba(0, 0, 0, 0.4)',
      padding: '10px',
      paddingBottom: '20px',
      width: '90vw',
      position: 'relative',
      zIndex: 2
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', position: 'absolute', top: '-38px', left: '0', width: '100%' }}>
        <div 
          style={{
            padding: '10px 20px',
            borderRadius: '20px 20px 0 0',
            background: '#ffffff',
            color: '#222222',
            cursor: 'pointer',
            marginRight: '5px',
            flex: 1,
          }}
          onClick={() => setcurrencySelected('usd')}
        >
          <div style={{
            textAlign: 'center',
            color: currencySelected === 'usd' ? '#2E7D32': '#222222',
            fontSize: '20px',
            fontWeight: 'bold'
            }}>
          U.S. Dollar
          </div>
        </div>
        <div 
          style={{
            padding: '10px 20px',
            borderRadius: '20px 20px 0 0',
            background: '#ffffff',
            color: '#222222',
            cursor: 'pointer',
            flex: 1,
            
          }}
          onClick={() => setcurrencySelected('eur')}
        >
          <div style={{textAlign: 'center',
            color: currencySelected === 'eur' ? '#2E7D32': '#222222',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
          Euro
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', height: '1.5px', backgroundColor: '#BBBBBB', borderRadius: '10px' }} />



      <div style={{ display: 'flex',  alignItems: 'center', 
        flexDirection: 'column', color: '#222222', gap: window.innerHeight < 620 ? '1px' : '10px'  }}>

<div style={{ display: 'flex', alignItems: 'center', 
  justifyContent: 'center', flexDirection: 'column',}}>


      {/* Content inside the tile */}
      <div style={{ marginTop: '30px' }}>
        {currencySelected === 'usd' && 
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', 
          width: '90%', minWidth: '240px'}}>
        
            <label style={{ fontSize: '20px', 
             display: 'flex', alignItems: 'center', }}>
            USD$ Balance: $<span style={{ fontSize: '35px' }}>
              
            <div>
            {((usdcSolBalance + usdtSolBalance).toFixed(2)).toLocaleString('en-US')}
          </div>
        
            </span>
        </label>
        
        </div>
        }
        {currencySelected === 'eur' && 
        
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', 
          width: '90%', minWidth: '240px'}}>
        
            <label style={{ fontSize: '20px', 
             display: 'flex', alignItems: 'center', }}>
            EUR€ Balance: €<span style={{ fontSize: '35px' }}>
              
            <div>
            {((eurcSolBalance).toFixed(2)).toLocaleString('en-US')}
          </div>
        
            </span>
        </label>
        
        </div>
        }
      </div>














   </div>




   {/*
   <Deposit/>
    <Withdraw/>
           <HoldingsPortfolio/>
  */}

<div style={{display: 'flex', 
alignItems: 'center', 
                justifyContent: 'space-around',
                marginTop: '20px',
                width: '95vw',}}>

            <div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
           cursor: 'pointer',
           fontSize: '20px',
           padding: '9px',
           width: '120px',
           textAlign: 'center'
       }} onClick={handleDepositButtonClick}>
    {selectedLanguageCode === 'en' && `Deposit`}
    {selectedLanguageCode === 'es' && `Déposito`}
       </div>
       <div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
            padding: '9px',
           cursor: 'pointer',
           fontSize: '20px',     
           width: '120px',
           textAlign: 'center'
       }} onClick={handleWithdrawButtonClick}>
    {selectedLanguageCode === 'en' && `Withdraw`}
    {selectedLanguageCode === 'es' && `Retirar`}
       </div>
       </div>

       <div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
            padding: '9px',
           cursor: 'pointer',
           fontSize: '20px',     
           width: '200px',
           textAlign: 'center',
           marginTop: '10px'
       }} onClick={toggleShowSwapPopup}>
    {selectedLanguageCode === 'en' && (currencySelected === 'eur' && 'Swap to U.S. Dollars')}
    {selectedLanguageCode === 'en' && (currencySelected === 'usd' && 'Swap to Euros')}
    {selectedLanguageCode === 'es' && `Intercambio`}
       </div>
       </div>


       
       </div>






       <div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
            padding: '9px',
           cursor: 'pointer',
           fontSize: '20px',     
           width: '180px',
           textAlign: 'center'
       }} onClick={toggleShowWalletInfoPopup}>
    {selectedLanguageCode === 'en' && `Wallet Info`}
    {selectedLanguageCode === 'es' && `Información De Billetera`}
       </div>







</div>



</div>




</div>
) : (

  <div>
<WalletTransactions/>
  </div>
)}



                  </div> 


        </div>
    )
}
export default WalletPage;