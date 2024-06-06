import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import userImage from '../assets/user.png';
import home from '../assets/home.png';
import dollarSign from '../assets/dollarSign.png';
import wallet from '../assets/wallet.png';
import history from '../assets/history.png';
import cash from '../assets/cash.png';
import { setShowPayPage, setShowEarnPage, setShowWalletPage,
  setShowAccountHistory, setShowProfileMenu,
  setShouldShowBottomNav
 } from '../redux/userWalletData';
import EarnPage from '../appcomponents/EarnPage';
import Menu from '../appcomponents/menu';

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

      const handleProfileMenuClick = () => {
        dispatch(setShowProfileMenu(true))
      };

      const [animate, setAnimate] = useState(false);

      const handleHomePageClick = () => {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 500); // Animation duration
      };
    
      const animationStyle = `
      @keyframes growShrink {
        0% {
          box-shadow: 0 0 0 0 rgba(0, 128, 0, 0.7);
          background-color: rgba(0, 128, 0, 0.7);
        }
        50% {
          box-shadow: 0 0 20px 20px rgba(0, 128, 0, 0.0);
          background-color: rgba(0, 128, 0, 0.0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(0, 128, 0, 0.0);
          background-color: rgba(0, 128, 0, 0.0);
        }
      }
  
      .grow-shrink-animation {
        animation: growShrink 0.5s ease-in-out;
      }
    `;
  

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
          <div style={{
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center'}}
            onClick={handleEarnPageClick}>
          <img src={dollarSign} alt="Nav 1" style={{ width: '40px', height: 'auto' }}/>
          <div>Earn</div>
          </div>
          <div style={{
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center'}}
            onClick={handlePayPageClick}>
          <img src={cash} alt="Nav 3" style={{ width: '40px', height: 'auto' }}/>
          <div>Pay</div>
          </div>


          <div>
      <style>{animationStyle}</style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
          ...(animate ? { animation: 'growShrink 0.5s ease-in-out' } : {})
        }}
        onClick={handleHomePageClick}
      >
        <img
          src={home}
          alt="Nav 3"
          style={{
            width: '44px',
            height: 'auto'
          }}
        />
        <div>Home</div>
      </div>
    </div>



          <div style={{
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center'}}
            onClick={handleWalletPageClick}>
          <img src={wallet} alt="Nav 4" style={{ width: '40px', height: 'auto' }}/>
          <div>Wallet</div>
          </div>
          <div style={{
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center'}}
            onClick={handleProfileMenuClick}>
          <img src={userImage} alt="Nav 4" style={{ width: '40px', height: 'auto' }} />
          <div>Profile</div>
          </div>
        </div>
        </div>
      );
}

export default BottomNav;