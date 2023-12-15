import React, { useState, useEffect } from 'react';
import { validateTime } from '../../../validators/timeFormValidator';
import { validateDayOfMonth } from '../../../validators/dayOfMonthFormValidator';
import { validateMonths } from '../../../validators/monthFormValidator';
import { formatSelectedValues } from '../../common/formatSelectedValues';
import { updateUI } from '../../../utils/updateMonthlyTabState';

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

function MonthlyTab({ onSave, cronMonthlyExpression }) {

    const [times, setTimes] = useState([{ index: 0, value: '' }]);
    const [dayOfMonth, setDayOfMonth] = useState(1);
    const [selectedMonths, setSelectedMonths] = useState({
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true,
        10: true,
        11: true,
        12: true,
    });

    const [timeErrors, setTimeErrors] = useState();
    const [dayOfMonthErrors, setDayOfMonthErrors] = useState();
    const [monthErrors, setMonthErrors] = useState();
    useEffect(() => {
        setTimeErrors(validateTime(times));
    }, [times]);
    useEffect(() => {
        setDayOfMonthErrors(validateDayOfMonth(dayOfMonth));
    }, [dayOfMonth]);
    useEffect(() => {
        setMonthErrors(validateMonths(selectedMonths));
    }, [selectedMonths]);

    useEffect(() => {
        if (cronMonthlyExpression.minutes[0] !== '') {
            updateUI(cronMonthlyExpression,
                setTimes,
                setDayOfMonth,
                setSelectedMonths,
                selectedMonths);
        }
    }, [cronMonthlyExpression]);

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    
    useEffect(() => {
        setTimes([{ index: 0, value: getCurrentTime() }]);
    }, []);



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

    // Изменение day
    const handleDayOfMonthChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setDayOfMonth(value);

        console.log(dayOfMonthErrors);
        // if (!isNaN(value) && value >= 1 && value <= 31) {
        //     setDayOfMonth(value);
        // }
    };

    // Чекбоксы месяцев
    const handleMonthToggle = (month) => {
        setSelectedMonths((prevSelectedMonths) => ({
            ...prevSelectedMonths,
            [month]: !prevSelectedMonths[month]
        }));
        console.log(monthErrors);
    };

    const handleSave = (event) => {
        event.preventDefault();

        console.log("time errors: "+ timeErrors);
        console.log("day of month errors: "+ dayOfMonthErrors);
        console.log("month errors: "+ monthErrors);

        const validationTimeErrors = validateTime(times);
        const validationDayOfMonthErrors = validateDayOfMonth(dayOfMonth);
        const validationMonthErrors = validateMonths(selectedMonths);

        setTimeErrors(validationTimeErrors || []);
        setDayOfMonthErrors(validationDayOfMonthErrors || []);
        setMonthErrors(validationMonthErrors || []);

        if (Object.keys(validationTimeErrors).length === 0 &&
            Object.keys(validationDayOfMonthErrors).length === 0 &&
            Object.keys(validationMonthErrors).length === 0) {

            const selectedMonthsCron = formatSelectedValues(selectedMonths, 'months');
            const newCronExpression = {
                minutes: Array.from(new Set(times.map((time) => time.value.split(':')[1]))),
                hours: Array.from(new Set(times.map((time) => time.value.split(':')[0]))),
                days: [`${dayOfMonth}`],
                months: selectedMonthsCron,
                daysOfWeek: ['*']
            }

            onSave(newCronExpression)

        }
    };

    const renderTimeErrors = (field) => {
        const errorsForTime = timeErrors.filter(error => error.index === field.index);
        return errorsForTime.map((error, errorIndex) => (
            <span key={errorIndex}>{error.message}</span>
        ));
    };

    const renderDayOfMonthErrors = (fieldIndex) => {
        const errorsForDayOfMonth = dayOfMonthErrors.filter(error => error.index === fieldIndex);
        return errorsForDayOfMonth.map((error, errorIndex) => (
            <span key={errorIndex}>{error.message}</span>
        ));
    };

    const renderMonthErrors = (fieldIndex) => {
        const errorsForMonth = monthErrors.filter(error => error.index === fieldIndex);
        return errorsForMonth.map((error, errorIndex) => (
            <span key={errorIndex}>{error.message}</span>
        ));
    };



    return (
        <div className='tab-container'>
            <form onSubmit={handleSave}>

                <div className='time-wrapper'>

                    <div className='time-container'>
                        {times.map((time, index) => (

                            <div key={index} class="time-item">
                                <div className='time-content'>
                                    <label className='time-label'>Time {index + 1}:</label>
                                    <input
                                        className="time-input"
                                        type="time"
                                        value={time.value}
                                        onChange={({ target: { value } }) => handleTimeChange(index, value)}
                                    />

                                    {times.length > 1 && (
                                        <button
                                            className='remove-time-button btn btn-danger'
                                            onClick={() => handleRemoveTimeInput(time.index)}
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
                >
                    <div className='mx-2'>Add Time</div>

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                    </svg>
                </button>



                <div>
                    <label className='mr-2'>Day of Month:</label>
                    <input
                        className='time-input'
                        type="number"
                        value={dayOfMonth}
                        onChange={handleDayOfMonthChange}
                        min="1"
                        max="31"
                    />
                    {dayOfMonthErrors && dayOfMonthErrors.length > 0 ? renderDayOfMonthErrors(-1) : ''}
                </div>




                <label>Months:</label>

                <div>
                    {Object.entries(monthNames).map(([key, name]) => (
                        <div key={key} className="form-check form-switch">
                            <input
                                className="form-check-input"
                                id="flexSwitchCheckDefault"
                                type="checkbox"
                                checked={selectedMonths[key] || false}
                                onChange={() => handleMonthToggle(key)}
                            />
                            <label className="form-check-label" for="flexSwitchCheckDefault">
                                {name}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="mb-2">
                    {monthErrors && monthErrors.length > 0 ? renderMonthErrors(-1) : ''}
                </div>

                <button 
                    className='btn btn-primary' 
                    type="submit"
                    /*disabled={
                        ( timeErrors.length !==0) ||
                        ( dayOfMonthErrors.length !== 0) ||
                        ( monthErrors.lengh !== 0)
                    }*/
                >Save</button>

            </form>

        </div>
    );
}

export default MonthlyTab;
