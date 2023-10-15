import React, { useState, useEffect, useContext, useRef } from 'react';
import { LanguageCodeProps } from '../../helpers/languageManager';

export default function HomePageTextTwo(props: LanguageCodeProps) {

    const isSmallScreen = window.innerWidth <= 768;

  return (
    <div style={{display:'flex', flexDirection: 'column', textAlign: 'left',
    marginLeft: isSmallScreen ? '25px' : '0px',
    marginRight: isSmallScreen ? '0px' : '55px', width: isSmallScreen ? '80vw' : '45%', color: '#333333'}}>

    <div className={"opaque-square"}>
    <div className={"homepage-animation-square-six"}></div>
    </div>

        <div style={{fontWeight: 'bold', fontSize: isSmallScreen ? '35px' : '65px'}}>
            Your broker for the long term
        </div>

        <div style={{fontSize: isSmallScreen ? '20px' : '25px', marginTop: '35px'}}>At MyFye, security and integrity are paramount. With a relentless focus on guarding your assets and data, you can invest with confidence, knowing you're backed by a platform that puts you first.</div>

    </div>


  );
}