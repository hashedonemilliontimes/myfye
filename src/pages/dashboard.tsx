import React, { useState, useEffect, useContext } from 'react';
import { httpsCallable } from "firebase/functions";
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import { LanguageCodeProps } from '../helpers/languageManager';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, setDoc, doc, getDocs } from 'firebase/firestore';
import Header from '../components/header';
import { Connection, PublicKey } from "@solana/web3.js";
import { useSelector } from 'react-redux';
import PieChartComponent from '../components/dashboardTiles/pieChart';
import InvestingComponent from '../components/dashboardTiles/investing';
import crypto from '../helpers/cryptoDataType';
import BalancesComponent from '../components/dashboardTiles/balances';
import TransactionsComponent from '../components/dashboardTiles/transactions';
import YieldingChartComponent from '../components/dashboardTiles/yieldChart';
import YieldingPositionComponent from '../components/dashboardTiles/yieldingPosition';
import { useParams } from 'react-router-dom';
import solIcon from '../assets/solIcon.png';
import SolanaLogo from '../assets/solanaLogo.png';


function Dashboard() {

  const { lang } = useParams<{ lang: string }>();
  const [languageRef, setLanguageRef] = useState<LanguageCodeProps['language']>('en');
  useEffect(() => {
    if (lang && (lang === 'en' || lang==='da' || lang === 'fr' || lang === 'es' || lang === 'it' || 
    lang === 'pt' || lang === 'sk' || lang === 'ar' || lang === 'tr' || lang === 'fr' || 
    lang === 'hi' || lang === 'zh' || lang === 'id' || lang === 'ko' || lang === 'ja' || 
    lang === 'ru' || lang === 'ur' || lang === 'fl' || lang === 'mr' || lang === 'te' || 
    lang === 'ta' || lang === 'vi' || lang === 'sw')) {
      setLanguageRef(lang);
    } else {
      // default to 'en'
      setLanguageRef('en');
    }
    }, [lang]);

  const navigate = useNavigate();
  const auth = getAuth();
  const [uid, setUID] = useState("");
  const db = getFirestore();
  const isSmallScreen = window.innerWidth <= 768;
  const walletConnected = useSelector((state: any) => state.userWalletData.isConnected);
  const walletType = useSelector((state: any) => state.userWalletData.type);
  const cryptoList = useSelector((state: any) => state.userWalletData.cryptoList);
  const principalInvested = useSelector((state: any) => state.userWalletData.principalInvested);

  let dataPoints = cryptoList.map((crypto: any) => crypto.balanceUSD);

  const [isEmptyAccount, setIsEmptyAccount] = useState(true);
  
  useEffect(() => {
    let balance = principalInvested;
    for (let i = 0; i < dataPoints.length; i++) {
      let balanceIndex = dataPoints[i];
      balance = balance + balanceIndex;
    }

    console.log("Data Points: ", dataPoints);
    if (balance < 0.01) {
      setIsEmptyAccount(true);
    } else {
      setIsEmptyAccount(false);
    }
  }, [cryptoList]);

  let flexValue;

if (principalInvested >= 0.10) {
    flexValue = 0.5;
} else {
    flexValue = 1;
}

  console.log('cryptoList: ', cryptoList)
  if (isSmallScreen) {
    return (


      <div>
      {!walletConnected ? (
        
<div style={{ 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    overflowX: 'hidden', 
    overflowY: 'hidden'  // Also prevent vertical overflow if needed 
}}>
              <div className={'northern-lights-background'}></div>
              <div style = {{overflowX: 'hidden'}}>
      <div className={'homepage-animation-square-one opaque-square'} style = {{overflowX: 'hidden'}}></div>
      <div className={"homepage-animation-square-two opaque-square"} style = {{overflowX: 'hidden'}}></div>
      <div className={"homepage-animation-square-three opaque-square"} style = {{overflowX: 'hidden'}}></div>
      <div className={"homepage-animation-square-four opaque-square"} style = {{overflowX: 'hidden'}}></div>
      <div className={'dashboard-animation-square-one opaque-square'} style = {{overflowX: 'hidden'}}></div>
      <div className={"dashboard-animation-square-two opaque-square"} style = {{overflowX: 'hidden'}}></div>
      <div className={"dashboard-animation-square-three opaque-square"} style = {{overflowX: 'hidden'}}></div>
      <div className={'dashboard-animation-square-four opaque-square'} style = {{overflowX: 'hidden'}}></div>
      <div className={"dashboard-animation-square-five opaque-square"} style = {{overflowX: 'hidden'}}></div>
      <div className={"dashboard-animation-square-six opaque-square"} style = {{overflowX: 'hidden'}}></div>
      </div>
      <Header languageProps={{ language: 'en' }} colorProps={{ color: 'dark' }} pageProps={{ page: 'dashboard'}} />

      <div style={{height: '60vh', }}>
        <div style={{ 
          fontSize: '25px', fontWeight: 'bold', textAlign: 'center', 
          color: '#333333', marginTop: '300px'
        }}>
          Connect a wallet to get started
        </div>
      </div>
    </div>
        
      ) : (

        <div>
        { (principalInvested >= 0.10) && (

          <div style={{display: 'flex', flexDirection: 'column', marginLeft: '40px',
          marginTop: '140px', marginRight: '40px', color: '#333333', gap: '40px'}}>
          
          <div style={{flex: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
          borderRadius: '10px', padding: '20px', 
          color: '#333333'}}> 
               <YieldingChartComponent screenSize='small'/>
          </div>
          
          <div style={{flex: 0.5, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
          borderRadius: '10px', padding: '20px', height: '100%',
          color: '#333333'}}> 
               <YieldingPositionComponent/>
          </div>
          
          </div>
                    )}

        <div style={{ fontSize: '40px' }}>
          <Header languageProps={{ language: 'en' }} colorProps={{ color: 'dark' }} pageProps={{ page: 'dashboard'}}/>
        
        <div style={{paddingTop: window.innerWidth < 768 ? '85px' : '100px'}}>

        <div style={{display: 'flex', flexDirection: 'column', marginLeft: '40px', marginRight: '40px',
            marginTop: '40px', color: '#333333', gap: '40px'}}>

          <div style={{width: '90%', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
          borderRadius: '10px', padding: '20px', }}> 
          Portfolio
          <PieChartComponent/>
          </div>

          <div style={{width: '90%', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
          borderRadius: '10px', padding: '20px'}}> 
               Investing
               <InvestingComponent language={languageRef}/>
          </div>
        </div>
        </div>




        <div style={{display: 'flex', flexDirection: 'column', marginLeft: '40px', marginRight: '40px',
            marginTop: '40px', marginBottom: '40px', color: '#333333', gap: '40px'}}>

          <div style={{width: '90%', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
          borderRadius: '10px', padding: '20px'}}> 
               Balances
               <BalancesComponent/>
          </div>

          <div style={{width: '90%', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
          borderRadius: '10px', padding: '20px'}}> 
               Transactions
               <TransactionsComponent/>
          </div>

</div>
      </div>
      </div>
      )}
</div>


    )
  };
  
    return (
      

        <div>


  
        {!walletConnected ? (
          
<div style={{ 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    overflowX: 'hidden', 
    overflowY: 'hidden'  // Also prevent vertical overflow if needed 
}}>
                <div className={'northern-lights-background'}></div>
        <div style = {{overflowX: 'hidden'}}>
        <div className={'homepage-animation-square-one opaque-square'} style = {{overflowX: 'hidden'}}></div>
        <div className={"homepage-animation-square-two opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={"homepage-animation-square-three opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={"homepage-animation-square-four opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={'dashboard-animation-square-one opaque-square'} style = {{overflowX: 'hidden'}}></div>
        <div className={"dashboard-animation-square-two opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={"dashboard-animation-square-three opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={'dashboard-animation-square-four opaque-square'} style = {{overflowX: 'hidden'}}></div>
        <div className={"dashboard-animation-square-five opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={"dashboard-animation-square-six opaque-square"} style = {{overflowX: 'hidden'}}></div>
        </div>
        <Header languageProps={{ language: 'en' }} colorProps={{ color: 'dark' }} pageProps={{ page: 'dashboard'}} />

        <div style={{height: '60vh', }}>
          <div style={{ 
            fontSize: '55px', fontWeight: 'bold', textAlign: 'center', 
            color: '#333333', marginTop: '300px'
          }}>
            Connect a wallet to get started
          </div>
        </div>


  
      </div>
          
          
        ) : (
          <div>
            { isEmptyAccount ? (


<div style={{ 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    overflowX: 'hidden', 
    overflowY: 'hidden'  // Also prevent vertical overflow if needed 
}}>
                <div className={'northern-lights-background'}></div>
        <div style = {{overflowX: 'hidden'}}>
        <div className={'homepage-animation-square-one opaque-square'} style = {{overflowX: 'hidden'}}></div>
        <div className={"homepage-animation-square-two opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={"homepage-animation-square-three opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={"homepage-animation-square-four opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={'dashboard-animation-square-one opaque-square'} style = {{overflowX: 'hidden'}}></div>
        <div className={"dashboard-animation-square-two opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={"dashboard-animation-square-three opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={'dashboard-animation-square-four opaque-square'} style = {{overflowX: 'hidden'}}></div>
        <div className={"dashboard-animation-square-five opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={"dashboard-animation-square-six opaque-square"} style = {{overflowX: 'hidden'}}></div>
        </div>
        <Header languageProps={{ language: 'en' }} colorProps={{ color: 'dark' }} pageProps={{ page: 'dashboard'}} />

        <div style={{height: '60vh', }}>
          <div style={{ 
            fontSize: '55px', fontWeight: 'bold', textAlign: 'center', 
            color: '#333333', marginTop: '300px'
          }}>
            This is an empty account
          </div>
          <div style={{ 
            fontSize: '25px', fontWeight: 'bold', textAlign: 'center', 
            color: '#333333', marginTop: '10px',
          }}>
            
            <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '100%',  // Assumes the parent container spans the width of the viewport or its container
                  margin: 'auto'
              }}>
              <span style={{ fontSize: '25px', marginRight: '0px' }}>
                  To get started, please fund your account with USDC
              </span>   
              <img src={solIcon} 
                  alt="Solana Logo" 
                  style={{ height: '20px', width: 'auto', marginLeft: '-5px', 
                            padding: '10px 7px', borderRadius: '5px', marginRight: '0px' }} 
              />
              <span style={{ fontSize: '25px', marginRight: '0px' }}>
                  for investing
              </span>                 

          </div>

          <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '100%',  // Assumes the parent container spans the width of the viewport or its container
                  margin: 'auto'
              }}>
                              <span style={{ fontSize: '25px', marginRight: '0px' }}>
                  and 
              </span>   
              <img src={SolanaLogo} 
                  alt="Solana Logo" 
                  style={{ height: 'auto', width: 'auto', 
                  maxWidth: '70px', maxHeight: '25px', marginLeft: '5px', background: 'linear-gradient(to top right, #9945FF, #14F195)',  
                  padding: '10px 7px', borderRadius: '5px', marginRight: '3px' }}
              />
              <span style={{ fontSize: '25px', marginRight: '0px' }}>
                  for on chain fees
              </span>                

                </div>


          </div>
        </div>
      </div>

          ) : (


            <div style={{ fontSize: '40px' }}>
            <Header languageProps={{ language: 'en' }} colorProps={{ color: 'dark' }} pageProps={{ page: 'dashboard'}}/>
          
          <div style={{paddingTop: (principalInvested >= 0.0000001) ? '70px' : '100px'}}>




          { (principalInvested >= 0.10) && (

<div style={{display: 'flex', flexDirection: 'row', marginLeft: '40px',
marginTop: '40px', marginRight: '40px', color: '#333333', gap: '40px'}}>

<div style={{flex: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
borderRadius: '10px', padding: '20px', 
color: '#333333'}}> 
     <YieldingChartComponent screenSize='large'/>
</div>

<div style={{flex: 0.5, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
borderRadius: '10px', padding: '20px', 
color: '#333333'}}> 
     <YieldingPositionComponent/>
</div>

</div>
          )}



              <div style={{display: 'flex', flexDirection: 'row', marginLeft: '40px',
              marginTop: '40px', marginRight: '40px', color: '#333333', gap: '40px'}}>

            <div style={{flex: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
            borderRadius: '10px', padding: '20px'}}> 
            Portfolio
            <PieChartComponent/>
            </div>

            <div style={{flex: flexValue, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
            borderRadius: '10px', padding: '20px'}}> 

            { (principalInvested >= 0.10) ? (
              <>Deposit</>
            ) : (
              <>Investing</>
            )}
                 <InvestingComponent language={languageRef}/>
            </div>
            </div>

            
          
          </div>


          <div style={{display: 'flex', flexDirection: 'row', marginLeft: '40px',
              marginTop: '40px', marginRight: '40px', marginBottom: '40px', color: '#333333', gap: '40px'}}>

          <div style={{flex: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
            borderRadius: '10px', padding: '20px', maxHeight: '280px'}}> 

              Balances
              <BalancesComponent/>
            </div>

          <div style={{flex: flexValue, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
            borderRadius: '10px', padding: '20px', color: '#333333'}}> 

              Principal
              <TransactionsComponent/>
            </div>


</div>
</div>

          )}


        </div>
        )}
</div>
    );
}


  export default Dashboard;

  