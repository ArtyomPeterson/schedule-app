import React from "react";
import DailyTab from './tabs/DailyTab/DailyTab';
import WeeklyTab from './tabs/WeeklyTab/WeeklyTab';
import MonthlyTab from './tabs/MonthlyTab/MonthlyTab';
import CustomTab from './tabs/CustomTab/CustomTab';
import './../App.css';


const  Form = ({
    onSave,
    cronDailyExpression, 
    cronWeeklyExpression, 
    cronMonthlyExpression,
    cronCustomExpression, 
    activeTab, 
    setActiveTab }) => {



    return (
        <div className="container mt-4">
            <ul className="nav nav-tabs bg-dark">
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'daily' ? 'active' : ''}`}
                        onClick={(e) => {e.preventDefault();setActiveTab('daily');}}
                        href="#" >
                        Daily
                    </a>
                </li>

                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'weekly' ? 'active' : ''}`}
                        onClick={(e) => {e.preventDefault();setActiveTab('weekly');}}
                        href="#" >
                        Weekly
                    </a>
                </li>

                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`}
                        onClick={(e) => {e.preventDefault();setActiveTab('monthly');}}
                        href="#" >
                        Monthly
                    </a>
                </li>

                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'custom' ? 'active' : ''}`}
                        onClick={(e) => {e.preventDefault();setActiveTab('custom');}}
                        href="#" >
                        Custom
                    </a>
                </li>
            </ul>

            <div className="tab-content">
                {activeTab === 'daily' && <DailyTab onSave={onSave} cronDailyExpression={cronDailyExpression}/>}
                {activeTab === 'weekly' && <WeeklyTab onSave={onSave} cronWeeklyExpression={cronWeeklyExpression}/>}
                {activeTab === 'monthly' && <MonthlyTab onSave={onSave} cronMonthlyExpression={cronMonthlyExpression}/>}
                {activeTab === 'custom' && <CustomTab onSave={onSave} cronCustomExpression={cronCustomExpression}/>}
            </div>

        </div>
    )
}
export default Form;