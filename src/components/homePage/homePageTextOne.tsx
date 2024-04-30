import React, { useState, useEffect, useContext, useRef } from 'react';
import { LanguageCodeProps } from '../../helpers/languageManager';

export default function HomePageTextOne(props: LanguageCodeProps) {

    const isSmallScreen = window.innerWidth <= 768;

  return (
    <div style={{display:'flex', flexDirection: 'column', textAlign: 'left',
    marginLeft: isSmallScreen ? '25px' : '55px', width: isSmallScreen ? '80vw' : '45vw', color: '#333333'}}>

<div className={"opaque-square"}>
<div className={"homepage-animation-square-five"}></div>
</div>
        <div style={{fontWeight: 'bold', fontSize: isSmallScreen ? '35px' : '65px' }}>
            Funds you can set and forget
        </div>

        <div style={{fontSize: isSmallScreen ? '20px' : '25px', marginTop: '35px'}}>Choose MyFye for a more secure financial future. Why let cash sit idle? Shift to treasuries - a borderless, open, and cost-effective way to safeguard your future.</div>

    </div>


  );
}