import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const NewUserPreviousBalanceNotification = () => {
  const newUserHasABalance = useSelector((state: any) => state.userWalletData.newUserHasPreviousBalance);
  const [opacity, setOpacity] = useState(0);
  const [visible, setVisible] = useState(false);
  const [triggered, setTriggered] = useState(false);  // To capture the first trigger

  useEffect(() => {
    let timerFadeIn: ReturnType<typeof setTimeout>;
    let timerFadeOut: ReturnType<typeof setTimeout>;

    if (triggered) {
      setTriggered(true); // Capture the first trigger
      setVisible(true); // Ensure the element is visible first without opacity

      // Fade in
      timerFadeIn = setTimeout(() => {
        setOpacity(1);
      }, 10); // Small delay to ensure CSS applies with transition

      // Stay at full opacity for 3 seconds, then start fading out
      timerFadeOut = setTimeout(() => {
        setOpacity(0);

        // After fade out, hide the element to prevent interaction
        setTimeout(() => {
          setVisible(false);
          setTriggered(false); // Reset the trigger for the next possible activation
        }, 1000); // Wait for fade-out to complete
      }, 4000); // 1 second to fade in + 3 seconds visible
    } else if (!newUserHasABalance && triggered) {
      // If toggled off but was triggered, continue the notification
      setOpacity(0);
      setTimeout(() => {
        setVisible(false);
        setTriggered(false);
      }, 1000); // Ensure fade out and clean up
    }

    return () => {
      clearTimeout(timerFadeIn);
      clearTimeout(timerFadeOut);
    };
  }, [triggered]);

  useEffect(() => {
    if (newUserHasABalance) {
        setTriggered(true)
    }
  }, [newUserHasABalance]);

  if (!visible) {
    return null;
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: opacity,
      transition: 'opacity 1s ease-in-out',
      backgroundColor: '#90ee90',
      color: '#00000',
      padding: '10px',
      borderRadius: '5px',
      margin: '10px 0',
    }}>
      Found a balance that someone 
      <br/>
      has already sent to you
      <br/>
      <br/>
    Sending it now!
    </div>
  );
};

export default NewUserPreviousBalanceNotification;
