import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { setLanguage } from '../../helpers/languageManager';
import GlobeMenu from '../globeMenu';
import TypingAnimation from './aboutTypingAnimation';
import { LanguageCodeProps } from '../../helpers/languageManager';

export default function AboutPageText4(props: LanguageCodeProps) {


    const navigate = useNavigate();
  const params = useParams();
  const [goToDashboardIsHovered, setgoToDashboardIsHovered] = useState(false);

  /*
    <div style={{ marginLeft: window.innerWidth < 768 ? '15px' : '60px', marginTop: '65px', textAlign: 'left' }}>
    <div style={{ fontSize: window.innerWidth < 768 ? '30px' : '60px', color: '#333333', textAlign: 'left' }}>
      {props.language === 'en' && "Trusting Your Financial Future to Ependesi"}
    </div>
  </div>

  <div style={{ marginLeft: window.innerWidth < 768 ? '15px' : '60px', fontSize: window.innerWidth < 768 ? '20px' : '26px', width: window.innerWidth < 768 ? '390px' : '750px', marginBottom: '40px', textAlign: 'left' }}>
    {props.language === 'en' && "The Greek word for investment. An investment is the commitment of funds for a period of time, which is expected to bring additional funds to the investor. In technical terms, an investment is a sequence of Net Cash Flows. To make an investment, an analysis of the securities is done first, followed by portfolio management techniques."}
  </div>
  */

  //{props.language === 'en' && "Who can you trust?"}

  return (
<div>
    <div>
        <div style={{ fontSize: window.innerWidth < 768 ? '30px' : '60px', color: '#333333', textAlign: 'left',
        marginLeft: window.innerWidth < 768 ? '15px' : '60px', 
        marginTop: window.innerWidth < 768 ? '140px' : '70px', }}>
        How do I get started?
        </div>

        <div style={{display: 'flex', flexDirection:'row', }}>

        <div style={{ fontSize: window.innerWidth < 768 ? '20px' : '26px', color: '#333333', textAlign: 'left',
        marginLeft: window.innerWidth < 768 ? '15px' : '60px', width: window.innerWidth < 768 ? '90%' : '45vw',
         }}>
            To begin growing your wealth with us, simply deposit some USDC. 
            We'll guide you through the deposit process, and from then on, we 
            handle everything. You can monitor your money's growth or make withdrawals anytime.
        </div>
        </div>

         <div
        style={{
      fontSize: '34px', 
      marginLeft: window.innerWidth < 950 ? '40px': '60px',
      marginBottom: '50px',
      marginTop: '15px',
      border: goToDashboardIsHovered ? '2px solid white' : '2px solid #333333',
      borderRadius: '10px',
      padding: '15px',
      cursor: 'pointer',
      background: goToDashboardIsHovered ? '#333333' : 'transparent',
      color: goToDashboardIsHovered ? 'white' : '#333333',
      maxWidth: '260px',
      textAlign: 'center',

    }}
    onMouseEnter={() => setgoToDashboardIsHovered(true)}
    onMouseLeave={() => setgoToDashboardIsHovered(false)}
    onClick={() => {
      navigate(`/${props.language}/dashboard`);
      window.scrollTo(0, 0);
    }}>
    Go to Dashboard
  </div>

    </div>

</div>


  );
}