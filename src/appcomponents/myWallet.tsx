import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import xIcon from '../assets/xIconGray2.png';
import { useSelector } from 'react-redux';
import backButton from '../assets/backButton3.png';
import DepositStableCoin from './myWalletComponents/DepositStableCoin';
import WithdrawStableCoin from './myWalletComponents/WithdrawStableCoin';
import DepositFromCreditCard from './myWalletComponents/DepositFromCreditCard';

function MyWallet() {
    const [showMenu, setShowMenu] = useState(false);

    const [currencySelected, setcurrencySelected] = useState('');

    const [menuPosition, setMenuPosition] = useState('-110vh'); 
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

                <div style={{display: 'flex', alignItems: 'center', 
                justifyContent: 'center',
                marginTop: '20px'}}>
            <div style={{
           color: '#222222', 
           background: 'white', // gray '#999999', 
           borderRadius: '10px', 
           border: '2px solid #222222', 
           fontWeight: 'bold',
           height: '40px', 
           width: '210px',
           display: 'flex',        // Makes this div also a flex container
           justifyContent: 'center', // Centers the text horizontally inside the button
           alignItems: 'center',// Centers the text vertically inside the button
           cursor: 'pointer',
           fontSize: '20px'     
       }} onClick={handleMenuClick}>
           My Wallet
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

<div style={{marginTop: '100px', fontSize: '45px', color: '#222222'}}>My Wallet </div>

<div>




<div style={{ marginTop: '45px', display: 'flex', flexDirection: 'column', paddingLeft: '15px', paddingRight: '15px' }}>

  <div style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
    
    <div style= {{fontSize: '18px', marginTop: '12px'}}>US Dollar balance</div>
    <div>
    <div style={{ fontSize: '18px' }}>
    <span style={{ fontSize: '18px' }}>$</span>
    {((usdcSolBalance + usdtSolBalance) > 0.00001) ? (
    <span style={{ fontSize: '30px' }}>{(usdcSolBalance + usdtSolBalance).toFixed(6)}</span>
    ) : (
      <span style={{ fontSize: '30px' }}>0.0</span>
    )}
</div>
      
      </div>


      </div>

      <div style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '40px'}}>

  <div style= {{fontSize: '18px', marginTop: '12px'}}>USD Yield balance </div>

    {(usdyBalance > 0.0001) ? (
        <div style={{ fontSize: '30px' }}> {usdyBalance.toFixed(6)} </div>
    ) : (
      <div style={{ fontSize: '30px' }}> 0.0 </div>
    )}

</div>

</div>


<div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', gap: '20px'}}>


<DepositFromCreditCard/>


<DepositStableCoin/>


<WithdrawStableCoin/>
  </div>



</div>

                  </div> 


        </div>
    )
}
export default MyWallet;