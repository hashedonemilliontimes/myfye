import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { DynamicContextProvider, DynamicWidget, useDynamicContext, useUserUpdateRequest } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import myfyelogo from '../assets/MyFyeLogo1.png';
import Deposit from '../appcomponents/deposit';
import Withdraw from '../appcomponents/withdraw';
import { HandleSolanaConnection } from '../dynamichelpers/HandleNewSolanaConnection';
import { HandleEthereumConnection } from '../dynamichelpers/HandleNewEthereumConnection';
import InvestmentValue from '../appcomponents/investmentValue';
import InvestmentPercentageChange from '../appcomponents/investmentPercentageGain';
import { useDispatch } from 'react-redux';
import { setusdcSolValue, setusdtSolValue, setbusdSolValue, 
  setusdcEthValue, setusdtEthValue, setbusdEthValue, setWalletPubKey,
  addConnectedWallets, setShowEarnPage, setShowRequestPage,
  setWalletType, setcurrentUserFirstName, setcurrentUserLastName,
  setcurrentUserEmail, setusdySolValue, setpyusdSolValue, setShowSendPage,
  setShowWalletPage, setShouldShowBottomNav} from '../redux/userWalletData';
import { getUserData } from '../helpers/getUserData';
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
import myfyeEarn from '../assets/myfyeEarn.png';
import myfyeBalance from '../assets/myfyeBalance.png';
import EarnPage from '../appcomponents/EarnPage';
import userImage from '../assets/user.png';
import ProfileMenu from '../appcomponents/menu';
import Support from '../appcomponents/support';
import BottomNav from '../appcomponents/bottomNavigation';
import PayPage from '../appcomponents/PayPage';
import SendPage from '../appcomponents/SendPage';
import RequestPage from '../appcomponents/RequestPage';
import AccountHistory from '../appcomponents/accountHistory';
import { checkUncreatedUserBalance } from '../helpers/uncreatedUserBalance';
import NewUserPreviousBalanceNotification from '../appcomponents/NewUserPreviousBalanceNotification';

function WebAppInner() {

  window.Buffer = Buffer;
  
  const { primaryWallet, user } = useDynamicContext();
  
  const firstNameUI = useSelector((state: any) => state.userWalletData.currentUserFirstName);
  const lastNameUI = useSelector((state: any) => state.userWalletData.currentUserLastName);
  const usdcSolBalance = useSelector((state: any) => state.userWalletData.usdcSolBalance);
  const usdtSolBalance = useSelector((state: any) => state.userWalletData.usdtSolBalance);
  const shouldShowBottomNav = useSelector((state: any) => state.userWalletData.shouldShowBottomNav );
  const userEmail = useSelector((state: any) => state.userWalletData.currentUserEmail );

  const priceOfUSDYinUSDC = useSelector((state: any) => state.userWalletData.priceOfUSDYinUSDC);

  const db = getFirestore();

  const dispatch = useDispatch();

  const [userDataLoaded, setUserDataLoaded] = useState(false);

  const getUserInfo = async () => {

    if (primaryWallet?.address && userEmail) {

      const getInvestmentData = async () => {
      const userData = await getUserData(userEmail, primaryWallet?.address, dispatch);
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

      if (currentUserEmail != userEmail) {
        dispatch(setcurrentUserEmail(currentUserEmail!))
      }
      if (firstNameUI != currentUserFirstName) {
        dispatch(setcurrentUserFirstName(currentUserFirstName!))
      }
      if (lastNameUI != currentUserLastName) {
        dispatch(setcurrentUserLastName(currentUserLastName!))
      }
    } catch (error) {
      console.error('Error with dynamic user ', error);
    }
    if (primaryWallet?.address != '' && primaryWallet?.address != null) {
      dispatch(setWalletPubKey(primaryWallet!.address))
      getUserBalances();
      getUserInfo();
    } else {
      console.log('Error! primaryWallet?.address', primaryWallet?.address)
    }
    console.log('primaryWallet', primaryWallet)
  }, [primaryWallet, userEmail]);
  

  useEffect(() => {
    if (userEmail != '' && userEmail != null && primaryWallet?.address != '' && primaryWallet?.address != null) {
      console.log('checkUncreatedUserBalance in Mobile App')
      checkUncreatedUserBalance(userEmail, primaryWallet!.address, dispatch)
    }
  }, [userEmail]);

  const handleSendPageClick = () => {
    dispatch(setShouldShowBottomNav(false));
    dispatch(setShowSendPage(true));
  };

  const handleRequestPageClick = () => {
    dispatch(setShouldShowBottomNav(false));
    dispatch(setShowRequestPage(true));
  };

  const handleEarnPageClick = () => {
    dispatch(setShowEarnPage(true))
    
  };

  const handleWalletPageClick = () => {
    dispatch(setShowWalletPage(true))
  };

  

  if (primaryWallet !== null || user) {
    return (

      
        <div style={{overflow: 'hidden', backgroundColor: 'white'}}>

{userDataLoaded ? (
  <>

  <PayPage/>
  <SendPage/>
  <RequestPage/>
  <EarnPage/>
  <WalletPage/>
  <AccountHistory/>
  <NewUserPreviousBalanceNotification/>
  <ProfileMenu/>
  


<div style={{display: 'flex', flexDirection: 'row', 
  justifyContent: 'space-between', marginTop: '15px',
  alignItems: 'center', paddingLeft: '10px', paddingRight: '10px'}}>


<div style={{fontSize: '25px', fontWeight: 'bold', width: '70vw', maxWidth: '550px',}}>Welcome, {firstNameUI}</div>

<div style={{display: 'flex',}}>
  
  <Support/>

</div>
</div>

<hr style={{height: '2px', backgroundColor: '#222222', border: 'none', width: '100vw', 
maxWidth: '550px', marginTop: '10px'}}></hr>

<div style={{overflow: 'hidden'}}>
<div style={{ display: 'flex',  
          alignItems: 'center', 
          height: window.innerHeight < 620 ? 'calc(100vh - 230px)' : 'calc(100vh - 240px)',
        flexDirection: 'column', 
        color: '#222222', 
        justifyContent: 'space-around',
        overflow: 'hidden' }}>

<div style={{ display: 'flex',  alignItems: 'center', 
        flexDirection: 'column', color: '#222222', gap: window.innerHeight < 620 ? '0px' : '20px'  }}>
<div style={{display: 'flex', marginTop: '0px'}}>

  <img style={{ width: '180px', height: 'auto'}}src={myfyeBalance}/>

</div>

<div style={{ display: 'flex', alignItems: 'center', 
  justifyContent: 'center', flexDirection: 'column',}}>


    <label htmlFor="deposit" style={{ fontSize: '20px', 
     display: 'flex', alignItems: 'center', }}>
    $ <span style={{ fontSize: '35px' }}>
      
    <div>
    {((usdcSolBalance + usdtSolBalance).toFixed(2)).toLocaleString('en-US')}
  </div>

    </span>
</label>

   </div>




   {/*
   <Deposit/>
    <Withdraw/>
           <HoldingsPortfolio/>
  */}

<div style={{display: 'flex', alignItems: 'center', 
                justifyContent: 'center',
                marginTop: '0px', gap: window.innerHeight < 675 ? '-10px' : '0px'}}>
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
       }} onClick={handleWalletPageClick}>
           View Wallet
       </div>
       </div>

       </div>



       <div style={{ display: 'flex',  alignItems: 'center', 
        flexDirection: 'column', color: '#222222', gap: window.innerHeight < 620 ? '5px' : '20px' }}>
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
           View Portfolio
       </div>
       </div>
       </div>

</div>

{shouldShowBottomNav && (
<div style={{position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)'}}>
  <div style={{display: 'flex', justifyContent: 'space-around', width: '90vw'}}>
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
    }} onClick={handleSendPageClick}>Send</div>
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
    }} onClick={handleRequestPageClick}>Request</div>
  </div>
</div>
)}
                    
                
                    <BottomNav/>
                        </div>
                        </div>
  </>
) : (<>
      <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', marginTop: '60px' }}>

        <div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img src={myfyelogo} style={{width: '100px', height: 'auto', marginBottom: '30px'}}></img>
          </div>
        </div>
        <LoadingAnimation/>
      </div>
</>)}


      </div>
    );
  } else {
    return (
      <div style={{ display: 'flex', alignItems: 'center', 
      flexDirection: 'column', justifyContent: 'center', height: '100vh' }}>
        <img style={{width: '80vw', marginBottom: '50px', marginTop: '-170px', maxWidth: '300px'}} src={myfyelogo} alt="My Fye Logo" />
        <DynamicWidget />
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
