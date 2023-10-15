import React, { useState, useEffect, useContext, useRef } from 'react';
import { LanguageCodeProps } from '../../helpers/languageManager';
import { useNavigate } from 'react-router-dom';


export default function HomePageTextOne(props: LanguageCodeProps) {

    const [goToDashboardIsHovered, setgoToDashboardIsHovered] = useState(false);

    const isSmallScreen = window.innerWidth <= 768;

    const navigate = useNavigate();
  return (


<div style={{ height: '70vh', overflow: 'hidden', position: 'relative', 
display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>

        <div style={{ position: 'absolute', top: '50%', left: '50%', 
        transform: 'translate(-50%, -50%)', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        marginTop: isSmallScreen ? '100px' : '100px', color: 'black',
        gap: isSmallScreen ? '30px' : '30px' }}>
            <div style={{ textAlign: 'center', fontFamily: 'cursive', fontSize: '20px' }}>
            The safest investment in the world from anywhere in it
            </div>

        <div 
        style={{
            fontSize: '25px',
            border: '2px solid #007AFF',
            borderRadius: '10px',
            padding: isSmallScreen ? '5px' : '10px',
            cursor: 'pointer',
            background: '#007AFF',
            color: '#333333',
            boxShadow: goToDashboardIsHovered ? '0 0 5px #007AFF, 0 0 10px #007AFF, 0 0 15px #007AFF' : '',
            textAlign: 'center'
        }}
        onMouseEnter={() => setgoToDashboardIsHovered(true)}
        onMouseLeave={() => setgoToDashboardIsHovered(false)}
        onClick={() => {
            navigate(`/${props.language}/dashboard`);
            window.scrollTo(0, 0);
        }}
        >
        See your portfolio
        </div>

        </div>

    </div>



  );
}

