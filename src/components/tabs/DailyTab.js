import React, { useState, useEffect } from 'react';

function DailyTab({ onSave }) {
    const [time, setTime] = useState('');
    const [useStep, setUseStep] = useState(false);

    // Функция ставит текущее время в инпут Time
    useEffect(() => {
        const getCurrentTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0'); // Добавляет 0 в начале если часы < 10
            const minutes = now.getMinutes().toString().padStart(2, '0'); // Добавляет 0 в начале если минуты < 10
            return `${hours}:${minutes}`;
        };
        setTime(getCurrentTime());
    }, []); // Пустой мпссив чтобы эфект запустился только один раз


    const handleSave = () => {
        let cronExpression;

        // Создание выражения CRON 
        if (useStep) {
            cronExpression = `*/${time} * * * *`
        } else {
            cronExpression = `${time.split(':')[1]} ${time.split(':')[0]} * * *`;
        }

        onSave(cronExpression);
    };

    return (
        <div className='mt-4'>
            <label>
                Time:
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
            <br />
            <button className="mt-2" onClick={handleSave}>Save</button>
        </div>
        //TODO добавить вариант ввода step минут
    );
}

export default DailyTab;
