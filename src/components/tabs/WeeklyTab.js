import React, { useState } from 'react';

function WeeklyTab({ onSave }) {
    const [time, setTime] = useState('');
    const [selectedDays, setSelectedDays] = useState({
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false
    });

    const handleSave = () => {
        // Создание выражения CRON 
        const selectedDaysArray = Object.keys(selectedDays).filter((day) => selectedDays[day]);
        const cronExpression = `${time.split(':')[1]} ${time.split(':')[0]} * * ${selectedDaysArray.join(',')}`;
        onSave(cronExpression);
    };

    return (
        <div className='mt-4'>
            <label>
                Time:
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
            <label>
                Days:
                {Object.keys(selectedDays).map((day) => (
                    <label key={day}>
                        {day}
                        <input
                            type="checkbox"
                            checked={selectedDays[day]}
                            onChange={() => setSelectedDays((prev) => ({ ...prev, [day]: !prev[day] }))}
                        />
                    </label>
                ))}
            </label>
            <button onClick={handleSave}>Save</button>
        </div>
    );
}

export default WeeklyTab;
