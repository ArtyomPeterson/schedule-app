import './App.css';
import React, { useState } from 'react';
import Header from './components/layout/Header';
import Form from './components/Form';
import Output from './components/Output';
import { selectTab } from './utils/tabSelector';





function App() { 

  const [cronDailyExpression, setCronDailyExpression] = useState({
    minutes: [],
    hours:[],
    days:[],
    months:[],
    daysOfWeek:[]
  });

  const [cronWeeklyExpression, setCronWeeklyExpression] = useState({
    minutes: [],
    hours:[],
    days:[],
    months:[],
    daysOfWeek:[]
  });

  const [cronMonthlyExpression, setCronMonthlyCronExpression] = useState({
    minutes: [],
    hours:[],
    days:[],
    months:[],
    daysOfWeek:[]
  });

  const [cronCustomExpression, setCronCustomExpression] = useState({
    minutes: [],
    hours:[],
    days:[],
    months:[],
    daysOfWeek:[]
  });

  // Это состояние Output
  const [cronExpression, setCronExpression] = useState({
    minutes: [],
    hours:[],
    days:[],
    months:[],
    daysOfWeek:[]
  });

  const [activeTab, setActiveTab] = useState('daily');



  const handleSave = (newCronExpression) => {
    setCronExpression(newCronExpression);
    
  };

  
  const handleLoad = (newCronExpression) => {
    const selectedTab = selectTab(newCronExpression)
    setActiveTab(selectedTab);
    if (selectedTab==='daily') {
      setCronDailyExpression(newCronExpression);
    }
    if (selectedTab==='weekly') {
      setCronWeeklyExpression(newCronExpression);
    }
    if (selectedTab==='monthly') {
      setCronMonthlyCronExpression(newCronExpression);
    }
    if (selectedTab==='custom') {
      setCronCustomExpression(newCronExpression);
    }
    console.log(selectedTab);
    

  };


  return (
    <div>
      <Header />
      <Form   
      onSave={handleSave} 
      cronDailyExpression={cronDailyExpression}
      cronWeeklyExpression={cronWeeklyExpression}
      cronMonthlyExpression={cronMonthlyExpression}
      cronCustomExpression={cronCustomExpression}
      activeTab={activeTab} 
      setActiveTab={setActiveTab} />
      
      <Output onLoad={handleLoad} 
      cronExpression={cronExpression} />
    </div>

  );
}

export default App;
