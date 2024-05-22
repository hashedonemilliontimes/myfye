import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import xIcon from '../assets/xIconGray2.png';
import { useSelector } from 'react-redux';
import backButton from '../assets/backButton3.png';
import DepositStableCoin from './myWalletComponents/DepositStableCoin';
import WithdrawStableCoin from './myWalletComponents/WithdrawStableCoin';
import SendPage from './SendPage';
import Withdraw from '../appcomponents/withdraw';
import HoldingsPortfolio from '../appcomponents/holdingsPortfolio';
import PieChartComponent from '../components/dashboardTiles/pieChart';
import myfyePay from '../assets/myfyePay.png';
import { setShouldShowBottomNav, setShowPayPage, setShowSendPage } from '../redux/userWalletData';
import { useDispatch } from 'react-redux';
import timerImage from '../assets/timer.png';
import InvestmentValue from '../appcomponents/investmentValue';

function PayPage() {
    const showPayPage = useSelector((state: any) => state.userWalletData.showPayPage);
    const dispatch = useDispatch();
    const [menuPosition, setMenuPosition] = useState('-110vh'); 
    const pieChartOpacity = useSelector((state: any) => state.userWalletData.pieChartOpacity);
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const [Message, setMessage] = useState('');
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const [SubmitButtonActive, setSubmitButtonActive] = useState(false);
    const updatingBalance = useSelector((state: any) => state.userWalletData.updatingBalance);
    const usdcSolBalance = useSelector((state: any) => state.userWalletData.usdcSolBalance);
    const usdtSolBalance = useSelector((state: any) => state.userWalletData.usdtSolBalance);
    const usdyBalance = useSelector((state: any) => state.userWalletData.usdySolBalance);


    useEffect(() => {
        if (showPayPage) {
          setMenuPosition('0'); // Bring the menu into view
          dispatch(setShouldShowBottomNav(true))
        } else {
          setMenuPosition('-110vh'); // Move the menu off-screen
          dispatch(setShouldShowBottomNav(false))
        }
      }, [showPayPage]);
    
      const handleMenuClick = () => {
        // Add your logic here for what happens when the menu is clicked

        dispatch(setShowPayPage(!showPayPage));
        
      };

      const fadePieChartOpacity = () => {
        //dispatch(setShouldShowBottomNav(false))
    };


    const handleSendPageClick = () => {
      dispatch(setShowSendPage(true));
    };
      
    return (
        <div style={{ backgroundColor: 'white'}}>

{ showPayPage && (
<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      padding: '15px',
      cursor: 'pointer',
      zIndex: 3    
    }}>

            <img style={{width: 'auto', height: '45px', background: 'white'}} src={xIcon}
            onClick={handleMenuClick} alt="Exit" />
            </div>)}

      <div style={{
        position: 'absolute',
        top: menuPosition,
        left: 0, // Use state variable for position
        padding: '15px',
        height: '90vh',
        backgroundColor: 'white',
        width: '92vw',
        transition: 'top 0.5s ease' // Animate the left property
      }}>

<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<img src = {myfyePay} style= {{marginTop: '20px', width: '50vw', maxWidth: '270px', height: 'auto'}}></img>

</div>



<div style={{marginTop: '40px', 
display: 'flex', alignItems: 'center', 
justifyContent: 'space-around',}} onClick={fadePieChartOpacity}>
  <div style={{display: 'flex', justifyContent: 'space-around', width: '90vw'}}>
  <div style={{
      color: '#ffffff', 
      background: '#2E7D32', // gray '#999999', 
      borderRadius: '10px', 
      border: '2px solid #2E7D32', 
      fontWeight: 'bold',
      height: '40px', 
      width: '130px',
      display: 'flex',        // Makes this div also a flex container
      justifyContent: 'center', // Centers the text horizontally inside the button
      alignItems: 'center',// Centers the text vertically inside the button
      cursor: 'pointer',
      fontSize: '20px'     
    }} onClick={handleSendPageClick}>Send</div>
    <div style={{
      color: '#ffffff', 
      background: '#2E7D32', // gray '#999999', 
      borderRadius: '10px', 
      border: '2px solid #2E7D32', 
      fontWeight: 'bold',
      height: '40px', 
      width: '130px',
      display: 'flex',        // Makes this div also a flex container
      justifyContent: 'center', // Centers the text horizontally inside the button
      alignItems: 'center',// Centers the text vertically inside the button
      cursor: 'pointer',
      fontSize: '20px'     
    }}>Request</div>
  </div>
</div>

                  </div> 


        </div>
    )
}
export default PayPage;