import React, { useState } from 'react';
import TimeInputs from '../TimeInputs/TimeInputs';
import useTimeInput from '../TimeInputs/useTimeInput';


function DailyTab({ onSave }) {
    const [useStep, setUseStep] = useState(false);
    const {
        times,
        handleAddTimeField,
        handleRemoveTimeField,
        handleTimeChange
    } = useTimeInput();



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
            <label>
                <input
                    type='radio'
                    name='inputType'
                    checked={!useStep}
                    onChange={() => setUseStep(false)}
                />
            </label>

            <TimeInputs />


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