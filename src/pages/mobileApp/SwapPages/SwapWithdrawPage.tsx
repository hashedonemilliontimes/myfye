import React, { useState, useEffect } from 'react';
import menuIcon from '../../../assets/menuIcon.png';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import backButton from '../../../assets/backButton3.png';
import { getFunctions } from 'firebase/functions';
import { setusdySolValue, setbtcSolValue } from '../../../redux/userWalletData.tsx';
import { swap } from '../../../functions/Swaps.tsx';
import LoadingAnimation from '../../../components/LoadingAnimation.tsx';
import { setShowSwapWithdrawPage, 
    setSwapWithdrawTransactionStatus, 
    setShouldShowBottomNav } from '../../../redux/userWalletData.tsx';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

import {useSolanaWallets} from '@privy-io/react-auth/solana';

// TO DO: disabled transactions 
// import {getUserTransactionsEnabled} from '../helpers/getUserData';

function SwapWithdraw() {

  const [withdrawalInProgress, setWithdrawalInProgress] = useState(false);
  const showMenu = useSelector((state: any) => state.userWalletData.showSwapWithdrawPage)
  const db = getFirestore();
    const [feeAmount, setfeeAmount] = useState(0.1);
    const dispatch = useDispatch();
    const [currencySelected, setcurrencySelected] = useState('');
    const functions = getFunctions();
    const [menuPosition, setMenuPosition] = useState('-110vh'); 
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageColor, setErrorMessageColor] = useState('#222222');
    const [withdrawalButtonActive, setWithdrawalButtonActive] = useState(false);
    const [confirmButtonActive, setconfirmButtonActive] = useState(false);
    const [reviewButtonClicked, setreviewButtonClicked] = useState(false); 
    const [withdrawal, setWithdrawal] = useState('');
    const [selectedWithdrawalPortion, setselectedWithdrawalPortion] = useState('');
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const usdyBalance = useSelector((state: any) => state.userWalletData.usdySolBalance);
    const depositWithdrawProductType = useSelector((state: any) => state.userWalletData.depositWithdrawProductType);
    const [shouldNotify, setShouldNotify] = useState(false);
    const transactionStatus = useSelector((state: any) => state.userWalletData.swapWithdrawTransactionStatus);
    const priceOfUSDYinUSDC = useSelector((state: any) => state.userWalletData.priceOfUSDYinUSDC);
    const btcSolBalance = useSelector((state: any) => state.userWalletData.btcSolBalance);
    const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);
    const { wallets } = useSolanaWallets();

    useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (shouldNotify) {
          const message = 'Hold on! We are almost done.';
          e.returnValue = message; // Legacy method for cross browser support
          return message; // For modern browsers
        }
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, [shouldNotify]);

      //default to 100% cash out
      useEffect(() => {
        if (depositWithdrawProductType == 'Earn') {
          setWithdrawal(`${usdyBalance}`)
        } else if (depositWithdrawProductType == 'Crypto') {
          setWithdrawal(`${btcSolBalance}`)
        }
        setfeeAmount(0.1)
        if (depositWithdrawProductType == 'Earn' && usdyBalance > 0.0001) {
          setWithdrawalButtonActive(true)
        } else if (depositWithdrawProductType == 'Crypto' && btcSolBalance*106647 > 0.001) { // hardcode BTC price
          setWithdrawalButtonActive(true)
        } else {
          setWithdrawalButtonActive(false)
        }
      }, [usdyBalance, btcSolBalance, depositWithdrawProductType]);

      useEffect(() => {
        if (showMenu) {
          setMenuPosition('0'); // Bring the menu into view
          window.scrollTo(0, 0);
        } else {
          setMenuPosition('-110vh'); // Move the menu off-screen

          setcurrencySelected('');
        }
      }, [showMenu]);
    
      useEffect(() => {

        if (transactionStatus === 'Signed') {
          setErrorMessageColor('#60A05B')
          setErrorMessage('Swapping, Please Wait')
          if (selectedLanguageCode == 'es') {
            setErrorMessage('Intercambio, por favor espera');
          } else {
            setErrorMessage('Swapping, Please Wait')
          }
          setErrorMessageColor('#60A05B')
        }

        if (transactionStatus === 'Success') {

          setErrorMessageColor('#60A05B')
          if (selectedLanguageCode == 'es') {
            setErrorMessage('Exito!');
          } else {
            setErrorMessage('Success!')
          }
          
          console.log('Calling handleWithdrawal with pubKey: ', publicKey, ' usdyBalance: ', usdyBalance);
          const cleanedWithdrawal = withdrawal.replace(/[\s$,!#%&*()A-Za-z]/g, '');
          const withdrawalToNumber = Number(cleanedWithdrawal);
          handleWithdrawSuccess(withdrawalToNumber)

          if (depositWithdrawProductType == 'Earn') {
            dispatch(setusdySolValue(0.0));
          } else if (depositWithdrawProductType == 'Crypto') {
            dispatch(setbtcSolValue(0.0));
          }
          

          setTimeout(() => {
            setErrorMessage('')
            setconfirmButtonActive(false);
            setreviewButtonClicked(false)
            setWithdrawalInProgress(false)
            setWithdrawal('')
            setfeeAmount(0)
            handleMenuClick()
          }, 4000);
      }
      if (transactionStatus === 'Fail') {

        if (selectedLanguageCode == 'es') {
          setErrorMessage('La transacción falló, por favor inténtalo de nuevo.');
        } else {
          setErrorMessage('Swap Failed, Please Try Again')
        }
        setErrorMessageColor('#000000')
        setWithdrawalInProgress(false)
        setShouldNotify(false)
      }
      }, [transactionStatus]);

      const handleMenuClick = () => {
        // Add your logic here for what happens when the menu is clicked
        dispatch(setShouldShowBottomNav(true))
        setreviewButtonClicked(false)
        setconfirmButtonActive(false);
        dispatch(setShowSwapWithdrawPage(false))
        dispatch(setSwapWithdrawTransactionStatus(''))
        setErrorMessage('')
      };

      const handleCashOutButtonClick = async () => {

          console.log('Withdraw usdyBalance: ', usdyBalance)
          if ((depositWithdrawProductType == 'Earn' && usdyBalance >= 0.9) || 
          (depositWithdrawProductType == 'Crypto' && btcSolBalance >= 0.000008)) { // Hardcoded value of bitcoin
            // TO DO: user transactions enabled
            // const isTransactionsEnabled = await getUserTransactionsEnabled(user!.userId!);
            const isTransactionsEnabled = true
            if (isTransactionsEnabled) {
            setErrorMessageColor('#222222');
            if (selectedLanguageCode == 'es') {
              setErrorMessage('Transacciones deshabilitadas, comuníquese con el soporte de Myfye');
            } else {
              setErrorMessage('Transactions disabled, please contact Myfye support')
            }
          
        const cleanedWithdrawal = withdrawal.replace(/[\s$,!#%&*()A-Za-z]/g, '');
        const withdrawalToNumber = Number(cleanedWithdrawal);
      
        const finalAmount = withdrawalToNumber - feeAmount

        setErrorMessage('Check your wallet...')
        setErrorMessageColor('#60A05B')
        setWithdrawalInProgress(true)

        if (!isNaN(withdrawalToNumber)) {
          
          if (depositWithdrawProductType == 'Earn' && withdrawalToNumber < 0.5) {
            console.log('funds', withdrawalToNumber)
            setErrorMessage('Insufficient Funds')
            setErrorMessageColor('#000000')
            console.log('withdrawalToNumber', withdrawalToNumber, 'usdySolBalance', usdyBalance)
            setWithdrawalInProgress(false)
          
          } else {
          
          
          // take off a small amount because USDY changes 
          let convertToSmallestDenomination = 0;
          if (depositWithdrawProductType == 'Earn') {
            convertToSmallestDenomination =  Math.round(usdyBalance * 1e6);
          } else if (depositWithdrawProductType == 'Crypto') {
            convertToSmallestDenomination =  Math.round(btcSolBalance * 1e8);
          }

          setShouldNotify(true)
          

          const inputAmount: number = convertToSmallestDenomination;
          let inputCurrency: String = '';
          if (depositWithdrawProductType == 'Earn') {
            inputCurrency = 'usdySol'
          } else if (depositWithdrawProductType == 'Crypto') {
            inputCurrency = 'btcSol'
          }
          const outputCurrency: String = 'usdcSol';

          const wallet = wallets[0];
          const signWithdrawalSuccess = await swap(wallet, publicKey, inputAmount, inputCurrency!, outputCurrency!, dispatch, 'deposit');

          setShouldNotify(false)
        }
        } else {
          setErrorMessage('Insufficient Funds')
          setErrorMessageColor('#000000')
          console.log('withdrawalToNumber', withdrawalToNumber, 'usdySolBalance', usdyBalance)
          setWithdrawalInProgress(false)
        }
      } else {
        if (selectedLanguageCode == 'es') {
          setErrorMessage('Transacciones deshabilitadas, comuníquese con el soporte de Myfye');
        } else {
          setErrorMessage('Transactions disabled, please contact Myfye support')
        }
      } 
      } else {
        setErrorMessage('Sorry, the minimum withdrawal is $1')
        setWithdrawalInProgress(false)
      }
      
      };

      const handleWithdrawSuccess = async (withdrawalToNumber: number) => {

        const transactionsCollectionRef = collection(db, 'earnTransactions');

        const docRef = await addDoc(transactionsCollectionRef, {
          type: 'withdrawal',
          time: new Date().toISOString(),
          amount: withdrawalToNumber,
          currencySelected: 'usdySol',
          publicKey: publicKey,
        });

        if (docRef) {
          // success ready to update UI
         // To Do nice animation for withdraw complete
         
        }
      }

      const errorLabelText = () => {
        if (errorMessage) {
          const color = errorMessageColor;
          return (
            <div>
            <div style={{display:'flex', alignItems: 'center', justifyContent: 'center'}}>
            <label
              style={{
                width: '80vw',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
                fontSize: '18px',
                color: color,
                textAlign: 'center',
              }}
            >
              
              {errorMessage}
            </label>
            </div>

            </div>

          );
        } else {
          return (
            <div style={{ visibility: 'hidden' }}>
              <label
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '0 auto',
                  marginTop: '10px',
                  fontSize: '18px',
                }}
              >
                $
              </label>
            </div>

          );
        }
      };


    return (
        <div style={{ backgroundColor: 'white', overflowX: 'hidden' }}>

{ showMenu && (
<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      padding: '15px',
      cursor: 'pointer',
      zIndex: 20     // Add some padding for spacing from the edges
    }}>

{!withdrawalInProgress ? (<>
  <img style={{width: 'auto', height: '35px', background: 'white'}} src={ showMenu ? (
                currencySelected ? backButton : backButton) : menuIcon }
            onClick={handleMenuClick} alt="Exit" />
</>) : (<>

  <div style={{ width: '45px', height: '45px', backgroundColor: 'white', border: 'none' }}></div>
  </>)}

            </div>)}

       <div style={{
        position: 'absolute',
        top: menuPosition,
        left: 0, // Use state variable for position
        paddingTop: '15px',
        height: '100vh',
        backgroundColor: 'white',
        width: '100vw',
        transition: 'top 0.5s ease', // Animate the left property
        zIndex: 4
      }}>
<div style={{padding: '15px'}}>
<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<div style={{marginTop: '10px', fontSize: '35px', color: '#222222',
}}>
    {selectedLanguageCode === 'en' && `Withdraw`}
    {selectedLanguageCode === 'es' && `Retirar`}
</div>

</div>

<div style={{display:'flex', justifyContent: 'space-between', flexDirection: 'column', height: '80vh'}}>
  <div>
{withdrawalInProgress ? (
  <>
        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
        <LoadingAnimation/>

      </div>
  </>
) : (
<div>
<div style={{display: 'flex', flexDirection: 'row', marginTop: '90px',
alignItems: 'center'}}> 
<div style={{fontSize: '18px', color: 'black'}}>
{selectedLanguageCode === 'en' && `Account Value: `}
{selectedLanguageCode === 'es' && `Valor de la cuenta: `}



{ depositWithdrawProductType === 'Crypto' && (
        <span>
$ {(btcSolBalance * 95000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </span>
      )}

      { depositWithdrawProductType === 'Earn' && (
        <span>
$ {(usdyBalance*priceOfUSDYinUSDC).toFixed(4).toLocaleString()}
        </span>
      )}

</div>
</div>
      
<div style={{marginTop: '20px', display: 'flex'}}>

{selectedLanguageCode === 'en' && `Fee: `}
{selectedLanguageCode === 'es' && `Tarifa: `}
{feeAmount > 0 ? (<>
          $ {(feeAmount.toFixed(6).split('.')[0].toLocaleString() + '.' + feeAmount.toFixed(6).split('.')[1]).replace(/\.?0+$/, '')}
          </>) : (<></>)}
      </div>
      </div>

)}



      
      {!withdrawalInProgress ? (
<div>
  { usdyBalance > 0.9 && (
      <div style={{display: 'flex', flexDirection: 'row', marginTop: '90px',
      alignItems: 'center', justifyContent:'center'}}> 
      <div style={{marginLeft: '20px'}}>$ </div>


      { depositWithdrawProductType === 'Crypto' && (
        <span>
<div style={{ fontSize: '36px'}}>{((btcSolBalance * 95000)-feeAmount).toFixed(4).toLocaleString()}</div>
        </span>
      )}

      { depositWithdrawProductType === 'Earn' && (
        <span>
      <div style={{ fontSize: '36px'}}>{((usdyBalance*priceOfUSDYinUSDC)-feeAmount).toFixed(4).toLocaleString()}</div>
        </span>
      )}


      </div>
      )}
      </div>
      ) : (<div style={{}}></div>)}




    {errorLabelText()}
    </div>

    {withdrawalInProgress ? (


  <div>


  </div>
    ) : (

      <div style={{display: 'flex', flexDirection: 'row', justifyContent:'center'}}>


      <button
    style={{
    backgroundColor: withdrawalButtonActive ? '#03A9F4' : '#D1E5F4',
    color: withdrawalButtonActive ? 'white': '#CCCCCC',
    padding: '10px 20px',
    fontSize: '25px',
    marginTop: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: '10px',
    border: '1px solid transparent',
    cursor: 'pointer',
    width: '80vw',
    }}
    onClick={handleCashOutButtonClick}
>
{selectedLanguageCode === 'en' && `Cash Out`}
{selectedLanguageCode === 'es' && `Retiro De Efectivo`}
</button>

</div>

    )}

</div>
</div>
</div>

                  </div> 
    )
}

export default SwapWithdraw;