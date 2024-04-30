import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import crypto from '../../helpers/cryptoDataType';
import solanaIconGradient from '../../assets/solanaIconGradient.png';
import usdcSolIcon from '../../assets/usdcSolIcon.png';
import { valueAtTime } from '../../helpers/growthPercentage';
import roadImage from '../../assets/roadImage1.png';
import WithdrawMenu from '../withdrawMenu';

const YieldingPositionComponent = () => {

    const principalInvested = useSelector((state: any) => state.userWalletData.principalInvested);
    const initialPrincipal = useSelector((state: any) => state.userWalletData.initialPrincipal);
    const initialInvestmentDate = useSelector((state: any) => state.userWalletData.initialInvestmentDate);
    const principalHistory = useSelector((state: any) => state.userWalletData.principalHistory);

    const currentTimeInSeconds = Date.now()/1000;

    const isSmallScreen = window.innerWidth <= 768;

    const currentValue = valueAtTime(currentTimeInSeconds, initialPrincipal, 
        initialInvestmentDate, principalHistory)

    const [upBy, setUpBy] = useState(0);

    let upByPrecision = 9;

    if (currentValue >= 10) {
        upByPrecision = 8;
    }
    if (currentValue >= 10) {
        upByPrecision = 7;
    }
    if (currentValue >= 1000) {
        upByPrecision = 6;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const currentSeconds = Date.now() / 1000;
            setUpBy(valueAtTime(currentSeconds, initialPrincipal, initialInvestmentDate, principalHistory));
        }, 100); // Updates every 100ms
    
        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);


  return (<div>

<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', justifyContent: 'space-between' }}>

    <div style={{fontSize: '25px', textAlign: 'center', width: '80%'}}>
        Congratulations on your first investment!
    </div>


    <img
      src= {roadImage}
      alt=""
      style={{
        width: '80%', // Set the desired width
        height: 'auto', // Set the desired height
        marginTop: '-50px',
        zIndex: '-1'
      }}></img>
<div style={{ flex: 1 }}></div>
<WithdrawMenu language={'en'}/>

    </div>


    </div>);
};

export default YieldingPositionComponent;