import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState } from 'react';
import Header from './components/Header';
import Form from './components/Form';
import Output from './components/Output';

function App() {

  const [activeTab, setActiveTab] = useState('daily');
  const [cronExpression, setCronExpression] = useState('');

  const handleSave = (expression) => {
    setCronExpression(expression);
  };

  const handleLoad = (expression) => {
    setCronExpression(expression);
  };


  return (
    <div className='container'>
      <Header />
      <Form activeTab={activeTab} setActiveTab={setActiveTab} onSave={handleSave} />
      <hr />
      <Output cronExpression={cronExpression} onLoad={handleLoad} />
    </div>
    // TODO добавить поле с логами. Типа истории ввода
    // Вывести стили в отдельные файлы
  );
}

export default App;
