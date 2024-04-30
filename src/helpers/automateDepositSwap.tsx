import { getSwapQuote, completeSwap } from '../JupiterFunctions/swap';

export const swapDepositorSolanaStableCoinWithUsdy = async (depositorPubKey: string, amountInUSD: number) => {

    const amountInMicroUSDC = amountInUSD * 1000000;
    
    getSwapQuote(amountInMicroUSDC)
        .then(quote => {
            console.log(quote);

            //To Do get the fee and check if it is too high
            //if it is too high dont do it
            console.log('Swapping')

            
            swapTransaction(quote, quote.outAmount, depositorPubKey)

        })
        .catch(error => console.error(error));
    
        const swapTransaction = async (quoteData: any, microUsdyOutput: number, depositorPubKey: string) => {
            const rawTransaction = await completeSwap(quoteData, 'DR5s8mAdygzmHihziLzDBwjuux1R131ydAG2rjYhpAmn')

            if (rawTransaction.startsWith('https://solscan.io/tx/')) {

                //get the ouput of usdy and send it back to the user

                console.log('Calling sendUsdyToDepositor')
                sendUsdyToDepositor(microUsdyOutput, depositorPubKey)
            } else {
                console.log('Error: ', rawTransaction)
            }
            
        };

        const sendUsdyToDepositor = async (microUsdyOutput: number, depositorAddress: string) => {

            const transaction = await sendUsdyToDepositor(microUsdyOutput, depositorAddress)

        };
};
    






