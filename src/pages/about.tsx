import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import AboutPageText from '../components/aboutPage/aboutPageText';
import AboutPageText2 from '../components/aboutPage/aboutPageText2';
import AboutPageText3 from '../components/aboutPage/aboutPageText3';
import AboutPageText4 from '../components/aboutPage/aboutPageText4';
import { useParams } from 'react-router-dom';
import { setLanguage } from '../helpers/languageManager';
import { LanguageCodeProps } from '../helpers/languageManager';
import background4 from '../assets/background4.png';
import background5 from '../assets/background5.png';
import checkMarkImage from '../assets/checkmarkImage.png';
import bankIcon from '../assets/bankIcon.png';
import checkmarkImage from '../assets/checkmarkImage.png';
import Footer from '../components/footer';
import cashImage from '../assets/cashImage.png';
import chromeInvestmentImgage from '../assets/investingImage4.png';
import { useNavigate } from 'react-router-dom';

function About() {
  const [interest, setInterest] = useState(0);

  const [goToDashboardIsHovered, setgoToDashboardIsHovered] = useState(false);
  //Pass language to components
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  const [languageRef, setLanguageRef] = useState<LanguageCodeProps['language']>('en');
  useEffect(() => {
    if (lang && (lang === 'en' || lang==='da' || lang === 'fr' || lang === 'es' || lang === 'it' || 
    lang === 'pt' || lang === 'sk' || lang === 'ar' || lang === 'tr' || lang === 'fr' || 
    lang === 'hi' || lang === 'zh' || lang === 'id' || lang === 'ko' || lang === 'ja' || 
    lang === 'ru' || lang === 'ur' || lang === 'fl' || lang === 'mr' || lang === 'te' || 
    lang === 'ta' || lang === 'vi' || lang === 'sw')) {
      setLanguage(lang);
      setLanguageRef(lang);
    } else {
      // default to 'en'
      setLanguage('en');
      setLanguageRef('en');
    }

    const delayedStartAnimation = () => {
      setTimeout(() => {
        requestAnimationFrame(startAnimation);
      }, 700);
    };

    delayedStartAnimation();

    //Animate Earn interest number
    let startTime: number | undefined;
    let animationFrameId: number | undefined;

    const startAnimation = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const elapsedTime = timestamp - startTime;

      if (elapsedTime < 1000) {
        // Animate from 0.0 to 2.0 in 1 second
        setInterest((elapsedTime / 1000) * 2);
      } else if (elapsedTime < 2000) {
        // Animate from 2.0 to 3.0 in 1 second
        setInterest(2 + ((elapsedTime - 1000) / 1000));
      } else if (elapsedTime < 3000) {
        // Animate from 3.0 to 3.5 in 1 second
        setInterest(3 + ((elapsedTime - 2000) / 1000) * 0.5);
      } else if (elapsedTime < 4000) {
        // Animate from 3.5 to 3.8 in 1 second
        setInterest(3.5 + ((elapsedTime - 3000) / 1000) * 0.3);
      } else if (elapsedTime < 6000) {
        // Animate from 3.8 to 4.1 in 1 second
        setInterest(3.8 + ((elapsedTime - 4000) / 2000) * 0.3);
      } else {
        // Animation complete, stop the animation loop
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      }

      if (interest < 4.1) {
        // Continue the animation loop until reaching 4.1%
        animationFrameId = requestAnimationFrame(startAnimation);
      }
    };

    //animationFrameId = requestAnimationFrame(startAnimation);

    // Cleanup the animation frame when the component unmounts
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [lang]);

  

  return (
    <div style = {{overflowX: 'hidden'}}>

<Header languageProps={{ language: 'en' }} colorProps={{ color: 'dark' }} pageProps={{ page: 'about' }} />
    <div
      style={{
        paddingTop: window.innerWidth < 768 ? '75px' : '100px',
        minHeight: '89vh',
        display: 'flex',
        justifyContent: 'space-between',  // Spread content and image
        alignItems: 'center',  // Vertically center both
      }}
    >


    <div style={{ 
  fontSize: window.innerWidth < 768 ? '30px' : '50px', 
  paddingTop: window.innerWidth < 768 ? '30px' : '20px',
  color: '#333333', 
  paddingLeft: window.innerWidth < 768 ? '25px' : '55px',
  display: 'flex', // Add this to enable flex layout
  alignItems: 'flex-start', // Add this to align items to the top
  justifyContent: 'space-between'
}}>
  <div>
    <div >Earn</div>
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: '10px', // Adjust the radius to your preference
      padding: '6px', // Add padding as needed
      width: window.innerWidth < 768 ? '180px' : '300px',
      color:  '333333', 
    }}>
    <span style={{
        width: window.innerWidth < 768 ? '42px' : '70px', // adjust this value based on your needs
        display: 'inline-block',
        textAlign: 'right' // makes the number align to the right, so if the number is short, the extra space will be on the left
    }}>
        {interest.toFixed(1)}
    </span>
    <span>
        % Interest
    </span>
    </div>
    <div style={{paddingBottom: '10px'}}>
      <AboutPageText language={languageRef} />
    </div>
  </div>

  {window.innerWidth > 768 && (

    <div style={{display: 'flex', flexDirection: 'column', 
    gap: '50px', alignItems: 'center'}}>

<img 
  style={{ maxWidth: window.innerWidth < 1350 ? window.innerWidth < 1150 ? '250px': '400px' : '600px', 
  marginLeft: window.innerWidth < 1350 ? window.innerWidth < 1150 ? '100px' : '150px' : '200px',
  marginTop: window.innerWidth < 1150 ? '150px' : '150px', 
  height: 'auto', alignItems: 'center'}}
  src={cashImage}
  />

  </div>)}


</div>


{window.innerWidth < 768 && (
  <div style={{display: 'flex', alignItems: 'center', 
  justifyContent: 'center', flexDirection: 'column'}}>
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  </div>
</div>
)}

      </div>
      <AboutPageText2 language={languageRef} />


      {window.innerWidth < 768 ? (
        <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
          marginTop: '70px' }}>
          <img
        src={checkMarkImage}
        alt=""
        style={{
          width: '70vw', // Ensure the image fits within the screen width
          maxWidth: '300px',
          height: 'auto',  // Maintain the image's aspect ratio
          margin: '0 auto', // Center the image horizontally
        }}
      />
      </div>

      <AboutPageText3 language={languageRef} />
      </div>
      ) : (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
          marginTop: '70px', flexDirection:'row', maxWidth: '100vw' }}>
          <img
        src={checkMarkImage}
        alt=""
        style={{
          width: '40vw', // Ensure the image fits within the screen width
          maxWidth: '350px',
          height: 'auto',  // Maintain the image's aspect ratio
          margin: '0 auto', // Center the image horizontally
        }}
      />
            <AboutPageText3 language={languageRef} />
      </div>


      )}

      <div>
        {window.innerWidth < 768 ? (
          <div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
          marginTop: '70px' }}>
          <img
        src={bankIcon}
        alt=""
        style={{
          width: '80vw', // Ensure the image fits within the screen width
          height: 'auto',  // Maintain the image's aspect ratio
          margin: '0 auto', // Center the image horizontally
        }}
      />
      
      </div>
      <AboutPageText4 language={languageRef} />
      </div>

      
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
          marginTop: '70px', flexDirection: 'row', maxWidth: '100vw' }}>

<AboutPageText4 language={languageRef} />
          <img
        src={bankIcon}
        alt=""
        style={{
          width: '40vw', // Ensure the image fits within the screen width
          maxWidth: '380px',
          height: 'auto',  // Maintain the image's aspect ratio
          margin: '0 auto', // Center the image horizontally
        }}
      />

      </div>
        )}
      </div>
      <Footer />
      </div>
  );
}

export default About;

