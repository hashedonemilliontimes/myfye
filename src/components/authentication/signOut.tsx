import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { setLanguage } from '../../helpers/languageManager';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { FirebaseError } from '@firebase/util';
import { getAuth, Auth, signOut } from "firebase/auth";
//import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { LanguageCodeProps } from '../../helpers/languageManager';


interface ButtonProps {
    buttonSize: 'small' | 'large';
  }

export default function SignOutButton(languageProps: LanguageCodeProps, buttonProps: ButtonProps) {

  const db = getFirestore();
  //const dispatch = useAppDispatch();
  const auth = getAuth();
  const navigate = useNavigate();


  const handleSignOutButtonClick = () => {
        signOut(auth)
        .then(() => {
          // Sign-out successful.


          //REDUX
          //dispatch(clearUserData()); 
        })
        .catch((error) => {
          // An error happened.
          console.error(error);
        });
  };


  return (
    <div>

        <div
                style={{
                  cursor: 'pointer',
                  color: '#333333',
                  width: '150px',
                  backgroundColor: 'lightcoral', // Set the background color
                  borderRadius: '10px', // Set the border radius for rounded corners
                  padding: '8px 16px', // Add padding to the button
                  display: 'inline-block', // Make it an inline-block element
                  fontSize: buttonProps.buttonSize === 'small' ? '22px' : 'inherit',
                }}
                onClick={() => {
                    
                    handleSignOutButtonClick();
                    navigate(`/${languageProps.language}/`);
                  }}>

                Sign Out
        </div>

    </div>
  );
}