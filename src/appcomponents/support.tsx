import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import xIcon from '../assets/xIconGray2.png';
import { useSelector, useDispatch } from 'react-redux';
import backButton from '../assets/backButton3.png';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import questionMarkImage from '../assets/questionMark.png';
import { setShouldShowBottomNav } from '../redux/userWalletData';

function Support() {

    const [showMenu, setShowMenu] = useState(false);

    const [currencySelected, setcurrencySelected] = useState('');
    const dispatch = useDispatch()
    const [menuPosition, setMenuPosition] = useState('-110vh'); 
    const firestore = getFirestore();
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const [Message, setMessage] = useState('');
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const [SubmitButtonActive, setSubmitButtonActive] = useState(false);

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
          dispatch(setShouldShowBottomNav(true))
        } else {
          setMenuPosition('-110vh'); // Move the menu off-screen
          dispatch(setShouldShowBottomNav(false))
          setcurrencySelected('');
        }
      }, [showMenu]);
    
      const handleMenuClick = () => {
        // Add your logic here for what happens when the menu is clicked

        setShowMenu(!showMenu);
        
      };


      const handleRequestSubmitButtonClick = async () => {
        const cleanedMessage = removeWhitespace(Message);
        if (cleanedMessage === '') {
          //error
          alert("Error with this request. Please try again later.");
        } else {
          try {
              const currentDate = new Date();
              const formatter = new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              });
              
              const creationDate = formatter.format(currentDate);
    
              interface newSupportRequest {
                email: string,
                publicKey: string,
                message: string,
                timestamp: string,
              }
              // New user created successfully
              // Create a new user object
    
              
              const newSupportRequest: newSupportRequest = {
                email: currentUserEmail,
                publicKey: publicKey,
                message: Message,
                timestamp: creationDate,
              };
    
              // Save the user document to Firestore
              const supportRequestsCollectionRef = collection(firestore, "supportRequests");
              const docRef = await addDoc(supportRequestsCollectionRef, newSupportRequest);
              
              setMessage('')
              setSubmitButtonActive(false)
              alert(`Support request received! We will email you at ${currentUserEmail}`);
          } catch (error: any) {
            alert("Error with this request. Please try again later.");
            }
        }
      };

    return (
        <div style={{ backgroundColor: 'white' }}>

<img src={questionMarkImage} style={{width: '30px', height: '30px'}}
onClick={handleMenuClick}></img>

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
                justifyContent: 'center'}}>
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

<div style={{marginTop: '70px', fontSize: '35px', color: '#222222'}}>We're here to help</div>

<div>



<div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column' }}>
  <label htmlFor="message" style={{ fontSize: '20px', color: '#444444', marginBottom: '5px' }}>
    What issue are you running into today?
  </label>
  <textarea
    id="message"
    value={Message}
    onChange={handleMessageChange}
    style={{
      backgroundColor: '#EEEEEE', // Slightly lighter gray
      color: '#444444',
      fontSize: '20px', // Text size
      border: 'none', // Remove the border
      borderRadius: '5px', // Rounded edges
      padding: '10px', // Padding
      width: '100%', // Full-width in the container
      boxSizing: 'border-box', // Ensures padding doesn't add to the width
      height: '250px', // Adjust the height as needed, enough for about 10 lines
      resize: 'vertical', // Allows the user to resize the textarea vertically
      marginTop: '15px'
    }}
    placeholder="Describe the problem in detail..."
  />
</div>


<button
    style={{
        backgroundColor: SubmitButtonActive ? '#03A9F4' : '#D1E5F4',
        color: SubmitButtonActive ? '#222222': '#CCCCCC',
        display: 'inline-block',
        padding: '10px 20px',
        fontSize: '25px',
        marginTop: '35px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: '10px',
        border: '1px solid transparent',
        cursor: 'pointer',
        width: '100%',
      }} onClick={handleRequestSubmitButtonClick}>Submit

      </button>


</div>

                  </div> 


        </div>
    )
}

export default Support;