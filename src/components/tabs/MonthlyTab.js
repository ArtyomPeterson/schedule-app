import React, { useState, useEffect } from 'react';

const monthNames = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
};


function MonthlyTab({ onSave }) {
    const [times, setTimes] = useState([{ id: 1, value: '' }]);
    const [dayOfMonth, setDayOfMonth] = useState('');
    const [selectedMonths, setSelectedMonths] = useState(
        Object.keys(monthNames).reduce((acc, month) => {
            acc[month] = true;
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

    const handleDayOfMonthChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1 && value <= 31) {
            setDayOfMonth(value);
        }
    };



    const handleMonthToggle = (month) => {
        setSelectedMonths((prevMonths) => ({
            ...prevMonths,
            [month]: !prevMonths[month]
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

        // Проверка на наличие дня месяца
        if (!dayOfMonth) {
            alert('Значение дня месяца не должно быть пустым.');
            return;
        }

        // Проверка на выделение хотя бы одного месяца
        if (!Object.values(selectedMonths).some((value) => value)) {
            alert('Выберите хотя бы один месяц.');
            return;
        }

        // Создание выражения CRON 
        let cronExpression;

        const selectedMonthsArray = Object.entries(selectedMonths)
            .filter(([_, isSelected]) => isSelected)
            .map(([month]) => parseInt(month, 10));

        if (areMinutesEqual) {
            cronExpression = `${times[0].value.split(':')[1]} ${times.map((time) => time.value.split(':')[0]).join(',')} ${dayOfMonth} ${selectedMonthsArray.join(',')} *`;
        } else if (areHoursEqual) {
            cronExpression = `${times.map((time) => time.value.split(':')[1]).join(',')} ${times[0].value.split(':')[0]} ${dayOfMonth} ${selectedMonthsArray.join(',')} *`;
        } else {
            // вывести ошибку
        }
        onSave(cronExpression);

        // + Исправить ошибку: Число месяца должно быть в диапазоне от 1 до 31.
        // + Исправить ошибку: При невыбранном дне месяца пропускается значение CRON.
        // + Исправить ошибку: Ппри невыбранном месяце пропускается значение CRON.


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

            <button className='ml-2 tab-button' onClick={handleAddTimeField}>
                Add Time
            </button>

            <br />

            <label className='tab-label'>
                Day of Month:
            </label>
            <input
                type="number"
                value={dayOfMonth}
                onChange={handleDayOfMonthChange}
                min="1"
                max="31"
            />


            <br />

            <label>
                Select Months:
                <div>
                    {Object.entries(monthNames).map(([monthNumber, monthName]) => (
                        <label key={monthNumber} className='tab-label'>
                            <input type="checkbox" checked={selectedMonths[monthNumber] || false} onChange={() => handleMonthToggle(monthNumber)} />
                            {monthName}
                        </label>
                    ))}
                </div>
            </label>
            <br />
            <button className="mt-2 tab-button" onClick={handleSave}>Save</button>
        </div>
    );
}

export default MonthlyTab;
