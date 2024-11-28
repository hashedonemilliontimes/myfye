import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import { useSelector } from 'react-redux';
import backButton from '../assets/backButton3.png';
import myfyePay from '../assets/myfyePay.png';
import { setShouldShowBottomNav, setShowPayPage, 
  setShowSendPage, setShowRequestPage,
  setContacts, setSelectedContact,
   setShowContactPopup } from '../redux/userWalletData';
import { useDispatch } from 'react-redux';
import timerImage from '../assets/timer.png';
import InvestmentValue from '../appcomponents/investmentValue';
import { getFirestore, collection, addDoc, 
  setDoc, getDoc, doc, getDocs, query, 
  where, updateDoc, arrayUnion } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import history from '../assets/history.png';
import PayTransactions from './PayTransactions';
import User from '../helpers/User';
import ContactsPage from './ContactsPage';
import phoneIconWhite from '../assets/phoneIconWhite.png';
import mailIconWhite from '../assets/mailIconWhite.png';
import ContactPopup from './ContactPopup';

function PayPage() {
  
  
  const [showContactPage, setShowContactPage] = useState(false);
  const [showTransactionHistory, setshowTransactionHistory] = useState(false);
    const showPayPage = useSelector((state: any) => state.userWalletData.showPayPage);
    const dispatch = useDispatch();
    const [menuPosition, setMenuPosition] = useState('-135vh'); 
    const pieChartOpacity = useSelector((state: any) => state.userWalletData.pieChartOpacity);
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const [Message, setMessage] = useState('');
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const [SubmitButtonActive, setSubmitButtonActive] = useState(false);
    const currentUserFirstName = useSelector((state: any) => state.userWalletData.currentUserFirstName);
    const currentUserContacts = useSelector((state: any) => state.userWalletData.contacts);
    const [referral, setReferral] = useState('');
    const [contactIndex, setContactIndex] = useState(0);
    const db = getFirestore();
    const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);

    const handleReferralChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newReferral = event.target.value;
      setReferral(newReferral.toLowerCase());
    };

    const [errorMessage, setErrorMessage] = useState('');

    const removeWhitespace = (str: string) => {
      return str.replace(/\s/g, '');
    };

    const handleReferButtonPressed= async () => {
      const cleanedReferral = removeWhitespace(referral)
      const cleanedPhoneNumber = cleanedReferral.replace(/[-()]/g, '');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      const phoneRegex = /^\d{10}$/;

      const isValidEmailAddress = emailRegex.test(cleanedReferral);
      const isValidPhoneNumber = phoneRegex.test(cleanedPhoneNumber);

      if (cleanedReferral === '') {
        if (selectedLanguageCode == 'es') {
          setErrorMessage('Por favor ingrese una dirección de correo electrónico')
        } else {
          setErrorMessage('Please enter an email address');
        }
      } else if (!isValidEmailAddress && !isValidPhoneNumber) {
        if (selectedLanguageCode == 'es') {
          setErrorMessage('Por favor ingrese una dirección de correo electrónico')
        } else {
          setErrorMessage('Please enter an email address or phone number');
        }

      } else {
        if (isValidEmailAddress) {
          const contactCollectionRef = collection(db, 'contacts');
          const contactDocRef = doc(contactCollectionRef, currentUserEmail);
          const updateContactInvites = await setDoc(contactDocRef, {
            emails: arrayUnion(cleanedReferral)
          }, { merge: true });
  
          const sendEmailCall = await sendEmail(currentUserFirstName, cleanedReferral);
          await Promise.all([updateContactInvites, sendEmailCall]);
  
          setErrorMessage(`Invite sent to ${cleanedReferral}`)
          setReferral('');
        } else if (isValidPhoneNumber) {
          const contactCollectionRef = collection(db, 'contacts');
          const contactDocRef = doc(contactCollectionRef, currentUserEmail);
          const updateContactInvites = await setDoc(contactDocRef, {
            phoneNumbers: arrayUnion(cleanedPhoneNumber)
          }, { merge: true });
  
          const sendPhoneTextCall = await sendPhoneText(currentUserFirstName, cleanedReferral);
          await Promise.all([updateContactInvites, sendPhoneTextCall]);
  
          setErrorMessage(`Invite sent to ${cleanedReferral}`)
          setReferral('');
        }
      }
    };

    const sendEmail = async (firstName: string, email: string) => {

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

    const sendPhoneText = async (firstName: string, phoneNumber: string) => {

        const functions = getFunctions();

        const message = `${firstName} invited you to join MyFye! Hop on to https://myfye.com`
        const sendTextMessageFn = httpsCallable(functions, 
          'sendTextMessage');
          sendTextMessageFn({ message: message, phoneNumber: phoneNumber})
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
          setMenuPosition('-135vh'); // Move the menu off-screen
        }
      }, [showPayPage]);
    
      const handleMenuClick = () => {

        if (showTransactionHistory) {
          toggleShowTransactionHistory()
        } else if (showContactPage) {
          setShowContactPage(false)
        } else {
          if (showPayPage) {
            dispatch(setShowPayPage(false))
          }
        }
        
      };

      const fadePieChartOpacity = () => {
        //dispatch(setShouldShowBottomNav(false))
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

      dispatch(setShowContactPopup(false))
    };

    const openContactPopUp = (index: number) => {
      // Add your logic here for what happens when the menu is clicked
      dispatch(setSelectedContact(currentUserContacts[index]))
      dispatch(setShowContactPopup(true))
      setContactIndex(index)
    };

    const browseAllContactsClicked= async () => {
      console.log(currentUserContacts)
      setShowContactPage(true)
    }

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


<ContactPopup/>
{ showPayPage && (
<div style={{ 
      position: 'absolute', // Position it relative to the viewport
      top: 0,              // Align to the top of the viewport
      left: 0,            // Align to the right of the viewport
      padding: '15px',
      cursor: 'pointer',
      zIndex: 3, 
    }}>

            <img style={{width: 'auto', height: '35px', background: 'white'}} src= {showTransactionHistory ? backButton : showContactPage ? backButton : backButton}
            onClick={handleMenuClick} alt="Exit" />
            </div>)}

      <div style={{
        position: 'absolute',
        top: menuPosition,
        left: 0, // Use state variable for position
        padding: '15px',
        minHeight: '130vh',
        backgroundColor: 'white',
        width: '94vw',
        transition: 'top 0.5s ease', // Animate the left property
        zIndex: 2
      }}>

<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
<img src = {myfyePay} style= {{marginTop: '2px', width: '50vw', maxWidth: '180px', height: 'auto'}}></img>

</div>



{!showTransactionHistory ? (
<div>


{!showContactPage ? (
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


<div style={{
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '2px 5px 15px rgba(0, 0, 0, 0.1), -2px 5px 15px rgba(0, 0, 0, 0.1)',
  padding: '10px',
  paddingBottom: '20px',
  marginTop: '15px'
}}>

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
    }} onClick={() => handleSendPageClick('')}>
      {selectedLanguageCode === 'en' && `Send`}
      {selectedLanguageCode === 'es' && `Enviar`}
    </div>
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
    }} onClick={() => handleRequestPageClick('')}>
      {selectedLanguageCode === 'en' && `Request`}
      {selectedLanguageCode === 'es' && `Pedido`}
    </div>
  </div>
</div>

<div style={{display: 'flex', alignItems: 'center', 
          justifyContent: 'center', marginTop: '15px'}}>
        <div style={{
          backgroundColor: '#2E7D32',
          color: '#ffffff',
          padding: '10px 20px',
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: '10px',
          border: '1px solid transparent',
          cursor: 'pointer',
          marginTop: '5px',
          maxWidth: '300px',
          width: '68vw'
        }}
        onClick={browseAllContactsClicked}>
      {selectedLanguageCode === 'en' && `Contacts`}
      {selectedLanguageCode === 'es' && `Contactos`}
        </div>
        </div>
</div>


{currentUserContacts && currentUserContacts[0] && currentUserContacts.length > 0 && (
  <div style={{
    background: '#ffffff',
    borderRadius: '20px',
    boxShadow: '2px 5px 15px rgba(0, 0, 0, 0.1), -2px 5px 15px rgba(0, 0, 0, 0.1)',
    padding: '10px',
    paddingBottom: '20px',
    marginTop: '15px'
  }}>
  <div style= {{display: 'flex', flexDirection: 'column', gap: '10px',}}>
    <div style={{fontSize: '25px', 
      fontWeight: 'bold', 
      marginTop: '15px'}}>
      {selectedLanguageCode === 'en' && `Top Contacts`}
      {selectedLanguageCode === 'es' && `Contactos Principales`}
      </div>

<div style= {{display: 'flex', flexDirection: 'column', gap: '10px', marginLeft: '15px'}}>
    <div style={{ display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'left',
    gap: '0px' }}
    onClick={() => openContactPopUp(0)}>
        <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#007AFF',
            borderRadius: '50%',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '27px',
            fontWeight: 'bold',
            position: 'relative', // Added position relative
            zIndex: 2, // Higher z-index to ensure it appears above the gray background
        }}>
{
  typeof currentUserContacts[0] === 'string'
    ? (/^\d+$/.test(currentUserContacts[0]) // Simple check if the string contains only digits
        ? <img src={phoneIconWhite} style={{width: '22px', height: '22px'}}/>
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentUserContacts[0]) // Very basic email check
          ? <img src={mailIconWhite} style={{width: '22px', height: '22px'}}/>
          : (currentUserContacts[0].charAt(0).toUpperCase())) // Fallback or other handling
    : `${currentUserContacts[0].firstName.charAt(0).toUpperCase()}`
}
        </div>



        <div style={{
            padding: '5px 10px', // Padding to give some space inside the div
            borderRadius: '0 20px 20px 0', // Rounded border on the right side
            display: 'flex',
            alignItems: 'center',
            fontSize: '17px',
            marginLeft: '0px', // Negative margin to make it visually continuous with the circle
            position: 'relative', // Necessary to make z-index work
            zIndex: 1 // Lower z-index so it appears below the blue circle
        }}>

<div style={{display: 'flex', flexDirection: 'column'}}>
<div>
            {
              typeof currentUserContacts[0] === 'string'
                ? currentUserContacts[0]
                : `${currentUserContacts[0].firstName} ${currentUserContacts[0].lastName}`
            }
            </div>

            <div style={{color: '#666666', fontSize: '15px'}}>
            {
              (typeof currentUserContacts[0] != 'string' && currentUserContacts[0].username)
                ? (`@${currentUserContacts[0].username}`) : (
                  <div style={{marginTop: '15px'}}></div>
                )
            }
            </div>
        </div>
        </div>
    </div>



{currentUserContacts[1] && (
    <div style={{ display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'left',
    gap: '0px' }}
    onClick={() => openContactPopUp(1)}>
        <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#007AFF',
            borderRadius: '50%',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '27px',
            fontWeight: 'bold',
            position: 'relative', // Added position relative
            zIndex: 2, // Higher z-index to ensure it appears above the gray background
        }}>
          
          <div>
          {
  typeof currentUserContacts[1] === 'string'
    ? (/^\d+$/.test(currentUserContacts[1]) // Simple check if the string contains only digits
        ? <img src={phoneIconWhite} style={{width: '22px', height: '22px'}}/>
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentUserContacts[1]) // Very basic email check
          ? <img src={mailIconWhite} style={{width: '22px', height: '22px'}}/>
          : (currentUserContacts[1].charAt(0).toUpperCase())) // Fallback or other handling
    : `${currentUserContacts[1].firstName.charAt(0).toUpperCase()}`
}
          </div>
        </div>

        <div style={{
            padding: '5px 10px', // Padding to give some space inside the div
            borderRadius: '0 20px 20px 0', // Rounded border on the right side
            display: 'flex',
            alignItems: 'center',
            fontSize: '17px',
            marginLeft: '0px', // Negative margin to make it visually continuous with the circle
            position: 'relative', // Necessary to make z-index work
            zIndex: 1 // Lower z-index so it appears below the blue circle
        }}>

<div style={{display: 'flex', flexDirection: 'column'}}>
<div>
            {
              typeof currentUserContacts[1] === 'string'
                ? currentUserContacts[1]
                : `${currentUserContacts[1].firstName} ${currentUserContacts[1].lastName}`
            }
            </div>

            <div style={{color: '#666666', fontSize: '15px'}}>
            {
              (typeof currentUserContacts[1] != 'string' && currentUserContacts[1].username)
                ? (`@${currentUserContacts[1].username}`) : (
                  <div style={{marginTop: '15px'}}></div>
                )
            }
            </div>
        </div>

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
            width: '40px',
            height: '40px',
            backgroundColor: '#007AFF',
            borderRadius: '50%',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '27px',
            fontWeight: 'bold',
            position: 'relative', // Added position relative
            zIndex: 2, // Higher z-index to ensure it appears above the gray background
        }}>
{
  typeof currentUserContacts[2] === 'string'
    ? (/^\d+$/.test(currentUserContacts[2]) // Simple check if the string contains only digits
        ? <img src={phoneIconWhite} style={{width: '22px', height: '22px'}}/>
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentUserContacts[2]) // Very basic email check
          ? <img src={mailIconWhite} style={{width: '22px', height: '22px'}}/>
          : (currentUserContacts[2].charAt(0).toUpperCase())) // Fallback or other handling
    : `${currentUserContacts[2].firstName.charAt(0).toUpperCase()}`
}
        </div>

        <div style={{
            padding: '5px 10px', // Padding to give some space inside the div
            borderRadius: '0 20px 20px 0', // Rounded border on the right side
            display: 'flex',
            alignItems: 'center',
            fontSize: '17px',
            marginLeft: '0px', // Negative margin to make it visually continuous with the circle
            position: 'relative', // Necessary to make z-index work
            zIndex: 1 // Lower z-index so it appears below the blue circle
        }}>

<div style={{display: 'flex', flexDirection: 'column'}}>
<div>
            {
              typeof currentUserContacts[2] === 'string'
                ? currentUserContacts[2]
                : `${currentUserContacts[2].firstName} ${currentUserContacts[2].lastName}`
            }
            </div>

            <div style={{color: '#666666', fontSize: '15px'}}>
            {
              (typeof currentUserContacts[2] != 'string' && currentUserContacts[2].username)
                ? (`@${currentUserContacts[2].username}`) : (
                  <div style={{marginTop: '15px'}}></div>
                )
            }
            </div>
        </div>

        </div>

    </div>
    )}
        

  </div>

  </div>
          </div>
)}






        <div style={{
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '2px 5px 15px rgba(0, 0, 0, 0.1), -2px 5px 15px rgba(0, 0, 0, 0.1)',
  padding: '10px',
  paddingBottom: '20px',
  marginTop: '15px'
}}>
<div style={{fontSize: '25px', fontWeight: 'bold', marginTop: currentUserContacts ? '15px' : '60px'}}>
{selectedLanguageCode === 'en' && `Refer a friend!`}
{selectedLanguageCode === 'es' && `¡Recomienda a un amigo!`}
</div>
<div style={{fontSize: '19px', color: '#666666'}}>
{selectedLanguageCode === 'en' && `Add a new contact`}
{selectedLanguageCode === 'es' && `¡Recomienda a un amigo!`}
</div>
    <input
      id="emailOrPhone"
      type="text"
      value={referral}
      onChange={handleReferralChange}
      onInput={handleReferralChange}
      style={{
        backgroundColor: '#EEEEEE', // Slightly lighter gray
        color: '#444444',
        fontSize: '20px',
        border: 'none', // Remove the border
        borderRadius: '5px', // Rounded edges
        padding: '10px 10px', // Adjust padding as needed
        marginTop: '15px',
        width: '75vw',
      }}
      placeholder={selectedLanguageCode === 'es' 
        ? 'Correo electrónico'
        : 'Email or Phone Number'}
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
      }} onClick={handleReferButtonPressed}> 
            {selectedLanguageCode === 'en' && `Submit`}
            {selectedLanguageCode === 'es' && `Entregar`}

      </button>

      </div>
      </div>
) : (<div>

  <ContactsPage/>
</div>)}


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

</div>
  
                  </div> 
    )
}
export default PayPage;