import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import User from '../helpers/User';
import { setShouldShowBottomNav, setShowPayPage, 
    setShowSendPage, setShowRequestPage,
    setContacts, setSelectedContact,
    setShowContactPopup } from '../redux/userWalletData';

import phoneIconWhite from '../assets/phoneIconWhite.png';
import mailIconWhite from '../assets/mailIconWhite.png';

function ContactPopup() {
  
    
    const dispatch = useDispatch();
    const showContactPopup = useSelector((state: any) => state.userWalletData.showContactPopup);
    const selectedContact = useSelector((state: any) => state.userWalletData.selectedContact);

    const closeContactPopUp = () => {
        // Add your logic here for what happens when the menu is clicked
  
        dispatch(setShowContactPopup(false))
        
      };

      const handleSendPageClick = (contact: User | string) => {
        dispatch(setSelectedContact(contact));
        dispatch(setShouldShowBottomNav(false));
        dispatch(setShowSendPage(true));
        
    };

    const handleRequestPageClick = (contact: User | string) => {
        let email: string;
    
        if (typeof contact === 'string') {
          email = contact;
        } else {
          email = contact.email!;
        } 
      
        dispatch(setSelectedContact(email));
        dispatch(setShouldShowBottomNav(false));
        dispatch(setShowRequestPage(true));
        
    };

    return (


<div>{showContactPopup && (
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
}} onClick={closeContactPopUp}>


<div style={{
position: 'fixed',
top: '30vh',
left: 0,
width: '100vw',
height: '120px',
boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.4)',
background: '#ffffff',
zIndex: 64
}}> 

<div style={{textAlign: 'center', fontSize: '22px', marginTop: '15px'}}>
  
{
    typeof selectedContact === 'string'
      ? selectedContact
      : `${selectedContact.firstName} ${selectedContact.lastName}`
  }

</div>

<div style={{display: 'flex', alignItems: 'center', 
  justifyContent: 'space-around', marginTop: '10px'}}>

<div style={{
color: 'white',
background: '#60A05B', 
fontWeight: 'bold',
borderRadius: '10px', 
border: 'none', 
height: '40px', 
width: '110px',
display: 'flex',        // Makes this div also a flex container
justifyContent: 'center', // Centers the text horizontally inside the button
alignItems: 'center',// Centers the text vertically inside the button
cursor: 'pointer',
fontSize: '20px',
}} onClick={() => handleSendPageClick(selectedContact)}>
Send
</div>


<div style={{
color: 'white',
background: '#60A05B', 
fontWeight: 'bold',
borderRadius: '10px', 
border: 'none', 
height: '40px', 
width: '110px',
display: 'flex',        // Makes this div also a flex container
justifyContent: 'center', // Centers the text horizontally inside the button
alignItems: 'center',// Centers the text vertically inside the button
cursor: 'pointer',
fontSize: '20px',
}} 
onClick={() => handleRequestPageClick(selectedContact)}>
Request
</div>


<div style={{
color: 'white',
background: '#777777', 
fontWeight: 'bold',
borderRadius: '10px', 
border: 'none', 
height: '40px', 
width: '110px',
display: 'flex',        // Makes this div also a flex container
justifyContent: 'center', // Centers the text horizontally inside the button
alignItems: 'center',// Centers the text vertically inside the button
cursor: 'pointer',
fontSize: '20px',
}} onClick={closeContactPopUp}  >
Cancel
</div>


</div>
</div>

</div>

)}


        </div> 
    )
}
export default ContactPopup;