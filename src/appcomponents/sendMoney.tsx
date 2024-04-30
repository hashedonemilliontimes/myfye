import React, { useState, useEffect } from 'react';
import menuIcon from '../assets/menuIcon.png';
import xIcon from '../assets/xIconGray2.png';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { valueAtTime } from '../helpers/growthPercentage';
import { useDispatch } from 'react-redux';
import backButton from '../assets/backButton3.png';
import PieChartComponent from '../components/dashboardTiles/pieChart';
import roadImage1 from '../assets/roadImage1.png'

function sendMoney() {


    
      const sendMoneyButtonClicked = () => {
        // Add your logic here for what happens when the menu is clicked

      };

    return (
        <div style={{ backgroundColor: 'white' }}>

            <div style={{
           color: 'white', 
           background: '#60A05B',
           borderRadius: '10px', 
           border: 'none', 
           fontWeight: 'bold',
           height: '40px', 
           width: '220px',
           display: 'flex',        // Makes this div also a flex container
           justifyContent: 'center', // Centers the text horizontally inside the button
           alignItems: 'center',// Centers the text vertically inside the button
           cursor: 'pointer',
           fontSize: '20px'     
       }} onClick={sendMoneyButtonClicked}>
           Open Wallet
       </div>


        </div>
    )
}

export default sendMoney;