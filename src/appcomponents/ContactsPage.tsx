import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import User from '../helpers/User';
import { setShouldShowBottomNav, setShowPayPage, 
    setShowSendPage, setShowRequestPage,
    setContacts, setSelectedContact,
    setShowContactPopup } from '../redux/userWalletData';

import _ from 'lodash';
import phoneIconWhite from '../assets/phoneIconWhite.png';
import mailIconWhite from '../assets/mailIconWhite.png';
import ContactPopup from './ContactPopup';

function ContactsPage() {
  
    
    const currentUserContacts = useSelector((state: any) => state.userWalletData.contacts);
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [contactIndex, setContactIndex] = useState(0);
    const [selectedContactList, setSelectedContactList] = useState<Array<any>>([]);
    const allDynamicUsers = useSelector((state: any) => state.userWalletData.allUsers);
    const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);

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

            
            if (currentUserEmail&& contact.email?.toLowerCase() === currentUserEmail.toLowerCase()) {
              return false;
            }

            
            return contact.username?.toLowerCase().includes(searchValue) ||
                   contact.firstName?.toLowerCase().includes(searchValue) ||
                   contact.lastName?.toLowerCase().includes(searchValue) ||
                   contact.email?.toLowerCase().includes(searchValue) ||
                   contact.phoneNumber?.toLowerCase().includes(searchValue);
        });

        setSearchResults(results);
        
      };

  
      const openContactPopUp = (index: number, list: string) => {
        // Add your logic here for what happens when the menu is clicked
        
        setContactIndex(index)

        if (list == 'yourContacts') {
            setSelectedContactList(currentUserContacts)
            dispatch(setSelectedContact(currentUserContacts[index]))
        } else {
            setSelectedContactList(searchResults)
            dispatch(setSelectedContact(searchResults[index]))
        }
        dispatch(setShowContactPopup(true))
      };


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


  function getRandomPurple(index: number) {
    // Use the index to influence the random generation
    const seed = index * 123456; // Arbitrary multiplier to ensure variation
    const red = Math.floor((Math.sin(seed) * 10000) % 100);  
    const blue = 128 + Math.floor((Math.cos(seed) * 10000) % 128);
    const green = Math.floor((Math.tan(seed) * 10000) % 100);
  
    // Ensure values are positive
    const validRed = red < 0 ? -red : red;
    const validGreen = green < 0 ? -green : green;
    const validBlue = blue < 0 ? -blue : blue;
  
    // Convert each part to a hexadecimal string and return the combined string
    return `#${validRed.toString(16).padStart(2, '0')}${validGreen.toString(16).padStart(2, '0')}${validBlue.toString(16).padStart(2, '0')}`;
  }
  
    return (
        
        <div>
            <ContactPopup/>
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
      placeholder={selectedLanguageCode === 'es' 
        ? 'Correo nombre o electrónico'
        : 'Name, Email, Phone Number'}
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
        backgroundColor: getRandomPurple(index),
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



      <div style={{fontSize: '25px', fontWeight: 'bold', marginTop: '20px'}}>
      {selectedLanguageCode === 'en' && `Your Contacts`}
      {selectedLanguageCode === 'es' && `Sus Contactos`}
      </div>



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



        </div> 
        </div>
    )
}
export default ContactsPage;