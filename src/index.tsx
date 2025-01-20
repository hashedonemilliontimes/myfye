import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import store from './redux/store.tsx';
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFunctions } from "firebase/functions";
import { PrivyProvider } from "@privy-io/react-auth";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const HELIUS_API_KEY = process.env.REACT_APP_HELIUS_API_KEY;

root.render(
  <React.StrictMode>
    <PrivyProvider
      appId="cm4ucmtf8091nkywlgy9os418"
      config={{
        loginMethods: ['email'],
        appearance: {
          theme: 'light',
          accentColor: '#447E26',
          logo: 'https://project-eli-lewitt.s3.us-west-2.amazonaws.com/logo512.png',
          walletChainType: 'solana-only',
        },
        embeddedWallets: {
          createOnLogin: 'off',
        },
        solanaClusters: [
          {
            name: 'mainnet-beta',
            rpcUrl: `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
          },
        ],
      }}
      children={
        <Provider store={store} children={<App />}>
        </Provider>
      }
    >
    </PrivyProvider>
  </React.StrictMode>
);



const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const functions = getFunctions(app);
  
export { app, db, functions, HELIUS_API_KEY };