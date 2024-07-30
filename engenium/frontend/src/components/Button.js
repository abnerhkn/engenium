import React from 'react';
import '../styles/Button.css';

const Button = ({ onClick, label, className = '' }) => {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
