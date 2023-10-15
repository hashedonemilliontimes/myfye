import React, { useState, useEffect, useContext, useRef } from 'react';
import { LanguageCodeProps } from '../../helpers/languageManager';

export default function HomePageTextThree(props: LanguageCodeProps) {

    const isSmallScreen = window.innerWidth <= 768;

  return (
    <div style={{display:'flex', flexDirection: 'column', textAlign: 'left',
    marginLeft: isSmallScreen ? '25px' : '55px', width: isSmallScreen ? '80vw' : '45%', color: '#333333'}}>

<div className={"opaque-square"}>
<div className={"homepage-animation-square-seven"}></div>
</div>

        <div style={{fontWeight: 'bold', fontSize: isSmallScreen ? '35px' : '65px'}}>
            Talk to our team
        </div>

        <div style={{fontSize: isSmallScreen ?  '20px' : '25px', marginTop: '35px'}}>Learn how MyFye can empower you with a stable return on your investment. Fill out our form and we will be in touch shortly.</div>

    </div>


  );
}