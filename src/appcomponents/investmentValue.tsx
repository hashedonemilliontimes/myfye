import React, { useState, useEffect } from 'react';
import { valueAtTime } from '../helpers/growthPercentage';
import { useSelector } from 'react-redux';

function InvestmentValue() {

    const initialPrincipal = useSelector((state: any) => state.userWalletData.initialPrincipal);
    const initialInvestmentDate = useSelector((state: any) => state.userWalletData.initialInvestmentDate);
    const principalInvestedHistory = useSelector((state: any) => state.userWalletData.principalInvestedHistory);
    const usdyBalance = useSelector((state: any) => state.userWalletData.usdySolBalance);
    const currentTimeInSeconds = Date.now()/1000;

    const currentValue = valueAtTime(currentTimeInSeconds, initialPrincipal, 
        initialInvestmentDate, principalInvestedHistory)
  
    const [upBy, setUpBy] = useState(currentValue);
    const zero = 0.0
  
    let upByPrecision = 9;
  
  
    useEffect(() => {
        console.log('Current value invested: ', currentValue);

        setUpBy(usdyBalance);
    }, [usdyBalance]);

    if (currentValue >= 10) {
        upByPrecision = 8;
    }
    if (currentValue >= 100) {
        upByPrecision = 7;
    }
    if (currentValue >= 1000) {
        upByPrecision = 6;
    }
    if (currentValue >= 10000) {
      upByPrecision = 5;
  }
  
    useEffect(() => {
      const interval = setInterval(() => {
          setUpBy(prevUpBy => prevUpBy + (10 ** -upByPrecision));
      }, 240); // Updates every 200ms
  
      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(interval);
  }, [upByPrecision]);


if (upBy < 0.9) {
    return(
<div style={{width: '90px'}}>
{zero.toFixed(2).split('.')[0].toLocaleString() + '.' + zero.toFixed(2).split('.')[1]}
</div>
    )
} else {
    return(
        <div style={{width: '220px'}}>
        {upBy.toFixed(upByPrecision).split('.')[0].toLocaleString() + '.' + upBy.toFixed(upByPrecision).split('.')[1]}
        </div>
    )
}

}

export default InvestmentValue