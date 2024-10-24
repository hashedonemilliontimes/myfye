import {
    BlockhashWithExpiryBlockHeight,
    TransactionExpiredBlockheightExceededError,
    VersionedTransactionResponse,
  } from "@solana/web3.js";
import promiseRetry from "promise-retry";
import { ComputeBudgetProgram, 
    PublicKey, Connection, Keypair, 
    LAMPORTS_PER_SOL, 
    sendAndConfirmTransaction, SystemProgram, 
    Transaction, TransactionInstruction,
    VersionedTransaction } from "@solana/web3.js";
import { setTransactionStatus } from '../redux/userWalletData'; // For managing UI

// Swapping pairs
const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const USDT_MINT_ADDRESS = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'; 
const USDY_MINT_ADDRESS = 'A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6';
const PYUSD_MINT_ADDRESS = '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo';
const EURC_MINT_ADDRESS = 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr';

  
  type TransactionSenderAndConfirmationWaiterArgs = {
    connection: Connection;
    serializedTransaction: Buffer;
    blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
  };
  
  const SEND_OPTIONS = {
    skipPreflight: true,
  };

  window.Buffer = Buffer;

export const swap = async (primaryWallet: any, publicKey: String, inputAmount: number, inputCurrency: String, 
    outputCurrency: String, dispatch: Function) => {
  
    console.log('running swap with data: ', publicKey, inputAmount, inputCurrency, outputCurrency)
  
    // Output mint
    let output_mint = USDY_MINT_ADDRESS;
    if (outputCurrency == 'usdcSol') {
      output_mint = USDC_MINT_ADDRESS
    } else if (outputCurrency == 'eurcSol') {
      output_mint = EURC_MINT_ADDRESS
    }
  
    getSwapQuote(inputAmount, inputCurrency, output_mint)
        .then(quote => {
            console.log('Got quote for swap');
            const amountInt = Math.round(quote.outAmount);
            const amountBigInt = BigInt(amountInt);
            swapTransaction(primaryWallet, quote, publicKey, dispatch);
        })
        .catch(error => {
          dispatch(setTransactionStatus('Fail'));
          console.error('Error calling getSwapQuote retrying becuase error: ', error)
  });
  }

  async function getSwapQuote(microInputAmount: number, inputCurrencyType: String, outputMint: String = USDY_MINT_ADDRESS) {

    console.log('getting swap quote with amount', microInputAmount, 'inputCurrencyType', inputCurrencyType, 'outputMint', outputMint)

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
    }
    
    try {
      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMintAddress}&outputMint=${outputMint}&amount=${microInputAmount}&slippageBps=50`
      ).then(response => response.json());
  
      return quoteResponse;
  
    } catch (error) {
      
      console.error('Error fetching swap quote:', error);
      throw error; // rethrow the error if you want to handle it in the calling function
    }
  }

  const swapTransaction = async (primaryWallet: any, quoteData: any, receiverPubKey: String, dispatch: Function, wrapAndUnwrapSol = true) => {
            
    const swapTransactionSignature = await getJupiterSwapTransaction(primaryWallet, quoteData, receiverPubKey, dispatch)

    console.log('Transaction signature: ', swapTransactionSignature)

};

async function getJupiterSwapTransaction(primaryWallet: any, quoteResponse: any, userPublicKey: String, dispatch: Function, wrapAndUnwrapSol = true) {
  try {

    window.Buffer = Buffer;
  
    if (primaryWallet) {
      const connection: any = await (
        primaryWallet as any
      ).connector.getConnection();
  
      if (!connection) return false;

      const response = await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              quoteResponse,
              userPublicKey: userPublicKey.toString(),
              wrapAndUnwrapSol: true,
              dynamicSlippage: { maxBps: 2000 },
              priorityLevelWithMaxLamports: {"priorityLevelWithMaxLamports": {"priorityLevel": "high", "maxLamports": 5000000}},
              feeAccount: userPublicKey.toString(),
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

      let signedTransaction = await (primaryWallet as any).connector.signTransaction({ transaction: transaction });
      
      console.log('Signed Transaction:', signedTransaction);
      dispatch(setTransactionStatus('Signed'));

      const signedTransactionBuffer = new Uint8Array(Buffer.from(signedTransaction));
      const signedVersionedTransaction = VersionedTransaction.deserialize(signedTransactionBuffer);
      const serializedTransaction = Buffer.from(signedVersionedTransaction.serialize());

      const latestBlockHash = await connection.getLatestBlockhash();
      
      const sendTransactionResponse = await transactionSenderAndConfirmationWaiter({
        connection,
        serializedTransaction,
        blockhashWithExpiryBlockHeight: latestBlockHash, // Pass the blockhash and height here
      });
  
      if (response) {
        console.log(`Transaction succeeded: https://solscan.io/tx/${response}`);
        dispatch(setTransactionStatus('Success')); // Update UI
      } else {
        console.error('Transaction failed due to block height expiration or other issue');
        dispatch(setTransactionStatus('Fail')); // Update UI
      }

    } else {
      dispatch(setTransactionStatus('Fail')); // Update UI
    }
  } catch (error) {
    dispatch(setTransactionStatus('Fail')); // Update UI
      console.error('Error with swap transaction:', error);
      return `Unable to confirm transaction txid: `  // Re-throw the error for further handling if necessary
  }
}


async function transactionSenderAndConfirmationWaiter({
  connection,
  serializedTransaction,
  blockhashWithExpiryBlockHeight,
}: TransactionSenderAndConfirmationWaiterArgs): Promise<VersionedTransactionResponse | null> {
  const txid = await connection.sendRawTransaction(
    serializedTransaction,
    SEND_OPTIONS
  );

  const controller = new AbortController();
  const abortSignal = controller.signal;

  const abortableResender = async () => {
    while (true) {
      await wait(2_000);
      if (abortSignal.aborted) return;
      try {
        await connection.sendRawTransaction(
          serializedTransaction,
          SEND_OPTIONS,
        );
      } catch (e) {
        console.warn(`Failed to resend transaction: ${e}`);
      }
    }
  };

  try {
    abortableResender();
    const lastValidBlockHeight =
      blockhashWithExpiryBlockHeight.lastValidBlockHeight - 150;

    // this would throw TransactionExpiredBlockheightExceededError
    await Promise.race([
      connection.confirmTransaction(
        {
          ...blockhashWithExpiryBlockHeight,
          lastValidBlockHeight,
          signature: txid,
          abortSignal,
        },
        "confirmed"
      ),
      new Promise(async (resolve) => {
        // in case ws socket died
        while (!abortSignal.aborted) {
          await wait(2_000);
          const tx = await connection.getSignatureStatus(txid, {
            searchTransactionHistory: false,
          });
          if (tx?.value?.confirmationStatus === "confirmed") {
            resolve(tx);
          }
        }
      }),
    ]);
  } catch (e) {
    if (e instanceof TransactionExpiredBlockheightExceededError) {
      // we consume this error and getTransaction would return null
      return null;
    } else {
      // invalid state from web3.js
      throw e;
    }
  } finally {
    controller.abort();
  }

  // in case rpc is not synced yet, we add some retries
  const response = promiseRetry(
    async (retry) => {
      const response = await connection.getTransaction(txid, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });
      if (!response) {
        retry(response);
      }
      return response;
    },
    {
      retries: 5,
      minTimeout: 1e3,
    }
  );

  return response;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}