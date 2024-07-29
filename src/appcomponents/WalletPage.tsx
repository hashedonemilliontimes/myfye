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

function WalletPage() {
    const showMenu = useSelector((state: any) => state.userWalletData.showWalletPage);

    const dispatch = useDispatch()
    const [currencySelected, setcurrencySelected] = useState('');
    const [showTransactionHistory, setshowTransactionHistory] = useState(false);
    const [menuPosition, setMenuPosition] = useState('-110vh'); 
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const [Message, setMessage] = useState('');
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const [showQRCode, setshowQRCode] = useState(false);
    const updatingBalance = useSelector((state: any) => state.userWalletData.updatingBalance);
    const usdcSolBalance = useSelector((state: any) => state.userWalletData.usdcSolBalance);
    const usdtSolBalance = useSelector((state: any) => state.userWalletData.usdtSolBalance);
    const pyusdSolBalance = useSelector((state: any) => state.userWalletData.pyusdSolBalance);
    const usdyBalance = useSelector((state: any) => state.userWalletData.usdySolBalance);
    const priceOfUSDYinUSDC = useSelector((state: any) => state.userWalletData.priceOfUSDYinUSDC);
    const [qrCodeURL, setqrCodeURL] = useState(''); 
    const [showWalletInfoPopup, setShowWalletInfoPopup] = useState(false); 
    const [addressCopied, setAddressCopied] = useState(false);

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
          setcurrencySelected('');
        }
      }, [showMenu]);


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




<div style={{
display: 'flex', alignItems: 'center', 
justifyContent: 'space-around', 
width: '100vw', height: '70vh', flexDirection: 'column', marginTop: '40px'}}>






<div style={{
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '2px 5px 15px rgba(0, 0, 0, 0.2), -2px 5px 15px rgba(0, 0, 0, 0.2)',
  padding: '10px',
  paddingBottom: '20px',
  width: '90vw'
}}>
<div style={{ display: 'flex',  alignItems: 'center', 
        flexDirection: 'column', color: '#222222', gap: window.innerHeight < 620 ? '1px' : '10px'  }}>
<div style={{display: 'flex', marginTop: '0px'}}>

  <img style={{ width: '180px', height: 'auto'}}src={myfyeWallet}/>

</div>

<div style={{ display: 'flex', alignItems: 'center', 
  justifyContent: 'center', flexDirection: 'column',}}>


    <label htmlFor="deposit" style={{ fontSize: '20px', 
     display: 'flex', alignItems: 'center', }}>
    $ <span style={{ fontSize: '35px' }}>
      
    <div>
    {((usdcSolBalance + usdtSolBalance).toFixed(2)).toLocaleString('en-US')}
  </div>

    </span>
</label>

   </div>




   {/*
   <Deposit/>
    <Withdraw/>
           <HoldingsPortfolio/>
  */}

<div style={{display: 'flex', 
alignItems: 'center', 
                justifyContent: 'space-around',
                marginTop: '0px',
                width: '95vw'}}>

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
           Deposit
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
           Withdraw
       </div>
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
           Wallet Info
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