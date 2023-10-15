import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { setLanguage } from '../../helpers/languageManager';
import GlobeMenu from '../globeMenu';
import TypingAnimation from './aboutTypingAnimation';
import { LanguageCodeProps } from '../../helpers/languageManager';

export default function AboutPageText3(props: LanguageCodeProps) {


  const params = useParams();

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
    <div style={{display: 'flex', flexDirection:'row',}}>
    <div style={{ flex: 1 }}></div>
        <div style={{ fontSize: window.innerWidth < 768 ? '30px' : '60px', color: '#333333', textAlign: 'right',
        marginRight: window.innerWidth < 768 ? '24px' : '60px', 
        marginTop: window.innerWidth < 768 ? '140px' : '70px',
        width: window.innerWidth < 768 ? '320px' : '45vw', }}>
        How can I trust MyFye?
        </div>
        </div>

        <div style={{display: 'flex', flexDirection:'row', marginBottom: '65px',}}>
        <div style={{ flex: 1 }}></div>

        <div style={{ fontSize: window.innerWidth < 768 ? '20px' : '26px', color: '#333333', textAlign: 'right',
        marginRight: window.innerWidth < 768 ? '24px' : '60px', width: window.innerWidth < 768 ? '320px' : '45vw',
         }}>
            A trustworthy platform is defined by several key attributes. 
            These qualities encompass a platform's history, longevity, team incentives, and technical abilities
            for securing your funds. MyFye is committed to keeping it's doors open and funds available for you to 
            withdraw your money anyday and anytime. We are going to continue to build our name to be known for
            integrity because we want your and your family's business in the years to come.
        </div>
        </div>
    </div>

</div>


  );
}