import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setLanguage } from '../helpers/languageManager';
import { LanguageCodeProps } from '../helpers/languageManager';
import globeIconWhite from '../assets/globeIconWhite.png';
import globeIconGray from '../assets/globeIconGray 2.png'
import xIconGray from '../assets/xIconGray.png';





interface colorProps {
  color: 'light' | 'dark';
}

interface GlobeMenuProps {
  languageProps: LanguageCodeProps;
  colorProps: colorProps;
}

export default function GlobeMenu({ languageProps, colorProps }: GlobeMenuProps) {
    

    const navigate = useNavigate();

    const [globeMenuVisible, setGlobeMenuVisible] = useState(false);
    const [globeLanguageIsSelected, setLanguageIsSelected] = useState(true);
    const [globeCurrencyIsSelected, setCurrencyIsSelected] = useState(false);

    const toggleGlobeMenu = () => {
      setGlobeMenuVisible(!globeMenuVisible);
    };


    const [globeMenuHovered, setGlobeMenuHovered] = useState(false);


    const textGlowStyle = globeMenuHovered
    ? { 
        textShadow: `0 0 5px rgba(${colorProps.color === 'dark' ? '51, 51, 51' : '255, 255, 255'}, 0.5), 0 0 10px rgba(${colorProps.color === 'dark' ? '51, 51, 51' : '255, 255, 255'}, 0.5), 0 0 15px rgba(${colorProps.color === 'dark' ? '51, 51, 51' : '255, 255, 255'}, 0.5)` 
      }
    : {};
  
  const iconGlowStyle = globeMenuHovered
    ? { 
        filter: `drop-shadow(0 0 10px rgb(${colorProps.color === 'dark' ? '51, 51, 51' : '255, 255, 255'}))` 
      }
    : {};

    const languageOptionStyle = {
      marginBottom: '15px',
      padding: '10px',
      fontSize: '20px',
    };

    const selectedOptionStyle = {
      marginBottom: '15px',
      padding: '10px',
      fontSize: '20px',
      color: '#4CD964',
    };

    const checkmarkStyle = {
      marginLeft: 'auto',
      fontSize: '20px',
      color: '#4CD964', // Change the color of the checkmark as needed
    };

    const numLanguages = 23;
    const containerHeight = numLanguages * 35 + 'px';

    function languageClicked(languageCode: String) {
      navigate(`/${languageCode}`);
      toggleGlobeMenu();
    }

  return (
    <div>
      <div
        onMouseEnter={() => setGlobeMenuHovered(true)}
        onMouseLeave={() => setGlobeMenuHovered(false)}
        style={{ cursor: 'pointer', paddingRight: '30px', display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', fontSize: '24px', color: colorProps.color === 'light' ? 'white' : '#333333',
        gap: '10px' }}
        onClick={toggleGlobeMenu}
        >
          <img
          src={colorProps.color === 'light' ? globeIconWhite : globeIconGray}
          alt=""
          style={{
            width: '40px', // Set the desired width
            height: '40px', // Set the desired height
            ...iconGlowStyle
          }}
        />
        {window.innerWidth > 768 && 
        <div style={textGlowStyle}>English</div>
          }
      </div>

    {globeMenuVisible && (
      <div>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          position: 'fixed',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={toggleGlobeMenu}
      ></div>

      {window.innerWidth < 768 ? (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          backgroundColor: 'white',
          overflowY: 'auto',}}>
            
            <div      style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              gap: '20px',
            }}>
              <div style={{fontSize: '25px', color: 'black'}}>Language</div>
              <div style={{ flex: 1 }}></div>
              <span onClick={toggleGlobeMenu} style={{ cursor:'pointer', paddingRight: '50px'}}>
                  <img
                    src={xIconGray}
                    alt="Close Menu"
                    style={{
                    width: '40px', // Set the desired width
                    height: '40px', // Set the desired height
                    color: 'black'
                    }}
                />
              </span>
            </div>

            <div style={{
  flex: 1, // Take up remaining vertical space
  padding: '20px',
  minHeight: containerHeight,
  cursor: 'pointer',
}}>
    <div onClick={() => languageClicked('en')}
      style={{
      ...(languageProps.language === 'en' ? selectedOptionStyle : languageOptionStyle),
      display: 'flex',
      justifyContent: 'space-between', // Align content to space-between
    }}>
      <span>English</span>
      {languageProps.language === 'en' && <span style={checkmarkStyle}>&#10003;</span>}
    </div>

        <div onClick={() => languageClicked('da')} 
        style={{
      ...(languageProps.language === 'da' ? selectedOptionStyle : languageOptionStyle),
      display: 'flex',
      justifyContent: 'space-between', // Align content to space-between
    }}>
      <span>Dansk</span>
      {languageProps.language === 'da' && <span style={checkmarkStyle}>&#10003;</span>}
    </div>

    <div onClick={() => languageClicked('de')} style={{ 
      ...(languageProps.language === 'de' ? selectedOptionStyle : languageOptionStyle),
      display: 'flex',
      justifyContent: 'space-between', // Align content to space-between
    }}>
      <span>Deutsch</span>
      {languageProps.language === 'de' && <span style={checkmarkStyle}>&#10003;</span>}
    </div>

    <div onClick={() => languageClicked('es')} style={{
  ...(languageProps.language === 'es' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>Espanõl</span>
  {languageProps.language === 'es' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('it')} style={{
  ...(languageProps.language === 'it' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>Italiano</span>
  {languageProps.language === 'it' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('pt')} style={{
  ...(languageProps.language === 'pt' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>Português</span>
  {languageProps.language === 'pt' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('sk')} style={{
  ...(languageProps.language === 'sk' ? selectedOptionStyle : languageOptionStyle), //Slovakian
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>Slovenčina</span>
  {languageProps.language === 'sk' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('ar')} style={{
  ...(languageProps.language === 'ar' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>عربي</span>
  {languageProps.language === 'ar' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('tr')} style={{
  ...(languageProps.language === 'tr' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>Türkçe</span>
  {languageProps.language === 'tr' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('fr')} style={{
  ...(languageProps.language === 'fr' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>Français</span>
  {languageProps.language === 'fr' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('hi')} style={{
  ...(languageProps.language === 'hi' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>हिंदी</span>
  {languageProps.language === 'hi' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('zh')} style={{
  ...(languageProps.language === 'zh' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>中国人</span>
  {languageProps.language === 'zh' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('id')} style={{
  ...(languageProps.language === 'id' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>Bahasa Indonesia</span>
  {languageProps.language === 'id' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('ko')} style={{
  ...(languageProps.language === 'ko' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>한국인</span>
  {languageProps.language === 'ko' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('ja')} style={{
  ...(languageProps.language === 'ja' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>日本語</span>
  {languageProps.language === 'ja' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('ru')} style={{
  ...(languageProps.language === 'ru' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>Русский</span>
  {languageProps.language === 'ru' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('ur')} style={{
  ...(languageProps.language === 'ur' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>اردو</span>
  {languageProps.language === 'ur' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('fl')} style={{
  ...(languageProps.language === 'fl' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>Filipino</span>
  {languageProps.language === 'fl' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('mr')} style={{
  ...(languageProps.language === 'mr' ? selectedOptionStyle : languageOptionStyle), //Marathi
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>मराठी</span>
  {languageProps.language === 'mr' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('te')} style={{
  ...(languageProps.language === 'te' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>తెలుగు</span>
  {languageProps.language === 'te' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

<div onClick={() => languageClicked('ta')} style={{
  ...(languageProps.language === 'ta' ? selectedOptionStyle : languageOptionStyle), //tamil
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>தமிழ்</span>
  {languageProps.language === 'ta' && <span style={checkmarkStyle}>&#10003;</span>} 
</div>

<div onClick={() => languageClicked('vi')} style={{
  ...(languageProps.language === 'vi' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>Tiếng Việt</span>
  {languageProps.language === 'vi' && <span style={checkmarkStyle}>&#10003;</span>}
</div>

  <div onClick={() => languageClicked('sw')} style={{
  ...(languageProps.language === 'sw' ? selectedOptionStyle : languageOptionStyle),
  display: 'flex',
  justifyContent: 'space-between', // Align content to space-between
}}>
  <span>Kiswahili</span>
  {languageProps.language === 'sw' && <span style={checkmarkStyle}>&#10003;</span>}
</div>
</div>

          </div>
        ) : (

        

            <div style={{
              position: 'fixed',
              top: '450%',       // Center vertically
              left: '50%',      // Center horizontally
              transform: 'translate(-50%, -50%)', // Center it perfectly
              height: '70vh',
              width: '60vw',
              backgroundColor: 'white',
              overflowY: 'auto',
            }}>
              
              <div      style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                gap: '20px',
              }}>
                <div style={{fontSize: '25px'}}>Language</div>
                <div style={{ flex: 1 }}></div>
                <span onClick={toggleGlobeMenu} style={{ cursor:'pointer', paddingRight: '50px'}}>
                  <img
                    src={xIconGray}
                    alt="Close Menu"
                    style={{
                    width: '40px', // Set the desired width
                    height: '40px', // Set the desired height
                    color: 'black'
                    }}
                />
              </span>
              </div>
  
              <div style={{
    flex: 1, // Take up remaining vertical space
    padding: '20px',
    minHeight: containerHeight,
    cursor: 'pointer',
  }}>
      <div onClick={() => languageClicked('en')}
        style={{
        ...(languageProps.language === 'en' ? selectedOptionStyle : languageOptionStyle),
        display: 'flex',
        justifyContent: 'space-between', // Align content to space-between
      }}>
        <span>English</span>
        {languageProps.language === 'en' && <span style={checkmarkStyle}>&#10003;</span>}
      </div>
  
          <div onClick={() => languageClicked('da')} 
          style={{
        ...(languageProps.language === 'da' ? selectedOptionStyle : languageOptionStyle),
        display: 'flex',
        justifyContent: 'space-between', // Align content to space-between
      }}>
        <span>Dansk</span>
        {languageProps.language === 'da' && <span style={checkmarkStyle}>&#10003;</span>}
      </div>
  
      <div onClick={() => languageClicked('de')} style={{ 
        ...(languageProps.language === 'de' ? selectedOptionStyle : languageOptionStyle),
        display: 'flex',
        justifyContent: 'space-between', // Align content to space-between
      }}>
        <span>Deutsch</span>
        {languageProps.language === 'de' && <span style={checkmarkStyle}>&#10003;</span>}
      </div>
  
      <div onClick={() => languageClicked('es')} style={{
    ...(languageProps.language === 'es' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>Espanõl</span>
    {languageProps.language === 'es' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('it')} style={{
    ...(languageProps.language === 'it' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>Italiano</span>
    {languageProps.language === 'it' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('pt')} style={{
    ...(languageProps.language === 'pt' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>Português</span>
    {languageProps.language === 'pt' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('sk')} style={{
    ...(languageProps.language === 'sk' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>Slovenčina</span>
    {languageProps.language === 'sk' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('ar')} style={{
    ...(languageProps.language === 'ar' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>عربي</span>
    {languageProps.language === 'ar' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('tr')} style={{
    ...(languageProps.language === 'tr' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>Türkçe</span>
    {languageProps.language === 'tr' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('fr')} style={{
    ...(languageProps.language === 'fr' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>Français</span>
    {languageProps.language === 'fr' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('hi')} style={{
    ...(languageProps.language === 'hi' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>हिंदी</span>
    {languageProps.language === 'hi' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('zh')} style={{
    ...(languageProps.language === 'zh' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>中国人</span>
    {languageProps.language === 'zh' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('id')} style={{
    ...(languageProps.language === 'id' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>Bahasa Indonesia</span>
    {languageProps.language === 'id' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('ko')} style={{
    ...(languageProps.language === 'ko' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>한국인</span>
    {languageProps.language === 'ko' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('ja')} style={{
    ...(languageProps.language === 'ja' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>日本語</span>
    {languageProps.language === 'ja' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('ru')} style={{
    ...(languageProps.language === 'ru' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>Русский</span>
    {languageProps.language === 'ru' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('ur')} style={{
    ...(languageProps.language === 'ur' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>اردو</span>
    {languageProps.language === 'ur' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('fl')} style={{
    ...(languageProps.language === 'fl' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>Filipino</span>
    {languageProps.language === 'fl' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('mr')} style={{
    ...(languageProps.language === 'mr' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>मराठी</span>
    {languageProps.language === 'mr' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('te')} style={{
    ...(languageProps.language === 'te' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>తెలుగు</span>
    {languageProps.language === 'te' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('ta')} style={{
    ...(languageProps.language === 'ta' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>தமிழ்</span>
    {languageProps.language === 'ta' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
  <div onClick={() => languageClicked('vi')} style={{
    ...(languageProps.language === 'vi' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>Tiếng Việt</span>
    {languageProps.language === 'vi' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  
    <div onClick={() => languageClicked('sw')} style={{
    ...(languageProps.language === 'sw' ? selectedOptionStyle : languageOptionStyle),
    display: 'flex',
    justifyContent: 'space-between', // Align content to space-between
  }}>
    <span>Kiswahili</span>
    {languageProps.language === 'sw' && <span style={checkmarkStyle}>&#10003;</span>}
  </div>
  </div>
  
            </div>









      )}
      </div>
    )}
  
  </div>
  );
};