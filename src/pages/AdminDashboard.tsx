import { getSwapQuote, completeSwap } from '../JupiterFunctions/swap';
import React, { useState, useEffect } from 'react';

function AdminDashboard() {

  
    const [quoteData, setQuoteData] = useState(null);
    const [transactionData, setTransactionData] = useState('');

    const handleSignInSubmitButtonClick = async () => {

        const amountInUSD = 1
        const amountInMicroUSDC = amountInUSD * 1000000;

        getSwapQuote(amountInMicroUSDC)
        .then(quote => {
            console.log(quote);
            setQuoteData(quote); // Update state here
        })
        .catch(error => console.error(error));

        console.log('Swapping')
      };

      const swapTransaction = async () => {
        const rawTransaction = await completeSwap(quoteData, 'DR5s8mAdygzmHihziLzDBwjuux1R131ydAG2rjYhpAmn')
        setTransactionData(rawTransaction);
      };

    return (
        <div>

        <div style={{margin: '35px', color: 'white', backgroundColor: 'orange',
    width: '150px', padding: '20px', textAlign: 'center', cursor: 'pointer'}}
        onClick={handleSignInSubmitButtonClick}>
            Get Quote On USDC / USDY Swap
            
        </div>


        {quoteData && <pre>{JSON.stringify(quoteData, null, 2)}</pre>}

        <div style={{margin: '35px', color: 'white', backgroundColor: 'orange',
    width: '150px', padding: '20px', textAlign: 'center', cursor: 'pointer'}}
        onClick={swapTransaction}>
            Complete swap
        </div>

        </div>
    )
}

export default AdminDashboard;
