import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import xIcon from '../assets/xIconGray2.png';
import { useSelector } from 'react-redux';
import backButton from '../assets/backButton3.png';
import DepositStableCoin from './myWalletComponents/DepositStableCoin';
import WithdrawStableCoin from './myWalletComponents/WithdrawStableCoin';
import DepositFromCreditCard from './myWalletComponents/DepositFromCreditCard';
import Deposit from '../appcomponents/deposit';
import Withdraw from '../appcomponents/withdraw';
import HoldingsPortfolio from '../appcomponents/holdingsPortfolio';
import PieChartComponent from '../components/dashboardTiles/pieChart';
import myfyeEarnGreen from '../assets/myfyeEarnGreen.png';
import { setPieChartOpacity } from '../redux/userWalletData';
import { useDispatch } from 'react-redux';

function EarnPage() {
    const [showMenu, setShowMenu] = useState(false);

    const [currencySelected, setcurrencySelected] = useState('');
    const dispatch = useDispatch();
    const [menuPosition, setMenuPosition] = useState('-110vh'); 
    const pieChartOpacity = useSelector((state: any) => state.userWalletData.pieChartOpacity);
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const [Message, setMessage] = useState('');
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const [SubmitButtonActive, setSubmitButtonActive] = useState(false);

    const usdcSolBalance = useSelector((state: any) => state.userWalletData.usdcSolBalance);
    const usdtSolBalance = useSelector((state: any) => state.userWalletData.usdtSolBalance);
    const usdyBalance = useSelector((state: any) => state.userWalletData.usdySolBalance);


    const handleDepositButtonClick = () => {
      console.log("Handling quarter button click");

    };
    

    const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newMessage = event.target.value;
        setMessage(newMessage);
        checkForMessageComplete(Message);
    };

    const removeWhitespace = (str: string) => {
        return str.replace(/\s/g, '');
      };

    const checkForMessageComplete = (newMessage: string) => {
        const cleanedMessage = removeWhitespace(newMessage);
        if (cleanedMessage === '') {
          //error
          setSubmitButtonActive(false);
        } else {
            setSubmitButtonActive(true);

    }
}

    useEffect(() => {
        if (showMenu) {
          setMenuPosition('0'); // Bring the menu into view
        } else {
          setMenuPosition('-110vh'); // Move the menu off-screen

          setcurrencySelected('');
        }
      }, [showMenu]);
    
      const handleMenuClick = () => {
        // Add your logic here for what happens when the menu is clicked

        setShowMenu(!showMenu);
        
      };

      const fadePieChartOpacity = () => {
        dispatch(setPieChartOpacity(0))
    };

      
    return (
        <div style={{ backgroundColor: 'white'}}>

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

                <div style={{display: 'flex', alignItems: 'center', 
                justifyContent: 'center',
                marginTop: '0px'}}>
            <div style={{
           color: '#ffffff', 
           background: '#2E7D32', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #2E7D32', 
           fontWeight: 'bold',
           height: '40px', 
           width: '210px',
           display: 'flex',        // Makes this div also a flex container
           justifyContent: 'center', // Centers the text horizontally inside the button
           alignItems: 'center',// Centers the text vertically inside the button
           cursor: 'pointer',
           fontSize: '20px'     
       }} onClick={handleMenuClick}>
           View Portfolio
       </div>
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

<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<img src = {myfyeEarnGreen} style= {{marginTop: '30px', width: '50vw', height: 'auto'}}></img>

</div>



<div style={{marginTop: '15px', fontSize: '20px'}}>Current Balance: ${usdyBalance}</div>
<div style={{marginTop: '15px', fontSize: '20px'}}>MyFye Earn APY: 5.1%</div>

<div style={{marginTop: '15px', 
display: 'flex', alignItems: 'center', 
justifyContent: 'space-around',}} onClick={fadePieChartOpacity}>

<Deposit/>
<Withdraw/>
</div>

<div style={{marginTop: '15px', textAlign: 'center', fontSize: '16px'}}>Portoflio Allocation:</div>

    <div style={{
        transition: 'opacity 250ms ease-out',
    }}>
        <PieChartComponent/>
    </div>

<div>

<div style={{marginTop: '30px', fontSize: '14px', textAlign: 'center',}}>Myfye Earn is built on top of USDY, which are tokenized US treasury bonds created by Ondo Finance</div>

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
    )
}
export default EarnPage;