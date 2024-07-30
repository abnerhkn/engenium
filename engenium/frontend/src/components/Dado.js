import React from 'react';
import '../styles/Dado.css';

const Dado = ({ image, rolling, onClick }) => {
  return (
    <div className={`dado ${rolling ? 'rolling' : ''}`} onClick={onClick}>
      <img src={image} alt="dice" className="square" />
    </div>
  );
};

export default Dado;
  