import React, { useState, useEffect } from 'react';
import background4 from '../../assets/background4.png';
import calculatorImage from '../../assets/calculator.jpg';
//const values = ["$1,224", "$1,495", "$2,234"];

const StringAnimation = () => {
  const strings = [
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is",
    "Invested in Ependesi is",
    "Invested in Ependesi is",
    "Invested in Ependesi is",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is",
    "Invested in Ependesi is $|",
    "Invested in Ependesi is $1|",
    "Invested in Ependesi is $1,|",
    "Invested in Ependesi is $1,2|",
    "Invested in Ependesi is $1,22|",
    "Invested in Ependesi is $1,224|",
    "Invested in Ependesi is $1,224 |",
    "Invested in Ependesi is $1,224 i|",
    "Invested in Ependesi is $1,224 in|",
    "Invested in Ependesi is $1,224 in |",
    "Invested in Ependesi is $1,224 in 5|",
    "Invested in Ependesi is $1,224 in 5 y|",
    "Invested in Ependesi is $1,224 in 5 ye|",
    "Invested in Ependesi is $1,224 in 5 yea|",
    "Invested in Ependesi is $1,224 in 5 year|",
    "Invested in Ependesi is $1,224 in 5 years|",
    "Invested in Ependesi is $1,224 in 5 years|",
    "Invested in Ependesi is $1,224 in 5 years|",
    "Invested in Ependesi is $1,224 in 5 years|",
    "Invested in Ependesi is $1,224 in 5 years",
    "Invested in Ependesi is $1,224 in 5 years",
    "Invested in Ependesi is $1,224 in 5 years",
    "Invested in Ependesi is $1,224 in 5 years",
    "Invested in Ependesi is $1,224 in 5 years|",
    "Invested in Ependesi is $1,224 in 5 years|",
    "Invested in Ependesi is $1,224 in 5 years|",
    "Invested in Ependesi is $1,224 in 5 years|",
    "Invested in Ependesi is $1,224 in 5 years",
    "Invested in Ependesi is $1,224 in 5 years",
    "Invested in Ependesi is $1,224 in 5 years",
    "Invested in Ependesi is $1,224 in 5 years",
    "Invested in Ependesi is $1,224 in 5 years|",
    "Invested in Ependesi is $1,224 in 5 years|",
    "Invested in Ependesi is $1,224 in 5 years|",
    "Invested in Ependesi is $1,224 in 5 years|",
    "Invested in Ependesi is $1,224 in 5 years",
    "Invested in Ependesi is $1,224 in 5 years",
    "Invested in Ependesi is $1,224 in 5 years",
    "Invested in Ependesi is $1,224 in 5 year|",
    "Invested in Ependesi is $1,224 in 5 yea|",
    "Invested in Ependesi is $1,224 in 5 ye|",
    "Invested in Ependesi is $1,224 in 5 y|",
    "Invested in Ependesi is $1,224 in 5|",
    "Invested in Ependesi is $1,224 in |",
    "Invested in Ependesi is $1,224 in|",
    "Invested in Ependesi is $1,224 i|",
    "Invested in Ependesi is $1,224 |",
    "Invested in Ependesi is $1,224|",
    "Invested in Ependesi is $1,22|",
    "Invested in Ependesi is $1,2|",
    "Invested in Ependesi is $1,|",
    "Invested in Ependesi is $1|",
    "Invested in Ependesi is $|",
    "Invested in Ependesi is |",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is",
    "Invested in Ependesi is",
    "Invested in Ependesi is",
    "Invested in Ependesi is",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is",
    "Invested in Ependesi is $|",
    "Invested in Ependesi is $1|",
    "Invested in Ependesi is $1,|",
    "Invested in Ependesi is $1,4|",
    "Invested in Ependesi is $1,49|",
    "Invested in Ependesi is $1,495|",
    "Invested in Ependesi is $1,495 |",
    "Invested in Ependesi is $1,495 i|",
    "Invested in Ependesi is $1,495 in|",
    "Invested in Ependesi is $1,495 in |",
    "Invested in Ependesi is $1,495 in 1|",
    "Invested in Ependesi is $1,495 in 1|",
    "Invested in Ependesi is $1,495 in 10 y|",
    "Invested in Ependesi is $1,495 in 10 ye|",
    "Invested in Ependesi is $1,495 in 10 yea|",
    "Invested in Ependesi is $1,495 in 10 year|",
    "Invested in Ependesi is $1,495 in 10 years|",
    "Invested in Ependesi is $1,495 in 10 years|",
    "Invested in Ependesi is $1,495 in 10 years|",
    "Invested in Ependesi is $1,495 in 10 years|",
    "Invested in Ependesi is $1,495 in 10 years",
    "Invested in Ependesi is $1,495 in 10 years",
    "Invested in Ependesi is $1,495 in 10 years",
    "Invested in Ependesi is $1,495 in 10 years",
    "Invested in Ependesi is $1,495 in 10 years|",
    "Invested in Ependesi is $1,495 in 10 years|",
    "Invested in Ependesi is $1,495 in 10 years|",
    "Invested in Ependesi is $1,495 in 10 years|",
    "Invested in Ependesi is $1,495 in 10 years",
    "Invested in Ependesi is $1,495 in 10 years",
    "Invested in Ependesi is $1,495 in 10 years",
    "Invested in Ependesi is $1,495 in 10 years",
    "Invested in Ependesi is $1,495 in 10 years|",
    "Invested in Ependesi is $1,495 in 10 years|",
    "Invested in Ependesi is $1,495 in 10 years|",
    "Invested in Ependesi is $1,495 in 10 years|",
    "Invested in Ependesi is $1,495 in 10 years",
    "Invested in Ependesi is $1,495 in 10 years",
    "Invested in Ependesi is $1,495 in 10 years",
    "Invested in Ependesi is $1,495 in 10 year|",
    "Invested in Ependesi is $1,495 in 10 yea|",
    "Invested in Ependesi is $1,495 in 10 ye|",
    "Invested in Ependesi is $1,495 in 10 y|",
    "Invested in Ependesi is $1,495 in 10|",
    "Invested in Ependesi is $1,495 in 1|",
    "Invested in Ependesi is $1,495 in |",
    "Invested in Ependesi is $1,495 in|",
    "Invested in Ependesi is $1,495 i|",
    "Invested in Ependesi is $1,495 |",
    "Invested in Ependesi is $1,495|",
    "Invested in Ependesi is $1,49|",
    "Invested in Ependesi is $1,4|",
    "Invested in Ependesi is $1,|",
    "Invested in Ependesi is $1|",
    "Invested in Ependesi is $|",
    "Invested in Ependesi is |",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is",
    "Invested in Ependesi is",
    "Invested in Ependesi is",
    "Invested in Ependesi is",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is|",
    "Invested in Ependesi is",
    "Invested in Ependesi is $|",
    "Invested in Ependesi is $2|",
    "Invested in Ependesi is $2,|",
    "Invested in Ependesi is $2,3|",
    "Invested in Ependesi is $2,23|",
    "Invested in Ependesi is $2,234|",
    "Invested in Ependesi is $2,234 |",
    "Invested in Ependesi is $2,234 i|",
    "Invested in Ependesi is $2,234 in|",
    "Invested in Ependesi is $2,234 in |",
    "Invested in Ependesi is $2,234 in 2|",
    "Invested in Ependesi is $2,234 in 2|",
    "Invested in Ependesi is $2,234 in 20 y|",
    "Invested in Ependesi is $2,234 in 20 ye|",
    "Invested in Ependesi is $2,234 in 20 yea|",
    "Invested in Ependesi is $2,234 in 20 year|",
    "Invested in Ependesi is $2,234 in 20 years|",
    "Invested in Ependesi is $2,234 in 20 years|",
    "Invested in Ependesi is $2,234 in 20 years|",
    "Invested in Ependesi is $2,234 in 20 years|",
    "Invested in Ependesi is $2,234 in 20 years",
    "Invested in Ependesi is $2,234 in 20 years",
    "Invested in Ependesi is $2,234 in 20 years",
    "Invested in Ependesi is $2,234 in 20 years",
    "Invested in Ependesi is $2,234 in 20 years|",
    "Invested in Ependesi is $2,234 in 20 years|",
    "Invested in Ependesi is $2,234 in 20 years|",
    "Invested in Ependesi is $2,234 in 20 years|",
    "Invested in Ependesi is $2,234 in 20 years",
    "Invested in Ependesi is $2,234 in 20 years",
    "Invested in Ependesi is $2,234 in 20 years",
    "Invested in Ependesi is $2,234 in 20 years",
    "Invested in Ependesi is $2,234 in 20 years|",
    "Invested in Ependesi is $2,234 in 20 years|",
    "Invested in Ependesi is $2,234 in 20 years|",
    "Invested in Ependesi is $2,234 in 20 years|",
    "Invested in Ependesi is $2,234 in 20 years",
    "Invested in Ependesi is $2,234 in 20 years",
    "Invested in Ependesi is $2,234 in 20 years",
    "Invested in Ependesi is $2,234 in 20 year|",
    "Invested in Ependesi is $2,234 in 20 yea|",
    "Invested in Ependesi is $2,234 in 20 ye|",
    "Invested in Ependesi is $2,234 in 20 y|",
    "Invested in Ependesi is $2,234 in 20|",
    "Invested in Ependesi is $2,234 in 2|",
    "Invested in Ependesi is $2,234 in |",
    "Invested in Ependesi is $2,234 in|",
    "Invested in Ependesi is $2,234 i|",
    "Invested in Ependesi is $2,234 |",
    "Invested in Ependesi is $2,234|",
    "Invested in Ependesi is $2,23|",
    "Invested in Ependesi is $2,2|",
    "Invested in Ependesi is $2,|",
    "Invested in Ependesi is $2|",
    "Invested in Ependesi is $|",
    "Invested in Ependesi is |",
  ];

  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [displayedString, setDisplayedString] = useState(strings[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStringIndex((prevIndex) => (prevIndex + 1) % strings.length);
    }, 125); // Change the string every quarter second (125ms)

    return () => {
      clearInterval(interval);
    };
  }, [strings]);

  useEffect(() => {
    setDisplayedString(strings[currentStringIndex]);
  }, [currentStringIndex, strings]);

  return (
    <div
      style={{
        //backgroundImage: `url(${background4})`, // Set background image here
        background: '#333333',
        backgroundSize: 'cover',
      }}
    >

  {(window.innerWidth < 768) ? (<div>



    <div      style={{ paddingLeft: window.innerWidth < 768 ? '4px' : '140px',
      paddingTop: window.innerWidth < 768 ? '45px' : '60px',
      paddingBottom: window.innerWidth < 768 ? '45px' : '60px',
      marginTop: window.innerWidth < 768 ? '140px' : '70px',
      }}>

<p style={{fontSize: window.innerWidth < 768 ? '15px' : '26px', 
      color: "#333333", background: 'white', borderRadius: '25px', padding: '10px',
      width: '55px', marginLeft: '30px'}}>$1,000</p>

      <p style={{fontSize: window.innerWidth < 768 ? '15px' : '26px', 
      color: "white", marginLeft: '40px'}}>{displayedString}</p>

<p style={{fontSize: window.innerWidth < 768 ? '15px' : '25px', 

      color: "white",
      textAlign: 'right',
      marginRight: window.innerWidth < 768 ? '15px' : '140px', //At current interest rates
      }}></p>

      </div>


  </div>) : (<div>


    <div      style={{ paddingLeft: window.innerWidth < 768 ? '4px' : '140px',
      paddingTop: window.innerWidth < 768 ? '45px' : '60px',
      paddingBottom: window.innerWidth < 768 ? '45px' : '60px',
      marginTop: window.innerWidth < 768 ? '140px' : '70px',}}>


<p style={{fontSize: window.innerWidth < 768 ? '15px' : '26px', 
      color: "#333333", background: 'white', borderRadius: '25px', padding: '10px',
      width: '87px', marginLeft: '-10px'}}>$1,000</p>

      <p style={{fontSize: window.innerWidth < 768 ? '15px' : '26px', 
      color: "white",}}>{displayedString}</p>

<p style={{fontSize: window.innerWidth < 768 ? '15px' : '25px', 

      color: "white",
      textAlign: 'right',
      marginRight: window.innerWidth < 768 ? '15px' : '140px', //At current interest rates
      }}></p>

      </div>

  </div>) }

    </div>
  );
};

export default StringAnimation;
