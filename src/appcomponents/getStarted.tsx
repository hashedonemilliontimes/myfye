
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import background4 from '../assets/background4.png';
import background5 from '../assets/background5.png';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { FirebaseError } from '@firebase/util';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import userIconGray2 from '../assets/userIconGray2.png';
import { LanguageCodeProps } from '../helpers/languageManager';
import { useSelector } from 'react-redux';
import { setCurrentUserKYCVerified, setcurrentUserFirstName, setcurrentUserLastName,
  setcurrentUserEmail, } from '../redux/userWalletData';
import { useDispatch } from 'react-redux';
import { DynamicContextProvider, DynamicWidget, useDynamicContext, useUserUpdateRequest } from '@dynamic-labs/sdk-react-core';


export default function GetStarted() {


    const dispatch = useDispatch();
    const { primaryWallet, user } = useDynamicContext();
    const currentUserEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const { updateUser } = useUserUpdateRequest();

      //Pass language to components
  const { lang } = useParams<{ lang: string }>();
  const [languageRef, setLanguageRef] = useState<LanguageCodeProps['language']>('en');
  useEffect(() => {
    if (lang && (lang === 'en' || lang==='da' || lang === 'fr' || lang === 'es' || lang === 'it' || 
    lang === 'pt' || lang === 'sk' || lang === 'ar' || lang === 'tr' || lang === 'fr' || 
    lang === 'hi' || lang === 'zh' || lang === 'id' || lang === 'ko' || lang === 'ja' || 
    lang === 'ru' || lang === 'ur' || lang === 'fl' || lang === 'mr' || lang === 'te' || 
    lang === 'ta' || lang === 'vi' || lang === 'sw')) {
      setLanguageRef(lang);
    } else {
      // default to 'en'
      setLanguageRef('en');
    }
    }, [lang]);

    const firestore = getFirestore();

    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [createAccountButtonActive, setCreateAccountButtonActive] = useState(false);
  
    const navigate = useNavigate();

    useEffect(() => {
      if (currentUserEmail != null) {
        console.log('Email: ', currentUserEmail)
        setEmail(currentUserEmail)
      }

    }, [currentUserEmail]);

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFirstName = event.target.value;
        setFirstName(newFirstName);
        checkForSignUpComplete(newFirstName, lastName, email);
    };

    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newLastName = event.target.value;
        setLastName(newLastName);
        checkForSignUpComplete(firstName, newLastName, email);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        checkForSignUpComplete(firstName, lastName, newEmail);
        
      };

    const removeWhitespace = (str: string) => {
        return str.replace(/\s/g, '');
      };

    const checkForSignUpComplete = (newFirstName: string, newLastName: string, 
        newEmail: string) => {
        const cleanedEmail = removeWhitespace(newEmail);
        const cleanedFirstName = removeWhitespace(newFirstName);
        const cleanedLastName = removeWhitespace(newLastName);
        if (cleanedEmail === ''
        || cleanedFirstName === '' || cleanedLastName === '') {
          //error
          setCreateAccountButtonActive(false);
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
            //error
            setCreateAccountButtonActive(false);

            dispatch(setcurrentUserFirstName(cleanedFirstName));
            dispatch(setcurrentUserLastName(cleanedLastName));
            dispatch(setcurrentUserEmail(cleanedEmail));

            updateUser({ email: cleanedEmail, firstName: cleanedFirstName, lastName: cleanedLastName });

        } else {
            setCreateAccountButtonActive(true);

    }
}


  const handleSignUpSubmitButtonClick = async () => {
    const cleanedEmail = removeWhitespace(email);
    const cleanedFirstName = removeWhitespace(firstName);
    const cleanedLastName = removeWhitespace(lastName);
    if (cleanedEmail === '' || cleanedFirstName === '' || cleanedLastName === '') {
      //error
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
        //error
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

          interface newUser {
            email: string,
            creationDate: string,
            languageCode: string,
            firstName: string,
            lastName: string,
            KYCverified: boolean
          }
          // New user created successfully
          // Create a new user object

          
          const newUser: newUser = {
            email: cleanedEmail,
            firstName: cleanedFirstName,
            lastName: cleanedLastName,
            creationDate: creationDate,
            languageCode: lang!,
            KYCverified: true
          };

          // Set the display name


          // Save the user document to Firestore
          const userDocRef = doc(firestore, "users", publicKey);
          await setDoc(userDocRef, newUser, { merge: true });
          //console.log('New user document ID:', newUser);

          dispatch(setCurrentUserKYCVerified(true));

          setErrorMessage('');

      } catch (error: any) {
          // Handle error during sign up
          const errorCode = (error as FirebaseError).code;
          const errorMessage = (error as FirebaseError).message;
          console.log(errorCode)
          console.log(errorMessage)
          setErrorMessage('Invalid sign up try a different email');
        }
    }
  };

  const errorLabelText = () => { //{errorLabelText()}
    if (errorMessage) {
      return <label style={{color: 'red', textAlign: 'center'}}>{errorMessage}</label>
    } else {
      return <div style={{ visibility: 'hidden' }}>$</div>;
    }
  };
  

  return (
    <div style={{overflowX: 'hidden'}}>
    <div
      style={{
        fontSize: window.innerWidth < 768 ? '30px' : '30px', textAlign: 'center',
        color: '#333333', paddingTop: '20px', 
      }}
    >

      <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column',
      justifyContent: 'center', marginTop: '40px'}}>



{publicKey && (
        <div
        style={{
            width: '60vw',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '40px',
            //boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
            maxWidth: '500px',
        }}
        >
        </div>
)}


    <div
    style={{
        width: '90%',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '40px',
        maxWidth: '500px',
        marginTop: '-50px',
        height: '82vh'
    }}
    >
        <div style={{ color: '#333333', fontSize: '24px', textAlign: 'left'}}>
        Verify your account
        </div>

        <div style={{ textAlign: 'left'}}>
  <div style={{ marginTop: '30px', marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
    <label htmlFor="username" style={{ fontSize: '20px', color: '#444444', marginBottom: '5px' }}>
      Legal first name
    </label>
    <input
      id="firstname"
      type="text"
      value={firstName}
      onChange={handleFirstNameChange}
      onInput={handleFirstNameChange}
      style={{
        backgroundColor: '#EEEEEE', // Slightly lighter gray
        color: '#444444',
        fontSize: '20px',
        border: 'none', // Remove the border
        borderRadius: '5px', // Rounded edges
        padding: '10px 10px', // Adjust padding as needed
      }}
      placeholder="First name"
    />
  </div>

  <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
    <label htmlFor="email" style={{ fontSize: '20px', color: '#444444', marginBottom: '5px' }}>
      Legal last name
    </label>
    <input
      id="lastname"
      type="text"
      value={lastName}
      onChange={handleLastNameChange}
      onInput={handleLastNameChange}
      style={{
        backgroundColor: '#EEEEEE', // Slightly lighter gray
        color: '#444444',
        fontSize: '20px',
        border: 'none', // Remove the border
        borderRadius: '5px', // Rounded edges
        padding: '10px 10px', // Adjust padding as needed
      }}
      placeholder="Last name"
    />
  </div>

  <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
    <label htmlFor="phoneNumber" style={{ fontSize: '20px', color: '#444444', marginBottom: '5px' }}>
      Email
    </label>
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
      }}
      placeholder="Email"
    />
  </div>

  <button
    style={{
        backgroundColor: createAccountButtonActive ? '#03A9F4' : '#D1E5F4',
        color: createAccountButtonActive ? '#222222': '#CCCCCC',
        display: 'inline-block',
        padding: '10px 20px',
        fontSize: '25px',
        marginTop: '5px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: '10px',
        border: '1px solid transparent',
        cursor: 'pointer',
        width: '100%'
      }} onClick={handleSignUpSubmitButtonClick}>Verify Account

      </button>

      <div style={{color: '#444444', fontSize: '15px', marginTop: '10px', textAlign: 'center'}}>By verifying your account you agree to our Terms Of Service.</div>


</div>

    
    </div>

    </div>
      </div>
      </div>
  );
}

