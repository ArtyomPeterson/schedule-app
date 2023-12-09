import React, { useState, useEffect } from 'react';
//import useTimeInput from './useTimeInput';

function WeeklyTab({ onSave }) {

    const [times, setTimes] = useState([{ id: 1, value: '' }]);

    const [selectedDays, setSelectedDays] = useState({
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false
    });

    const handleToggleWeekdays = () => {
        setSelectedDays({
            mon: true,
            tue: true,
            wed: true,
            thu: true,
            fri: true,
            sat: false,
            sun: false
        });
    };

    const handleToggleWeekends = () => {
        setSelectedDays({
            mon: false,
            tue: false,
            wed: false,
            thu: false,
            fri: false,
            sat: true,
            sun: true
        });
    };

    const handleToggleDay = (day) => {
        setSelectedDays((prev) => ({ ...prev, [day]: !prev[day] }));
    };

    // Функция ставит текущее время в инпут Time
    useEffect(() => {
        const getCurrentTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0'); // Добавляет 0 в начале если часы < 10
            const minutes = now.getMinutes().toString().padStart(2, '0'); // Добавляет 0 в начале если минуты < 10
            return `${hours}:${minutes}`;
        };
        setTimes([{ id: 1, value: getCurrentTime() }]);
    }, []); // Пустой массив чтобы эффект запустился только один раз

    // Добавление поля time
    const handleAddTimeField = () => {
        setTimes((prevTimes) => [
            ...prevTimes,
            { id: prevTimes.length + 1, value: '' }
        ])
    };

    // Удаление поля time
    const handleRemoveTimeField = (id) => {
        setTimes((prevTimes) => prevTimes.filter((time) => time.id !== id));
    };

    const handleTimeChange = (id, value) => {
        setTimes((prevTimes) =>
            prevTimes.map((time) => (time.id === id ? { ...time, value } : time))
        );
    };



    const handleSave = () => {
        const isValid = times.every((time) => time.value !== '');

        if (!isValid) {
            alert('Заполните все поля time.');
            return;
        }

        const areHoursEqual = times.every(
            (time) => time.value.split(':')[0] === times[0].value.split(':')[0]
        );

        const areMinutesEqual = times.every(
            (time) => time.value.split(':')[1] === times[0].value.split(':')[1]
        );

        if (!(areHoursEqual || areMinutesEqual)) {
            alert('Часы и/или минуты должны быть одинаковыми.');
            return;
        }


        let cronExpression;

        // Создание выражения CRON 
        const selectedDaysArray = Object.keys(selectedDays).filter((day) => selectedDays[day]);

        if (areMinutesEqual) {
            cronExpression = `${times[0].value.split(':')[1]} ${times.map((time) => time.value.split(':')[0]).join(',')}  * * ${selectedDaysArray.join(',')}`;
        } else if (areHoursEqual) {
            cronExpression = `${times.map((time) => time.value.split(':')[1]).join(',')} ${times[0].value.split(':')[0]} * * ${selectedDaysArray.join(',')}`;
        }
        // Исправить ошибку: при введении двух одинаковых time, в поле CRON будет повторяться значение часов (50 14,14 * * * )
        // Исправить ошибку: при невыбранных днях недели пропускается значение CRON.
        // TODO: ввести сокращение дней недели. mon,tue,wed,thu,fri должны стать mon-fri.
        onSave(cronExpression);
    };

    return (
        <div className='mt-4'>


            {/* Первое поле ввода time */}
            <div className='mb-2'>
                <label>
                    At time:
                    <input
                        type="time"
                        value={times[0].value}
                        onChange={(e) => handleTimeChange(times[0].id, e.target.value)}
                    />
                </label>

                {times.length > 1 && (
                    <button
                        className='ml-2'
                        onClick={() => handleRemoveTimeField(times[0].id)}
                    >
                        Remove
                    </button>
                )}
            </div>

            {/* Все остальные поля ввода time */}
            {times.slice(1).map((time) => (
                <div key={time.id} className='mb-2'>
                    <label>
                        and at time
                        <input
                            type="time"
                            value={time.value}
                            onChange={(e) => handleTimeChange(time.id, e.target.value)}
                        />

                        {times.length > 1 && (
                            <button
                                className='ml-2'
                                onClick={() => handleRemoveTimeField(time.id)}
                            >
                                Remove
                            </button>
                        )}
                    </label>
                </div>
            ))}

            <button className='ml-2' onClick={handleAddTimeField}>
                Add Time
            </button>

            <label>
                Days:
                <button onClick={handleToggleWeekdays} style={{ marginRight: '5px' }}>Weekdays</button>
                <button onClick={handleToggleWeekends}>Weekends</button>
                {Object.keys(selectedDays).map((day) => (
                    <label key={day}>
                        <input
                            type="checkbox"
                            checked={selectedDays[day]}
                            onChange={() => handleToggleDay(day)}
                        />
                        {day}
                    </label>
                ))}

            </label>
            <button onClick={handleSave}>Save</button>
        </div>
    );
}

export default WeeklyTab;
