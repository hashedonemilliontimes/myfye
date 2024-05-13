import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import xIcon from '../assets/xIconGray2.png';
import { useSelector } from 'react-redux';
import backButton from '../assets/backButton3.png';
import DepositStableCoin from './myWalletComponents/DepositStableCoin';
import WithdrawStableCoin from './myWalletComponents/WithdrawStableCoin';
import DepositFromCreditCard from './myWalletComponents/DepositFromCreditCard';
import myfyeWalletImage from '../assets/myfyeWallet.png';
import QRCode from 'qrcode.react';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

function MyWallet() {
    const [showMenu, setShowMenu] = useState(false);

    const [currencySelected, setcurrencySelected] = useState('');

    const [menuPosition, setMenuPosition] = useState('-110vh'); 
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const [Message, setMessage] = useState('');
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const [showQRCode, setshowQRCode] = useState(false);
    const updatingBalance = useSelector((state: any) => state.userWalletData.updatingBalance);
    const usdcSolBalance = useSelector((state: any) => state.userWalletData.usdcSolBalance);
    const usdtSolBalance = useSelector((state: any) => state.userWalletData.usdtSolBalance);
    const usdyBalance = useSelector((state: any) => state.userWalletData.usdySolBalance);
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
        // Add your logic here for what happens when the menu is clicked

        setShowMenu(!showMenu);
        
      };


      function generateQRCodeURL(publicKey: string) {
        const baseUrl = "https://api.qrserver.com/v1/create-qr-code/";
        const params = new URLSearchParams({
          size: "150x150", // Size of the QR code
          data: publicKey, // Data to encode
        });
        return `${baseUrl}?${params.toString()}`;
      }

    return (
        <div style={{ backgroundColor: 'white' }}>

{ showMenu && (
<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      padding: '15px',
      cursor: 'pointer',
      zIndex: 3    
    }}>

            <img style={{width: 'auto', height: '45px', background: 'white'}} src={ showMenu ? (
                currencySelected ? backButton : xIcon) : menuIcon }
            onClick={handleMenuClick} alt="Exit" />
            </div>)}

                <div style={{display: 'flex', alignItems: 'center', 
                justifyContent: 'center',
                marginTop: '0px'}}>
            <div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
           height: '40px', 
           width: '210px',
           display: 'flex',        // Makes this div also a flex container
           justifyContent: 'center', // Centers the text horizontally inside the button
           alignItems: 'center',// Centers the text vertically inside the button
           cursor: 'pointer',
           fontSize: '20px'     
       }} onClick={handleMenuClick}>
           View Wallet
       </div>
       </div>

      <div style={{
        position: 'absolute',
        top: menuPosition,
        left: 0, // Use state variable for position
        padding: '15px',
        height: '90vh',
        backgroundColor: 'white',
        width: '92vw',
        transition: 'top 0.5s ease', // Animate the left property
      }}>

<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<img src = {myfyeWalletImage} style= {{marginTop: '30px', width: '50vw', maxWidth: '270px', height: 'auto'}}></img>
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
    <span style={{ fontSize: '25px' }}>{(usdyBalance).toFixed(6)}</span>
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
  {((usdyBalance + usdcSolBalance + usdtSolBalance) > 0.001) ? (
  <span style={{ fontSize: '25px' }}>{(usdyBalance + usdcSolBalance + usdtSolBalance).toFixed(6)}</span>
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

<DepositFromCreditCard/>
<WithdrawStableCoin/>
</div>


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
<DepositStableCoin/>
<WithdrawStableCoin/>
</div>

<div style={{fontSize: '25px', marginTop: '15px',}}>Internal Wallet</div>

<div style={{marginTop: '15px', maxWidth: '250px'}}></div>
<DynamicWidget />


</div>

                  </div> 


        </div>
    )
}
export default MyWallet;