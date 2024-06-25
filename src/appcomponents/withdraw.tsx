import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import xIcon from '../assets/xIconGray2.png';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { valueAtTime } from '../helpers/growthPercentage';
import { useDispatch } from 'react-redux';
import backButton from '../assets/backButton3.png';
import PieChartComponent from '../components/dashboardTiles/pieChart';
import roadImage1 from '../assets/roadImage1.png'
import { saveNewWithdrawal } from '../helpers/saveNewWithdrawal';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { setusdySolValue } from '../redux/userWalletData';
import { requestNewSolanaTransaction } from '../helpers/web3Manager';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import LoadingAnimation from '../components/loadingAnimation';
import { setShowEarnWithdrawPage, setTransactionStatus, setShouldShowBottomNav } from '../redux/userWalletData';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

function Withdraw() {

  const [withdrawalInProgress, setWithdrawalInProgress] = useState(false);
  const showMenu = useSelector((state: any) => state.userWalletData.showEarnWithdrawPage)
  const db = getFirestore();
    const { primaryWallet, user } = useDynamicContext();
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
    const initialPrincipal = useSelector((state: any) => state.userWalletData.initialPrincipal);
    const initialInvestmentDate = useSelector((state: any) => state.userWalletData.initialInvestmentDate);
    const principalHistory = useSelector((state: any) => state.userWalletData.principalInvestedHistory);
    const usdyBalance = useSelector((state: any) => state.userWalletData.usdySolBalance);
    const navigate = useNavigate();
    const currentTimeInSeconds = Date.now()/1000;
    const currentPortfolioValue = valueAtTime(currentTimeInSeconds, initialPrincipal, 
      initialInvestmentDate, principalHistory)
    const walletName = useSelector((state: any) => state.userWalletData.type);
    const [shouldNotify, setShouldNotify] = useState(false);
    const transactionStatus = useSelector((state: any) => state.userWalletData.transactionStatus)
    const priceOfUSDYinUSDC = useSelector((state: any) => state.userWalletData.priceOfUSDYinUSDC);

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
        setWithdrawal(`${usdyBalance}`)
        setfeeAmount(0.1)
        setWithdrawalButtonActive(true)
        if (usdyBalance < 0.0001) {
          setWithdrawalButtonActive(false)
        }
      }, [usdyBalance]);

      useEffect(() => {
        if (showMenu) {
          setMenuPosition('0'); // Bring the menu into view
        } else {
          setMenuPosition('-110vh'); // Move the menu off-screen

          setcurrencySelected('');
        }
      }, [showMenu]);

    useEffect(() => {
        if (showMenu) {
          setMenuPosition('0'); // Bring the menu into view
        } else {
          setMenuPosition('-100vh'); // Move the menu off-screen

          setcurrencySelected('');
        }
      }, [showMenu]);
    
      useEffect(() => {

        if (transactionStatus === 'Signed') {
          setErrorMessage('Sending transaction')
          setErrorMessageColor('#60A05B')
        }

        if (transactionStatus === 'Withdrawal Success') {
          console.log('Withdrawal Success!')
          //send usdc to user
          console.log('Calling handleWithdrawal with pubKey: ', publicKey, ' usdyBalance: ', usdyBalance);
          const handleWithdrawal = httpsCallable(functions, 
            'handleWithdrawal');
            handleWithdrawal({ withdrawerPubKey: publicKey, 
              amountInUSDY: usdyBalance })
            .then((result) => {
                // Read result of the Cloud Function.
                console.log('RESULT handleWithdrawal', result);
                //update db
                const cleanedWithdrawal = withdrawal.replace(/[\s$,!#%&*()A-Za-z]/g, '');
                const withdrawalToNumber = Number(cleanedWithdrawal);
                handleWithdrawSuccess(withdrawalToNumber)
                dispatch(setusdySolValue(0.0));
            })
            .catch((error) => {
                // Getting the Error details.
                console.log('ERROR in call to handleWithdrawal');
                console.log(error);
            });
      }
      if (transactionStatus === 'Fail') {
        setErrorMessage('Transaction failed, please try again')
        setErrorMessageColor('#000000')
        setWithdrawalInProgress(false)
        setShouldNotify(false)
      }
      if (transactionStatus === 'Deposit Success') {
        setErrorMessage('')
      }
      }, [transactionStatus]);



      const handleMenuClick = () => {
        // Add your logic here for what happens when the menu is clicked
        dispatch(setShouldShowBottomNav(true))
        setreviewButtonClicked(false)
        setconfirmButtonActive(false);
        dispatch(setShowEarnWithdrawPage(false))
        dispatch(setTransactionStatus(''))
        setErrorMessage('')
      };

      const handleCashOutButtonClick = async () => {

          console.log('Withdraw usdyBalance: ', usdyBalance)
          if (usdyBalance >= 0.9) {

        const cleanedWithdrawal = withdrawal.replace(/[\s$,!#%&*()A-Za-z]/g, '');
        const withdrawalToNumber = Number(cleanedWithdrawal);
      
        const finalAmount = withdrawalToNumber - feeAmount

        setErrorMessage('Check your wallet...')
        setErrorMessageColor('#60A05B')
        setWithdrawalInProgress(true)

        if (!isNaN(withdrawalToNumber) && withdrawalToNumber >= 0.5 && 
        (withdrawalToNumber <= usdyBalance)) {

          let withdrawSuccess: boolean

          // take off a small amount because USDY changes 
          const convertToSmallestDenomination = (usdyBalance * 10 *10 *10 *10 *10 *10) - 0.000007; 

          setShouldNotify(true)
          withdrawSuccess = await requestNewSolanaTransaction(publicKey, 
            convertToSmallestDenomination, 'usdySol', primaryWallet, 0, principalHistory, dispatch, walletName);
          setShouldNotify(false)

          console.log('withdrawSuccess', withdrawSuccess)
          if (withdrawSuccess) {

            console.log('Returned withdraw success')

          } else {
            setErrorMessage('Sorry, there was an error with your transaction. Please try again later')
            setWithdrawalInProgress(false)
            setErrorMessageColor('#000000')
          }
        } else {
          setErrorMessage('Failed number test or minimum after fee test')
          setErrorMessageColor('#000000')
          console.log('withdrawalToNumber', withdrawalToNumber, 'usdySolBalance', usdyBalance)
          setWithdrawalInProgress(false)
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
          publicKey: publicKey
        });

        if (docRef) {
          // success ready to update UI

         setErrorMessage('')
         setconfirmButtonActive(false);
         setreviewButtonClicked(false)
         setWithdrawalInProgress(false)
         setWithdrawal('')
         setfeeAmount(0)
        handleMenuClick()
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
  <img style={{width: 'auto', height: '45px', background: 'white'}} src={ showMenu ? (
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
        padding: '15px',
        height: 'calc(100vh - 35px)',
        backgroundColor: 'white',
        width: '92vw',
        transition: 'top 0.5s ease', // Animate the left property
        zIndex: 4
      }}>

<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<div style={{marginTop: '10px', fontSize: '35px', color: '#222222',
}}>Withdraw</div>

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
<div style={{fontSize: '18px', color: 'black'}}>Account Value: $ {(usdyBalance*priceOfUSDYinUSDC).toFixed(4).toLocaleString()}</div>
</div>
      <div style={{marginTop: '20px', display: 'flex'}}>

        Fee: { feeAmount > 0 ? (<>
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
      <div style={{ fontSize: '36px'}}>{((usdyBalance*priceOfUSDYinUSDC)-feeAmount).toFixed(4).toLocaleString()}</div>
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
    Cash Out
</button>

</div>

    )}

</div>

</div>

                  </div> 
    )
}

export default Withdraw;