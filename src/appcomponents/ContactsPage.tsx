import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import User from '../helpers/User';
import { setShouldShowBottomNav, setShowPayPage, 
    setShowSendPage, setShowRequestPage,
    setContacts, setSelectedContact } from '../redux/userWalletData';

import phoneIconWhite from '../assets/phoneIconWhite.png';
import mailIconWhite from '../assets/mailIconWhite.png';

function PayPage() {
  
    
    const currentUserContacts = useSelector((state: any) => state.userWalletData.contacts);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showContactPopup, setShowContactPopup] = useState(false);
    const [contactIndex, setContactIndex] = useState(0);
    const [selectedContactList, setSelectedContactList] = useState<Array<any>>([]);
    const allDynamicUsers = useSelector((state: any) => state.userWalletData.allUsers);
    const dispatch = useDispatch();

    const handleSearchValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchValue = event.target.value;
        setSearchValue(newSearchValue.toLowerCase());

        if (newSearchValue == '') {
            setSearchResults([])
        } else {
            updateSearchResults(newSearchValue);
        }

      };



      const updateSearchResults = (searchValue: string) => {
        
        const results = allDynamicUsers.filter((contact: User) => {
            // Check if any of the User object fields contain the search value

            
            return contact.username?.toLowerCase().includes(searchValue) ||
                   contact.firstName?.toLowerCase().includes(searchValue) ||
                   contact.lastName?.toLowerCase().includes(searchValue) ||
                   contact.email?.toLowerCase().includes(searchValue) ||
                   contact.phoneNumber?.toLowerCase().includes(searchValue);
        });
        setSearchResults(results);
      };

      const closeContactPopUp = () => {
        // Add your logic here for what happens when the menu is clicked
  
        setShowContactPopup(false)
        
      };
  
      const openContactPopUp = (index: number, list: string) => {
        // Add your logic here for what happens when the menu is clicked

        if (list == 'yourContacts') {
            setSelectedContactList(currentUserContacts)
        } else {
            setSelectedContactList(searchResults)
        }
        setShowContactPopup(true)
        setContactIndex(index)

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


  function getRandomPurple() {
    // Generate random values for red and blue
    const red = Math.floor(Math.random() * 100);  // Red can range fully from 0 to 255
    const blue = 128 + Math.floor(Math.random() * 128);  // Blue is biased towards higher values (128-255)
    const green = Math.floor(Math.random() * 100);  // Green stays very low to avoid straying into cyan or green

    // Convert each part to a hexadecimal string and return the combined string
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
}
    return (
        <div style={{ backgroundColor: 'white'}}>
      <input
      id="emailOrPhone"
      type="text"
      value={searchValue}
      onChange={handleSearchValueChange}
      onInput={handleSearchValueChange}
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
      placeholder="Name, Email, Phone Number"
    />


      {searchResults && (
  <div>
  {searchResults.map((contact, index) => (
    <div style={{ display: 'flex', alignItems: 'center', 
        justifyContent: 'left', gap: '0px', marginTop: '10px',
    marginLeft: '15px' }}
         onClick={() => openContactPopUp (index, 'search')}>
      <div style={{
        width: '40px',
        height: '40px',
        backgroundColor: getRandomPurple(),
        borderRadius: '50%',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '27px',
        fontWeight: 'bold',
        position: 'relative',
        zIndex: 2,
      }}>
        <div>
          {typeof contact === 'string'
            ? (contact as string).charAt(0).toUpperCase()
            : (contact as User).firstName!.charAt(0).toUpperCase()}
        </div>
      </div>
      <div style={{
        padding: '5px 20px',
        borderRadius: '0 20px 20px 0',
        display: 'flex',
        alignItems: 'center',
        fontSize: '17px',
        marginLeft: '-13px',
        position: 'relative',
        zIndex: 1
      }}>
<div style={{display: 'flex', flexDirection: 'column'}}>
<div>
{typeof contact === 'string'
          ? contact
          : `${(contact as User).firstName} ${(contact as User).lastName}`}
            </div>

            <div style={{color: '#666666', fontSize: '15px'}}>
            {
              (typeof contact != 'string' && (contact as User).username)
                ? (`@${(contact as User).username}`) : (
                  <div style={{marginTop: '15px'}}></div>
                )
            }
            </div>
        </div>
      </div>
    </div>
  ))}
</div>

      )}


      <div style={{fontSize: '25px', fontWeight: 'bold', marginTop: '20px'}}>Your contacts</div>



      {currentUserContacts && (
  <div>
  {currentUserContacts.map((contact: User, index: number) => (
    <div style={{ display: 'flex', alignItems: 'center', 
        justifyContent: 'left', gap: '0px', marginTop: '10px',
    marginLeft: '15px' }}
         onClick={() => openContactPopUp(index, 'yourContacts')}>
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
        position: 'relative',
        zIndex: 2,
      }}>
        <div>
        {
  typeof contact === 'string'
    ? (/^\d+$/.test(contact) // Simple check if the string contains only digits
        ? <img src={phoneIconWhite} style={{width: '22px', height: '22px'}}/>
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentUserContacts[1]) // Very basic email check
          ? <img src={mailIconWhite} style={{width: '22px', height: '22px'}}/>
          : ((contact as string).charAt(0).toUpperCase())) // Fallback or other handling
    : (contact as User).firstName?.charAt(0).toUpperCase()
}
        </div>
      </div>
      <div style={{
        padding: '5px 20px',
        borderRadius: '0 20px 20px 0',
        display: 'flex',
        alignItems: 'center',
        fontSize: '17px',
        marginLeft: '-13px',
        position: 'relative',
        zIndex: 1
      }}>



<div style={{display: 'flex', flexDirection: 'column'}}>
<div>
{typeof contact === 'string'
          ? contact
          : `${(contact as User).firstName} ${(contact as User).lastName}`}
            </div>

            <div style={{color: '#666666', fontSize: '15px'}}>
            {
              (typeof contact != 'string' && contact.username)
                ? (`@${contact.username}`) : (
                  <div style={{marginTop: '15px'}}></div>
                )
            }
            </div>
        </div>

      </div>
    </div>
  ))}
</div>

      )}



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
    typeof selectedContactList[contactIndex] === 'string'
      ? selectedContactList[contactIndex]
      : `${selectedContactList[contactIndex].firstName} ${selectedContactList[contactIndex].lastName}`
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
}} onClick={() => handleSendPageClick(selectedContactList[contactIndex])}>
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
onClick={() => handleRequestPageClick(selectedContactList[contactIndex])}>
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
    )
}
export default PayPage;