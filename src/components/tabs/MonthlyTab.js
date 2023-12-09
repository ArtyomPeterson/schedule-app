import React, { useState } from 'react';

function MonthlyTab({ onSave }) {
    const [time, setTime] = useState('');
    const [dayOfMonth, setDayOfMonth] = useState('');

    const handleSave = () => {
        // Создание выражения CRON 
        const cronExpression = `${time.split(':')[1]} ${time.split(':')[0]} ${dayOfMonth} * *`;
        onSave(cronExpression);
    };

    return (
        <div className='mt-4'>
            <label>
                Time:
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
            <label>
                Day of Month:
                <input type="number" value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)} />
            </label>
            <button onClick={handleSave}>Save</button>
        </div>
    );
}

export default MonthlyTab;
