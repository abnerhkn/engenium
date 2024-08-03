import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/App.css";
import Card from "./components/Card";
import Card2 from "./pages/Card2";
import Button from "./components/Button";
import { FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import Dado from "./components/Dado";
import diceSound from "./assets/dice-sound.mp3";
import logo from "./assets/logo.png";
import { IoAddOutline } from "react-icons/io5";
import Modal from "react-modal";

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

const customStyles = {
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    height: "30vh",
    width: "50vh",
    gap: "20px",
    borderRadius: "20px",
    border: "none",
    boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
};

Modal.setAppElement("#root");

const App = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({
    casa1: "",
    casa2: "",
    casa3: "",
    casa4: "",
  });
  const [isConfirmed, setIsConfirmed] = useState({
    casa1: false,
    casa2: false,
    casa3: false,
    casa4: false,
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
  const [teamCount, setTeamCount] = useState(0);
  const [teamNames, setTeamNames] = useState([]);
  const [showTeamSelection, setShowTeamSelection] = useState(true);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [teamPoints, setTeamPoints] = useState([]);
  const [showCategoryCard, setShowCategoryCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rolledPoints, setRolledPoints] = useState(0);
  const [isQuestionActive, setIsQuestionActive] = useState(false);
  const [teamCategoryCorrectCount, setTeamCategoryCorrectCount] = useState([]);
  const [teamDisabledCategories, setTeamDisabledCategories] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [winnerModalIsOpen, setWinnerModalIsOpen] = useState(false);
  const [marketModalIsOpen, setMarketModalIsOpen] = useState(false);
  const [categoryCompletedByTeam, setCategoryCompletedByTeam] = useState("");
  const [frozenTeams, setFrozenTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [pointsToDeduct, setPointsToDeduct] = useState("");
  const [marketErrorMessage, setMarketErrorMessage] = useState("");

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
      setShowCategoryCard(false);
    }
  }, [questions]);

  useEffect(() => {
    const savedPoints = JSON.parse(localStorage.getItem("teamPoints"));
    const savedCorrectCounts = JSON.parse(
      localStorage.getItem("teamCategoryCorrectCount")
    );
    const savedNames = JSON.parse(localStorage.getItem("teamNames"));
    const savedCount = JSON.parse(localStorage.getItem("teamCount"));
    const savedDisabledCategories = JSON.parse(
      localStorage.getItem("teamDisabledCategories")
    );
    const savedFrozenTeams = JSON.parse(localStorage.getItem("frozenTeams"));

    if (savedPoints) setTeamPoints(savedPoints);
    if (savedCorrectCounts) setTeamCategoryCorrectCount(savedCorrectCounts);
    if (savedNames) setTeamNames(savedNames);
    if (savedCount) setTeamCount(savedCount);
    if (savedDisabledCategories)
      setTeamDisabledCategories(savedDisabledCategories);
    if (savedFrozenTeams) setFrozenTeams(savedFrozenTeams);
  }, []);

  useEffect(() => {
    if (teamPoints.length > 0) {
      localStorage.setItem("teamPoints", JSON.stringify(teamPoints));
    }
    if (teamCategoryCorrectCount.length > 0) {
      localStorage.setItem(
        "teamCategoryCorrectCount",
        JSON.stringify(teamCategoryCorrectCount)
      );
    }
    if (teamNames.length > 0) {
      localStorage.setItem("teamNames", JSON.stringify(teamNames));
    }
    localStorage.setItem("teamCount", JSON.stringify(teamCount));
    localStorage.setItem(
      "teamDisabledCategories",
      JSON.stringify(teamDisabledCategories)
    );
    localStorage.setItem("frozenTeams", JSON.stringify(frozenTeams));
  }, [
    teamPoints,
    teamCategoryCorrectCount,
    teamNames,
    teamCount,
    teamDisabledCategories,
    frozenTeams,
  ]);

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
    if (shuffledQuestions.length === 0 || isQuestionActive) return;

    let nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= shuffledQuestions.length) {
      shuffleQuestions(questions);
      nextIndex = 0;
    }

    while (
      answeredQuestions.has(shuffledQuestions[nextIndex]?.question) ||
      teamDisabledCategories[currentTeamIndex]?.includes(
        shuffledQuestions[nextIndex]?.category
      )
    ) {
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

    rollBothDice();
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
      setRolledPoints(sum);
      setShowCategoryCard(true); // Mostrar a carta da categoria
      setIsQuestionActive(true); // Desativar o botão "Gerar pergunta"
    }, 1000);
  };

  const handleCheckAnswer = (isCorrect) => {
    const currentCategory = shuffledQuestions[currentQuestionIndex]?.category;
    if (isCorrect) {
      setTeamPoints((prevPoints) => {
        const newPoints = [...prevPoints];
        newPoints[currentTeamIndex] += rolledPoints;
        return newPoints;
      });

      const teamCorrectCountsKey = `teamCategoryCorrectCount_${currentTeamIndex}`;
      const teamCorrectCounts =
        JSON.parse(localStorage.getItem(teamCorrectCountsKey)) || {};
      const updatedCorrectCounts = { ...teamCorrectCounts };

      if (!updatedCorrectCounts[currentCategory]) {
        updatedCorrectCounts[currentCategory] = 0;
      }

      updatedCorrectCounts[currentCategory] += 1;
      localStorage.setItem(
        teamCorrectCountsKey,
        JSON.stringify(updatedCorrectCounts)
      );

      setTeamCategoryCorrectCount((prevCounts) => {
        const newCounts = [...prevCounts];
        newCounts[currentTeamIndex] = updatedCorrectCounts;
        return newCounts;
      });

      if (updatedCorrectCounts[currentCategory] >= 4) {
        // Desabilita a categoria se o time acertar 4 perguntas
        const newDisabledCategories = [...teamDisabledCategories];
        if (!newDisabledCategories[currentTeamIndex]) {
          newDisabledCategories[currentTeamIndex] = [];
        }
        newDisabledCategories[currentTeamIndex].push(currentCategory);
        setTeamDisabledCategories(newDisabledCategories);
        setCategoryCompletedByTeam(currentCategory);
        setModalIsOpen(true);
      }

      // Verifica se todas as categorias foram completadas pelo time
      const allCategoriesCompleted = Object.values(updatedCorrectCounts).every(
        (count) => count >= 4
      );
      if (allCategoriesCompleted) {
        setWinnerModalIsOpen(true);
      }
    }

    setShowCategoryCard(false);
    setResultMessage("");
    setIsQuestionActive(false);
    const nextTeamIndex = (currentTeamIndex + 1) % teamCount;
    setCurrentTeamIndex(nextTeamIndex);
  };

  const restartGame = () => {
    resetGame();
    setShowTeamSelection(true);
  };

  const resetGame = () => {
    setSelectedCategories({
      casa1: "",
      casa2: "",
      casa3: "",
      casa4: "",
    });
    setIsConfirmed({
      casa1: false,
      casa2: false,
      casa3: false,
      casa4: false,
    });
    setQuestions([]);
    setShuffledQuestions([]);
    setCurrentQuestionIndex(0);
    setDice1(1);
    setDice2(1);
    setRolling(false);
    setResultMessage("");
    setAnsweredQuestions(new Set());
    setCurrentTeamIndex(0);
    setTeamPoints(Array(teamCount).fill(0));
    setShowCategoryCard(false);
    setTeamCategoryCorrectCount([]);
    setTeamDisabledCategories([]);
    setFrozenTeams([]);
    setModalIsOpen(false);
    setWinnerModalIsOpen(false);
    localStorage.clear();
  };

  const handleTeamCountChange = (e) => {
    const count = parseInt(e.target.value);
    setTeamCount(count);
    setTeamNames(Array(count).fill(""));
    setTeamPoints(Array(count).fill(0));
    setTeamCategoryCorrectCount(Array(count).fill({}));
    setTeamDisabledCategories([]);
    setFrozenTeams([]);
    localStorage.clear();
  };

  const handleTeamNameChange = (e, index) => {
    const names = [...teamNames];
    names[index] = e.target.value;
    setTeamNames(names);
  };

  const handleStartGame = () => {
    if (teamCount === 0) {
      setErrorMessage("Por favor, selecione o número de times.");
    } else if (teamNames.some((name) => name.trim() === "")) {
      setErrorMessage("Por favor, insira os nomes de todos os times.");
    } else {
      setErrorMessage("");
      resetGame();
      setShowTeamSelection(false);
    }
  };

  const handleLogoClick = () => {
    restartGame();
  };

  const getAvailableCategories = (currentCasa) => {
    const usedCategories = Object.keys(selectedCategories)
      .filter((casa) => casa !== currentCasa && selectedCategories[casa])
      .map((casa) => selectedCategories[casa]);
    return categories.filter(
      (category) =>
        !usedCategories.includes(category.name) &&
        !(
          teamDisabledCategories[currentTeamIndex] &&
          teamDisabledCategories[currentTeamIndex].includes(category.name)
        )
    );
  };

  const handleMarketAction = () => {
    if (!pointsToDeduct || isNaN(pointsToDeduct)) {
      setMarketErrorMessage("Digite um valor válido");
      return;
    }

    const teamIndex = teamNames.indexOf(selectedTeam);
    if (teamIndex >= 0) {
      setTeamPoints((prevPoints) => {
        const newPoints = [...prevPoints];
        newPoints[teamIndex] -= parseInt(pointsToDeduct);
        return newPoints;
      });
    }
    setMarketModalIsOpen(false);
    setMarketErrorMessage("");
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <div className="body">
      {showTeamSelection ? (
        <div className="team-selection-container">
          <div className="team-selection">
            <img
              src={logo}
              alt="logo"
              className="logo"
              onClick={handleLogoClick}
            />
            <h1>Quantos times irão jogar?</h1>
            <select value={teamCount} onChange={handleTeamCountChange}>
              <option value={0}>Selecione</option>
              {[1, 2, 3, 4].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
            {teamCount > 0 && (
              <div className="team-names">
                {Array.from({ length: teamCount }).map((_, index) => (
                  <div key={index}>
                    <label>Nome do time {index + 1}: </label>
                    <input
                      type="text"
                      value={teamNames[index]}
                      onChange={(e) => handleTeamNameChange(e, index)}
                    />
                  </div>
                ))}
              </div>
            )}
            <Button
              className="info"
              label={"Iniciar Jogo"}
              onClick={handleStartGame}
            />
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </div>
        </div>
      ) : (
        <div className="app-content">
          <div className="header">
            <img
              src={logo}
              alt="logo"
              className="logo"
              onClick={handleLogoClick}
            />
            {!showCard2 && (
              <Button
                className="info"
                label={"Gerar pergunta"}
                onClick={handleNextQuestion}
                disabled={
                  isQuestionActive || frozenTeams.includes(currentTeamIndex)
                }
                style={{
                  backgroundColor:
                    isQuestionActive || frozenTeams.includes(currentTeamIndex)
                      ? "gray"
                      : "initial",
                }}
              />
            )}
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
                <div className="column category-column">
                  {["casa1", "casa2", "casa3", "casa4"].map((casa, index) => (
                    <div key={index} className="category-select-container">
                      <select
                        className={`category-select ${
                          selectedCategories[casa] ? "" : ""
                        }`}
                        value={selectedCategories[casa]}
                        onChange={(e) => handleCategoryChange(e, casa)}
                        disabled={isConfirmed[casa]}
                      >
                        <option value="">
                          Selecione a categoria para {`Casa ${index + 1}`}
                        </option>
                        {getAvailableCategories(casa).map((category) => (
                          <option key={category.name} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <div className="buttons">
                        <button
                          className="icon-button"
                          onClick={() => handleConfirm(casa)}
                          disabled={
                            isConfirmed[casa] || !selectedCategories[casa]
                          }
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
                <div className="column card-column">
                  {showCategoryCard && currentQuestion && (
                    <div className="card-with-dice">
                      <Card
                        category={currentQuestion.category}
                        question={currentQuestion.question}
                        options={currentQuestion.options}
                        answer={currentQuestion.answer}
                      />
                      <div className="answer-buttons">
                        <button
                          className="icon-button correct"
                          onClick={() => handleCheckAnswer(true)}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="icon-button wrong"
                          onClick={() => handleCheckAnswer(false)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  )}
                  {resultMessage && (
                    <div className="result-message">{resultMessage}</div>
                  )}
                </div>
                <div className="column dice-column">
                  <div className="turn-info">
                    <h2>Vez do time {teamNames[currentTeamIndex]}</h2>
                    <p>
                      Próxima rodada:{" "}
                      {teamNames[(currentTeamIndex + 1) % teamCount]}
                    </p>
                  </div>
                  <div className="dice-container">
                    <Dado image={diceassets[dice1 - 1]} rolling={rolling} />
                    <IoAddOutline />
                    <Dado image={diceassets[dice2 - 1]} rolling={rolling} />
                  </div>
                  <div className="points-table">
                    <h2>Pontuação dos Times</h2>
                    <table>
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Pontos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamNames.map((name, index) => (
                          <tr
                            key={index}
                            className={
                              currentTeamIndex === index ? "current-team" : ""
                            }
                          >
                            <td>{name}</td>
                            <td>{teamPoints[index]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button
                    className="info"
                    label={"Mercado de ações"}
                    onClick={() => {
                      setSelectedTeam("");
                      setPointsToDeduct("");
                      setMarketModalIsOpen(true);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            style={customStyles}
          >
            <h2>Parabéns!</h2>
            <p>
              Você completou a categoria "{categoryCompletedByTeam}". Você
              ganhou o direito de congelar um time por uma rodada.
            </p>
            <button onClick={() => setModalIsOpen(false)}>Fechar</button>
          </Modal>
          <Modal
            isOpen={winnerModalIsOpen}
            onRequestClose={restartGame}
            style={customStyles}
          >
            <h2>Parabéns {teamNames[currentTeamIndex]}!</h2>
            <p>Você foi o vencedor da rodada! Comemore com seu time ;)</p>
            <button onClick={handleStartGame}>Reiniciar Jogo</button>
          </Modal>
          <Modal
            isOpen={marketModalIsOpen}
            onRequestClose={() => setMarketModalIsOpen(false)}
            style={customStyles}
          >
            <h1>Mercado de Ações</h1>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="">Selecione um time</option>
              {teamNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <textarea
              value={pointsToDeduct}
              onChange={(e) => {
                const value = e.target.value;
                if (!isNaN(value)) {
                  setPointsToDeduct(value);
                }
              }}
              placeholder="Digite a pontuação a ser descontada"
              rows={1}
            />

            <button onClick={handleMarketAction}>Salvar</button>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default App;
