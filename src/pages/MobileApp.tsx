import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { DynamicContextProvider, DynamicWidget, useDynamicContext, useUserUpdateRequest } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import myfyelogo from '../assets/MyFyeLogo1.png';
import Menu from '../appcomponents/menu';
import Deposit from '../appcomponents/deposit';
import Withdraw from '../appcomponents/withdraw';
import { HandleSolanaConnection } from '../dynamichelpers/HandleNewSolanaConnection';
import { HandleEthereumConnection } from '../dynamichelpers/HandleNewEthereumConnection';
import InvestmentValue from '../appcomponents/investmentValue';
import InvestmentPercentageChange from '../appcomponents/investmentPercentageGain';
import { useDispatch } from 'react-redux';
import { setusdcSolValue, setusdtSolValue, setbusdSolValue, 
  setusdcEthValue, setusdtEthValue, setbusdEthValue, setWalletPubKey,
  addConnectedWallets, setCurrentUserKYCVerified,
  setWalletType, setcurrentUserFirstName, setcurrentUserLastName,
  setcurrentUserEmail, setusdySolValue} from '../redux/userWalletData';
import { getPrincipalInvested } from '../helpers/getPrincipalInvested';
import wallet from '../helpers/walletDataType';
import { useSelector } from 'react-redux';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import HoldingsPortfolio from '../appcomponents/holdingsPortfolio';
import myBalanceImage from '../assets/myBalance.png';
import { Buffer } from 'buffer';
import LoadingAnimation from '../components/loadingAnimation';

function WebAppInner() {

  window.Buffer = Buffer;
  
  const { primaryWallet, user } = useDynamicContext();

  const firstNameUI = useSelector((state: any) => state.userWalletData.currentUserFirstName);

  const db = getFirestore();

  const dispatch = useDispatch();

  const [userDataLoaded, setUserDataLoaded] = useState(false);

  const getUserInfo = async () => {

    if (primaryWallet?.address) {

      const getInvestmentData = async () => {
      const gotPrincipalInvested = await getPrincipalInvested(primaryWallet?.address, dispatch);
      }
      getInvestmentData();

      dispatch(setWalletPubKey(primaryWallet?.address));

      //console.log('got wallet type', primaryWallet?.connector.name)

      dispatch(setWalletType(primaryWallet?.connector.name))

      const newWallet: wallet = {
        address: primaryWallet?.address,
        chain: primaryWallet?.chain
      };

      dispatch(addConnectedWallets(newWallet));

      try {
          let currentUserFirstName = user?.firstName
          let currentUserLastName = user?.lastName
          let currentUserEmail = user?.email

          dispatch(setcurrentUserFirstName(currentUserFirstName!))
          dispatch(setcurrentUserLastName(currentUserLastName!))
          dispatch(setcurrentUserEmail(currentUserEmail!))

      } catch (error) {
        console.error('Error with dynamic user ', error);
      }
      setUserDataLoaded(true)
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
          
          console.log('got balances: ', balances)
        }
      }
      fetchBalances();
    }
  }

  useEffect(() => {
    if (primaryWallet?.address != '' && primaryWallet?.address != null) {
      dispatch(setWalletPubKey(primaryWallet!.address))
      getUserBalances();
      getUserInfo();
    } else {
      console.log('Error! primaryWallet?.address', primaryWallet?.address)
    }
    console.log('primaryWallet', primaryWallet)
  }, [primaryWallet]);
  

  if (primaryWallet !== null || user) {
    return (

      
        <div style={{overflowX: 'hidden', backgroundColor: 'white'}}>

{userDataLoaded ? (
  <>
          <div style={{ display: 'flex',  alignItems: 'center', height: '100vh',
        flexDirection: 'column', color: '#222222', gap: '20px' }}>

<Menu/>


<div style={{fontSize: '25px', fontWeight: 'bold', width: '80vw', maxWidth: '550px', marginTop: '100px',}}>Welcome, {firstNameUI}</div>

<hr style={{height: '2px', backgroundColor: '#222222', border: 'none', width: '80vw', maxWidth: '550px'}}></hr>

<div style={{display: 'flex'}}>

  <img style={{ width: '150px', height: 'auto'}}src={myBalanceImage}/>

</div>

<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',}}>
<label htmlFor="deposit" style={{ fontSize: '20px', 
     display: 'flex', alignItems: 'center', }}>
    $ <span style={{ fontSize: '35px' }}>
      
    <InvestmentValue/>

    </span>
</label>
   
   </div>
   <Deposit/>
    <Withdraw/>

       <hr style={{height: '2px', backgroundColor: '#CCCCCC', border: 'none', width: '80vw', maxWidth: '550px'}}></hr>

       <HoldingsPortfolio/>
                    
                        </div>
  </>
) : (<>
      <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', marginTop: '100px' }}>
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
