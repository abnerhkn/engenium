import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/App.css";
import Card from "./components/Card";
import Card2 from "./pages/Card2";
import Button from "./components/Button";
import { FaDice, FaCheck, FaTrash } from "react-icons/fa";
import Dado from "./components/Dado";
import diceSound from "./assets/dice-sound.mp3";
import logo from "./assets/logo.png";
import { IoAddOutline } from "react-icons/io5";

import DiceImage1 from "./assets/Dice1.png";
import DiceImage2 from "./assets/Dice2.png";
import DiceImage3 from "./assets/Dice3.png";
import DiceImage4 from "./assets/Dice4.png";
import DiceImage5 from "./assets/Dice5.png";
import DiceImage6 from "./assets/Dice6.png";

const diceassets = [
  DiceImage1,
  DiceImage2,
  DiceImage3,
  DiceImage4,
  DiceImage5,
  DiceImage6,
];

const App = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const savedCategories = localStorage.getItem("selectedCategories");
    return savedCategories
      ? JSON.parse(savedCategories)
      : { casa1: "", casa2: "", casa3: "", casa4: "" };
  });
  const [isConfirmed, setIsConfirmed] = useState(() => {
    const savedIsConfirmed = localStorage.getItem("isConfirmed");
    return savedIsConfirmed
      ? JSON.parse(savedIsConfirmed)
      : { casa1: false, casa2: false, casa3: false, casa4: false };
  });
  const [questions, setQuestions] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCard2, setShowCard2] = useState(false);
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);

  useEffect(() => {
    const selected = Object.values(selectedCategories).filter(Boolean);
    if (selected.length > 0) {
      fetchQuestionsByCategories(selected);
    }
  }, [selectedCategories]);

  useEffect(() => {
    if (questions.length > 0) {
      shuffleQuestions(questions);
      setCurrentQuestionIndex(0);
      setAnsweredQuestions(new Set());
    }
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(selectedCategories)
    );
  }, [selectedCategories]);

  useEffect(() => {
    localStorage.setItem("isConfirmed", JSON.stringify(isConfirmed));
  }, [isConfirmed]);

  const fetchQuestionsByCategories = (categories) => {
    const promises = categories.map((category) =>
      axios.get(`http://localhost:3000/api/questions/category/${category}`)
    );
    Promise.all(promises)
      .then((responses) => {
        const allQuestions = responses.flatMap((response) => response.data);
        setQuestions(allQuestions);
      })
      .catch((error) => {
        console.error("There was an error fetching the questions!", error);
      });
  };

  const shuffleQuestions = (questions) => {
    let shuffled = questions.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledQuestions(shuffled);
  };

  const handleCategoryChange = (e, casa) => {
    const category = e.target.value;
    setSelectedCategories((prevState) => ({
      ...prevState,
      [casa]: category,
    }));
  };

  const handleConfirm = (casa) => {
    setIsConfirmed((prevState) => ({
      ...prevState,
      [casa]: true,
    }));
  };

  const handleClear = (casa) => {
    setSelectedCategories((prevState) => ({
      ...prevState,
      [casa]: "",
    }));
    setIsConfirmed((prevState) => ({
      ...prevState,
      [casa]: false,
    }));
  };

  const handleNextQuestion = () => {
    if (shuffledQuestions.length === 0) return;

    let nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= shuffledQuestions.length) {
      shuffleQuestions(questions);
      nextIndex = 0;
    }

    while (answeredQuestions.has(shuffledQuestions[nextIndex]?.question)) {
      nextIndex++;
      if (nextIndex >= shuffledQuestions.length) {
        shuffleQuestions(questions);
        nextIndex = 0;
      }
    }

    setCurrentQuestionIndex(nextIndex);
    setAnsweredQuestions((prevSet) =>
      new Set(prevSet).add(shuffledQuestions[nextIndex]?.question)
    );
  };

  const rollBothDice = () => {
    setRolling(true);
    const audio = new Audio(diceSound);
    audio.play();
    setTimeout(() => {
      const newDice1 = Math.floor(Math.random() * 6) + 1;
      const newDice2 = Math.floor(Math.random() * 6) + 1;
      setDice1(newDice1);
      setDice2(newDice2);
      setRolling(false);

      const sum = newDice1 + newDice2;
      setResultMessage(`Esta pergunta vale ${sum} pontos.`);
    }, 1000);
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const getAvailableCategories = (currentCasa) => {
    const usedCategories = Object.keys(selectedCategories)
      .filter((casa) => casa !== currentCasa && selectedCategories[casa])
      .map((casa) => selectedCategories[casa]);
    return categories.filter(
      (category) => !usedCategories.includes(category.name)
    );
  };

  return (
    <div className="body">
      <div className="header">
        <img src={logo} alt="logo" className="logo" />
        <FaDice className="dice-icon" onClick={handleNextQuestion} />
        <Button
          className="info"
          label={showCard2 ? "Voltar" : "Cadastrar Pergunta"}
          onClick={() => setShowCard2(!showCard2)}
        />
      </div>
      <div className="container">
        {showCard2 ? (
          <div className="center">
            <Card2 />
          </div>
        ) : (
          <div className="main-content">
            <div className="category-selects">
              {["casa1", "casa2", "casa3", "casa4"].map((casa, index) => (
                <div key={index} className="category-select-container">
                  <select
                    className="category-select"
                    value={selectedCategories[casa]}
                    onChange={(e) => handleCategoryChange(e, casa)}
                    disabled={isConfirmed[casa]}
                  >
                    <option value="">
                      Selecione a categoria para {`Casa ${index + 1}`}
                    </option>
                    {getAvailableCategories(casa).map((category, index) => (
                      <option key={index} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="buttons">
                    <button
                      className="icon-button"
                      onClick={() => handleConfirm(casa)}
                      disabled={isConfirmed[casa] || !selectedCategories[casa]}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="icon-button"
                      onClick={() => handleClear(casa)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="center">
              <div className="dice-container">
                <Dado
                  image={diceassets[dice1 - 1]}
                  rolling={rolling}
                  onClick={rollBothDice}
                />
                <IoAddOutline />
                <Dado
                  image={diceassets[dice2 - 1]}
                  rolling={rolling}
                  onClick={rollBothDice}
                />
              </div>
              {currentQuestion && (
                <div className="card-with-dice">
                  <Card
                    category={currentQuestion.category}
                    question={currentQuestion.question}
                    options={currentQuestion.options}
                    answer={currentQuestion.answer}
                  />
                </div>
              )}
              {resultMessage && (
                <div className="result-message">{resultMessage}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
