const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Adicionar uma nova pergunta (e implicitamente uma nova categoria se não existir)
router.post('/', async (req, res) => {
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
});

// Obter todas as categorias
router.get('/categories', async (_req, res) => {
  try {
    const categories = await Question.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter todas as perguntas
router.get('/', async (_req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter uma pergunta por ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar uma pergunta
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.status(200).json({ message: 'Pergunta deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter perguntas por categoria
router.get('/category/:category', async (req, res) => {
  try {
    const questions = await Question.find({ category: req.params.category });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
