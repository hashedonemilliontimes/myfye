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
import { setShouldShowBottomNav, setShowPayPage, 
  setShowSendPage, setShowRequestPage,
  setContacts, setSelectedContactEmail } from '../redux/userWalletData';
import { useDispatch } from 'react-redux';
import timerImage from '../assets/timer.png';
import InvestmentValue from '../appcomponents/investmentValue';
import { getFirestore, collection, addDoc, 
  setDoc, getDoc, doc, getDocs, query, 
  where, updateDoc, arrayUnion } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import history from '../assets/history.png';
import PayTransactions from './PayTransactions';

function PayPage() {
  
  const [showTransactionHistory, setshowTransactionHistory] = useState(false);
    const showPayPage = useSelector((state: any) => state.userWalletData.showPayPage);
    const dispatch = useDispatch();
    const [menuPosition, setMenuPosition] = useState('-110vh'); 
    const pieChartOpacity = useSelector((state: any) => state.userWalletData.pieChartOpacity);
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const [Message, setMessage] = useState('');
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const [SubmitButtonActive, setSubmitButtonActive] = useState(false);
    const currentUserFirstName = useSelector((state: any) => state.userWalletData.currentUserFirstName);
    const currentUserContacts = useSelector((state: any) => state.userWalletData.contacts);
    const [email, setEmail] = useState('');
    const [contactIndex, setContactIndex] = useState(0);
    const [showContactPopup, setShowContactPopup] = useState(false);
    const db = getFirestore();
    interface Contact {
      email: string;
      firstName: string;
      publicKey: string;
  }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newEmail = event.target.value;
      setEmail(newEmail.toLowerCase());
    };

    const [errorMessage, setErrorMessage] = useState('');

    const removeWhitespace = (str: string) => {
      return str.replace(/\s/g, '');
    };

    const handleReferButtonPressed= async () => {
      const cleanedEmail = removeWhitespace(email)
      if (cleanedEmail === '') {
        setErrorMessage('Please enter an email address');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
          setErrorMessage('Please enter a valid email address');
      } else {

      const contactCollectionRef = collection(db, 'contacts');
      const contactDocRef = doc(contactCollectionRef, currentUserEmail);
      const updateContactInvites = await setDoc(contactDocRef, {
        emails: arrayUnion(cleanedEmail)
    }, { merge: true });

      const sendEmailCall = await sendEmail(currentUserFirstName, email);
      await Promise.all([updateContactInvites, sendEmailCall]);

      if (cleanedEmail in currentUserContacts) {

      }
      setErrorMessage(`Invite sent to ${email}`)
      setEmail('');


      }
    };

    const sendEmail = async (firstName: string, email: string) => {

      const requestData = {
          emailAddress: email,
          firstName: firstName,
        };

        const functions = getFunctions();

        const sendEmailFn = httpsCallable(functions, 
          'sendgridEmail');
          sendEmailFn({ emailAddress: email,
            firstName: firstName, 
            templateId: 'd-65ea71c05ebe438b8c71cbe6ff1a48dc' })
          .then((result) => {
              // Read result of the Cloud Function.
              console.log(result);
          })
          .catch((error) => {
              // Getting the Error details.
              console.log(error);
          });


    };

    useEffect(() => {
        if (showPayPage) {
          setMenuPosition('0'); // Bring the menu into view
        } else {
          setMenuPosition('-110vh'); // Move the menu off-screen
        }
      }, [showPayPage]);
    
      const handleMenuClick = () => {

        if (showTransactionHistory) {
          toggleShowTransactionHistory()
        } else {
          if (showPayPage) {
            dispatch(setShowPayPage(false))
          }
        }
        
      };

      const fadePieChartOpacity = () => {
        //dispatch(setShouldShowBottomNav(false))
    };


    const handleSendPageClick = (eventOrContact: React.MouseEvent<HTMLDivElement> | string = '') => {
      if (typeof eventOrContact === 'string') {
          const selectedContact = eventOrContact;
          // Handle the case where a string is passed
          dispatch(setShouldShowBottomNav(false));
          dispatch(setShowSendPage(true));
          dispatch(setSelectedContactEmail(selectedContact));
      } else {
          const event = eventOrContact;
          // Handle the case where the event is passed
          dispatch(setShouldShowBottomNav(false));
          dispatch(setShowSendPage(true));
      }
  };
      
  const handleRequestPageClick = (eventOrContact: React.MouseEvent<HTMLDivElement> | string = '') => {
    if (typeof eventOrContact === 'string') {
        const selectedContact = eventOrContact;
        // Handle the case where a string is passed
        dispatch(setShouldShowBottomNav(false));
        dispatch(setShowRequestPage(true));
        dispatch(setSelectedContactEmail(selectedContact));
    } else {
        const event = eventOrContact;
        // Handle the case where the event is passed
        dispatch(setShouldShowBottomNav(false));
        dispatch(setShowRequestPage(true));
    }
};

    const toggleShowTransactionHistory = () => {
      
      if (!showTransactionHistory) {
        dispatch(setShouldShowBottomNav(false))
      } else {
        dispatch(setShouldShowBottomNav(true))
      }
      setshowTransactionHistory(!showTransactionHistory)

    };
    const closeContactPopUp = () => {
      // Add your logic here for what happens when the menu is clicked

      setShowContactPopup(false)
      
    };

    const openContactPopUp = (index: number) => {
      // Add your logic here for what happens when the menu is clicked
      setShowContactPopup(true)
      setContactIndex(index)
    };

    const errorLabelText = () => {
      if (errorMessage) {
        
        return (
          <label
            style={{
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'left',
              margin: '0 auto',
              marginTop: '0px',
              fontSize: '18px',
              color: '#000000',
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
                justifyContent: 'left',
                alignItems: 'left',
                margin: '0 auto',
                marginTop: '0px',
                fontSize: '18px',
              }}
            >
              $
            </label>
          </div>
        );
      }
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

            <img style={{width: 'auto', height: '45px', background: 'white'}} src= {showTransactionHistory ? backButton : xIcon}
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
        zIndex: 2
      }}>

<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<img src = {myfyePay} style= {{marginTop: '2px', width: '50vw', maxWidth: '270px', height: 'auto'}}></img>

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
<img src={history} style={{height: '45px', width: '45px'}} onClick={toggleShowTransactionHistory}/>
</div>

<div style={{marginTop: currentUserContacts ? '20px' : '40px', 
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
    }} onClick={handleRequestPageClick}>Request</div>
  </div>
</div>

{currentUserContacts && currentUserContacts[0] && currentUserContacts.length > 0 && (
  <div style= {{display: 'flex', flexDirection: 'column', gap: '10px'}}>
    <div style={{fontSize: '25px', 
      fontWeight: 'bold', 
      marginTop: '15px'}}>Top Contacts</div>


    <div style={{ display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'left',
    gap: '0px' }}
    onClick={() => openContactPopUp(0)}>
        <div style={{
            width: '30px',
            height: '30px',
            backgroundColor: '#007AFF',
            borderRadius: '50%',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '17px',
            fontWeight: 'bold',
            position: 'relative', // Added position relative
            zIndex: 2, // Higher z-index to ensure it appears above the gray background
        }}>
            {currentUserContacts[0].charAt(0).toUpperCase()}
        </div>

        <div style={{
            backgroundColor: '#E5E5E5', // Light gray background
            padding: '5px 20px', // Padding to give some space inside the div
            borderRadius: '0 20px 20px 0', // Rounded border on the right side
            display: 'flex',
            alignItems: 'center',
            fontSize: '17px',
            marginLeft: '-13px', // Negative margin to make it visually continuous with the circle
            position: 'relative', // Necessary to make z-index work
            zIndex: 1 // Lower z-index so it appears below the blue circle
        }}>
            {currentUserContacts[0]}
        </div>

    </div>



{currentUserContacts[1] && (
    <div style={{ display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'left',
    gap: '0px' }}
    onClick={() => openContactPopUp(1)}>
        <div style={{
            width: '30px',
            height: '30px',
            backgroundColor: '#007AFF',
            borderRadius: '50%',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '17px',
            fontWeight: 'bold',
            position: 'relative', // Added position relative
            zIndex: 2, // Higher z-index to ensure it appears above the gray background
        }}>
            {currentUserContacts[1].charAt(0).toUpperCase()}
        </div>

        <div style={{
            backgroundColor: '#E5E5E5', // Light gray background
            padding: '5px 20px', // Padding to give some space inside the div
            borderRadius: '0 20px 20px 0', // Rounded border on the right side
            display: 'flex',
            alignItems: 'center',
            fontSize: '17px',
            marginLeft: '-13px', // Negative margin to make it visually continuous with the circle
            position: 'relative', // Necessary to make z-index work
            zIndex: 1 // Lower z-index so it appears below the blue circle
        }}>
            {currentUserContacts[1]}
        </div>

    </div>
    )}

{currentUserContacts[2] && (
    <div style={{ display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'left',
    gap: '0px' }}
    onClick={() => openContactPopUp(2)}>
        <div style={{
            width: '30px',
            height: '30px',
            backgroundColor: '#007AFF',
            borderRadius: '50%',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '17px',
            fontWeight: 'bold',
            position: 'relative', // Added position relative
            zIndex: 2, // Higher z-index to ensure it appears above the gray background
        }}>
            {currentUserContacts[2].charAt(0).toUpperCase()}
        </div>

        <div style={{
            backgroundColor: '#E5E5E5', // Light gray background
            padding: '5px 20px', // Padding to give some space inside the div
            borderRadius: '0 20px 20px 0', // Rounded border on the right side
            display: 'flex',
            alignItems: 'center',
            fontSize: '17px',
            marginLeft: '-13px', // Negative margin to make it visually continuous with the circle
            position: 'relative', // Necessary to make z-index work
            zIndex: 1 // Lower z-index so it appears below the blue circle
        }}>
            {currentUserContacts[2]}
        </div>

    </div>
    )}
        
  </div>
)}


<div style={{fontSize: '25px', fontWeight: 'bold', marginTop: currentUserContacts ? '15px' : '60px'}}>Refer a friend!</div>

    <input
      id="email"
      type="text"
      value={email}
      onChange={handleEmailChange}
      onInput={handleEmailChange}
      style={{
        backgroundColor: '#EEEEEE', // Slightly lighter gray
        color: '#444444',
        fontSize: '20px',
        border: 'none', // Remove the border
        borderRadius: '5px', // Rounded edges
        padding: '10px 10px', // Adjust padding as needed
        marginTop: '15px',
        width: '85vw',
      }}
      placeholder="Email"
    />


  <div style={{marginTop: '5px'}}>{errorLabelText()}</div>

  <button
    style={{
        backgroundColor: '#2E7D32',
        color: '#ffffff',
        padding: '10px 20px',
        fontSize: '25px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: '10px',
        border: '1px solid transparent',
        cursor: 'pointer',
        marginTop: '5px'
      }} onClick={handleReferButtonPressed}> Submit

      </button>


</div>

) : (

  <div>

 <PayTransactions/>
  </div>
)}




  </div>






<div style={{ backgroundColor: 'white' }}>

<div style={{display: 'flex', alignItems: 'center', 
justifyContent: 'center',}}>
  
</div>



<div>{showContactPopup && (
<div       style={{
position: 'fixed',
top: 0,
left: 0,
width: '100vw',
height: '100vh',
backgroundColor: 'rgba(0, 0, 0, 0.5)',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
zIndex: 60 // Ensure it's above other content
}} onClick={closeContactPopUp}>


<div style={{
position: 'fixed',
top: '30vh',
left: 0,
width: '100vw',
height: '120px',
background: '#ffffff',
zIndex: 61
}}> 

<div style={{textAlign: 'center', fontSize: '22px', marginTop: '15px'}}>
{currentUserContacts[contactIndex]}
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
}} onClick={() => handleSendPageClick(currentUserContacts[contactIndex])}>
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
onClick={() => handleRequestPageClick(currentUserContacts[contactIndex])}>
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

)}</div>
</div>
  
                  </div> 
    )
}
export default PayPage;