import { getSwapQuote, completeSwap } from '../JupiterFunctions/swap';
import React, { useState, useEffect } from 'react';
import {DynamicContextProvider, useDynamicContext, DynamicWidget} from '@dynamic-labs/sdk-react-core';
import { useSelector, useDispatch } from 'react-redux';
import User from '../helpers/User';
import myfyelogo from '../assets/MyFyeLogo1.png';
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { getUserData, getAllDynamicUsers, getUserContacts } from '../helpers/getUserData';
import {setDoc, getDoc, doc, getFirestore} from 'firebase/firestore';
function WebAppInner() {


    const db = getFirestore();
    const [disabledUserIDsArray, setDisabledUserIDsArray] = useState<string[]>([]);
    const allDynamicUsers = useSelector((state: any) => state.userWalletData.allUsers);
    const [validated, setValidated] = useState(false);
    const userEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);
    const { primaryWallet, user } = useDynamicContext();
    const dispatch = useDispatch();
    const validatedEmails = [
        "eli.lewitt@ninjatrader.com",
        "eli@passw3rd.com",
        "eli.lewitt@kellogg.northwestern.edu",
        "eli.lewitt@ondo.finance",
        "eli@myfye.com",
        "elewitt23@gmail.com",
        "elewitt@sandiego.edu",
        "gdmillig@uci.edu",
      ];
    
      useEffect(() => {
        if (user?.email) {
            if (validatedEmails.includes(user?.email)) {
                setValidated(true);
                getAllDynamicUsers(dispatch);
              }
        }

      }, [user]);

      

      
      const handleButtonClick = async (userId: string) => {
        try {
          let updatedArray;
      
          if (disabledUserIDsArray.includes(userId)) {
            // Remove the user ID from the array
            updatedArray = disabledUserIDsArray.filter(id => id !== userId);
          } else {
            // Add the user ID to the array
            updatedArray = [...disabledUserIDsArray, userId];
          }
      
          // Update Firestore with the new array
          const pubKeyDocRef = doc(db, 'DisabledUserIDs', 'DisabledUserIDs');
          await setDoc(pubKeyDocRef, { DisabledUserIDsArray: updatedArray }, { merge: true });
      
          // Update the local state
          setDisabledUserIDsArray(updatedArray);
      
          console.log(`User ${userId} has been ${disabledUserIDsArray.includes(userId) ? 'enabled' : 'disabled'}`);
        } catch (error) {
          console.error("Error updating DisabledUserIDsArray: ", error);
        }
      };


      useEffect(() => {
        const fetchData = async () => {
          try {
            const pubKeyDocRef = doc(db, 'DisabledUserIDs', 'DisabledUserIDs');
            const docSnapshot = await getDoc(pubKeyDocRef);
            const data = docSnapshot.data();
            const idsArray = data?.DisabledUserIDsArray || [];
            setDisabledUserIDsArray(idsArray);
          } catch (error) {
            console.error("Error fetching data: ", error);
          }
        };
      
        fetchData(); // Call the async function
      
      }, []);


      if (!validated) {
        return (
            <div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100vw', justifyContent: 'center'}}>
                <img src={myfyelogo} style={{width: '200px', height: 'auto'}}/>
            </div>
            <div style={{marginTop: '150px', display: 'flex', alignItems: 'center', width: '100vw', 
                justifyContent: 'center'}}>
                    
                    <DynamicWidget/>
                </div>
            </div>
        )
      } else {
        return (
            <div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100vw', justifyContent: 'center'}}>
              <img src={myfyelogo} style={{width: '200px', height: 'auto'}} alt="Logo"/>
            </div>
      
      
            <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw' }}>
              {allDynamicUsers.map((user: User, index: number) => (
                <div key={index} style={{ width: '98%', padding: '20px', borderBottom: '1px solid #ccc' }}>

<div style={{display: 'flex', justifyContent: 'space-between', }}>
  <span style={{ flexBasis: '25%', textAlign: 'left' }}>Name: {user.firstName} {user.lastName}</span>
  <span style={{ flexBasis: '30%', textAlign: 'left' }}>Email: {user.email}</span>
  <span style={{ flexBasis: '20%', textAlign: 'left' }}>Phone: {user.phoneCountryCode}{user.phoneNumber}</span>
  <div style={{ flexBasis: '25%', textAlign: 'left' }}>
  <div style={{display: 'flex', flexDirection: 'column'}}>User ID: {user.id}

    <div style={{marginTop: '20px', }}>
        <span>Transactions: </span>
    <span style={{ color: '#ffffff', 
        backgroundColor: disabledUserIDsArray.includes(user.id!) ? 'red' : 'green',
        padding: '5px', width: '110px', textAlign: 'center',
        borderRadius: '8px',
        cursor: 'pointer' }}
        onClick={() => handleButtonClick(user.id!)}>
        {disabledUserIDsArray.includes(user.id!) ? 'Disabled' : 'Enabled'}
    </span>
    </div>
    </div>
  </div>

  </div>
  <div>Solana wallet pubkey: {user.walletPublicKey}</div>
                </div>
              ))}
            </div>
          </div>
        )
      }

}


function AdminDashboard() {
    return (
      <DynamicContextProvider settings={{ 
        environmentId: 'fc5dcdf2-470b-4572-99e9-93544f53b72e',
        walletConnectors: [SolanaWalletConnectors as any],
        eventsCallbacks: {
          onLogout: (args) => {
            console.log('onLogout was called', args);
            window.location.reload();
          }
        }
      }}>
        <div style={{overflowX: 'hidden'}}>
        <WebAppInner/>
        </div>
  
      </DynamicContextProvider>
    );
  }
  
  export default AdminDashboard;