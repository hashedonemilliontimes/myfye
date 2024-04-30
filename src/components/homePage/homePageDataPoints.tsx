import React, { useState, useEffect, useRef } from 'react';
import { LanguageCodeProps } from '../../helpers/languageManager';
import globeImage from '../../assets/globeImage.png';
import calculatorImage from '../../assets/calculatorImage.png';
import lockImage from '../../assets/lockImage.png';
import lightningImage from '../../assets/lightningImage.png';

export default function HomePageDataPoints(props: LanguageCodeProps) {
  const refOne = useRef<HTMLDivElement>(null);
  const refTwo = useRef<HTMLDivElement>(null);
  const refThree = useRef<HTMLDivElement>(null);
  const refFour = useRef<HTMLDivElement>(null);
  const isSmallScreen = window.innerWidth <= 768;

  type BlurbKey = 'one' | 'two' | 'three' | 'four';

  const [blurbHeight, setBlurbHeight] = useState({
    one: 0,
    two: 0,
    three: 0,
    four: 0,
  });

const toggleBlurb = (blurb: BlurbKey) => {
    // Toggle the clicked blurb and set all others to 0 (hidden)
    const updatedHeights = {
      one: 0,
      two: 0,
      three: 0,
      four: 0,
    };

    const refMap = {
      one: refOne,
      two: refTwo,
      three: refThree,
      four: refFour,
    };

    const refCurrent = refMap[blurb]?.current;

    if (refCurrent && blurbHeight[blurb] === 0) {
      updatedHeights[blurb] = refCurrent.scrollHeight;
    }

    setBlurbHeight(updatedHeights);
  };
  

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'column', width: isSmallScreen ? '80vw': '100%', 
      gap: isSmallScreen ? '10px' : '20px', color:'#333333', fontSize: isSmallScreen ? '20px' : '25px', 
      marginLeft: isSmallScreen ? '25px' : '0px'}}>
        <hr style={{ border: 'none', borderTop: '1.5px solid #333333', margin: '10px 0' }} />
        <div onClick={() => toggleBlurb('one')} style={{display: 'flex', 
          flexDirection: 'row', alignItems: 'center', gap: '30px', cursor: 'pointer'}}>

                            <img
                            src= {lockImage}
                            alt=""
                            style={{
                              width: '40px', // Set the desired width
                              height: 'auto', // Set the desired height
                            }}></img>
          <div style={{fontWeight: 'bold'}}>Robust and stable</div>
        </div>
        <div ref={refOne} style={{overflow: 'hidden', transition: 'height 400ms ease', height: `${blurbHeight.one}px`}}>
        In the world of finance, stability is paramount. That's why MyFye is built on foundational principles of reliability and trustworthiness. Our systems are not only robust but also equipped to handle any market fluctuations, ensuring your investments remain secure and stable.
        </div>
                            

                    <hr style={{ border: 'none', borderTop: '1.5px solid #333333', margin: '10px 0' }} />
                    <div 
                            onClick={() => toggleBlurb('two')}
                            style={{display: 'flex', 
                            flexDirection: 'row', alignItems: 'center', gap: '30px', cursor: 'pointer'
                            }}>

                            <img
                            src= {globeImage}
                            alt=""
                            style={{
                              width: '40px', // Set the desired width
                              height: 'auto', // Set the desired height
                            }}></img>

                            <div style={{fontWeight: 'bold',  }}>
                                Open and borderless
                            </div>
                    </div>

                        <div
                            ref={refTwo}
                            style={{
                            overflow: 'hidden',
                            transition: 'height 400ms ease',
                            height: `${blurbHeight.two}px`,
                            }}
                        >
                            Welcome to the future of investing with MyFye, where boundaries don't exist. Our platform is built for the global investor. No matter where you are in the world, you can access U.S. treasuries with ease, thanks to our open and borderless approach.
                        </div>

                        <hr style={{ border: 'none', borderTop: '1.5px solid #333333', margin: '10px 0' }} />
                        <div 
                            onClick={() => toggleBlurb('three')}
                            style={{display: 'flex', 
                            flexDirection: 'row', alignItems: 'center', gap: '30px', cursor: 'pointer'
                            }}>

                            <img
                            src= {lightningImage}
                            alt=""
                            style={{
                              width: '40px', // Set the desired width
                              height: 'auto', // Set the desired height
                            }}></img>

                            <div style={{fontWeight: 'bold', }}>
                                Fast and easy
                            </div>
                        </div>

                        <div
                            ref={refThree}
                            style={{
                            overflow: 'hidden',
                            transition: 'height 400ms ease',
                            height: `${blurbHeight.three}px`,
                            }}
                        >
                            MyFye ensures an investing experience that's both swift and straightforward. With intuitive interfaces, we've eradicated the complexities, making the investment process as simple as a few clicks.
                        </div>

                        <hr style={{ border: 'none', borderTop: '1.5px solid #333333', margin: '10px 0' }} />
                        <div 
                            onClick={() => toggleBlurb('four')}
                            style={{display: 'flex', 
                            flexDirection: 'row', alignItems: 'center', gap: '30px', cursor: 'pointer'
                            }}>


                          <img
                            src= {calculatorImage}
                            alt=""
                            style={{
                              width: '40px', // Set the desired width
                              height: 'auto', // Set the desired height
                            }}></img>

                            <div style={{fontWeight: 'bold',  }}>
                                Near-zero cost
                            </div>
                        </div>

                        <div
                            ref={refFour}
                            style={{
                            overflow: 'hidden',
                            transition: 'height 400ms ease',
                            height: `${blurbHeight.four}px`,
                            }}
                        >
                            Leveraging the Solana platform, MyFye benefits from the power of Solana's ultra-low fees. This means that when you invest with us, not only are you getting efficiency but also an experience that's remarkably cost-effective. With MyFye, top-tier investing doesn’t have to come at a premium.
                        </div> 

                </div>

</div>


  );
}