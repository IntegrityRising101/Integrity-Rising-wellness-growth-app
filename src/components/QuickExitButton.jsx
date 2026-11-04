import React from 'react';

export default function QuickExitButton() {
  const handleQuickExit = () => {
    // Clear session storage to remove any temporary data
    sessionStorage.clear();
    
    // Instantly redirect to Google and replace history so back-button won't return to the app
    window.location.replace("https://www.google.com");
  };

  return (
    <button
      onClick={handleQuickExit}
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        backgroundColor: '#d9534f',
        color: '#ffffff',
        border: 'none',
        padding: '10px 18px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 9999
      }}
    >
      Quick Exit ⚡
    </button>
  );
}
