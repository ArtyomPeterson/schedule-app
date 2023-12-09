import React from "react";
import DailyTab from './tabs/DailyTab';
import WeeklyTab from './tabs/WeeklyTab';
import MonthlyTab from './tabs/MonthlyTab';
import CustomTab from './tabs/CustomTab';

function Form({ activeTab, setActiveTab, onSave }) {
    return (
        <div>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'daily' ? 'active' : ''}`}
                        onClick={() => setActiveTab('daily')}
                        href="#" >
                        Daily
                    </a>
                </li>

                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'weekly' ? 'active' : ''}`}
                        onClick={() => setActiveTab('weekly')}
                        href="#" >
                        Weekly
                    </a>
                </li>

                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`}
                        onClick={() => setActiveTab('monthly')}
                        href="#" >
                        Monthly
                    </a>
                </li>

                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'custom' ? 'active' : ''}`}
                        onClick={() => setActiveTab('custom')}
                        href="#" >
                        Custom
                    </a>
                </li>
            </ul>

            <div className="tab-content">
                {activeTab === 'daily' && <DailyTab onSave={onSave} />}
                {activeTab === 'weekly' && <WeeklyTab onSave={onSave} />}
                {activeTab === 'monthly' && <MonthlyTab onSave={onSave} />}
                {activeTab === 'custom' && <CustomTab onSave={onSave} />}
            </div>

        </div>
    )
}
export default Form;