import React, { useState, useEffect, useContext, useRef } from 'react';
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
import { useParams } from 'react-router-dom';
import HomePageDataPoints from '../components/homePage/homePageDataPoints';
import HomePageTextOne from '../components/homePage/homePageTextOne';
import HomePageTextTwo from '../components/homePage/homePageTextTwo';
import HomePageTextThree from '../components/homePage/homePageTextThree';
import verificationImage from '../assets/verificationImage.png';
import HomeContactForm from '../components/homePage/homePageContactForm';
import SolanaLogo from '../assets/solanaLogo.png';
import circleLogo from'../assets/circleLogo.png';
import phantomLogoPurple from '../assets/Phantom-Logo-Purple.png';
import HomePageTitle from '../components/homePage/homePageTitle';
import HomePageFooter from '../components/homePage/homePageFooter';
import HomePageSubTitle from '../components/homePage/homePageSubTitle';
import MyFyeLogo1 from '../assets/MyFyeLogo1.png';
import HandsHoldingMoney from '../assets/HandsHoldingMoney.png';
import PiggyBank from '../assets/PiggyBank.jpg';
import Ondo from '../assets/Ondo.png';
import Openden from '../assets/Openden.png';
import Matrixdock from '../assets/Matrixdock.png';
import HomePageTextOneA from '../components/homePage/homePageText1A';

function Home() {

  const navigate = useNavigate();
  const auth = getAuth();
  const [uid, setUID] = useState("");
  const db = getFirestore();
  const isSmallScreen = window.innerWidth <= 768;
  const walletConnected = useSelector((state: any) => state.userWalletData.isConnected);
  const walletType = useSelector((state: any) => state.userWalletData.type);
  const cryptoList = useSelector((state: any) => state.userWalletData.cryptoList);
  const [goToDashboardIsHovered, setgoToDashboardIsHovered] = useState(false);

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


document.body.style.overflowX = 'hidden';
document.body.style.overflowY = 'auto';
      

  console.log('cryptoList: ', cryptoList)
  if (isSmallScreen) {
    return (
<div 
    style={{ 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    overflowX: 'hidden',   // Also prevent vertical overflow if needed 
}}>
        <div style = {{overflowX: 'hidden'}}>
        <div className={'homepage-animation-square-one opaque-square'} style = {{overflowX: 'hidden'}}></div>
        <div className={"homepage-animation-square-two opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={"homepage-animation-square-three opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={"homepage-animation-square-four opaque-square"} style = {{overflowX: 'hidden'}}></div>
        <div className={'home-background'} 
            style={{ 
              width: '100%',
              height: '100%',
              zIndex: 1
          }}></div>
        </div>
        <div>
               <Header languageProps={{ language: 'en' }} colorProps={{ color: 'dark' }} pageProps={{ page: 'home' }} />
               </div>
       <div style = {{overflowX: 'hidden'}}>

        <div style={{ display: 'flex', flexDirection: 'column', 
            minHeight: 'calc(100vh - 10px)' }}>
          <div style={{display: 'flex', flexDirection: 'column',
            marginTop: '80px', alignItems: 'center', color: '#333333',
            textAlign: 'center',  paddingTop: window.innerWidth < 768 ? '75px' : '100px'}}>
                
                <HomePageTitle language={languageRef}/>

                <HomePageSubTitle language={languageRef}/>

                 <div 
                 className={'fade-in-animation'}
                    style={{
                    fontSize: isSmallScreen ? '20px' : '34px',
                    marginTop: '35px',
                    border: goToDashboardIsHovered ?  '2px solid #333333' : '2px solid #333333',
                    borderRadius: '10px',
                    padding: isSmallScreen ? '10px' : '15px',
                    cursor: 'pointer',
                    background: goToDashboardIsHovered ? '#333333' : 'transparent',
                    color: goToDashboardIsHovered ? 'white' : '#333333',
                    marginBottom: '50px',
                    }}
                    onMouseEnter={() => setgoToDashboardIsHovered(true)}
                    onMouseLeave={() => setgoToDashboardIsHovered(false)}
                    onClick={() => {
                    navigate(`/${lang}/dashboard`);
                    window.scrollTo(0, 0);
                    }}>
                    Go to Dashboard
                </div>

                </div>

                    <div style={{flex: '1'}}></div>
                    <div 
                    className={'fade-in-animation'} style={{ textAlign: 'center', color: '#333333', fontSize: isSmallScreen ? '18px' : '25px', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center',}}>Powered By</div>
                    <div className={'fade-in-animation'} style={{ textAlign: 'center', color: '#333333', fontSize: '25px', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', gap: '10px' }}>

                    <img 
                     src={phantomLogoPurple} alt="Solana Logo" style={{ height: 'auto', width: 'auto', 
                    maxWidth: '70px', maxHeight: '25px', marginLeft: '5px', backgroundColor: 'white', 
                    padding: '10px 7px', borderRadius: '5px', marginRight: '3px' }} />

                    <img 
                    src={SolanaLogo} alt="Solana Logo" style={{ height: 'auto', width: 'auto', 
                    maxWidth: '70px', maxHeight: '25px', marginLeft: '5px', background: 'linear-gradient(to top right, #9945FF, #14F195)',  
                    padding: '10px 7px', borderRadius: '5px', marginRight: '3px' }} />
                    <img 
                    src={circleLogo} alt="Solana Logo" style={{ height: 'auto', width: 'auto', 
                    maxWidth: '70px', maxHeight: '25px', marginLeft: '5px', backgroundColor: 'white', 
                    padding: '7px 7px', borderRadius: '5px', marginRight: '3px' }} />

                    </div>
            </div>


            <div style={{display:'flex', flexDirection: 'column', marginTop: '150px', width: '100vw',
                justifyContent: 'space-between', gap: '15px'}}>

                <HomePageTextOne language={languageRef}/>

                <div style={{width: '45%', marginRight: isSmallScreen ? '25px' : '55px' }}>
                <HomePageDataPoints language={languageRef}/>
                </div>

            </div>

            <div style={{display:'flex', flexDirection: 'column', marginTop: '150px', width: '100vw',
                justifyContent: 'space-between', gap: '45px'}}>

                
                <div style={{width: '45%',
                marginLeft: isSmallScreen ? 'auto' : '55px',
                marginRight: isSmallScreen ? 'auto' : '0',
                display: 'flex', 
                justifyContent: 'center',}}>
                <img
                    src={verificationImage}
                    alt=""
                    style={{
                    maxWidth: isSmallScreen ? '75vw' : '370px',  // Ensure the image fits within the screen width
                    height: isSmallScreen ? 'auto' : 'auto',  // Maintain the image's aspect ratio
                    margin: '0 auto' // Center the image horizontally
                    }}
                />
                </div>

                <HomePageTextTwo language={languageRef}/>

            </div>




            <div style={{display:'flex', flexDirection: 'column', marginTop: '150px', width: '100vw',
                justifyContent: 'space-between', gap: '10px'}}>

                <HomePageTextThree language={languageRef}/>

                <div style={{width: '45%', marginRight: isSmallScreen ? '25px' : '55px' }}>
                <HomeContactForm language={languageRef}/>
                </div>

            </div>


            <HomePageFooter language={languageRef}/>
        <Footer />
        </div>
      </div>
    )
  };

  
    return (
      <div>


<div>
               <Header languageProps={{ language: 'en' }} colorProps={{ color: 'dark' }} pageProps={{ page: 'home' }} />
               </div>

<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
    
<div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '50px'}}>

    <img 
        src={MyFyeLogo1} 
        alt="Solana Logo" 
        style={{ 
            height: 'auto', 
            width: 'auto', 
            maxWidth: '400px', 
            marginLeft: '35px', 
            marginTop: '35px', 
            backgroundColor: 'white', 
            borderRadius: '5px',
        }} 
    />
    
        <HomePageTextOneA language={languageRef}/>

    <div 
      style={{
      fontSize: '20px',
      fontWeight: 'bold',
      marginTop: '35px',
      border: goToDashboardIsHovered ?  '2px solid #333333' : '2px solid #333333',
      borderRadius: '20px',
      padding: isSmallScreen ? '10px' : '15px',
      cursor: 'pointer',
      background: goToDashboardIsHovered ? 'transparent' : '#333333',
      color: goToDashboardIsHovered ? '#333333' : 'white',
      marginBottom: '50px',
      }}
      onMouseEnter={() => setgoToDashboardIsHovered(true)}
      onMouseLeave={() => setgoToDashboardIsHovered(false)}
      onClick={() => {
      navigate(`/${lang}/dashboard`);
      window.scrollTo(0, 0);
      }}>
      CONNECT TO MY EARNINGS DASHBOARD
                </div>


    </div>

    <img 
        src={HandsHoldingMoney} 
        style={{ 
            height: 'auto', 
            width: 'auto', 
            maxWidth: '400px', 
            marginLeft: '35px', 
            marginTop: '115px', 
            backgroundColor: 'white', 
            borderRadius: '5px',
            marginRight: '-1px'
        }} 
    />
</div>



<div style={{position: 'relative'}}>
    
    <div style={{ 
        position: 'absolute', 
        fontSize: '40px',
        fontWeight: 'bold',
        top: '60px', 
        left: '60px', 
        color: '#333333',
        maxWidth: '400px' // you can adjust this value as needed
    }}>
        No bank account.<br />
        <br />
        Safe, low-risk yield.<br />
        <br />
        Instant liquidity when you need it.
    </div>


    <div style={{ 
        position: 'absolute', 
        fontSize: '40px',
        fontWeight: 'bold',
        bottom: '190px', 
        right: '50px', 
        color: '#333333',
        maxWidth: '400px' // you can adjust this value as needed
    }}>
    Start earning 4.1% APY on your money today using Myfye
    </div>




    <img 
        src={PiggyBank} 
        alt="PiggyBank Background" 
        style={{ 
            height: 'auto', 
            width: '100vw', 
            marginTop: '50px', 
        }} 
    />
</div>

<div style={{ 
    textAlign: 'center', 
    fontSize: '45px', 
    maxWidth: '80vw',
    fontWeight: 'bold', 
    margin: '0 auto',  // This will center the block on the page
    marginTop: '70px'
}}>
Bringing safe, liquid yield to the world using  institutional grade tokenized treasury bonds 

</div>

<div style={{display: 'flex',
 alignItems: 'center', margin: '0 auto', marginTop: '60px', 
 justifyContent: 'center'}}>

<img 
        src={Openden} 
        style={{ 
          width: '300px',
          height: 'auto'
        }} 
    />

<img 
        src={Ondo} 
        style={{ 
          width: '100px',
          height: '100px'
        }} 
    />

<img 
        src={Matrixdock} 
        style={{ 
          width: '300px',
          height: 'auto'
        }} 
    />


</div>

<div 
      style={{
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '0 auto',
      marginTop: '65px',
      marginBottom: '50px',
      textAlign: 'center',
      border: goToDashboardIsHovered ?  '2px solid #333333' : '2px solid #333333',
      borderRadius: '20px',
      padding: isSmallScreen ? '10px' : '15px',
      cursor: 'pointer',
      background: goToDashboardIsHovered ? 'transparent' : '#333333',
      color: goToDashboardIsHovered ? '#333333' : 'white',
      maxWidth: '420px'
      }}
      onMouseEnter={() => setgoToDashboardIsHovered(true)}
      onMouseLeave={() => setgoToDashboardIsHovered(false)}
      onClick={() => {
      navigate(`/${lang}/dashboard`);
      window.scrollTo(0, 0);
      }}>
      HAVE QUESTIONS? SEND US A MESSAGE
                </div>
        
        <div style={{ padding: '20px', fontSize: '25px'}}>
        Copyright © 2023 MyFye - All Rights Reserved.
        </div>
      </div>
    );
}


  export default Home;
