import React, { useState, useEffect } from 'react';

function DailyTab({ onSave }) {
    const [times, setTimes] = useState([{ id: 1, value: '' }]);
    const [useStep, setUseStep] = useState(false);

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

        if (!useStep && !(areHoursEqual || areMinutesEqual)) {
            alert('Часы и/или минуты должны быть одинаковыми.');
            return;
        }

        let cronExpression;

        // Создание выражения CRON 
        if (useStep) {
            cronExpression = `*/${times[0].value} * * * *`
            // Исправить ошибку: при сохранении пустой формы step в вывод передается предзаписанный time. получается (*/12:41 * * * *) 
        } else {
            if (areMinutesEqual) {
                cronExpression = `${times[0].value.split(':')[1]} ${times.map((time) => time.value.split(':')[0]).join(',')}  * * *`;
            } else if (areHoursEqual) {
                cronExpression = `${times.map((time) => time.value.split(':')[1]).join(',')} ${times[0].value.split(':')[0]} * * *`;
            }
            // Исправить ошибку: при введении двух одинаковых time, в поле CRON будет повторяться значение часов (50 14,14 * * * )
        }

        onSave(cronExpression);
    };

    return (
        <div className='mt-4'>
            {/* Первое поле ввода time */}
            <div className='mb-2'>
                <label>
                    <input
                        type='radio'
                        name='inputType'
                        checked={!useStep}
                        onChange={() => setUseStep(false)}
                    />
                    At time:
                </label>

                <input
                    type="time"
                    value={times[0].value}
                    onChange={(e) => handleTimeChange(times[0].id, e.target.value)}
                    disabled={useStep}
                />

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
                            disabled={useStep}
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

            <br />
            <label>
                <input
                    type="radio"
                    name="inputType"
                    checked={useStep}
                    onChange={() => setUseStep(true)}
                />
                Each:
                <input
                    type="number"
                    value={times[0].value}
                    onChange={(e) => handleTimeChange(times[0].id, e.target.value)}
                    disabled={!useStep}
                    min="0"
                    max="59"
                />
                minutes
            </label>

            <br />
            <button className="mt-2" onClick={handleSave}>Save</button>

        </div>
        // Исправить ошибку: перечисление значений часов или минут должны идти в порядке возрастания
        // Исправить ошибку: одинаковые значения времени не должны сохраняться. (16:20 17:20 17:20) сейчас сохраняются как (20 16,17,17 * * *)  
        // Исправить ошибку: при отправке пустой формы в output выдается undefined
        // TODO сократить код. вывод инпута через функцию 
    );
}

export default DailyTab;
