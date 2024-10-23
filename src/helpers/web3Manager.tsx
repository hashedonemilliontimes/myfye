import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Buffer } from 'buffer';
import bs58 from 'bs58';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { setTransactionStatus, mergePrincipalInvestedHistory } from '../redux/userWalletData';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAppDispatch } from '../redux/hooks';
import { saveNewDeposit } from '../helpers/saveNewDeposit';
import { ComputeBudgetProgram, 
  PublicKey, Connection, Keypair, 
  LAMPORTS_PER_SOL, 
  sendAndConfirmTransaction, SystemProgram, 
  Transaction, TransactionInstruction,
  VersionedTransaction } from "@solana/web3.js";

  import {
    BlockhashWithExpiryBlockHeight,
    TransactionExpiredBlockheightExceededError,
    VersionedTransactionResponse,
  } from "@solana/web3.js";
  import promiseRetry from "promise-retry";

  
  type TransactionSenderAndConfirmationWaiterArgs = {
    connection: Connection;
    serializedTransaction: Buffer;
    blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
  };
  
  const SEND_OPTIONS = {
    skipPreflight: true,
  };

const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // Mainnet USDC mint address
const USDT_MINT_ADDRESS = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'; // Replace with actual USDT mint address on Solana
const USDY_MINT_ADDRESS = 'A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6';
const PYUSD_MINT_ADDRESS = '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo';
const EURC_MINT_ADDRESS = 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr';

const MYFYE_SERVER_ADDRESS = "DR5s8mAdygzmHihziLzDBwjuux1R131ydAG2rjYhpAmn"

window.Buffer = Buffer;

const PRIORITY_RATE = 50100; // MICRO_LAMPORTS 1^-15 solana  250000
const PRIORITY_FEE_IX = ComputeBudgetProgram.setComputeUnitPrice({microLamports: PRIORITY_RATE});
    
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
        // console.log(`Balance of ${address} got : ${usdcBalance} USDC `);
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

export const fetchPYUSDBalance = async (address: string): Promise<number> => {
  
  const QUICKNODE_RPC = 'https://attentive-wispy-borough.solana-mainnet.discover.quiknode.pro/580b0865bae2f3f5904e56150ea7b41069fd06cd/';
  const connection = new Connection(QUICKNODE_RPC);
  
  // The mint address for USDC on Solana's mainnet
  const pyusdMintAddress = '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo';

  try {
    const publicKey = new PublicKey(address);

    // Fetch all SPL token accounts owned by the wallet address
    const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb') // Token program 2022
    });
    for (const account of parsedTokenAccounts.value) {
     console.log(account)
    }

    for (const account of parsedTokenAccounts.value) {

      const mintAddress = account.account.data.parsed.info.mint;

      // Check if the mint address matches that of USDC
      if (mintAddress === pyusdMintAddress) {
        const pyusdBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
        // console.log(`Balance of ${address} got : ${usdcBalance} USDC `);
        return pyusdBalance;
      }
    }

    console.log(`No PYUSD balance found for ${address}.`);
    return 0;
  } catch (err) {
    console.error(`Failed to fetch balance: ${err}`);
    return 0;
  }
};

export const fetchEURCBalance = async (address: string): Promise<number> => {
  
  const QUICKNODE_RPC = 'https://attentive-wispy-borough.solana-mainnet.discover.quiknode.pro/580b0865bae2f3f5904e56150ea7b41069fd06cd/';
  const connection = new Connection(QUICKNODE_RPC);
  
  // The mint address for USDC on Solana's mainnet
  const eurcMintAddress = "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr";

  try {
    const publicKey = new PublicKey(address);

    // Fetch all SPL token accounts owned by the wallet address
    const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') // SPL Token program ID
    });

    for (const account of parsedTokenAccounts.value) {
      const mintAddress = account.account.data.parsed.info.mint;

      // Check if the mint address matches that of USDC
      if (mintAddress === eurcMintAddress) {
        const eurcBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
        // console.log(`Balance of ${address} got : ${usdcBalance} USDC `);
        return eurcBalance;
      }
    }

    console.log(`No USDC balance found for ${address}.`);
    return 0;
  } catch (err) {
    console.error(`Failed to fetch balance: ${err}`);
    return 0;
  }
};

export const fetchUSDTBalance = async (address: string): Promise<number> => {
  
  const QUICKNODE_RPC = 'https://attentive-wispy-borough.solana-mainnet.discover.quiknode.pro/580b0865bae2f3f5904e56150ea7b41069fd06cd/';
  const connection = new Connection(QUICKNODE_RPC);
  
  // The mint address for USDC on Solana's mainnet
  const usdtMintAddress = USDT_MINT_ADDRESS;

  try {
    const publicKey = new PublicKey(address);

    // Fetch all SPL token accounts owned by the wallet address
    const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') // SPL Token program ID
    });

    for (const account of parsedTokenAccounts.value) {
      const mintAddress = account.account.data.parsed.info.mint;

      // Check if the mint address matches that of USDC
      if (mintAddress === usdtMintAddress) {
        const usdtBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
        // console.log(`Balance of ${address} got : ${usdtBalance} USDT `);
        return usdtBalance;
      }
    }

    console.log(`No USDT balance found for ${address}.`);
    return 0;
  } catch (err) {
    console.error(`Failed to fetch balance: ${err}`);
    return 0;
  }
};

export const fetchUSDYBalance = async (address: string): Promise<number> => {
  
  const QUICKNODE_RPC = 'https://attentive-wispy-borough.solana-mainnet.discover.quiknode.pro/580b0865bae2f3f5904e56150ea7b41069fd06cd/';
  const connection = new Connection(QUICKNODE_RPC);
  
  // The mint address for USDC on Solana's mainnet
  const usdyMintAddress = USDY_MINT_ADDRESS;

  try {
    const publicKey = new PublicKey(address);

    // Fetch all SPL token accounts owned by the wallet address
    const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') // SPL Token program ID
    });

    for (const account of parsedTokenAccounts.value) {
      const mintAddress = account.account.data.parsed.info.mint;

      // Check if the mint address matches that of USDC
      if (mintAddress === usdyMintAddress) {
        const usdyBalance = account.account.data.parsed.info.tokenAmount.uiAmount;
        // console.log(`Balance of ${address} got : ${usdyBalance} USDY `);
        return usdyBalance;
      }
    }

    console.log(`No USDY balance found for ${address}.`);
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

    // console.log(`Balance of ${address}: ${balanceInSol} SOL`);
    return balanceInSol;
  } catch (err) {
    console.error(`Failed to fetch balance: ${err}`);
    return 0;
  }
};

export const requestNewSolanaTransaction = async (payerPubKey: string, amountSmallestDenomination: number, currencySelected: string, 
  primaryWallet: any, currentInvestedValue: number, principalHistory: Record<string, number>, dispatch: Function, 
  walletType: string = "Turnkey HD", deposit: boolean = false): Promise<boolean> => {


  try {

    if (walletType == "Turnkey HD") {
      const status = sendDynamicWeb2EmbeddedSolanaTransaction(payerPubKey, amountSmallestDenomination, 
        currencySelected, primaryWallet, currentInvestedValue, principalHistory, dispatch, deposit)
      return status;
    } else {
      // user is using a web3 wallet
      const provider = getProvider(); // see "Detecting the Provider"

      const QUICKNODE_RPC = 'https://attentive-wispy-borough.solana-mainnet.discover.quiknode.pro/580b0865bae2f3f5904e56150ea7b41069fd06cd/';
      const connection = new Connection(QUICKNODE_RPC);
      
      const blockhashInfo = await connection.getRecentBlockhash();

      const payer = new PublicKey(payerPubKey);
      const senderPublicKey = new PublicKey(payerPubKey);
      const destinationPublicKey = new PublicKey(MYFYE_SERVER_ADDRESS);

      let mintAddress: string;
      let programId: string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      if (currencySelected === 'usdcSol') {
          mintAddress = USDC_MINT_ADDRESS;
      } else if (currencySelected === 'usdtSol') {
          mintAddress = USDT_MINT_ADDRESS;
      } else if (currencySelected === 'usdySol') {
        mintAddress = USDY_MINT_ADDRESS;
      } else if (currencySelected === 'eurcSol') {
        mintAddress = EURC_MINT_ADDRESS;
      } else if (currencySelected === 'pyusdSol') {
        mintAddress = PYUSD_MINT_ADDRESS;
        programId = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
      }

 
      const payerParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
        senderPublicKey,
        { programId: new PublicKey(programId) }
      );

      //currencySelected = usdcSol or usdtSol
      const payerUsdcAccountInfo = payerParsedTokenAccounts.value.find(
        (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => accountInfo.account.data.parsed.info.mint === mintAddress
      );
      
      if (!payerUsdcAccountInfo) {
        throw new Error(currencySelected + " account not found for payer.");
      } else {
        // console.log(currencySelected + " account found for payer.");
      }

      const receiverParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
        destinationPublicKey,
        { programId: new PublicKey(programId) }
      );

      const receiverUsdcAccountInfo = receiverParsedTokenAccounts.value.find(
        (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => accountInfo.account.data.parsed.info.mint === mintAddress
      );

      if (!receiverUsdcAccountInfo) {
        throw new Error(currencySelected + " account not found for receiver.");
      } else {
        // console.log(currencySelected + " account found for receiver.");
      }

      if (!payerUsdcAccountInfo || !receiverUsdcAccountInfo) {
        throw new Error(currencySelected + " account not found for payer or receiver.");
      }

      // console.log("payerUsdcAccountInfo", JSON.stringify(payerUsdcAccountInfo, null, 2));
      // console.log("receiverUsdcAccountInfo", JSON.stringify(receiverUsdcAccountInfo, null, 2));

      const senderUsdcTokenAccount = new PublicKey(payerUsdcAccountInfo.pubkey);
      const receiverUsdcTokenAccount = new PublicKey(receiverUsdcAccountInfo.pubkey);

      const transferInstruction = Token.createTransferInstruction(
        new PublicKey(programId),
        senderUsdcTokenAccount,
        receiverUsdcTokenAccount,
        payer,
        [],
        amountSmallestDenomination
      );

      const transaction = new Transaction();
      transaction.add(transferInstruction);
      transaction.add(PRIORITY_FEE_IX);
      transaction.feePayer = payer;
      transaction.recentBlockhash = blockhashInfo.blockhash;

      console.log("Provider obtained:", provider);
      console.log('Sender address: ', payerPubKey);
      console.log('amountSmallestDenominationt: ', amountSmallestDenomination);
      console.log("Retrieved blockhash:", blockhashInfo.blockhash);

      dispatch(setTransactionStatus('Built'));

      const signedTransaction = await provider.signAndSendTransaction(transaction);
      console.log("Transaction sent:", signedTransaction);

      if (signedTransaction) {
        console.log('Handling deposit success!: signedTransaction')
        dispatch(setTransactionStatus('Signed'));

        try {
    
          // console.log("signedTransaction is", signedTransaction);
          // console.log("Type of signedTransaction is", typeof signedTransaction);
    
          let transactionType 
          if (deposit) {
            transactionType = 'Deposit'
          } else {
            transactionType = 'Withdrawal'
          }
    
          const functions = getFunctions();
          const sendSignedTransaction = httpsCallable(functions, 'confirmAndHandleTransaction');
          sendSignedTransaction({
            transactionBuffer: Buffer.from(signedTransaction.signature).toString('base64'),
            transactionType: transactionType,
            userPubKey: payerPubKey,
            amountInSmallestDenomination: amountSmallestDenomination,
            currencyType: currencySelected,
            currentInvestmentValue: currentInvestedValue,
            transactionID: signedTransaction.signature
          }).then((result) => {
            // Handle the result
            console.log(result.data); // Process the data returned from the function
            if (result.data) {
              dispatch(setTransactionStatus('Success'));
            } else {
              dispatch(setTransactionStatus('Fail'));
            }
          }).catch((error) => {
            dispatch(setTransactionStatus('Fail'));
            console.error("Error calling sendSignedTransaction:", error);
          });
          return true
        } catch (error) {
          console.error("Transaction Failed with error: ", error);
          return false;
        }

      } else {
        //Handle another case
        return false;
      }
      
      
    }
  }
    catch (error) {
      console.log("An error occurred requesting solana transaction:", error);
      return false;
    
  }
};


export const sendDynamicWeb2EmbeddedSolanaTransaction = async (payerPubKey: string, amountSmallestDenomination: number, 
  currencySelected: string, primaryWallet: any, currentInvestedValue: number, principalHistory: Record<string, number>,
   dispatch: Function, deposit: boolean = false): Promise<boolean> => {

  window.Buffer = Buffer;
  
  if (primaryWallet) {
    const connection: any = await (
      primaryWallet as any
    ).connector.getConnection();

    if (!connection) return false;

    const payer = new PublicKey(payerPubKey);
    const senderPublicKey = new PublicKey(payerPubKey);
    const destinationPublicKey = new PublicKey(MYFYE_SERVER_ADDRESS);

    let mintAddress: string;
    let programId: string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    if (currencySelected === 'usdcSol') {
        mintAddress = USDC_MINT_ADDRESS;
    } else if (currencySelected === 'usdtSol') {
        mintAddress = USDT_MINT_ADDRESS;
    } else if (currencySelected === 'usdySol') {
      mintAddress = USDY_MINT_ADDRESS;
    } else if (currencySelected === 'eurcSol') {
      mintAddress = EURC_MINT_ADDRESS;
    } else if (currencySelected === 'pyusdSol') {
      mintAddress = PYUSD_MINT_ADDRESS;
      programId = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
    }

      const payerParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
        senderPublicKey,
        { programId: new PublicKey(programId) }
      );

      //currencySelected = usdcSol or usdtSol
      const payerUsdcAccountInfo = payerParsedTokenAccounts.value.find(
        (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => accountInfo.account.data.parsed.info.mint === mintAddress
      );
      
      if (!payerUsdcAccountInfo) {
        throw new Error(currencySelected + " account not found for payer.");
      } else {
        console.log(currencySelected + " account found for payer.");
      }

      const receiverParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
        destinationPublicKey,
        { programId: new PublicKey(programId) }
      );

      const receiverUsdcAccountInfo = receiverParsedTokenAccounts.value.find(
        (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => accountInfo.account.data.parsed.info.mint === mintAddress
      );

      if (!receiverUsdcAccountInfo) {
        throw new Error(currencySelected + " account not found for receiver.");
      } else {
        console.log(currencySelected + " account found for receiver.");
      }

      if (!payerUsdcAccountInfo || !receiverUsdcAccountInfo) {
        throw new Error(currencySelected + " account not found for payer or receiver.");
      }

      // console.log("payerUsdcAccountInfo", JSON.stringify(payerUsdcAccountInfo, null, 2));
      // console.log("receiverUsdcAccountInfo", JSON.stringify(receiverUsdcAccountInfo, null, 2));

      const senderUsdcTokenAccount = new PublicKey(payerUsdcAccountInfo.pubkey);
      const receiverUsdcTokenAccount = new PublicKey(receiverUsdcAccountInfo.pubkey);

      const transferInstruction = Token.createTransferInstruction(
        new PublicKey(programId),
        senderUsdcTokenAccount,
        receiverUsdcTokenAccount,
        payer,
        [],
        amountSmallestDenomination
      );

      const blockhashInfo = await connection.getRecentBlockhash();
      const transaction = new Transaction();
      transaction.add(transferInstruction);
      transaction.add(PRIORITY_FEE_IX);
      transaction.feePayer = payer;
      transaction.recentBlockhash = blockhashInfo.blockhash;

      console.log('Sender address: ', payerPubKey);
      console.log('amountSmallestDenomination: ', amountSmallestDenomination);
      console.log("Retrieved blockhash:", blockhashInfo.blockhash);

    try {
      //Need to update the UI here 
      dispatch(setTransactionStatus('Built'));

      //let transactionID = await (primaryWallet as any).connector.signAndSendTransaction({ transaction: transaction });

      let signedTransaction = await (primaryWallet as any).connector.signTransaction({ transaction: transaction });
      const transactionBuffer = Transaction.from(Buffer.from(signedTransaction, 'base64'));
      const transactionID = await connection.sendRawTransaction(transactionBuffer.serialize());

      dispatch(setTransactionStatus('Signed'));

      console.log("signedTransaction is", signedTransaction);
      console.log("Type of signedTransaction is", typeof signedTransaction);

      let transactionType: string = ''
      if (deposit) {
        transactionType = 'Deposit'
      } else {
        transactionType = 'Withdrawal'
      }

      const functions = getFunctions();
      const sendSignedTransaction = httpsCallable(functions, 'confirmAndHandleTransaction');
      sendSignedTransaction({
        transactionBuffer: Buffer.from(signedTransaction).toString('base64'),
        transactionType: transactionType,
        userPubKey: payerPubKey,
        amountInSmallestDenomination: amountSmallestDenomination,
        currencyType: currencySelected,
        currentInvestmentValue: currentInvestedValue,
        transactionID: transactionID
      }).then((result) => {
        // Handle the result
        console.log(result.data); // Process the data returned from the function
        if (result.data) {
          dispatch(setTransactionStatus(`${transactionType} Success`));
        } else {
          dispatch(setTransactionStatus('Fail'));
        }
      }).catch((error) => {
        dispatch(setTransactionStatus('Fail'));
        console.error("Error calling sendSignedTransaction:", error);
      });
      return true
    } catch (error) {
      console.error("Transaction Failed with error: ", error);
      return false;
    }

  } else {
    console.log("Error primary wallet: ", primaryWallet);
    return false;
  }
}

const handleDepositSuccess = async (publicKey: string, amountSmallestDenomination: number, 
  currencySelected: string, currentValue: number, principalHistory: Record<string, number>, dispatch: Function) => {
    /*
    const functions = getFunctions();

    const amountInUSD = amountSmallestDenomination/ 10 /10 /10 /10 /10 /10
    const swapDepositorSolanaStableCoinWithUsdy = httpsCallable(functions, 
      'swapDepositorSolanaStableCoinWithUsdy');
      swapDepositorSolanaStableCoinWithUsdy({ depositorPubKey: publicKey, 
        amountInUSD: amountInUSD, currencyType: currencySelected })
      .then((result) => {
          // Read result of the Cloud Function.
          console.log(result);
      })
      .catch((error) => {
          // Getting the Error details.
          console.log(error);
      });

      await saveNewDeposit(publicKey, amountInUSD, currentValue, dispatch);

      
      if (principalHistory) {
        const timestamp = Date.now() / 1000;
        dispatch(mergePrincipalInvestedHistory({ [timestamp]: currentValue + amountInUSD }));

        }
    */
  }





  export const requestNewSolanaTransaction2 = async (payerPubKey: string, receiverPubKey: string, 
    amountSmallestDenomination: number, currencySelected: string, 
    primaryWallet: any, walletType: string = "Turnkey HD"): Promise<boolean> => {
    try {
  
      if (walletType == "Turnkey HD") {
        console.log("Turnkey HD running sendDynamicWeb2EmbeddedSolanaTransaction2")
        const status = sendDynamicWeb2EmbeddedSolanaTransaction2(payerPubKey, receiverPubKey, 
          amountSmallestDenomination, currencySelected, primaryWallet)
        return status;
      } else {
        console.log("Not Turnkey HD")
        const provider = getProvider(); // see "Detecting the Provider"
  
        const QUICKNODE_RPC = 'https://attentive-wispy-borough.solana-mainnet.discover.quiknode.pro/580b0865bae2f3f5904e56150ea7b41069fd06cd/';
        const connection = new Connection(QUICKNODE_RPC);
        
        const blockhashInfo = await connection.getRecentBlockhash();
  
        const payer = new PublicKey(payerPubKey);
        const senderPublicKey = new PublicKey(payerPubKey);
        const destinationPublicKey = new PublicKey(receiverPubKey);
  
        let mintAddress: string;
        let programId: string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        if (currencySelected === 'usdcSol') {
            mintAddress = USDC_MINT_ADDRESS;
        } else if (currencySelected === 'usdtSol') {
            mintAddress = USDT_MINT_ADDRESS;
        } else if (currencySelected === 'usdySol') {
          mintAddress = USDY_MINT_ADDRESS;
        } else if (currencySelected === 'eurcSol') {
          mintAddress = EURC_MINT_ADDRESS;
          programId = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        } else if (currencySelected === 'pyusdSol') {
          mintAddress = PYUSD_MINT_ADDRESS;
          programId = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        }
  
   
        const payerParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
          senderPublicKey,
          { programId: new PublicKey(programId) }
        );
  
        //currencySelected = usdcSol or usdtSol
        const payerUsdcAccountInfo = payerParsedTokenAccounts.value.find(
          (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => accountInfo.account.data.parsed.info.mint === mintAddress
        );
        
        if (!payerUsdcAccountInfo) {
          throw new Error(currencySelected + " account not found for payer.");
        } else {
          console.log(currencySelected + " account found for payer.");
        }
  
        const receiverParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
          destinationPublicKey,
          { programId: new PublicKey(programId) }
        );
  
        const receiverUsdcAccountInfo = receiverParsedTokenAccounts.value.find(
          (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => accountInfo.account.data.parsed.info.mint === mintAddress
        );
  
        if (!receiverUsdcAccountInfo) {
          throw new Error(currencySelected + " account not found for receiver.");
        } else {
          console.log(currencySelected + " account found for receiver.");
        }
  
        if (!payerUsdcAccountInfo || !receiverUsdcAccountInfo) {
          throw new Error(currencySelected + " account not found for payer or receiver.");
        }
  
        console.log("payerUsdcAccountInfo", JSON.stringify(payerUsdcAccountInfo, null, 2));
        console.log("receiverUsdcAccountInfo", JSON.stringify(receiverUsdcAccountInfo, null, 2));
  
        const senderUsdcTokenAccount = new PublicKey(payerUsdcAccountInfo.pubkey);
        const receiverUsdcTokenAccount = new PublicKey(receiverUsdcAccountInfo.pubkey);
  
        const transferInstruction = Token.createTransferInstruction(
          new PublicKey(programId),
          senderUsdcTokenAccount,
          receiverUsdcTokenAccount,
          payer,
          [],
          amountSmallestDenomination
        );
  
        const transaction = new Transaction();
        transaction.add(transferInstruction);
        transaction.add(PRIORITY_FEE_IX);
        transaction.feePayer = payer;
        transaction.recentBlockhash = blockhashInfo.blockhash;
  
        console.log("Provider obtained:", provider);
        console.log('Sender address: ', payerPubKey);
        console.log('amountSmallestDenominationt: ', amountSmallestDenomination);
        console.log("Retrieved blockhash:", blockhashInfo.blockhash);
  
        const signedTransaction = await provider.signAndSendTransaction(transaction);
        console.log("Transaction sent in requestNewSolanaTransaction2:", signedTransaction);
  
        return true;
  
        
      }
    }
      catch (error) {
        console.log("An error occurred requesting solana transaction:", error);
        return false;
      
    }
  };
  
  
  export const sendDynamicWeb2EmbeddedSolanaTransaction2 = async (payerPubKey: string, receiverPubKey: string, 
    amountSmallestDenomination: number, currencySelected: string, 
    primaryWallet: any): Promise<boolean> => {
  
    window.Buffer = Buffer;

    console.log("Running in sendDynamicWeb2EmbeddedSolanaTransaction2");
    
    if (primaryWallet) {
      const connection: any = await (
        primaryWallet as any
      ).connector.getConnection();
  
      if (!connection) return false;
  
      const blockhashInfo = await connection.getRecentBlockhash();
  
      const payer = new PublicKey(payerPubKey);
      const senderPublicKey = new PublicKey(payerPubKey);
      console.log('receiverPubKey', receiverPubKey)
      const destinationPublicKey = new PublicKey(receiverPubKey);

      let mintAddress: string;
      let programId: string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      if (currencySelected === 'usdcSol') {
          mintAddress = USDC_MINT_ADDRESS;
      } else if (currencySelected === 'usdtSol') {
          mintAddress = USDT_MINT_ADDRESS;
      } else if (currencySelected === 'usdySol') {
        mintAddress = USDY_MINT_ADDRESS;
      } else if (currencySelected === 'eurcSol') {
        mintAddress = EURC_MINT_ADDRESS;
      } else if (currencySelected === 'pyusdSol') {
        mintAddress = PYUSD_MINT_ADDRESS;
        programId = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
      }
  
      console.log('Searching with program id: ', programId)
        const payerParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
          senderPublicKey,
          { programId: new PublicKey(programId) }
        );
  
        //currencySelected = usdcSol or usdtSol
        const payerAccountInfo = payerParsedTokenAccounts.value.find(
          (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => accountInfo.account.data.parsed.info.mint === mintAddress
        );
        
        if (!payerAccountInfo) {
          throw new Error(currencySelected + " account not found for payer.");
        } else {
          console.log(currencySelected + " account found for payer.");
        }
  
        const receiverParsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
          destinationPublicKey,
          { programId: new PublicKey(programId) }
        );
  
        let receiverAccountInfo = receiverParsedTokenAccounts.value.find(
          (accountInfo: { account: { data: { parsed: { info: { mint: string } } } } }) => accountInfo.account.data.parsed.info.mint === mintAddress
        );
        

        if (!receiverAccountInfo) {
          const functions = getFunctions();
          const newTokenAccount = httpsCallable(functions, 'createNewTokenAccount');
        
          try {
            const result = await newTokenAccount({
              payerPubKey: payerPubKey,
              receiverPubKey: receiverPubKey,
              mintAddress: mintAddress!,
              programId: programId,
            });
        
            console.log("Got the new token account from fucntions! result", result);

            // Assuming the function returns the needed account info in result.data
            receiverAccountInfo = result.data;
            

          } catch (error) {
            console.error("Failed to create or fetch the token account:", error);
          }
        } else {
          console.log(currencySelected + " account found for receiver.");
        }
  
        if (!payerAccountInfo || !receiverAccountInfo) {
          throw new Error(currencySelected + " account not found for payer or receiver.");
        }
  
        // console.log("payerUsdcAccountInfo", JSON.stringify(payerUsdcAccountInfo, null, 2));
        // console.log("receiverUsdcAccountInfo", JSON.stringify(receiverUsdcAccountInfo, null, 2));
  
        const senderTokenAccount = new PublicKey(payerAccountInfo.pubkey);
        const receiverTokenAccount = new PublicKey(receiverAccountInfo.pubkey);
  
        const programIdKey = new PublicKey(programId);

        const transferInstruction = Token.createTransferInstruction(
          programIdKey,
          senderTokenAccount,
          receiverTokenAccount,
          payer,
          [],
          amountSmallestDenomination
        );

        // Create the base transaction
        const txBase = new Transaction();
        txBase.add(transferInstruction);
        txBase.feePayer = payer;
        txBase.recentBlockhash = blockhashInfo.blockhash;
        txBase.lastValidBlockHeight = blockhashInfo.lastValidBlockHeight;

        // Create the priority transaction
        const txPriority = new Transaction();
        txPriority.add(transferInstruction);
        txPriority.add(PRIORITY_FEE_IX); // Add priority fee instruction
        txPriority.feePayer = payer;
        txPriority.recentBlockhash = blockhashInfo.blockhash;
        txPriority.lastValidBlockHeight = blockhashInfo.lastValidBlockHeight;

  
        console.log('Sender address: ', payerPubKey);
        console.log('amountSmallestDenomination: ', amountSmallestDenomination);
        
  
      try {

        /*
        const signedPriorityTx = await (primaryWallet as any).connector.signTransaction({ transaction: txPriority });
        let priorityTransactionID = await (primaryWallet as any).connector.signAndSendTransaction({ transaction: signedPriorityTx });
        */

        let signedTransaction = await (primaryWallet as any).connector.signTransaction({ transaction: txPriority });
        const transactionBuffer = Transaction.from(Buffer.from(signedTransaction, 'base64'));
        const transactionID = await connection.sendRawTransaction(transactionBuffer.serialize());

        if (transactionID) {
          let transactionConfirmed = false
          for (let attempt = 1; attempt <= 3 && !transactionConfirmed; attempt++) {
            try {
              const confirmation = await connection.confirmTransaction(transactionID, 'confirmed');
              console.log('got confirmation', confirmation, 'on attempt', attempt);
              if (confirmation && confirmation.value && confirmation.value.err === null) {
                console.log(`Transaction successful: https://solscan.io/tx/${transactionID}`);
                return true;
              }
              } catch (error) {
                console.error('Error sending transaction or in post-processing:', error, 'on attempt', attempt);
              }
              if (!transactionConfirmed) {
                await delay(1000); // Delay in milliseconds
              }
            }
            console.log("Transaction Uncomfirmed");
            return false
        } else {
          console.log("Transaction Failed: transactionID: ", transactionID);
          return false;
        }
  
      } catch (error) {
        console.error("Transaction Failed with error: ", error);
        return false;
      }
  
    } else {
      console.log("Error primary wallet: ", primaryWallet);
      return false;
    }
  }


  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  





  export const swap = async (primaryWallet: any, publicKey: String, inputAmount: number, inputCurrency: String, 
    outputCurrency: String, dispatch: Function) => {
  
    console.log('running swap with data: ', publicKey, inputAmount, inputCurrency, outputCurrency)
  
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
              wrapAndUnwrapSol,
              dynamicComputeUnitLimit: true,
              prioritizationFeeLamports: 'auto',
              dynamicSlippage: { maxBps: 300 }
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
        dispatch(setTransactionStatus('Success'));
      } else {
        console.error('Transaction failed due to block height expiration or other issue');
        dispatch(setTransactionStatus('Fail'));
      }

    } else {
      dispatch(setTransactionStatus('Fail'));
    }
  } catch (error) {
    dispatch(setTransactionStatus('Fail'));
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