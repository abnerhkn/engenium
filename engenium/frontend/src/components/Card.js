import React, { useState } from 'react';
import '../styles/Card.css';
import Button from './Button';

const Card = ({ category, question, options, answer }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleToggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="card">
      <div className="card-content">
        <h2 className="category">Categoria: {category}</h2>
        <p className="question">Pergunta: {question}</p>
        <ul className="options">
          {options.map((option, index) => (
            <li key={index} className="option">{option}</li>
          ))}
        </ul>
        <Button className="info" label={showAnswer ? "Esconder resposta" : "Ver resposta"} onClick={handleToggleAnswer} />
        {showAnswer && <p className="answer">Resposta: {answer}</p>}
      </div>
    </div>
  );
};

export default Card;
