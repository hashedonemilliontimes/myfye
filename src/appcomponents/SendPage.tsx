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

    const showSendPage = useSelector((state: any) => state.userWalletData.showSendPage);
    
    const { primaryWallet, user } = useDynamicContext();

    const [menuPosition, setMenuPosition] = useState('-130vh'); 
    const usdcSolBalance = useSelector((state: any) => state.userWalletData.usdcSolBalance);
    const usdtSolBalance = useSelector((state: any) => state.userWalletData.usdtSolBalance);

    const dispatch = useDispatch();

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



    </div>


                  </div> 

                  </div>
    )
}

export default SendPage;

