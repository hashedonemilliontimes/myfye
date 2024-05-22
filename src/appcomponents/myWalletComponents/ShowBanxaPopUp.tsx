import React, { useState, useEffect } from 'react';
import menuIcon from '../../assets/menuIcon.png';
import xIcon from '../../assets/xIconGray2.png';
import { useSelector, useDispatch } from 'react-redux';
import backButton from '../../assets/backButton3.png';
import usdcSol from '../../assets/usdcSol.png';
import usdtSol from '../../assets/usdtSol.png';
import solanaLogo from '../../assets/solanaLogo.png';
import copy from '../../assets/copy.png';
import { useFunding } from "@dynamic-labs/sdk-react-core";
import { setShowBanxaPopUp } from '../../redux/userWalletData';

function ShowBanxaPopUp() {
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch()
    const [currencySelected, setcurrencySelected] = useState('');

    const [addressCopied, setaddressCopied] = useState(false); 
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const [Message, setMessage] = useState('');
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const showBanxaPopUp = useSelector((state: any) => state.userWalletData.showBanxaPopUp);


    const { enabled, openFunding } = useFunding();
  
    const onClick = () => {
      openFunding({
        token: "USDC",
        address: publicKey,
      }).then(() => window.alert("Success!"));
    };
    
      const handleMenuClick = () => {
        // Add your logic here for what happens when the menu is clicked

        setShowMenu(!showMenu);
        
      };

      const closeBanxaPopUp = () => {
        // Add your logic here for what happens when the menu is clicked

        dispatch(setShowBanxaPopUp(false))
        
      };


    return (
        <div style={{ backgroundColor: 'white' }}>

                <div style={{display: 'flex', alignItems: 'center', 
                justifyContent: 'center',}}>
                  
       </div>



<div>{showBanxaPopUp && (
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
        zIndex: 60 // Ensure it's above other content
      }} onClick={closeBanxaPopUp}>


<div style={{
        position: 'fixed',
        top: '30vh',
        left: 0,
        width: '100vw',
        height: '230px',
        background: '#ffffff',
        zIndex: 61
}}> 

<div style={{textAlign: 'center', fontSize: '25px', marginTop: '5px'}}>
  How To Buy Crypto
</div>

<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<div style={{marginTop: '5px', fontSize: '17px', padding: '10px', whiteSpace: 'nowrap', textAlign: 'left'}}>
  MyFye uses Banxa to enable you to<br /> purchase crypto. There are a lot of <br />currencies available on Banxa, however, <br />
  <span style={{fontWeight: 'bold'}}>MyFye is only compatabile with USDC <br />and USDT on the Solana network.</span>
  </div>
  </div>

  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>

  <div style={{
      color: 'white',
      background: '#777777', 
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
  }} onClick={closeBanxaPopUp}  >
      Cancel
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
      fontSize: '20px',
  }} onClick={onClick}>
      Buy Crypto
  </div>


  </div>
</div>

</div>

)}</div>
        </div>
    )
}
export default ShowBanxaPopUp;