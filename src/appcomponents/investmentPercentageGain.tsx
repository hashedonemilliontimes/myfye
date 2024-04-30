import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { valueAtTime } from '../helpers/growthPercentage';

function InvestmentPercentageChange() {
    const initialPrincipal = useSelector((state: any) => state.userWalletData.initialPrincipal);
    const initialInvestmentDate = useSelector((state: any) => state.userWalletData.initialInvestmentDate);
    const principalInvestedHistory = useSelector((state: any) => state.userWalletData.principalInvestedHistory);

    const currentTimeInSeconds = Date.now() / 1000;
    const currentValue = valueAtTime(currentTimeInSeconds, initialPrincipal, 
        initialInvestmentDate, principalInvestedHistory);

    const [allTimeChange, setAllTimeChange] = useState(0);

    useEffect(() => {
        setAllTimeChange(currentValue - initialPrincipal);
    }, [currentValue, initialPrincipal]);

    let percentageChange = (((currentValue-(currentValue-allTimeChange))/currentValue)*100)

    if (percentageChange <= 0.00001) {
        percentageChange = 0.00001
    }

    if (currentValue > 0.9) {
return(
    <div style={{width: '220px', textAlign: 'center'}}>
    ({(percentageChange).toLocaleString(undefined, {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
    })}%)
     </div>
)
}
}

export default InvestmentPercentageChange