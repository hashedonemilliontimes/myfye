import { useDispatch } from 'react-redux';
import { Token } from '@solana/spl-token';
import { Buffer } from 'buffer';
import bs58 from 'bs58';
const { Connection, PublicKey, Transaction } = require('@solana/web3.js');

const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // Mainnet USDC mint address

const getProvider = () => {
  try {
    // Log the keys in window object to check if 'phantom' or a similar key is present
    //console.log('Keys in window object:', Object.keys(window));
      // Log the phantom object to see what it contains
     // console.log('Phantom object:', (window as any).phantom);

      const provider = (window as any).phantom?.solana;

      // Log the provider object to see what it contains
      console.log('Provider object:', provider);

      if (provider?.isPhantom) {
        console.log('Phantom provider found:', provider);
        return provider;
      } else {
        // Log this if provider object doesn't have isPhantom property
        console.log('isPhantom property not found in provider object');
      }

    console.log('Phantom provider not found. Opening Phantom website.');
    window.open('https://phantom.app/', '_blank');
  } catch (e) {
    console.error('An error occurred:', e);
  }
  return null;
};


export const initializePhantomConnection = async (): Promise<string> => {
  
  const provider = getProvider(); // see "Detecting the Provider"
  if (!provider) {
    return "";
  }

  try {
    const resp = await provider.connect();
    return resp.publicKey.toString();
  } catch (err) {
    // { code: 4001, message: 'User rejected the request.' }
    console.log('Error connecting to Phantom, ', err);
    return "";
  }
};


export const fetchUSDCBalance = async (address: string): Promise<number> => {
  const QUICKNODE_RPC = 'https://attentive-wispy-borough.solana-mainnet.discover.quiknode.pro/580b0865bae2f3f5904e56150ea7b41069fd06cd/';
  const connection = new Connection(QUICKNODE_RPC);
  
  // The mint address for USDC on Solana's mainnet
  const usdcMintAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

  try {
    const publicKey = new PublicKey(address);

    // Fetch all SPL token accounts owned by the wallet address
    const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') // SPL Token program ID
    });

    for (const account of parsedTokenAccounts.value) {
      const mintAddress = account.account.data.parsed.info.mint;

      // Check if the mint address matches that of USDC
      if (mintAddress === usdcMintAddress) {
        const usdcBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
        console.log(`Balance of ${address}: ${usdcBalance} USDC`);
        return usdcBalance;
      }
    }

    console.log(`No USDC balance found for ${address}.`);
    return 0;
  } catch (err) {
    console.error(`Failed to fetch balance: ${err}`);
    return 0;
  }
};

export const fetchSolBalance = async (address: string): Promise<number> => {
  const QUICKNODE_RPC = 'https://attentive-wispy-borough.solana-mainnet.discover.quiknode.pro/580b0865bae2f3f5904e56150ea7b41069fd06cd/';
  const connection = new Connection(QUICKNODE_RPC);

  try {
    const publicKey = new PublicKey(address);
    
    // Fetch native SOL balance
    const balanceInLamports = await connection.getBalance(publicKey);
    
    // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
    const balanceInSol = balanceInLamports / 1e9;

    console.log(`Balance of ${address}: ${balanceInSol} SOL`);
    return balanceInSol;
  } catch (err) {
    console.error(`Failed to fetch balance: ${err}`);
    return 0;
  }
};

export const requestNewTransaction = async (payerPubKey: string, amount: number): Promise<boolean> => {
  try {
    const provider = getProvider(); // see "Detecting the Provider"

    const QUICKNODE_RPC = 'https://attentive-wispy-borough.solana-mainnet.discover.quiknode.pro/580b0865bae2f3f5904e56150ea7b41069fd06cd/';
    const connection = new Connection(QUICKNODE_RPC);
    
    const blockhashInfo = await connection.getRecentBlockhash();

    const payer = new PublicKey(payerPubKey);
    const senderPublicKey = new PublicKey(payerPubKey);
    const destinationPublicKey = new PublicKey("688pzWEMqC52hiVgFviu45A24EzJ6ZfVoHiSzPSahJgh");

    const payerParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      senderPublicKey,
      { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
    );

    const payerUsdcAccountInfo = payerParsedTokenAccounts.value.find(
      (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => accountInfo.account.data.parsed.info.mint === USDC_MINT_ADDRESS
    );
    
    if (!payerUsdcAccountInfo) {
      throw new Error("USDC account not found for payer.");
    } else {
      console.log("USDC account found for payer.");
    }

    const receiverParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      destinationPublicKey,
      { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
    );

    const receiverUsdcAccountInfo = receiverParsedTokenAccounts.value.find(
      (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => accountInfo.account.data.parsed.info.mint === USDC_MINT_ADDRESS
    );

    if (!receiverUsdcAccountInfo) {
      throw new Error("USDC account not found for receiver.");
    } else {
      console.log("USDC account found for receiver.");
    }

    if (!payerUsdcAccountInfo || !receiverUsdcAccountInfo) {
      throw new Error("USDC account not found for payer or receiver.");
    }

    console.log("payerUsdcAccountInfo", JSON.stringify(payerUsdcAccountInfo, null, 2));
    console.log("receiverUsdcAccountInfo", JSON.stringify(receiverUsdcAccountInfo, null, 2));

const senderUsdcTokenAccount = new PublicKey(payerUsdcAccountInfo.pubkey);
const receiverUsdcTokenAccount = new PublicKey(receiverUsdcAccountInfo.pubkey);

    const transferInstruction = Token.createTransferInstruction(
      new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      senderUsdcTokenAccount,
      receiverUsdcTokenAccount,
      payer,
      [],
      amount
    );

    const transaction = new Transaction();
    transaction.add(transferInstruction);
    transaction.feePayer = payer;
    transaction.recentBlockhash = blockhashInfo.blockhash;

    console.log("Provider obtained:", provider);
    console.log('Sender address: ', payerPubKey);
    console.log('Amount: ', amount);
    console.log("Retrieved blockhash:", blockhashInfo.blockhash);

    const signedTransaction = await provider.signAndSendTransaction(transaction);
    console.log("Transaction sent:", signedTransaction);
    return true;
  } catch (error) {
    console.log("An error occurred:", error);
    return false;
  }
};
