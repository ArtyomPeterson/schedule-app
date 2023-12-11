import React, { useState, useEffect } from 'react';
import '../../App.css';


const dayOfWeekNames = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday'
};

function WeeklyTab({ onSave }) {
    const [times, setTimes] = useState([{ id: 1, value: '' }]);
    const [selectedDays, setSelectedDays] = useState(
        Object.keys(dayOfWeekNames).reduce((acc, day) => {
            acc[day] = false;
            return acc;
        }, {})
    );

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
            { id: prevTimes[prevTimes.length - 1].id + 1, value: '' }
        ])
    };
    // Удаление поля time
    const handleRemoveTimeField = (id) => {
        setTimes((prevTimes) => prevTimes.filter((time) => time.id !== id));
    };
    // Изменение поля time
    const handleTimeChange = (id, value) => {
        setTimes((prevTimes) =>
            prevTimes.map((time) => (time.id === id ? { ...time, value } : time))
        );
    };
    // Кнопка будни
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
    // Кнопка выходные
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
    // Изменение списка дней
    const handleToggleDay = (day) => {
        setSelectedDays((prev) => ({
            ...prev,
            [day]: !prev[day]
        }));
    };






    const handleSave = () => {
        // Проверка на отсутствие пустых полей time
        if (!(times.every((time) => time.value !== ''))) {
            alert('Значение Time не должно быть пустым.');
            return;
        }
        // Проверка на отсутствие дубликатов
        const uniqueValues = Array.from(new Set(times.map((time) => time.value)));
        if (uniqueValues.length !== times.length) {
            alert('Значения Times не должны повторяться.');
            return;
        }
        // Проверка на наличие одинаковых часов или минут
        const areHoursEqual = times.every(
            (time) => time.value.split(':')[0] === times[0].value.split(':')[0]
        );
        const areMinutesEqual = times.every(
            (time) => time.value.split(':')[1] === times[0].value.split(':')[1]
        );
        if (!(areHoursEqual || areMinutesEqual)) {
            alert('Часы или минуты должны быть одинаковыми. Для тонкой настройки используйте вкладку Custom.');
            return;
        }

        // Проверка на выделение хотя бы одного дня недели
        if (!Object.values(selectedDays).some((value) => value)) {
            alert('Выберите хотя бы один день недели.');
            return;
        }

        // Создание выражения CRON 
        let cronExpression;

        const selectedDaysArray = Object.keys(selectedDays)
            .filter((day) => selectedDays[day]);

        if (areMinutesEqual) {
            cronExpression = `${times[0].value.split(':')[1]} ${times.map((time) => time.value.split(':')[0]).join(',')} * * ${selectedDaysArray.join(',')}`;
        } else if (areHoursEqual) {
            cronExpression = `${times.map((time) => time.value.split(':')[1]).join(',')} ${times[0].value.split(':')[0]} * * ${selectedDaysArray.join(',')}`;
        } else {
            alert('Что-то пошло не так.');
            return;
        }
        onSave(cronExpression);

        // Исправить ошибку: при невыбранных днях недели пропускается значение CRON.
        // TODO: ввести сокращение дней недели. mon,tue,wed,thu,fri должны стать mon-fri.
    };

    return (
        <div className='tab-container'>

            <label className='tab-label'>
                At Time:
            </label>

            {times.map((time) => (
                <div key={time.id} className='mb-2'>
                    <input
                        type="time"
                        value={time.value}
                        onChange={(e) => handleTimeChange(time.id, e.target.value)}
                    />

                    {times.length > 1 && (
                        <button
                            className='tab-button tab-secondary-button'
                            onClick={() => handleRemoveTimeField(time.id)}
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}

            <button className='mb-2 tab-button' onClick={handleAddTimeField}>
                Add Time
            </button>
            <br />
            <label className='tab-label'>
                Days:
            </label>

            {Object.keys(dayOfWeekNames).map((day) => (
                <label key={day} className='tab-label'>
                    <input
                        type="checkbox"
                        checked={selectedDays[day]}
                        onChange={() => handleToggleDay(day)}
                    />
                    {dayOfWeekNames[day]}
                </label>
            ))}
            <div className='button-container'>
                <button onClick={handleToggleWeekdays} className='mb-2 tab-button'>Weekdays</button>
                <button onClick={handleToggleWeekends} className='mb-2 tab-button'>Weekends</button>

            </div>

            <button className="mt-2 tab-button" onClick={handleSave}>Save</button>
        </div>
    );
}

export default WeeklyTab;
