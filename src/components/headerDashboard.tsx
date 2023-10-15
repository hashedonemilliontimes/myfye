import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { setLanguage } from '../helpers/languageManager';
import { LanguageCodeProps } from '../helpers/languageManager';
import menuIconWhite from '../assets/menuIconWhite.png';
import menuIconGray2 from '../assets/menuIconGray2.png';
import xIconWhite from '../assets/xIconWhite.png';
import xIconGray2 from '../assets/xIconGray2.png';
import userIconWhite from '../assets/userIconWhite.png';
import userIconGray2 from '../assets/userIconGray2.png';
import { getAuth } from "firebase/auth";
import SignOutButton from './authentication/signOut';
import ConnectWallet from './connectWallet';
//import { fetchWeb3EthUserBalance } from '../helpers/web3Manager';
import PhantomImage from '../assets/PhantomImage.png';
import { useSelector, useDispatch } from 'react-redux';
import WalletIcon from './walletIcon';
import { setWalletConnected, setWalletType, setCrypto } from '../redux/userWalletData';
import crypto from '../helpers/cryptoDataType';

interface colorProps {
  color: 'light' | 'dark';
}

interface HeaderDashboardProps {
  languageProps: LanguageCodeProps;
  colorProps: colorProps;
}

export default function HeaderDashboard({ languageProps, colorProps }: HeaderDashboardProps) {

  const [navMenuVisible, setNavMenuVisible] = useState(false);
  const [globeVisible, setGlobeVisible] = useState(false);
  const [showAdministerWalletWalletMenu, setshowAdministerWalletWalletMenu] = useState(false);
  const walletConnected = useSelector((state: any) => state.userWalletData.isConnected);
  const cryptoList = useSelector((state: any) => state.userWalletData.cryptoList);

  const navigate = useNavigate();
  const auth=getAuth();
  const dispatch = useDispatch();

  const [uid, setUID] = useState('');
  
  const [connectedWalletHovered, setConnectedWalletHovered] = useState(false);

  useEffect(() => {
    try {
      const theUserID = auth.currentUser?.uid;
      setUID(theUserID!);
    } catch {
        //user not validated
      }
    }, []);

  const toggleNavMenu = () => {
    setNavMenuVisible(!navMenuVisible);
  };


  // Function to handle changes in authentication state
  const handleAuthStateChanged = (user: any) => {
    if (user) {
  
      setGlobeVisible(false);
      setUID(user.uid);
    } else {
      setGlobeVisible(true);
      setUID(""); // No user, so reset the UID
    }
  };

  

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged);

    // Clean up the listener when the component unmounts

    return () => unsubscribe();
  }, []);


  const handleDisconnectWalletClicked = () => {
    dispatch(setWalletConnected(false));
    const emptyCrypto: crypto = { address:'', balanceNative:0, balanceUSD:0, type:''};
    dispatch(setCrypto([emptyCrypto]));
    dispatch(setWalletType(''));
    setshowAdministerWalletWalletMenu(false);

    window.location.reload();
  };

  const handleChangeWalletClicked = () => {
    dispatch(setWalletConnected(false));
    const emptyCrypto: crypto = { address:'', balanceNative:0, balanceUSD:0, type:''};
    dispatch(setCrypto([emptyCrypto]));
    dispatch(setWalletType(''));
    setshowAdministerWalletWalletMenu(false);
    window.location.reload();
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px', // Adjust padding as needed
        }}
      >
      <div style={{ color: colorProps.color === 'light' ? 'white' : '#333333', cursor: 'pointer', 
      fontSize: window.innerWidth < 768 ? '32px' : '50px' }}
      onClick={() => {
        navigate(`/${languageProps.language}/`);
        setNavMenuVisible(false); // Close the menu when a link is clicked
      }}>Ependesi</div>
        {/* Conditionally render links or menu button based on screen width */}

        <div style={{ flex: 1 }}></div>


          {window.innerWidth < 768 ? (
            <>{/* Responsive Header Buttons */}
                          <div 
              style={{ cursor: 'pointer' }}
              onClick={toggleNavMenu}
            >
                <ConnectWallet/>
            </div>

            </>
            ) : (
        
            <>{/* Full Size Nav menu */}
              <span
              >

              {walletConnected ? (

                <div>
                  <div 
                    onClick={() => setshowAdministerWalletWalletMenu(true)}
                    onMouseEnter={() => setConnectedWalletHovered(true)}
                    onMouseLeave={() => setConnectedWalletHovered(false)}          
                  style={{display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center',
                    cursor: 'pointer', background: '#CCCCCC', borderRadius: '10px', 
                    paddingLeft: '10px', paddingRight: '10px',
                    border: connectedWalletHovered ? '1px solid blue' : '1px solid transparent'}}>
                      <WalletIcon type={'Phantom'}/>

                      <div style={{fontSize: '20px'}}>
                      {cryptoList && cryptoList.length > 0 ? (
                        <div>
                          {`${cryptoList[0].address.substring(0, 4)}...${cryptoList[0].address.substring(cryptoList[0].address.length - 4)}`}
                        </div>
                      ) : (
                        <div>No address available</div>
                      )}
                      </div>


                  </div>
                </div>      

              ) : (<ConnectWallet/>)}
                
              </span>
            </>
          )}
        </div>

      {/* Responsive menu */}
      {navMenuVisible && (
        <div
          style={{
            position: 'fixed',
            top: 70,
            left: 0,
            height: '100vh',
            width: '100vw',
            overflowY: 'auto',
            backgroundColor: 'white', // Background color for the menu
            zIndex: 1, // Ensure the menu is above other content
          }}
        >
          <div style={{ display: 'flex',
            flexDirection: 'column',
            justifyContent: 'left',
            fontSize: '25px',
            gap: '35px',
            color: '#333333',
            marginTop: '35px',
            marginLeft: '35px',
            cursor: 'pointer'
            }}>

          <div                   

          onClick={() => {
                    navigate(`/${languageProps.language}/dashboard`);
                    setNavMenuVisible(false); // Close the menu when a link is clicked
                  }}>
              Dashboard
              </div>

                  {walletConnected ? (
<></>
                  ) : (
                    <div>
                    <ConnectWallet/>
                    </div>
                  )}


              <div>About</div>
              <div>Contact Us</div>

                {uid && (<SignOutButton language = {languageProps.language}/>)}
              
              </div>
        </div>
      )}


      {showAdministerWalletWalletMenu && (
        <div>
        <div 
        onClick={() => setshowAdministerWalletWalletMenu(false)}
        style={{
          position: 'absolute',
          top: '0px',
          bottom: '0px',
          right: '0px',
          left: '0px',}}></div>
        <div style={{
          position: 'absolute',
          right: '20px', // 20 pixels from the right
          top: '80px', // 60 pixels from the top
          backgroundColor: '#ffffff',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
          borderRadius: '5px',
          padding: '15px',
          zIndex: 1 // to make sure it appears on top of other elements
        }}>
          <div style={{display: 'flex', flexDirection: 'row', 
          gap: '10px', fontSize: '22px'}}>
            <div style={{background: '#CCCCCC', border: '10px', cursor: 'pointer', 
            padding: '5px', borderRadius: '5px', width: '150px', textAlign: 'center'}}>Change Wallet</div>
            <div 
            onClick={() => handleDisconnectWalletClicked()}
            style={{background: '#CCCCCC', border: '10px', cursor: 'pointer',
            padding: '5px', borderRadius: '5px', width: '150px', textAlign: 'center'}}>Disconnect</div>
          </div>
        </div>
        </div>
      )}



    </div>

  );
}
