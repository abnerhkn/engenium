const Question = require('../models/Question');

// Adicionar uma nova pergunta
exports.addQuestion = async (req, res) => {
  try {
    const { category, question, options, answer } = req.body;

    const newQuestion = new Question({
      category,
      question,
      options,
      answer,
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todas as perguntas
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
