import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import crypto from '../../helpers/cryptoDataType';
import solanaIconGradient from '../../assets/solanaIconGradient.png';
import usdcSolIcon from '../../assets/usdcSolIcon.png';

const TransactionsComponent = () => {

  const cryptoList = useSelector((state: any) => state.userWalletData.cryptoList);
  const isSmallScreen = window.innerWidth <= 768;
  const labels = cryptoList.map((crypto: any) => crypto.type.toUpperCase());
  const dataPoints = cryptoList.map((crypto: any) => crypto.balanceUSD);

  const usdc: crypto = cryptoList[0]
  const solana: crypto = cryptoList[1]

  const initialPrincipal = useSelector((state: any) => state.userWalletData.initialPrincipal);
  const initialInvestmentDate = useSelector((state: any) => state.userWalletData.initialInvestmentDate);
  const principalInvestedHistory = useSelector((state: any) => state.userWalletData.principalInvestedHistory);

  const currentTimeInSeconds = Date.now()/1000;

  interface transaction {
    date: string,
    amount: number,
    type: string,
  };

  const [transactionsUI, setTransactionsUI] = useState<transaction[]>([]);
  let transactions: transaction[] = []
  let initialDepositAdded = false;

  const formatTimestampToDate = (timestamp: number): string => {
    const dateObject = new Date(timestamp * 1000);
    return dateObject.toISOString().split('T')[0];
  };
  
  useEffect(() => {
    let newTransactions: transaction[] = [];
    
    if (initialInvestmentDate) {
      const initialformattedDate = formatTimestampToDate(initialInvestmentDate);
  
      const firstDeposit: transaction = {
        date: initialformattedDate,
        amount: initialPrincipal,
        type: 'Deposit'
      }
  
      if (!newTransactions.some(trx => trx.date === initialformattedDate && trx.type === 'Deposit')) {
        if (newTransactions.length > 0 && newTransactions[0].date === firstDeposit.date) {
            console.log('bloc')
        } else {
            newTransactions.push(firstDeposit);
        }
    }
  
      if (principalInvestedHistory) {
        let principalsOverTime: Record<number, number> = { ...principalInvestedHistory };
        const sortedTimes = Object.keys(principalsOverTime).map(Number).sort((a, b) => a - b);
        let prevPrincipal = initialPrincipal;
  
        for (let timeOfSave of sortedTimes) {
          if (timeOfSave === initialInvestmentDate) continue; 
          
          const formattedDate = formatTimestampToDate(timeOfSave);
          const trxtype = prevPrincipal > principalsOverTime[timeOfSave] ? 'Withdrawal' : 'Deposit';
  
          const newTransaction: transaction = {
            date: formattedDate,
            amount: principalsOverTime[timeOfSave],
            type: trxtype
          }
  
          if (newTransactions.length > 0 && newTransactions[0].date === newTransaction.date) {
              console.log('bloc')
          } else {
              newTransactions.push(newTransaction);
          }
          prevPrincipal = principalsOverTime[timeOfSave];
        }
      }
  
      setTransactionsUI(newTransactions);
      console.log('transactionsUI', transactionsUI);
    } else {
      console.log('No init investment date');
      console.log('initialPrincipal', initialPrincipal);
    }
  }, []);



return (
  <div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '15px', color: '#333333', 
      fontSize: '15px', marginTop: '15px'}}>
          {
              transactionsUI.reverse().map((transactionUI, index) => (
                  <div key={index} style={{display: 'flex', justifyContent: 'space-between',
                  marginTop: '10px', borderBottom: '1px solid #CCCCCC', paddingBottom: '4px' }}>
                      <span style={{width: '55px'}}>{transactionUI.type}</span>
                      <span>{transactionUI.date}</span>
                      <span>${transactionUI.amount.toFixed(2)}</span>
                  </div>
              ))
          }
      </div>

  </div>
);
};

export default TransactionsComponent;