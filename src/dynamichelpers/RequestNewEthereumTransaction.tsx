import Web3 from 'web3';


// Extended ERC-20 ABI
const transferABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "type": "function"
  },  
  // Add the decimals function
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "type": "function"
  }
];



interface TokenAddresses {
    [key: string]: string; 
  };

  const tokenAddresses: TokenAddresses = {
    'usdcEth': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Replace with actual contract address
    'usdtEth': '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Replace with actual contract address
    'busdEth': '0x4fabb145d64652a948d72533023f6e7a623c7c53'  // Replace with actual contract address
  };
  

export const RequestNewEthereumTransaction = async (fromAddress: string, 
  amountInUSD: number, currencyType: string, walletName: string): Promise<boolean> => {


  console.log('got wallet name: ', walletName)
  console.log('window.ethereum: ',  window.ethereum)

  const toAddress = '0x7b2066e3f81e5C319F3A183f62299AB1Cc88f8bF' 
  // kraken account 0x615eca2d86d6b2dedc4b05e589e8fdea48a68040
  // dynamic gavinmilligan1997@gmail.com 0x7b2066e3f81e5C319F3A183f62299AB1Cc88f8bF

  let provider;

  // Connect to the wallet based on the walletName
  switch (walletName) {
    case 'MetaMask':
      if (!window.ethereum) {
        console.log('MetaMask is not installed!');
        return false;
      }
      provider = window.ethereum;
      break;
    case 'WalletConnect':
      // Example for WalletConnect (you'll need to configure this)

      /*
      provider = new WalletConnectProvider({
        infuraId: "your_infura_id" // Replace with your Infura ID
      });
      */

      break;
    // Add other wallets here
    default:
      console.error('Unsupported wallet: ', walletName);
      return false;
  }

  try {
    await provider?.request({ method: 'eth_requestAccounts' });

    const web3 = new Web3(provider);

    // Contract address for the selected currency
    const contractAddress: string = tokenAddresses[currencyType];

    if (!contractAddress) {
      console.error('Invalid currency type');
      return false;
    }

    // Create contract instance
    const contract = new web3.eth.Contract(transferABI, contractAddress);

    // Convert amount to the token's smallest unit (like Wei for ETH)
    const decimals: number = await contract.methods.decimals().call();
    // Convert decimals to a Number, if it's safe to do so
    const decimalsNumber = Number(decimals);

    // Then perform the calculation
    const amountInTokens = (amountInUSD * Math.pow(10, decimalsNumber)).toString();


    console.log('currencyType: ', currencyType)
    console.log('amountInToken: ', amountInTokens)

    // Set up transaction parameters
    const transferMethod = (contract as any).methods.transfer(toAddress, amountInTokens);

    const gasPrice = await web3.eth.getGasPrice(); // This is in wei
    console.log('gasPrice (wei): ', gasPrice);

    let gasLimit;
    let gasFee;

    const hardcodedGasLimit = 220; // Standard gas limit for simple transfers
    const hardcodedGasPrice = web3.utils.toWei('10', 'gwei'); // Example gas price

    /*
    // Calculate gas fee outside of try-catch
    try {
      const gasPrice = await web3.eth.getGasPrice(); // This is in wei
      const gasLimit1 = await transferMethod.estimateGas({ from: fromAddress });
      const totalGasFeeInWei = BigInt(gasPrice) * BigInt(gasLimit1);
      gasFee = totalGasFeeInWei / BigInt(1e18); // Convert wei to ETH
      gasLimit = gasLimit1
      console.log('Total Gas Fee (ETH):', gasFee.toString());
    } catch (error) {
      console.error("Error in gas estimation:", error);
      if (gasFee) {
        alert(`An error occurred. You need more ETH in your wallet to pay for the fee.`);
      } else {
        alert(`An error occurred. You need more ETH in your wallet to pay for the fee.`);
      }
      return false;
    }
    */

    const transactionParameters = {
      from: fromAddress,
      to: contractAddress, 
      data: transferMethod.encodeABI(),
      gasPrice: hardcodedGasPrice, // 10 Gwei converted to Wei
      gas: hardcodedGasLimit  // Hardcoded gas limit
    };

    // Send the transaction
    let txHash;

    console.log('transactionParameters', transactionParameters)

    console.log('window.ethereum?', window.ethereum)

    txHash = await window.ethereum!.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

    console.log('Transaction Hash:', txHash);

    return true;

  } catch (error) {
    console.error(error);
    return false;
  }
}

