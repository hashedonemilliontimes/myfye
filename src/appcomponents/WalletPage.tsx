import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import { useSelector, useDispatch } from 'react-redux';
import backButton from '../assets/backButton3.png';
import DepositStableCoin from './myWalletComponents/DepositStableCoin';
import WithdrawStableCoin from './myWalletComponents/WithdrawStableCoin';
import ShowBanxaPopUp from './myWalletComponents/ShowBanxaPopUp';
import myfyeWalletImage from '../assets/myfyeWallet.png';
import QRCode from 'qrcode.react';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { setShouldShowBottomNav, setShowWithdrawStablecoinPage, 
  setShowBanxaPopUp, setShowDepositStablecoinPage,
setShowWalletPage, setShowWalletDepositPage } from '../redux/userWalletData';
import history from '../assets/history.png';
import WalletTransactions from './WalletTransactions';

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
        const url = `https://solscan.io/account/${publicKey}`;
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
        padding: '15px',
        height: '90vh',
        backgroundColor: 'white',
        width: '94vw',
        overflowX: 'hidden',
        overflowY: 'hidden',
        transition: 'top 0.5s ease', // Animate the left property
        zIndex: 3
      }}>



<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<img src = {myfyeWalletImage} style= {{marginTop: '0px', width: '50vw', maxWidth: '270px', height: 'auto'}}></img>
</div>



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
<img src={history} style={{height: '39px', width: '39px'}} onClick={toggleShowTransactionHistory}/>
</div>




<div>




<div style={{
display: 'flex', alignItems: 'center', 
justifyContent: 'center', gap: '20px',
width: '90vw', height: '75vh', flexDirection: 'column'}}>


  <div style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '15px'}}>
    
    <div style= {{fontSize: '18px', marginTop: '6px'}}>Wallet balance:</div>
    <div>
    <div style={{ fontSize: '18px' }}>
    <span style={{ fontSize: '18px' }}>$</span>
    {((usdcSolBalance + usdtSolBalance) > 0.00001) ? (
    <span style={{ fontSize: '25px' }}>{(usdcSolBalance + usdtSolBalance).toFixed(6)}</span>
    ) : (
      <span style={{ fontSize: '25px' }}>0.00</span>
    )}
</div>
      
      </div>


      </div>




<div style={{
display: 'flex', alignItems: 'center', 
justifyContent: 'space-around', 
width: '90vw',}}>



<div style={{
      color: 'white',
      background: '#60A05B', 
      fontWeight: 'bold',
      borderRadius: '10px', 
      border: 'none', 
      height: '40px', 
      width: '130px',
      display: 'flex',        // Makes this div also a flex container
      justifyContent: 'center', // Centers the text horizontally inside the button
      alignItems: 'center',// Centers the text vertically inside the button
      cursor: 'pointer',
      fontSize: '20px',
  }} onClick={handleDepositButtonClick}  >
      Deposit
  </div>



<div style={{display: 'flex', alignItems: 'center', 
                justifyContent: 'center',}}>
  <div style={{
      color: 'white', 
      background: '#60A05B', 
      fontWeight: 'bold',
      borderRadius: '10px', 
      border: 'none', 
      height: '40px', 
      width: '130px',
      display: 'flex',        // Makes this div also a flex container
      justifyContent: 'center', // Centers the text horizontally inside the button
      alignItems: 'center',// Centers the text vertically inside the button
      cursor: 'pointer',
      fontSize: '20px'     
  }} onClick={handleWithdrawButtonClick}>
      Withdraw
  </div>
       </div>

</div>



<div style={{width: '110px', height: '110px', marginTop: '40px'}}>
<QRCode value={publicKey} size={110} level="H" />
</div>



<div>
<div style={{
           color: '#ffffff', 
           background: '#60A05B', // gray '#999999', 
           borderRadius: '10px', 
           border: 'none', 
           fontWeight: 'bold',
           cursor: 'pointer',
           fontSize: '20px',
           padding: '9px',
           width: '180px',
           textAlign: 'center'
       }} onClick={handleWalletPortfolioClick}>
          Portfolio
       </div>

       <div style={{
           color: '#ffffff', 
           background: '#60A05B', // gray '#999999', 
           borderRadius: '10px', 
           border: 'none', 
           fontWeight: 'bold',
           cursor: 'pointer',
           fontSize: '20px',
           padding: '9px',
           width: '180px',
           textAlign: 'center',
           marginTop: '15px'
       }} onClick={handleWalletExplorerClick}>
           Explorer
       </div>
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