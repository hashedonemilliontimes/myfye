import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import userImage from '../assets/user.png';
import home from '../assets/home.png';
import cash from '../assets/cash.png';
import dollarSign from '../assets/dollarSign.png';
import wallet from '../assets/wallet.png';
import history from '../assets/history.png';

function BottomNav() {

    const [showMenu, setShowMenu] = useState(false);
    
      const handleMenuClick = () => {
        // Add your logic here for what happens when the menu is clicked
        setShowMenu(!showMenu);
        
      };

      return (
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
          borderTop: '1px solid #ccc' // Optional border for better visibility
        }}>
          <img src={dollarSign} alt="Nav 1" style={{ width: '40px', height: 'auto' }} />
          <img src={cash} alt="Nav 2" style={{ width: '40px', height: 'auto' }} />
          <img src={home} alt="Nav 3" style={{ width: '44px', height: 'auto' }} />
          <img src={wallet} alt="Nav 4" style={{ width: '40px', height: 'auto' }} />
          <img src={history} alt="Nav 5" style={{ width: '40px', height: 'auto' }} />
        </div>
      );
}

export default BottomNav;