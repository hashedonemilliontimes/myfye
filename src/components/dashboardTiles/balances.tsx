import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import crypto from '../../helpers/cryptoDataType';
import solanaIconGradient from '../../assets/solanaIconGradient.png';
import usdcSolIcon from '../../assets/usdcSolIcon.png';

const BalancesComponent = () => {

  const cryptoList = useSelector((state: any) => state.userWalletData.cryptoList);
  const isSmallScreen = window.innerWidth <= 768;
  const labels = cryptoList.map((crypto: any) => crypto.type.toUpperCase());
  const dataPoints = cryptoList.map((crypto: any) => crypto.balanceUSD);

  const usdc: crypto = cryptoList[0]
  const solana: crypto = cryptoList[1]

  return (<div>

<div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>

    {(usdc.balanceNative > 0.01) && (
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', 
      padding: '15px', gap: '15px'}}>

        <img
        src= {usdcSolIcon}
        alt=""
        style={{
          width: '70px', // Set the desired width
          height: 'auto', // Set the desired height
        }}></img>
        <div style={{fontSize: isSmallScreen ? '20px' : '30px'}}>USDC</div>

        <div style={{ flex: 1 }}></div>

        <div style={{fontSize: isSmallScreen ? '20px' : '30px'}}>$ {usdc.balanceNative.toFixed(4)}</div>
      </div>
    )}


{(solana.balanceNative > 0.01) && (
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', 
      padding: '15px', gap: '15px'}}>



        <div
          style={{
            width: '65px',  // Set to desired width of the circle
            height: '65px',  // Set to desired height of the circle
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'black'
          }}
        >
          <img
            src={solanaIconGradient}
            alt=""
            style={{
              width: '40px',
              height: '40px'
            }}
          />
        </div>

        <div style={{fontSize: isSmallScreen ? '20px' : '30px'}}>Solana</div>

        <div style={{ flex: 1 }}></div>

        <div style={{fontSize: isSmallScreen ? '20px' : '30px'}} >{solana.balanceNative.toFixed(4)} SOL</div>
      </div>
    )}

    </div>


    </div>);
};

export default BalancesComponent;