import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ondoImage from '../assets/Ondo.png';

function ReceivingUsdyWidget() {
    const pubKey = useSelector((state: any) => state.userWalletData.pubKey);

    const displayKey = pubKey ? `${pubKey.substring(0, 3)}...${pubKey.substring(pubKey.length - 3)}` : '';

    return (
        <div style={{
            position: 'absolute', // or 'fixed' if you want it to stay at the top even when scrolling
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <img src={ondoImage} alt="Ondo" style={{ marginRight: '10px', maxWidth:'25px', height:'auto' }} />
            <span>Received US Dollar Yield {displayKey}</span>
        </div>
    );
}

export default ReceivingUsdyWidget;
