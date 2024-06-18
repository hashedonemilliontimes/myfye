import React, { useState, useEffect, useRef } from 'react';
import { initializePhantomConnection, fetchUSDCBalance, fetchSolBalance } from '../helpers/web3Manager';
import crypto from '../helpers/cryptoDataType';


import Web3 from 'web3';

const ERC20_ABI = [
  // Minimum ABI to get ERC20 Token balance
  {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},
];

export const HandleEthereumConnection = async (address: string) => {

  try {
    // Connect to Ethereum node (using Infura or similar service)
    const web3 = new Web3('https://mainnet.infura.io/v3/2a4abc011faa4ba98c16cfdef2dfe2a2');

    // Contract addresses for USDT, USDC, and BUSD
    const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
    const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48';
    const BUSD_ADDRESS = '0x4fabb145d64652a948d72533023f6e7a623c7c53';

    const usdtContract = new web3.eth.Contract(ERC20_ABI, USDT_ADDRESS);
    const usdcContract = new web3.eth.Contract(ERC20_ABI, USDC_ADDRESS);
    const busdContract = new web3.eth.Contract(ERC20_ABI, BUSD_ADDRESS);

    // Fetch balances
    const usdtBalanceMethod = (usdtContract.methods.balanceOf as any)(address);
    const usdtBalance = await usdtBalanceMethod.call();
    
    const usdcBalanceMethod = (usdcContract.methods.balanceOf as any)(address);
    const usdcBalance = await usdcBalanceMethod.call();
    
    const busdBalanceMethod = (busdContract.methods.balanceOf as any)(address);
    const busdBalance = await busdBalanceMethod.call();

    // Convert balances to string before using fromWei
    const usdtBalanceInWei = web3.utils.fromWei(usdtBalance.toString(), 'mwei');
    const usdcBalanceInWei = web3.utils.fromWei(usdcBalance.toString(), 'mwei');
    const busdBalanceInWei = web3.utils.fromWei(busdBalance.toString(), 'mwei');

    console.log('USDT Balance:', usdtBalanceInWei); // USDT has 6 decimals
    console.log('USDC Balance:', usdcBalanceInWei); // USDC has 6 decimals
    console.log('BUSD Balance:', busdBalanceInWei); // BUSD has 6 decimals

    // If you need to use Redux to manage state
    // dispatch({ type: 'SET_BALANCES', payload: { usdtBalance, usdcBalance, busdBalance } });
    return {
      usdc: usdcBalanceInWei,
      usdt: usdtBalanceInWei,
      busd: busdBalanceInWei,
    };

  } catch (err) {
    console.error('Error:', err);
  }
};
