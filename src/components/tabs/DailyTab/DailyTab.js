import React, { useState, useEffect } from 'react';
import '../../../App.css';
import { validateTime } from '../../../validators/timeFormValidator';
import { updateUI } from '../../../utils/updateDailyTabState';

function DailyTab({ onSave, cronDailyExpression }) {

    const [times, setTimes] = useState([{ index: 0, value: '10:10' }]);
    const [dataType, setDataType] = useState('time');
    const [step, setStep] = useState(5);

    const [timeErrors, setTimeErrors] = useState([]); 
    const [stepErrors, setStepErrors] = useState([]);
    
    useEffect(() => {
        setTimeErrors(validateTime(times));
    }, [times]);


    useEffect(() => {
        // стоит проверить на undefined
        if (cronDailyExpression) {
            updateUI(
            cronDailyExpression,
            setDataType,
            setStep,
            setTimes
            );
        }
    }, [cronDailyExpression]);


    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        setTimes([{ index: 0, value: getCurrentTime() }]);
    }, []);



    // Изменение выбора типа данных (time/step)
    const handleRadioChange = (type) => {
        setDataType(type);
    };

    // Добавление поля time
    const handleAddTimeInput = () => {
        setTimes((prevTimes) => [
            ...prevTimes,
            { index: prevTimes[prevTimes.length - 1].index + 1, value: '' }
        ])
    };
    // Удаление поля time
    const handleRemoveTimeInput = (index) => {
        setTimes((prevTimes) => prevTimes.filter((time) => time.index !== index));
    };
    // Изменение time
    const handleTimeChange = (index, value) => {
        setTimes((prevTimes) =>
            prevTimes.map((time) =>
                time.index === index ? { ...time, value } : time
            )
        );
    };

    // Изменение Step
    const handleStepChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 0 && value <= 59) {
            setStep(value);
        }
    };



    const handleSave = (event) => {
        event.preventDefault();

        if (dataType === 'time') {

            const validationTimeErrors = validateTime(times);
            console.log('times: ', times)
            console.log('Errors:', validationTimeErrors);
            setTimeErrors(validationTimeErrors || []);

            if (Object.keys(validationTimeErrors).length === 0) {
                const newCronExpression = {
                    minutes: Array.from(new Set(times.map((time) => time.value.split(':')[1]))),
                    hours: Array.from(new Set(times.map((time) => time.value.split(':')[0]))),
                    days: ['*'],
                    months: ['*'],
                    daysOfWeek: ['*']
                }
                onSave(newCronExpression)
                console.log('Submitted times:', times);
            }
        } else if (dataType === 'step') {

            setStepErrors({});
            if (!step) {
                setStepErrors({ index: 0, message: 'The Step value should not be empty.' });
            } else {
                const newCronExpression = {
                    minutes: [`*/${step}`],
                    hours: ['*'],
                    days: ['*'],
                    months: ['*'],
                    daysOfWeek: ['*']
                }
                onSave(newCronExpression || {});
            }
        };
    }


    const renderTimeErrors = (field) => {
        const errorsForTime = timeErrors.filter(error => error.index === field.index);
        return errorsForTime.map((error, errorIndex) => (
            <span key={errorIndex}>{error.message}</span>
        ));
    };


    const renderStepErrors = (fieldIndex) => {
        const errorsForStep = stepErrors.filter(error => error.index === fieldIndex);
        return errorsForStep.map((error, errorIndex) => (
            <span key={errorIndex}>{error.message}</span>
        ));
    };

    return (
        <div className='tab-container'>
            <form onSubmit={handleSave}>
                
                <div>
                    <label>
                        <input
                            type="radio"
                            value={dataType}
                            checked={dataType === 'time'}
                            onChange={() => { handleRadioChange('time') }}
                        />
                        Exact Time
                    </label>


                    <div class="time-container">
                        {times.map((time, index) => (

                            <div key={index}  class="time-item">
                                <label>Time {index + 1}:</label>
                                <input
                                    type="time"
                                    value={time.value}
                                    onChange={({ target: { value } }) => handleTimeChange(time.index, value)}
                                    disabled={dataType !== 'time'}
                                />

                                {times.length > 1 && (
                                    <button
                                        className=''
                                        onClick={() => handleRemoveTimeInput(time.index)}
                                        disabled={dataType !== 'time'}
                                    >
                                        -
                                    </button>
                                )}

                                {timeErrors && timeErrors.length > 0 ? renderTimeErrors(time) : ''}

                            </div>
                        ))}
                    </div>


                    {timeErrors && timeErrors.length > 0 ? renderTimeErrors({ index: -1 }) : ''}





                    <button
                        type="button"
                        onClick={handleAddTimeInput}
                        disabled={dataType !== 'time'}

                    >
                        Add Time
                    </button>

                    <label>
                        <input
                            type="radio"
                            value={dataType}
                            checked={dataType === 'step'}
                            onChange={() => { handleRadioChange('step') }}
                        />
                        Time Step
                    </label>

                    <label>Each:</label>
                    <input
                        className=''
                        type="number"
                        value={step}
                        onChange={handleStepChange}
                        disabled={dataType !== 'step'}
                        min="0"
                        max="59"
                    />
                    <p>
                        minutes
                    </p>



                    {stepErrors && stepErrors.length > 0 ? renderStepErrors(-1) : ''}


                </div>



                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default DailyTab;
