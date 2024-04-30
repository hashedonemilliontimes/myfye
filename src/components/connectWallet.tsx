import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhantomImage from '../assets/PhantomImage.png';
import SolflareImage from '../assets/SolflareImage.jpg';
import ExodusImage from '../assets/ExodusImage.jpg';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setWalletConnected, setWalletType, setCrypto, setWalletPubKey } from '../redux/userWalletData';
import { initializePhantomConnection, fetchUSDCBalance, fetchSolBalance } from '../helpers/web3Manager';
import xIconGray2 from '../assets/xIconGray2.png';
import crypto from '../helpers/cryptoDataType';
import { getPrincipalInvested } from '../helpers/getPrincipalInvested';

//import { signMessageWithMetaMask } from '../helpers/web3Manager';


interface ConnectWalletProps {
  // Add any additional props here
}

export default function ConnectWallet() {
  const dispatch = useDispatch();

    const navigate = useNavigate();
    const [showConnectWalletMenu, setshowConnectWalletMenu] = useState(false);
    const isSmallScreen = window.innerWidth <= 768;

    const [connectMenuHovered, setConnectMenuHovered] = useState(false);
    const [responsiveNavMenuHovered, setResponsiveNavMenuHovered] = useState(false);

    const toggleConnectWalletMenu = () => {
        setshowConnectWalletMenu(!showConnectWalletMenu);
      };

      const handlePhantomClicked = async () => {
        try {
          const address = await initializePhantomConnection();

          const usdcbalanceNative: number = await fetchUSDCBalance(address);
          const usdcbalanceUSD: number = usdcbalanceNative;

          const solanabalanceNative: number = await fetchSolBalance(address);
          const solanabalanceUSD: number = (solanabalanceNative*18.0); // TO DO get realtime price
          
          if (address && usdcbalanceNative !== undefined) { // usdcBalance can be 0, which is falsy
            const usdc: crypto = { address, balanceNative: usdcbalanceNative, 
              balanceUSD: usdcbalanceUSD, type: "USDC" };
            const solana: crypto = { address, balanceNative: solanabalanceNative, balanceUSD: solanabalanceUSD, type: "Solana" }
            const gotPrincipalInvested = await getPrincipalInvested(address, dispatch);
            dispatch(setWalletConnected(true));
            dispatch(setCrypto([usdc, solana]));
            dispatch(setWalletType('Phantom'));
            console.log('Setting pubkey: ', address)
            dispatch(setWalletPubKey(address));
            
          }
        } catch (err) {
          console.error('Error:', err);
        }
      };

      const handleSolflareClicked = () => {

        
      };

      const handleExodusClicked = () => {

        
      };

  
      if (isSmallScreen) {
        return (
          <div>

            <div 
              onClick={() => {
                toggleConnectWalletMenu();
              }}
              style={{
              fontSize: '20px',
              border: '1px solid transparent',
              borderRadius: '10px',
              paddingTop: '10px',
              paddingBottom: '10px',
              paddingLeft: '7px',
              paddingRight: '7px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: '15px',
              background: connectMenuHovered ? '#333333' : 'rgb(51, 51, 51, 0.2)',
              color: connectMenuHovered ? 'white' : '#333333',
              }}
              onMouseEnter={() => setConnectMenuHovered(true)}
              onMouseLeave={() => setConnectMenuHovered(false)}>
              Connect
            </div>


            {showConnectWalletMenu && (
              <div
                style={{
                  position: 'fixed',
                  top: 105,
                  left: 0,
                  height: '100vh',
                  width: '100vw',
                  overflowY: 'auto',
                  backgroundColor: 'white',
                  zIndex: 1,
                }}
              >

                {/* Add your menu content here */}


                <div style={{ 
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    position: 'relative',
    marginTop: '50px'
}}>

    <div style={{ 
        fontSize: '32px', 
        color: '#333333', 
        textAlign: 'center', 
        flex: 1
    }}>
        Connect A Wallet
    </div>

    <div style={{ 
        color: '#333333', 
        padding: '15px', 
        cursor: 'pointer', 
        fontSize: '55px', 
        position: 'absolute', 
        right: 0, 
        top: '50%', 
        transform: 'translateY(-50%)' 
    }} onClick={toggleConnectWalletMenu}>
        <img
            src={xIconGray2}
            alt=""
            style={{
                width: '45px', // Set the desired width
                height: '45px', // Set the desired height
                color: 'white'
            }}
        />
    </div>
</div>




                <div style={{marginLeft: '15px', marginTop: '45px',
                    display: 'flex', flexDirection: 'row', gap: '20px',
                    alignItems: 'center', cursor: 'pointer'}}
                    onClick={handlePhantomClicked}
                    >
                    <img
                        src={PhantomImage}
                        alt=""
                        style={{
                        width: '45px', // Set the desired width
                        height: '45px', // Set the desired height
                        color: 'white'
                        }}
                    />

                    <div style={{fontSize: '22px'}}>Phantom</div>
                </div>





              </div>
            )}

          </div>
        );
      }

      return (
        <>

        
          {showConnectWalletMenu && (
            <div
              style={{
                width: '100vw',
                height: '100vh',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                position: 'fixed',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                cursor: 'auto'
              }}
              onClick={toggleConnectWalletMenu}
            >
              <div
                style={{
                  color: '#333333',
                  backgroundColor: '#FFFFFF',
                  fontSize: '22px',
                  padding: '10px',
                  borderRadius: '8px',
                  width: '600px',
                  height: '400px'

                }}
                onClick={(e) => e.stopPropagation()}
              >


                <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px', // Add padding for spacing
                }}
                >
                <div style={{ flex: '1', fontSize: '34px', color: '#333333', textAlign: 'center', 
                    marginLeft: '70px' }}>
                    Connect A Wallet
                </div>
                <span
                    onClick={toggleConnectWalletMenu}
                    style={{ cursor: 'pointer', paddingRight: '25px' }}
                >
                    <img
                    src={xIconGray2}
                    alt="Close Menu"
                    style={{
                        width: '40px', // Set the desired width
                        height: '40px', // Set the desired height
                        color: 'black',
                    }}
                    />
                </span>
                </div>




                <div style={{marginLeft: '15px', marginTop: '45px',
                    display: 'flex', flexDirection: 'row', gap: '20px',
                    alignItems: 'center', cursor: 'pointer'}}
                    onClick={handlePhantomClicked}
                    >
                    <img
                        src={PhantomImage}
                        alt="Close Menu"
                        style={{
                        width: '45px', // Set the desired width
                        height: '45px', // Set the desired height
                        color: 'white'
                        }}
                    />

                    <div>Phantom</div>
                </div>

              </div>
            </div>
          )}


                  <div 
                    onMouseEnter={() => setConnectMenuHovered(true)}
                    onMouseLeave={() => setConnectMenuHovered(false)}
                    style={{display: 'flex', flexDirection: 'row', 
                    alignItems: 'center', fontSize: '24px', color: 'white',
                    cursor: 'pointer', gap: '10px'}}
                    onClick={() => {
                      toggleConnectWalletMenu();
                    }}>
                    

                    <div 
                        style={{
                        fontSize: '25px',
                        borderRadius: '10px',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        paddingLeft: '35px',
                        paddingRight: '35px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        background: connectMenuHovered ? '#333333' : 'rgb(51, 51, 51, 0.2)',
                        color: connectMenuHovered ? 'white' : '#333333',
                        
                        }}
                        onMouseEnter={() => setConnectMenuHovered(true)}
                        onMouseLeave={() => setConnectMenuHovered(false)}>
                        Connect
                    </div>


              </div>


        </>
      );
      
      
      
};
