import promiseRetry from "promise-retry";
import { ComputeBudgetProgram, 
    PublicKey, Connection,
    VersionedTransaction,
    BlockhashWithExpiryBlockHeight,
    TransactionExpiredBlockheightExceededError,
    VersionedTransactionResponse, } from "@solana/web3.js";
import { setSwapWithdrawTransactionStatus,
  setSwapDepositTransactionStatus,
  setWalletSwapTransactionStatus
 } from '../redux/userWalletData.tsx'; // For managing UI

// Swapping pairs
const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const USDT_MINT_ADDRESS = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'; 
const USDY_MINT_ADDRESS = 'A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6';
const PYUSD_MINT_ADDRESS = '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo';
const EURC_MINT_ADDRESS = 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr';
const BTC_MINT_ADDRESS = 'cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij';
  
  type TransactionSenderAndConfirmationWaiterArgs = {
    connection: Connection;
    serializedTransaction: Buffer;
    blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
  };
  
  const SEND_OPTIONS = {
    skipPreflight: true,
  };

  //window.Buffer = Buffer;


  
export const swap = async (primaryWallet: any, publicKey: String, inputAmount: number, inputCurrency: String, 
    outputCurrency: String, dispatch: Function, type: String) => {
  
    console.log('running swap with data: ', publicKey, inputAmount, inputCurrency, outputCurrency)
  
    // Output mint
    let output_mint = USDY_MINT_ADDRESS;
    if (outputCurrency == 'usdcSol') {
      output_mint = USDC_MINT_ADDRESS
    } else if (outputCurrency == 'eurcSol') {
      output_mint = EURC_MINT_ADDRESS
    } else if (outputCurrency == 'btcSol') {
      output_mint = BTC_MINT_ADDRESS
    }
  
    getSwapQuote(inputAmount, inputCurrency, output_mint)
        .then(quote => {
            console.log('Got quote for swap');
            const amountInt = Math.round(quote.outAmount);
            const amountBigInt = BigInt(amountInt);
            swapTransaction(primaryWallet, quote, publicKey, dispatch, type);
        })
        .catch(error => {
          updateUI(dispatch, type, 'Fail')
          console.error('Error calling getSwapQuote retrying becuase error: ', error)
  });
  }

  async function getSwapQuote(microInputAmount: number, inputCurrencyType: String, outputMint: String = USDY_MINT_ADDRESS) {

    // Input mint
    let inputMintAddress = USDC_MINT_ADDRESS;
    if (inputCurrencyType === 'usdcSol') {
        inputMintAddress = USDC_MINT_ADDRESS;
    } else if (inputCurrencyType === 'usdtSol') {
        inputMintAddress = USDT_MINT_ADDRESS;
    } else if (inputCurrencyType === 'usdySol') {
      inputMintAddress = USDY_MINT_ADDRESS;
    } else if (inputCurrencyType === 'pyusdSol') {
      inputMintAddress = PYUSD_MINT_ADDRESS;
    } else if (inputCurrencyType === 'eurcSol') {
      inputMintAddress = EURC_MINT_ADDRESS;
    } else if (inputCurrencyType === 'btcSol') {
      inputMintAddress = BTC_MINT_ADDRESS;
    }
    console.log('getting swap quote with amount', microInputAmount, 'inputMint', inputMintAddress, 'outputMint', outputMint)
    console.log(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMint}&amount=${microInputAmount}&slippageBps=500`)
    
    try {
      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMint}&amount=${microInputAmount}&slippageBps=500`
      ).then(response => response.json());
  
      return quoteResponse;
  
    } catch (error) {
      
      console.error('Error fetching swap quote:', error);
      throw error; // rethrow the error if you want to handle it in the calling function
    }
  }

  const swapTransaction = async (primaryWallet: any, quoteData: any, receiverPubKey: String, dispatch: Function, type: String, wrapAndUnwrapSol = true) => {
            
    const swapTransactionSignature = await getJupiterSwapTransaction(primaryWallet, quoteData, receiverPubKey, dispatch, type)


};

async function getJupiterSwapTransaction(primaryWallet: any, quoteResponse: any, 
  userPublicKey: String, dispatch: Function, type: String, wrapAndUnwrapSol = true) {
  try {

    window.Buffer = Buffer;
  
    if (primaryWallet) {
      let connection: any = await (
        primaryWallet as any
      ).connector.getConnection();
  
      if (!connection) return false;

      const response = await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
                // quoteResponse from /quote api
                quoteResponse,
                // user public key to be used for the swap
                userPublicKey: userPublicKey,
                // auto wrap and unwrap SOL. default is true
                wrapAndUnwrapSol: true,
                // jup.ag frontend default max for user
                dynamicSlippage: { "maxBps": 500 },
                dynamicComputeUnitLimit: true, // allow dynamic compute limit instead of max 1,400,000
                // custom priority fee
                priorityLevelWithMaxLamports: {"priorityLevelWithMaxLamports": {"priorityLevel": "veryHigh", "maxLamports": 3000000000}},
          })
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Get recent blockhash and create a new transaction

      const swapTransactionBuf = Buffer.from(data.swapTransaction, 'base64');
      var transaction = VersionedTransaction.deserialize(new Uint8Array(swapTransactionBuf));
      console.log('transaction', transaction);

      const QUICKNODE_RPC = 'https://attentive-wispy-borough.solana-mainnet.quiknode.pro/580b0865bae2f3f5904e56150ea7b41069fd06cd/';

      // const HELIUS_RPC = 'https://mainnet.helius-rpc.com/?api-key=a4b0eee7-b375-4650-8b75-6cb352b6f3c4';
      connection = new Connection(QUICKNODE_RPC);

      const { blockhash: latestBlockHash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      transaction.message.recentBlockhash = latestBlockHash;

      let signedTransaction = await (primaryWallet as any).connector.signTransaction({ transaction: transaction });
      
      updateUI(dispatch, type, 'Signed')
      
      const signedTransactionBuffer = new Uint8Array(Buffer.from(signedTransaction));
      const signedVersionedTransaction = VersionedTransaction.deserialize(signedTransactionBuffer);
      const serializedTransaction = Buffer.from(signedVersionedTransaction.serialize());


      // Simulation
      /*
      const simulationResult = await connection.simulateTransaction(signedVersionedTransaction);

      if (simulationResult.value.err) {
          console.log("Simulation failed:", simulationResult.value.err);
      } else {
          console.log("Simulation succeeded. Logs:", simulationResult.value.logs);
      }
      */

      const sendTransactionResponse = await transactionSenderAndConfirmationWaiter({
        connection,
        serializedTransaction,
        blockhashWithExpiryBlockHeight: {
            blockhash: latestBlockHash,          // Pass the blockhash
            lastValidBlockHeight: lastValidBlockHeight // Pass the last valid block height
          }
      });
      if (sendTransactionResponse) {
        console.log(`Transaction succeeded: https://solscan.io/tx/${response}`);
        updateUI(dispatch, type, 'Success')
      } else {
        console.log('Transaction failed due to block height expiration or other issue');
        updateUI(dispatch, type, 'Fail')
      }
      
    } else {
      updateUI(dispatch, type, 'Fail')
    }
  } catch (error) {
    updateUI(dispatch, type, 'Fail')
    console.error('Error with swap transaction', error);
    return `Unable to confirm transaction txid: `  // Re-throw the error for further handling if necessary
  }
}

async function transactionSenderAndConfirmationWaiter({
  connection,
  serializedTransaction,
  blockhashWithExpiryBlockHeight,
}: TransactionSenderAndConfirmationWaiterArgs): Promise<VersionedTransactionResponse | null> {
  console.log('Preparing to send transaction...');
  const txid = await connection.sendRawTransaction(serializedTransaction, SEND_OPTIONS);

  console.log('Transaction sent, txid:', txid);

  const controller = new AbortController();
  const abortSignal = controller.signal;

  const abortableResender = async () => {
    while (!abortSignal.aborted) {
      try {
        await wait(2_000);
        await connection.sendRawTransaction(serializedTransaction, SEND_OPTIONS);
      } catch (e: any) {
        console.warn(`Resending transaction failed: ${e.message}`);
      }
    }
  };

  try {
    abortableResender();
    const lastValidBlockHeight =
      blockhashWithExpiryBlockHeight.lastValidBlockHeight - 70;

    console.log('Starting transaction confirmation...');
    await Promise.race([
      connection.confirmTransaction(
        {
          ...blockhashWithExpiryBlockHeight,
          lastValidBlockHeight,
          signature: txid,
          abortSignal,
        },
        "confirmed"
      ).catch((e) => {
        console.error('Error during confirmTransaction:', e);
        // throw e; Getting premature failures when the chain actually
        // ends up approving the transaction
      }),
      new Promise(async (resolve, reject) => {
        while (!abortSignal.aborted) {
          await wait(2_000);
          const tx = await connection.getSignatureStatus(txid, {
            searchTransactionHistory: false,
          });
          if (tx?.value?.confirmationStatus === "confirmed") {
            console.log('Transaction confirmed via polling.');
            resolve(tx);
            return;
          }
        }
        reject(new Error('Transaction polling timeout'));
      }),
    ]);
  } catch (e) {
    if (e instanceof TransactionExpiredBlockheightExceededError) {
      console.error('TransactionExpiredBlockheightExceededError:', e);
      return null;
    } else {
      console.error('Unknown error during confirmation:', e);
      throw e;
    }
  } finally {
    controller.abort();
  }

  console.log('Fetching transaction details...');
  const response = await promiseRetry(
    async (retry) => {
      const transaction = await connection.getTransaction(txid, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });
      if (!transaction) {
        console.warn('Transaction not found, retrying...');
        retry(transaction);
      }
      return transaction;
    },
    {
      retries: 7,
      minTimeout: 1_000,
    }
  );

  console.log('Transaction response:', response);
  return response;
}


function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateUI(dispatch: any, type: String, status: string): void {

  if (type == 'withdraw' ) {
    dispatch(setSwapWithdrawTransactionStatus(status)); // Update UI
  } else if (type == 'deposit') {
    dispatch(setSwapDepositTransactionStatus(status)); // Update UI
  } else {
    dispatch(setWalletSwapTransactionStatus(status)); // Update UI
  }

}