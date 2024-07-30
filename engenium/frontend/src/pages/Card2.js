import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Card2.css';
import Button from '../components/Button';
import Modal from '../components/Modal';

function App() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    question: '',
    options: ['', ''],
    answer: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [questionId, setQuestionId] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch categories from the backend
    axios.get('http://localhost:3000/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
      });
  }, []);

  const validateForm = () => {
    let formErrors = {};
    if (!formData.category) formErrors.category = true;
    if (!formData.question) formErrors.question = true;

    const filledOptions = formData.options.filter(option => option.trim() !== '');
    if (filledOptions.length < 2) {
      formErrors.options = 'Você deve fornecer pelo menos duas opções.';
    }

    if (!formData.answer) formErrors.answer = true;
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    axios.post('http://localhost:3000/api/questions', formData)
      .then(response => {
        console.log('Question added:', response.data);
        setSuccessMessage('Pergunta cadastrada com sucesso!');
        setQuestionId(response.data._id);
        setIsModalOpen(true);
        setFormData({
          category: '',
          question: '',
          options: ['', '', '', ''],
          answer: ''
        });
        setErrors({});
      })
      .catch(error => {
        console.error('There was an error adding the question!', error);
      });
  };

  const handleDelete = () => {
    if (questionId) {
      axios.delete(`http://localhost:3000/api/questions/${questionId}`)
        .then(response => {
          console.log('Question deleted:', response.data);
          setSuccessMessage('Pergunta excluída com sucesso!');
          setQuestionId(null);
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error('There was an error deleting the question!', error);
        });
    }
  };

  const handleSearchById = (e) => {
    e.preventDefault();
    if (!searchId) {
      setErrors({ searchId: true });
      return;
    }
    axios.get(`http://localhost:3000/api/questions/${searchId}`)
      .then(response => {
        setFormData({
          category: response.data.category,
          question: response.data.question,
          options: response.data.options,
          answer: response.data.answer
        });
        setQuestionId(response.data._id);
        setErrors({});
      })
      .catch(error => {
        console.error('There was an error fetching the question by ID!', error);
      });
  };

  const handleAddOption = () => {
    if (formData.options.length < 4) {
      setFormData({
        ...formData,
        options: [...formData.options, '']
      });
    }
  };

  const handleRemoveOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        options: newOptions
      });
    }
  };

  const handleClearFields = () => {
    setFormData({
      category: '',
      question: '',
      options: ['', '', '', ''],
      answer: ''
    });
    setErrors({});
  };

  return (
    <div className="cntn">
      <div className='cntn-content'>
        <form onSubmit={handleSubmit}>
          <label>Buscar por ID:</label>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className={errors.searchId ? 'error-border' : ''}
          />
          <Button className="info" label="Buscar" onClick={handleSearchById} />
          <label>Categoria:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'error-border' : ''}
          >
            <option value="">Selecione a categoria</option>
            {categories.length > 0 && categories.map((category, index) => (
              <option key={index} value={category.name}>{category.name}</option>
            ))}
          </select>
          <label>Questão:</label>
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            className={errors.question ? 'error-border' : ''}
          />
          <div className="options-container">
            {formData.options.map((option, index) => (
              <div key={index} className="option-item">
                <label>{`Opção ${index + 1}`}</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className={errors[`option${index}`] ? 'error-border' : ''}
                />
                {formData.options.length > 2 && (
                  <Button className="info" label={"Remover"} onClick={() => handleRemoveOption(index)}/>
                )}
              </div>
            ))}
            {formData.options.length < 4 && (
              <Button className="info" label={"Adicionar Opção"} onClick={handleAddOption}/>
            )}
          </div>
          {errors.options && <p className="error-message">{errors.options}</p>}
          <label>Resposta:</label>
          <input
            type="text"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            className={errors.answer ? 'error-border' : ''}
          />
          <div className="button-group">
            <Button className="info" type="submit" label="Cadastrar" />
            <Button className="info" type="button" label="Limpar" onClick={handleClearFields} />
          </div>
        </form>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDelete}
      >
        {successMessage} {questionId && `ID: ${questionId}`}
      </Modal>
    </div>
  );
}

export default App;
