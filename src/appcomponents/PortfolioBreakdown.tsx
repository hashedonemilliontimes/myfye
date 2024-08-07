import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

function PortfolioPopup() {
  
    
    const [showPopup, setShowPopup] = useState(false);
    const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);
    const dispatch = useDispatch();

    const togglePopup = () => {
        setShowPopup(!showPopup)
      };

    return (


<div>
    
<div>
    
<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px'}} 
onClick={togglePopup}>
<div style={{borderRadius: '10px', padding: '10px', 
color: '#ffffff', fontWeight: 'bold', fontSize: '16px', 
backgroundColor: '#60A05B', textAlign: 'center', width: '75vw'}}>
                {selectedLanguageCode === 'en' && `Portfolio Breakdown`}
                {selectedLanguageCode === 'es' && `Detalles de la cartera`}
</div>
</div>
</div>

{showPopup && (
<div       style={{
position: 'fixed',
top: 0,
left: 0,
width: '100vw',
height: '100vh',
backgroundColor: 'rgba(0, 0, 0, 0.0)',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
zIndex: 63 // Ensure it's above other content
}} onClick={togglePopup}>


<div style={{
position: 'fixed',
top: '20vh',
left: 0,
width: '100vw',
height: '220px',
boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.4)',
background: '#ffffff',
zIndex: 64
}}> 

<div style={{textAlign: 'center', fontSize: '22px', marginTop: '15px'}}>
  
  
</div>

<div style={{display: 'flex', alignItems: 'center', 
  justifyContent: 'space-around', marginTop: '10px'}}>
<div style={{fontSize: '20px'}}>
{selectedLanguageCode === 'en' && `Portfolio Breakdown`}
{selectedLanguageCode === 'es' && `Detalles de la cartera`}
</div>
</div>

<div style={{display: 'flex', 
    flexDirection: 'column',
    paddingLeft: '20px',
    marginTop: '10px'}}>
<div>
  70% &nbsp;&nbsp;&nbsp;&nbsp;First Citizens - Bank Deposits
  </div>
  <div>
  16% &nbsp;&nbsp;&nbsp;&nbsp;StoneX - US T-Bills
  </div>
  <div>
  0.06% &nbsp;Morgan Stanley - Bank Deposits
  </div>
  <div>
  0.06% &nbsp;StoneX - Cash & Cash Equivalents
  </div>
  <div>
  0.05% &nbsp;Morgan Stanley - US T-Notes
  </div>
  <div>
  0.03% &nbsp;StoneX - US T-Notes
  </div>
  <div>
  0.02% &nbsp;First Citizens - Cash & Cash Eq.
  </div>
  <div>
  0.01% &nbsp;Morgan Stanley - Cash & Cash Eq.
  </div>
  </div>


</div>

</div>

)}


        </div> 
    )
}
export default PortfolioPopup;