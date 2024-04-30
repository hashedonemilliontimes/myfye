import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setLanguage } from '../helpers/languageManager';
import { LanguageCodeProps } from '../helpers/languageManager';
import xIconGray from '../assets/xIconGray.png';
import solIcon from '../assets/solIcon.png';
import { useSelector } from 'react-redux';
import { valueAtTime } from '../helpers/growthPercentage';
import checkMarkImage from '../assets/checkmarkImage.png';
import { saveNewWithdrawal } from '../helpers/saveNewWithdrawal';
import { useDispatch } from 'react-redux';
import { updateUSDCBalance, setPrincipalInvested, mergePrincipalInvestedHistory } from '../redux/userWalletData';
import xIconGray2 from '../assets/xIconGray2.png';

export default function WithdrawMenu(props: LanguageCodeProps) {

    const dispatch = useDispatch();
    const isSmallScreen = window.innerWidth <= 768;
    const [withdrawButtonHovered, setwithdrawButtonHovered] = useState(false);
    const [imSureButtonHovered, setimSureButtonHovered] = useState(false);
    const [imSureButtonClicked, setimSureButtonClicked] = useState(false);
    const [withdrawal, setWithdrawal] = useState('');
    const [withdrawalUI, setWithdrawalUI] = useState('');
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const initialPrincipal = useSelector((state: any) => state.userWalletData.initialPrincipal);
    const initialInvestmentDate = useSelector((state: any) => state.userWalletData.initialInvestmentDate);
    const principalInvestedHistory = useSelector((state: any) => state.userWalletData.principalInvestedHistory);
    const [selectedWithdrawalPortion, setselectedWithdrawalPortion] = useState('');
    const [finalWithdrawalButtonActive, setfinalWithdrawalButtonActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [withdrawalComplete, setwithdrawalComplete] = useState(false);

    const currentTimeInSeconds = Date.now()/1000;


    const currentValue = valueAtTime(currentTimeInSeconds, initialPrincipal, 
        initialInvestmentDate, principalInvestedHistory)

    const navigate = useNavigate();

    const [withdrawMenuVisible, setWithdrawMenuVisible] = useState(false);
    

    const toggleWithdrawMenu = () => {
      if (withdrawMenuVisible) {
        document.body.style.overflow = 'auto';
      } else {
        document.body.style.overflow = 'hidden';
      }
      setimSureButtonClicked(false);
      setimSureButtonHovered(false);

      if (withdrawalComplete) {
              // this is a rough workaround to save the change to redux and reload the page
              const currentPath = `/${props.language}/dashboard`;
              navigate("/temporary-route"); // Some non-existent route
              setTimeout(() => navigate(currentPath), 10);          
      }
      setwithdrawalComplete(false);
      setWithdrawMenuVisible(!withdrawMenuVisible);
      setWithdrawal('');
      setErrorMessage('');
      setselectedWithdrawalPortion('');
      setfinalWithdrawalButtonActive(false);



    };

    const handleWithdrawalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newWithdrawal = event.target.value;
      if (newWithdrawal.length == 1 && (newWithdrawal[0] != '$')) {
        setWithdrawal("$ " + newWithdrawal);
      } else {
        setWithdrawal(newWithdrawal);
      }
      setselectedWithdrawalPortion('');
      setErrorMessage('');
      checkForWithdrawalFieldComplete(newWithdrawal);
    };

    const checkForWithdrawalFieldComplete = (newWithdrawal: string) => {
      const cleanedWithdrawal = newWithdrawal.replace(/[\s$,!#%&*()A-Za-z]/g, '');
      const withdrawalToNumber = Number(cleanedWithdrawal);
    
      if (!isNaN(withdrawalToNumber) && withdrawalToNumber > 0 && 
      (withdrawalToNumber <= currentValue)) {
        setfinalWithdrawalButtonActive(true);
      } else {
        setfinalWithdrawalButtonActive(false);
      }
    };

    const handleQuarterButtonClick = () => {
      console.log("Handling quarter button click", currentValue);
      if (currentValue>0.0001) {
        const newWithdrawal = (0.25 * currentValue);
        console.log("Setting Withdrawal to:", newWithdrawal); // Added logging
      setWithdrawal("$ " + String(newWithdrawal.toFixed(2).toString().replace(/\.?0+$/, '')))
      checkForWithdrawalFieldComplete(String(newWithdrawal));
      }
      setselectedWithdrawalPortion('25%');
    };
    
    const handleHalfButtonClick = () => {
      console.log("Handling quarter button click", currentValue);
      if (currentValue>0.0001) {
        const newWithdrawal = (0.5 * currentValue);
        console.log("Setting Withdrawal to:", newWithdrawal); // Added logging
      setWithdrawal("$ " + String(newWithdrawal.toFixed(2).toString().replace(/\.?0+$/, '')))
      checkForWithdrawalFieldComplete(String(newWithdrawal));
      }
      setselectedWithdrawalPortion('50%');
    };
    
    const handleTwoThirdsButtonClick = () => {
      console.log("Handling quarter button click", currentValue);
      if (currentValue>0.0001) {
        const newWithdrawal = (0.75 * currentValue);
        console.log("Setting Withdrawal to:", newWithdrawal); // Added logging
      setWithdrawal("$ " + String(newWithdrawal.toFixed(2).toString().replace(/\.?0+$/, '')))
      checkForWithdrawalFieldComplete(String(newWithdrawal));
      }
      setselectedWithdrawalPortion('75%');
    };
    
    const handleAllButtonClick = () => {
      console.log("Handling quarter button click", currentValue);
      if (currentValue>0.0001) {
        const newWithdrawal = (1.0 * currentValue);
        console.log("Setting Withdrawal to:", newWithdrawal); // Added logging
      setWithdrawal("$ " + String(newWithdrawal.toFixed(2).toString().replace(/\.?0+$/, '')))
      checkForWithdrawalFieldComplete(String(newWithdrawal));
      }
      setselectedWithdrawalPortion('100%');
    };


    const handleFinalWithdrawalButtonClick = async () => {
      if (finalWithdrawalButtonActive) {
        const cleanedWithdrawal = withdrawal.replace(/[\s$,!#%&*()A-Za-z]/g, '');

        const WithdrawalToNumber = Number(cleanedWithdrawal);
        if (isNaN(WithdrawalToNumber)) {
          setErrorMessage('Invalid amount');
        } else if (WithdrawalToNumber > currentValue) {
          setErrorMessage('Insufficient balance');
        } else if (WithdrawalToNumber < 0.9) {
          setErrorMessage('Minimum: $1');
        } else {
          setWithdrawal('');

          setErrorMessage('Withdrawing...');

          console.log(publicKey, WithdrawalToNumber, currentValue);
          const withdrawSuccess: boolean = await saveNewWithdrawal(publicKey, WithdrawalToNumber, currentValue);
          
          if (withdrawSuccess) {
            setWithdrawalUI(cleanedWithdrawal);
            setselectedWithdrawalPortion('');
            setwithdrawalComplete(true);

            const timestamp = Date.now() / 1000;
            dispatch(mergePrincipalInvestedHistory({ [timestamp]: currentValue-WithdrawalToNumber }));

            setTimeout(() => {
              dispatch(setPrincipalInvested(currentValue - WithdrawalToNumber));
           }, 10000);
          

          } else {
            setErrorMessage('There was an error processing this withdrawal');
          }


        } 
      }
    };

    const errorLabelText = () => {
      if (errorMessage) {
        const color = errorMessage === 'Withdrawing...' ? '#4CD964' : ('#FF3B30');
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
        minWidth: '250px'
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



    if (isSmallScreen) {
        return (

          
            <div>

<div 
       style={{
       fontSize: isSmallScreen ? '20px' : '20px',
       borderRadius: '10px',
       padding: isSmallScreen ? '5px' : '10px',
       cursor: 'pointer',
       background: withdrawButtonHovered ? '#03A9F4' : '#D1E5F4',
       color: withdrawButtonHovered ? 'white': '#03A9F4',
       textAlign: 'center',
       width: '170px'
       }}
       onMouseEnter={() => setwithdrawButtonHovered(true)}
       onMouseLeave={() => setwithdrawButtonHovered(false)}
       onClick={toggleWithdrawMenu}>
       Withdraw
    </div>

            {withdrawMenuVisible && (
                <div>
              <div
                style={{
                  position: 'fixed',
                  top: 105,
                  left: 0,
                  height: '100vh',
                  width: '100vw',
                  overflowY: 'auto',
                  backgroundColor: 'white',
                  zIndex: 1,
                }}
              >

                {/* Add your menu content here */}


                <div style={{ 
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    position: 'relative',
    marginTop: '50px'
}}>

    <div style={{ 
        fontSize: '32px', 
        color: '#333333', 
        textAlign: 'center', 
        flex: 1
    }}>
        Withdraw
    </div>

    <div style={{ 
        color: '#333333', 
        padding: '15px', 
        cursor: 'pointer', 
        fontSize: '55px', 
        position: 'absolute', 
        right: 0, 
        top: '50%', 
        transform: 'translateY(-50%)' 
    }} onClick={toggleWithdrawMenu}>
        <img
            src={xIconGray2}
            alt=""
            style={{
                width: '45px', // Set the desired width
                height: '45px', // Set the desired height
                color: 'white'
            }}
        />
    </div>
</div>



{!imSureButtonClicked ? (
  <>
          <div style={{
padding: '20px',
color: '#333333',
fontSize: '25px',
display: 'flex',
flexDirection: 'column',
gap: '40px',
height: '60%',
alignItems: 'center',
marginTop: '30px'
}}>
  <div>We were just getting started.</div>

  <div>Are you sure you want to withdraw?</div>

  <div style={{ flex: 1 }}></div>

  <div 
       style={{
       fontSize: '30px',
       border: imSureButtonHovered ?  '2px solid #FF3B30' : '2px solid #FF3B30',
       borderRadius: '10px',
       padding: '10px',
       cursor: 'pointer',
       background: imSureButtonHovered ? '#FF3B30' : 'transparent',
       color: imSureButtonHovered ? 'white' : '#FF3B30',
       textAlign: 'center',
       width: '190px'
       }}
       onMouseEnter={() => setimSureButtonHovered(true)}
       onMouseLeave={() => setimSureButtonHovered(false)}
       onClick={() => setimSureButtonClicked(true)}>
       I am sure
    </div>

</div>
  </>
) : (
  <>
  
  {withdrawalComplete ? (
    <>
              <div style={{
padding: '20px',
color: '#4CD964',
fontSize: '30px',
display: 'flex',
flexDirection: 'column',
gap: '12px',
height: '60%',
alignItems: 'center',
marginTop: '0px'
}}>


  <div>Got it</div>
  
  <img
        src={checkMarkImage}
        alt=""
        style={{
          width: '200px', // Ensure the image fits within the screen width
          height: 'auto',  // Maintain the image's aspect ratio
          margin: '0 auto', // Center the image horizontally
        }}
      />

<div>We will send $ {withdrawalUI} to </div>
<div style={{fontSize: '20px'}}>{publicKey}</div>
<div>Within 2 business days </div>
        </div>
      </>
      
  ) : (
      <div style={{ display: 'flex', 
      flexDirection: 'column', marginTop: '30px',
      alignItems: 'center', gap: '10px' }}>
    
    <label htmlFor="Withdrawal" style={{ fontSize: '20px', color: '#444444', 
    marginBottom: '15px', display: 'flex', alignItems: 'center', }}>
    $ <span style={{ fontSize: '35px' }}>{currentValue.toFixed(2)}</span>   USDC
    <img src={solIcon} alt="Solana Logo" style={{ height: '20px', width: 'auto', 
      marginLeft: '-5px', padding: '10px 7px', borderRadius: '5px', marginRight: '3px' }} />
    </label>
    <input
      id="Withdrawal"
      type="text"
      value={withdrawal}
      onChange={handleWithdrawalChange}
      onInput={handleWithdrawalChange}
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
    
    <div style={styles.tradeTimeframeButtonRow} >
            <button style={selectedWithdrawalPortion === '25%' ? styles.selectedButton : styles.button} onClick={handleQuarterButtonClick}>25%</button>
            <button style={selectedWithdrawalPortion === '50%' ? styles.selectedButton : styles.button} onClick={handleHalfButtonClick}>50%</button>
            <button style={selectedWithdrawalPortion === '75%' ? styles.selectedButton : styles.button} onClick={handleTwoThirdsButtonClick}>75%</button>
            <button style={selectedWithdrawalPortion === '100%' ? styles.selectedButton : styles.button} onClick={handleAllButtonClick}>100%</button>
          </div>
    
    {errorLabelText()}
    
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button
          style={{
          backgroundColor: finalWithdrawalButtonActive ? '#03A9F4' : '#D1E5F4',
          color: finalWithdrawalButtonActive ? 'white': '#CCCCCC',
          padding: '10px 20px',
          fontSize: '25px',
          marginTop: '40px',
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: '10px',
          border: '1px solid transparent',
          cursor: 'pointer',
          width: isSmallScreen ? '100%' : '100%'
          }}
          onClick={handleFinalWithdrawalButtonClick}
      >
          Withdraw
      </button>
      </div>
    
    </div>
  )}

</>
)}








</div>
                  </div>
            )}
                  </div>
          );
    }

  return (


    <div>

<div 
       style={{
       fontSize: isSmallScreen ? '20px' : '20px',
       borderRadius: '10px',
       padding: isSmallScreen ? '5px' : '10px',
       cursor: 'pointer',
       background: withdrawButtonHovered ? '#03A9F4' : '#D1E5F4',
       color: withdrawButtonHovered ? 'white': '#03A9F4',
       textAlign: 'center',
       width: '170px'
       }}
       onMouseEnter={() => setwithdrawButtonHovered(true)}
       onMouseLeave={() => setwithdrawButtonHovered(false)}
       onClick={toggleWithdrawMenu}>
       Withdraw
    </div>

    {withdrawMenuVisible && (
        <div>
        <div
          style={{
            width: '100vw',
            height: '100vh',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            position: 'fixed',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onClick={toggleWithdrawMenu}
        ></div>

    <div style={{
        position: 'fixed',
        top: '50%',       // Center vertically
        left: '50%',      // Center horizontally
        transform: 'translate(-50%, -50%)', // Center it perfectly
        height: '70vh',
        width: '60vw',
        backgroundColor: 'white',
        overflowY: 'auto',
      }}>
        
        <div      style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          gap: '20px',
        }}>
          <div style={{fontSize: '35px'}}>Withdraw</div>
          <div style={{ flex: 1 }}></div>
          <span onClick={toggleWithdrawMenu} style={{ cursor:'pointer', paddingRight: '50px'}}>
            <img
              src={xIconGray}
              alt="Close Menu"
              style={{
              width: '40px', // Set the desired width
              height: '40px', // Set the desired height
              color: 'black'
              }}
          />
        </span>
        </div>

{!imSureButtonClicked ? (
  <>
          <div style={{
padding: '20px',
color: '#333333',
fontSize: '30px',
display: 'flex',
flexDirection: 'column',
gap: '40px',
height: '60%',
alignItems: 'center',
marginTop: '30px'
}}>
  <div>We were just getting started.</div>

  <div>Are you sure you want to withdraw?</div>

  <div style={{ flex: 1 }}></div>

  <div 
       style={{
       fontSize: isSmallScreen ? '20px' : '20px',
       border: imSureButtonHovered ?  '2px solid #FF3B30' : '2px solid #FF3B30',
       borderRadius: '10px',
       padding: isSmallScreen ? '5px' : '10px',
       cursor: 'pointer',
       background: imSureButtonHovered ? '#FF3B30' : 'transparent',
       color: imSureButtonHovered ? 'white' : '#FF3B30',
       textAlign: 'center',
       width: '170px'
       }}
       onMouseEnter={() => setimSureButtonHovered(true)}
       onMouseLeave={() => setimSureButtonHovered(false)}
       onClick={() => setimSureButtonClicked(true)}>
       I am sure
    </div>

</div>
  </>
) : (
  <>
  
  {withdrawalComplete ? (
    <>
              <div style={{
padding: '20px',
color: '#4CD964',
fontSize: '30px',
display: 'flex',
flexDirection: 'column',
gap: '12px',
height: '60%',
alignItems: 'center',
marginTop: '0px'
}}>


  <div>Got it</div>
  
  <img
        src={checkMarkImage}
        alt=""
        style={{
          width: '200px', // Ensure the image fits within the screen width
          height: 'auto',  // Maintain the image's aspect ratio
          margin: '0 auto', // Center the image horizontally
        }}
      />

<div>We will send $ {withdrawalUI} to </div>
<div style={{fontSize: '20px'}}>{publicKey}</div>
<div>Within 2 business days </div>
        </div>
      </>
      
  ) : (
      <div style={{ display: 'flex', 
      flexDirection: 'column', marginTop: '30px',
      alignItems: 'center', gap: '10px' }}>
    
    <label htmlFor="Withdrawal" style={{ fontSize: '20px', color: '#444444', 
    marginBottom: '15px', display: 'flex', alignItems: 'center', }}>
    $ <span style={{ fontSize: '35px' }}>{currentValue.toFixed(2)}</span>   USDC
    <img src={solIcon} alt="Solana Logo" style={{ height: '20px', width: 'auto', 
      marginLeft: '-5px', padding: '10px 7px', borderRadius: '5px', marginRight: '3px' }} />
    </label>
    <input
      id="Withdrawal"
      type="text"
      value={withdrawal}
      onChange={handleWithdrawalChange}
      onInput={handleWithdrawalChange}
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
    
    <div style={styles.tradeTimeframeButtonRow} >
            <button style={selectedWithdrawalPortion === '25%' ? styles.selectedButton : styles.button} onClick={handleQuarterButtonClick}>25%</button>
            <button style={selectedWithdrawalPortion === '50%' ? styles.selectedButton : styles.button} onClick={handleHalfButtonClick}>50%</button>
            <button style={selectedWithdrawalPortion === '75%' ? styles.selectedButton : styles.button} onClick={handleTwoThirdsButtonClick}>75%</button>
            <button style={selectedWithdrawalPortion === '100%' ? styles.selectedButton : styles.button} onClick={handleAllButtonClick}>100%</button>
          </div>
    
    {errorLabelText()}
    
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button
          style={{
          backgroundColor: finalWithdrawalButtonActive ? '#03A9F4' : '#D1E5F4',
          color: finalWithdrawalButtonActive ? 'white': '#CCCCCC',
          padding: '10px 20px',
          fontSize: '25px',
          marginTop: '40px',
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: '10px',
          border: '1px solid transparent',
          cursor: 'pointer',
          width: isSmallScreen ? '100%' : '100%'
          }}
          onClick={handleFinalWithdrawalButtonClick}
      >
          Withdraw
      </button>
      </div>
    
    </div>
  )}

</>
)}




</div>
      </div>
      )}
      </div>
  );
};