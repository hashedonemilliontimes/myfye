function LoadingAnimation() {
    const spinnerStyle = {
      border: '5px solid rgba(0, 0, 0, 0.1)',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      borderLeft: '5px solid black',
      animation: 'spin 1s linear infinite'
    };
  
    const animationStyle = {
      '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
      }
    };
  
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '163px' }}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={spinnerStyle}></div>
      </div>
    );
  }
  
  export default LoadingAnimation;