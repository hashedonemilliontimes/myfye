import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import xIcon from '../assets/xIconGray2.png';
import { DynamicContextProvider, DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useSelector } from 'react-redux';
import MyWallet from './WalletPage';
import userImage from '../assets/user.png';
import { useDispatch } from 'react-redux';
import { setShowProfileMenu } from '../redux/userWalletData';

function Menu() {

  const showMenu = useSelector((state: any) => state.userWalletData.showProfileMenu);
    const [menuPosition, setMenuPosition] = useState('-70vw'); 
    const currentUserFirstName = useSelector((state: any) => state.userWalletData.currentUserFirstName);
    const currentUserLastName = useSelector((state: any) => state.userWalletData.currentUserLastName);
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
  const dispatch = useDispatch()

    useEffect(() => {
        if (showMenu) {
          setMenuPosition('0'); // Bring the menu into view
        } else {
          setMenuPosition('-100vw'); // Move the menu off-screen
        }
      }, [showMenu]);
    
      const handleMenuClick = () => {
        // Add your logic here for what happens when the menu is clicked
        dispatch(setShowProfileMenu(!showMenu))
        
      };

    return (
        <div style={{ backgroundColor: 'white', overflow: 'hidden' }}>

        <div>
                    </div>

<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      cursor: 'pointer',
      width: showMenu ? '40vw' : '0', // Cover the right side when the menu is open
      zIndex: 21,     // Add some padding for spacing from the edges
      overflow: 'hidden'
    }}>

<div style={{
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: 'transparent',
  zIndex: 21
}} onClick={() => handleMenuClick()} />

      { showMenu && (
        <div>
                    <img style={{width: '45px', height: '45px', 
                    marginLeft: '15px', marginTop: '15px'}} src={ xIcon}
                    onClick={handleMenuClick} alt="Menu" />
                    </div>
      )}

            </div>

            {menuPosition == '0' && (
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0, 
            backgroundColor: 'white',
            width: '40vw',
            background: 'transparent'
          }} onClick={handleMenuClick}>

          </div>
        )}

      <div style={{
        position: 'absolute',
        top: 0,
        left: menuPosition, // Use state variable for position
        padding: '15px',
        backgroundColor: '#ffffff',
        height: '99vh',
        width: '60vw',
        transition: 'left 0.5s ease', // Animate the left property
        zIndex: 20,
        overflow: 'hidden'
      }}>



<div style={{ display: 'flex', alignItems: 'center', 
      flexDirection: 'column', justifyContent: 'center', 
       }}>

        <div style={{fontWeight: 'bold', fontSize: '18px', marginTop: '110px' }}>{currentUserFirstName} {currentUserLastName}</div>
        

        <div style={{ fontSize: '13px'}}>{currentUserEmail}</div>

        <div style={{marginTop: '50px'}}>
        <DynamicWidget />
        </div>

        </div>


        <div style={{ marginTop: 'calc(80vh - 425px)' }}>
          <div>
        <MyWallet/>
        </div>

        <div style = {{marginTop: '40px'}}>
          
        </div>
        </div>



                  </div> 


        </div>
    )
}

export default Menu;