import './App.css';
import React, { useState } from 'react';
import Header from './components/Header';
import Form from './components/Form';
import Output from './components/Output';

function App() {

  const [activeTab, setActiveTab] = useState('daily');
  const [cronExpression, setCronExpression] = useState('');

  const handleSave = (expression) => {
    console.log(expression);
    setCronExpression(expression);
  };

  const handleLoad = (expression) => {
    console.log(expression);
    setCronExpression(expression);
  };

  const handleInputChange = (expression) => {
    // Обновление cronExpression при вводе из Output
    setCronExpression(expression);
  };

  return (
    <div>
      <Header />
      <Form activeTab={activeTab} setActiveTab={setActiveTab} onSave={handleSave} />
      <hr />
      <Output cronExpression={cronExpression} onLoad={handleLoad} onInputChange={handleInputChange} />
    </div>
    // TODO добавить поле с логами. Типа истории ввода
    // Вывести стили в отдельные файлы
  );
}

export default App;
