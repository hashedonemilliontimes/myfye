import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { setLanguage } from '../helpers/languageManager';
import GlobeMenu from './globeMenu';
import { LanguageCodeProps } from '../helpers/languageManager';
import menuIconWhite from '../assets/menuIconWhite.png';
import menuIconGray2 from '../assets/menuIconGray2.png';
import xIconWhite from '../assets/xIconWhite.png';
import xIconGray2 from '../assets/xIconGray2.png';
import userIconWhite from '../assets/userIconWhite.png';
import userIconGray2 from '../assets/userIconGray2.png';
import aboutIconWhite from '../assets/aboutIconWhite.png'
import aboutIconGray from '../assets/aboutIconGray.png'
import { getAuth } from "firebase/auth";
import SignOutButton from './authentication/signOut';
import ConnectWallet from './connectWallet';
import { useSelector, useDispatch } from 'react-redux';
//import { fetchWeb3EthUserBalance } from '../helpers/web3Manager';
import PhantomImage from '../assets/PhantomImage.png';
import WalletIcon from './walletIcon';
import { setWalletConnected, setWalletType, setAllCryptos } from '../redux/userWalletData';
import crypto from '../helpers/cryptoDataType';
import MyFye1Gray from '../assets/MyFye1Gray.png';
import MyFye1Rainbow from '../assets/MyFye1Rainbow.png';

interface colorProps {
  color: 'light' | 'dark';
}

interface headerPageProps {
  page: 'about' | 'dashboard' | 'home';
}

interface HeaderProps {
  languageProps: LanguageCodeProps;
  colorProps: colorProps;
  pageProps: headerPageProps;
}

export default function Header({ languageProps, colorProps, pageProps }: HeaderProps) {

  const [navMenuVisible, setNavMenuVisible] = useState(false);
  const [globeVisible, setGlobeVisible] = useState(false);
  const [aboutHovered, setAboutHovered] = useState(false);
  const [showAdministerWalletWalletMenu, setshowAdministerWalletWalletMenu] = useState(false);
  const walletConnected = useSelector((state: any) => state.userWalletData.isConnected);
  const cryptoList = useSelector((state: any) => state.userWalletData.cryptoList);
  const navigate = useNavigate();
  const auth=getAuth();
  const [connectedWalletHovered, setConnectedWalletHovered] = useState(false);
  const [uid, setUID] = useState('');
  const dispatch = useDispatch();
  const [dashboardMenuHovered, setDashboardMenuHovered] = useState(false);
  const [responsiveNavMenuHovered, setResponsiveNavMenuHovered] = useState(false);


  const [isScrolledToTop, setIsScrolledToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 0) {
        setIsScrolledToTop(true);
      } else {
        setIsScrolledToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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


  function isSafari() {
    return /Safari/.test(window.navigator.userAgent) && !/Chrome/.test(window.navigator.userAgent);
}

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




  useEffect(() => {
    if (navMenuVisible) {
      setGlobeVisible(false);
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      if (uid) {
        setGlobeVisible(false);
      } else {
        setGlobeVisible(true);
      }
      document.body.style.overflow = 'auto'; // Enable scrolling
    }
  
    // Clean up the effect
    return () => {
      document.body.style.overflow = 'auto'; // Ensure scrolling is re-enabled when the component unmounts
    };
  }, [navMenuVisible, uid]);


  //Web Menu
  const [showWebMenu, setShowWebMenu] = useState(false);
  const [hoveredItem, setWebMenuHoveredItem] = useState('');

  const handleMouseEnterWebMenu = () => {
    setShowWebMenu(true);
  };

  const handleMouseLeaveWebMenu = () => {
    setShowWebMenu(false);
  };

  const handleItemHover = (item: string) => {
    setWebMenuHoveredItem(item);
  };

  const handleDisconnectWalletClicked = () => {
    dispatch(setWalletConnected(false));
    const emptyCrypto: crypto = { address:'', balanceNative:0, balanceUSD:0, type:''};
    dispatch(setAllCryptos([emptyCrypto]));
    dispatch(setWalletType(''));
    setshowAdministerWalletWalletMenu(false);

    window.location.reload();
  };

  const handleChangeWalletClicked = () => {
    dispatch(setWalletConnected(false));
    const emptyCrypto: crypto = { address:'', balanceNative:0, balanceUSD:0, type:''};
    dispatch(setAllCryptos([emptyCrypto]));
    dispatch(setWalletType(''));
    setshowAdministerWalletWalletMenu(false);
    window.location.reload();
  };


  const dashboardtextGlowStyle = dashboardMenuHovered
    ? { 
      textShadow: `0 0 5px rgba(${colorProps.color === 'dark' ? '51, 51, 51' : '255, 255, 255'}, 0.5), 0 0 10px rgba(${colorProps.color === 'dark' ? '51, 51, 51' : '255, 255, 255'}, 0.5), 0 0 15px rgba(${colorProps.color === 'dark' ? '51, 51, 51' : '255, 255, 255'}, 0.5)` 
    }
  : {};

  const dashboardiconGlowStyle = dashboardMenuHovered
    ? { 
      filter: `drop-shadow(0 0 10px rgb(${colorProps.color === 'dark' ? '51, 51, 51' : '255, 255, 255'}))` 
    }
  : {};

  const abouttextGlowStyle = aboutHovered
  ? { 
    textShadow: `0 0 5px rgba(${colorProps.color === 'dark' ? '51, 51, 51' : '255, 255, 255'}, 0.5), 0 0 10px rgba(${colorProps.color === 'dark' ? '51, 51, 51' : '255, 255, 255'}, 0.5), 0 0 15px rgba(${colorProps.color === 'dark' ? '51, 51, 51' : '255, 255, 255'}, 0.5)` 
  }
: {};

const abouticonGlowStyle = aboutHovered
  ? { 
    filter: `drop-shadow(0 0 10px rgb(${colorProps.color === 'dark' ? '51, 51, 51' : '255, 255, 255'}))` 
  }
: {};

  const iconResponsiveGlowStyle = responsiveNavMenuHovered
    ? { 
      filter: `drop-shadow(0 0 10px rgb(${colorProps.color === 'dark' ? '51, 51, 51' : '255, 255, 255'}))` 
    }
  : {};

  return (
    <div 
    className={pageProps.page === 'home' ? 'fade-in-animation' : ''}
    style={{          position: 'fixed', // Fixed position
    top: '0',
    left: '0',
    width: '100%', // Full width
    zIndex: 1000, // Make sure it stays above other elements
    backdropFilter: 'blur(10px)', // Frosted glass effect
    backgroundColor: isSafari()
    ? 'rgba(255, 255, 255, 0.9)'
    : (isScrolledToTop ? 'rgba(255, 255, 255, 0.2)' : 'transparent'),
  }}
>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: window.innerWidth < 768 ? '25px' : '15px', // Adjust padding as needed
        }}
      >
        <img 
         onClick={() => {
           navigate(`/${languageProps.language}/`);
           setNavMenuVisible(false); // Close the menu when a link is clicked
           window.scrollTo(0, 0);
         }}
        src={ pageProps.page === 'dashboard' ? (walletConnected ? MyFye1Rainbow : MyFye1Gray) : MyFye1Gray} style={{width: '40px', height: 'auto', 
        marginRight: '15px', cursor: 'pointer',}} alt="MyFye Logo" 
        /> 
        { pageProps.page != 'home' && (
      <div style={{ color: colorProps.color === 'light' ? 'white' : '#333333', cursor: 'pointer', 
      fontSize: window.innerWidth < 768 ? '32px' : '50px' }}
      onClick={() => {
        navigate(`/${languageProps.language}/`);
        setNavMenuVisible(false); // Close the menu when a link is clicked
        window.scrollTo(0, 0);
      }}>MyFye</div>
      )}
        {/* Conditionally render links or menu button based on screen width */}

        {/* Give spacing for all of the right side elements*/}
        <div style={{ flex: 1 }}></div>


          {window.innerWidth < 768 ? (
            <>

            {pageProps.page === 'dashboard' ? (
              <>
              <ConnectWallet/>
              </>
            ) : (
              <>
                {globeVisible && ( <GlobeMenu languageProps = {{ language: languageProps.language}} colorProps = {{color: colorProps.color}}/>)}
              </>

            )}


                          <div
              style={{ cursor: 'pointer' }}
              onClick={toggleNavMenu}
            >
            {navMenuVisible ? (
            <img
                src={colorProps.color === 'light' ? xIconWhite : xIconGray2}
                alt="Close Menu"
                style={{
                width: '40px', // Set the desired width
                height: '40px', // Set the desired height
                color: 'white'
                }}
            />
            ) : (

            <img
            onMouseEnter={() => setResponsiveNavMenuHovered(true)}
            onMouseLeave={() => setResponsiveNavMenuHovered(false)}
              src={colorProps.color === 'light' ? menuIconWhite : menuIconGray2}
              alt="Menu"
              style={{
                width: '40px', // Set the desired width
                height: '40px',
                ...iconResponsiveGlowStyle
              }}
            />
            
            )}
            </div>

            </>
            ) : (
        
            <>{/* Full Size Nav menu */}
            
                {pageProps.page === 'dashboard' && (

                  <div>

                  <span>
                {walletConnected ? (
                  <div>
                    <div 
                      onClick={() => setshowAdministerWalletWalletMenu(true)}
                      onMouseEnter={() => setConnectedWalletHovered(true)}
                      onMouseLeave={() => setConnectedWalletHovered(false)}          
                    style={{display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center',
                      cursor: 'pointer', background: connectedWalletHovered ? '#555555' : '#666666', 
                      borderRadius: '10px', color: 'white',
                      paddingLeft: '10px', paddingRight: '10px',
                      border: connectedWalletHovered ? '6px solid #aea6f7' : '6px solid transparent'}}>
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
                </div>
                )}

            {(pageProps.page === 'home' || pageProps.page === 'about') && (

              <div style={{display: 'flex', flexDirection: 'row', gap: '15px'}}>

{(pageProps.page === 'home' && (
<div
        onMouseEnter={() => setAboutHovered(true)}
        onMouseLeave={() => setAboutHovered(false)}
        style={{ cursor: 'pointer', paddingRight: '30px', display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', fontSize: '24px', color: colorProps.color === 'light' ? 'white' : '#333333',
        gap: '10px' }}
        onClick={() => {
          navigate(`/${languageProps.language}/about`);
          setNavMenuVisible(false); // Close the menu when a link is clicked
          window.scrollTo(0, 0);
        }}>
        
          <img
          src={colorProps.color === 'light' ? aboutIconWhite : aboutIconGray}
          alt=""
          style={{
            width: '40px', // Set the desired width
            height: 'auto', // Set the desired height
            ...abouticonGlowStyle
          }}
        />
        {window.innerWidth > 768 && 
        <div style={abouttextGlowStyle}>About</div>
          }
      </div>))}



        {globeVisible && ( <GlobeMenu languageProps = {{ language: languageProps.language}} colorProps = {{color: colorProps.color}}/>)}
                
              <span>
                <div 
                    onMouseEnter={() => setDashboardMenuHovered(true)}
                    onMouseLeave={() => setDashboardMenuHovered(false)}
                style={{display: 'flex', flexDirection: 'row', 
                alignItems: 'center', fontSize: '24px', color: 'white',
                cursor: 'pointer', gap: '10px'}}
                
                onClick={() => {
                  navigate(`/${languageProps.language}/dashboard`);
                  setNavMenuVisible(false); // Close the menu when a link is clicked
                  window.scrollTo(0, 0);
                }}>
              <img
              src={colorProps.color === 'light' ? userIconWhite : userIconGray2}
              alt=""
              style={{
                width: '40px', // Set the desired width
                height: '40px', // Set the desired height
                ...dashboardiconGlowStyle
              }}

            />
              <div 
                style={{ 
                  ...dashboardtextGlowStyle, 
                  color: colorProps.color === 'light' ? 'white' : '#333333'
                }}
              >
                Dashboard
              </div>
                  </div>
                  </span>
                  </div>
              )}



            </>
          )}
        </div>

      {/* Responsive menu */}
      {navMenuVisible && (
        <div
          style={{
            position: 'fixed',
            top: 95,
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
                window.scrollTo(0, 0);
              }}>
              Dashboard
              </div>


              <div                   

              onClick={() => {
                  navigate(`/${languageProps.language}/about`);
                  setNavMenuVisible(false); // Close the menu when a link is clicked
                  window.scrollTo(0, 0);
                }}>About</div>

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
