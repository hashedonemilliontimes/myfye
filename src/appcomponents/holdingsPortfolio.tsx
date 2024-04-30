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

function HoldingsPortfolio() {

    const [showMenu, setShowMenu] = useState(false);

    const [currencySelected, setcurrencySelected] = useState('');

    const [menuPosition, setMenuPosition] = useState('-100vh'); 

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
          setMenuPosition('-100vh'); // Move the menu off-screen

          setcurrencySelected('');
        }
      }, [showMenu]);
    
      const handleMenuClick = () => {
        // Add your logic here for what happens when the menu is clicked

        console.log("currentValue: ", currentValue)
        setShowMenu(!showMenu);
        
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
      zIndex: 3    
    }}>

            <img style={{width: 'auto', height: '45px', background: 'white'}} src={ showMenu ? (
                currencySelected ? backButton : xIcon) : menuIcon }
            onClick={handleMenuClick} alt="Exit" />
            </div>)}

            <div style={{
           color: '#60A05B', 
           background: 'white', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #60A05B', 
           fontWeight: 'bold',
           height: '40px', 
           width: '220px',
           display: 'flex',        // Makes this div also a flex container
           justifyContent: 'center', // Centers the text horizontally inside the button
           alignItems: 'center',// Centers the text vertically inside the button
           cursor: 'pointer',
           fontSize: '20px'     
       }} onClick={handleMenuClick}>
           View Porfolio
       </div>

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

<div style={{marginTop: '100px', fontSize: '45px', color: '#222222'}}>Portfolio</div>


{currentValue > 0.9 ? (<>

<div style={{maxWidth: '300px'}}>
  <PieChartComponent/>
  </div>
</>) : (<>
<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
<img src={roadImage1} style={{width: '80vw', marginRight: '20px', maxWidth: '350px'}} ></img>
<div style={{marginTop: '50px', marginRight: '20px', fontSize: '20px'}}>Make your first deposit to explore</div>
<div style={{marginTop: '10px', marginRight: '20px', fontSize: '20px'}}>your portfolio</div>
</div>
</>)}

                  </div> 


        </div>
    )
}

export default HoldingsPortfolio;