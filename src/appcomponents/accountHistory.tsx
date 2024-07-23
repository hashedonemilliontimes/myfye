import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { valueAtTime } from '../helpers/growthPercentage';
import backButton from '../assets/backButton3.png';
import PieChartComponent from '../components/dashboardTiles/pieChart';
import TransactionsComponent from '../components/dashboardTiles/transactions';
import roadImage1 from '../assets/roadImage1.png'
import { setShowAccountHistory } from '../redux/userWalletData';

function AccountHistory() {

    const showMenu = useSelector((state: any) => state.userWalletData.showAccountHistory);

    const [currencySelected, setcurrencySelected] = useState('');

    const [menuPosition, setMenuPosition] = useState('-110vh'); 
    const dispatch = useDispatch();
    const initialPrincipal = useSelector((state: any) => state.userWalletData.initialPrincipal);
    const initialInvestmentDate = useSelector((state: any) => state.userWalletData.initialInvestmentDate);
    const principalHistory = useSelector((state: any) => state.userWalletData.principalInvestedHistory);
    const navigate = useNavigate();
    const currentTimeInSeconds = Date.now()/1000;
    const currentValue = valueAtTime(currentTimeInSeconds, initialPrincipal, 
      initialInvestmentDate, principalHistory)
    

    useEffect(() => {
        if (showMenu) {
          setMenuPosition('0'); // Bring the menu into view
        } else {
          setMenuPosition('-110vh'); // Move the menu off-screen

          setcurrencySelected('');
        }
      }, [showMenu]);
    
      const handleMenuClick = () => {
        dispatch(setShowAccountHistory(false))
      };

    return (
        <div style={{ backgroundColor: 'white' }}>

{ showMenu && (
<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      padding: '15px',
      cursor: 'pointer',
      zIndex: 5    
    }}>

            <img style={{width: 'auto', height: '35px', background: 'white'}} src={ showMenu ? (
                currencySelected ? backButton : backButton) : menuIcon }
            onClick={handleMenuClick} alt="Exit" />
            </div>)}

      <div style={{
        position: 'absolute',
        top: menuPosition,
        left: 0, // Use state variable for position
        padding: '15px',
        minHeight: '100vh',
        backgroundColor: 'white',
        width: '92vw',
        transition: 'top 0.5s ease', // Animate the left property
        zIndex: 4
      }}>

<div style={{marginTop: '70px', fontSize: '35px', color: '#222222'}}>Account History</div>


{(currentValue > 0.9 || Object.keys(principalHistory).length >= 1) ? (<>
{showMenu && (
<div style={{maxWidth: '300px'}}>
  <TransactionsComponent/>
  </div>
  )}
</>) : (<>
<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
<img src={roadImage1} style={{width: '80vw', marginRight: '20px', maxWidth: '350px'}} ></img>
<div style={{marginTop: '50px', marginRight: '20px', fontSize: '20px'}}>Make your first deposit to explore</div>
<div style={{marginTop: '10px', marginRight: '20px', fontSize: '20px'}}>your investment journey</div>
</div>
</>)}

                  </div> 


        </div>
    )
}

export default AccountHistory;