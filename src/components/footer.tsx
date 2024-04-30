import React from 'react';

import { useNavigate } from 'react-router-dom';

//import SupportModal from './support';


const currentYear = new Date().getFullYear();

interface FooterProps {
  // Add any additional props here
}

const Footer: React.FC<FooterProps> = () => {

    const navigate = useNavigate();

  return (
    <footer style={{ backgroundColor: '#333333', color: '#EC770F' }}>

        <div style={{color: 'white', padding: '20px'}}>Copyright © {currentYear} MyFye - All Rights Reserved.</div>
    </footer>
  );
};

export default Footer;