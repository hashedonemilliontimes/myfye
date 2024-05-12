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

function Withdraw() {

  const [withdrawalInProgress, setWithdrawalInProgress] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const { primaryWallet, user } = useDynamicContext();
    const [feeAmount, setfeeAmount] = useState(0.1);
    const dispatch = useDispatch();
    const [currencySelected, setcurrencySelected] = useState('');
    const functions = getFunctions();
    const [menuPosition, setMenuPosition] = useState('-110vh'); 
    const [errorMessage, setErrorMessage] = useState('');
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
    
      const handleMenuClick = () => {
        // Add your logic here for what happens when the menu is clicked
        setreviewButtonClicked(false)
        setconfirmButtonActive(false);
        setShowMenu(!showMenu);
        
      };

      const handleWithdrawalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newWithdrawal = event.target.value;
        if (newWithdrawal.length == 1 && (newWithdrawal[0] != '$')) {
          setWithdrawal("$ " + newWithdrawal);
        } else {
          setWithdrawal(newWithdrawal);
        }
        setselectedWithdrawalPortion('');
        checkForWithdrawalFieldComplete(newWithdrawal);
      };

      const checkForWithdrawalFieldComplete = (newWithdrawal: string) => {
        const cleanedWithdrawal = newWithdrawal.replace(/[\s$,!#%&*()A-Za-z]/g, '');
        const withdrawalToNumber = Number(cleanedWithdrawal);
      
        if (!isNaN(withdrawalToNumber) && withdrawalToNumber >= 1.0 && 
        (withdrawalToNumber <= currentPortfolioValue)) {
          setErrorMessage('')
          setWithdrawalInProgress(false)
          setWithdrawalButtonActive(true);
          setfeeAmount(Number(withdrawalToNumber)*0.01)

        } else {
          setErrorMessage('Minimum withdrawal: $1')
          setWithdrawalInProgress(false)
          setfeeAmount(0)
          setWithdrawalButtonActive(false);
        }
      };
      
      const handleAllButtonClick = () => {
        
        if (currentPortfolioValue>0.0001) {
          const newWithdrawal = (1.0 * currentPortfolioValue);
          console.log("Setting Withdrawal to:", newWithdrawal); // Added logging
        setWithdrawal("$ " + String(newWithdrawal.toFixed(6).toString().replace(/\.?0+$/, '')))
        checkForWithdrawalFieldComplete(String(newWithdrawal));
        }
        setselectedWithdrawalPortion('100%');
      };

      const styles = {
        tradeTimeframeButtonRow: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 10px',
          gap: '10px',
          width: '80vw'
        },
        button: {
          flex: 1,
          padding: '5px',
          paddingTop: '12px',
          paddingBottom: '12px',
          backgroundColor: 'white',
          color: '#333333',
          border: '1px solid #333333',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
        },
        selectedButton: {
          flex: 1,
          padding: '5px',
          paddingTop: '12px',
          paddingBottom: '12px',
          backgroundColor: '#333333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
        },
      };

      const handleReviewButtonClick = async () => {
        setErrorMessage('')
        setWithdrawalInProgress(false)
        setreviewButtonClicked(true)
        setTimeout(() => {
          setconfirmButtonActive(true);
        }, 2000);
      };
      
      const handleCashOutButtonClick = async () => {

          console.log('usdyBalance: ', usdyBalance)
          if (usdyBalance >= 0.9) {

        const cleanedWithdrawal = withdrawal.replace(/[\s$,!#%&*()A-Za-z]/g, '');
        const withdrawalToNumber = Number(cleanedWithdrawal);
      
        const finalAmount = withdrawalToNumber - feeAmount

        setErrorMessage('Check your wallet...')
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

          if (withdrawSuccess) {

            //update redux
            setTimeout(() => {
              dispatch(setusdySolValue(0.0));
            }, 1000);

            //send usdc to user
            console.log('Calling handleWithdrawal with pubKey: ', publicKey, ' usdyBalance: ', usdyBalance);
            const handleWithdrawal = httpsCallable(functions, 
              'handleWithdrawal');
              handleWithdrawal({ withdrawerPubKey: publicKey, 
                amountInUSDY: usdyBalance })
              .then((result) => {
                  // Read result of the Cloud Function.
                  console.log('RESULT handleWithdrawal', result);
              })
              .catch((error) => {
                  // Getting the Error details.
                  console.log('ERROR in call to handleWithdrawal');
                  console.log(error);
              });

            //update db
            handleWithdrawSuccess(withdrawalToNumber)
          } else {
            setErrorMessage('Sorry, there was an error with your transaction. Please try again later')
            setWithdrawalInProgress(false)
          }
        } else {
          setErrorMessage('Failed number test or minimum after fee test')
          console.log('withdrawalToNumber', withdrawalToNumber, 'usdySolBalance', usdyBalance)
          setWithdrawalInProgress(false)
        }
      } else {
        setErrorMessage('Sorry, the minimum withdrawal is $1')
        setWithdrawalInProgress(false)
      }
      
      };

      const handleWithdrawSuccess = async (withdrawalToNumber: number) => {
        const withdrawSavedToDB: boolean = await saveNewWithdrawal(publicKey, withdrawalToNumber, currentPortfolioValue, true);

        if (withdrawSavedToDB) {
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
          const color = errorMessage === 'Check your wallet...' ? '#60A05B' : ('#FF3B30');
          return (

            

            <div>

            {withdrawalInProgress && ( 
            <div style={{display: 'flex', justifyContent: 'center',marginTop: '50px' }}>
            <div style={{display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '50px',
                          height: '50px',
                          border: '3px solid #60A05B',
                          borderRadius: '50%', // This makes the shape a circle
                          color: '#222222',
                          fontSize: '40px',
                          fontWeight: 'bold',
                          marginTop: '-40px'}}>
            1
            </div>
            </div>
            )}



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

            <img style={{width: 'auto', height: '45px', background: 'white'}} src={ showMenu ? (
                currencySelected ? backButton : backButton) : menuIcon }
            onClick={handleMenuClick} alt="Exit" />
            </div>)}


            <div style={{
           color: 'white', 
           background: '#60A05B', // red '#FF6961', 
           borderRadius: '10px', 
           border: 'none', 
           fontWeight: 'bold',
           height: '40px', 
           display: 'flex',        // Makes this div also a flex container
           justifyContent: 'center', // Centers the text horizontally inside the button
           alignItems: 'center',// Centers the text vertically inside the button
           cursor: 'pointer',
           fontSize: '20px',
           width: '135px',
       }} onClick={handleMenuClick}>
           Withdraw
       </div>

       <div style={{
        position: 'absolute',
        top: menuPosition,
        left: 0, // Use state variable for position
        padding: '15px',
        height: '90vh',
        backgroundColor: 'white',
        width: '92vw',
        transition: 'top 0.5s ease', // Animate the left property
        zIndex: 4
      }}>

<div style={{display:'flex', justifyContent: 'space-between', flexDirection: 'column', height: '80vh'}}>
  <div>
<div style={{marginTop: '70px', fontSize: '45px', color: '#222222'}}>Withdraw</div>


{withdrawalInProgress ? (
  <>
        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', marginTop: '30px' }}>
        <LoadingAnimation/>

      </div>
  </>
) : (
<div>
<div style={{display: 'flex', flexDirection: 'row', marginTop: '90px',
alignItems: 'center'}}> 
<div style={{fontSize: '18px', color: 'black'}}>Account Value: $ {usdyBalance.toFixed(6).split('.')[0].toLocaleString() + '.' + usdyBalance.toFixed(6).split('.')[1]}</div>
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
      <div style={{ fontSize: '36px'}}>{(usdyBalance-feeAmount).toFixed(6).split('.')[0].toLocaleString() + '.' + (usdyBalance-feeAmount).toFixed(6).split('.')[1]}</div>
      </div>
      )}
      </div>
      ) : (<div style={{}}></div>)}




    {errorLabelText()}
    </div>

    {withdrawalInProgress ? (


  <div>

<div style={{display: 'flex', justifyContent: 'center', 
  marginTop: '-140px' }}>
<div style={{display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '50px',
  height: '50px',
  border: '3px solid #60A05B',
  borderRadius: '50%', // This makes the shape a circle
  color: '#222222',
  fontSize: '40px',
  fontWeight: 'bold',}}>
2
</div>
</div>


  
  <div style={{textAlign: 'center', color: '#60A05B', fontSize: '18px', 
  marginTop: '20px'}}>
    Please wait while we validate the transaction
  </div>
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