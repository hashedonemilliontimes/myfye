
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import background4 from '../assets/background4.png';
import background5 from '../assets/background5.png';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { FirebaseError } from '@firebase/util';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import userIconGray2 from '../../assets/userIconGray2.png';
import { LanguageCodeProps } from '../../helpers/languageManager';

export default function GetStarted() {


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

    const auth = getAuth();
    const [uid, setUID] = useState('');
    const firestore = getFirestore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [createAccountButtonActive, setCreateAccountButtonActive] = useState(false);
  
    const navigate = useNavigate();

    useEffect(() => {
      try {
        const theUserID = auth.currentUser?.uid;
        setUID(theUserID!);
      } catch {
          //user not validated
        }
      }, []);

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFirstName = event.target.value;
        setFirstName(newFirstName);
        checkForSignUpComplete(newFirstName, lastName, email, password);
    };

    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newLastName = event.target.value;
        setLastName(newLastName);
        checkForSignUpComplete(firstName, newLastName, email, password);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        checkForSignUpComplete(firstName, lastName, newEmail, password);
      };
      
      const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        checkForSignUpComplete(firstName, lastName, email, newPassword);
      };


    const removeWhitespace = (str: string) => {
        return str.replace(/\s/g, '');
      };

    const checkForSignUpComplete = (newFirstName: string, newLastName: string, 
        newEmail: string, newPassword: string) => {
        const cleanedEmail = removeWhitespace(newEmail);
        const cleanedPassword = removeWhitespace(newPassword);
        const cleanedFirstName = removeWhitespace(newFirstName);
        const cleanedLastName = removeWhitespace(newLastName);
        if (cleanedEmail === '' || cleanedPassword === ''
        || cleanedFirstName === '' || cleanedLastName === '') {
          //error
          setCreateAccountButtonActive(false);
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
            //error
            setCreateAccountButtonActive(false);
        } else {
            setCreateAccountButtonActive(true);

    }
}


  const handleSignUpSubmitButtonClick = async () => {
    const cleanedEmail = removeWhitespace(email);
    const cleanedPassword = removeWhitespace(password);
    const cleanedFirstName = removeWhitespace(firstName);
    const cleanedLastName = removeWhitespace(lastName);
    if (cleanedEmail === '' || cleanedPassword === ''
        || cleanedFirstName === '' || cleanedLastName === '') {
      //error
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
        //error
    } else {
      try {

        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, cleanedEmail, cleanedPassword)
        .then( async (userCredential) => {
          // Access the UID from the user credential
          const uid = userCredential.user.uid;

          //save display name
          await updateProfile(userCredential.user, { displayName: cleanedFirstName });

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
            uid: string,
            creationDate: string,
            languageCode: string,
            firstName: string,
            lastName: string,
          }
          // New user created successfully
          // Create a new user object

          
          const newUser: newUser = {
            uid: uid,
            email: cleanedEmail,
            firstName: cleanedFirstName,
            lastName: cleanedLastName,
            creationDate: creationDate,
            languageCode: lang!
          };

          // Set the display name


          /*
          const newEphemeralUserData: currentUserData = {
            testUser: isTestUser,
            userName: cleanedUsername,
            bitcoinDepositAddress: '',
            email: cleanedEmail,
            bitcoinKey: '',
            CryptosOriginated: 0,
            CryptosAlloted: 1,
            hasUnreadNotifications: false,
            phoneNumber: '',
            firstName: '',
            address: '',
            phoneVerified: false,
            creationDate: '',
            username: ''
          }

          dispatch(setUserData(newEphemeralUserData));
          */

          // Save the user document to Firestore
          const userDocRef = doc(firestore, "users", uid);
          await setDoc(userDocRef, newUser);
          //console.log('New user document ID:', newUser);
          

          navigate(`/${lang}/dashboard`);

          const actionCodeSettings = {
            url: 'https://ependesi.com',
            handleCodeInApp: true,
          };
          
          sendEmailVerification(userCredential.user, actionCodeSettings)
          .then(() => {
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            window.localStorage.setItem('emailForSignIn', email);
            // ...
            console.log('Success sending link to: ', email);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('Error sending email', errorMessage);
            // ...
          });
          
          setErrorMessage('');


        });
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
        <div style={{cursor: 'pointer',}} onClick={() => {
        navigate(`/${lang}`);
      }}>Ependesi</div>

<hr style={{ border: 'none', borderTop: '1.5px solid #CCCCCC', margin: '10px 0' }} />

      <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column',
      justifyContent: 'center', marginTop: '40px'}}>



{uid && (
        <div
        style={{
            width: '85vw',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '40px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
            maxWidth: '500px'
        }}
        >
    <div style={{ display: 'flex', alignItems: 'center', color: '#333333', fontSize: '24px' }}>
      <span>
      <img
                src={userIconGray2}
                alt="Close Menu"
                style={{
                width: '30px', // Set the desired width
                height: '30px', // Set the desired height
                }}
            /></span>
      <div style={{ fontSize: '22px', marginLeft: '10px' }}>Already signed in as {auth.currentUser?.displayName}</div>
    </div>
        
        </div>
)}


    <div
    style={{
        width: '85vw',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '40px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
        maxWidth: '500px'
    }}
    >

        <div style={{ color: '#333333', fontSize: '24px', textAlign: 'left'}}>

        Create your account
        </div>

        <div style={{ textAlign: 'left'}}>
  <div style={{ marginTop: '30px', marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
    <label htmlFor="username" style={{ fontSize: '20px', color: '#444444', marginBottom: '5px' }}>
      Legal first name
    </label>
    <input
      id="username"
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
      id="email"
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
      id="phoneNumber"
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

  <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
    <label htmlFor="password" style={{ fontSize: '20px', color: '#444444', marginBottom: '5px' }}>
      Password
    </label>
    <input
      id="password"
      type="text"
      value={password}
      onChange={handlePasswordChange}
      onInput={handlePasswordChange}
      style={{
        backgroundColor: '#EEEEEE', // Slightly lighter gray
        color: '#444444',
        fontSize: '20px',
        border: 'none', // Remove the border
        borderRadius: '5px', // Rounded edges
        padding: '10px 10px', // Adjust padding as needed
      }}
      placeholder="Password"
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
      }} onClick={handleSignUpSubmitButtonClick}>Create Account

      </button>

      <div style={{color: '#444444', fontSize: '15px', marginTop: '10px', textAlign: 'center'}}>By creating your account you agree to our Terms Of Service.</div>


</div>

    
    </div>

    <div
    style={{
        width: '85vw',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '40px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 0px rgba(0, 0, 0, 0.4)',
        maxWidth: '500px'
    }}
    >
<div style={{ display: 'flex', alignItems: 'center', color: '#333333', 
fontSize: window.innerWidth < 768 ? '17px' : '24px', }}>
  <span>Already have an account?</span>
  <div style={{ color: '#007AFF', cursor: 'pointer', marginLeft: '10px' }}>Log in</div>
</div>
    
    </div>

    </div>
      </div>
      </div>
  );
}

