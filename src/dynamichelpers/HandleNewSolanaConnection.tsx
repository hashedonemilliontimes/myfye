import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setWalletConnected, setWalletType, setCrypto, setWalletPubKey } from '../redux/userWalletData';
import { initializePhantomConnection, fetchUSDCBalance, 
  fetchSolBalance, fetchUSDTBalance, fetchUSDYBalance,
  fetchPYUSDBalance, fetchEURCBalance } from '../helpers/web3Manager';
import crypto from '../helpers/cryptoDataType';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Buffer } from 'buffer';

export const HandleSolanaConnection = async (address: string, walletType: string) => {

  window.Buffer = Buffer;
  
  const functions = getFunctions();

    try {
      
      const usdcbalanceNative: number = await fetchUSDCBalance(address);

      const usdtbalanceNative: number = await fetchUSDTBalance(address);

      const usdybalanceNative: number = await fetchUSDYBalance(address);

      const pyusdbalanceNative: number = await fetchPYUSDBalance(address);

      const eurcbalanceNative: number = await fetchEURCBalance(address);
      /*
      const solanabalanceNative: number = await fetchSolBalance(address);
      const solanabalanceUSD: number = (solanabalanceNative*18.0); // TO DO get realtime price
      */

      if (walletType == "Turnkey HD") {
        const solBalance: number = await fetchSolBalance(address);

        if (solBalance < 0.0000001) {
          //Send the user 0.00007 sol

          console.log("Microfunding user")
          const microFundingAmount = 0.00007

          const sendSolanaToUser = httpsCallable(functions, 
            'sendSolanaToUser');
            sendSolanaToUser({ receiverPubKey: address, 
              amountInSol: microFundingAmount })
            .then((result) => {
                // Read result of the Cloud Function.
                console.log(result);
            })
            .catch((error) => {
                // Getting the Error details.
                console.log(error);
            });


        }
      }

      return {
        usdc: usdcbalanceNative,
        usdt: usdtbalanceNative,
        usdy: usdybalanceNative,
        pyusd: pyusdbalanceNative,
        eurc: eurcbalanceNative
      };
        
      } catch (err) {
      console.error('Error:', err);
    }
  }