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
import crypto from '../helpers/cryptoDataType';
import { useParams } from 'react-router-dom';
import HomePageDataPoints from '../components/homePage/homePageDataPoints';
import HomePageTextOne from '../components/homePage/homePageTextOne';
import HomePageTextTwo from '../components/homePage/homePageTextTwo';
import HomePageTextThree from '../components/homePage/homePageTextThree';
import HomeContactForm from '../components/homePage/homePageContactForm';
import SolanaLogo from '../assets/solanaLogo.png';
import circleLogo from'../assets/circleLogo.png';
import phantomLogoPurple from '../assets/Phantom-Logo-Purple.png';
import HomePageTitle from '../components/homePage/homePageTitle';
import HomePageFooter from '../components/homePage/homePageFooter';
import HomePageSubTitle from '../components/homePage/homePageSubTitle';
import MyFyeLogo1 from '../assets/MyFyeLogo1.png';
import MyFyeLogo2 from '../assets/MyFyeLogo2.png';
import HandsHoldingMoney from '../assets/HandsHoldingMoney.png';
import HomePageTextOneA from '../components/homePage/homePageText1A';
import MyFyeQRCode from '../assets/myfye_com_qr_code.png';
import PortfolioBreakdown from '../components/homePage/portfolio';
import usdcSol from '../assets/usdcSol.png';
import myfyeUseCase1 from '../assets/myfyeUseCase1.png';

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

  const [sendMessageToggled, setsendMessageToggled] = useState(false);

  const { lang } = useParams<{ lang: string }>();
  const [languageRef, setLanguageRef] = useState<LanguageCodeProps['language']>('en');


  const currentYear = new Date().getFullYear();

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
      


useEffect (() => {
  if (isSmallScreen) {
  navigate(`/${lang}/app`);
  }
}, [lang, isSmallScreen]);

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
                    navigate(`/${lang}/app`);
                    window.scrollTo(0, 0);
                    }}>
                    Launch App
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



    </div>


<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{
    position: 'relative',
    maxWidth: '400px',
    marginLeft: '35px',
    marginTop: '115px',
    marginRight: '15vw'
}}>
    <img 
        src={HandsHoldingMoney} 
        style={{ 
            height: 'auto', 
            width: '100%', 
            backgroundColor: 'white', 
            borderRadius: '5px',
        }} 
    />
    <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: '75%', /* Adjust as needed */
        background: 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))',
        pointerEvents: 'none',
    }}></div>
</div>
</div>

</div>

<div style={{color: '#60A05B', marginTop: '45px', fontSize: '35px', fontWeight:'bold', textAlign: 'center'}}>Earn 5.1% APY directly from your phone</div>

<div style={{            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'}}>
<img 
        src={MyFyeQRCode} 
        alt="MyFyeQR" 
        style={{ 
            height: 'auto', 
            width: '200px', 
            marginTop: '50px', 
        }} 
    />

</div>

<div style={{color: '#60A05B', marginTop: '45px', fontSize: '35px', fontWeight:'bold', textAlign: 'center'}}>Scan your phone to get started today</div>



<div style={{position: 'relative', height: '50vh', background: '#60A05B', marginTop: '45px'}}>
    
    <div style={{ 
        position: 'absolute', 
        fontWeight: 'bold',
        top: '60px', 
        left: '60px', 
        color: 'white',
        maxWidth: '600px',
        fontSize: '40px' // you can adjust this value as needed
    }}>
        Why MyFye?<br />
        <div style={{fontSize: '30px', marginTop: '20px'}}>
        Safe reliable yield on your money.
        </div>
        <div style={{fontSize: '20px', marginTop: '20px'}}>
        MyFye yields come from US treasury bonds, 
        one of the safest and consistent investment 
        products in the world. Check out the portfolio of where 
        your money will be allocated.
        </div>


        <PortfolioBreakdown/>

    </div>

</div>





<div style={{position: 'relative', height: '40vh', background: 'white'}}>
    
    <div style={{ 
        position: 'absolute', 
        fontWeight: 'bold',
        top: '60px', 
        left: '60px', 
        color: '#60A05B',
        maxWidth: '600px',
        fontSize: '40px' // you can adjust this value as needed
    }}>
        No middleman, no custodians.<br />

        <div style={{fontSize: '20px', marginTop: '20px'}}>
        MyFye gives you 100% control over your asset at all times. 
        Your assets are never stored with any third parties, only on your phone.
        </div>
    </div>
</div>


<div style={{position: 'relative', height: '40vh', background: '#60A05B'}}>
    
    <div style={{ 
        position: 'absolute', 
        fontWeight: 'bold',
        top: '60px', 
        left: '60px', 
        color: 'white',
        maxWidth: '600px',
        fontSize: '40px' // you can adjust this value as needed
    }}>
        Instant access to your money when you need it.<br />

        <div style={{fontSize: '20px', marginTop: '20px'}}>
        MyFye gives you instant access to your funds at all times. 
        Need your money to pay for bills, groceries, or rent? Don't worry 
        about any withdrawal delays, you'll always have access to your money on the 
        same day you need it with MyFye!
        </div>
    </div>
</div>



<div style={{position: 'relative', height: '1100px', background: 'white', 
display: 'flex', justifyContent: 'center', marginTop: '60px'}}>
    
    <div style={{ 
        fontWeight: 'bold',
        color: '#60A05B',
        maxWidth: '600px',
        fontSize: '40px' // you can adjust this value as needed
    }}>
        Getting started is easy!<br />

        <div style={{fontSize: '30px', marginTop: '20px', color: '#222222'}}>
1.
        </div>
        <div style={{fontSize: '20px'}}>
MyFye is on mobile only but no need to download an app!
        </div>

        <div style={{fontSize: '20px', marginTop: '20px'}}>
To get started, go to MyFye.com on your phone's web browser or scan the QR code.
        </div>


<div style={{display: 'flex', justifyContent: 'center'}}>
        <img 
        src={MyFyeQRCode} 
        alt="MyFyeQR" 
        style={{ 
            height: 'auto', 
            width: '150px', 
        }} 
    />
</div>

<div style={{fontSize: '30px', marginTop: '10px', color: '#222222'}}>
2.
        </div>
        <div style={{fontSize: '20px'}}>
Connect your payment source
        </div>
        <div style={{fontSize: '20px', marginTop: '20px'}}>
MyFye currently accepts deposits from stablecoins on the Solana network.
        </div>

        <div style={{display: 'flex', justifyContent: 'center'}}>
        <img 
        src={usdcSol} 
        alt="MyFyeQR" 
        style={{ 
            height: 'auto', 
            width: '150px', 
            marginTop: '10px',
        }} 
    />
</div>


        <div style={{fontSize: '30px', marginTop: '10px', color: '#222222'}}>
3.
        </div>
        <div style={{fontSize: '20px', marginTop: '10px',}}>
Deposit and start earning!
        </div>



        <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px',}}>
        <div style={{
            position: 'relative', // This allows absolute positioning within
            display: 'inline-block' // Aligns the image and the dot correctly
        }}>
            <div style={{
                position: 'absolute', // Position relative to the parent
                top: '8px', // 10px from the top of the container
                left: '50%', // Centered horizontally
                backgroundColor: '#444444', // Dot color
                height: '5px', // Dot size
                width: '5px', // Dot size
                borderRadius: '50%', // Makes it round
                transform: 'translateX(-50%)' // Centers the dot exactly
            }}></div>
            <img
                src={myfyeUseCase1}
                alt="MyFyeQR"
                style={{ 
                    height: 'auto', 
                    width: '150px',
                    border: '4px solid #444444', // Metallic border
                    borderRadius: '25px', // Rounded corners
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', // Adding some shadow for depth
                    padding: '4px', // Space between the image and the border
                }}
            />
        </div>
        </div>




    </div>
</div>



{ sendMessageToggled ? (

<>
<HomeContactForm language={languageRef}/>
</>
) : (

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
        setsendMessageToggled(true); 
      }}
    >
      HAVE QUESTIONS? SEND US A MESSAGE
                </div>
)}

        
        <div style={{ padding: '20px', fontSize: '25px'}}>
            Copyright © {currentYear} MyFye - All Rights Reserved.
        </div>
      </div>
    );
}


  export default Home;
