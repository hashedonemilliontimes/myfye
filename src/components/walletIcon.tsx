import React, { useState, useEffect } from 'react';
import PhantomImage2 from '../assets/PhantomImage2.png';
import SolflareImage from '../assets/SolflareImage.jpg';
import ExodusImage from '../assets/ExodusImage.jpg';

interface WalletIconProps {
   type: 'Phantom' | 'Ledger' | 'Solflare' | 'Exodus';
}

export default function WalletIcon({ type }: WalletIconProps) {

  return (
    <div>
      {type === 'Phantom' && (
         <img
         src={PhantomImage2}
         alt=""
         style={{width: '30px', height:'30px'}}
     />
      )}

    {type === 'Solflare' && (
         <img
         src={SolflareImage}
         alt=""
     />
      )}

    {type === 'Exodus' && (
         <img
         src={ExodusImage}
         alt=""
     />
      )}
    </div>
  );
}
