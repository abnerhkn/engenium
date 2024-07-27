const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/quiz-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

app.use(cors());
app.use(bodyParser.json());

const questionRoutes = require('./routes/questions');
const categoryRoutes = require('./routes/categories');
app.use('/api/questions', questionRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
