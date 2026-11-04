import React from 'react';

/**
 * QuickExitButton
 * Immediately redirects the browser to a neutral page and replaces
 * history state to reduce trace logs on the device.
 */
export default function QuickExitButton() {
  const handleQuickExit = () => {
    // Clear local or session state if storing temporary victim data
    sessionStorage.clear();
    
    // Replace history entry so back button won't return to the app
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
        padding: '12px 20px',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        zIndex: 9999
      }}
    >
      ⚡ Quick Exit (Google)
    </button>
  );
}
