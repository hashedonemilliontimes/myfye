import { useDispatch } from 'react-redux';
import { getFirestore, collection, addDoc, setDoc, getDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import { setPrincipalInvested, setPrincipalInvestedHistory, setinitialInvestmentDate, setinitialPrincipal } from '../redux/userWalletData';

export const valueAtTime = (timeInSeconds: number, initialPrincipal: number,
    initialInvestmentDate: number, principalHistory: Record<number, number>): number => {
    
    try {
        
    const currentTimeInSeconds = Date.now()/1000;

  //hard code interest rate in decimal (4.1%)
  const annualInterestRate = 0.041;

  let principalsOverTime: Record<number, number> = {
    [initialInvestmentDate]: initialPrincipal,
    ...principalHistory
  };

  const sortedTimes = Object.keys(principalsOverTime)
  .map(Number)
  .sort((a, b) => a - b);

  if (principalHistory) {

    // Sort prices by time (ascending order)

    let timeProbe = initialInvestmentDate;
    let principal = initialPrincipal;

    for (let timeOfSave of sortedTimes) {
        if (timeOfSave <= timeInSeconds) {
            timeProbe = timeOfSave;
            principal = principalsOverTime[timeOfSave];
            break;
        }
    }
    

    const lastTime = sortedTimes[sortedTimes.length - 1];
    const lastRecordValue = principalsOverTime[lastTime];

    /*
      console.log('time probe: ', timeProbe)
      console.log('last principal save: ', principal)
      console.log('principalHistory: ', principalHistory)
*/

    // n is the number of times interest applied per time period (compounded annually)
    const n = 1;

    // Calculate time difference in years
    const t = (timeInSeconds - lastTime) / (365 * 24 * 60 * 60); 

    // Calculate compound interest
    //console.log(lastRecordValue)
    const compoundAmount = lastRecordValue * Math.pow((1 + (annualInterestRate / n)), n * t);
    
    return compoundAmount;


  } else {

        // n is the number of times interest applied per time period (compounded annually)
        const n = 1;

        // Calculate time difference in years
        const t = (timeInSeconds - initialInvestmentDate) / (365 * 24 * 60 * 60); 
    
        // Calculate compound interest
        const compoundAmount = initialPrincipal * Math.pow((1 + (annualInterestRate / n)), n * t);
        

        return compoundAmount;
  }
} catch {
    return 0;
}



};

