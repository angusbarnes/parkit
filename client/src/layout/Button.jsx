import React from 'react';

const RoundedButton = ({ color, onClick, label, disabled = false}) => {
  const buttonStyle = {
    backgroundColor: color,
    borderRadius: '8px', // Adjust the border-radius as needed
    padding: '10px 20px', // Adjust padding as needed
    color: '#fff', // Set text color to white, adjust as needed
    cursor: 'pointer',
    margin: '5px',
    disabled: disabled
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      {label}
    </button>
  );
};

export default RoundedButton;
