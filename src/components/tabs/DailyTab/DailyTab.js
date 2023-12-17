import React, { useState, useEffect } from 'react';
import '../../../App.css';
import { validateTime } from '../../../validators/timeFormValidator';
import { updateUI } from '../../../utils/updateDailyTabState';
import { validateStep } from '../../../validators/stepFormValidator';

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
        setStepErrors(validateStep(step));
    }, [step]);

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
        console.log(stepErrors);
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

            const validationStepErrors = validateStep(step);
            if (Object.keys(validationStepErrors).length === 0) {
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

                    <div className='form-check mb-1'>
                        <input
                            className='form-check-input'
                            type="radio"
                            value={dataType}
                            checked={dataType === 'time'}
                            onChange={() => { handleRadioChange('time') }}
                        />
                        <label className='form-check-label'>
                            Exact Time
                        </label>
                    </div>


                    <div className='time-wrapper'>
                        <div className="time-container">
                            {times.map((time, index) => (

                                <div key={index} className="time-item">

                                    <div className='time-content'>
                                        <label className='time-label'>Time {index + 1}:</label>

                                        <input
                                            className="time-input"
                                            type="time"
                                            value={time.value}
                                            onChange={({ target: { value } }) => handleTimeChange(time.index, value)}
                                            disabled={dataType !== 'time'}
                                        />



                                        {times.length > 1 && (

                                            <button
                                                className='remove-time-button btn btn-danger'
                                                onClick={() => handleRemoveTimeInput(time.index)}
                                                disabled={dataType !== 'time'}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                                </svg>
                                            </button>


                                        )}
                                    </div>

                                    <div className="error-container">
                                        {timeErrors && timeErrors.length > 0 ? renderTimeErrors(time) : ''}
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>

                    <div className="mb-2">

                    {timeErrors && timeErrors.length > 0 ? renderTimeErrors({ index: -1 }) : ''}

                    </div>





                    <button
                        className='add-time-button btn btn-success'
                        type="button"
                        onClick={handleAddTimeInput}
                        disabled={dataType !== 'time'}

                    >
                        <div className='mx-2'>Add Time</div>

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                        </svg>
                    </button>
                    <div className='form-check mb-1'>
                        <input
                            className='form-check-input'
                            type="radio"
                            value={dataType}
                            checked={dataType === 'step'}
                            onChange={() => { handleRadioChange('step') }}
                        />
                        <label className='form-check-label'>
                            Time Step
                        </label>
                    </div>

                    <div className='time-content'>
                        <label className='time-label'>Each:</label>
                        <input
                            className='time-input'
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
                    </div>

                    <div className="mb-2">
                    {stepErrors && stepErrors.length > 0 ? renderStepErrors(0) : ''}
                    </div>


                </div>



                <button
                    type="submit"
                    className='btn btn-primary'
                    disabled={
                        (dataType === 'time' && timeErrors && timeErrors.length !== 0) ||
                        (dataType === 'step' && stepErrors && stepErrors.length !== 0)
                    }

                >Submit</button>
            </form>
        </div>
    );
}

export default DailyTab;
