import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setShowMainDepositPage } from '../../redux/userWalletData.tsx';
import ProfilePage from './ProfilePage.tsx';
import EarnPage from './EarnPage.tsx';
import CryptoPage from './CryptoPage.tsx';
import { useSelector } from 'react-redux';
import { 
  getFirestore, 
  doc, 
  getDoc } from 'firebase/firestore';
import { Buffer } from 'buffer';
import LoadingAnimation from '../../components/LoadingAnimation.tsx';
import myfyelogo from '../../assets/MyFyeLogo2.png';
import Language from './LanguagePage.tsx';
import Support from './Support.tsx';
import WalletTile from '../../components/mobileApp/WalletTile.tsx';
import EarnTile from '../../components/mobileApp/EarnTile.tsx';
import CryptoTile from '../../components/mobileApp/CryptoTile.tsx';
import BottomNav from '../../components/mobileApp/BottomNavigation.tsx';
import { 
  setShowRequestPage,
  setShowSendPage, } from '../../redux/userWalletData.tsx';
import {
  usePrivy, 
  useLoginWithPasskey,
  useMfaEnrollment} from '@privy-io/react-auth';
import { 
  HandleUserLogIn,
  UpdatePasskey,
  getUsers
 } from '../../functions/HandleUserLogIn.tsx';
import WalletPage from './WalletPage.tsx';
import MainDepositPage from '../../components/mobileApp/wallet/MainDepositPage.tsx';
import SwapDeposit from './SwapPages/SwapDepositPage.tsx';
import SwapWithdraw from './SwapPages/SwapWithdrawPage.tsx';
import PrivyUseSolanaWallets from '../../components/PrivyUseSolanaWallets.tsx';
import SendPage from './SendPage.tsx';

function WebAppInner() {

  window.Buffer = Buffer;
  
  const {showMfaEnrollmentModal} = useMfaEnrollment();

  const firstNameUI = useSelector((state: any) => state.userWalletData.currentUserFirstName);
  const userPassKeyState = useSelector((state: any) => state.userWalletData.passKeyState);
  const priceOfUSDYinUSDC = useSelector((state: any) => state.userWalletData.priceOfUSDYinUSDC);
  const priceOfBTCinUSDC = useSelector((state: any) => state.userWalletData.priceOfBTCinUSDC);
  const priceOfEURCinUSDC = useSelector((state: any) => state.userWalletData.priceOfEURCinUSDC);
  const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);
  const KYCVerifired = useSelector((state: any) => state.userWalletData.currentUserKYCVerified);
  const users = useSelector((state: any) => state.userWalletData.users);
  const dispatch = useDispatch();

  const [userDataLoaded, setUserDataLoaded] = useState(false); // To do: get user data
  const ANNOUNCMENT_MESSAGE = ''

  const {user, ready, authenticated, login, linkPasskey} = usePrivy();
  const {state, loginWithPasskey} = useLoginWithPasskey();

  const [enrolledInMFA, setEnrolledInMFA] = useState<boolean>(false);

  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);



  useEffect(() => {
    const handleLogin = async () => {
      if (authenticated) {
        try {
          if (!(user?.wallet)) {
          } 
          await HandleUserLogIn(
            user, 
            dispatch, 
            priceOfUSDYinUSDC, 
            priceOfBTCinUSDC,
            priceOfEURCinUSDC);
            setUserDataLoaded(true);

            
        } catch (error) {
          console.error('Error during login:', error);
        }
      }
    };

    if (user?.mfaMethods[0] == "passkey") {
      setEnrolledInMFA(true);
    }
  
    handleLogin();
  }, [authenticated, user]);
  // To do: 
  // Get all users
  // Get contacts
  // Get uncreaters user balance

  useEffect(() => {
    getUsers(dispatch);
  }, []);

  useEffect(() => {
    console.log(state)
    if (state.status == 'done') {
      UpdatePasskey(dispatch)
    }
  }, [state]);
  
  const handleSendPageClick = () => {
    dispatch(setShowSendPage(true));
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleRequestPageClick = () => {
    dispatch(setShowRequestPage(true));
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };
  
  if (authenticated) {
    
    return (
        <div style={{overflowX: 'hidden', backgroundColor: '#ffffff',}}>

{userDataLoaded ? (
  <>
{/* 
  <PayPage/>
  <SendPage/>
  <RequestPage/>
  
  <AccountHistory/>
  <NewUserPreviousBalanceNotification/>
  <ProfileMenu/>
<Withdraw/>

*/}
<SendPage/>
<WalletPage/>
<EarnPage/>
<ProfilePage/>
<MainDepositPage/>
<SwapDeposit/>
<SwapWithdraw/>
<CryptoPage/>
  
  {ANNOUNCMENT_MESSAGE && (
  <div style={{textAlign: 'center', fontSize: '14px', 
    color: '#ffffff', whiteSpace: 'nowrap', 
    width: '100vw', 
    background: '#2E7D32',
  marginBottom: '-10px'}}>{ANNOUNCMENT_MESSAGE}</div>
  )}

<div style={{display: 'flex', flexDirection: 'row', 
  justifyContent: 'space-between', marginTop: '15px', marginLeft: '10px',
  alignItems: 'center', paddingLeft: '10px', paddingRight: '10px'}}>


<div style={{fontSize: '25px', fontWeight: 'bold', 
width: '70vw', maxWidth: '550px', color: '#222222'
  
}}>
            {selectedLanguageCode === 'en' && `Welcome! ${firstNameUI}`}
            {selectedLanguageCode === 'es' && `Hola, ${firstNameUI}`}
</div>

<div style={{display: 'flex', gap: '10px'}}>
  
  <Language/>
  <Support/>

  <PrivyUseSolanaWallets/>

  
</div>
</div>

{KYCVerifired ? (
  <div>
    
{
  (userPassKeyState === 'done') ? ( 
    <div>
    {(enrolledInMFA) ? (


<div>

<div style={{ display: 'flex',  
          alignItems: 'center', 
        flexDirection: 'column', 
        color: '#222222', 
        justifyContent: 'space-around',
        overflowX: 'hidden', }}>

<WalletTile/>
<EarnTile/>
<CryptoTile/>

<div style={{display: 'flex', 
justifyContent: 'space-around', 
width: '90vw',
marginTop: '35px',
  marginBottom: '120px'
}}>
  <div style={{
      color: '#ffffff', 
      background: '#2E7D32', // gray '#999999', 
      borderRadius: '10px', 
      border: '2px solid #2E7D32', 
      fontWeight: 'bold',
      height: '40px', 
      width: '130px',
      display: 'flex',        // Makes this div also a flex container
      justifyContent: 'center', // Centers the text horizontally inside the button
      alignItems: 'center',// Centers the text vertically inside the button
      cursor: 'pointer',
      fontSize: '20px'     
    }} onClick={handleSendPageClick}>
      {selectedLanguageCode === 'en' && `Send`}
      {selectedLanguageCode === 'es' && `Enviar`}
    </div>
    <div style={{
      color: '#ffffff', 
      background: '#2E7D32', // gray '#999999', 
      borderRadius: '10px', 
      border: '2px solid #2E7D32', 
      fontWeight: 'bold',
      height: '40px', 
      width: '130px',
      display: 'flex',        // Makes this div also a flex container
      justifyContent: 'center', // Centers the text horizontally inside the button
      alignItems: 'center',// Centers the text vertically inside the button
      cursor: 'pointer',
      fontSize: '20px'     
    }} 
    onClick={handleRequestPageClick}>
      
      {selectedLanguageCode === 'en' && `Request`}
      {selectedLanguageCode === 'es' && `Pedido`}
    </div>
  </div>          
  
                    <BottomNav/>
                        </div>
                        </div>



    ) : (
      <div>

      <div style={{display: 'flex', justifyContent: 'center'}}>
      <div style={{marginTop: '80px'}}>
        <button onClick={showMfaEnrollmentModal}
        style={{
          color: '#ffffff',
          fontSize: '25px',
          fontWeight: 'bold',
          background: '#447E26',
        borderRadius: '10px', 
        border: '3px solid #ffffff',
        padding: '15px',
        cursor: 'pointer'}}>
            Enroll in MFA
          </button>
          </div>
          
        </div>
          </div>

    )}
    </div>


  ) : (
    <div>

<div style={{display: 'flex', justifyContent: 'center'}}>
<div style={{marginTop: '80px'}}>
  <button onClick={linkPasskey}
  style={{
    color: '#ffffff',
    fontSize: '25px',
    fontWeight: 'bold',
    background: '#447E26',
  borderRadius: '10px', 
  border: '3px solid #ffffff',
  padding: '15px',
  cursor: 'pointer'}}>
      Create A Passkey
    </button>
    </div>
    
  </div>
    </div>
   )
}

                        </div>

) : (<div>
{/*<PersonaKYC/>*/}
</div>)}


  </>
) : (<>
      <div style={{
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center' }}>

        <div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img
            style={{
              width: '80vw',
              maxWidth: '300px',
              marginTop: '-20px'
            }}
            src={myfyelogo}
            alt="My Fye Logo"
          />
          </div>
        </div>
        <LoadingAnimation/>
      </div>
</>)}


      </div>
    );
  } else {
    return (
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100vh',
  }}
>
  <img
    style={{
      width: '80vw',
      marginBottom: '50px',
      marginTop: '-200px',
      maxWidth: '300px',
    }}
    src={myfyelogo}
    alt="My Fye Logo"
  />


<div>
  <div style={{color: '#447E26', 
          fontSize: '25px',
          marginTop: '-120px',
          textAlign: 'center'}}>Your Money, Your Phone.<br/>No Bank Needed.</div>
</div>
<div style={{marginTop: '40px'}}>
  {/* Privy widget */}
  <button disabled={disableLogin} onClick={login}
  style={{
    color: '#ffffff',
    fontSize: '25px',
    fontWeight: 'bold',
    background: '#447E26',
  borderRadius: '10px', 
  border: '3px solid #ffffff',
  padding: '15px'}}>
      Log In
    </button>

    
  </div>
</div>
    );
  }
}


function WebApp() {
  return (
      <div style={{overflowX: 'hidden'}}>
      <WebAppInner/>
      </div>
  );
}

export default WebApp;
