import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import xIcon from '../assets/xIconGray2.png';
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
setShowWalletPage } from '../redux/userWalletData';
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



      const handleWithdrawStableCoinClick = () => {
        // Add your logic here for what happens when the menu is clicked
        dispatch(setShouldShowBottomNav(false));
        dispatch(setShowWithdrawStablecoinPage(true))
        
      };

      const handleBanxaPopUpClick = () => {
        // Add your logic here for what happens when the menu is clicked
        
        dispatch(setShowBanxaPopUp(true))
        
      };

      const handleDepositStableCoinClick = () => {
        // Add your logic here for what happens when the menu is clicked
        dispatch(setShouldShowBottomNav(false));
        dispatch(setShowDepositStablecoinPage(true))
        
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
      

    return (
        <div style={{ backgroundColor: 'white' }}>

{ showMenu && (
<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      padding: '15px',
      cursor: 'pointer',
      zIndex: 4
    }}>

            <img style={{width: 'auto', height: '45px', background: 'white'}} src={ showMenu ? (
                currencySelected ? backButton : showTransactionHistory ? backButton : xIcon) : menuIcon }
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
        minHeight: 'calc(100vh - 35px)',
        height: '100%',
        backgroundColor: 'white',
        width: '92vw',
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
<img src={history} style={{height: '45px', width: '45px'}} onClick={toggleShowTransactionHistory}/>
</div>




<div>




<div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', paddingLeft: '15px', paddingRight: '15px' }}>

  <div style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
    
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

      <div style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '15px'}}>

  <div style= {{fontSize: '18px', marginTop: '6px'}}>Earn balance:</div>

{updatingBalance ? (
<div style={{ fontSize: '25px' }}>
  Updating
</div>

) : (
  <div>
    <div style={{ fontSize: '18px' }}>
    <span style={{ fontSize: '18px' }}>$</span>
    {((usdyBalance) > 0.001) ? (
    <span style={{ fontSize: '25px' }}>{(usdyBalance*priceOfUSDYinUSDC).toFixed(6)}</span>
    ) : (
      <span style={{ fontSize: '25px' }}>0.00</span>
    )}
</div>
      
      </div>
)}


</div>


<div style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '15px'}}>

<div style= {{fontSize: '18px', marginTop: '6px', fontWeight: 'bold'}}>Total balance:</div>

<div>
  <div style={{ fontSize: '18px' }}>
  <span style={{ fontSize: '18px' }}>$</span>
  {((usdyBalance*priceOfUSDYinUSDC + usdcSolBalance + usdtSolBalance) > 0.001) ? (
  <span style={{ fontSize: '25px' }}>{(usdyBalance*priceOfUSDYinUSDC + usdcSolBalance + usdtSolBalance).toFixed(6)}</span>
  ) : (
    <span style={{ fontSize: '25px' }}>0.00</span>
  )}
</div>
    
    </div>

</div>

</div>


<div style={{marginTop: '15px', 
display: 'flex', alignItems: 'center', 
justifyContent: 'space-around', width: '90vw'}}>



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
  }} onClick={handleBanxaPopUpClick}  >
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
  }} onClick={handleWithdrawStableCoinClick}>
      Withdraw
  </div>
       </div>

</div>





<div style={{display:'flex', 
  flexDirection: 'column', 
  justifyContent: 'space-around',
  height: 'calc(100vh - 320px)'}}>
<div>
<div style={{fontSize: '25px', marginTop: '15px',}}>Crypto Wallet</div>

<div style={{marginTop: '15px', 
display: 'flex', alignItems: 'center', 
justifyContent: 'space-around', width: '90vw'}}>

<div style={{width: '70px', height: '70px'}} onClick={() => setshowQRCode(true)}>
<QRCode value={publicKey} size={70} level="H" />
</div>

</div>


<div>{showQRCode && (
<div       style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10 // Ensure it's above other content
      }} onClick={() => setshowQRCode(false)}>


<div style={{
        position: 'fixed',
        top: '30vh',
        left: 0,
        width: '100vw',
        height: '210px',
        background: '#ffffff',
        zIndex: 11
}}> 

<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '5px'}}>
<div style={{width: '200px', height: '200px'}} onClick={() => setshowQRCode(true)}>
<QRCode value={publicKey} size={200} level="H" />
</div>
</div>
</div>
</div>)}
</div>




<div style={{marginTop: '15px', 
display: 'flex', alignItems: 'center', 
justifyContent: 'space-around', width: '90vw'}}>

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
  }} onClick={handleDepositStableCoinClick}>
      Deposit
  </div>


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
  }} onClick={handleWithdrawStableCoinClick}>
      Withdraw
  </div>

</div>
</div>

<div>
<div style={{fontSize: '25px', marginTop: '15px',}}>Internal Wallet</div>

<div style={{marginTop: '15px', marginLeft: '20px', width: '220px'}}>
<DynamicWidget />
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