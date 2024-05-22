import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import userImage from '../assets/user.png';
import home from '../assets/home.png';
import dollarSign from '../assets/dollarSign.png';
import wallet from '../assets/wallet.png';
import history from '../assets/history.png';
import cash from '../assets/cash.png';
import { setShowPayPage, setShowEarnPage, setShowWalletPage,
  setShowAccountHistory,
  setShouldShowBottomNav
 } from '../redux/userWalletData';
import EarnPage from '../appcomponents/EarnPage';


function BottomNav() {

    const shouldShowBottomNav = useSelector((state: any) => state.userWalletData.shouldShowBottomNav );

    const dispatch = useDispatch()

    const [showMenu, setShowMenu] = useState(false);
    
      const handlePayPageClick = () => {
        // Add your logic here for what happens when the menu is clicked
        
        dispatch(setShowPayPage(true))
      };


      const handleEarnPageClick = () => {
        dispatch(setShowEarnPage(true))
        
      };

      const handleWalletPageClick = () => {
        dispatch(setShowWalletPage(true))
        
      };

      const handleAccountHistory = () => {
        dispatch(setShowAccountHistory(true))
      };


      return (
        <div>
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px', // Adjust height as needed
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          backgroundColor: 'white',
          borderTop: '1px solid #ccc', // Optional border for better visibility
          zIndex: 2
        }}>
          <img src={dollarSign} alt="Nav 1" style={{ width: '40px', height: 'auto' }} 
          onClick={handleEarnPageClick}/>
          <img src={cash} alt="Nav 3" style={{ width: '40px', height: 'auto' }}
          onClick={handlePayPageClick}/>
          <img src={home} alt="Nav 3" style={{ width: '44px', height: 'auto' }} />
          <img src={wallet} alt="Nav 4" style={{ width: '40px', height: 'auto' }} 
          onClick={handleWalletPageClick}/>
          <img src={history} alt="Nav 5" style={{ width: '40px', height: 'auto' }} 
          onClick={handleAccountHistory}/>
        </div>
        </div>
      );
}

export default BottomNav;