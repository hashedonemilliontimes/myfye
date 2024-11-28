import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { DynamicContextProvider, DynamicWidget, useDynamicContext, useUserUpdateRequest } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import myfyelogo from '../assets/MyFyeLogo2.png';
import Deposit from '../appcomponents/deposit';
import Withdraw from '../appcomponents/withdraw';
import { HandleSolanaConnection } from '../dynamichelpers/HandleNewSolanaConnection';
import { HandleEthereumConnection } from '../dynamichelpers/HandleNewEthereumConnection';
import InvestmentValue from '../appcomponents/investmentValue';
import InvestmentPercentageChange from '../appcomponents/investmentPercentageGain';
import { useDispatch } from 'react-redux';
import { setusdcSolValue, setusdtSolValue, setbusdSolValue, 
  setusdcEthValue, setusdtEthValue, setbusdEthValue, setWalletPubKey,
  addConnectedWallets, setShowEarnPage, setShowCryptoPage, setShowRequestPage,
  setWalletType, setcurrentUserFirstName, setcurrentUserLastName,
  setcurrentUserEmail, setusdySolValue, setpyusdSolValue,
  seteurcSolValue, setShowSendPage, 
  setShowWalletDepositPage, setShouldShowBottomNav, 
  setShowWithdrawStablecoinPage, setShowWalletPage,
clearContacts, setcurrentUserID,
setbtcSolValue, setDepositWithdrawProductType} from '../redux/userWalletData';
import { getUserData, getAllDynamicUsers, getUserContacts } from '../helpers/getUserData';
import { getUSDYPriceQuote } from '../helpers/getUserData';
import wallet from '../helpers/walletDataType';
import { useSelector } from 'react-redux';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import HoldingsPortfolio from '../appcomponents/holdingsPortfolio';
import myBalanceImage from '../assets/myBalance.png';
import { Buffer } from 'buffer';
import LoadingAnimation from '../components/loadingAnimation';
import timerImage from '../assets/timer.png';
import WalletPage from '../appcomponents/WalletPage';
import WalletDepositPage from '../appcomponents/myWalletComponents/WalletDeposit';
import myfyeEarn from '../assets/myfyeEarn.png';
import myfyeCrypto from '../assets/myfyeCrypto.png';
import myfyeWallet from '../assets/myfyeWallet2.png';
import EarnPage from '../appcomponents/EarnPage';
import CryptoPage from '../appcomponents/CryptoPage';
import userImage from '../assets/user.png';
import ProfileMenu from '../appcomponents/menu';
import Support from '../appcomponents/support';
import Language from '../appcomponents/LanguagePage';
import BottomNav from '../appcomponents/bottomNavigation';
import PayPage from '../appcomponents/PayPage';
import SendPage from '../appcomponents/SendPage';
import RequestPage from '../appcomponents/RequestPage';
import ContactsPage from '../appcomponents/ContactsPage';
import AccountHistory from '../appcomponents/accountHistory';
import { checkUncreatedUserBalance } from '../helpers/uncreatedUserBalance';
import NewUserPreviousBalanceNotification from '../appcomponents/NewUserPreviousBalanceNotification';
import { getFunctions, httpsCallable } from "firebase/functions";
import PersonaKYC from '../appcomponents/PersonaKYC';

function WebAppInner() {

  window.Buffer = Buffer;
  
  const { primaryWallet, user } = useDynamicContext();
  
  const firstNameUI = useSelector((state: any) => state.userWalletData.currentUserFirstName);
  const lastNameUI = useSelector((state: any) => state.userWalletData.currentUserLastName);
  const usdcSolBalance = useSelector((state: any) => state.userWalletData.usdcSolBalance);
  const usdtSolBalance = useSelector((state: any) => state.userWalletData.usdtSolBalance);
  const eurcSolBalance = useSelector((state: any) => state.userWalletData.eurcSolBalance);
  const btcSolBalance = useSelector((state: any) => state.userWalletData.btcSolBalance);
  const pyusdSolBalance = useSelector((state: any) => state.userWalletData.pyusdSolBalance);
  const shouldShowBottomNav = useSelector((state: any) => state.userWalletData.shouldShowBottomNav );
  const userEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
  const allDynamicUsers = useSelector((state: any) => state.userWalletData.allUsers);
  const priceOfUSDYinUSDC = useSelector((state: any) => state.userWalletData.priceOfUSDYinUSDC);
  const currentUserContacts = useSelector((state: any) => state.userWalletData.contacts);
  const [gotUserContacts, setGotUserContacts] = useState(false);
  const [gotAllUsers, setGotAllUsers] = useState(false);
  const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);
  const KYCVerifired = useSelector((state: any) => state.userWalletData.currentUserKYCVerified);
  const db = getFirestore();

  const dispatch = useDispatch();

  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const ANNOUNCMENT_MESSAGE = ''

  const getUserInfo = async () => {

    if (primaryWallet?.address && userEmail) {

      dispatch(setcurrentUserID(user?.userId!))
      const getInvestmentData = async () => {
      const userData = await getUserData(userEmail, user!.phoneNumber!, primaryWallet?.address, dispatch);
      }

      getInvestmentData();



      const getPriceQuote = async () => {
        const userData = await getUSDYPriceQuote(priceOfUSDYinUSDC, dispatch);
        }
        getPriceQuote();

      
      dispatch(setWalletPubKey(primaryWallet?.address));

      //console.log('got wallet type', primaryWallet?.connector.name)

      dispatch(setWalletType(primaryWallet?.connector.name))

      const newWallet: wallet = {
        address: primaryWallet?.address,
        chain: primaryWallet?.chain
      };

      dispatch(addConnectedWallets(newWallet));
      

    } 
  }

  const getUserBalances = async () => {
    //console.log('Getting user balances')
    if (user?.chain == 'eip155') {
        
      const fetchBalances = async () => {
      const balances = await HandleEthereumConnection(primaryWallet!.address);
      if (balances) {
        dispatch(setusdcEthValue(Number(balances.usdc)));
        dispatch(setusdtEthValue(Number(balances.usdt)));
        //dispatch(setbusdEthValue(Number(balances.busd)));
        dispatch(setbusdEthValue(Number(balances.busd)));
      }
    }
    fetchBalances();
    } else {
      const fetchBalances = async () => {
        const balances = await HandleSolanaConnection(primaryWallet!.address, primaryWallet!.connector.name);
        if (balances) {
          dispatch(setusdcSolValue(Number(balances.usdc)));
          dispatch(setusdtSolValue(Number(balances.usdt)));
          dispatch(setusdySolValue(Number(balances.usdy)));
          dispatch(setpyusdSolValue(Number(balances.pyusd)));
          dispatch(seteurcSolValue(Number(balances.eurc)));
          dispatch(setbtcSolValue(Number(balances.btc)));
          
          console.log('got balances: ', balances)
        }
        setUserDataLoaded(true) 
      }
      fetchBalances();
    }
  }

  useEffect(() => {

    try {
      let currentUserFirstName = user?.firstName
      let currentUserLastName = user?.lastName
      let currentUserEmail = user?.email
      let currentUserPhoneNumber = user?.phoneNumber
      

      if (currentUserEmail != userEmail) {
        dispatch(setcurrentUserEmail(currentUserEmail!))
      }
      if (firstNameUI != currentUserFirstName) {
        dispatch(setcurrentUserFirstName(currentUserFirstName!))
      }
      if (lastNameUI != currentUserLastName) {
        dispatch(setcurrentUserLastName(currentUserLastName!))
      }
      if (currentUserPhoneNumber != null) {
        console.log(currentUserPhoneNumber)
      }

    } catch (error) {
      console.error('Error with dynamic user ', error);
    }
    if (primaryWallet?.address != '' && primaryWallet?.address != null) {
      console.log('primaryWallet?.address', primaryWallet?.address);
      dispatch(setWalletPubKey(primaryWallet!.address))
      getUserBalances();
      if (user != null) {
        getUserInfo();
      }
    } else {
      console.log('Error! primaryWallet?.address', primaryWallet?.address, 'primaryWallet?', primaryWallet)
    }
    console.log('primaryWallet', primaryWallet)
    console.log('userEmail', userEmail)

    // Get all users 
    if (!gotAllUsers && (!allDynamicUsers || allDynamicUsers.length === 0)) {
      setGotAllUsers(true)
      console.log('Getting all dynamic users')
      getAllDynamicUsers(dispatch)
    }

  }, [primaryWallet, userEmail, gotAllUsers]);
  

  useEffect(() => {
    // Get contacts
    if (primaryWallet?.address != null && (!currentUserContacts || currentUserContacts.length === 0)
      && userEmail != null && userEmail != '' && !gotUserContacts) {
        setGotUserContacts(true)
        console.log('Getting User Contacts')
      getUserContacts(userEmail, user!.phoneNumber!, primaryWallet!.address, dispatch);
    }
  }, [primaryWallet, userEmail, currentUserContacts, gotUserContacts]);

  useEffect(() => {
    if (userEmail != '' && userEmail != null && primaryWallet?.address != '' && primaryWallet?.address != null) {
      console.log('checkUncreatedUserBalance in Mobile App with email', userEmail, 'and phone number', user?.phoneNumber)
      checkUncreatedUserBalance(userEmail, primaryWallet!.address, dispatch, user?.phoneNumber)
    }
  }, [userEmail, user?.phoneNumber]);

  const handleSendPageClick = () => {
    dispatch(setShouldShowBottomNav(false));
    dispatch(setShowSendPage(true));
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleRequestPageClick = () => {
    dispatch(setShouldShowBottomNav(false));
    dispatch(setShowRequestPage(true));
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleEarnPageClick = () => {
    dispatch(setShowEarnPage(true))
    dispatch(setDepositWithdrawProductType('Earn'))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleCryptoPageClick = () => {
    dispatch(setShowCryptoPage(true))
    dispatch(setDepositWithdrawProductType('Crypto'))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleWalletDepositPageClick = () => {
    dispatch(setShouldShowBottomNav(false))
    dispatch(setShowWalletDepositPage(true))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleWithdrawStableCoinClick = () => {
    // Add your logic here for what happens when the menu is clicked
    dispatch(setShouldShowBottomNav(false));
    dispatch(setShowWithdrawStablecoinPage(true))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };




    
  
  if (primaryWallet !== null || user) {
    return (

      
        <div style={{overflowX: 'hidden', backgroundColor: '#ffffff',}}>

{userDataLoaded ? (
  <>

  <PayPage/>
  <SendPage/>
  <RequestPage/>
  <EarnPage/>
  <CryptoPage/>
  <WalletPage/>
  <WalletDepositPage/>
  <AccountHistory/>
  <NewUserPreviousBalanceNotification/>
  <ProfileMenu/>

<Deposit/>
<Withdraw/>

  
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
            {selectedLanguageCode === 'en' && `Welcome, ${firstNameUI}`}
            {selectedLanguageCode === 'es' && `Hola, ${firstNameUI}`}
</div>

<div style={{display: 'flex', gap: '10px'}}>
  
  <Language/>
  <Support/>

</div>
</div>

{KYCVerifired ? (<div>




<div style={{ display: 'flex',  
          alignItems: 'center', 
        flexDirection: 'column', 
        color: '#222222', 
        justifyContent: 'space-around',
        overflowX: 'hidden', }}>


<div style={{
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '2px 5px 15px rgba(0, 0, 0, 0.2), -2px 5px 15px rgba(0, 0, 0, 0.2)',
  padding: '10px',
  paddingBottom: '16px',
  width: '90vw',
  marginTop: '15px'
}}>
<div style={{ display: 'flex',  alignItems: 'center', 
        flexDirection: 'column', color: '#222222', gap: window.innerHeight < 620 ? '1px' : '10px'  }}>
<div style={{display: 'flex', marginTop: '0px'}}>

  <img style={{ width: '180px', height: 'auto'}}src={myfyeWallet}/>

</div>

<div style={{ display: 'flex', alignItems: 'center', 
  justifyContent: 'center', flexDirection: 'column',}}>


  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', 
  width: '100%', minWidth: '240px', marginTop: '0px'}}>


  <div style={{fontSize: '25px', width: '200px', letterSpacing: '0.25px'}}>USD$ Balance:</div>
    <label style={{ fontSize: '20px', 
     display: 'flex', alignItems: 'center', }}>
    $ <span style={{ fontSize: '35px' }}>
      
    <div>
    {((usdcSolBalance + usdtSolBalance).toFixed(2)).toLocaleString('en-US')}
  </div>

    </span>
</label>

</div>



  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', 
  width: '100%', minWidth: '240px', marginTop: '-2px'}}>


  <div style={{fontSize: '25px', width: '200px',letterSpacing: '0.5px'}}>EUR€ Balance:</div>
  
    <label style={{ fontSize: '20px', 
     display: 'flex', alignItems: 'center', }}>
    € <span style={{ fontSize: '35px' }}>

    <div>
    {((eurcSolBalance).toFixed(2)).toLocaleString('en-US')}
  </div>

    </span>
</label>

</div>

   </div>




   {/*
   <Deposit/>
    <Withdraw/>
           <HoldingsPortfolio/>
  */}

<div style={{display: 'flex', 
alignItems: 'center', 
                justifyContent: 'space-around',
                marginTop: '0px',
                width: '95vw'}}>

            <div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
           cursor: 'pointer',
           fontSize: '20px',
           padding: '9px',
           width: '120px',
           textAlign: 'center'
       }} onClick={handleWalletDepositPageClick}>
            {selectedLanguageCode === 'en' && `Deposit`}
            {selectedLanguageCode === 'es' && `Déposito`}
       </div>
       <div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
            padding: '9px',
           cursor: 'pointer',
           fontSize: '20px',     
           width: '120px',
           textAlign: 'center'
       }} onClick={handleWithdrawStableCoinClick}>
            {selectedLanguageCode === 'en' && `Withdraw`}
            {selectedLanguageCode === 'es' && `Retirar`}
       </div>
       </div>

       </div>
       </div>



       <div style={{
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '2px 5px 15px rgba(0, 0, 0, 0.2), -2px 5px 15px rgba(0, 0, 0, 0.2)',
  padding: '10px',
  paddingBottom: '16px',
  width: '90vw',
  marginTop: '15px',
}}>
       <div style={{ display: 'flex',  alignItems: 'center', 
        flexDirection: 'column', color: '#222222', gap: window.innerHeight < 620 ? '1px' : '10px' }}>
<img style={{ width: '150px', height: 'auto'}}src={myfyeEarn}/>


<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',}}>

    <label htmlFor="deposit" style={{ fontSize: '20px', 
     display: 'flex', alignItems: 'center', }}>
    $ <span style={{ fontSize: '35px' }}>
      
    <InvestmentValue/>

    </span>
</label>

   
   </div>


<div>

<div style={{display: 'flex', alignItems: 'center', 
                justifyContent: 'center',
                marginTop: '0px'}}>
            <div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
           height: '40px', 
           width: '210px',
           display: 'flex',        // Makes this div also a flex container
           justifyContent: 'center', // Centers the text horizontally inside the button
           alignItems: 'center',// Centers the text vertically inside the button
           cursor: 'pointer',
           fontSize: '20px'     
       }} onClick={handleEarnPageClick}>
            {selectedLanguageCode === 'en' && `View Portfolio`}
            {selectedLanguageCode === 'es' && `Ver Portafolio`}
       </div>
       </div>
       </div>

</div>
</div>






<div style={{
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '2px 5px 15px rgba(0, 0, 0, 0.2), -2px 5px 15px rgba(0, 0, 0, 0.2)',
  padding: '10px',
  paddingBottom: '16px',
  width: '90vw',
  marginTop: '15px',
}}>
<div style={{ display: 'flex',  alignItems: 'center', 
        flexDirection: 'column', color: '#222222', gap: window.innerHeight < 620 ? '1px' : '10px' }}>
<img style={{ width: '180px', height: 'auto'}}src={myfyeCrypto}/>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',}}>

    <label htmlFor="deposit" style={{ fontSize: '20px', 
     display: 'flex', alignItems: 'center', }}>
    $ <span style={{ fontSize: '35px' }}>

    <div>
    {(btcSolBalance * 95000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
  </div>

    </span>
</label>

   
   </div>


<div>

<div style={{display: 'flex', alignItems: 'center', 
                justifyContent: 'center',
                marginTop: '0px'}}>
            <div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
           height: '40px', 
           width: '210px',
           display: 'flex',        // Makes this div also a flex container
           justifyContent: 'center', // Centers the text horizontally inside the button
           alignItems: 'center',// Centers the text vertically inside the button
           cursor: 'pointer',
           fontSize: '20px',     
       }} onClick={handleCryptoPageClick}>
            {selectedLanguageCode === 'en' && `View Portfolio`}
            {selectedLanguageCode === 'es' && `Ver Portafolio`}
       </div>
       </div>
       </div>
       </div>
</div>














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

) : (<div>
<PersonaKYC/>
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
          fontWeight: 'bold',
          marginTop: '-120px'}}>Your Money, Your Phone.<br/>No Bank Needed.</div>
<div style={{
    color: '#333333',
    fontSize: '20px',
    marginTop: '15px'
}}>

    Hold <span style={{ fontWeight: 'bold' }}>US Dollars</span>, <span style={{ fontWeight: 'bold' }}>Euros</span>, <br />
    <span style={{ fontWeight: 'bold' }}> US Treasury Bonds</span>,
    and <br /><span style={{ fontWeight: 'bold' }}>Bitcoin</span> directly on your phone.
</div>
</div>
<div style={{marginTop: '40px'}}>
  <DynamicWidget />
  </div>
</div>
    );
  }
}


function WebApp() {
  return (
    <DynamicContextProvider settings={{ 
      environmentId: 'fc5dcdf2-470b-4572-99e9-93544f53b72e',
      walletConnectors: [SolanaWalletConnectors as any],
      eventsCallbacks: {
        onLogout: (args) => {
          console.log('onLogout was called', args);
          window.location.reload();
        }
      }
    }}>
      <div style={{overflowX: 'hidden'}}>
      <WebAppInner/>
      </div>

    </DynamicContextProvider>
  );
}

export default WebApp;
