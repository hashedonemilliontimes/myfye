import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import { useSelector } from 'react-redux';
import backButton from '../assets/backButton3.png';
import Deposit from '../appcomponents/deposit';
import Withdraw from '../appcomponents/withdraw';
import HoldingsPortfolio from '../appcomponents/holdingsPortfolio';
import PieChartComponent from '../components/dashboardTiles/pieChart';
import myfyeEarnGreen from '../assets/myfyeEarnGreen.png';
import { setShouldShowBottomNav, setShowEarnPage,
  setShowEarnWithdrawPage, setShowEarnDepositPage } from '../redux/userWalletData';
import { useDispatch } from 'react-redux';
import InvestmentValue from '../appcomponents/investmentValue';
import history from '../assets/history.png';
import EarnTransactions from './EarnTransactions';

function EarnPage() {
    const showMenu = useSelector((state: any) => state.userWalletData.showEarnPage);
    const [showTransactionHistory, setshowTransactionHistory] = useState(false);
    const [currencySelected, setcurrencySelected] = useState('');
    const dispatch = useDispatch();
    const [menuPosition, setMenuPosition] = useState('-110vh'); 

    useEffect(() => {
        if (showMenu) {
          setMenuPosition('0'); // Bring the menu into view
        } else {
          setMenuPosition('-110vh'); // Move the menu off-screen
          
          setcurrencySelected('');
        }
      }, [showMenu]);
    
      const handleMenuClick = () => {

        if (showTransactionHistory) {
          toggleShowTransactionHistory()
        } else {
          if (showMenu) {
            dispatch(setShowEarnPage(false))
          }
        }
        
      };

      const fadePieChartOpacity = () => {
        //dispatch(setShouldShowBottomNav(false))
    };

    const toggleShowTransactionHistory = () => {
      
      if (!showTransactionHistory) {
        dispatch(setShouldShowBottomNav(false))
      } else {
        dispatch(setShouldShowBottomNav(true))
      }
      setshowTransactionHistory(!showTransactionHistory)

    };
  
    const handleWithdrawPageClick = () => {
      dispatch(setShouldShowBottomNav(false))
      dispatch(setShowEarnWithdrawPage(true))
    };

    const handleDepositPageClick = () => {
      dispatch(setShouldShowBottomNav(false))
      dispatch(setShowEarnDepositPage(true))
    };
      
    return (
        <div style={{ backgroundColor: 'white'}}>

<Withdraw/>
<Deposit/>

{ showMenu && (
<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      padding: '15px',
      cursor: 'pointer',
      zIndex: 4,
    }}>

            <img style={{width: 'auto', height: '35px', background: 'white'}} src={ showMenu ? (
                currencySelected ? backButton : showTransactionHistory ? backButton : backButton) : menuIcon }
            onClick={handleMenuClick} alt="Exit" />
            </div>)}



      <div style={{
        position: 'absolute',
        top: menuPosition,
        left: 0, // Use state variable for position
        padding: '15px',
        minHeight: 'calc(100% + 35px)',
        backgroundColor: 'white',
        width: '92vw',
        transition: 'top 0.5s ease', // Animate the left property
        zIndex: 3
      }}>


<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<img src = {myfyeEarnGreen} style= {{marginTop: '2px', width: '50vw', maxWidth: '270px', height: 'auto'}}></img>

</div>

        {!showTransactionHistory ? (
<div>

<div style={{
        position: 'absolute', // Position it relative to the viewport
        top: 0,              // Align to the top of the viewport
        right: 0,            // Align to the right of the viewport
        padding: '15px',
        cursor: 'pointer',
        zIndex: 4    
}}>
<img src={history} style={{height: '39px', width: '39px'}} onClick={toggleShowTransactionHistory}/>
</div>


<div style={{display: 'flex', alignItems: 'center', marginTop: '15px',}}>

<div style={{ fontSize: '20px', whiteSpace: 'nowrap'}}>Current Balance:&nbsp;</div>


<div style={{fontSize: '20px', display: 'flex', alignItems: 'center'}}>
    $ <InvestmentValue/>
  </div>


</div>


<div style={{marginTop: '15px', fontSize: '20px'}}>MyFye Earn APY: 5.1%</div>

<div style={{marginTop: '15px', 
display: 'flex', alignItems: 'center', 
justifyContent: 'space-around',}} onClick={fadePieChartOpacity}>

<div style={{
    color: 'white', 
    background: '#60A05B', 
    fontWeight: 'bold',
    borderRadius: '10px', 
    border: 'none', 
    height: '40px', 
    width: '135px',
    display: 'flex',        // Makes this div also a flex container
    justifyContent: 'center', // Centers the text horizontally inside the button
    alignItems: 'center',// Centers the text vertically inside the button
    cursor: 'pointer',
    fontSize: '20px'     
}} onClick={handleDepositPageClick}>
    Deposit
</div>


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
       }} onClick={handleWithdrawPageClick}>
           Withdraw
       </div>

</div>

<div style={{display:'flex', 
  flexDirection: 'column', 
  justifyContent: 'space-around',
  height: 'calc(100vh - 300px)'}}>

<div>
<div style={{marginTop: '15px', textAlign: 'center', 
  fontSize: '16px'}}>Portoflio Allocation:</div>

    <div style={{
        
    }}>
        <PieChartComponent/>
    </div>
    </div>
    
<div>

<div>
<div style={{marginTop: '15px', fontSize: '14px', 
  textAlign: 'center',}}>Myfye Earn is built on top of USDY, which are 
  tokenized US treasury bonds by Ondo Finance</div>

<a href="https://ondo.finance/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px'}}>
<div style={{borderRadius: '20px', padding: '10px', 
color: '#ffffff', fontWeight: 'bold', fontSize: '16px', 
backgroundColor: '#2E7D32', textAlign: 'center', width: '75vw'}}>Learn More About USDY</div>
</div>
</a>
</div>
</div>

</div>
  
</div>

        ) : (

          <div>
<EarnTransactions/>


          </div>


        )}



                  </div> 


        </div>
    )
}
export default EarnPage;