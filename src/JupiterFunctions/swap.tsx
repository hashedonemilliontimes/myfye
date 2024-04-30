import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js';
import fetch from 'cross-fetch';
import { Buffer } from 'buffer';
import bs58 from 'bs58';

const connection = new Connection('https://attentive-wispy-borough.solana-mainnet.discover.quiknode.pro/580b0865bae2f3f5904e56150ea7b41069fd06cd/');

const usdcMintAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const usdyMintAddress = "A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6"
const solMintAddress = "So11111111111111111111111111111111111111112"

export async function getSwapQuote(usdcAmount: number) {

    try {
      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${usdcMintAddress}\&outputMint=${usdyMintAddress}\&amount=${usdcAmount}\&slippageBps=50`
      ).then(response => response.json());
  
      console.log({ quoteResponse });

      return quoteResponse;

    } catch (error) {
      console.error('Error fetching swap quote:', error);
      throw error; // rethrow the error if you want to handle it in the calling function
    }
  }


  export async function completeSwap(quoteResponse: any, userPublicKey: string, wrapAndUnwrapSol = true) {
    try {
        const response = await fetch('https://quote-api.jup.ag/v6/swap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quoteResponse,
                userPublicKey: userPublicKey.toString(),
                wrapAndUnwrapSol,
                // Uncomment and provide a feeAccount if necessary
                // feeAccount: "fee_account_public_key"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Deserialize the transaction
        const swapTransactionBuf = Buffer.from(data.swapTransaction, 'base64');
        var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

        // Get recent blockhash
        const recentBlockhash = await connection.getRecentBlockhash();
        transaction.message.recentBlockhash = recentBlockhash.blockhash;

        // Decode the private key and create a Keypair

        console.log('process.env.PRIVATE_KEY! ', process.env.REACT_APP_PRIVATE_KEY!)

        const decodedPrivateKey = bs58.decode(process.env.REACT_APP_PRIVATE_KEY!);

        

        const payerKeypair = Keypair.fromSecretKey(decodedPrivateKey);

        // Sign the transaction
        transaction.sign([payerKeypair]);

        // Execute the transaction
        const rawTransaction = transaction.serialize()
        const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
        maxRetries: 4
        });
        await connection.confirmTransaction(txid);
        console.log(`https://solscan.io/tx/${txid}`);

        return `https://solscan.io/tx/${txid}`

    } catch (error) {
        console.error('Error fetching swap transaction:', error);
        throw error;  // Re-throw the error for further handling if necessary
    }
}

