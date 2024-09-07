import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getFirestore, doc, setDoc, updateDoc } from 'firebase/firestore';
import { setCurrentUserKYCVerified } from '../redux/userWalletData';
import myfye from '../assets/Logo.png';

const PersonaKYC = () => {
  const selectedLanguageCode = useSelector((state: any) => state.userWalletData.selectedLanguageCode);
  const location = useLocation();
  const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
  const db = getFirestore();
  const dispatch = useDispatch()

  useEffect(() => {
    // Check if the unique string is in the URL
    const params = new URLSearchParams(location.search);
    const redirectStatus = params.get('status');

    if (redirectStatus === 'completed') {
      console.log('User has completed the Persona verification process.');
      // Update Firestore with the KYCverified status
      if (publicKey) {
        const userRef = doc(db, 'pubKeys', publicKey);

        updateDoc(userRef, {
          KYCverified: true,
        })
          .then(() => {
            console.log('KYCverified status updated successfully in Firestore.');
            dispatch(setCurrentUserKYCVerified(true));
          })
          .catch((error) => {
            console.error('Error updating KYCverified status:', error);
          });
      }
    }
  }, [location, db, publicKey]);

  const handleVerification = async () => {
    const redirectUri = encodeURIComponent(`https://myfye.com/${selectedLanguageCode}/app/?status=completed`);
    const personaURL = `https://withpersona.com/verify?inquiry-template-id=itmpl_bd6kiYfALVgfJK3H7LrGxMjPqbQP&environment-id=env_pLXq7eWG5CQjgn8ZgxzFnqFbJMYF&redirect-uri=${redirectUri}`;
    window.location.href = personaURL;
  };

  return (

    <div>

    <div style={{marginTop: '90px', fontSize: '25px', 
        textAlign: 'center', color: '#124C0A'}}>
            {selectedLanguageCode === 'en' && `We just need a little more`}
            {selectedLanguageCode === 'es' && `Sólo necesitamos un poco más`}
            <br/> 
            {selectedLanguageCode === 'en' && `information to get started`}
            {selectedLanguageCode === 'es' && `de información para empezar.`}
            </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
    <div
      style={{
        marginTop: '20px',
        textAlign: 'center',
        padding: '15px',
        background: '#ffffff',
        width: selectedLanguageCode === 'en' ? '130px': '180px',
        fontWeight: 'bold',
        color: '#124C0A',
        borderRadius: '10px',
        fontSize: '20px',
        cursor: 'pointer',
        border: '3px solid #124C0A'
      }}
      onClick={handleVerification}
    >
            {selectedLanguageCode === 'en' && `Get Verified`}
            {selectedLanguageCode === 'es' && `Obtener Verificado`}
      
    </div>
    </div>


    </div>
  );
};

export default PersonaKYC;
