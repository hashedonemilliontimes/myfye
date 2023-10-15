import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { requestNewTransaction } from '../../helpers/web3Manager';
import solIcon from '../../assets/solIcon.png';
import { getFirestore, collection, addDoc, setDoc, doc, getDocs, query, where, } from 'firebase/firestore';
import { saveNewDeposit } from '../../helpers/saveNewDeposit';
import { updateUSDCBalance, setPrincipalInvested, mergePrincipalInvestedHistory } from '../../redux/userWalletData';
import { useDispatch } from 'react-redux';
import LoadingAnimation from '../loadingAnimation';
import { valueAtTime } from '../../helpers/growthPercentage';
import { useNavigate } from 'react-router-dom';
import { LanguageCodeProps } from '../../helpers/languageManager';

const InvestingComponent = (props: LanguageCodeProps) => {

    const [depositButtonActive, setDepositButtonActive] = useState(false);
    const isSmallScreen = window.innerWidth <= 768;
    const [deposit, setDeposit] = useState('');
    const [depositInProgress, setDepositInProgress] = useState(false);
    const [selectedDepositPortion, setselectedDepositPortion] = useState('');
    const cryptoList = useSelector((state: any) => state.userWalletData.cryptoList);
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const principalInvested = useSelector((state: any) => state.userWalletData.principalInvested);
    const initialPrincipal = useSelector((state: any) => state.userWalletData.initialPrincipal);
    const initialInvestmentDate = useSelector((state: any) => state.userWalletData.initialInvestmentDate);
    const principalHistory = useSelector((state: any) => state.userWalletData.principalInvestedHistory);
    const [errorMessage, setErrorMessage] = useState('');
    const db = getFirestore();
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const currentTimeInSeconds = Date.now()/1000;
    const currentValue = valueAtTime(currentTimeInSeconds, initialPrincipal, 
      initialInvestmentDate, principalHistory)

    const handleDepositChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDeposit = event.target.value;
        if (newDeposit.length == 1 && (newDeposit[0] != '$')) {
          setDeposit("$ " + newDeposit);
        } else {
          setDeposit(newDeposit);
        }
        setselectedDepositPortion('');
        checkForDepositFieldComplete(newDeposit);
      };

      const checkForDepositFieldComplete = (newDeposit: string) => {
        const cleanedDeposit = newDeposit.replace(/[\s$,!#%&*()A-Za-z]/g, '');
        const depositToNumber = Number(cleanedDeposit);
      
        if (!isNaN(depositToNumber) && depositToNumber > 0 && 
        (depositToNumber <= cryptoList[0].balanceNative)) {
          setDepositButtonActive(true);
        } else {
          setDepositButtonActive(false);
        }
      };

      const handleQuarterButtonClick = () => {
        console.log("Handling quarter button click", cryptoList[0]?.balanceNative);
        if (cryptoList[0].balanceNative>0.0001) {
          const newDeposit = (0.25 * cryptoList[0]?.balanceNative);
          console.log("Setting deposit to:", newDeposit); // Added logging
        setDeposit("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
        checkForDepositFieldComplete(String(newDeposit));
        }
        setselectedDepositPortion('25%');
      };
      
      const handleHalfButtonClick = () => {
        console.log("Handling quarter button click", cryptoList[0]?.balanceNative);
        if (cryptoList[0].balanceNative>0.0001) {
          const newDeposit = (0.5 * cryptoList[0]?.balanceNative);
          console.log("Setting deposit to:", newDeposit); // Added logging
        setDeposit("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
        checkForDepositFieldComplete(String(newDeposit));
        }
        setselectedDepositPortion('50%');
      };
      
      const handleTwoThirdsButtonClick = () => {
        console.log("Handling quarter button click", cryptoList[0]?.balanceNative);
        if (cryptoList[0].balanceNative>0.0001) {
          const newDeposit = (0.75 * cryptoList[0]?.balanceNative);
          console.log("Setting deposit to:", newDeposit); // Added logging
        setDeposit("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
        checkForDepositFieldComplete(String(newDeposit));
        }
        setselectedDepositPortion('75%');
      };
      
      const handleAllButtonClick = () => {
        console.log("Handling quarter button click", cryptoList[0]?.balanceNative);
        if (cryptoList[0].balanceNative>0.0001) {
          const newDeposit = (1.0 * cryptoList[0]?.balanceNative);
          console.log("Setting deposit to:", newDeposit); // Added logging
        setDeposit("$ " + String(newDeposit.toFixed(2).toString().replace(/\.?0+$/, '')))
        checkForDepositFieldComplete(String(newDeposit));
        }
        setselectedDepositPortion('100%');
      };


      const handleDepositButtonClick = async () => {
        if (depositButtonActive) {
          const cleanedDeposit = deposit.replace(/[\s$,!#%&*()A-Za-z]/g, '');
          const depositToNumber = Number(cleanedDeposit);
          if (isNaN(depositToNumber)) {
            setErrorMessage('Invalid amount');
          } else if (depositToNumber > cryptoList[0].balanceNative) {
            setErrorMessage('Insufficient balance');
          } else if (depositToNumber < 0.9) {
            setErrorMessage('Minimum: $1');
          } else {
            setDeposit('');
            setDepositInProgress(true);
            setErrorMessage('Depositing...');
            const convertToSmallestDenomination = depositToNumber* 10 *10 *10 *10 *10 *10;
            setDepositButtonActive(false); // Deactivate button here

            const depositSuccess: boolean = await requestNewTransaction(cryptoList[0].address, convertToSmallestDenomination);
            
            if (depositSuccess) {
              console.log('deposit successful saving to DB')
              console.log('amount: ', depositToNumber)
              console.log('currentValue: ', currentValue)
              await saveNewDeposit(publicKey, depositToNumber, currentValue, dispatch);
              setDepositInProgress(false);
              setErrorMessage('');

              dispatch(updateUSDCBalance(cryptoList[0].balanceNative-depositToNumber));
              dispatch(setPrincipalInvested(principalInvested+depositToNumber));  

              if (principalHistory) {
              const timestamp = Date.now() / 1000;
              dispatch(mergePrincipalInvestedHistory({ [timestamp]: currentValue + depositToNumber }));

              // this is a rough workaround to save the change to redux and reload the page
              const currentPath = `/${props.language}/dashboard`;
              navigate("/temporary-route"); // Some non-existent route
              setTimeout(() => navigate(currentPath), 10);

              }


            } else {
              setDepositInProgress(false);
              setErrorMessage('Sorry, there was an error with your deposit. Please try again later')
            }
          } 
        }
      };

      const errorLabelText = () => {
        if (errorMessage) {
          const color = errorMessage === 'Depositing...' ? '#4CD964' : ('#FF3B30');
          return (
            <label
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
                marginTop: '15px',
                fontSize: '18px',
                color: color,
                textAlign: 'center'
              }}
            >
              {errorMessage}
            </label>
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
                  marginTop: '15px',
                  fontSize: '18px',
                }}
              >
                $
              </label>
            </div>
          );
        }
      };

      const styles = {
        tradeTimeframeButtonRow: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 10px',
          gap: '10px',
        },
        button: {
          flex: 1,
          padding: '5px',
          paddingTop: isSmallScreen ? '12px' : '5px',
          paddingBottom: isSmallScreen ? '12px' : '5px',
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
          paddingTop: isSmallScreen ? '12px' : '5px',
          paddingBottom: isSmallScreen ? '12px' : '5px',
          backgroundColor: '#333333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
        },
      };


  return (<div>

    {principalInvested >= 0.01 ? (
      <div style={{marginTop: '10px', fontSize: '25px'}}>Increase your return.</div>
    ) : (
      <div style={{marginTop: '10px', fontSize: '25px'}}>Start investing with crypto, the safe way</div>
    )}



    {depositInProgress ? (
      <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', marginTop: '30px' }}>
        <LoadingAnimation/>

      </div>
    ) : (
      <div>

<div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', marginTop: '30px' }}>

<label htmlFor="deposit" style={{ fontSize: '20px', color: '#444444', 
marginBottom: '15px', display: 'flex', alignItems: 'center', }}>
$ <span style={{ fontSize: '35px' }}>{cryptoList[0].balanceNative.toFixed(2)}</span>   USDC
<img src={solIcon} alt="Solana Logo" style={{ height: '20px', width: 'auto', 
  marginLeft: '-5px', padding: '10px 7px', borderRadius: '5px', marginRight: '3px' }} />
</label>
<input
  id="deposit"
  type="text"
  value={deposit}
  onChange={handleDepositChange}
  onInput={handleDepositChange}
  style={{
    backgroundColor: '#EEEEEE', // Slightly lighter gray
    color: '#444444',
    fontSize: '20px',
    border: 'none', // Remove the border
    borderRadius: '5px', // Rounded edges
    padding: '10px 10px', // Adjust padding as needed
  }}
  placeholder="0 USDC"
/>
</div>


<div style={styles.tradeTimeframeButtonRow} >
        <button style={selectedDepositPortion === '25%' ? styles.selectedButton : styles.button} onClick={handleQuarterButtonClick}>25%</button>
        <button style={selectedDepositPortion === '50%' ? styles.selectedButton : styles.button} onClick={handleHalfButtonClick}>50%</button>
        <button style={selectedDepositPortion === '75%' ? styles.selectedButton : styles.button} onClick={handleTwoThirdsButtonClick}>75%</button>
        <button style={selectedDepositPortion === '100%' ? styles.selectedButton : styles.button} onClick={handleAllButtonClick}>100%</button>
      </div>

      </div>
    )}


          {errorLabelText()}

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button
                style={{
                backgroundColor: depositButtonActive ? '#03A9F4' : '#D1E5F4',
                color: depositButtonActive ? 'white': '#CCCCCC',
                padding: '10px 20px',
                fontSize: '25px',
                marginTop: '40px',
                fontWeight: 'bold',
                textAlign: 'center',
                borderRadius: '10px',
                border: '1px solid transparent',
                cursor: 'pointer',
                width: isSmallScreen ? '100%' : '60%'
                }}
                onClick={handleDepositButtonClick}
            >
                Invest
            </button>
            </div>

    </div>);
};

export default InvestingComponent;