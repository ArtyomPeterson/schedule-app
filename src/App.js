import './App.css';
import React, { useState } from 'react';
import Header from './components/Header';
import Form from './components/Form';
import Output from './components/Output';

function App() {

  const [activeTab, setActiveTab] = useState('daily');
  const [cronExpression, setCronExpression] = useState('');

  const handleSave = (expression) => {
    console.log("вызван handleSave в App.js " + expression);
    setCronExpression(expression);
    console.log("состояние cronExpression изменено на " + expression);
  };

  const handleLoad = (expression) => {
    console.log("вызван handleLoad в App.js " + expression);
    setCronExpression(expression);
    console.log("состояние cronExpression изменено на " + expression);
    setActiveTab('custom');
  };


  return (
    <div>
      <Header />
      <Form activeTab={activeTab} setActiveTab={setActiveTab} onSave={handleSave} cronExpression={cronExpression} />
      <hr />
      <Output cronExpression={cronExpression} onLoad={handleLoad} />
    </div>
    // TODO добавить поле с логами. Типа истории ввода
    // Вывести стили в отдельные файлы
  );
}

export default App;
