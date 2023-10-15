import React from 'react';

import { useNavigate } from 'react-router-dom';

//import SupportModal from './support';


interface FooterProps {
  // Add any additional props here
}

const Footer: React.FC<FooterProps> = () => {

    const navigate = useNavigate();

  return (
    <footer style={{ backgroundColor: '#333333', color: '#EC770F' }}>

        <div style={{color: 'white', padding: '20px'}}>Copyright © 2023 MyFye - All Rights Reserved.</div>
    </footer>
  );
};

export default Footer;