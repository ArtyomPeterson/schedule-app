import React, { useState, useEffect } from 'react';
import '../../App.css';


function DailyTab({ onSave }) {
    const [times, setTimes] = useState([{ id: 1, value: '' }]);
    const [useStep, setUseStep] = useState(false);
    const [stepValue, setStepValue] = useState(5);


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

    const handleTimeChange = (id, value) => {
        setTimes((prevTimes) =>
            prevTimes.map((time) => (time.id === id ? { ...time, value } : time))
        );
    };

    const handleStepChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 0 && value <= 59) {
            setStepValue(value);
        }
    };

    const handleSave = () => {
        if (useStep) {

            // Логика для Step
            // Проверка на наличие значения step
            if (!stepValue) {
                alert('Значение Step не должно быть пустым.');
                return;
            }
            // Создание выражения CRON 
            const cronExpression = `*/${stepValue} * * * *`;

            onSave(cronExpression);
            return;

        } else {

            // Логика для Time
            // Проверка на отсутствие пустых полей
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

            let cronExpression;


            if (areMinutesEqual) {
                cronExpression = `${times[0].value.split(':')[1]} ${times.map((time) => time.value.split(':')[0]).join(',')} * * *`;
            } else if (areHoursEqual) {
                cronExpression = `${times.map((time) => time.value.split(':')[1]).join(',')} ${times[0].value.split(':')[0]} * * *`;
            } else {
                // вывести ошибку
            }

            onSave(cronExpression);
            return;//return наверное не нужен
        }

    }


    return (
        <div className='tab-container'>
            <input
                type='radio'
                name='inputType'
                checked={!useStep}
                onChange={() => setUseStep(false)}
            />
            <label className='tab-label'>
                At Time:
            </label>

            {times.map((time) => (
                <div key={time.id} className='mb-2'>
                    <input
                        type="time"
                        value={time.value}
                        onChange={(e) => handleTimeChange(time.id, e.target.value)}
                        disabled={useStep}
                    />

                    {times.length > 1 && (
                        <button
                            className='tab-button tab-secondary-button'
                            onClick={() => handleRemoveTimeField(time.id)}
                            disabled={useStep}
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}

            <button className='mb-2 tab-button' onClick={handleAddTimeField} disabled={useStep}>
                Add Time
            </button>

            <br />
            <input
                type="radio"
                name="inputType"
                checked={useStep}
                onChange={() => setUseStep(true)}
            />
            <label className='tab-label'>
                Each:
            </label>
            <input
                type="number"
                value={stepValue}
                onChange={handleStepChange}
                disabled={!useStep}
                min="0"
                max="59"
            />

            minutes
            <br />
            <button className="mt-2 tab-button" onClick={handleSave}>Save</button>

        </div>

        // TODO сократить код. вывод инпута через функцию 
        // Исправить ошибку: перечисление значений часов или минут должны идти в порядке возрастания
    );
}

export default DailyTab;
