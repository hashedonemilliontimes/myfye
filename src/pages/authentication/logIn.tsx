
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LanguageCodeProps } from '../../helpers/languageManager';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { FirebaseError } from '@firebase/util';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import userIconGray2 from '../../assets/userIconGray2.png';

function LogIn() {

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

    //loaded language

  }, [lang]);

    const auth = getAuth();
    const [uid, setUID] = useState('');

    const navigate = useNavigate();



    const [signUpButtonActive, setSignUpButtonActive] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordResetSent, setPasswordResetSent] = useState(false);

    useEffect(() => {
      try {
        const theUserID = auth.currentUser?.uid;
        setUID(theUserID!);
      } catch {
          //user not validated
        }
      }, []);
      
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        checkForSignUpComplete(newEmail, password);
      };
      
      const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        checkForSignUpComplete(email, newPassword);
      };
      
      const checkForSignUpComplete = (newEmail: string, newPassword: string) => {
        const cleanedEmail = removeWhitespace(newEmail);
        const cleanedPassword = removeWhitespace(newPassword);
      
        if (cleanedEmail === '' || cleanedPassword === '') {
          setSignUpButtonActive(false); // Either field is empty
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
          setSignUpButtonActive(false); // Invalid email format
        } else {
          setSignUpButtonActive(true); // Both fields are filled and email is valid
        }
      };
      
      

      const [errorMessage, setErrorMessage] = useState('');

      const removeWhitespace = (str: string) => {
        return str.replace(/\s/g, '');
      };

      const handleSignInSubmitButtonClick = async () => {
        const cleanedEmail = removeWhitespace(email)
        const cleanedPassword = removeWhitespace(password)
        if (cleanedEmail === '' || password === '') {
          setErrorMessage('Please fill in all fields');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
            setErrorMessage('Please enter a valid email address');
        } else {
          signInWithEmailAndPassword(getAuth(), cleanedEmail, cleanedPassword)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            setErrorMessage('')
            navigate(`/${lang}/dashboard`);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setErrorMessage('Error: invalid log in');
          });
        }
      };

      const handleResetClick = () => {
        const cleanedEmail = removeWhitespace(email)

        if (cleanedEmail === '') {
          setErrorMessage('Please fill in the email field');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
            setErrorMessage('Please enter a valid email address for your reset link');
        } else if (passwordResetSent === true) {
          setErrorMessage('We already sent you a reset link please check your spam')
        } else {
          sendPasswordResetLink();
          setPasswordResetSent(true);
          setErrorMessage('');
        }
        
      };

      async function sendPasswordResetLink() {
        const auth = getAuth();
        
        try {
          await sendPasswordResetEmail(auth, email);
          console.log('Password reset email sent successfully!');
          // Additional logic after sending the email
        } catch (error) {
          console.error('Error sending password reset email:', error);
          // Handle error
        }
      }






  const errorLabelText = () => { //{errorLabelText()}
    if (errorMessage) {
      return <label style={{color: 'red', textAlign: 'center', fontSize: '20px'}}>{errorMessage}</label>
    } else {
      return <div style={{ visibility: 'hidden', fontSize: '20px' }}>$</div>;
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

        Log In
        </div>

        <div style={{ textAlign: 'left', marginTop: '40px'}}>


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

  <div>{errorLabelText()}</div>

  <button
    style={{
        backgroundColor: signUpButtonActive ? '#03A9F4' : '#D1E5F4',
        color: signUpButtonActive ? '#222222': '#CCCCCC',
        display: 'inline-block',
        padding: '10px 20px',
        fontSize: '25px',
        marginTop: '40px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: '10px',
        border: '1px solid transparent',
        cursor: 'pointer',
        width: '100%'
      }} onClick={handleSignInSubmitButtonClick}> Log In

      </button>

      

      <div style={{color: '#444444', fontSize: '15px', marginTop: '10px', textAlign: 'center'}}>By using Ependesi you agree to our Terms Of Service.</div>


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
  <span>Don't have an account?</span>
  <div style={{ color: '#007AFF', cursor: 'pointer', marginLeft: '10px' }}>Sign Up</div>
</div>
    
    </div>

    </div>
      </div>
      </div>
  );
}

export default LogIn;
