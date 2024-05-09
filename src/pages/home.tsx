import React, { useState, useEffect, useContext, useRef } from 'react';
import { httpsCallable } from "firebase/functions";
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import { LanguageCodeProps } from '../helpers/languageManager';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, setDoc, doc, getDocs } from 'firebase/firestore';
import { Connection, PublicKey } from "@solana/web3.js";
import { useSelector } from 'react-redux';
import crypto from '../helpers/cryptoDataType';
import { useParams } from 'react-router-dom';
import HomeContactForm from '../components/homePage/homePageContactForm';
import Logo from '../assets/Logo.png';
import MyFyeLogo1 from '../assets/MyFyeLogo1.png';
import MyFyeQRCode2 from '../assets/myfye_qr_code2.png';
import PortfolioBreakdown from '../components/homePage/portfolio';
import usdcSol from '../assets/usdcSol.png';
import myfyeUseCase1 from '../assets/myfyeUseCase1.png';
import AiStockImage from '../assets/AiStockImage.png';
import SignUpAppShowcase from '../assets/SignUpAppShowcase.png';
import BanxaAppShowcase from '../assets/BanxaAppShowcase.png';
import AccountAppShowcase from '../assets/AccountAppShowcase.png';

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
  
    return (
      <div>

        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: '30px'}}>
            <img src={MyFyeLogo1} style={{width: 'auto', height: '70px'}}></img>
        </div>

        <div style={{
    display: 'flex',
    justifyContent: 'space-around', 
    flexWrap: 'wrap',
    paddingTop: '100px', 
    margin: '0 auto',
    maxWidth: '1500px', marginTop: '-100px'
}}>
    <div style={{display: 'flex', flexDirection: 'column', minWidth: '400px', maxWidth: '45vw', 
    height: '685px', justifyContent: 'center', gap: '30px'}}>

        <div style={{color: '#447E26', fontSize: '40px', fontWeight: 'bold'}}>Store, save, and earn directly from your phone with no bank account needed.</div>
        <div style={{color: 'black', fontSize: '25px'}}>Myfye gives users around the world instant access to yield on their deposits backed by US treasury bonds, directly from their phone.</div>

        <img
        src={MyFyeQRCode2}
        alt="qrCode"
        style={{
          width: '200px',
          height: '200px',
          border: '2px solid #999999',
          borderRadius: '20px'
        }}
      />

    </div>

    <img src = {AiStockImage} style={{height: '685px', width: '400px'}}></img>
    </div>

    <div style={{backgroundColor: '#447E26', paddingBottom: '50px'}}>


    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '40px'}}>
            <div style={{fontSize: '55px', color: '#ffffff', fontWeight: 'bold'}}>Get Started</div>
            <div style={{marginTop: '10px', fontSize: '25px', color: '#ffffff'}}>Start earning yields in less than 5 minutes</div>
        </div>



        <div style={{
    display: 'flex',
    justifyContent: 'space-around', 
    flexWrap: 'wrap',
    paddingTop: '60px', 
    margin: '0 auto',
    maxWidth: '1500px', marginTop: '10px'
}}>
    <div style={{display: 'flex', flexDirection: 'column', minWidth: '296px', maxWidth: '45vw', 
    height: '380px', justifyContent: 'center', gap: '30px'}}>

        <div style={{color: '#ffffff', fontSize: '40px', fontWeight: 'bold'}}>Create your account</div>
        <div style={{color: '#ffffff', fontSize: '25px'}}>No need to download an app! Simply head to myfye.com and create an account with your email address, socials, or crypto wallet.</div>


    </div>

    <img src = {SignUpAppShowcase} style={{height: '380px', width: '296px'}}></img>
    </div>


    <div style={{
    display: 'flex',
    justifyContent: 'space-around', 
    flexWrap: 'wrap',
    paddingTop: '60px', 
    margin: '0 auto',
    maxWidth: '1500px', marginTop: '10px'
}}>

<img src = {BanxaAppShowcase} style={{height: '380px', width: '296px'}}></img>

    <div style={{display: 'flex', flexDirection: 'column', minWidth: '296px', maxWidth: '45vw', 
    height: '380px', justifyContent: 'center', gap: '30px'}}>

        <div style={{color: '#ffffff', fontSize: '40px', fontWeight: 'bold'}}>Connect to Banxa<sup>TM</sup></div>
        <div style={{color: '#ffffff', fontSize: '25px'}}>Using our partner Banxa™ you can deposit funds on to your Myfye account using credit or debit cards from hundreds of countries around the world.</div>
    </div>

    </div>



    <div style={{
    display: 'flex',
    justifyContent: 'space-around', 
    flexWrap: 'wrap',
    paddingTop: '60px', 
    margin: '0 auto',
    maxWidth: '1500px', marginTop: '10px'
}}>
    <div style={{display: 'flex', flexDirection: 'column', minWidth: '296px', maxWidth: '45vw', 
    height: '380px', justifyContent: 'center', gap: '30px'}}>

        <div style={{color: '#ffffff', fontSize: '40px', fontWeight: 'bold'}}>Deposit and start earning</div>
        <div style={{color: '#ffffff', fontSize: '25px'}}>Deposit your funds into Myfye's yield vault to instantly start earning 5.1% APY on your money. Withdraw instantly for cash whenever you need it!</div>


    </div>

    <img src = {AccountAppShowcase} style={{height: '380px', width: '296px'}}></img>
    </div>



    </div>

    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '40px'}}>
    <div style={{fontSize: '40px', color: '#124C0A', fontWeight: 'bold'}}>Customer Service</div>
<div style={{fontSize: '25px', color: '#000000'}}>We’re here to help you with any questions you might have.</div>

    </div>
{ sendMessageToggled ? (

<>
<div style={{marginTop: '20px', background: '#DDDDDD'}}>
<HomeContactForm language={languageRef}/>
</div>
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
      SEND US A MESSAGE
                </div>
)}

        
        <div style={{ padding: '20px', backgroundColor: '#124C0A'}}>

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '40px'}}>

        <img src={Logo} style={{width: 'auto', height: '70px'}}></img>

        <div style={{paddingTop: '20px', color: '#ffffff', fontSize: '25px'}}>©️ Myfye Ltd. All Rights Reserved</div>

        </div>
        </div>
      </div>
    );
}


  export default Home;
